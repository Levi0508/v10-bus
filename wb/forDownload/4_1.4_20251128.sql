
alter table APP.TB_TABLE_PROPS add column MODIFY_HISTORY VARCHAR2(8188);
comment on column APP.TB_TABLE_PROPS.MODIFY_HISTORY is '修改历史';
comment on TABLE APP.TB_TABLE_PROPS is '表属性配置表1';
comment on TABLE APP.TB_TABLE_PROPS is '表属性配置表';


CREATE OR REPLACE PROCEDURE APP.PR_TABLE_CREATE_SQL_Q
(
    i_table_create                       IN VARCHAR2 ,
    i_database_type                      IN VARCHAR2 ,
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
    -- 功能名称: 查询待创建表的建表脚本程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251128 14:45:11
    -- 修改内容:1.1:
    -- 修改内容:增加支持的字段类型互相转换,NUMBER转DECIMAL,TEXT转CLOB
    -- 修改内容:1.0:
    -- 修改内容:达梦1.0版本
    --==============================================================================
    v_create_sql                         VARCHAR2 ;
    v_primary_key_sql                    VARCHAR2 ;
    v_comments_sql                       VARCHAR2 ;
BEGIN
    /*01:*/o_return_msg:='01';
    v_create_sql:=case when i_database_type='SQLSERVER' 
                       then 'use ['||substr(i_table_create,1,instr(i_table_create,'.')-1)||']'||chr(10)||
                            'create table dbo'||substr(i_table_create,instr(i_table_create,'.'))||chr(10)||'('||chr(10)
                       else 'create table '||i_table_create||chr(10)||'('||chr(10) end;

        /*02.01:-循环开始*/o_return_msg:='02.01';
    for cur in (select 
                    a.TABLE_COMMENTS,
                    a.COLUMN_NAME,
                    a.COLUMN_COMMENTS,
                    case when i_database_type='SQLSERVER' then replace(replace(replace(replace(replace(a.DATA_TYPE,'NVARCHAR2(','NVARCHAR('),'VARCHAR2(','VARCHAR('),'TIMESTAMP','DATETIME2'),'NUMBER(','DECIMAL('),'CLOB','VARCHAR(MAX)')
                         when i_database_type='DMDB' then replace(replace(replace(replace(replace(a.DATA_TYPE,'NVARCHAR(','NVARCHAR2('),'VARCHAR(','VARCHAR2('),'VARCHAR2(MAX)','VARCHAR2'),'NTEXT','CLOB'),'TEXT','CLOB')
                         else a.DATA_TYPE end as DATA_TYPE,
                    a.COLUMN_ID,
                    a.NOT_NULL,
                    a.PRIMARY_KEY,
                    case when i_database_type='SQLSERVER' then replace(replace(replace(replace(a.DATA_DEFAULT,'SYS_GUID()','NEWID()'),'SYSDATE','GETDATE()'),'sys_guid()','NEWID()'),'sysdate','GETDATE()') 
                         when i_database_type='DMDB' then replace(replace(a.DATA_DEFAULT,'NEWID()','SYS_GUID()'),'GETDATE()','SYSDATE') 
                         else a.DATA_DEFAULT end as DATA_DEFAULT
                from 
                    app.TB_TEMP_TABLE_CREATE a
                where 
                    a.owner||'.'||a.TABLE_NAME=UPPER(i_table_create)
                order by a.owner,a.table_name,a.column_id
                    
               )
    loop

        /*02.02:*/o_return_msg:='02.02';
        v_create_sql:=v_create_sql||cur.column_name||' '||cur.data_type||' '||
                      case when cur.data_default is not null then 'default '||cur.data_default||' ' end||
                      case when cur.not_null='1' then 'not null ,' else ',' end||chr(10);

            /*02.03.01:条件:*/o_return_msg:='02.03.01';
        if cur.primary_key='1' then

            /*02.03.02:*/o_return_msg:='02.03.02';
            v_primary_key_sql:=case when v_primary_key_sql is null then 'constraint PK_'||replace(i_table_create,'.','_')||' primary key(' else v_primary_key_sql end;

            /*02.03.03:*/o_return_msg:='02.03.03';
            v_primary_key_sql:=case when v_primary_key_sql is not null then v_primary_key_sql||cur.column_name||',' 
                                    else v_primary_key_sql
                               end;

            /*02.03.99:条件分支02.03结束*/o_return_msg:='02.03.99';
        end if;

            /*02.04.01:条件:有表注释*/o_return_msg:='02.04.01';
        if cur.table_comments is not null and v_comments_sql is null then

            /*02.04.02:*/o_return_msg:='02.04.02';
            v_comments_sql:=case when i_database_type='SQLSERVER' 
                                 then 'EXEC sp_addextendedproperty @name = N''MS_Description'', @value = N'''||cur.table_comments||''', @level0type = N''SCHEMA'', @level0name = ''dbo'', @level1type = N''TABLE'', @level1name = '''||substr(i_table_create,instr(i_table_create,'.')+1)||''';'||chr(10)
                                 else 'comment on table '||i_table_create||' is '''||cur.table_comments||''';'||chr(10) end;

            /*02.04.99:条件分支02.04结束*/o_return_msg:='02.04.99';
        end if;

            /*02.05.01:条件:有字段注释*/o_return_msg:='02.05.01';
        if cur.COLUMN_COMMENTS is not null THEN

            /*02.05.02:*/o_return_msg:='02.05.02';
            v_comments_sql:=v_comments_sql||case when i_database_type='SQLSERVER' 
                                                 then 'EXEC sp_addextendedproperty @name = N''MS_Description'', @value = N'''||cur.column_comments||''', @level0type = N''SCHEMA'', @level0name = ''dbo'', @level1type = N''TABLE'', @level1name = '''||substr(i_table_create,instr(i_table_create,'.')+1)||''', @level2type = N''COLUMN'', @level2name = '''||cur.column_name||''';'||chr(10)
                                                 else 'comment on column '||i_table_create||'.'||cur.column_name||' is '''||cur.column_comments||''';'||chr(10) end;

            /*02.05.99:条件分支02.05结束*/o_return_msg:='02.05.99';
        end if;

        /*02.99:-循环结束*/o_return_msg:='02.99';
    end loop;

        /*03.01:条件:*/o_return_msg:='03.01';
    if v_primary_key_sql is not null then

        /*03.02:*/o_return_msg:='03.02';
        v_create_sql:=v_create_sql||rtrim(v_primary_key_sql,',')||')'||chr(10)||');';

        /*03.03:*/o_return_msg:='03.03';
    else

        /*03.04:*/o_return_msg:='03.04';
        v_create_sql:=rtrim(v_create_sql,','||chr(10))||chr(10)||');';

        /*03.99:条件分支03结束*/o_return_msg:='03.99';
    end if;

    /*04:*/o_return_msg:='04';
    v_create_sql:=v_create_sql||chr(10)||v_comments_sql;

    /*05:*/o_return_msg:='05';
    o_return_code := 0;
    o_return_msg := v_create_sql;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_TABLE_CREATE_SQL_Q执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE VIEW APP.VW_COLUMNS
as 
select 
	a.owner,
	a.table_name,
	c.comments as table_comments,
	a.column_name,
	b.comments as column_comments,
	case when a.data_type in ('VARCHAR2','VARCHAR','NVARCHAR2','NVARCHAR','CHAR') then a.data_type||'('||data_length||')'
	     when a.data_type in ('NUMBER','DEC','DECIMAL','NUMERIC') then a.data_type||case when data_precision>0 then '('||data_precision ||','||data_scale||')' end
	     when a.data_type in ('TIMESTAMP','DATETIME') then a.data_type||'('||a.data_scale||')'
	     else a.data_type
	end as data_type,
	a.data_precision,
	a.data_scale,
	a.column_id,
	c.table_type,
	a.data_default,
	d.DICT_ENTRY,
	case when e.column_name is not null then '1' else '0' end as if_locked,
	case when a.nullable='N' then '1' else '0' end as not_null,
	case when g.column_name is not null then '1' else '0' end as primary_key,
	h.DATA_SOURCE,
	case when i.synonym_name is not null then i.owner||'.'||i.synonym_name end as SYNONYM_TABLE,
	h.IF_HIS,
	h.DATE_COLUMN,
	coalesce(h.MODIFY_HISTORY,'创建'||chr(10)||to_char(created,'YYYYMMDD hh24:mi:ss')) as MODIFY_HISTORY
from all_tab_columns a
left join 
	dba_col_comments b
on	a.owner=b.owner
and a.table_name=b.table_name
and a.column_name=b.column_name
left join 
	all_tab_comments c
on  a.owner=c.owner
and a.table_name=c.table_name
left join 
	app.TB_COLUMN_DICT_ENTRY d 
on  a.owner||'.'||a.table_name=d.TABLE_NAME
and a.column_name=d.column_name
left join 
    app.TB_TABLE_LOCK e 
on  a.owner=e.OWNER
and a.table_name=e.table_name
and (a.column_name=e.column_name or e.column_name='*')
left join 
	ALL_CONSTRAINTS f 
on  a.owner=f.OWNER
and a.table_name=f.TABLE_NAME
and f.CONSTRAINT_TYPE='P'
left join 
	ALL_CONS_COLUMNS g 
on  f.constraint_name=g.CONSTRAINT_NAME
and a.column_name=g.COLUMN_NAME
and a.owner=g.OWNER
and a.table_name=g.table_name
left join 
    app.TB_TABLE_PROPS h 
on  a.owner=h.OWNER
and a.table_name=h.table_name
left join 
    ALL_SYNONYMS i 
on  a.owner=i.table_owner
and a.table_name=i.table_name
inner join 
    ALL_OBJECTS j
on  a.owner=j.OWNER
and a.table_name=j.OBJECT_NAME
where a.owner not in ('SYS','SYSDBA');
COMMENT ON VIEW APP.VW_COLUMNS is '表字段视图';
COMMENT ON COLUMN APP.VW_COLUMNS.COLUMN_COMMENTS is '字段注释';
COMMENT ON COLUMN APP.VW_COLUMNS.COLUMN_ID is '字段序号';
COMMENT ON COLUMN APP.VW_COLUMNS.COLUMN_NAME is '字段名';
COMMENT ON COLUMN APP.VW_COLUMNS.DATA_DEFAULT is '默认值';
COMMENT ON COLUMN APP.VW_COLUMNS.DATA_PRECISION is '';
COMMENT ON COLUMN APP.VW_COLUMNS.DATA_SCALE is '';
COMMENT ON COLUMN APP.VW_COLUMNS.DATA_SOURCE is '';
COMMENT ON COLUMN APP.VW_COLUMNS.DATA_TYPE is '字段类型';
COMMENT ON COLUMN APP.VW_COLUMNS.DATE_COLUMN is '';
COMMENT ON COLUMN APP.VW_COLUMNS.DICT_ENTRY is '字段对应字典代码';
COMMENT ON COLUMN APP.VW_COLUMNS.IF_HIS is '';
COMMENT ON COLUMN APP.VW_COLUMNS.IF_LOCKED is '是否已锁';
COMMENT ON COLUMN APP.VW_COLUMNS.MODIFY_HISTORY is '修改历史';
COMMENT ON COLUMN APP.VW_COLUMNS.NOT_NULL is '是否必填';
COMMENT ON COLUMN APP.VW_COLUMNS.OWNER is '用户';
COMMENT ON COLUMN APP.VW_COLUMNS.PRIMARY_KEY is '是否主键';
COMMENT ON COLUMN APP.VW_COLUMNS.SYNONYM_TABLE is '';
COMMENT ON COLUMN APP.VW_COLUMNS.TABLE_COMMENTS is '表注释';
COMMENT ON COLUMN APP.VW_COLUMNS.TABLE_NAME is '表名';
COMMENT ON COLUMN APP.VW_COLUMNS.TABLE_TYPE is '表或视图';


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
    -- 版    本: 1.2
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 表字段编辑程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251124 09:04:28
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

        /*01.09:执行完退出*/o_return_msg:='01.09';
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

        /*07.09:执行退出*/o_return_msg:='07.09';
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

        /*08.09:执行退出*/o_return_msg:='08.09';
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
    -- 版    本: 1.1
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 表字段配置查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251124 13:30:36
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
        app.vw_columns a
    where 
        (  (a.table_name=upper(I_TABLE_SEARCH) and I_TABLE_SEARCH not like '%.%') 
        or a.owner||'.'||a.table_name=upper(I_TABLE_SEARCH) 
        or a.SYNONYM_TABLE=upper(I_TABLE_SEARCH) 
        or exists(select 1 from app.tb_dependencies c 
                   where c.object_name=upper(I_TABLE_SEARCH) 
                     and c.referenced_type in ('TABLE','VIEW') 
                     and a.owner||'.'||a.table_name=c.referenced_object
                 )
        or I_TABLE_SEARCH is null)
    and (a.table_type=i_table_type or i_table_type is null)
    and (instr(a.column_name,I_COLUMN_SEARCH)>0 or instr(a.column_comments,I_COLUMN_SEARCH)>0 or I_COLUMN_SEARCH is null)
    and (exists(select 1 from app.tb_project_tab_view_list b where b.project_id=i_project_id and b.tab_view_name=a.owner||'.'||a.table_name) or i_project_id is null)
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



