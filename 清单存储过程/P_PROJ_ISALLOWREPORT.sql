Create or Replace PROCEDURE "THJS"."P_PROJ_ISALLOWREPORT" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                      i_proj_id     in varchar2,
                                                      i_proj_type   in varchar2,
                                                      i_username    in varchar2,
                                                      o_return_msg  out varchar2,
                                                      o_return_code out integer) is

  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：YLT@GTJA
  --创建日期：20200825
  --模块编号：
  --模块名称：投行系统-清单管理 清单变更校验项目类型
  --功能名称：清单变更校验项目类型
  ----------------------------------------------------------------------------------
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_proj_isallowreport'; -- 任务名称(存储过程的名字)
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

  --清单变更前，先校验该清单对应的业务类型是否允许 清单填报
  if i_proj_type is null then
    open rt_cursor for
      select '0' is_allow_report,
             '此项目类型无需填报项目清单' as error_info
        from dual;
  elsif i_proj_type is not null and i_proj_type <> '债券融资_可交换债' then
    open rt_cursor for
      select t.is_allow_report, --是否允许填报清单(0-否/1-是) 
             decode(t.is_allow_report,
                    '0',
                    '此项目类型无需填报项目清单',
                    '-') as error_info
        from thjs.tb_projlist_busitype t
       where t.proj_type = i_proj_type;
  elsif i_proj_type is not null and i_proj_type = '债券融资_可交换债' then
    open rt_cursor for
      select case
               when (m.stock_code is not null or m.is_listed = 1) and
                    t.is_allow_report = 1 then
                '1'
               else
                '0'
             end is_allow_report,
             case
               when (m.stock_code is not null or m.is_listed = 1) and
                    t.is_allow_report = 1 then
                '-'
               else
                '非上市公司“债券融资_可交换债”无需填报项目清单'
             end error_info
        from thjs.tb_ib_cust_info      p,
             thjs.tb_projlist_busitype t,
             thjs.pty_main_info       m
       where t.proj_type = p.projtype
         and p.pripid = m.prip_id
         and p.projid = i_proj_id
         and t.proj_type = i_proj_type
         and t.proj_type = '债券融资_可交换债';
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
end;