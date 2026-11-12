CREATE OR REPLACE PROCEDURE "THJS"."P_FXQ_INTERFACE_LOG_S"("I_TYPE" IN VARCHAR2(32767),"I_ENTNAME" IN VARCHAR2(32767),"I_KEY" IN VARCHAR2(32767),"I_PROJ_TYPE" IN VARCHAR2(32767),"I_USERCODE" IN VARCHAR2(32767),"O_RETURN_MSG" OUT VARCHAR2(32767),"O_RETURN_CODE" OUT INTEGER)
AUTHID DEFINER
 is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190731
  --模块编号：
  --模块名称：反洗钱客户管理 - 投行智能平台反洗钱查询调用回调日志
  --功能名称：
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_fxq_interface_log_s'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_count integer default 0;
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  insert into thjs.tb_exec_log
    (log_id, proc_name, proc_param, exec_time)
  values
    (thjs.tb_exec_log_id_seq.nextval,
     'p_fxq_interface_log_s',
     'type:' || i_type || ',entname:' || i_entname || ',key:' || i_key ||
     ',proj_type:' || i_proj_type || ',usercode:' || i_usercode,
     sysdate);
  commit;

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  --20240524  i_entname 可按冒号:分隔客户名称，证件代码传递

  --回调前验证客户是否存在
  if i_type = '1' and i_entname is not null then
    select count(1)
      into v_count
      from (select t.client_id as cust_id,
      			   t.client_name as cust_name,
      			   t.id_no as cert_no,
      			   decode(t.organ_flag,'0','1','0') as cust_type
      		  from thjs.t_th_client_info t
      		/*select r.cust_id, r.cust_name, r.cert_no, '0' as cust_type
              from thjs.tb_fxq_cust_rz r
             where r.cust_biz <> '测试'
            union all
            select z.cust_id, z.cust_name, z.cert_no, '1' as cust_type
              from thjs.tb_fxq_cust_zr z
             where z.cust_biz <> '测试'*/) r
     where exists (select column_value
              from table(thjs.splitstr(i_entname, ':')) t
             where column_value = r.cert_no
                or column_value = r.cust_name);
  
    if v_count = 0 then
      o_return_msg  := '客户不存在！';
      o_return_code := -1;
      return;
    end if;
  
  end if;

  insert into thjs.tb_fxq_interface_log
    (log_key, log_type, entname, proj_type, user_code, log_time)
  values
    (i_key, i_type, i_entname, i_proj_type， i_usercode, sysdate);

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
