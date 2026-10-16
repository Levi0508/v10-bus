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
    -- 版    本: 1.1
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 表字段编辑程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251114 17:15:26
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

            /*01.06.01:-循环开始*/o_return_msg:='01.06.01';
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

            /*01.06.02:*/o_return_msg:='01.06.02';
            APP.PR_PROJECT_TAB_VIEW_MOD(cur.project_id,cur.project_version,cur.tab_view_name,'+'||chr(10)||v_sql||';',cur.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

            /*01.06.99:-循环结束*/o_return_msg:='01.06.99';
        end loop;

        /*01.07:执行完退出*/o_return_msg:='01.07';
        o_return_code:=0;
        o_return_msg:='执行成功';
        return;

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

            /*02.06.01:-循环开始*/o_return_msg:='02.06.01';
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

            /*02.06.02:*/o_return_msg:='02.06.02';
            APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

            /*02.06.99:-循环结束*/o_return_msg:='02.06.99';
        end loop;

        /*02.07:执行完不能退出，还有可能需要执行字段注释*/o_return_msg:='02.07';
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

                /*03.03.04.01:-循环开始*/o_return_msg:='03.03.04.01';
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

                /*03.03.04.02:*/o_return_msg:='03.03.04.02';
                APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

                /*03.03.04.99:-循环结束*/o_return_msg:='03.03.04.99';
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

                    /*04.03.03.03.01:-循环开始*/o_return_msg:='04.03.03.03.01';
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

                    /*04.03.03.03.02:*/o_return_msg:='04.03.03.03.02';
                    APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

                    /*04.03.03.03.99:-循环结束*/o_return_msg:='04.03.03.03.99';
                end loop;

                /*04.03.03.04:*/o_return_msg:='04.03.03.04';
            else

                /*04.03.03.05:*/o_return_msg:='04.03.03.05';
                v_return_sql:=v_return_sql||v_sql||';'||chr(10);

                /*04.03.03.99:条件分支04.03.03结束*/o_return_msg:='04.03.03.99';
            end if;

            /*04.03.99:-循环结束*/o_return_msg:='04.03.99';
        end loop;

        /*04.04:执行返回sql*/o_return_msg:='04.04';
        o_return_code:=0;
        o_return_msg:=v_return_sql;
        return;

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

                    /*05.03.03.03.01:-循环开始*/o_return_msg:='05.03.03.03.01';
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

                    /*05.03.03.03.02:*/o_return_msg:='05.03.03.03.02';
                    APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

                    /*05.03.03.03.99:-循环结束*/o_return_msg:='05.03.03.03.99';
                end loop;

                /*05.03.03.04:*/o_return_msg:='05.03.03.04';
            else

                /*05.03.03.05:*/o_return_msg:='05.03.03.05';
                v_return_sql:=v_return_sql||v_sql||';'||chr(10);

                /*05.03.03.99:条件分支05.03.03结束*/o_return_msg:='05.03.03.99';
            end if;

            /*05.03.99:-循环结束*/o_return_msg:='05.03.99';
        end loop;

        /*05.04:执行返回sql*/o_return_msg:='05.04';
        o_return_code:=0;
        o_return_msg:=v_return_sql;
        return;

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

        /*06.04:执行退出*/o_return_msg:='06.04';
        commit;
        o_return_code:=0;
        o_return_msg := '执行成功';
        return;

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

            /*07.06.01:-循环开始*/o_return_msg:='07.06.01';
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

            /*07.06.02:*/o_return_msg:='07.06.02';
            APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

            /*07.06.99:-循环结束*/o_return_msg:='07.06.99';
        end loop;

        /*07.07:执行退出*/o_return_msg:='07.07';
        o_return_code:=0;
        o_return_msg := '执行成功';
        return;

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

            /*08.06.01:-循环开始*/o_return_msg:='08.06.01';
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

            /*08.06.02:*/o_return_msg:='08.06.02';
            APP.PR_PROJECT_TAB_VIEW_MOD(cur_up.project_id,cur_up.project_version,cur_up.tab_view_name,'+'||chr(10)||v_sql||';',cur_up.MODIFY_SUMMARY,'',v_ret_code,v_ret_msg);

            /*08.06.99:-循环结束*/o_return_msg:='08.06.99';
        end loop;

        /*08.07:执行退出*/o_return_msg:='08.07';
        o_return_code:=0;
        o_return_msg := '执行成功';
        return;

        /*08.99:条件分支08结束*/o_return_msg:='08.99';
    end if;

    /*09:*/o_return_msg:='09';
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



