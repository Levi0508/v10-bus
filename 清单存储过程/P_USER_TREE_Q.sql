Create or Replace procedure "THJS"."P_USER_TREE_Q" (o_sql out clob, --返回游标结果集
                                               --i_flag        in varchar2, --树结构标志,
                                               o_return_code out integer,
                                               o_return_msg  out varchar2) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190411
  --模块编号：
  --模块名称：投行信息查询 - 获取投行部门组树形结构
  --功能名称：
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_user_tree_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_sql     clob;
  v_nodesql varchar2(500);
  v_level   integer default 0;
  v_count   integer default 0;
  v_close   varchar2(100);
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  --if i_flag = 1 then

  v_sql := '{"fileName":"Root"'; --"children":[{"path":"","filename":"","text":"全部",cls":"wb_pointer","leaf":true,"inframe":true}

  for node in (select '{"path":"","filename":"","text":"全部","cls":"wb_pointer","leaf":true,"inframe":true' as node,
                      '' as path,
                      '' as filenmae,
                      '' as p_filename,
                      '全部' as TEXT,
                      1 as nodelevel,
                      1 as isleaf
                 from dual
               union all
               select '{"path":"' ||
                      ltrim(sys_connect_by_path(t.ccode, '/'), '/') ||
                      '","filename":"' || t.ccode || '","text":"' || t.cname ||
                      '","cls":"wb_pointer","leaf":' ||
                      decode(connect_by_isleaf, 0, 'false', 'true') ||
                      ',"inframe":true' as node,
                      ltrim(sys_connect_by_path(t.ccode, '/'), '/') as path,
                      t.ccode as filename,
                      prior t.ccode as p_filename,
                      t.cname as text,
                      level as nodelevel,
                      connect_by_isleaf as isleaf
                 from (select distinct trim(CCODE) as CCODE, trim(CNAME) as CNAME, trim(P_CODE) as P_CODE --投行客户项目有关的组织结构树
                         from thjs.vw_userinfo_tree t
                        start with exists
                        (select 1
                                      from thjs.thdb_v_cust_info c
                                     where c.deptname = t.cname)
                       connect by t.ccode = prior t.p_code
                       /*union
                       select CCODE, CNAME, P_CODE
                         from thjs.vw_userinfo_tree t
                        start with exists
                        (select 1
                                      from thjs.thdb_v_cust_info c
                                     where c.deptmananame = t.cname)
                       connect by t.ccode = prior t.p_code*/
                       ) t
                where t.ccode is not null
                start with t.p_code = '-1'
                        or t.p_code is null
               connect by prior t.ccode = t.p_code) loop
  
    if node.nodelevel >= v_level then
      --子节点
    
      if node.isleaf = 1 then
        if node.nodelevel = v_level then
          v_nodesql := ',' || node.node || '}'; --子节点同级别，闭合
        else
          v_nodesql := ',"children":[' || node.node || '}'; --非自己的内部循环
        end if;
      else
        if node.nodelevel = v_level then
          v_nodesql := ',' || node.node; --同级别新循环开始
        else
          v_nodesql := ',"children":[' || node.node; --子节点循环跳出，
        end if;
      end if;
    
    else
      --跳出前一个树形后，判断后续节点维度，决定闭环的数量
      v_count := v_level - node.nodelevel;
    
      select listagg(']}', '') within group(order by null)
        into v_close
        from dual
      connect by level <= v_count;
    
      if node.isleaf = 1 then
        v_nodesql := v_close || ',' || node.node || '}';
      else
        v_nodesql := v_close || ',' || node.node;
      end if;
    end if;
  
    dbms_output.put_line(v_nodesql);
    v_sql   := v_sql || v_nodesql;
    v_level := node.nodelevel;
  
  end loop;

  --判断最后结束的树形层级，决定闭环的数量
  v_count := v_level;

  select listagg(']}', '') within group(order by null)
    into v_close
    from dual
  connect by level <= v_count;

  v_sql := v_sql || v_close;

  o_sql := v_sql;

  /*'{"fileName":"Root","children":
                [{"path":"8BA7BBB3DC4A43B6A1E90CCE616AE5ED","fileName":"8BA7BBB3DC4A43B6A1E90CCE616AE5ED","children":
                   [{"path":"8BA7BBB3DC4A43B6A1E90CCE616AE5ED/liuguifang","fileName":"liuguifang","text":"刘桂芳","cls":"wb_pointer","leaf":true,"inframe":true}],
                  "text":"高级管理人员","cls":"wb_pointer","inframe":false},
                 {"path":"B5BE3830787C443AA88979FC95743163","fileName":"8BA7BBB3DC4A43B6A1E90CCE616AE5ED","children":
                   [{"path":"B5BE3830787C443AA88979FC95743163/119B6AB06A494D94B134729CC64BA4C1","fileName":"119B6AB06A494D94B134729CC64BA4C1","children":
                      [{"path":"B5BE3830787C443AA88979FC95743163/119B6AB06A494D94B134729CC64BA4C1/12AF9026415D4D0C93B16158F92EA2D4","fileName":"12AF9026415D4D0C93B16158F92EA2D4","text":"彭凯组","cls":"wb_pointer","leaf":true,"inframe":true}],
                   "text":"投资银行部","cls":"wb_pointer","inframe":true}],
                  "text":"投行业务委员会","cls":"wb_pointer","inframe":false}
                ]}'  
  
  
   select '{"path":"' ||
          ltrim(sys_connect_by_path(t.ccode, '/'), '/') ||
          '","filename":"' || t.ccode || '","text":"' || t.cname ||
          '","cls":"wb_pointer","leaf":' ||
          decode(connect_by_isleaf, 0, 'false', 'true') ||
          ',"inframe":true' as node,
          ltrim(sys_connect_by_path(t.ccode, '/'), '/') as path,
          t.ccode as filename,
          prior t.ccode as p_filename,
          t.cname as text,
          level as nodelevel,
          connect_by_isleaf as isleaf
     from (select t.dept_id     as ccode,
                  t.dept_name   as cname,
                  t.dept_par_id as p_code
             from THJS.THDB_V_FINANCE_DEPT_INFO t) t
    where t.ccode is not null
    start with t.p_code = 'B5BE3830787C443AA88979FC95743163'
   connect by prior t.ccode = t.p_code
  
  select '{"path":"' ||
          ltrim(sys_connect_by_path(t.ccode, '/'), '/') ||
          '","filename":"' || t.ccode || '","text":"' || t.cname ||
          '","cls":"wb_pointer","leaf":' ||
          decode(connect_by_isleaf, 0, 'false', 'true') ||
          ',"inframe":true' as node,
          ltrim(sys_connect_by_path(t.ccode, '/'), '/') as path,
          t.ccode as filename,
          prior t.ccode as p_filename,
          t.cname as text,
          level as nodelevel,
          connect_by_isleaf as isleaf
     from (select t.ccode, t.cname, t.p_code, 2 as torder
             from thjs.vw_userinfo_tree t
            where t.ccode is not null) t
    where t.ccode is not null
    start with t.p_code = '-1'
            or t.p_code is null
   connect by prior t.ccode = t.p_code  
  */
  --end if;

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