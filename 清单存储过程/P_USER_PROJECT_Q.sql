CREATE OR REPLACE PROCEDURE "THJS"."P_USER_PROJECT_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                  i_username    in varchar2,
                                                  i_projname    in varchar2,
                                                  i_khname      in varchar2,
                                                  i_userpath    in varchar2, --业务组路径 //AAA/BBB/ccc
                                                  i_page_num    in number default 0, --默认值0,
                                                  i_page_size   in number default 0, --默认值0  如果i_page_num，i_page_size都为0 则不分页，查询全部
                                                  i_order in char,
                                                  o_total_count out integer,
                                                  o_return_msg  out varchar2,
                                                  o_return_code out integer)
AS
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190323
  --模块编号：
  --模块名称：投行信息查询 - 业务人员项目查询
  --功能名称：业务人员项目查询
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_user_project_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_page_num   number default 0;
  v_page_size  number;
  v_superuser  integer default 0;
  v_user_pcode varchar2(100);
  --v_ccode      varchar2(100);
  v_pcode    varchar2(100);
  v_userpath varchar2(1000);

  --=============================================================
  -- 业务处理过程
  v_order	varchar2(500);
  v_sql	    varchar2(32767);
  --=============================================================
BEGIN
  dbms_output.enable();

  v_tradedate := to_char(sysdate, 'yyyyMMdd');
  /*insert into thjs.tb_test
    (id, text)
  values
    (99, i_username || '-' || i_projname || '-' || i_khname);*/
  --insert into thjs.tb_test (id, text) values (99, i_userpath);

  /**********************************************************
  只有投行业务人员（全局人员） 拥有部门查询条件
  部门查询条件，作用于项目客户表部门数据列
  
  非上述人员，隐藏部门查询条件，只查询与自己相关的项目信息
  20201022- thhgz（投行合规组）及flhgb（法律合规部）具有所有项目查询权限
  ***********************************************************/

  v_userpath := i_userpath;

  --判断是否超级用户及开发人员
  select count(1)
    into v_superuser
    from (select to_char(u.user_name) as user_name
            from basic_thjs.wb_user_role r
            left join basic_thjs.wb_user u
              on  u.sid= r.user_id
           where r.role_id in ('thhgz', 'flhgb')
          union all
          select column_value
            from table(thjs.splitstr('admin,zhangqilong,yangluting,zhangyongyong,chenhaiyang,hechuan',
                                         ','))) t
   where instr(',' || t.user_name || ',', ',' || i_username || ',') > 0;

  delete from thjs.TMP_USER_PROJID;
  commit;

  --获取用户所在组
  if v_superuser = 0 then
  
    select nvl(t.p_code, '')
      into v_user_pcode
      from dual
      left join thjs.vw_userinfo_tree t
        on t.ccode = i_username;
  
    insert into thjs.TMP_USER_PROJID
      (projid)
      select t.proj_id
        from THJS.IB_V_FINANCE_PROJMEMBER t
       inner join thjs.ib_v_gtja_empname e
          on e.workno = t.workno
       where e.username = i_username;
    
    --20260617 thjs.ib_v_gtja_empname表部分user_name不在basic_thjs.wb_user表中
    insert into thjs.TMP_USER_PROJID
      (projid)
      select t.proj_id
        from THJS.IB_V_FINANCE_PROJMEMBER t
       inner join thjs.ib_v_gtja_empname e
          on e.workno = t.workno
       inner join basic_thjs.wb_user a
          on e.workno = a.user_id
       where a.user_name = i_username
         and not exists (select 1
         				   from basic_thjs.wb_user b
         				  where e.username = b.user_name);
  
  else
    --超级用户或者全局人員 获取用户组选择项
    if v_userpath is not null then
    
      select substr(i_userpath, instr(i_userpath, '/', -1) + 1)
        into v_pcode
        from dual;
    
      if v_pcode is null then
        v_userpath := null;
      else
      
        insert into thjs.TMP_USER_PROJID
          (projid)
          select c.projid
            from thjs.tb_ib_cust_info c
           where c.pro_is_valid = '1'
             and exists (select 1
                    from (select t.CCODE, t.CNAME, t.P_CODE
                            from THJS.VW_CUST_INFO_TREE t
                           start with t.ccode = v_pcode
                          connect by prior t.CCODE = t.P_CODE) t
                   where t.CNAME = c.deptmananame);
      
      end if;
    end if;
  
  end if;

  if i_page_num is not null then
    v_page_num := i_page_num;
  end if;

  --统计记录条数
  if v_page_num < 1 then
  
    if v_superuser = 0 then
      select count(1)
        into o_total_count
        from thjs.tb_ib_cust_info t
       where t.pro_is_valid = '1'
         and (i_projname is null or instr(t.projname, i_projname) > 0)
         and (i_khname is null or instr(t.khname, i_khname) > 0)
         and t.projid in (select t.projid from thjs.TMP_USER_PROJID t) --用户相关， 用户所在上级下属所有
      ;
    
    else
      select count(1)
        into o_total_count
        from thjs.tb_ib_cust_info t
       where t.pro_is_valid = '1'
         and (i_projname is null or instr(t.projname, i_projname) > 0)
         and (i_khname is null or instr(t.khname, i_khname) > 0)
         and (v_userpath is null or
             t.projid in (select t.projid from thjs.TMP_USER_PROJID t)) --超级用户查询所选节点，管理人员权限待确定                         
      ;
    end if;
  
  end if;

  if i_page_size is not null and i_page_size <> 0 then
    v_page_size := i_page_size;
  else
    v_page_size := o_total_count;
  end if;
  
  if i_order is null or trim(i_order)='' then
    v_order := ' order by update_time';
  else
    v_order := ' ' || i_order;
  end if;

  if v_superuser = 0 then
  
    --非超级用户 根据登录用户 显示用户及用户所属组权限项目   
    delete from thjs.t_user_project_u_tmp;
    v_sql := 'insert into thjs.t_user_project_u_tmp
      select b.proj_id,
             b.projname,
             b.projrole,
             b.workno,
             b.empname,
             b.username,
             b.khname,
             b.khxycode,
             b.projtype,
             b.projphase,
             b.islx,
             b.deptmananame,
             b.deptmanamobile,
             b.deptname,
             b.pripid,
             b.entname,
             b.stockcode,
             b.stockname,
             b.rn
        from (select a.*, row_number() over(partition by null '|| v_order || ') as rn
                from (select t.projid as proj_id,
                             t.projname,
                             coalesce(p.projrole, ''权限用户'') as projrole,
                             p.workno,
                             p.empname,
                             u.username,
                             t.khname,
                             t.khxycode,
                             t.projtype,
                             t.projphase,
                             t.islx,
                             t.deptmananame,
                             t.deptmanamobile,
                             t.deptname,
                             t.pripid,
                             t.entname,
                             t.stockcode,
                             t.stockname,
                             t.update_time
                        from thjs.tb_ib_cust_info t
                        left join thjs.ib_v_gtja_empname u
                          on u.username = '''||i_username||''' 
                        left join thjs.ib_v_finance_projmember p
                          on p.proj_id = t.projid
                         and p.workno = u.workno
                        left join basic_thjs.wb_user a
                          on u.workno = a.user_id
                         and a.user_name = '''||i_username||'''
                       where t.pro_is_valid = ''1''
                         and (u.username is not null or a.user_name is not null)
                         and ('''||i_projname||''' is null or
                             instr(t.projname, '''||i_projname||''') > 0)
                         and ('''||i_khname||''' is null or
                             instr(t.khname, '''||i_khname||''') > 0)
                         and t.projid in
                             (select t.projid from thjs.TMP_USER_PROJID t) --用户相关， 用户所在上级下属所有
                      
                      ) a) b';
    execute immediate v_sql;        
    open rt_cursor for
      select r.*
        from thjs.t_user_project_u_tmp r
       where r.rn > v_page_num
         and r.rn <= v_page_num + v_page_size
       order by r.rn;
  
  else
  
    --超级用户根据所选择用户组或用户 查询
    delete from thjs.t_user_project_u_tmp;
    v_sql := 'insert into thjs.t_user_project_u_tmp
      select b.proj_id,
             b.projname,
             b.projrole,
             b.workno,
             b.empname,
             b.username,
             b.khname,
             b.khxycode,
             b.projtype,
             b.projphase,
             b.islx,
             b.deptmananame,
             b.deptmanamobile,
             b.deptname,
             b.pripid,
             b.entname,
             b.stockcode,
             b.stockname,
             b.rn
        from (select a.*, row_number() over(partition by null '|| v_order || ') as rn
                from (select distinct t.projid as proj_id,
                                      t.projname,
                                      ''超级用户'' as projrole,
                                      '''' as workno,
                                      '''' as empname,
                                      '''||i_username||''' as username,
                                      t.khname,
                                      t.khxycode,
                                      t.projtype,
                                      t.projphase,
                                      t.islx,
                                      t.deptmananame,
                                      t.deptmanamobile,
                                      t.deptname,
                                      t.pripid,
                                      t.entname,
                                      t.stockcode,
                                      t.stockname,
                                      t.update_time
                        from thjs.tb_ib_cust_info t
                       where t.pro_is_valid = ''1''
                         and ('''||i_projname||''' is null or
                             instr(t.projname, '''||i_projname||''') > 0)
                         and ('''||i_khname||''' is null or
                             instr(t.khname, '''||i_khname||''') > 0)
                         and ('''||v_userpath||''' is null or
                             t.projid in
                             (select t.projid from thjs.TMP_USER_PROJID t)) --超级用户查询所选节点，管理人员权限待确定                             
                      ) a) b';
    
  dbms_output.put_line(v_sql);
    execute immediate v_sql;                  
                      
    open rt_cursor for
      select r.*
        from thjs.t_user_project_u_tmp r
       where r.rn > v_page_num
         and r.rn <= v_page_num + v_page_size
       order by r.rn;
  
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