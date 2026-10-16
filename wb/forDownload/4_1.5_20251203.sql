--drop table APP.TB_COLUMNS;
CREATE TABLE "APP"."TB_COLUMNS"
(
"OWNER" VARCHAR2(20) NOT NULL,
"TABLE_NAME" VARCHAR2(100) NOT NULL,
"TABLE_COMMENTS" VARCHAR2(200),
"COLUMN_NAME" VARCHAR2(100) NOT NULL,
"COLUMN_COMMENTS" VARCHAR2(500),
"DATA_TYPE" VARCHAR2(100),
"DATA_PRECISION" NUMBER,
"DATA_SCALE" NUMBER,
"COLUMN_ID" NUMBER,
"TABLE_TYPE" VARCHAR2(10),
"DATA_DEFAULT" VARCHAR2(1000),
"DICT_ENTRY" VARCHAR2(1000),
"IF_LOCKED" CHAR(1),
"NOT_NULL" CHAR(1),
"PRIMARY_KEY" CHAR(1),
"DATA_SOURCE" VARCHAR2(10),
"SYNONYM_TABLE" VARCHAR2(100),
"IF_HIS" CHAR(1),
"DATE_COLUMN" VARCHAR2(50),
"MODIFY_HISTORY" VARCHAR2(8188),
"TABLE_FULL_NAME" VARCHAR2(200),
CONSTRAINT "PK_APP_TB_COLUMNS" NOT CLUSTER PRIMARY KEY("OWNER", "TABLE_NAME", "COLUMN_NAME")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE APP.TB_COLUMNS is '字段明细表';
COMMENT ON COLUMN APP.TB_COLUMNS.COLUMN_COMMENTS is '字段注释';
COMMENT ON COLUMN APP.TB_COLUMNS.COLUMN_ID is '字段序号';
COMMENT ON COLUMN APP.TB_COLUMNS.COLUMN_NAME is '字段名';
COMMENT ON COLUMN APP.TB_COLUMNS.DATA_DEFAULT is '默认值';
COMMENT ON COLUMN APP.TB_COLUMNS.DATA_PRECISION is '';
COMMENT ON COLUMN APP.TB_COLUMNS.DATA_SCALE is '';
COMMENT ON COLUMN APP.TB_COLUMNS.DATA_SOURCE is '';
COMMENT ON COLUMN APP.TB_COLUMNS.DATA_TYPE is '字段类型';
COMMENT ON COLUMN APP.TB_COLUMNS.DATE_COLUMN is '';
COMMENT ON COLUMN APP.TB_COLUMNS.DICT_ENTRY is '字段对应字典代码';
COMMENT ON COLUMN APP.TB_COLUMNS.IF_HIS is '';
COMMENT ON COLUMN APP.TB_COLUMNS.IF_LOCKED is '是否已锁';
COMMENT ON COLUMN APP.TB_COLUMNS.MODIFY_HISTORY is '修改历史';
COMMENT ON COLUMN APP.TB_COLUMNS.NOT_NULL is '是否必填';
COMMENT ON COLUMN APP.TB_COLUMNS.OWNER is '用户';
COMMENT ON COLUMN APP.TB_COLUMNS.PRIMARY_KEY is '是否主键';
COMMENT ON COLUMN APP.TB_COLUMNS.SYNONYM_TABLE is '';
COMMENT ON COLUMN APP.TB_COLUMNS.TABLE_COMMENTS is '表注释';
COMMENT ON COLUMN APP.TB_COLUMNS.TABLE_FULL_NAME is '完整表名';
COMMENT ON COLUMN APP.TB_COLUMNS.TABLE_NAME is '表名';
COMMENT ON COLUMN APP.TB_COLUMNS.TABLE_TYPE is '表或视图';



alter table APP.TB_TEMP_TABLE_CREATE modify TABLE_COMMENTS VARCHAR2(200);


CREATE OR REPLACE PROCEDURE APP.PR_TABLE_COLUMN_EDIT
(
    i_edit_type                          IN VARCHAR2 ,
    i_table_list                         IN VARCHAR2 ,
    i_column_list                        IN VARCHAR2 ,
    i_table_comments                     IN VARCHAR2 ,
    i_column_comments                    IN VARCHAR2 ,
    i_column_data_type                   IN VARCHAR2 ,
    i_column_data_default                IN VARCHAR2 ,
    i_dict_code                          IN VARCHAR2 ,
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
    -- 功能名称: 表字段编辑程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251203 11:16:01
    -- 修改内容:1.3:
    -- 修改内容:修改完后增加刷新表字段明细步骤，删除不必要的返回步骤
    -- 修改内容:1.2:
    -- 修改内容:增加记录表修改历史功能
    -- 修改内容:1.1:
    -- 修改内容:修复重复记录表字段修改脚本的bug
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_table_name                         VARCHAR2(100) ;
    v_table_type                         VARCHAR2(100) ;
    v_column_name                        VARCHAR2(100) default case when i_column_list like '%|%' then substr(i_column_list,instr(i_column_list,'|')+1) else i_column_list end;
    v_column_name_new                    VARCHAR2(100) default case when i_column_list like '%|%' then substr(i_column_list,1,instr(i_column_list,'|')-1) else '' end;
    v_sql                                VARCHAR2(1000) ;--
    v_ret_code                           INT ;
    v_ret_msg                            VARCHAR2(100) ;
    v_return_sql                         VARCHAR2(4000) ;--返回sql
BEGIN
        /*01.01:条件:编辑表注释，只能单表*/o_return_msg:='01.01';
    if I_EDIT_TYPE='TABLE_COMMENTS' then

            /*01.02.01:条件:*/o_return_msg:='01.02.01';
        if I_TABLE_LIST like '%,%' or I_TABLE_LIST like '%'||chr(10)||'%' then

            /*01.02.02:*/o_return_msg:='01.02.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑单表';
            return;

            /*01.02.99:条件分支01.02结束*/o_return_msg:='01.02.99';
        end if;

        /*01.03:*/o_return_msg:='01.03';
        select distinct a.owner||'.'||a.table_name,
               a.table_type
        into   v_table_name,
               v_table_type
        from   app.vw_columns a
        where  a.owner||'.'||a.table_name=upper(I_TABLE_LIST)
        ;

        /*01.04:*/o_return_msg:='01.04';
        v_sql:='comment on '||v_table_type||' '||v_table_name||' is '''||I_TABLE_COMMENTS||'''';

        /*01.05:*/o_return_msg:='01.05';
        execute immediate v_sql;

        /*01.06:记录修改历史*/o_return_msg:='01.06';
        update app.tb_table_props a 
        set    a.modify_history=a.modify_history||chr(10)||v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss')
        where  a.owner||'.'||a.table_name=upper(I_TABLE_LIST);

        /*01.07:*/o_return_msg:='01.07';
        insert into APP.TB_TABLE_PROPS
        (
               OWNER,
               TABLE_NAME,
               MODIFY_HISTORY
        )
        select 
               substr(v_table_name,1,instr(v_table_name,'.')-1) as OWNER,
               substr(v_table_name,instr(v_table_name,'.')+1) as TABLE_NAME,
               v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss') as MODIFY_HISTORY
        from   
               dual a
        where  not exists(select 1 from app.tb_table_props b 
                          where  b.owner=substr(v_table_name,1,instr(v_table_name,'.')-1)
                          and    b.table_name=substr(v_table_name,instr(v_table_name,'.')+1));

            /*01.08.01:-循环开始*/o_return_msg:='01.08.01';
        for cur in (select a.tab_view_name,a.project_id,b.PROJECT_VERSION,a.MODIFY_SUMMARY
                    from   app.tb_project_tab_view_list a 
                    inner join 
                           app.tb_project b 
                    on     a.project_id=b.PROJECT_ID
                    and    a.project_version=b.project_version
                    and    b.IF_UPGRADED='0'
                    where  a.tab_view_name=upper(I_TABLE_LIST)
                    and    nvl(a.MODIFY_SQL,' ')<> 'use ddl'
                   )
        loop

            /*01.08.02:*/o_return_msg:='01.08.02';
            APP.PR_PROJECT_TAB_VIEW_MOD(cur.project_id,cur.project_version,cur.tab_view_name,'+'||chr(10)||v_sql||';',cur.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

            /*01.08.99:-循环结束*/o_return_msg:='01.08.99';
        end loop;

        /*01.99:条件分支01结束*/o_return_msg:='01.99';
    end if;

        /*02.01:条件:添加字段*/o_return_msg:='02.01';
    if I_EDIT_TYPE in ('COLUMN_ADD') THEN

            /*02.02.01:条件:*/o_return_msg:='02.02.01';
        if I_COLUMN_LIST like '%,%' or I_COLUMN_LIST like '%'||chr(10)||'%' then

            /*02.02.02:*/o_return_msg:='02.02.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑同名字段';
            return;

            /*02.02.99:条件分支02.02结束*/o_return_msg:='02.02.99';
        end if;

            /*02.03.01:条件:*/o_return_msg:='02.03.01';
        if I_TABLE_LIST like '%,%' or I_TABLE_LIST like '%'||chr(10)||'%' then

            /*02.03.02:*/o_return_msg:='02.03.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑单表';
            return;

            /*02.03.99:条件分支02.03结束*/o_return_msg:='02.03.99';
        end if;

        /*02.04:*/o_return_msg:='02.04';
        v_sql:='alter table '||i_table_list||' add column '||v_column_name||' '||i_column_data_type||case when i_column_data_default is not null then ' default '||i_column_data_default else '' end;

        /*02.05:*/o_return_msg:='02.05';
        execute immediate v_sql;

        /*02.06:记录修改历史*/o_return_msg:='02.06';
        update app.tb_table_props a 
        set    a.modify_history=a.modify_history||chr(10)||v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss')
        where  a.owner||'.'||a.table_name=upper(I_TABLE_LIST);

        /*02.07:*/o_return_msg:='02.07';
        insert into APP.TB_TABLE_PROPS
        (
               OWNER,
               TABLE_NAME,
               MODIFY_HISTORY
        )
        select 
               substr(upper(i_table_list),1,instr(upper(i_table_list),'.')-1) as OWNER,
               substr(upper(i_table_list),instr(upper(i_table_list),'.')+1) as TABLE_NAME,
               v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss') as MODIFY_HISTORY
        from   
               dual a
        where  not exists(select 1 from app.tb_table_props b 
                          where  b.owner=substr(upper(i_table_list),1,instr(upper(i_table_list),'.')-1)
                          and    b.table_name=substr(upper(i_table_list),instr(upper(i_table_list),'.')+1));

            /*02.08.01:-循环开始*/o_return_msg:='02.08.01';
        for cur_up in (select a.tab_view_name,a.project_id,b.PROJECT_VERSION,a.MODIFY_SUMMARY
                        from   app.tb_project_tab_view_list a 
                        inner join 
                               app.tb_project b 
                        on     a.project_id=b.PROJECT_ID
                        and    a.project_version=b.project_version
                        and    b.IF_UPGRADED='0'
                        where  a.tab_view_name=upper(i_table_list)
                        and    nvl(a.MODIFY_SQL,' ')<> 'use ddl'
                       )
        loop

            /*02.08.02:*/o_return_msg:='02.08.02';
            APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

            /*02.08.99:-循环结束*/o_return_msg:='02.08.99';
        end loop;

        /*02.09:执行完不能退出，还有可能需要执行字段注释*/o_return_msg:='02.09';
        o_return_msg := '执行成功';

        /*02.99:条件分支02结束*/o_return_msg:='02.99';
    end if;

        /*03.01:条件:编辑字段注释，允许多个表相同字段批量编辑，表之间用回车或逗号分割*/o_return_msg:='03.01';
    if I_EDIT_TYPE in('COLUMN_COMMENTS','COLUMN_ADD') then

            /*03.02.01:条件:*/o_return_msg:='03.02.01';
        if I_COLUMN_LIST like '%,%' or I_COLUMN_LIST like '%'||chr(10)||'%' then

            /*03.02.02:*/o_return_msg:='03.02.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑同名字段';
            return;

            /*03.02.99:条件分支03.02结束*/o_return_msg:='03.02.99';
        end if;

            /*03.03.01:-循环开始*/o_return_msg:='03.03.01';
        for cur in (select a.owner||'.'||a.table_name as table_name,
                           a.column_name 
                    from   app.vw_columns a
                    where  (instr(chr(10)||upper(I_TABLE_LIST)||chr(10),chr(10)||a.owner||'.'||a.table_name||chr(10))>0 or instr(','||upper(I_TABLE_LIST)||',',','||a.owner||'.'||a.table_name||',')>0)
                    and    a.column_name=upper(I_COLUMN_LIST)
                   )
        loop

            /*03.03.02:*/o_return_msg:='03.03.02';
            v_sql:='comment on column '||cur.table_name||'.'||cur.COLUMN_name||' is '''||I_COLUMN_COMMENTS||'''';

            /*03.03.03:*/o_return_msg:='03.03.03';
            execute immediate v_sql;

            /*03.03.04:记录修改历史*/o_return_msg:='03.03.04';
            update app.tb_table_props a 
            set    a.modify_history=a.modify_history||chr(10)||v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss')
            where  a.owner||'.'||a.table_name=cur.table_name;

            /*03.03.05:*/o_return_msg:='03.03.05';
            insert into APP.TB_TABLE_PROPS
            (
                   OWNER,
                   TABLE_NAME,
                   MODIFY_HISTORY
            )
            select 
                   substr(cur.table_name,1,instr(cur.table_name,'.')-1) as OWNER,
                   substr(cur.table_name,instr(cur.table_name,'.')+1) as TABLE_NAME,
                   v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss') as MODIFY_HISTORY
            from   
                   dual a
            where  not exists(select 1 from app.tb_table_props b 
                              where  b.owner=substr(cur.table_name,1,instr(cur.table_name,'.')-1)
                              and    b.table_name=substr(cur.table_name,instr(cur.table_name,'.')+1));

                /*03.03.06.01:-循环开始*/o_return_msg:='03.03.06.01';
            for cur_up in (select a.tab_view_name,a.project_id,b.PROJECT_VERSION,a.MODIFY_SUMMARY
                            from   app.tb_project_tab_view_list a 
                            inner join 
                                   app.tb_project b 
                            on     a.project_id=b.PROJECT_ID
                            and    a.project_version=b.project_version
                            and    b.IF_UPGRADED='0'
                            where  a.tab_view_name=cur.table_name
                            and    nvl(a.MODIFY_SQL,' ')<> 'use ddl'
                           )
            loop

                /*03.03.06.02:*/o_return_msg:='03.03.06.02';
                APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

                /*03.03.06.99:-循环结束*/o_return_msg:='03.03.06.99';
            end loop;

            /*03.03.99:-循环结束*/o_return_msg:='03.03.99';
        end loop;

        /*03.04:执行完不能退出，可能还有新建字段设置字典*/o_return_msg:='03.04';
        o_return_msg:='执行成功';

        /*03.99:条件分支03结束*/o_return_msg:='03.99';
    end if;

        /*04.01:条件:编辑字段类型，允许多个表相同字段批量编辑，表之间用回车或逗号分割，COLUMN_DATA_TYPE仅返回脚本，不执行*/o_return_msg:='04.01';
    if I_EDIT_TYPE in ('COLUMN_DATA_TYPE','COLUMN_DATA_TYPE_UPGRADE') then

            /*04.02.01:条件:*/o_return_msg:='04.02.01';
        if I_COLUMN_LIST like '%,%' or I_COLUMN_LIST like '%'||chr(10)||'%' then

            /*04.02.02:*/o_return_msg:='04.02.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑同名字段';
            return;

            /*04.02.99:条件分支04.02结束*/o_return_msg:='04.02.99';
        end if;

            /*04.03.01:-循环开始*/o_return_msg:='04.03.01';
        for cur in (select a.owner||'.'||a.table_name as table_name,
                           a.column_name 
                    from   app.vw_columns a
                    where  (instr(chr(10)||upper(I_TABLE_LIST)||chr(10),chr(10)||a.owner||'.'||a.table_name||chr(10))>0 or instr(','||upper(I_TABLE_LIST)||',',','||a.owner||'.'||a.table_name||',')>0)
                    and    a.column_name=upper(I_COLUMN_LIST)
                    and    a.TABLE_TYPE='TABLE'
                   )
        loop

            /*04.03.02:*/o_return_msg:='04.03.02';
            v_sql:='alter table '||cur.table_name||' modify '||cur.COLUMN_name||' '||I_COLUMN_DATA_TYPE;

                /*04.03.03.01:条件:*/o_return_msg:='04.03.03.01';
            if I_EDIT_TYPE='COLUMN_DATA_TYPE_UPGRADE' then

                /*04.03.03.02:*/o_return_msg:='04.03.03.02';
                execute immediate v_sql;

                /*04.03.03.03:记录修改历史*/o_return_msg:='04.03.03.03';
                update app.tb_table_props a 
                set    a.modify_history=a.modify_history||chr(10)||v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss')
                where  a.owner||'.'||a.table_name=cur.table_name;

                /*04.03.03.04:*/o_return_msg:='04.03.03.04';
                insert into APP.TB_TABLE_PROPS
                (
                       OWNER,
                       TABLE_NAME,
                       MODIFY_HISTORY
                )
                select 
                       substr(cur.table_name,1,instr(cur.table_name,'.')-1) as OWNER,
                       substr(cur.table_name,instr(cur.table_name,'.')+1) as TABLE_NAME,
                       v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss') as MODIFY_HISTORY
                from   
                       dual a
                where  not exists(select 1 from app.tb_table_props b 
                                  where  b.owner=substr(cur.table_name,1,instr(cur.table_name,'.')-1)
                                  and    b.table_name=substr(cur.table_name,instr(cur.table_name,'.')+1));

                    /*04.03.03.05.01:-循环开始*/o_return_msg:='04.03.03.05.01';
                for cur_up in (select a.tab_view_name,a.project_id,b.PROJECT_VERSION,a.MODIFY_SUMMARY
                                from   app.tb_project_tab_view_list a 
                                inner join 
                                       app.tb_project b 
                                on     a.project_id=b.PROJECT_ID
                                and    a.project_version=b.project_version
                                and    b.IF_UPGRADED='0'
                                where  a.tab_view_name=cur.table_name
                                and    nvl(a.MODIFY_SQL,' ')<> 'use ddl'
                               )
                loop

                    /*04.03.03.05.02:*/o_return_msg:='04.03.03.05.02';
                    APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

                    /*04.03.03.05.99:-循环结束*/o_return_msg:='04.03.03.05.99';
                end loop;

                /*04.03.03.06:*/o_return_msg:='04.03.03.06';
            else

                /*04.03.03.07:*/o_return_msg:='04.03.03.07';
                v_return_sql:=v_return_sql||v_sql||';'||chr(10);

                /*04.03.03.99:条件分支04.03.03结束*/o_return_msg:='04.03.03.99';
            end if;

            /*04.03.99:-循环结束*/o_return_msg:='04.03.99';
        end loop;

            /*04.04.01:条件:返回脚本*/o_return_msg:='04.04.01';
        if I_EDIT_TYPE='COLUMN_DATA_TYPE' then

            /*04.04.02:*/o_return_msg:='04.04.02';
            o_return_code:=0;
            o_return_msg:=v_return_sql;
            return;

            /*04.04.99:条件分支04.04结束*/o_return_msg:='04.04.99';
        end if;

        /*04.99:条件分支04结束*/o_return_msg:='04.99';
    end if;

        /*05.01:条件:编辑字段默认值，COLUMN_DATA_DEFAULT仅返回脚本*/o_return_msg:='05.01';
    if I_EDIT_TYPE in ('COLUMN_DATA_DEFAULT','COLUMN_DATA_DEFAULT_UPGRADE') then

            /*05.02.01:条件:*/o_return_msg:='05.02.01';
        if I_COLUMN_LIST like '%,%' or I_COLUMN_LIST like '%'||chr(10)||'%' then

            /*05.02.02:*/o_return_msg:='05.02.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑同名字段';
            return;

            /*05.02.99:条件分支05.02结束*/o_return_msg:='05.02.99';
        end if;

            /*05.03.01:-循环开始*/o_return_msg:='05.03.01';
        for cur in (select a.owner||'.'||a.table_name as table_name,
                           a.column_name 
                    from   app.vw_columns a
                    where  (instr(chr(10)||upper(I_TABLE_LIST)||chr(10),chr(10)||a.owner||'.'||a.table_name||chr(10))>0 or instr(','||upper(I_TABLE_LIST)||',',','||a.owner||'.'||a.table_name||',')>0)
                    and    a.column_name=upper(I_COLUMN_LIST)
                    and    a.TABLE_TYPE='TABLE'
                   )
        loop

            /*05.03.02:*/o_return_msg:='05.03.02';
            v_sql:='alter table '||cur.table_name||case when I_COLUMN_DATA_DEFAULT is null then ' alter column ' else ' modify ' end||cur.COLUMN_name||case when I_COLUMN_DATA_DEFAULT is null then ' drop default ' else ' default '||I_COLUMN_DATA_DEFAULT end;

                /*05.03.03.01:条件:*/o_return_msg:='05.03.03.01';
            if I_EDIT_TYPE='COLUMN_DATA_DEFAULT_UPGRADE' then

                /*05.03.03.02:*/o_return_msg:='05.03.03.02';
                execute immediate v_sql;

                /*05.03.03.03:记录修改历史*/o_return_msg:='05.03.03.03';
                  update app.tb_table_props a 
                        set    a.modify_history=a.modify_history||chr(10)||v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss')
                        where  a.owner||'.'||a.table_name=cur.table_name;

                /*05.03.03.04:*/o_return_msg:='05.03.03.04';
                insert into APP.TB_TABLE_PROPS
                (
                       OWNER,
                       TABLE_NAME,
                       MODIFY_HISTORY
                )
                select 
                       substr(cur.table_name,1,instr(cur.table_name,'.')-1) as OWNER,
                       substr(cur.table_name,instr(cur.table_name,'.')+1) as TABLE_NAME,
                       v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss') as MODIFY_HISTORY
                from   
                       dual a
                where  not exists(select 1 from app.tb_table_props b 
                                  where  b.owner=substr(cur.table_name,1,instr(cur.table_name,'.')-1)
                                  and    b.table_name=substr(cur.table_name,instr(cur.table_name,'.')+1));

                    /*05.03.03.05.01:-循环开始*/o_return_msg:='05.03.03.05.01';
                for cur_up in (select a.tab_view_name,a.project_id,b.PROJECT_VERSION,a.MODIFY_SUMMARY
                                from   app.tb_project_tab_view_list a 
                                inner join 
                                       app.tb_project b 
                                on     a.project_id=b.PROJECT_ID
                                and    a.project_version=b.project_version
                                and    b.IF_UPGRADED='0'
                                where  a.tab_view_name=cur.table_name
                                and    nvl(a.MODIFY_SQL,' ')<> 'use ddl'
                               )
                loop

                    /*05.03.03.05.02:*/o_return_msg:='05.03.03.05.02';
                    APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

                    /*05.03.03.05.99:-循环结束*/o_return_msg:='05.03.03.05.99';
                end loop;

                /*05.03.03.06:*/o_return_msg:='05.03.03.06';
            else

                /*05.03.03.07:*/o_return_msg:='05.03.03.07';
                v_return_sql:=v_return_sql||v_sql||';'||chr(10);

                /*05.03.03.99:条件分支05.03.03结束*/o_return_msg:='05.03.03.99';
            end if;

            /*05.03.99:-循环结束*/o_return_msg:='05.03.99';
        end loop;

            /*05.04.01:条件:返回脚本*/o_return_msg:='05.04.01';
        if I_EDIT_TYPE='COLUMN_DATA_DEFAULT' then

            /*05.04.02:*/o_return_msg:='05.04.02';
            o_return_code:=0;
            o_return_msg:=v_return_sql;
            return;

            /*05.04.99:条件分支05.04结束*/o_return_msg:='05.04.99';
        end if;

        /*05.99:条件分支05结束*/o_return_msg:='05.99';
    end if;

        /*06.01:条件:编辑字段字典代码*/o_return_msg:='06.01';
    if I_EDIT_TYPE in ('COLUMN_DICT_CODE' ,'COLUMN_ADD') then

            /*06.02.01:条件:*/o_return_msg:='06.02.01';
        if I_COLUMN_LIST like '%,%' or I_COLUMN_LIST like '%'||chr(10)||'%' then

            /*06.02.02:*/o_return_msg:='06.02.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑同名字段';
            return;

            /*06.02.99:条件分支06.02结束*/o_return_msg:='06.02.99';
        end if;

            /*06.03.01:-循环开始*/o_return_msg:='06.03.01';
        for cur in (select a.owner||'.'||a.table_name as table_name,
                           a.column_name,
                           a.COLUMN_COMMENTS 
                    from   app.vw_columns a
                    where  (instr(chr(10)||upper(I_TABLE_LIST)||chr(10),chr(10)||a.owner||'.'||a.table_name||chr(10))>0 or instr(','||upper(I_TABLE_LIST)||',',','||a.owner||'.'||a.table_name||',')>0)
                    and    a.column_name=upper(I_COLUMN_LIST)
                    and    a.TABLE_TYPE='TABLE'
                   )
        loop

            /*06.03.02:*/o_return_msg:='06.03.02';
            delete from APP.TB_COLUMN_DICT_ENTRY a
            where a.table_name=cur.table_name
            and   a.column_name=cur.column_name;

            /*06.03.03:*/o_return_msg:='06.03.03';
            insert into APP.TB_COLUMN_DICT_ENTRY
            (
                   TABLE_NAME,
                   COLUMN_NAME,
                   DICT_ENTRY,
                   COLUMN_DESC
            )
            select 
                   cur.table_name as TABLE_NAME,
                   cur.column_name as COLUMN_NAME,
                   i_dict_code as DICT_ENTRY,
                   cur.column_comments as COLUMN_DESC
            from   
                   DUAL a
            where  i_dict_code is not null
            and    not exists(select 1 from app.TB_COLUMN_DICT_ENTRY where table_name=cur.table_name and column_name=cur.column_name)
            ;

            /*06.03.99:-循环结束*/o_return_msg:='06.03.99';
        end loop;

        /*06.99:条件分支06结束*/o_return_msg:='06.99';
    end if;

        /*07.01:条件:编辑字段名*/o_return_msg:='07.01';
    if I_EDIT_TYPE in ('COLUMN_NAME_RENAME') then

            /*07.02.01:条件:*/o_return_msg:='07.02.01';
        if I_COLUMN_LIST like '%,%' or I_COLUMN_LIST like '%'||chr(10)||'%' then

            /*07.02.02:*/o_return_msg:='07.02.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑同名字段';
            return;

            /*07.02.99:条件分支07.02结束*/o_return_msg:='07.02.99';
        end if;

            /*07.03.01:条件:*/o_return_msg:='07.03.01';
        if I_TABLE_LIST like '%,%' or I_TABLE_LIST like '%'||chr(10)||'%' then

            /*07.03.02:*/o_return_msg:='07.03.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑单表';
            return;

            /*07.03.99:条件分支07.03结束*/o_return_msg:='07.03.99';
        end if;

        /*07.04:*/o_return_msg:='07.04';
        v_sql:='alter table '||i_table_list||' alter column '||v_column_name||' rename to '||v_column_name_new;

        /*07.05:*/o_return_msg:='07.05';
        execute immediate v_sql;

        /*07.06:记录修改历史*/o_return_msg:='07.06';
          update app.tb_table_props a 
                set    a.modify_history=a.modify_history||chr(10)||v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss')
                where  a.owner||'.'||a.table_name=upper(i_table_list);

        /*07.07:*/o_return_msg:='07.07';
        insert into APP.TB_TABLE_PROPS
        (
               OWNER,
               TABLE_NAME,
               MODIFY_HISTORY
        )
        select 
               substr(upper(i_table_list),1,instr(upper(i_table_list),'.')-1) as OWNER,
               substr(upper(i_table_list),instr(upper(i_table_list),'.')+1) as TABLE_NAME,
               v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss') as MODIFY_HISTORY
        from   
               dual a
        where  not exists(select 1 from app.tb_table_props b 
                          where  b.owner=substr(upper(i_table_list),1,instr(upper(i_table_list),'.')-1)
                          and    b.table_name=substr(upper(i_table_list),instr(upper(i_table_list),'.')+1));

            /*07.08.01:-循环开始*/o_return_msg:='07.08.01';
        for cur_up in (select a.tab_view_name,a.project_id,b.PROJECT_VERSION,a.MODIFY_SUMMARY
                        from   app.tb_project_tab_view_list a 
                        inner join 
                               app.tb_project b 
                        on     a.project_id=b.PROJECT_ID
                        and    a.project_version=b.project_version
                        and    b.IF_UPGRADED='0'
                        where  a.tab_view_name=upper(i_table_list)
                        and    nvl(a.MODIFY_SQL,' ')<> 'use ddl'
                       )
        loop

            /*07.08.02:*/o_return_msg:='07.08.02';
            APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

            /*07.08.99:-循环结束*/o_return_msg:='07.08.99';
        end loop;

        /*07.99:条件分支07结束*/o_return_msg:='07.99';
    end if;

        /*08.01:条件:删除字段*/o_return_msg:='08.01';
    if I_EDIT_TYPE in ('COLUMN_DROP') then

            /*08.02.01:条件:*/o_return_msg:='08.02.01';
        if I_COLUMN_LIST like '%,%' or I_COLUMN_LIST like '%'||chr(10)||'%' then

            /*08.02.02:*/o_return_msg:='08.02.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑同名字段';
            return;

            /*08.02.99:条件分支08.02结束*/o_return_msg:='08.02.99';
        end if;

            /*08.03.01:条件:*/o_return_msg:='08.03.01';
        if I_TABLE_LIST like '%,%' or I_TABLE_LIST like '%'||chr(10)||'%' then

            /*08.03.02:*/o_return_msg:='08.03.02';
            o_return_code := -1;
            o_return_msg := '只允许编辑单表';
            return;

            /*08.03.99:条件分支08.03结束*/o_return_msg:='08.03.99';
        end if;

        /*08.04:*/o_return_msg:='08.04';
        v_sql:='alter table '||i_table_list||' drop column '||v_column_name;

        /*08.05:*/o_return_msg:='08.05';
        execute immediate v_sql;

        /*08.06:记录修改历史*/o_return_msg:='08.06';
          update app.tb_table_props a 
                set    a.modify_history=a.modify_history||chr(10)||v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss')
                where  a.owner||'.'||a.table_name=upper(i_table_list);

        /*08.07:*/o_return_msg:='08.07';
        insert into APP.TB_TABLE_PROPS
        (
               OWNER,
               TABLE_NAME,
               MODIFY_HISTORY
        )
        select 
               substr(upper(i_table_list),1,instr(upper(i_table_list),'.')-1) as OWNER,
               substr(upper(i_table_list),instr(upper(i_table_list),'.')+1) as TABLE_NAME,
               v_sql||chr(10)||to_char(sysdate,'YYYYMMDD hh24:mi:ss') as MODIFY_HISTORY
        from   
               dual a
        where  not exists(select 1 from app.tb_table_props b 
                          where  b.owner=substr(upper(i_table_list),1,instr(upper(i_table_list),'.')-1)
                          and    b.table_name=substr(upper(i_table_list),instr(upper(i_table_list),'.')+1));

            /*08.08.01:-循环开始*/o_return_msg:='08.08.01';
        for cur_up in (select a.tab_view_name,a.project_id,b.PROJECT_VERSION,a.MODIFY_SUMMARY
                        from   app.tb_project_tab_view_list a 
                        inner join 
                               app.tb_project b 
                        on     a.project_id=b.PROJECT_ID
                        and    a.project_version=b.project_version
                        and    b.IF_UPGRADED='0'
                        where  a.tab_view_name=upper(i_table_list)
                        and    nvl(a.MODIFY_SQL,' ')<> 'use ddl'
                       )
        loop

            /*08.08.02:*/o_return_msg:='08.08.02';
            APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

            /*08.08.99:-循环结束*/o_return_msg:='08.08.99';
        end loop;

        /*08.99:条件分支08结束*/o_return_msg:='08.99';
    end if;

    /*09:删除旧表字段明细*/o_return_msg:='09';
    delete from app.tb_columns where instr(','||i_table_list||',',','||table_full_name||',')>0 or instr(chr(10)||i_table_list||chr(10),chr(10)||owner||'.'||table_name||chr(10))>0;

    /*10:刷新表字段明细*/o_return_msg:='10';
    insert into APP.TB_COLUMNS
    (
           OWNER,
           TABLE_NAME,
           TABLE_COMMENTS,
           COLUMN_NAME,
           COLUMN_COMMENTS,
           DATA_TYPE,
           DATA_PRECISION,
           DATA_SCALE,
           COLUMN_ID,
           TABLE_TYPE,
           DATA_DEFAULT,
           DICT_ENTRY,
           IF_LOCKED,
           NOT_NULL,
           PRIMARY_KEY,
           DATA_SOURCE,
           SYNONYM_TABLE,
           IF_HIS,
           DATE_COLUMN,
           MODIFY_HISTORY,
           TABLE_FULL_NAME
    )
    select 
           OWNER as OWNER,
           TABLE_NAME as TABLE_NAME,
           TABLE_COMMENTS as TABLE_COMMENTS,
           COLUMN_NAME as COLUMN_NAME,
           COLUMN_COMMENTS as COLUMN_COMMENTS,
           DATA_TYPE as DATA_TYPE,
           DATA_PRECISION as DATA_PRECISION,
           DATA_SCALE as DATA_SCALE,
           COLUMN_ID as COLUMN_ID,
           TABLE_TYPE as TABLE_TYPE,
           DATA_DEFAULT as DATA_DEFAULT,
           DICT_ENTRY as DICT_ENTRY,
           IF_LOCKED as IF_LOCKED,
           NOT_NULL as NOT_NULL,
           PRIMARY_KEY as PRIMARY_KEY,
           DATA_SOURCE as DATA_SOURCE,
           SYNONYM_TABLE as SYNONYM_TABLE,
           IF_HIS as IF_HIS,
           DATE_COLUMN as DATE_COLUMN,
           MODIFY_HISTORY as MODIFY_HISTORY,
           OWNER||'.'||TABLE_NAME as TABLE_FULL_NAME
    from   
           APP.VW_COLUMNS a
    where  instr(','||i_table_list||',',','||owner||'.'||table_name||',')>0 or instr(chr(10)||i_table_list||chr(10),chr(10)||owner||'.'||table_name||chr(10))>0;

    /*11:*/o_return_msg:='11';
    commit;
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
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_TABLE_COLUMN_EDIT执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_TABLE_COLUMN_Q
(
    i_if_modified_recently               IN CHAR(1) ,--是否近期修改
    i_table_search                       IN VARCHAR2 ,
    i_column_search                      IN VARCHAR2 ,
    i_project_id                         IN VARCHAR2 ,
    i_data_source                        IN VARCHAR2 ,
    i_table_type                         IN VARCHAR2 ,
    rt_cursor                            OUT CURSOR ,
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
    -- 功能名称: 表字段配置查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251203 08:27:51
    -- 修改内容:1.2:
    -- 修改内容:替换视图app.vw_columns，提升效率
    -- 修改内容:1.1:
    -- 修改内容:增加显示表修改历史,增加查询近期变动功能
    -- 修改内容:1.0:
    -- 修改内容:达梦1.0版
    --==============================================================================
    v_recent_date                        CHAR(8) default app.get_n_tradedate(to_char(sysdate,'YYYYMMDD'),-5);--近期开始日期
BEGIN
    /*01:*/o_return_msg:='01';
    open rt_cursor FOR
    SELECT
        a.OWNER,
        a.TABLE_NAME,
        a.TABLE_COMMENTS,
        a.COLUMN_NAME,
        a.COLUMN_COMMENTS,
        a.DATA_TYPE,
        a.DATA_PRECISION,
        a.DATA_SCALE,
        a.COLUMN_ID,
        a.TABLE_TYPE,
        a.DATA_DEFAULT,
        a.DICT_ENTRY,
        a.if_locked,
        a.TABLE_TYPE,
        a.NOT_NULL,
        a.PRIMARY_KEY,
        a.DATA_SOURCE,
        a.SYNONYM_TABLE,
        a.IF_HIS,
        case when a.COLUMN_NAME=a.DATE_COLUMN then '1' else '0' end as IF_DATE_COLUMN,
        a.DATE_COLUMN,
        a.MODIFY_HISTORY
    from 
        app.tb_columns a
    where 
        (  (a.table_name=upper(I_TABLE_SEARCH) and I_TABLE_SEARCH not like '%.%') 
        or a.owner||'.'||a.table_name=upper(I_TABLE_SEARCH) 
        or a.SYNONYM_TABLE=upper(I_TABLE_SEARCH) 
        or exists(select 1 from app.tb_dependencies c 
                   where c.object_name=upper(I_TABLE_SEARCH) 
                     and c.referenced_type in ('TABLE','VIEW') 
                     and a.table_full_name=c.referenced_object
                 )
        or I_TABLE_SEARCH is null)
    and (a.table_type=i_table_type or i_table_type is null)
    and (instr(a.column_name,I_COLUMN_SEARCH)>0 or instr(a.column_comments,I_COLUMN_SEARCH)>0 or I_COLUMN_SEARCH is null)
    and (exists(select 1 from app.tb_project_tab_view_list b where b.project_id=i_project_id and b.tab_view_name=a.table_full_name) or i_project_id is null)
    and (a.DATA_SOURCE=i_data_source or i_data_source is null)
    and (i_if_modified_recently='1' and exists(select 1 from app.tb_tradedate b 
                                               where  instr(a.MODIFY_HISTORY,chr(10)||b.tradedate)>0
                                               and    b.tradedate between v_recent_date and to_char(sysdate,'YYYYMMDD')
                                              )
         or coalesce(i_if_modified_recently,'0')<>'1'
        )
    order by a.owner,a.table_name,a.column_id
    ;

    /*02:*/o_return_msg:='02';
    o_return_code := 0;
    o_return_msg := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_TABLE_COLUMN_Q执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



