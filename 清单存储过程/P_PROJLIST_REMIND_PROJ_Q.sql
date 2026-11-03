Create or Replace procedure "THJS"."P_PROJLIST_REMIND_PROJ_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                          i_remind_id   in varchar2,
                                                          i_proj_status in varchar2, --根据清单项目状态分别查询。0-无出入单状态的项目/ro-入观察/rl-入限制 v101+
                                                          i_username    in varchar2, --登录人
                                                          o_return_msg  out varchar2,
                                                          o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20191210
  --模块编号：
  --模块名称：清单管理 - 清单提醒项目明细查询
  --功能名称：清单提醒项目明细查询
  ----------------------------------------------------------------------------------
  --v101 YLT@GTJA 20200602 
  
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_projlist_remind_proj_q'; -- 任务名称(存储过程的名字)
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

  --查询当前登录人作为项目负责人的最新清单提醒项目信息
  open rt_cursor for
    select p.reimind_id, --提醒ID
           p.remind_date, --提醒日期
           p.cust_name, --客户名称
           p.proj_id, --项目编号
           p.proj_name, --项目名称
           c.projtype, --项目类型
           p.user_code, --负责人
           p.user_name, --负责人姓名
           p.projlist_status, --清单状态
           p.inout_date --入单日期
           ,nvl(p.confirm_flag, 0) as confirm_flag --确认标识 0-未操作 1-已确认无变化 2-已编辑 v101+
      from thjs.tb_projlist_remind_proj p
      left join thjs.tb_ib_cust_info c
        on c.projid = p.proj_id
     where p.reimind_id = i_remind_id
     --v101+ start
     and (i_proj_status is null or
           p.projlist_status in
           (select regexp_substr(i_proj_status, '[^,]+', 1, level)
               from dual
             connect by regexp_substr(i_proj_status, '[^,]+', 1, level) is not null))
     order by p.projlist_status;
     --v101+ end

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