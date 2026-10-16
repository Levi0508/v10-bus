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
       replace(c.ddl_sql,'""','')||chr(10)||
       'COMMENT ON '||c.tab_or_view||' '|| a.tab_view_name||' is '''||d.COMMENTS||''';'||chr(10)||
       listagg('COMMENT ON COLUMN '|| a.tab_view_name ||'.'||e.column_name||' is '''||e.comments||''';',chr(10)) within group(order by e.column_name) as create_sql,
       a.modify_sql,
       a.modify_summary,
       a.update_user,
       a.update_time,
       a.pk_id
FROM   APP.tb_project_tab_view_list a
INNER  JOIN APP.tb_project b
ON     a.project_id = b.project_id
AND    a.project_version = b.project_version
LEFT   JOIN (select case when d.object_name is null then c.create_sql else DBMS_METADATA.GET_DDL(c.tab_or_view, c.object_name, c.owner) end as ddl_sql,
                    c.tab_view_name,
                    c.owner,
                    c.OBJECT_NAME,
                    c.TAB_OR_VIEW,
                    c.CREATE_SQL
             from   APP.tb_project_tab_view c
             left join    
                    ALL_OBJECTS d
             on     c.OWNER=d.OWNER
             and    c.OBJECT_NAME=d.OBJECT_NAME
             and    d.OBJECT_TYPE in ('TABLE','VIEW')
            ) c
ON     a.tab_view_name = c.tab_view_name
LEFT   JOIN all_tab_comments d
ON     c.owner = d.owner
AND    c.object_name = d.TABLE_NAME
left   join all_col_comments e
on     c.owner = e.owner
AND    c.object_name = e.TABLE_NAME
group by a.project_id,
       a.project_version,
       b.if_upgraded,
       decode(b.if_upgraded, '0', '未升级', '1', '已升级'),
       c.tab_or_view,
       c.owner,
       c.object_name,
       c.ddl_sql,
       a.tab_view_name,
       d.COMMENTS,
       a.modify_sql,
       a.modify_summary,
       a.update_user,
       a.update_time,
       a.pk_id
order  by a.project_id,a.project_version,c.tab_or_view,a.tab_view_name;
20251208 08:29:36
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
       'COMMENT ON '||c.tab_or_view||' '|| a.tab_view_name||' is '''||d.COMMENTS||''';'||chr(10)|| e.column_comment as create_sql,
       a.modify_sql,
       a.modify_summary,
       a.update_user,
       a.update_time,
       a.pk_id,
       c.ROW_COUNT,
       c.TABLE_TYPE,
       case when f.OWNER is not null then f.OWNER||'.'||f.SYNONYM_NAME end as SYNONYM_NAME
FROM   APP.tb_project_tab_view_list a
INNER  JOIN APP.tb_project b
ON     a.project_id = b.project_id
AND    a.project_version = b.project_version
LEFT   JOIN (select case when d.object_name is null then c.create_sql else DBMS_METADATA.GET_DDL(c.tab_or_view, c.object_name, c.owner) end as ddl_sql,
                    c.tab_view_name,
                    c.owner,
                    c.OBJECT_NAME,
                    c.TAB_OR_VIEW,
                    c.CREATE_SQL,
                    c.ROW_COUNT,
                    c.TABLE_TYPE
             from   APP.tb_project_tab_view c
             left join    
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
order  by a.project_id,a.project_version,c.tab_or_view,a.tab_view_name;
COMMENT ON VIEW APP.VW_PROJECT_TAB_VIEW_LIST is '模块项目版本表视图清单视图';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.COMMENTS is '备注';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.CREATE_SQL is '创建SQL';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.IF_UPGRADED is '是否已升级';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.IF_UPGRADED_V is '是否已升级';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.MODIFY_SQL is '升级脚本';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.MODIFY_SUMMARY is '升级说明';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.OBJECT_NAME is '对象名';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.OWNER is '用户';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PK_ID is '主键ID';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PROJECT_ID is '模块项目编号';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PROJECT_VERSION is '模块版本';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.ROW_COUNT is '记录数';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.SYNONYM_NAME is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TABLE_TYPE is '表分类,0普通表,1参数配置表';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TAB_OR_VIEW is '表视图类别';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TAB_VIEW_NAME is '表视图名';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.UPDATE_TIME is '更新时间';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.UPDATE_USER is '更新人';

20260130 11:10:36
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
       replace(c.ddl_sql,'""','')||chr(10)||
       'COMMENT ON '||c.tab_or_view||' '|| a.tab_view_name||' is '''||d.COMMENTS||''';'||chr(10)||
       listagg('COMMENT ON COLUMN '|| a.tab_view_name ||'.'||e.column_name||' is '''||e.comments||''';',chr(10)) within group(order by e.column_name) as create_sql,
       a.modify_sql,
       a.modify_summary,
       a.update_user,
       a.update_time,
       a.pk_id
FROM   APP.tb_project_tab_view_list a
INNER  JOIN APP.tb_project b
ON     a.project_id = b.project_id
AND    a.project_version = b.project_version
LEFT   JOIN (select case when d.object_name is null then c.create_sql else DBMS_METADATA.GET_DDL(c.tab_or_view, c.object_name, c.owner) end as ddl_sql,
                    c.tab_view_name,
                    c.owner,
                    c.OBJECT_NAME,
                    c.TAB_OR_VIEW,
                    c.CREATE_SQL
             from   APP.tb_project_tab_view c
             left join    
                    ALL_OBJECTS d
             on     c.OWNER=d.OWNER
             and    c.OBJECT_NAME=d.OBJECT_NAME
             and    d.OBJECT_TYPE in ('TABLE','VIEW')
            ) c
ON     a.tab_view_name = c.tab_view_name
LEFT   JOIN all_tab_comments d
ON     c.owner = d.owner
AND    c.object_name = d.TABLE_NAME
left   join all_col_comments e
on     c.owner = e.owner
AND    c.object_name = e.TABLE_NAME
group by a.project_id,
       a.project_version,
       b.if_upgraded,
       decode(b.if_upgraded, '0', '未升级', '1', '已升级'),
       c.tab_or_view,
       c.owner,
       c.object_name,
       c.ddl_sql,
       a.tab_view_name,
       d.COMMENTS,
       a.modify_sql,
       a.modify_summary,
       a.update_user,
       a.update_time,
       a.pk_id
order  by a.project_id,a.project_version,c.tab_or_view,a.tab_view_name;
20251208 08:29:36
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
       'COMMENT ON '||c.tab_or_view||' '|| a.tab_view_name||' is '''||d.COMMENTS||''';'||chr(10)|| e.column_comment as create_sql,
       a.modify_sql,
       a.modify_summary,
       a.update_user,
       a.update_time,
       a.pk_id,
       c.ROW_COUNT,
       c.TABLE_TYPE,
       case when f.OWNER is not null then f.OWNER||'.'||f.SYNONYM_NAME end as SYNONYM_NAME
FROM   APP.tb_project_tab_view_list a
INNER  JOIN APP.tb_project b
ON     a.project_id = b.project_id
AND    a.project_version = b.project_version
LEFT   JOIN (select case when d.object_name is null then c.create_sql else DBMS_METADATA.GET_DDL(c.tab_or_view, c.object_name, c.owner) end as ddl_sql,
                    c.tab_view_name,
                    c.owner,
                    c.OBJECT_NAME,
                    c.TAB_OR_VIEW,
                    c.CREATE_SQL,
                    c.ROW_COUNT,
                    c.TABLE_TYPE
             from   APP.tb_project_tab_view c
             left join    
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
order  by a.project_id,a.project_version,c.tab_or_view,a.tab_view_name;
COMMENT ON VIEW APP.VW_PROJECT_TAB_VIEW_LIST is '模块项目版本表视图清单视图';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.COMMENTS is '备注';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.CREATE_SQL is '创建SQL';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.IF_UPGRADED is '是否已升级';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.IF_UPGRADED_V is '是否已升级';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.MODIFY_SQL is '升级脚本';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.MODIFY_SUMMARY is '升级说明';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.OBJECT_NAME is '对象名';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.OWNER is '用户';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PK_ID is '主键ID';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PROJECT_ID is '模块项目编号';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.PROJECT_VERSION is '模块版本';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.ROW_COUNT is '记录数';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.SYNONYM_NAME is '';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TABLE_TYPE is '表分类,0普通表,1参数配置表';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TAB_OR_VIEW is '表视图类别';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.TAB_VIEW_NAME is '表视图名';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.UPDATE_TIME is '更新时间';
COMMENT ON COLUMN APP.VW_PROJECT_TAB_VIEW_LIST.UPDATE_USER is '更新人';




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
    -- 版    本: 1.3
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 项目模块涉及表视图
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260130 11:11:30
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
    for cur in (SELECT a.PROJECT_ID,
                       a.OWNER,
                       a.TAB_VIEW_NAME,
                       a.CREATE_SQL,
                       to_char(b.LAST_DDL_TIME,'yyyymmdd hh24:mi:ss') as LAST_DDL_TIME,
                       a1.UPDATE_TIME
                from   APP.vw_project_tab_view_list a
                inner join 
                       app.TB_PROJECT_TAB_VIEW a1 
                on     a.TAB_VIEW_NAME=a1.TAB_VIEW_NAME
                inner join 
                       all_objects b 
                on     a.TAB_VIEW_NAME=b.owner||'.'||b.OBJECT_NAME
                and    to_char(b.LAST_DDL_TIME,'yyyymmdd hh24:mi:ss')>a1.UPDATE_TIME
                where  a.project_id=i_project_id
                and    a.project_version=i_project_version
                and    a.IF_UPGRADED='0'
                and    (a.tab_view_name=i_tab_view_name or i_tab_view_name is null)
               ) 
    loop

        /*02.02:*/v_step_msg:='02.02';
        update app.TB_PROJECT_TAB_VIEW a 
        set    a.CREATE_SQL=a.CREATE_SQL||chr(10)||cur.LAST_DDL_TIME||chr(10)||cur.CREATE_SQL||chr(10),
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



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_LOAD
(
    i_etl_sp_name                        IN VARCHAR2 ,
    i_step_seq                           IN VARCHAR2 ,
    i_begin_line                         IN VARCHAR2 ,
    i_user_code                          IN VARCHAR2 ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.2
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤加载
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260126 17:35:15
    -- 修改内容:1.2:
    -- 修改内容:调整自动注释部分代码的识别
    -- 修改内容:1.1:
    -- 修改内容:优化步骤解析
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0.可从数据库程序直接转成步骤配置
    --==============================================================================
    v_start_line                         INTEGER ;
    v_end_line                           INTEGER ;
    v_step_sql                           CLOB ;
    v_step_type                          VARCHAR2(3) ;
    v_step_seq                           VARCHAR2(100) default '01';
    v_target_table                       VARCHAR2(100) ;
    v_ret_code                           INT ;
    v_ret_msg                            VARCHAR2(100) ;
    v_if_union                           CHAR(1) default '0';
    v_load_version                       VARCHAR2(10) ;
    v_step_summary                       VARCHAR2(1000) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:取修订中最新版本*/v_step_msg:='01';
    select coalesce(max(version_id),' ')
    into   v_load_version
    from   app.tb_etl_sp 
    where  etl_sp_name=upper(i_etl_sp_name)
    and    version_status='2'
    ;

        /*02.01:非初始版本不能操作*/
    if v_load_version<>'1.0' THEN

        /*02.02:*/v_step_msg:='02.02';
        o_return_code:=-1;

        /*02.03:*/v_step_msg:='02.03';
        o_return_msg:='修订中1.0版本程序可加载';

        /*02.04:*/v_step_msg:='02.04';
        return;

        /*02.99:*/
    end if;

        /*03.01:完整程序加载*/
    if i_step_seq is null then

        /*03.02:清空步骤及配置*/v_step_msg:='03.02';
        delete from app.tb_etl_sp_step where etl_sp_name=upper(i_etl_sp_name);

        /*03.03:*/v_step_msg:='03.03';
        delete from app.TB_ETL_SP_STEP_INSERT where etl_sp_name=upper(i_etl_sp_name);

        /*03.04:*/v_step_msg:='03.04';
        delete from app.TB_ETL_SP_STEP_join where etl_sp_name=upper(i_etl_sp_name);

        /*03.05:获取代码起始行与结束行*/v_step_msg:='03.05';
        select min(line),
               max(line)
        into   v_start_line,
               v_end_line 
        from   app.tb_dba_source 
        where  etl_sp_name=upper(i_etl_sp_name)
        and    (upper(trim(text)) = 'BEGIN' or upper(trim(rtrim(text,';'))) = 'END');

        /*03.06:加载条件及循环部分*/
    ELSE

        /*03.07:*/v_step_msg:='03.07';
        v_start_line:=i_begin_line;

        /*03.08:*/v_step_msg:='03.08';
        v_end_line:=99999;

        /*03.09:*/v_step_msg:='03.09';
        v_step_seq:='02';

        /*03.99:*/
    end if;

        /*04.01:逐行读取代码并解析*/
    for cur in (select a.etl_sp_name,
                       a.line,
                       replace(case when trim(a.text) like '/*%*/v_step_msg:=%;' or trim(a.text) like '/*%.__:%*/'
                                    then '/*'||substr(a.text,instr(a.text,':')+1,instr(a.text,'*/')+1-instr(a.text,':'))
                                    else a.text
                               end,chr(9),'    ') as line_sql,
                       a.type as object_type
                from   app.tb_dba_source a
                where  a.etl_sp_name=upper(i_etl_sp_name)
                and    a.line>v_start_line
                and    a.line<v_end_line
                and    trim(a.text) is not null
                order by a.line
               )
    loop

            /*04.02.01:完整加载程序碰到exception就退出*/
        if i_step_seq is null and lower(trim(cur.line_sql)) like 'exception' THEN

            /*04.02.02:*/v_step_msg:='04.02.02';
            o_return_msg := cur.line;    

            /*04.02.03:*/v_step_msg:='04.02.03';
            o_return_code := 0;

            /*04.02.04:*/v_step_msg:='04.02.04';
            return;

            /*04.02.99:*/
        end if;

            /*04.03.01:从起始行开始读取    */
        if cur.line>coalesce(v_start_line,0) then

            /*04.03.02:拼接步骤代码*/v_step_msg:='04.03.02';
            v_step_sql:=v_step_sql||case when coalesce(v_step_sql,' ')<>' ' then chr(10) end||cur.line_sql;

                /*04.03.03.01:开头是注释代码的需找到代码起始位置*/
            if lower(trim(v_step_sql)) like '/*%*/%' or lower(trim(v_step_sql)) like '--%'  THEN

                /*04.03.03.02:获取步骤注释*/v_step_msg:='04.03.03.02';
                v_step_summary:=v_step_summary||substr(v_step_sql,
                                                       case when lower(trim(v_step_sql)) like '--%' then instr(v_step_sql,'--')+2
                                                            else instr(v_step_sql,'/*')+2
                                                       end,
                                                       case when lower(trim(v_step_sql)) like '--%' then 999
                                                            else instr(v_step_sql,'*/',-1)-instr(v_step_sql,'/*')-2
                                                       end);

                /*04.03.03.03:取到不带注释的步骤代码*/v_step_msg:='04.03.03.03';
                v_step_sql:=substr(v_step_sql,case when lower(trim(v_step_sql)) like '--%' and instr(v_step_sql,chr(10))>0 
                                                   THEN instr(v_step_sql,chr(10))+1 
                                                   when lower(trim(v_step_sql)) like '--%' 
                                                   then '' 
                                                   else instr(v_step_sql,'*/')+2 
                                              end);

                /*04.03.03.99:*/
            end if;

                /*04.03.04.01:判断是union语句*/
            if lower(trim(cur.line_sql)) like 'union%' and APP.F_IS_IN_PARENTHESES(v_step_sql,length(v_step_sql))='0' then

                /*04.03.04.02:*/v_step_msg:='04.03.04.02';
                v_if_union:='1';

                /*04.03.04.99:*/
            end if;

                /*04.03.05.01:找到代码结束位置*/
            if (lower(trim(v_step_sql)) like '%;' and app.f_is_in_quotes(lower(trim(v_step_sql)),length(lower(trim(v_step_sql))))='0') or 
                lower(trim(v_step_sql)) like '% loop' or lower(trim(v_step_sql))='loop' or
                lower(trim(v_step_sql)) like 'if % then' or 
                lower(trim(v_step_sql)) like 'end loop;' or 
                lower(trim(v_step_sql)) like 'else' or lower(trim(v_step_sql)) like 'elsif %then' or
                lower(trim(v_step_sql)) like 'end if;' THEN

                /*04.03.05.02:确定步骤类别*/v_step_msg:='04.03.05.02';
                v_step_type:=case when lower(trim(v_step_sql)) like 'delete from%' then '1'
                                  when lower(trim(v_step_sql)) like 'insert into%' and v_if_union='0' then '2'
                                  when lower(trim(v_step_sql)) like 'update %' then '3'
                                  when lower(trim(v_step_sql)) like 'select %into %' or (lower(trim(v_step_sql)) like '%:=%' and app.f_is_in_quotes(lower(trim(v_step_sql)),instr(lower(trim(v_step_sql)),':='))='0') then '4'
                                  when lower(trim(v_step_sql)) like '% loop' or lower(trim(v_step_sql))='loop' then '5'
                                  when lower(trim(v_step_sql)) like 'end loop;' then '5.1'
                                  when lower(trim(v_step_sql)) like 'if % then' then '6'
                                  when lower(trim(v_step_sql)) like 'else' or lower(trim(v_step_sql)) like 'elsif %then' then '6.1'
                                  when lower(trim(v_step_sql)) like 'end if;' then '6.2'
                                  else '9'
                             end;

                    /*04.03.05.03.01:删除步骤*/
                if v_step_type='1' THEN

                    /*04.03.05.03.02:获取目标表*/v_step_msg:='04.03.05.03.02';
                    v_target_table := app.F_EXTRACT_DELETE_TABLE(v_step_sql);

                    /*04.03.05.03.03:添加步骤*/v_step_msg:='04.03.05.03.03';
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,v_target_table,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.03.04:步骤号自增*/v_step_msg:='04.03.05.03.04';
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.03.05:步骤代码清空*/v_step_msg:='04.03.05.03.05';
                    v_step_sql:=null;

                    /*04.03.05.03.06:步骤注释清空*/v_step_msg:='04.03.05.03.06';
                    v_step_summary:=null;

                    /*04.03.05.03.99:*/
                end if;

                    /*04.03.05.04.01:插入步骤*/
                if v_step_type='2' THEN

                    /*04.03.05.04.02:获取目标表*/v_step_msg:='04.03.05.04.02';
                    v_target_table := app.F_EXTRACT_INSERT_TABLE(v_step_sql);

                    /*04.03.05.04.03:添加步骤*/v_step_msg:='04.03.05.04.03';
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,v_target_table,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.04.04:步骤号自增*/v_step_msg:='04.03.05.04.04';
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.04.05:步骤代码清空*/v_step_msg:='04.03.05.04.05';
                    v_step_sql:=null;

                    /*04.03.05.04.06:步骤注释清空*/v_step_msg:='04.03.05.04.06';
                    v_step_summary:=null;

                    /*04.03.05.04.99:*/
                end if;

                    /*04.03.05.05.01:更新步骤*/
                if v_step_type='3' THEN

                    /*04.03.05.05.02:获取目标表*/v_step_msg:='04.03.05.05.02';
                    v_target_table := app.F_EXTRACT_UPDATE_TABLE(v_step_sql);

                    /*04.03.05.05.03:添加步骤*/v_step_msg:='04.03.05.05.03';
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,v_target_table,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.05.04:步骤号自增*/v_step_msg:='04.03.05.05.04';
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.05.05:步骤代码清空*/v_step_msg:='04.03.05.05.05';
                    v_step_sql:=null;

                    /*04.03.05.05.06:步骤注释清空*/v_step_msg:='04.03.05.05.06';
                    v_step_summary:=null;

                    /*04.03.05.05.99:*/
                end if;

                    /*04.03.05.06.01:赋值步骤*/
                if v_step_type='4' THEN

                    /*04.03.05.06.02:添加步骤*/v_step_msg:='04.03.05.06.02';
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.06.03:步骤号自增*/v_step_msg:='04.03.05.06.03';
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.06.04:步骤代码清空*/v_step_msg:='04.03.05.06.04';
                    v_step_sql:=null;

                    /*04.03.05.06.05:步骤注释清空*/v_step_msg:='04.03.05.06.05';
                    v_step_summary:=null;

                    /*04.03.05.06.99:*/
                end if;

                    /*04.03.05.07.01:循环步骤*/
                if v_step_type='5' THEN

                    /*04.03.05.07.02:添加步骤*/v_step_msg:='04.03.05.07.02';
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.07.03:加载循环部分代码*/v_step_msg:='04.03.05.07.03';
                    app.PR_ETL_SP_STEP_LOAD(cur.etl_sp_name,case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,cur.line,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.07.04:获取循环返回行号，作为下一步骤的起始行号*/v_step_msg:='04.03.05.07.04';
                    v_start_line:=to_number(v_ret_msg);

                    /*04.03.05.07.05:步骤号自增*/v_step_msg:='04.03.05.07.05';
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.07.06:步骤代码清空*/v_step_msg:='04.03.05.07.06';
                    v_step_sql:=null;

                    /*04.03.05.07.07:步骤注释清空*/v_step_msg:='04.03.05.07.07';
                    v_step_summary:=null;

                    /*04.03.05.07.99:*/
                end if;

                    /*04.03.05.08.01:条件步骤*/
                if v_step_type='6' THEN

                    /*04.03.05.08.02:添加步骤*/v_step_msg:='04.03.05.08.02';
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.08.03:加载条件部分代码*/v_step_msg:='04.03.05.08.03';
                    app.PR_ETL_SP_STEP_LOAD(cur.etl_sp_name,case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,cur.line,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.08.04:获取条件返回行号，作为下一步骤的起始行号*/v_step_msg:='04.03.05.08.04';
                    v_start_line:=to_number(v_ret_msg);

                    /*04.03.05.08.05:步骤号自增*/v_step_msg:='04.03.05.08.05';
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.08.06:步骤代码清空*/v_step_msg:='04.03.05.08.06';
                    v_step_sql:=null;

                    /*04.03.05.08.07:步骤注释清空*/v_step_msg:='04.03.05.08.07';
                    v_step_summary:=null;

                    /*04.03.05.08.99:*/
                end if;

                    /*04.03.05.09.01:条件分支步骤*/
                if v_step_type='6.1' then

                    /*04.03.05.09.02:添加步骤*/v_step_msg:='04.03.05.09.02';
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,'9',v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.09.03:步骤号自增*/v_step_msg:='04.03.05.09.03';
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.09.04:步骤代码清空*/v_step_msg:='04.03.05.09.04';
                    v_step_sql:=null;

                    /*04.03.05.09.05:步骤注释清空*/v_step_msg:='04.03.05.09.05';
                    v_step_summary:=null;

                    /*04.03.05.09.99:*/
                end if;

                    /*04.03.05.10.01:条件、循环结束步骤*/
                if v_step_type in ('5.1','6.2') then

                        /*04.03.05.10.02.01:根步骤处理*/
                    if i_step_seq is null THEN

                        /*04.03.05.10.02.02:*/v_step_msg:='04.03.05.10.02.02';
                        v_start_line := cur.line;

                        /*04.03.05.10.02.03:步骤号自增*/v_step_msg:='04.03.05.10.02.03';
                        v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                        /*04.03.05.10.02.04:步骤代码清空*/v_step_msg:='04.03.05.10.02.04';
                        v_step_sql:=null;

                        /*04.03.05.10.02.05:步骤注释清空*/v_step_msg:='04.03.05.10.02.05';
                        v_step_summary:=null;

                        /*04.03.05.10.02.06:子步骤处理，返回结束行号*/
                    else

                        /*04.03.05.10.02.07:*/v_step_msg:='04.03.05.10.02.07';
                        o_return_msg := cur.line;   

                        /*04.03.05.10.02.08:*/v_step_msg:='04.03.05.10.02.08';
                        o_return_code := 0;

                        /*04.03.05.10.02.09:*/v_step_msg:='04.03.05.10.02.09';
                        return; 

                        /*04.03.05.10.02.99:*/
                    end if;

                    /*04.03.05.10.99:*/
                end if;

                    /*04.03.05.11.01:其他自定义步骤*/
                if v_step_type='9' THEN

                    /*04.03.05.11.02:添加步骤*/v_step_msg:='04.03.05.11.02';
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.11.03:步骤号自增*/v_step_msg:='04.03.05.11.03';
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.11.04:步骤代码清空*/v_step_msg:='04.03.05.11.04';
                    v_step_sql:=null;

                    /*04.03.05.11.05:步骤注释清空*/v_step_msg:='04.03.05.11.05';
                    v_step_summary:=null;

                    /*04.03.05.11.99:*/
                end if;

                /*04.03.05.99:*/
            end if;

            /*04.03.99:*/
        end if;

        /*04.99:*/
    end loop;

    /*05:*/v_step_msg:='05';
    commit;

    /*06:*/v_step_msg:='06';
    o_return_msg := '执行成功';    

    /*07:*/v_step_msg:='07';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'APP.PR_ETL_SP_STEP_LOAD执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



