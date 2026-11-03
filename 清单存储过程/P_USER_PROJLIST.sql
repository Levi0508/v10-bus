Create or Replace procedure "THJS"."P_USER_PROJLIST" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                 i_username    in varchar2,
                                                 i_projname    in varchar2,
                                                 i_khname      in varchar2,
                                                 o_return_msg  out varchar2,
                                                 o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190426
  --模块编号：
  --模块名称：投行信息查询 - 业务人员项目列表查询
  --功能名称：业务人员项目列表查询
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_user_projlist'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_superuser  integer default 0;
  v_user_pcode varchar2(100);
  --v_ccode      varchar2(100);
  v_pcode varchar2(100);
  --v_isleaf     integer default 0;

  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  --判断是否超级用户
  select count(1)
    into v_superuser
    from table(thjs.splitstr('admin,zhangqilong', ',')) t
   where instr(',' || t.column_value || ',', ',' || i_username || ',') > 0;

  delete from thjs.TMP_USER_PROJID;
  commit;
  --获取用户所在组
  if v_superuser = 0 then
    /*select t.p_code
     into v_user_pcode
     from thjs.vw_userinfo_tree t
    where t.ccode = i_username;*/
  
    insert into thjs.TMP_USER_PROJID
      (projid)
      select t.proj_id
        from THJS.IB_V_FINANCE_PROJMEMBER t
       inner join thjs.ib_v_gtja_empname e
          on e.workno = t.workno
       where e.emp_name = i_username
         and t.projrole = '项目负责人'; --只有项目负责人可以进行清单填报
    /*where exists (select *
     from thjs.vw_userinfo_tree_root r
    where r.root_code = v_user_pcode
      and r.ccode = e.username);*/
  
  end if;

  if v_superuser = 0 then
  
    --非超级用户 根据登录用户 显示用户及用户所属组权限项目   
    open rt_cursor for
        select t.projid as proj_id, 
          t.projname, 
          t.khname  
     from thjs.tb_ib_cust_info t
--left join( select a.projid, 
--                       a.check_id, 
--                       a.update_time,
--                       row_number()over( 
--                           partition by a.projid 
--                               order by a.update_time desc) as rn
--                  from thjs.TB_PROJLIST_CHECK_RESULT a )a
--       on t.projid=a.projid
--      and a.rn=1
--left join (select b.projid, 
--                   b.check_id, 
--                   sum(decode(b.check_result, 
--                                       '0',0,1)) as check_result_sum
--              from thjs.TB_PROJLIST_CHECK_RESULT b
--          group by b.projid, 
--                   b.check_id)b
--       on t.projid=b.projid
--      and a.check_id=b.check_id
    where (i_projname is null 
                 or instr(t.projname, i_projname) > 0)
      and (i_khname is null 
                 or instr(t.khname, i_khname) > 0)
      and t.projid in (select t.projid from thjs.TMP_USER_PROJID t) --用户相关， 用户所在上级下属所有
;
  else
  
    --超级用户根据所选择用户组或用户 查询
    open rt_cursor for
         select t.projid as proj_id, 
          t.projname, 
          t.khname 
     from thjs.tb_ib_cust_info t 
    where (i_projname is null 
                 or instr(t.projname, i_projname) > 0)
      and (i_khname is null 
                 or instr(t.khname, i_khname) > 0) --超级用户查询所选节点，管理人员权限待确定
;
  end if;

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