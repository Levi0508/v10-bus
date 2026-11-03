Create OR REPLACE   procedure "THJS"."P_DEPT_TREE_Q" (o_sql out clob, --返回游标结果集
                                               --i_flag        in varchar2, --树结构标志,
                                               o_return_code out integer,
                                               o_return_msg  out varchar2) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：LXY@Kingstar
  --创建日期：20260707
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
  v_func_name    varchar2(2000) default 'p_dept_tree_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_sql     clob;
  v_nodesql clob;
  v_level   integer default 0;
  v_count   integer default 0;
  v_close   clob;
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  dbms_lob.createtemporary(v_sql,true);
  dbms_lob.createtemporary(v_nodesql,true);
  dbms_lob.createtemporary(v_close,true);
  
  --v_sql := '{"fileName":"Root"';  
  dbms_lob.append(v_sql,'{"fileName":"Root"');

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
                 from (select distinct trim(DEPT_ID) as CCODE, trim(DEPT_NAME) as CNAME, trim(PARENT_ID) as P_CODE --投行客户项目有关的组织结构树
                         from BASIC_THJS.WB_DEPT t
                        start with exists
                        (select 1
                                      from thjs.thdb_v_cust_info c
                                     where c.deptcode = t.DEPT_ID
                                     or deptcode=t.parent_id )
                       connect by t.DEPT_ID = prior t.PARENT_ID
                        ) t
                where t.ccode is not null
                start with t.p_code = 'D0'
                        or t.p_code is null
               connect by prior t.ccode = t.p_code) loop
  
    dbms_lob.trim(v_nodesql,0);
    
    if node.nodelevel >= v_level then
      --子节点
    
      if node.isleaf = 1 then
        if node.nodelevel = v_level then
          --v_nodesql := ',' || node.node || '}'; --子节点同级别，闭合
          dbms_lob.append(v_nodesql,',');
          dbms_lob.append(v_nodesql,node.node);
          dbms_lob.append(v_nodesql, '}');
        else
          --v_nodesql := ',"children":[' || node.node || '}'; --非自己的内部循环
          dbms_lob.append(v_nodesql,',"children":[' );
          dbms_lob.append(v_nodesql, node.node);
          dbms_lob.append(v_nodesql, '}');
        end if;
      else
        if node.nodelevel = v_level then
          --v_nodesql := ',' || node.node; --同级别新循环开始
          dbms_lob.append(v_nodesql,',');
          dbms_lob.append(v_nodesql,node.node);
        else
          --v_nodesql := ',"children":[' || node.node; --子节点循环跳出，
          dbms_lob.append(v_nodesql,',"children":[' );
          dbms_lob.append(v_nodesql, node.node);
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
        --v_nodesql := v_close || ',' || node.node || '}';
        dbms_lob.append(v_nodesql, v_close);
        dbms_lob.append(v_nodesql,',');
        dbms_lob.append(v_nodesql,node.node);
        dbms_lob.append(v_nodesql, '}');
      else
        --v_nodesql := v_close || ',' || node.node;
        dbms_lob.append(v_nodesql, v_close);
        dbms_lob.append(v_nodesql,',');
        dbms_lob.append(v_nodesql,node.node);
      end if;
    end if;
  
    --dbms_output.put_line(v_nodesql);
    --v_sql   := v_sql || v_nodesql;
    dbms_lob.append(v_sql,v_nodesql);
    
    v_level := node.nodelevel;
  
  end loop;

  --判断最后结束的树形层级，决定闭环的数量
  v_count := v_level;

  select listagg(']}', '') within group(order by null)
    into v_close
    from dual
  connect by level <= v_count;

  --v_sql := v_sql || v_close;
  dbms_lob.append(v_sql,v_close);
  
  o_sql := v_sql;

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