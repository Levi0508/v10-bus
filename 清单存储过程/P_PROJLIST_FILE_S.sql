Create or Replace procedure "THJS"."P_PROJLIST_FILE_S" (i_projid      in varchar2, --项目id
                                                   i_batch_id    in varchar2, --清单填报批次ID
                                                   i_inout_id    in varchar2, --清单出入单ID
                                                   i_filepath    in varchar2, --清单附件
                                                   i_usercode    in varchar2, --操作员
                                                   o_return_msg  out varchar2,
                                                   o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20240129
  --模块编号：
  --模块名称：清单管理 - 清单附件信息补充上传
  --功能名称：清单填报页面信息保存
  ----------------------------------------------------------------------------------

  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_projlist_file_s'; -- 任务名称(存储过程的名字)
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
     i_projid || ',' || i_batch_id || ',' || i_inout_id || ',' ||
     i_filepath || ',' || i_usercode,
     sysdate);
  commit;

  --非填报操作外，直接修改操作存历史，附件补充
  insert into thjs.tb_projlist_inout_his
    (busidate,
     batch_id,
     inout_id,
     projid,
     inout_type,
     inout_direct,
     fill_date,
     inout_date,
     inout_reason,
     inout_remark,
     filepath,
     inout_user,
     inout_status,
     update_user,
     update_time,
     create_time,
     debug_info,
     his_type,
     his_id,
     his_time)
    select t.busidate,
           t.batch_id,
           t.inout_id,
           t.projid,
           t.inout_type,
           t.inout_direct,
           t.fill_date,
           t.inout_date,
           t.inout_reason,
           t.inout_remark,
           t.filepath,
           t.inout_user,
           t.inout_status,
           t.update_user,
           t.update_time,
           t.create_time,
           t.debug_info,
           '附件补充' as his_type,
           sys_guid,
           sysdate
      from thjs.tb_projlist_inout t
     where t.projid = i_projid
       and t.batch_id = i_batch_id
       and t.inout_id = i_inout_id;

  update thjs.tb_projlist_inout t
     set t.filepath    = i_filepath,
         t.update_user = i_usercode,
         t.update_time = sysdate
   where t.projid = i_projid
     and t.batch_id = i_batch_id
     and t.inout_id = i_inout_id;

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