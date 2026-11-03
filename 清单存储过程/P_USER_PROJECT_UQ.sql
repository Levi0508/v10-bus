Create or Replace procedure "THJS"."P_USER_PROJECT_UQ" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                   i_username    in varchar2,
                                                   i_projname    in varchar2,
                                                   i_khname      in varchar2,
                                                   i_busi_type   in varchar2,
                                                   i_page_num    in number default 0, --默认值0,
                                                   i_page_size   in number default 0, --默认值0  如果i_page_num，i_page_size都为0 则不分页，查询全部
                                                   i_order 		 in char,
                                                   o_total_count out integer,
                                                   o_return_msg  out varchar2,
                                                   o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190705
  --模块编号：
  --模块名称：投行信息查询 - 业务人员项目查询 我的项目
  --功能名称：业务人员项目查询
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_user_project_uq'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_page_num  number default 0;
  v_page_size number;
  v_superuser integer default 0;
  --=============================================================
  -- 业务处理过程
  v_order	  varchar2(500);
  v_sql       varchar2(32767);
  --=============================================================

begin
  dbms_output.enable();

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  /*insert into thjs.tb_test
    (id, text)
  values
    (99, i_username || '-' || i_projname || '-' || i_khname);*/

  --判断是否超级用户及开发人员
  select count(1)
    into v_superuser
    from table(thjs.splitstr('admin,yangluting,zhangyongyong,huangzhichang,chenhaiyang,hechuan', ',')) t
   where instr(',' || t.column_value || ',', ',' || i_username || ',') > 0;

  if i_page_num is not null then
    v_page_num := i_page_num;
  end if;

  --统计记录条数
  if v_page_num < 1 then
  
    select count(1)
      into o_total_count
      from thjs.tb_ib_cust_info t
     inner join thjs.ib_v_finance_projmember p
        on p.proj_id = t.projid
   --  inner join thjs.ib_v_gtja_empname u
    inner join ehr01.tcl_v_emp_info_hgfk u
        on u.ehr_id = p.workno
     left join basic_thjs.wb_user wu
       on u.ehr_id = wu.user_id
     where t.pro_is_valid = '1'
       and (i_projname is null or instr(t.projname, i_projname) > 0)
       and (i_khname is null or instr(t.khname, i_khname) > 0)
       and (wu.user_name = i_username or v_superuser > 0 or u.oa_code = i_username)
       and (i_busi_type is null or t.projtype = i_busi_type);
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
  
  delete from thjs.t_user_project_tmp;
  v_sql := 'insert into thjs.t_user_project_tmp
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
                           p.projrole,
                           p.workno,
                           p.empname,
                           u.ehr_id username,
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
                     inner join thjs.ib_v_finance_projmember p
                        on p.proj_id = t.projid
               --      inner join thjs.ib_v_gtja_empname u
                  inner join ehr01.tcl_v_emp_info_hgfk u
                        on u.ehr_id = p.workno
                     left join basic_thjs.wb_user wu
                       on u.ehr_id = wu.user_id
                     where t.pro_is_valid = ''1''
                       and ('''||i_projname||''' is null or
                           instr(t.projname, '''||i_projname||''') > 0)
                       and ('''||i_khname||''' is null or instr(t.khname, '''||i_khname||''') > 0)
                       and (wu.user_name = '''||i_username||''' or '||v_superuser||' > 0 or u.oa_code = '''||i_username||''') --用户相关
                       and ('''||i_busi_type||''' is null or t.projtype = '''||i_busi_type||''')
                    
                    ) a) b';
  dbms_output.put_line(v_sql);
  execute immediate v_sql;
  --显示用户权限项目   
  open rt_cursor for
    select *
      from thjs.t_user_project_tmp r
     where r.rn > v_page_num
       and r.rn <= v_page_num + v_page_size
     order by r.rn;

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