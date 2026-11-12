CREATE OR REPLACE PROCEDURE "THJS"."P_FXQ_CUST_PROJ_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                   i_client_id     in integer, --客户id
                                                   i_client_name   in varchar2, --客户名称
                                                   i_usercode    in varchar2, --查询人
                                                   o_return_msg  out varchar2,
                                                   o_return_code out integer)
AS
  --版    权：gtja
  --版    本：1.0.0
  --开发人员：ylt@gtja
  --创建日期：20201104
  --模块编号：
  --模块名称：投行反洗钱 - 客户基本信息（融资端）填报增删改，将客户置为“失效”时，核查该客户关联的项目
  --功能名称：
  ----------------------------------------------------------------------------------
  --v101 ylt@gtja 20201207 项目状态为‘有效’对应逻辑修改

  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_fxq_cust_proj_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_count    number; --用于记录返回的项目数量
  v_projname varchar2(2000);
  --=============================================================
  -- 业务处理过程
  --=============================================================

BEGIN

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  insert into thjs.tb_exec_log
    (log_id, proc_name, proc_param, exec_time)
  values
    (thjs.tb_exec_log_id_seq.nextval,
     'p_fxq_cust_proj_q',
     'i_cust_id:' || i_client_id || ' -' || 'i_cust_name:' || i_client_name ||
     'i_usercode:' || i_usercode,
     sysdate);
  commit;

  select t.cn, t.projnames
    into v_count, v_projname
    from thjs.vw_fxq_cust_proj t --多处使用，抽象为视图
   where t.client_id = i_client_id
      or t.client_name = i_client_name;
  /*from thjs.tb_ib_cust_info proj, thjs.tb_fxq_cust_rz t
  where proj.khname = t.cust_name
       --and proj.pro_is_valid = '1' --项目状态为有效的 v101-
       --v101+ start
    and (proj.pro_status not in ('终止', '冻结', '完成') or
        proj.projphase not in ('项目终止', '项目完成', '兑付完成'))
    and proj.pro_is_valid = '1'
       --v101+ end
    and t.cust_name = i_cust_name
    and exists (select *
           from thjs.tb_projlist_busitype b
          where b.proj_type = proj.projtype
            and b.is_limit_fxq = '1') --只判断作用于反洗钱限制的项目类型*/

  if v_count > 0 then
    open rt_cursor for
      select '该客户关联'||cn||'个项目，请核查！' || chr(13) || reason /*v_projname*/ message
        from (select t.client_id,
                     t.client_name,
                     t.id_no,
                      count(1) as cn,
                     --wm_concat('<br>'||p.projname||p.projphase||'/'||p.pro_status||'/阶段和状态不符合失效条件,请联系: 信息管理员-'||tt1.i||'/项目负责人-'||tt1.r||'/团队负责人-'||tt1.z||' 处理') as reason
               	     --wm_concat('<br>"'||p.projname||'" 工作室状态为'||p.pro_status||', 阶段为'||p.projphase||', 不符合失效条件,请联系: 信息管理员-'||tt1.i||'/项目负责人-'||tt1.r||'/团队负责人-'||tt1.z||' 处理') as reason
               	     wm_concat ('<br>"'||p.projname||
					case  when p.pro_status NOT in ('冻结','终止', '完成') then 
					'" 工作室状态为'||p.pro_status
					else   ''
					end||
					case when p.projphase NOT in ('项目终止', '项目完成', '兑付完成') then 
					', 阶段为'||p.projphase
					else ''
					end
					||', 不符合失效条件,请联系: 信息管理员-'||tt1.i||'/项目负责人-'||tt1.r||'/团队负责人-'||tt1.z||' 处理') as reason
               from thjs.tb_ib_cust_info p
              inner join thjs.t_th_client_info t
                 ON replace(REPLACE(p.khname,'(','（'),')','）')=t.client_name
               LEFT join(SELECT t.PROJ_ID,max(CASE WHEN PROJROLE='项目负责人' THEN vals end) AS r,
    max(CASE WHEN PROJROLE='信息管理员' THEN vals end) AS i,
    max(CASE WHEN PROJROLE='业务组长' THEN vals end) AS z 
   from (SELECT m.PROJ_ID,m.PROJROLE,LISTAGG(m.EMPNAME||'('||m.WORKNO||')',',') WITHIN group(ORDER BY 1) AS vals
   FROM thjs.TB_IB_V_FINANCE_PROJMEMBER m
          GROUP BY m.PROJ_ID,m.PROJROLE)t 
  GROUP BY t.proj_id)tt1
 ON p.PROJID=tt1.PROJ_ID
              where (
                     p.pro_status not in ('冻结') AND 
                    (p.pro_status not in ('终止', '完成') or
                    p.projphase not in ('项目终止', '项目完成', '兑付完成')))
                and p.pro_is_valid = '1'
                and exists (select *
                       from thjs.tb_projlist_busitype b
                      where b.proj_type = p.projtype
                        and b.is_limit_fxq = '1')
              group by t.client_id, t.client_name, t.id_no) p 
   WHERE p.client_id in(SELECT client_id FROM thjs.vw_fxq_cust_info t WHERE t.client_id = i_client_id or t.client_name = i_client_name);
  else
    open rt_cursor for
      select '' message from dual;
  end if;

  o_return_msg  := '执行成功';
  o_return_code := 0;

exception
  -- 非预定义异常处理
  when v_userexp then
    rollback;
  
    v_sqlerrm := sqlerrm;
    v_sqlcode := sqlcode;
    v_sqlerrl := dbms_utility.format_error_backtrace();
  
    thjs.p_write_error_log(i_tradedate    => v_tradedate,
                            i_exec_func_id => v_exec_func_id,
                            i_func_own     => v_func_own,
                            i_func_name    => v_func_name,
                            i_occur_time   => sysdate,
                            i_sqlerrm      => v_sqlerrm,
                            i_sqlcode      => v_sqlcode,
                            i_sqlerrl      => v_sqlerrl);
    commit;
    raise;
    -- 预定义异常处理
  when others then
    rollback;
  
    v_sqlerrm := sqlerrm;
    v_sqlcode := sqlcode;
    v_sqlerrl := dbms_utility.format_error_backtrace();
  
    thjs.p_write_error_log(i_tradedate    => v_tradedate,
                            i_exec_func_id => v_exec_func_id,
                            i_func_own     => v_func_own,
                            i_func_name    => v_func_name,
                            i_occur_time   => sysdate,
                            i_sqlerrm      => v_sqlerrm,
                            i_sqlcode      => v_sqlcode,
                            i_sqlerrl      => v_sqlerrl);
    commit;
    raise;

END;
