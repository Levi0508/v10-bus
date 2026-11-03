Create or Replace procedure "THJS"."P_PROJLIST_FILE_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                   i_projid      in varchar2,
                                                   i_usercode    in varchar2, --查询用户
                                                   o_return_msg  out varchar2,
                                                   o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20240129
  --模块编号：
  --模块名称：清单管理 - 清单填报附件信息查询
  --功能名称：清单填报 - 附件补充填报
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_projlist_file_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  insert into thjs.tb_exec_log
    (log_id, proc_name, proc_param, exec_time)
  values
    (thjs.tb_exec_log_id_seq.nextval,
     v_func_name,
     'i_projid:' || i_projid || ' -' || 'i_usercode:' || i_usercode,
     sysdate);
  commit;

  --返回项目清单填报所有附件信息

  open rt_cursor for
    select x.busidate, --业务日期
           x.projid, --项目ID（隐藏）
           x.batch_id, --批次ID（隐藏）
           '批次' || b.batch_num as batch_desc, --批次
           x.inout_id, --出入单ID（隐藏）      
           decode(x.inout_direct || x.inout_type,
                  'io',
                  '入观察期',
                  'oo',
                  '出观察期',
                  'il',
                  '入限制期',
                  'ol',
                  '出限制期',
                  'iq',
                  '入静默期',
                  'oq',
                  '出静默期') as inout_desc, --出入单阶段描述
           x.filepath, --文件路径（隐藏，下载使用）
           substr(x.filepath, instr(x.filepath, '/', -1) + 1) as file_name, --文件名称
           x.update_user, --操作人
           nvl(u.display_name,uu.display_name) as update_user_name,
           x.update_time --操作时间
      from thjs.tb_projlist_inout x
      left join (select row_number() over(partition by t.projid order by t.batch_time) as batch_num,
                        t.*
                   from (select min(t.create_time) as batch_time,
                                t.projid,
                                t.batch_id
                           from THJS.TB_PROJLIST_INOUT t
                          group by t.projid, t.batch_id) t) b
        on b.projid = x.projid
       and b.batch_id = x.batch_id
      left join basic_thjs.wb_user u
        on x.update_user = u.user_name
      left join basic_thjs.wb_user_hg uu
        on x.update_user = uu.user_name
     where x.projid = i_projid
       and x.inout_status = '1'
       --and x.filepath is not null
     order by x.inout_date,decode(x.inout_type,'o',1,'l',2,'q',3);

  commit;

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
end;