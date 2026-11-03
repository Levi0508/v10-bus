Create or Replace procedure "THJS"."P_PROJLIST_REMIND_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                     i_username    in varchar2, --登录人
                                                     o_return_msg  out varchar2,
                                                     o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20191216
  --模块编号：
  --模块名称：清单管理 - 清单提醒查询
  --功能名称：清单提醒查询
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_projlist_remind_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_test_user varchar2(200);
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  insert into thjs.tb_exec_log
    (log_id, proc_name, proc_param, exec_time)
  values
    (thjs.tb_exec_log_id_seq.nextval,
     'p_projlist_remind_q',
     'i_username:' || i_username,
     sysdate);
  commit;

  v_test_user := 'admin,chenzhenkuan,zhangqilong';

  --查询当前登录人作为项目负责人的最新清单提醒
  open rt_cursor for
    select l.remind_flag, --提醒周期标识 1-15日前三交易日 2-月底前三交易日
           l.remind_date, --提醒日期
           l.user_code, --用户代码
           l.user_name, --用户名称
           l.proj_num, --项目数
           l.begin_date, --确认区间起始日期
           l.end_date, --确认区间结束日期
           l.reimind_id --记录主键
      from (select row_number() over(partition by l.user_code order by l.remind_date desc, l.op_time desc) as rn,
                   l.*
              from thjs.tb_projlist_remind_log l
             where (l.user_code = i_username or
                   (instr(v_test_user, i_username) > 0 and
                   l.user_code = 'jiangjie006818')) --admin同蒋杰，项目数最多
            /*and not exists (select 1
             from thjs.tb_projlist_remind_log c --当前周期不存在已经确认过的记录
            where c.remind_flag = l.remind_flag
              and c.user_code = l.user_code
              and c.begin_date = l.begin_date
              and c.end_date = l.end_date
              and c.confirm_flag = '1')*/
            ) l
     where l.rn = 1;

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