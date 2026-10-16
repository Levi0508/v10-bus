CREATE OR REPLACE VIEW APP.VW_PROJECT_TAB_VIEW_LIST AS
SELECT a.project_id,
       a.project_version,
       b.if_upgraded,
       decode(b.if_upgraded, '0', '未升级', '1', '已升级') AS if_upgraded_v,
       c.tab_or_view,
       c.owner,
       c.object_name,
       a.tab_view_name,
       d.COMMENTS,
       replace(c.ddl_sql,'','')||chr(10)||
       'COMMENT ON '||c.tab_or_view||' '|| a.tab_view_name||' is '''||d.COMMENTS||''';'||chr(10)|| e.column_comment as ddl_sql,
       c.create_sql,
       a.modify_sql,
       a.modify_summary,
       a.update_user,
       a.update_time,
       a.pk_id,
       c.ROW_COUNT,
       c.TABLE_TYPE,
       case when f.OWNER is not null then f.OWNER||'.'||f.SYNONYM_NAME end as SYNONYM_NAME,
       h.MODIFY_HISTORY
FROM   APP.tb_project_tab_view_list a
INNER  JOIN APP.tb_project b
ON     a.project_id = b.project_id
AND    a.project_version = b.project_version
LEFT   JOIN (select DBMS_METADATA.GET_DDL(c.tab_or_view, c.object_name, c.owner) as ddl_sql,
                    c.tab_view_name,
                    c.owner,
                    c.OBJECT_NAME,
                    c.TAB_OR_VIEW,
                    c.CREATE_SQL,
                    c.ROW_COUNT,
                    c.TABLE_TYPE
             from   APP.tb_project_tab_view c
             inner join    
                    ALL_OBJECTS d
             on     c.OWNER=d.OWNER
             and    c.OBJECT_NAME=d.OBJECT_NAME
             and    d.OBJECT_TYPE in ('TABLE','VIEW')
            ) c
ON     a.tab_view_name = c.tab_view_name
LEFT   JOIN all_tab_comments d
ON     c.owner = d.owner
AND    c.object_name = d.TABLE_NAME
left   join 
       (select c.owner,
               e.table_name,
               listagg('COMMENT ON COLUMN '|| c.tab_view_name ||'.'||e.column_name||' is '''||e.comments||''';',chr(10)) within group(order by e.column_name) as column_comment
        from   APP.tb_project_tab_view c
        inner join
               dba_col_comments e
        on     c.owner = e.owner
        AND    c.object_name = e.TABLE_NAME
        group by c.owner,
               e.table_name
       ) e
on     c.owner = e.owner
AND    c.object_name = e.TABLE_NAME
left   join 
       ALL_SYNONYMS f 
on     a.tab_view_name=f.TABLE_OWNER||'.'||f.TABLE_NAME
left   join 
        app.TB_TABLE_PROPS h 
on      c.owner=h.OWNER
and     c.object_name=h.table_name
order  by a.project_id,a.project_version,c.tab_or_view,a.tab_view_name;
COMMENT ON VIEW APP.VW_PROJECT_TAB_VIEW_LIST is '模块项目版本表视图清单视图';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.COMMENTS is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.CREATE_SQL is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.DDL_SQL is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.IF_UPGRADED is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.IF_UPGRADED_V is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.MODIFY_HISTORY is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.MODIFY_SQL is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.MODIFY_SUMMARY is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.OBJECT_NAME is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.OWNER is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PK_ID is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PROJECT_ID is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PROJECT_VERSION is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.ROW_COUNT is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.SYNONYM_NAME is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TABLE_TYPE is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TAB_OR_VIEW is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TAB_VIEW_NAME is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.UPDATE_TIME is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.UPDATE_USER is '';


create or replace view app.vw_table_data_route as
select distinct a.step_seq,
       a.etl_sp_name,
       a1.version_id,
       a.step_sql,
       a.target_table,
       b.referenced_object as from_table
from APP.tb_etl_sp_step a 
inner join 
     (select a.*,row_number() over(partition by a.etl_sp_name order by version_id desc) as rn 
      from   APP.tb_etl_sp a
     ) a1
on   a.etl_sp_name=a1.etl_sp_name
and  a.version_id=a1.version_id
and  a1.rn=1
inner join 
     app.TB_DEPENDENCIES b 
on   a.etl_sp_name=b.object_name 
and  instr(upper(a.step_sql),b.referenced_object)>0
and  b.referenced_type in ('TABLE','VIEW')
and  a.target_table<>b.referenced_object
inner join
     app.TB_ETL_SP_STEP_JOIN c
on   instr(upper(c.join_table),b.referenced_object)>0
and  a.etl_sp_name=c.etl_sp_name
and  a.version_id=c.version_id
and  a.step_seq=c.step_seq
where a.step_type = '2'
and   exists(select 1 from app.TB_ETL_SP_STEP_INSERT z 
              where a.etl_sp_name=z.etl_sp_name
              and   a.version_id=z.version_id
              and   a.step_seq=z.step_seq
              and   instr(upper(z.source_column),upper(c.join_as)||'.')>0)
order by etl_sp_name,step_seq,target_table,from_table;
COMMENT ON VIEW APP.VW_TABLE_DATA_ROUTE is '数据插入操作信息视图';
COMMENT ON COLUMN APP.VW_TABLE_DATA_ROUTE.ETL_SP_NAME is '';
COMMENT ON COLUMN APP.VW_TABLE_DATA_ROUTE.FROM_TABLE is '';
COMMENT ON COLUMN APP.VW_TABLE_DATA_ROUTE.STEP_SEQ is '';
COMMENT ON COLUMN APP.VW_TABLE_DATA_ROUTE.STEP_SQL is '';
COMMENT ON COLUMN APP.VW_TABLE_DATA_ROUTE.TARGET_TABLE is '';
COMMENT ON COLUMN APP.VW_TABLE_DATA_ROUTE.VERSION_ID is '';


CREATE OR REPLACE PROCEDURE APP.P40001
(
    i_project_id                         IN VARCHAR2 ,
    i_project_version                    IN VARCHAR2 ,
    i_tab_view_name                      IN VARCHAR2 ,
    rt_cursor                            OUT CURSOR ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.4
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 项目模块涉及表视图
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260202 15:15:24
    -- 修改内容:1.4:
    -- 修改内容:更新创建脚本的循环清单修改
    -- 修改内容:1.3:
    -- 修改内容:增加更新视图表创建脚本功能
    -- 修改内容:1.2:
    -- 修改内容:增加同义词信息
    -- 修改内容:1.1:
    -- 修改内容:增加统计表记录数步骤
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
        /*01.01:-循环开始*/
    for cur in (select a.tab_view_name
                from   app.tb_project_tab_view_list a
                inner join 
                       app.tb_project_tab_view b 
                on     a.TAB_VIEW_NAME=b.TAB_VIEW_NAME
                where  a.project_id=i_project_id
                and    a.project_version=i_project_version
                and    b.table_type='1'
               )
    loop

        /*01.02:*/v_step_msg:='01.02';
        execute immediate 'update app.tb_project_tab_view a '||
                          '   set a.row_count=(select count(1) from '||cur.tab_view_name||')'||
                          ' where a.tab_or_view=''TABLE'' and a.tab_view_name='''||cur.tab_view_name||'''';
        commit;

        /*01.99:-循环结束*/
    end loop;

        /*02.01:更新创建脚本*/
    for cur in (SELECT distinct
                       a.PROJECT_ID,
                       a.OWNER,
                       a.TAB_VIEW_NAME,
                       a.DDL_SQL,
                       to_char(b.LAST_DDL_TIME,'yyyymmdd hh24:mi:ss') as LAST_DDL_TIME,
                       a1.UPDATE_TIME
                from   APP.vw_project_tab_view_list a
                inner join 
                       app.TB_PROJECT_TAB_VIEW a1 
                on     a.TAB_VIEW_NAME=a1.TAB_VIEW_NAME
                inner join 
                       all_objects b 
                on     a.TAB_VIEW_NAME=b.owner||'.'||b.OBJECT_NAME
                and    (to_char(b.LAST_DDL_TIME,'yyyymmdd hh24:mi:ss')>a1.UPDATE_TIME or a1.create_sql is null)
                where  a.project_id=i_project_id
                and    a.project_version=i_project_version
                and    (a.tab_view_name=i_tab_view_name or i_tab_view_name is null)
               ) 
    loop

        /*02.02:*/v_step_msg:='02.02';
        update app.TB_PROJECT_TAB_VIEW a 
        set    a.CREATE_SQL=a.CREATE_SQL||chr(10)||cur.LAST_DDL_TIME||chr(10)||cur.DDL_SQL||chr(10),
               a.UPDATE_TIME=cur.LAST_DDL_TIME
        where  a.tab_view_name=cur.tab_view_name;

        /*02.03:*/v_step_msg:='02.03';
        commit;

        /*02.99:*/
    end loop;

    /*03:返回查询结果*/v_step_msg:='03';
    OPEN rt_cursor FOR
    select  a.project_id, 
            a.project_version, 
            a.if_upgraded, 
            a.if_upgraded_v, 
            a.tab_or_view, 
            a.owner, 
            a.object_name, 
            a.tab_view_name, 
            a.comments, 
            a.create_sql, 
            a.modify_sql, 
            a.modify_summary, 
            a.update_user, 
            a.update_time, 
            a.pk_id,
            a.ROW_COUNT,
            a.TABLE_TYPE,
            a.SYNONYM_NAME,
            a.modify_history
    from    APP.vw_project_tab_view_list a
    where   a.project_id=i_project_id
    and     a.project_version=i_project_version
    and     (a.tab_view_name=i_tab_view_name or i_tab_view_name is null);

    /*04:*/v_step_msg:='04';
    o_return_code := 0;
    o_return_msg:='执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'APP.P40001执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_QUERY_TABLE_DATA_ROUTE
(
    i_target_table                       IN VARCHAR2 ,
    o_return_code                        OUT INT ,
    o_return_msg                         OUT CLOB 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 表数据路径查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260206 16:47:36
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_return_json                        CLOB ;
    v_root_id                            VARCHAR2(100) default upper(i_target_table);
    v_max_level                          INT default 9;--最大层数
    v_current_level                      INT default 1;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:*/v_step_msg:='01';
    delete from FLHGDB.tmp_tree_flat;

    /*02:查询表为根节点*/v_step_msg:='02';
    insert into FLHGDB.TMP_TREE_FLAT
    (
           ID,
           PARENT_ID,
           LEVEL
    )
    select 
           v_root_id as ID,
           null as PARENT_ID,
           1 as LEVEL
    from   
           dual t
    where  1=1;

        /*03.01:*/
    LOOP

        /*03.02:获取下层数据，表节点ID为“程序/表”，程序节点ID为“序号)程序”*/v_step_msg:='03.02';
        insert into FLHGDB.TMP_TREE_FLAT
        (
               ID,
               PARENT_ID,
               LEVEL
        )
        select 
               distinct row_number() over(partition by c.id order by p.id) ||')'|| c.id as ID,
               p.id as PARENT_ID,
               v_current_level+1 as LEVEL
        from   
               (
                select distinct etl_sp_name||'/'||from_table as id,from_table as title,
                       etl_sp_name as parent_id,etl_sp_name as parent_title 
                  from app.VW_TABLE_DATA_ROUTE
                 union all
                select distinct etl_sp_name as id,etl_sp_name as title,
                       etl_sp_name||'/'||target_table as parent_id,target_table as parent_title
                  from app.VW_TABLE_DATA_ROUTE
               ) c
        inner join
               FLHGDB.tmp_tree_flat p
        on     
               c.parent_title=substr(substr(p.id,instr(p.id,'/')+1),instr(substr(p.id,instr(p.id,'/')+1),')')+1)
        and    p.LEVEL=v_current_level
        where  1=1;

        /*03.03:删除已有节点*/v_step_msg:='03.03';
        delete from FLHGDB.tmp_tree_flat a
        where  a.LEVEL=v_current_level+1
        and    exists(select 1 from FLHGDB.tmp_tree_flat b 
                      where  b.LEVEL<a.LEVEL
                      and    b.id=a.id
                     );  

        /*03.04:如当前层表节点之前全部删除，还需删除上层程序节点*/v_step_msg:='03.04';
        delete from FLHGDB.tmp_tree_flat a
        where  a.LEVEL=v_current_level
        and    a.id like '%)%'
        and    a.id not like '%/%'
        and    not exists (select 1 from FLHGDB.tmp_tree_flat b 
                           where b.parent_id=a.id);

        /*03.05:*/v_step_msg:='03.05';
        v_current_level:=v_current_level+1;

        /*03.06:*/v_step_msg:='03.06';
        exit when v_current_level+1>=v_max_level;

        /*03.99:*/
    end loop;

    /*04:插入叶子节点 JSON*/v_step_msg:='04';
    insert into FLHGDB.TMP_NODE_JSON
    (
           ID,
           PARENT_ID,
           JSON_STR,
           IS_LEAF
    )
    select 
           a.id as ID,
           a.parent_id as PARENT_ID,
           '{"id":"' || a.id || '"' || 
           ',"title":"'||substr(a.id,instr(a.id,'/')+1)|| '"' || 
           ',"summary":"'||c.comments||'"' || 
           ',"data_source":"'||e.source_name||'"' || 
           ',"data_topic":"'||f.v||'"' || 
           ',"sensitivity_level":"'||g.v||'"' || 
           ',"data_status":"'||h.v||'"' || 
           ',"url":"http://10.181.135.25/flhg/bzdgl?queryObject='||substr(a.id,instr(a.id,'/')+1)|| '"' || 
           '}' as JSON_STR,
           1 as IS_LEAF
    from   
           flhgdb.tmp_tree_flat a
    left join
           ALL_TAB_COMMENTS c
    on     
           substr(a.id,instr(a.id,'/')+1)=c.OWNER||'.'||c.TABLE_NAME
    left join
           app.TB_TABLE_PROPS d
    on     
           substr(a.id,instr(a.id,'/')+1)=d.OWNER||'.'||d.TABLE_NAME
    left join
           app.tb_data_source e
    on     
           d.data_source=e.SOURCE_CODE
    left join
           app.vw_dict f
    on     
           d.DATA_TOPIC=f.K
    and    f.KEY_NAME='DATA_TOPIC'
    left join
           app.vw_dict g
    on     
           d.SENSITIVITY_LEVEL=g.K
    and    g.KEY_NAME='SENSITIVITY_LEVEL'
    left join
           app.vw_dict h
    on     
           d.DATA_STATUS=h.K
    and    h.KEY_NAME='DATA_STATUS'
    where  NOT EXISTS (SELECT 1 FROM flhgdb.tmp_tree_flat b WHERE b.parent_id = a.id ) or a.LEVEL=v_max_level
    ;

    /*05:*/v_step_msg:='05';
    SELECT MAX(level) INTO v_max_level FROM flhgdb.tmp_tree_flat;

    /*06:*/v_step_msg:='06';
    v_current_level := v_max_level - 1;

        /*07.01:*/
    WHILE v_current_level >= 1 LOOP

        /*07.02: 插入当前层级的非叶子节点 JSON*/v_step_msg:='07.02';
        insert into FLHGDB.TMP_NODE_JSON
        (
               ID,
               PARENT_ID,
               JSON_STR,
               IS_LEAF
        )
        select 
               a.id as ID,
               a.parent_id as PARENT_ID,
               case when v_current_level>1 then 
                       '{"id":"' || a.id || '"' || 
                       ',"title":"'||substr(substr(a.id,instr(a.id,'/')+1),instr(substr(a.id,instr(a.id,'/')+1),')')+1)|| '"' || 
                       ',"summary":"'||coalesce(b.summary,c.comments)||'"' || 
                       ',"data_source":"'||e.source_name||'"' || 
                       ',"data_topic":"'||f.v||'"' || 
                       ',"sensitivity_level":"'||g.v||'"' || 
                       ',"data_status":"'||h.v||'"' || 
                       ',"url":"http://10.181.135.25/flhg/'||case when instr(a.id,'/')>0 then 'bzdgl' else 'cxgl' end||'?queryObject='||substr(substr(a.id,instr(a.id,'/')+1),instr(substr(a.id,instr(a.id,'/')+1),')')+1)|| '"' || 
                       ',"children":[' || LISTAGG(tnj.json_str, ',') WITHIN GROUP (ORDER BY a.id) || ']}'
                    else '[' || LISTAGG(tnj.json_str, ',') WITHIN GROUP (ORDER BY a.id) || ']' end as JSON_STR,
               0 as IS_LEAF
        from   
               FLHGDB.TMP_TREE_FLAT a
        left join
               (select a.*,row_number() over(partition by a.etl_sp_name order by a.version_id desc) as rn from app.TB_ETL_SP a) b
        on     
               substr(substr(a.id,instr(a.id,'/')+1),instr(substr(a.id,instr(a.id,'/')+1),')')+1)=b.etl_sp_name
        and    b.rn=1
        left join
               ALL_TAB_COMMENTS c
        on     
               substr(substr(a.id,instr(a.id,'/')+1),instr(substr(a.id,instr(a.id,'/')+1),')')+1)=c.OWNER||'.'||c.TABLE_NAME
        left join
               app.TB_TABLE_PROPS d
        on     
               substr(substr(a.id,instr(a.id,'/')+1),instr(substr(a.id,instr(a.id,'/')+1),')')+1)=d.OWNER||'.'||d.TABLE_NAME
        left join
               app.tb_data_source e
        on     
               d.data_source=e.SOURCE_CODE
        left join
               app.vw_dict f
        on     
               d.DATA_TOPIC=f.K
        and    f.KEY_NAME='DATA_TOPIC'
        left join
               app.vw_dict g
        on     
               d.SENSITIVITY_LEVEL=g.K
        and    g.KEY_NAME='SENSITIVITY_LEVEL'
        left join
               app.vw_dict h
        on     
               d.DATA_STATUS=h.K
        and    h.KEY_NAME='DATA_STATUS'
        inner join
               flhgdb.tmp_node_json tnj
        on     
               a.id = tnj.parent_id
        where  a.level = v_current_level
        AND    NOT EXISTS (SELECT 1 FROM flhgdb.tmp_node_json t WHERE t.id = a.id)
        GROUP BY a.id, a.parent_id,b.summary,c.comments,e.source_name,f.v,g.v,h.v;

        /*07.03:*/v_step_msg:='07.03';
        v_current_level := v_current_level - 1;

        /*07.99:*/
    end loop;

    /*08:拼接上根节点*/v_step_msg:='08';
    select '{"id":"'||v_root_id||'"'||
           ',"title":"'||v_root_id||'"'||
           ',"summary":"'||coalesce(b.summary,c.comments)||'"' || 
           ',"data_source":"'||e.source_name||'"' || 
           ',"data_topic":"'||f.v||'"' || 
           ',"sensitivity_level":"'||g.v||'"' || 
           ',"data_status":"'||h.v||'"' || 
           ',"children":'||case when a.json_str not like '[%]' then '['||a.json_str||']' else a.json_str end||
           '}' as return_msg
    into   v_return_json
    from   flhgdb.tmp_node_json a
    left join 
           (select a.*,row_number() over(partition by a.etl_sp_name order by a.version_id desc) as rn from app.TB_ETL_SP a) b 
    on     a.id=b.etl_sp_name
    and    b.rn=1
    left join 
           ALL_TAB_COMMENTS c 
    on     a.id=c.OWNER||'.'||c.TABLE_NAME 
    left join 
           app.TB_TABLE_PROPS d 
    on     a.id=d.OWNER||'.'||d.TABLE_NAME 
    left join 
           app.tb_data_source e 
    on     d.data_source=e.SOURCE_CODE
    left join 
           app.vw_dict f 
    on     d.DATA_TOPIC=f.K
    and    f.KEY_NAME='DATA_TOPIC'
    left join 
           app.vw_dict g 
    on     d.SENSITIVITY_LEVEL=g.K
    and    g.KEY_NAME='SENSITIVITY_LEVEL'
    left join 
           app.vw_dict h 
    on     d.DATA_STATUS=h.K
    and    h.KEY_NAME='DATA_STATUS'
    where  a.id=v_root_id;

    /*09:*/v_step_msg:='09';
    select v_return_json;

    /*10:*/v_step_msg:='10';
    o_return_code := 0;

    /*11:*/v_step_msg:='11';
    o_return_msg := v_return_json;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'APP.PR_QUERY_TABLE_DATA_ROUTE执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.P40003
(
    i_project_id                         IN VARCHAR2 ,
    i_project_version                    IN VARCHAR2 ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT CLOB 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.3
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 开发项目版本升级脚本查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260202 14:29:55
    -- 修改内容:1.3:
    -- 修改内容:升级脚本取数调整
    -- 修改内容:1.2:
    -- 修改内容:删除表的脚本做注释处理
    -- 修改内容:1.1:
    -- 修改内容:表升级脚本设置为use ddl时增加删表脚本
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;
    v_err_msg                            CLOB default '';
    v_exists                             INTEGER default 0;
    v_update_time                        VARCHAR2(100) default to_char(SYSDATE, 'YYYYMMDD hh24:mi:ss');
    v_return_sql                         CLOB ;--返回升级脚本
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
        /*01.01:按刷库顺序拼接刷库脚本-循环开始*/
    for cur in (select a.sp_func_name as object_name,
                       'sp' as object_type,
                       nvl(b.object_seq,3) as object_seq,
                       a.etl_sp_version_up,
                       null as modify_sql
                from   APP.tb_project_sp_func_list a
                left   join 
                       (select distinct object_name,object_seq from APP.tb_dependencies) b
                on     a.sp_func_name=b.object_name
                where  a.etl_sp_version_up IS NOT NULL
                AND    a.project_id = i_project_id
                AND    a.project_version = i_project_version
                union all
                select a.tab_view_name as object_name,
                       'tb' as object_type,
                       nvl(b.object_seq,case when a.tab_or_view='TABLE' then 1 else 2 end) as object_seq,
                       null as etl_sp_version_up,
                       case when a.modify_sql='use ddl' then case when a.tab_or_view='TABLE' then '--drop table '||a.tab_view_name||';'||chr(10) end||a.ddl_sql else a.modify_sql end as modify_sql
                from   APP.vw_project_tab_view_list a
                left   join 
                       (select distinct object_name,object_seq from APP.tb_dependencies) b
                on     a.tab_view_name=b.object_name
                where  a.modify_sql IS NOT NULL
                AND    a.project_id = i_project_id
                AND    a.project_version = i_project_version
                order by object_seq,object_name
               )
    loop

            /*01.02.01:条件:对象为程序*/
        if cur.object_type='sp' then

            /*01.02.02:根据待升级版本取程序代码*/v_step_msg:='01.02.02';
            APP.P30006(cur.object_name,cur.etl_sp_version_up,'admin',null,null,'1',v_errcode,v_err_msg);

            /*01.02.03:拼接升级脚本*/v_step_msg:='01.02.03';
            v_return_sql:=v_return_sql||v_err_msg||chr(10)||chr(10)||chr(10);

            /*01.02.04:*/
        else

            /*01.02.05:拼接表视图升级脚本*/v_step_msg:='01.02.05';
            v_return_sql:=v_return_sql||cur.modify_sql||chr(10)||chr(10)||chr(10);

            /*01.02.99:条件分支01.02结束*/
        end if;

        /*01.99:按刷库顺序拼接刷库脚本-循环结束*/
    end loop;

    /*02:*/v_step_msg:='02';
    o_return_code := 0;
    o_return_msg := v_return_sql;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'APP.P40003执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



