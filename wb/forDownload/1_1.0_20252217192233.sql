CREATE OR REPLACE PROCEDURE APP.P30004
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_join_seq                           IN NUMBER ,--
    i_table_name                         IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 表字段信息
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:28:37
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_join_table                         CLOB ;
BEGIN
        /*条件:按步骤查字段信息*/
    if i_table_name is null then

        /*取步骤关联表*/
        select max(trim(JOIN_TABLE)) as join_table
          into v_join_table
          from APP.tb_etl_sp_step_join
         where etl_sp_name=i_ETL_SP_NAME
           and version_id=i_VERSION_ID
           and step_seq=i_STEP_SEQ
           and JOIN_SEQ=i_JOIN_SEQ
        ;

        /*按表查字段信息*/
    else

        /*取传入表名*/
        v_join_table:=i_table_name;

        /*条件分支01结束*/
    end if;

        /*条件:是子查询*/
    if v_join_table like '(%)' then

            /*循环一个一个替换参数值-循环开始*/
        for cur in (select PARAMS_NAME from APP.tb_etl_sp_params 
                     where etl_sp_name=i_ETL_SP_NAME
                       and version_id=i_VERSION_ID
                   )
        loop

            /*替换成null*/
            v_join_table:=replace(lower(v_join_table),lower(cur.PARAMS_NAME),'null');

            /*循环一个一个替换参数值-循环结束*/
        end loop;

        /*创建专属视图*/
        execute immediate 'create or replace view APP.vw_tmp_etl_sp_step_join as select * from '||v_join_table||' where 1=2';

        v_join_table:='APP.vw_tmp_etl_sp_step_join';

        /*条件分支02结束*/
    end if;

    /*返回查询结果*/
    open rt_cursor for
    select a.COLUMN_NAME,
           a.COMMENTS,
           decode(c.data_type || CASE
                                 WHEN c.data_type = 'NUMBER' THEN
                                  '(' || c.data_precision || ',' || c.data_scale || ')'
                                 when c.data_type = 'NVARCHAR' then
                                  '(' || c.data_length/2 || ')'
                                 ELSE
                                  '(' || c.data_length || ')'
                             END, 'NUMBER(,)', 'NUMBER', 'NUMBER(,0)', 'INTEGER',
              c.data_type || CASE
                                 WHEN c.data_type = 'NUMBER' THEN
                                  '(' || c.data_precision || ',' || c.data_scale || ')'
                                 when c.data_type = 'NVARCHAR' then
                                  '(' || c.data_length/2 || ')'
                                 ELSE
                                  '(' || c.data_length || ')'
                             END) as DATA_TYPE,
           '2' as PART_TYPE,
           '字段' as PART_TYPE_NAME,
           c.column_id,
           null as TEST_VALUE,
           c.DATA_DEFAULT,
           d.mod_type,
           d.mod_sql,
           upper(v_join_table) as tab_view_name
      from all_col_comments a
      left join
           all_tab_columns c
        on c.owner||'.'||c.TABLE_NAME=upper(v_join_table)
       and a.COLUMN_NAME=c.COLUMN_NAME
      left join
           APP.tb_project_tab_view_col_mod d
        on d.tab_view_name=upper(v_join_table)
       and a.COLUMN_NAME=d.column_name
       and d.mod_type in ('mod','drop')
     where a.owner||'.'||a.TABLE_NAME=upper(v_join_table)
     union all
    select a.COLUMN_NAME,
           a.COMMENTS,
           a.data_type,
           '2' as part_type,
           '字段' as PART_TYPE_NAME,
           null as column_id,
           null as TEST_VALUE,
           a.DATA_DEFAULT_LONG,
           a.mod_type,
           a.mod_sql,
           upper(v_join_table) as tab_view_name
      from APP.tb_project_tab_view_col_mod a
      left join
           all_tab_columns c
        on c.owner||'.'||c.TABLE_NAME=upper(v_join_table)
       and a.COLUMN_NAME=c.COLUMN_NAME
     where a.tab_view_name=upper(v_join_table)
       and c.COLUMN_NAME is null
     union all
     select a.PARAMS_NAME,
            a.PARAMS_SUMMARY,
            a.PARAMS_DATA_TYPE,
            '1' as part_type,
            '参数' as PART_TYPE_NAME,
            a.PARAMS_SEQ as column_id,
            case when b.version_status='2' then nvl(a.TEST_VALUE,'填写') end as TEST_VALUE,
            null,
            null,
            null,
            null
       from APP.tb_etl_sp_params a
       left join
            APP.tb_etl_sp b
         on a.etl_sp_name=b.etl_sp_name
        and a.version_id=b.version_id
      where a.etl_sp_name=i_ETL_SP_NAME
       and a.version_id=i_VERSION_ID
       and a.PARAMS_TYPE <>'2'
     order by part_type,column_id
    ;

    /*返回*/
    o_return_code := 0;
    o_return_msg:='执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_RELEASE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 发布程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:22:16
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2(10) ;--
BEGIN
    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id           
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

        /*状态改为发布*/
        update APP.tb_ETL_SP
           set VERSION_STATUS='1'
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*参数调试值更新为空*/
        update APP.Tb_Etl_Sp_Params
           set TEST_VALUE=null
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许发布';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '版本已发布';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_GET_DBA_SOURCE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 数据库代码处理
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:06:13
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_text_clob                          CLOB ;--
    v_type                               VARCHAR2(10) ;--
    v_owner                              VARCHAR2(100) ;--
    v_name                               VARCHAR2(100) ;--
    v_line                               INTEGER ;--
    v_exists                             INTEGER ;--
    v_last_ddl_time                      DATETIME(6) ;--
    v_pos                                INTEGER ;--
    v_last_pos                           INTEGER default 1;--
    v_sql_str                            CLOB ;
BEGIN
    /*取源程序是否存在和最近DDL时间*/
    select count(b.name) as vexists,
           max(a.last_ddl_time) as last_ddl_time
    into   v_exists,
           v_last_ddl_time
    from   all_objects a
    left   join 
           APP.tb_dba_source b
    on     a.owner=b.owner
    and    a.object_name=b.name
    and    a.last_ddl_time=b.last_ddl_time
    where  a.owner || '.' || a.object_name = upper(i_ETL_SP_NAME);

        /*条件:程序存在且最新版未取*/
    if v_exists=0 then

        /*删除旧版代码*/
        delete from APP.tb_dba_source a 
        where  a.owner || '.' || a.NAME = upper(i_ETL_SP_NAME);

        /*取数据库源代码*/
        select case when text not like '%'||chr(10) then text||chr(10) else text end as text,
               type,
               owner,
               name
        into   v_text_clob,
               v_type,
               v_owner,
               v_name
        from   all_source 
        where  owner||'.'||name=upper(i_ETL_SP_NAME);

        /*行号初始化*/
        v_line:=1;

            /*循环每行插入表-循环开始*/
        loop

            /*找到换行符*/
            v_pos:=instr(v_text_clob,chr(10),v_last_pos);

            /*退出条件*/
            exit when trim(replace(v_text_clob,chr(10),''))=''  or trim(replace(v_text_clob,chr(10),'')) is null;

                /*条件:无换行情况*/
            if v_pos=0 then

                v_sql_str:=to_char(v_text_clob);

                /*有换行*/
            else

                /*截取本行代码*/
                v_sql_str:=DBMS_LOB.SUBSTR(v_text_clob,v_pos-v_last_pos,v_last_pos);

                /*条件分支02.05.04结束*/
            end if;

            /*当前行代码入表*/
            insert into APP.TB_DBA_SOURCE
            (
                   OWNER,
                   NAME,
                   TYPE,
                   LINE,
                   TEXT,
                   ETL_SP_NAME,
                   LAST_DDL_TIME
            )
            select 
                   v_owner as OWNER,
                   v_name as NAME,
                   v_type as TYPE,
                   v_line as LINE,
                   v_sql_str as TEXT,
                   upper(i_ETL_SP_NAME) as ETL_SP_NAME,
                   v_last_ddl_time as LAST_DDL_TIME
            from   
                   DUAL a
            where  1=1;

            /*下一行*/
            v_line:=v_line+1;

            /*保留下次搜索开始位置*/
            v_last_pos:=v_pos+1;

            /*结束循环条件*/
            exit when instr(v_text_clob,chr(10),v_last_pos)=0;

            /*循环每行插入表-循环结束*/
        end loop;

        /*条件分支02结束*/
    end if;

    commit;
    o_return_msg := '执行成功';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_INSERT
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_object_type                        IN VARCHAR2 ,--
    i_summary                            IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 新建程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:10:01
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_exists                             INTEGER default 0;--
BEGIN
    /*判断是否已存在*/
    select count(1) as exist
      into v_exists
      from APP.Tb_Etl_Sp
     where upper(trim(ETL_SP_NAME))=upper(trim(i_ETL_SP_NAME));

        /*条件:不存在*/
    if v_exists =0 then

        /*新建程序*/
        insert into APP.TB_ETL_SP
        (
               ETL_SP_NAME,
               ETL_TARGET_TABLE,
               ETL_DATA_SOURCE,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               VERSION_STATUS,
               SUMMARY,
               UPGRADE_SUMMARY,
               OBJECT_TYPE,
               IF_CHANGED
        )
        select 
               upper(trim(i_ETL_SP_NAME)) as ETL_SP_NAME,
               '' as ETL_TARGET_TABLE,
               '' as ETL_DATA_SOURCE,
               to_char(sysdate,'YYYY-MM-DD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               '1.0' as VERSION_ID,
               '2' as VERSION_STATUS,
               i_summary as SUMMARY,
               '' as UPGRADE_SUMMARY,
               upper(i_object_type) as OBJECT_TYPE,
               '' as IF_CHANGED
        from   
               DUAL a
        where  not exists
              (select 1 from APP.Tb_Etl_Sp b 
                where upper(trim(b.ETL_SP_NAME))=upper(trim(i_ETL_SP_NAME))
              )
        ;

        /*已存在*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '已有同名存储过程';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '新增完成';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_INSERT_ADD
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_target_table                       IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序插入步骤字段配置新增
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 23:07:53
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2(10) ;--
BEGIN
    /*取程序版本状态*/
    select VERSION_STATUS,
           VERSION_ID
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

        /*插入字段配置*/
        insert into APP.TB_ETL_SP_STEP_INSERT
        (
               ETL_SP_NAME,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               STEP_SEQ,
               TARGET_TABLE,
               TARGET_COLUMN,
               SOURCE_COLUMN,
               COLUMN_SUMMARY,
               COLUMN_ID,
               COLUMN_COMMENTS
        )
        select 
               i_ETL_SP_NAME as ETL_SP_NAME,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               i_version_id as VERSION_ID,
               i_step_seq as STEP_SEQ,
               upper(trim(i_target_table)) as TARGET_TABLE,
               a.COLUMN_NAME as TARGET_COLUMN,
               '' as SOURCE_COLUMN,
               '' as COLUMN_SUMMARY,
               a.column_id as COLUMN_ID,
               b.COMMENTS as COLUMN_COMMENTS
        from   
               all_tab_columns a
        left join
               all_col_comments b
        on     
               a.OWNER=b.OWNER
         and a.TABLE_NAME=b.TABLE_NAME
         and a.COLUMN_NAME=b.COLUMN_NAME
        where  a.OWNER||'.'||a.TABLE_NAME=upper(trim(i_target_table))
         and not exists(select 1 from APP.tb_etl_sp_step_insert c
                      where i_ETL_SP_NAME=c.etl_sp_name
                        and i_version_id=c.VERSION_ID
                        and i_step_seq=c.STEP_SEQ
                        and upper(trim(i_target_table))=upper(trim(c.target_table))
                        and a.COLUMN_NAME=upper(trim(c.target_column))
                    )
        order by a.COLUMN_ID
        ;

        /*状态不满足条件*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许修改插入步骤字段配置'
                         end;
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '插入步骤字段配置已修改';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_DELETE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤删除
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:25:34
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
BEGIN
    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid  
      into v_version_status,
           v_version_id           
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

        /*删除步骤，及子步骤*/
        delete from APP.Tb_Etl_Sp_step
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
           and (step_seq=i_step_seq or instr(step_seq,i_step_seq||'.')=1)
        ;

        /*删除插入步骤关联配置*/
        delete from APP.Tb_Etl_Sp_step_join
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
           and (step_seq=i_step_seq or instr(step_seq,i_step_seq||'.')=1)
        ;

        /*删除插入步骤字段映射*/
        delete from APP.Tb_Etl_Sp_step_insert
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
           and (step_seq=i_step_seq or instr(step_seq,i_step_seq||'.')=1)
        ;

        /*更新变动标志*/
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许删除步骤';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '步骤已删除';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P30002
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_fold_flag                          IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤配置
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:20:33
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
BEGIN
    open rt_cursor for
    select a.etl_sp_name,
           a.update_time,
           a.update_user,
           a.version_id,
           a.step_seq,
           case when i_fold_flag='1' and instr(a.step_seq,'.')>0 then substr(a.step_seq,1,instr(a.step_seq,'.',-1)-1) end as parent_step_seq,
           a.step_summary,
           a.step_type as step_type_k,
           b.n as step_type,
           a.step_sql,
           a.target_table,
           a.step_sql_auto,
           a.etl_sp_name||a.version_id||a.step_seq as pk_id,
           a.other_params,
           count(1) over() as total_count,
           rownum as row_seq
      from APP.tb_etl_sp_step a
      left join
           (select '1' as v,'删除' as n from dual union all
            select '2' as v,'插入' as n from dual union all
            select '3' as v,'更新' as n from dual union all
            select '4' as v,'变量赋值' as n from dual union all
            select '5' as v,'循环' as n from dual union all
            select '6' as v,'条件' as n from dual union all
            select '9' as v,'自定义' as n from dual
           ) b
        on a.step_type=b.v
     where a.etl_sp_name=i_etl_sp_name
       and a.version_id=i_version_id
     order by a.step_seq
    ;

    o_return_code := 0;
    o_return_msg := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_MOVE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤下移
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250617 00:02:50
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;--
    v_err_msg                            VARCHAR2(128) default '';--
    v_next_step_exists                   INTEGER default 0;--
    v_son_step_exists                    INTEGER default 0;--
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2(10) ;--
    v_parent_step_seq                    VARCHAR2(100) default substr(i_step_seq,1,instr(i_step_seq,'.',-1)-1);--
    v_next_step_seq                      VARCHAR2(100) default case when v_parent_step_seq is not null then v_parent_step_seq||'.' else '' end||lpad(to_number(substr(i_step_seq,instr(i_step_seq,'.',-1)+1))+1,2,'0');--
BEGIN
        /*条件:最后步骤警告*/
    if i_step_seq like '%99' then

        o_return_code := -1;
        o_return_msg := '步骤序号99无法下移';
        rollback;
        return;

        /*条件分支01结束*/
    end if;

    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

    /*判断下一步骤序号是否存在*/
    select count(1) as next_step_exists
      into v_next_step_exists
      from APP.tb_ETL_SP_step
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
       and step_seq=v_next_step_seq
    ;

    /*判断是否有下级步骤*/
    select count(1) as son_step_exists
      into v_son_step_exists
      from APP.tb_ETL_SP_step
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
       and step_seq like i_step_seq||'.%'
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

            /*条件:下一步骤号已存在*/
        if v_next_step_exists>0 then

            /*下一步骤先下移*/
            APP.PR_ETL_SP_STEP_MOVE(i_ETL_SP_NAME,i_version_id,v_next_step_seq,i_user_code,v_errcode,v_err_msg);

                /*条件:下移失败*/
            if v_errcode<>0 then

                /*回退，退出*/
                o_return_code := v_errcode;
                o_return_msg := v_next_step_seq||'移动失败,'||v_err_msg;
                rollback;
                return;

                /*条件分支05.02.03结束*/
            end if;

            /*条件分支05.02结束*/
        end if;

        /*步骤号改为下一步骤号*/
        update APP.Tb_Etl_Sp_Step a
           set a.step_seq=v_next_step_seq,
               a.update_user=i_user_code,
               a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss')
         where a.etl_sp_name=i_ETL_SP_NAME
           and a.version_id=i_version_id
           and a.step_seq=i_step_seq
        ;

        /*插入步骤字段映射步骤号下移*/
        update APP.Tb_Etl_Sp_Step_Insert a
           set a.step_seq=v_next_step_seq,
               a.update_user=i_user_code,
               a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss')
         where a.etl_sp_name=i_ETL_SP_NAME
           and a.version_id=i_version_id
           and a.step_seq=i_step_seq
        ;

        /*插入步骤关联数据步骤号下移*/
        update APP.Tb_Etl_Sp_Step_Join a
           set a.step_seq=v_next_step_seq,
               a.update_user=i_user_code,
               a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss')
         where a.etl_sp_name=i_ETL_SP_NAME
           and a.version_id=i_version_id
           and a.step_seq=i_step_seq
        ;

            /*条件:有子步骤*/
        if v_son_step_exists>0 then

            /*子步骤也下移*/
            update APP.Tb_Etl_Sp_Step a
               set a.step_seq=v_next_step_seq||substr(a.step_seq,length(v_next_step_seq)+1),
                   a.update_user=i_user_code,
                   a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss')
             where a.etl_sp_name=i_ETL_SP_NAME
               and a.version_id=i_version_id
               and a.step_seq like i_step_seq||'.%'
            ;

            update APP.Tb_Etl_Sp_Step_Insert a
               set a.step_seq=v_next_step_seq||substr(a.step_seq,length(v_next_step_seq)+1),
                   a.update_user=i_user_code,
                   a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss')
             where a.etl_sp_name=i_ETL_SP_NAME
               and a.version_id=i_version_id
               and a.step_seq like i_step_seq||'.%'
            ;

            update APP.Tb_Etl_Sp_Step_Join a
               set a.step_seq=v_next_step_seq||substr(a.step_seq,length(v_next_step_seq)+1),
                   a.update_user=i_user_code,
                   a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss')
             where a.etl_sp_name=i_ETL_SP_NAME
               and a.version_id=i_version_id
               and a.step_seq like i_step_seq||'.%'
            ;

            /*条件分支05.06结束*/
        end if;

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许操作步骤';
        rollback;
        return;

        /*条件分支05结束*/
    end if;

    /*返回*/
    commit;
    o_return_msg := '执行成功';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_DELETE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 删除程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:05:41
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2(10) ;--
BEGIN
    /*取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid   
      into v_version_status,
           v_version_id           
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id;

        /*条件:修订中状态*/
    if v_version_status = '2' then

        /*删除程序表*/
        delete from APP.tb_ETL_SP 
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*删除程序参数表*/
        delete from APP.Tb_Etl_Sp_Params
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*删除程序步骤表*/
        delete from APP.Tb_Etl_Sp_step
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*删除程序插入步骤关联表*/
        delete from APP.Tb_Etl_Sp_step_join
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*删除程序插入步骤字段映射表*/
        delete from APP.Tb_Etl_Sp_step_insert
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*删除程序涉及表*/
        delete from APP.tb_etl_sp_tables
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*删除程序测试记录表*/
        delete from APP.tb_etl_sp_step_test
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*删除程序测试循环记录表*/
        delete from APP.TB_ETL_SP_STEP_LOOP_PARAMS
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
        ;

        /*删除程序代码选择行次表*/
        delete from APP.TB_DBA_SOURCE_SELECT_LINE
         where OBJECT_NAME=i_ETL_SP_NAME
        ;

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许删除';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*返回*/
    commit;
    o_return_msg := '修订版本已删除';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P30003
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 插入步骤表关联配置查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:21:37
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
BEGIN
    open rt_cursor for
    select a.step_seq,
           a.join_table,
           a.join_as,
           a.join_seq,
           a.join_type as join_type_k,
           b.n as join_type,
           a.join_summary,
           a.join_sql,
           a.etl_sp_name,
           a.version_id,
           a.update_time,
           a.update_user
      from APP.TB_ETL_SP_STEP_JOIN a
      left join
           (select '1' as v,'inner join' as n from dual union all
            select '2' as v,'left join' as n from dual union all
            select '3' as v,'full join' as n from dual
           ) b
        on a.JOIN_TYPE=b.v
     where a.etl_sp_name=i_ETL_SP_NAME
       and a.version_id=i_version_id
       and a.STEP_SEQ=i_step_seq
     order by a.JOIN_SEQ
    ;

    o_return_code := 0;
    o_return_msg:='执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_UPDATE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_summary                            IN VARCHAR2 ,--
    i_upgrade_summary                    IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 修改程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250617 00:15:44
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
BEGIN
    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid 
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

        /*修改信息*/
        update APP.tb_ETL_SP a
           set a.summary=i_SUMMARY,
               a.upgrade_summary=i_UPGRADE_SUMMARY,
               a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*更新变动标志*/
        update APP.tb_ETL_SP
        set    if_changed='Y'
        where  etl_sp_name=i_ETL_SP_NAME
        and    version_id=i_version_id;

        /*版本已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许修改';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    commit;
    o_return_msg := '操作完成';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_UPGRADE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_upgrade_summary                    IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 升级程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250617 00:19:57
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2(10) ;--
BEGIN
    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id
      from (
            select VERSION_STATUS,
                   VERSION_ID,
                   row_number() over(partition by ETL_SP_NAME order by VERSION_ID desc) as rk
              from APP.tb_ETL_SP
             where ETL_SP_NAME=i_ETL_SP_NAME
           )
     where rk=1
    ;

        /*条件:版本状态是已发布或废除*/
    if v_version_status in ('1','3') then

        /*插入新版本*/
        insert into APP.TB_ETL_SP
        (
               ETL_SP_NAME,
               ETL_TARGET_TABLE,
               ETL_DATA_SOURCE,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               VERSION_STATUS,
               SUMMARY,
               UPGRADE_SUMMARY,
               OBJECT_TYPE,
               IF_CHANGED
        )
        select 
               etl_sp_name as ETL_SP_NAME,
               etl_target_table as ETL_TARGET_TABLE,
               etl_data_source as ETL_DATA_SOURCE,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               trim(to_char(to_number(v_version_id)+0.1,'99.0')) as VERSION_ID,
               '2' as VERSION_STATUS,
               SUMMARY as SUMMARY,
               i_upgrade_summary as UPGRADE_SUMMARY,
               OBJECT_TYPE as OBJECT_TYPE,
               '' as IF_CHANGED
        from   
               APP.tb_ETL_SP a
        where  version_id=v_version_id
        and ETL_SP_NAME=i_ETL_SP_NAME
        and not exists(select 1 from APP.Tb_Etl_Sp b
                        where b.ETL_SP_NAME=i_ETL_SP_NAME
                          and b.version_id=trim(to_char(to_number(v_version_id)+0.1,'99.0'))
                      )
        ;

        /*插入新版本参数*/
        insert into APP.TB_ETL_SP_PARAMS
        (
               ETL_SP_NAME,
               PARAMS_NAME,
               PARAMS_TYPE,
               PARAMS_DATA_TYPE,
               PARAMS_DEFAULT_VALUE,
               PARAMS_SUMMARY,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               PARAMS_SEQ,
               TEST_VALUE
        )
        select 
               etl_sp_name as ETL_SP_NAME,
               params_name as PARAMS_NAME,
               params_type as PARAMS_TYPE,
               params_data_type as PARAMS_DATA_TYPE,
               params_default_value as PARAMS_DEFAULT_VALUE,
               params_summary as PARAMS_SUMMARY,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               trim(to_char(to_number(v_version_id)+0.1,'99.0')) as VERSION_ID,
               params_seq as PARAMS_SEQ,
               '' as TEST_VALUE
        from   
               APP.Tb_Etl_Sp_Params a
        where  version_id=v_version_id
        and ETL_SP_NAME=i_ETL_SP_NAME
        and not exists(select 1 from APP.Tb_Etl_Sp_Params b
                        where b.ETL_SP_NAME=i_ETL_SP_NAME
                          and b.version_id=trim(to_char(to_number(v_version_id)+0.1,'99.0'))
                      )
        ;

        /*插入新版本步骤*/
        insert into APP.TB_ETL_SP_STEP
        (
               ETL_SP_NAME,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               STEP_SEQ,
               STEP_SUMMARY,
               STEP_TYPE,
               STEP_SQL,
               TARGET_TABLE,
               STEP_SQL_AUTO,
               OTHER_PARAMS
        )
        select 
               etl_sp_name as ETL_SP_NAME,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               trim(to_char(to_number(v_version_id)+0.1,'99.0')) as VERSION_ID,
               step_seq as STEP_SEQ,
               step_summary as STEP_SUMMARY,
               step_type as STEP_TYPE,
               step_sql as STEP_SQL,
               target_table as TARGET_TABLE,
               step_sql_auto as STEP_SQL_AUTO,
               '' as OTHER_PARAMS
        from   
               APP.Tb_Etl_Sp_step a
        where  version_id=v_version_id
        and ETL_SP_NAME=i_ETL_SP_NAME
        and not exists(select 1 from APP.Tb_Etl_Sp_step b
                        where b.ETL_SP_NAME=i_ETL_SP_NAME
                          and b.version_id=trim(to_char(to_number(v_version_id)+0.1,'99.0'))
                      )
        ;

        /*插入新版本插入步骤关联*/
        insert into APP.TB_ETL_SP_STEP_JOIN
        (
               ETL_SP_NAME,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               STEP_SEQ,
               JOIN_TABLE,
               JOIN_SEQ,
               JOIN_TYPE,
               JOIN_SQL,
               JOIN_SUMMARY,
               JOIN_AS
        )
        select 
               etl_sp_name as ETL_SP_NAME,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               trim(to_char(to_number(v_version_id)+0.1,'99.0')) as VERSION_ID,
               step_seq as STEP_SEQ,
               join_table as JOIN_TABLE,
               join_seq as JOIN_SEQ,
               join_type as JOIN_TYPE,
               join_sql as JOIN_SQL,
               join_summary as JOIN_SUMMARY,
               join_as as JOIN_AS
        from   
               APP.Tb_Etl_Sp_step_join a
        where  version_id=v_version_id
        and ETL_SP_NAME=i_ETL_SP_NAME
        and not exists(select 1 from APP.Tb_Etl_Sp_step_join b
                        where b.ETL_SP_NAME=i_ETL_SP_NAME
                          and b.version_id=trim(to_char(to_number(v_version_id)+0.1,'99.0'))
                      )
        ;

        /*插入新版本插入步骤字段映射*/
        insert into APP.TB_ETL_SP_STEP_INSERT
        (
               ETL_SP_NAME,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               STEP_SEQ,
               TARGET_TABLE,
               TARGET_COLUMN,
               SOURCE_COLUMN,
               COLUMN_SUMMARY,
               COLUMN_ID,
               COLUMN_COMMENTS
        )
        select 
               etl_sp_name as ETL_SP_NAME,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               trim(to_char(to_number(v_version_id)+0.1,'99.0')) as VERSION_ID,
               step_seq as STEP_SEQ,
               target_table as TARGET_TABLE,
               target_column as TARGET_COLUMN,
               source_column as SOURCE_COLUMN,
               column_summary as COLUMN_SUMMARY,
               column_id as COLUMN_ID,
               COLUMN_COMMENTS as COLUMN_COMMENTS
        from   
               APP.Tb_Etl_Sp_step_insert a
        where  version_id=v_version_id
        and ETL_SP_NAME=i_ETL_SP_NAME
        and not exists(select 1 from APP.Tb_Etl_Sp_step_insert b
                        where b.ETL_SP_NAME=i_ETL_SP_NAME
                          and b.version_id=trim(to_char(to_number(v_version_id)+0.1,'99.0'))
                      )
        ;

        /*版本状态修订中*/
    else

        o_return_code := -1;
        o_return_msg := '版本状态不允许升级';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    commit;
    o_return_msg := '新版本开启修订';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DEPENDENCIES_REFRESH
(
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 对象引用列表和代码刷库顺序数据刷新程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 23:40:42
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_exists                             INTEGER default 0;--
    v_seq                                INTEGER default 1;--
BEGIN
    /*删除旧数据*/
    delete from APP.tb_dependencies
    where owner in ('APP');

    /*插入新的数据库对象及引用数据*/
    insert into APP.TB_DEPENDENCIES
    (
           OWNER,
           OBJECT_NAME,
           OBJECT_TYPE,
           REFERENCED_OBJECT,
           REFERENCED_TYPE,
           OBJECT_SEQ
    )
    select 
           a.owner as OWNER,
           a.owner||'.'||a.object_name as OBJECT_NAME,
           a.object_type as OBJECT_TYPE,
           b.referenced_owner||'.'||b.referenced_name as REFERENCED_OBJECT,
           b.referenced_type as REFERENCED_TYPE,
           null as OBJECT_SEQ
    from   
           ALL_OBJECTS a
    left join
           all_dependencies b
    on     
           a.owner=b.owner
    and    a.object_name=b.name
    and    b.referenced_name<>'DUAL'
    and    b.referenced_owner not in ('SYS')
    and    b.referenced_type in ('TABLE','VIEW','PROCEDURE','FUNCTION')
    where  a.owner in ('APP')
    and    a.object_type in ('TABLE','VIEW','PROCEDURE','FUNCTION');

    /*所有对象的刷库顺序初始化*/
    update APP.tb_dependencies a
    set    a.object_seq=null;

    /*不引用其他对象的刷库顺序更新为1*/
    update APP.tb_dependencies a
    set    a.object_seq=1
    where  a.object_seq is null
    and    a.referenced_object='.'
    ;

        /*按引用顺序更新刷库顺序-循环开始*/
    loop

        /*是否存在未定顺序的对象引用了已确定顺序的其他对象*/
        select count(1) as cnt
        into   v_exists
        from   APP.tb_dependencies a
        where  a.object_seq is null
        and    exists
               (select 1 
                  from (select b.object_name,
                               count(1) as referenced_count,
                               count(c.object_seq) as ready_count 
                          from APP.tb_dependencies b
                          left join 
                               APP.tb_dependencies c
                            on b.referenced_object=c.object_name
                         where b.object_seq is null
                         group by 
                               b.object_name
                       ) b
                where  a.object_name=b.object_name
                and    b.referenced_count=b.ready_count
               );

            /*条件:存在后续的刷库对象*/
        if v_exists>0 then

            /*刷库顺序加1*/
            v_seq:=v_seq+1;

            /*更新刷库顺序*/
            update APP.tb_dependencies a
            set    a.object_seq=v_seq
            where  a.object_seq is null
            and    exists
                   (select 1 
                      from (select b.object_name,
                                   count(1) as referenced_count,
                                   count(c.object_seq) as ready_count 
                              from APP.tb_dependencies b
                              left join 
                                   APP.tb_dependencies c
                                on b.referenced_object=c.object_name
                             where b.object_seq is null
                             group by 
                                   b.object_name
                           ) b
                    where  a.object_name=b.object_name
                    and    b.referenced_count=b.ready_count
                   );

            /*无后续刷库对象*/
        else

            /*退出循环*/
            exit;

            /*条件分支05.03结束*/
        end if;

        /*按引用顺序更新刷库顺序-循环结束*/
    end loop;

    /*退出*/
    commit;
    o_return_msg := '执行成功';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_PARAMS_DELETE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_params_name                        IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 删除程序参数
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:12:22
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
BEGIN
    /*取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id           
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

        /*删除参数*/
        delete from APP.Tb_Etl_Sp_Params
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
           and PARAMS_NAME=i_PARAMS_NAME
        ;

        /*更新变动标志*/
        update APP.tb_ETL_SP
        set    if_changed='Y'
        where  etl_sp_name=i_ETL_SP_NAME
        and    version_id=i_version_id;

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许删除参数';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '参数已删除';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_PARAMS_INSERT
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_params_name                        IN VARCHAR2 ,--
    i_params_type                        IN VARCHAR2 ,--
    i_params_data_type                   IN VARCHAR2 ,--
    i_params_default_value               IN VARCHAR2 ,--
    i_params_summary                     IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 新增程序参数
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:15:53
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_exists                             INTEGER default 0;--
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_params_seq                         NUMBER(4,2) ;--
    v_params_name                        VARCHAR2 ;--
BEGIN
    /*取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id           
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

    /*默认参数名*/
    v_PARAMS_NAME:=case when i_PARAMS_TYPE='1' and substr(lower(trim(i_PARAMS_NAME)),1,2)<>'i_' then 'i_'||lower(trim(i_PARAMS_NAME))
                        when i_PARAMS_TYPE='2' and substr(lower(trim(i_PARAMS_NAME)),1,2)<>'o_' then 'o_'||lower(trim(i_PARAMS_NAME))
                        when i_PARAMS_TYPE='3' and substr(lower(trim(i_PARAMS_NAME)),1,2)<>'v_' then 'v_'||lower(trim(i_PARAMS_NAME))
                        else lower(trim(i_PARAMS_NAME))
                    end;

    /*判断参数是否存在*/
    select count(1) as exist
      into v_exists
      from APP.Tb_Etl_Sp_Params
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
       and lower(trim(PARAMS_NAME))=v_PARAMS_NAME
    ;

        /*条件:状态修订中且参数不重复*/
    if v_version_status = '2' and v_exists =0 then

        /*取下一参数序号*/
        select nvl(max(PARAMS_SEQ),to_number(i_PARAMS_TYPE))+0.01 as PARAMS_SEQ
          into v_PARAMS_SEQ
          from APP.Tb_Etl_Sp_Params
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
           and PARAMS_TYPE=i_PARAMS_TYPE
        ;

        /*插入新参数*/
        insert into APP.TB_ETL_SP_PARAMS
        (
               ETL_SP_NAME,
               PARAMS_NAME,
               PARAMS_TYPE,
               PARAMS_DATA_TYPE,
               PARAMS_DEFAULT_VALUE,
               PARAMS_SUMMARY,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               PARAMS_SEQ,
               TEST_VALUE
        )
        select 
               i_ETL_SP_NAME as ETL_SP_NAME,
               v_PARAMS_NAME as PARAMS_NAME,
               i_PARAMS_TYPE as PARAMS_TYPE,
               upper(i_PARAMS_DATA_TYPE) as PARAMS_DATA_TYPE,
               i_PARAMS_DEFAULT_VALUE as PARAMS_DEFAULT_VALUE,
               i_PARAMS_SUMMARY as PARAMS_SUMMARY,
               to_char(sysdate,'YYYY-MM-DD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               i_version_id as VERSION_ID,
               v_PARAMS_SEQ as PARAMS_SEQ,
               null as TEST_VALUE
        from   
               dual a
        where  not exists(select 1 from APP.Tb_Etl_Sp_Params b
                        where b.etl_sp_name=i_ETL_SP_NAME 
                          and lower(trim(b.PARAMS_NAME))=v_PARAMS_NAME
                          and b.version_id=i_version_id)
        ;

        /*更新变动标志*/
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*版本状态不对或参数已存在*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许参数配置' 
                             when v_exists>0 then '已有同名参数'
                         end
        ;
        rollback;
        return;

        /*条件分支04结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '参数新增完成';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P30001
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_params_type                        IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序参数查询管理
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:18:06
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
BEGIN
    open rt_cursor for
    select a.etl_sp_name,
           a.params_name,
           a.params_type as params_type_k,
           decode(a.params_type,'1','输入参数','2','输出参数','3','过程参数') as params_type_v ,
           a.params_data_type,
           a.params_default_value,
           a.params_summary,
           a.update_time,
           a.update_user,
           a.version_id,
           a.params_seq,
           case when b.version_status='2' and a.params_type in ('1','3') then nvl(a.TEST_VALUE,'填写') end as TEST_VALUE
      from APP.tb_etl_sp_params a
      left join
           APP.tb_etl_sp b
        on a.etl_sp_name=b.etl_sp_name
       and a.version_id=b.version_id
     where a.etl_sp_name=i_ETL_SP_NAME
       and a.version_id=i_version_id
       and (instr(i_params_type,a.params_type)>0 or i_params_type is null)
     order by case when a.params_data_type ='CURSOR' then 0 else a.params_seq end
    ;

    o_return_code := 0;
    o_return_msg:='执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_PARAMS_UPDATE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_params_name                        IN VARCHAR2 ,--
    i_params_data_type                   IN VARCHAR2 ,--
    i_params_default_value               IN VARCHAR2 ,--
    i_params_summary                     IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 修改程序参数
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:19:52
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
BEGIN
    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

        /*修改参数*/
        update APP.Tb_Etl_Sp_Params a
           set a.PARAMS_DATA_TYPE=upper(trim(i_PARAMS_DATA_TYPE)),
               a.PARAMS_DEFAULT_VALUE=i_PARAMS_DEFAULT_VALUE,
               a.PARAMS_SUMMARY=i_PARAMS_SUMMARY,
               a.UPDATE_TIME=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.UPDATE_USER=i_user_code
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
           and a.PARAMS_NAME=i_PARAMS_NAME
        ;

        /*更新变动标志*/
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许修改参数';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '参数已修改';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_UPDATE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_step_summary                       IN VARCHAR2 ,--
    i_step_type                          IN VARCHAR2 ,--
    i_step_sql                           IN CLOB ,
    i_target_table                       IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤修改
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250617 00:10:55
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_parent_step_type                   CHAR(1) ;--
    v_parent_step_seq                    VARCHAR2 ;--
    v_end_check                          CHAR(1) default '1';--
    v_blank_bar                          VARCHAR2 ;--
BEGIN
    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

    /*取上级步骤类别和编号*/
    select max(step_type) as parent_step_type,
           max(step_seq) as parent_step_seq
      into v_parent_step_type,
           v_parent_step_seq
      from APP.tb_ETL_SP_step
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
       and step_seq=substr(i_step_seq,1,instr(i_step_seq,'.',-1)-1)
    ;

        /*条件:步骤类别为1删除,3更新,4变量赋值且脚本结尾不以；结尾*/
    if i_step_type in ('1','2','3','4') and trim(rtrim(ltrim(i_step_sql,chr(10)),chr(10))) not like '%;' then

        /*结尾检查不通过*/
        v_end_check:='0';

        /*条件分支03结束*/
    end if;

        /*条件:状态修订中，结尾检查通过*/
    if v_version_status = '2' and v_end_check='1' then

        /*去除首尾换行*/
        i_step_sql:=rtrim(ltrim(i_step_sql,chr(10)),chr(10));

        /*获取前部空格串*/
        v_blank_bar:=substr(i_step_sql,1,REGEXP_INSTR(i_step_sql,'\S')-1);

        /*替换每行最前面的空格串*/
        i_step_sql:=ltrim(replace(i_step_sql,chr(10)||v_blank_bar,chr(10)));

        /*直接修改步骤*/
        update APP.Tb_Etl_Sp_STEP a
           set a.STEP_TYPE=i_STEP_TYPE,
               a.STEP_SUMMARY=i_STEP_SUMMARY,
               a.STEP_SQL=case when i_step_type not in ('2','5','6') then APP.f_step_sql_set(i_step_sql,case when (right(i_step_seq,3) in ('.01','.99') or (lower(trim(i_step_sql)) like 'else%' or lower(trim(i_step_sql)) like 'elsif%')) and v_parent_step_type in ('5','6') then v_parent_step_seq
                                                                                                                  else i_step_seq end)
                               else a.STEP_SQL end,
               a.target_table=case when i_step_type in ('1','2','3') then upper(trim(i_target_table)) end,
               a.UPDATE_TIME=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.UPDATE_USER=i_user_code
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
           and a.step_seq=i_step_seq
        ;

            /*条件:插入步骤处理*/
        if i_step_type='2' then

            /*删除旧字段映射数据*/
            delete from APP.tb_etl_sp_step_insert a
             where a.ETL_SP_NAME=i_ETL_SP_NAME
               and a.version_id=i_version_id
               and a.step_seq=i_step_seq
               and upper(trim(a.target_table))<>upper(trim(i_target_table))
            ;

            /*按新目标表插入字段映射数据*/
            insert into APP.TB_ETL_SP_STEP_INSERT
            (
                   ETL_SP_NAME,
                   UPDATE_TIME,
                   UPDATE_USER,
                   VERSION_ID,
                   STEP_SEQ,
                   TARGET_TABLE,
                   TARGET_COLUMN,
                   SOURCE_COLUMN,
                   COLUMN_SUMMARY,
                   COLUMN_ID,
                   COLUMN_COMMENTS
            )
            select 
                   i_ETL_SP_NAME as ETL_SP_NAME,
                   to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
                   i_user_code as UPDATE_USER,
                   i_version_id as VERSION_ID,
                   i_step_seq as STEP_SEQ,
                   upper(trim(i_target_table)) as TARGET_TABLE,
                   a.COLUMN_NAME as TARGET_COLUMN,
                   '' as SOURCE_COLUMN,
                   '' as COLUMN_SUMMARY,
                   a.column_id as COLUMN_ID,
                   b.COMMENTS as COLUMN_COMMENTS
            from   
                   all_tab_columns a
            left join
                   all_col_comments b
            on     
                   a.OWNER=b.OWNER
            and a.TABLE_NAME=b.TABLE_NAME
            and a.COLUMN_NAME=b.COLUMN_NAME
            where  a.OWNER||'.'||a.TABLE_NAME=upper(trim(i_target_table))
            and not exists(select 1 from APP.tb_etl_sp_step_insert c
                            where i_ETL_SP_NAME=c.etl_sp_name
                              and i_version_id=c.VERSION_ID
                              and i_step_seq=c.STEP_SEQ
                              and upper(trim(i_target_table))=upper(trim(c.target_table))
                              and a.COLUMN_NAME=upper(trim(c.target_column))
                          )
             order by a.COLUMN_ID
            ;

            /*非插入步骤*/
        else

            /*删除关联数据*/
            delete from APP.Tb_Etl_Sp_STEP_join 
             where ETL_SP_NAME=i_ETL_SP_NAME
               and version_id=i_version_id
               and step_seq=i_step_seq
            ;

            /*删除字段映射数据*/
            delete from APP.Tb_Etl_Sp_STEP_insert
             where ETL_SP_NAME=i_ETL_SP_NAME
               and version_id=i_version_id
               and step_seq=i_step_seq
            ;

            /*条件分支04.06结束*/
        end if;

        /*更新变动标志*/
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许步骤配置'
                             when v_end_check='0' then '步骤SQL请用符号“;”结尾'
                         end;
        rollback;
        return;

        /*条件分支04结束*/
    end if;

    /*返回*/
    commit;
    o_return_msg := '步骤已修改';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P30009
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_if_refresh                         IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT INTEGER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序依赖对象查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:33:22
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_ret_code                           NUMBER default 0;--
    v_ret_msg                            VARCHAR2(128) default '';--
    v_exists                             INTEGER default 0;--
BEGIN
        /*条件:需要刷新依赖关系数据*/
    if i_if_refresh='1' then

        APP.pr_dependencies_refresh(v_ret_code,v_ret_msg);

        /*条件分支01结束*/
    end if;

    open rt_cursor for 
    select a.object_name,
           a.object_type,
           a.referenced_object,
           listagg(distinct decode(b.step_type,'1','删除','2','插入','3','更新'),',') within group(order by b.step_type) as oper_way,
           a.referenced_type,
           a.owner,
           a.object_name as parent_id,
           a.referenced_object as sid,
           case when (select count(1) from APP.tb_dependencies c where a.referenced_object=c.object_name and c.referenced_object<>'.')>0 then 0 else 1 end as "_leaf"
    from   APP.tb_dependencies a
    left join 
           APP.tb_etl_sp_step b
    on     a.object_name=b.etl_sp_name
    and    a.referenced_object=b.target_table
    where  a.object_name=i_etl_sp_name
    group by a.object_name,
           a.object_type,
           a.referenced_object,
           a.referenced_type,
           a.owner
    ;

    o_return_code := 0;
    o_return_msg:='执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_CHECK_CHANGE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序配置代码与数据库代码是否已变动检查
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 16:15:11
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_return_code                        INTEGER ;--
    v_return_msg                         VARCHAR2 ;--
    v_dba_source                         CLOB ;--
    v_etl_sp_code                        CLOB ;--
BEGIN
        /*-循环开始*/
    for cur_etl_sp in (select a.etl_sp_name,
                              max(a.version_id) as version_id 
                         from APP.tb_etl_sp a
                        inner join 
                              all_procedures b
                           on a.etl_sp_name=b.owner||'.'||b.object_name
                        where (a.etl_sp_name=i_etl_sp_name or i_etl_sp_name is null)
                        group by a.etl_sp_name
                      )
    loop

        /*源代码处理*/
        APP.PR_ETL_SP_GET_DBA_SOURCE(cur_etl_sp.ETL_SP_NAME,i_user_code,v_return_code,v_return_msg);

        v_dba_source:='';

            /*拼接源代码-循环开始*/
        for cur_dba_source in (select text as sql_code from APP.tb_dba_source where etl_sp_name=cur_etl_sp.etl_sp_name order by LINE)
        loop

            v_dba_source:=v_dba_source||cur_dba_source.sql_code||chr(10);

            /*拼接源代码-循环结束*/
        end loop;

        v_etl_sp_code:='';

            /*拼接配置代码-循环开始*/
        for cur_etl_sp_code in (select sql_code from APP.tb_etl_sp_code where etl_sp_name=cur_etl_sp.etl_sp_name and version_id=cur_etl_sp.version_id order by LINE)
        loop

            v_etl_sp_code:=v_etl_sp_code||cur_etl_sp_code.sql_code||chr(10);

            /*拼接配置代码-循环结束*/
        end loop;

        /*修改变动标志*/
        update APP.tb_etl_sp 
        set    if_changed=case when DBMS_LOB.COMPARE(v_dba_source, v_etl_sp_code)<>0 then 'Y' end
        where  etl_sp_name=cur_etl_sp.etl_sp_name
        and    version_id=cur_etl_sp.version_id;

        commit;

        /*-循环结束*/
    end loop;

    commit;
    o_return_code := 0;
    o_return_msg  := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_INSERT_SQL
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_target_table                       IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序插入步骤SQL生成
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 23:20:52
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_step_type                          CHAR(1) ;--
    v_buffer                             VARCHAR2 ;--
    v_clob                               CLOB ;
    v_join_table                         VARCHAR2 ;--
    v_where_str                          VARCHAR2 ;--
    v_target_column_str                  VARCHAR2 ;--
    v_source_column_str                  VARCHAR2 ;--
    v_blanks                             INTEGER ;--
BEGIN
    /*取步骤类别*/
    select max(a.step_type) as step_type
      into v_step_type
      from APP.tb_etl_sp_step a
     where a.etl_sp_name=i_etl_sp_name
       and a.version_id=i_version_id
       and a.step_seq=i_step_seq
    ;

    /*取程序版本及状态*/
    select VERSION_STATUS,
           VERSION_ID
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:修订中，插入步骤*/
    if v_version_status = '2' and v_step_type ='2' then

        /*获取插入目标字段和源字段*/
        select listagg(a.target_column||case when b.column_name is null then '/*字段缺失*/' else '' end,','||chr(10)||'       ') within group(order by a.COLUMN_ID) as target_column_str,
               listagg(nvl(replace(a.source_column,chr(10),chr(10)||'       '),'''''')||' as '||a.target_column,','||chr(10)||'       ') within group(order by a.COLUMN_ID) as source_column_str
          into v_target_column_str,
               v_source_column_str
          from APP.tb_etl_sp_step_insert a
          left join
               all_tab_columns b
            on b.owner||'.'||b.table_name=i_TARGET_TABLE
           and a.target_column=b.COLUMN_NAME
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.VERSION_ID=i_VERSION_ID
           and a.STEP_SEQ=i_STEP_SEQ
           and a.TARGET_TABLE=i_TARGET_TABLE
           and a.source_column is not null
        ;

        /*拼接insert语句*/
        v_buffer:='insert into '||i_target_table||chr(10)||'('||chr(10)||'       '||v_target_column_str||chr(10)||')'||chr(10);

        v_clob:=v_clob||v_buffer;

        /*拼接源字段*/
        v_buffer:='select '||chr(10)||'       '||v_source_column_str||chr(10)||'from   '||chr(10);

        v_clob:=v_clob||v_buffer;

            /*取关联表信息-循环开始*/
        for cur in (select trim(JOIN_TABLE) as join_table,
                           decode(join_type,'1','inner join','2','left join','3','full join') as join_type,
                           join_sql,
                           lpad(join_seq,2,'0') as join_seq,
                           join_as
                      from APP.tb_etl_sp_step_join a
                     where a.ETL_SP_NAME=i_ETL_SP_NAME
                       and a.VERSION_ID=i_VERSION_ID
                       and a.STEP_SEQ=i_STEP_SEQ
                     order by JOIN_SEQ
                   )
        loop

            v_join_table:=cur.join_table;

            /*取行首缩进空格数*/
            select min(case when seq_num=1 or seq_num=row_count then 999
                            else length(join_table_part) - length(ltrim(join_table_part, ' ')) end
                      ) as blanks
            into   v_blanks
            FROM   (SELECT rownum AS seq_num,
                           count(1) over() as row_count,
                           regexp_substr(v_join_table, '[^' || chr(10) || ']+', 1, l) AS join_table_part
                    FROM   dual a,
                           (SELECT LEVEL l
                            FROM   dual
                            CONNECT BY LEVEL <= 100) d
                    WHERE  l <= length(v_join_table) - length(REPLACE(v_join_table, chr(10))) + 1);

            /*取关联表名，格式处理*/
            v_join_table:=replace(v_join_table,chr(10),chr(10)||'       ')||' '||cur.join_as;

                /*条件:第一个表处理*/
            if cur.join_seq=0 then

                /*处理where部分脚本*/
                v_where_str:=case when cur.join_sql is null then 'where 1=1' when lower(cur.join_sql) like 'where %' then cur.join_sql else 'where  '||cur.join_sql end;

                /*取行首缩进空格数*/
                select min(case when seq_num=1 then 999
                                else length(where_str_part) - length(ltrim(where_str_part, ' ')) end
                          ) as blanks
                into   v_blanks
                FROM   (SELECT rownum AS seq_num,
                               regexp_substr(v_where_str, '[^' || chr(10) || ']+', 1, l) AS where_str_part
                        FROM   dual a,
                               (SELECT LEVEL l
                                FROM   dual
                                CONNECT BY LEVEL <= 100) d
                        WHERE  l <= length(v_where_str) - length(REPLACE(v_where_str, chr(10))) + 1);

                /*条件分支03.07.05结束*/
            end if;

            /*join 表部分处理*/
            v_buffer:=case when cur.join_seq=0 then '       '||v_join_table else cur.join_type ||chr(10)||'       '||v_join_table||chr(10) end;

            v_clob:=v_clob||v_buffer;

            /*join 关联条件处理*/
            v_buffer:=case when cur.join_seq=0 then '' else 'on     '||chr(10)||'       '||cur.join_sql end||chr(10);

            v_clob:=v_clob||v_buffer;

            /*取关联表信息-循环结束*/
        end loop;

        /*拼接where脚本*/
        v_buffer:=v_where_str;

        v_clob:=v_clob||v_buffer;

        /*更新配置生成后的脚本*/
        update APP.tb_etl_sp_step a
           set a.step_sql=APP.f_step_sql_set(v_clob||case when v_clob not like '%;' then ';' end,a.step_seq),
               a.update_user=i_user_code,
               a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss')
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.VERSION_ID=i_VERSION_ID
           and a.STEP_SEQ=i_STEP_SEQ;

        /*更新变动标志*/
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*不满足条件*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许修改'
                             when nvl(v_step_type,' ') <> '2' then '只能对插入步骤操作'
                         end
        ;
        rollback;
        return;

        /*条件分支03结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '执行成功';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P30006
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_target_table                       IN VARCHAR2 ,--
    i_source_from                        IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT CLOB --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤SQL查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250617 02:31:52
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_step_sql                           VARCHAR2 ;--
    v_return_sql                         CLOB ;--
    v_step_type                          CHAR(1) ;--
    v_test_etl_sp_name                   VARCHAR2 default upper(i_ETL_SP_NAME);--
    v_etl_sp_type                        VARCHAR2 ;--
    v_return_code                        INTEGER ;--
    v_return_msg                         VARCHAR2 ;--
BEGIN
        /*条件:查询的是程序步骤配置代码*/
    if i_step_seq is not null and i_source_from='set' then

        /*取步骤SQL和步骤类别*/
        select a.STEP_SQL,
               a.step_type
          into v_step_sql,
               v_step_type
          from APP.tb_etl_sp_step a
         where a.etl_sp_name=i_etl_sp_name
            and a.version_id=i_version_id
            and a.step_seq=i_step_seq
        ;

        v_return_sql:=v_step_sql;

        /*条件：查询数据库当前程序代码*/
    elsif i_source_from='db' then

        /*取源代码*/
        APP.PR_ETL_SP_GET_DBA_SOURCE(i_ETL_SP_NAME,i_user_code,v_return_code,v_return_msg);

            /*-循环开始*/
        for cur in (select text as sql_code from APP.tb_dba_source where etl_sp_name=i_etl_sp_name order by LINE)
        loop

            v_return_sql:=v_return_sql||cur.sql_code||chr(10);

            /*-循环结束*/
        end loop;

        /*查询完整程序配置代码*/
    else

        /*取程序类别*/
        select max(a.object_type) as etl_sp_type
          into v_etl_sp_type
          from APP.tb_etl_sp a
         where a.etl_sp_name=i_etl_sp_name
           and a.version_id=i_version_id;

        /*清空程序代码数据*/
        delete from APP.tb_etl_sp_code a
         where a.etl_sp_name=i_etl_sp_name
           and a.version_id=i_version_id;

        /*拼接完成程序SQL，插入代码表*/
        insert into APP.TB_ETL_SP_CODE
        (
               ETL_SP_NAME,
               VERSION_ID,
               LINE,
               SQL_CODE
        )
        select 
               i_etl_sp_name as ETL_SP_NAME,
               i_version_id as VERSION_ID,
               row_number() over(order by part_seq,line_seq) as LINE,
               step_sql as SQL_CODE
        from   
               (
                select 'CREATE OR REPLACE '||v_etl_sp_type||' '||v_test_etl_sp_name||chr(10)||'(' as step_sql,
                       1.1 as part_seq,
                       1 as line_seq
                  from dual
                union all
                
                select params_sql||case when line_seq=line_count then '' else ',' end||case when params_summary is not null then '--'||params_summary end,
                       part_seq,
                       line_seq
                  from (
                       select rpad('    '||a.params_name,40,' ')||' '||
                              decode(a.params_type,'1','IN ','2','OUT ')||a.params_data_type||' '||
                              case when a.PARAMS_DEFAULT_VALUE<>'' then 'default '||a.PARAMS_DEFAULT_VALUE else '' end as params_sql,
                              ltrim(a.params_summary,'--') as params_summary,
                              1.2 as part_seq,
                              row_number() over(order by b.sequence,a.params_seq) as line_seq,count(1) over() as line_count
                         from APP.tb_etl_sp_params a
                        inner join 
                              app.tb_etl_sp a1
                           on a.ETL_SP_NAME=a1.ETL_SP_NAME
                         left join
                              all_arguments b
                           on a.etl_sp_name=b.OWNER||'.'||b.OBJECT_NAME
                          and upper(a.params_name)=b.ARGUMENT_NAME
                        where a.etl_sp_name=i_etl_sp_name
                          and a.version_id=i_version_id
                          and ((a.params_type in ('1','2') and a1.OBJECT_TYPE='PROCEDURE') or (a.params_type in ('1') and a1.OBJECT_TYPE='FUNCTION'))
                       )
                union all
                select ') '||decode(v_etl_sp_type,'PROCEDURE','AUTHID definer IS','FUNCTION','RETURN VARCHAR2 IS')||chr(10)||
                       '    -------------------------------------------------------------------------------------'||chr(10)||
                       '    -- 版    权: 国泰海通'||chr(10)||
                       '    -- 版    本: '||i_version_id||chr(10)||
                       '    -- 开发人员:'||chr(10)||
                       '    -- 创建日期:'||chr(10)||
                       '    -- 模块编号:'||chr(10)||
                       '    -- 模块名称:'||chr(10)||
                       '    -- 功能名称: '||SUMMARY||chr(10)||
                       '    ---------------------------------------------------------------------------------------'||chr(10)||
                       '    -- 修改作者:'||chr(10)||
                       '    -- 修改日期:'||UPDATE_TIME||chr(10)||
                       '    -- 修改内容:'||replace(UPGRADE_SUMMARY_LIST,chr(10),chr(10)||'    -- 修改内容:')||chr(10)||
                       '    --==============================================================================' as step_sql,1.3 as part_seq,1 as line_seq
                  from (select a.*,
                               listagg(a.version_id||':'||chr(10)||a.upgrade_summary,chr(10))  within group(order by version_id desc) over(partition by etl_sp_name ) as UPGRADE_SUMMARY_LIST 
                          from APP.tb_etl_sp a
                         where etl_sp_name=i_etl_sp_name
                           and version_id<=i_version_id
                       )
                 where etl_sp_name=i_etl_sp_name
                   and version_id=i_version_id
                 union all
                
                select rpad('    '||a.params_name,40,' ')||' '||a.params_data_type||' '||
                       case when a.PARAMS_DEFAULT_VALUE<>'' then 'default '||a.PARAMS_DEFAULT_VALUE else '' end||';'||
                       case when a.params_summary is not null then '--'||ltrim(a.params_summary,'--') end,
                       2 as part_seq,
                       row_number() over(order by a.params_seq) as line_seq
                  from APP.tb_etl_sp_params a
                 where a.etl_sp_name=i_etl_sp_name
                   and a.version_id=i_version_id
                   and a.params_type in ('3')
                 union all
                select 'BEGIN',
                       2.1 as part_seq,
                       1 as line_seq
                  from dual
                 union all
                
                select case when a.step_seq='99' and upper(step_sql) like 'EXCEPTION%' then
                       '    -- ============================================================================'||chr(10)||
                       '    -- 错误处理部分'||chr(10)||
                       '    -- ============================================================================'||chr(10)||a.step_sql
                            else case when a.STEP_SUMMARY is not null then '    '||APP.f_step_sql_set('/*',a.step_seq)||replace(a.STEP_SUMMARY,chr(10),chr(10)||'    ')||'*/'||chr(10) end||'    '||replace(a.step_sql,chr(10),chr(10)||'    ')||chr(10) end,
                       3 as part_seq,
                       row_number() over(order by a.step_seq) as line_seq
                  from APP.tb_etl_sp_step a
                 where a.step_type not in ('5','6')
                   and a.etl_sp_name=i_etl_sp_name
                   and a.version_id=i_version_id
                 union all
                select decode(v_etl_sp_type,'PROCEDURE',
                       '    -- ============================================================================'||chr(10)||
                       '    -- 错误处理部分'||chr(10)||
                       '    -- ============================================================================'||chr(10)||
                       'EXCEPTION'||chr(10)||
                       '   WHEN OTHERS THEN'||chr(10)||
                       '       o_return_code := SQLCODE;'||chr(10)||
                       '       o_return_msg  := o_return_msg || SQLERRM;'||chr(10)||
                       '       ROLLBACK;'||chr(10)||
                       'END;','FUNCTION',chr(10)||
                       'END;'),
                       4 as part_seq,
                       1 as line_seq
                  from dual
                 where not exists(select 1 from APP.tb_etl_sp_step
                                   where etl_sp_name=i_etl_sp_name
                                     and version_id=i_version_id
                                     and step_seq='99'
                                     and upper(step_sql) like 'EXCEPTION%')
               ) a
        where  1=1;

            /*-循环开始*/
        for cur in (select sql_code from APP.tb_etl_sp_code where etl_sp_name=i_etl_sp_name and version_id=i_version_id order by LINE)
        loop

            v_return_sql:=v_return_sql||cur.sql_code||chr(10);

            /*-循环结束*/
        end loop;

        /*条件分支01结束*/
    end if;

    commit;
    o_return_code := 0;
    o_return_msg  := v_return_sql;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P40002
(
    i_project_id                         IN VARCHAR2 ,--
    i_project_version                    IN VARCHAR2 ,--
    i_sp_func_name                       IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 项目模块涉及程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:42:00
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
BEGIN
    /*返回查询结果*/
    OPEN rt_cursor FOR
    select a.project_id, 
           a.project_version, 
           a.if_upgraded, 
           a.if_upgraded_v, 
           a.sp_func_name, 
           a.comments, 
           a.object_type, 
           a.etl_sp_version, 
           coalesce(a.etl_sp_version_up, b.upgrade_summary) as etl_sp_version_up,
           a.upgrade_summary, 
           a.update_user, 
           a.update_time, 
           a.pk_id, 
           a.backup_time, 
           a.if_changed
    from   APP.VW_PROJECT_SP_FUNC_LIST a
    left join
           APP.tb_etl_sp b
    on     a.sp_func_name=b.etl_sp_name
    and    b.version_status='2'
    and    b.version_id>a.etl_sp_version
    where  a.project_id=i_project_id
    and    a.project_version=i_project_version
    and    (a.sp_func_name=I_SP_FUNC_NAME or I_SP_FUNC_NAME is null);

    o_return_code := 0;
    o_return_msg:='执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P30005
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_target_table                       IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 插入步骤字段映射查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:30:49
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_target_table                       VARCHAR2(100) ;--
    v_return_code                        INTEGER ;--
    v_return_msg                         VARCHAR2(100) ;--
BEGIN
    /*加载字段*/
    APP.PR_ETL_SP_STEP_INSERT_ADD(i_etl_sp_name,i_version_id,i_user_code,i_step_seq,i_target_table,v_return_code,v_return_msg);

    /*返回结果*/
    open rt_cursor for
    select a.etl_sp_name,
           a.version_id,
           a.step_seq,
           a.target_table,
           a.target_column,
           a.COLUMN_COMMENTS,
           decode(c.data_type || CASE
                                     WHEN c.data_type = 'NUMBER' THEN
                                      '(' || c.data_precision || ',' || c.data_scale || ')'
                                     when c.data_type = 'NVARCHAR' then
                                      '(' || c.data_length/2 || ')'
                                     ELSE
                                      '(' || c.data_length || ')'
                                 END, 'NUMBER(,)', 'NUMBER', 'NUMBER(,0)', 'INTEGER',
                  c.data_type || CASE
                                     WHEN c.data_type = 'NUMBER' THEN
                                      '(' || c.data_precision || ',' || c.data_scale || ')'
                                     when c.data_type = 'NVARCHAR' then
                                      '(' || c.data_length/2 || ')'
                                     ELSE
                                      '(' || c.data_length || ')'
                                 END) as data_type,
           a.source_column,
           a.column_summary,
           a.column_id,
           a.update_time,
           a.update_user,
           case when c.nullable='N' then 'Y' end as notnull
      from APP.tb_etl_sp_step_insert a
      left join
           all_tab_columns c
        on upper(i_target_table)=c.OWNER||'.'||c.TABLE_NAME
       and upper(a.target_column)=c.COLUMN_NAME
     where a.etl_sp_name=i_ETL_SP_NAME
       and a.version_id=i_VERSION_ID
       and a.step_seq=i_STEP_SEQ
     order by a.column_id
    ;

    /*返回结果*/
    o_return_code := 0;
    o_return_msg := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P40001
(
    i_project_id                         IN VARCHAR2 ,--
    i_project_version                    IN VARCHAR2 ,--
    i_tab_view_name                      IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 项目模块涉及表视图
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:40:07
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
BEGIN
    /*返回查询结果*/
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
            a.pk_id
    from    APP.vw_project_tab_view_list a
    where   a.project_id=i_project_id
    and     a.project_version=i_project_version
    and     (a.tab_view_name=i_tab_view_name or i_tab_view_name is null);

    o_return_code := 0;
    o_return_msg:='执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_PARAMS_LOAD
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 加载程序参数
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 18:32:52
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_return_msg                         VARCHAR2 ;--
    v_return_code                        INTEGER ;--
BEGIN
    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

        /*删除参数*/
        delete from APP.Tb_Etl_Sp_Params
         where ETL_SP_NAME=i_ETL_SP_NAME
           and VERSION_ID=i_version_id
        ;

        /*加载输入和输出参数*/
        insert into APP.TB_ETL_SP_PARAMS
        (
               ETL_SP_NAME,
               PARAMS_NAME,
               PARAMS_TYPE,
               PARAMS_DATA_TYPE,
               PARAMS_DEFAULT_VALUE,
               PARAMS_SUMMARY,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               PARAMS_SEQ,
               TEST_VALUE
        )
        select 
               i_ETL_SP_NAME as ETL_SP_NAME,
               lower(ARGUMENT_NAME) as PARAMS_NAME,
               decode(IN_OUT,'IN','1','OUT','2') as PARAMS_TYPE,
               decode(DATA_TYPE,'REF CURSOR','TYPES.CURSORTYPE',DATA_TYPE) as PARAMS_DATA_TYPE,
               '' as PARAMS_DEFAULT_VALUE,
               '' as PARAMS_SUMMARY,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               i_version_id as VERSION_ID,
               decode(IN_OUT,'IN','1.','OUT','2.')||trim(to_char(POSITION,'00')) as PARAMS_SEQ,
               '' as TEST_VALUE
        from   
               all_arguments a
        where  owner||'.'||object_name=upper(i_ETL_SP_NAME)
        and ARGUMENT_NAME is not null;

        APP.PR_ETL_SP_GET_DBA_SOURCE(i_ETL_SP_NAME,i_user_code,v_return_code,v_return_msg);

        /*插入业务过程参数*/
        insert into APP.TB_ETL_SP_PARAMS
        (
               ETL_SP_NAME,
               PARAMS_NAME,
               PARAMS_TYPE,
               PARAMS_DATA_TYPE,
               PARAMS_DEFAULT_VALUE,
               PARAMS_SUMMARY,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               PARAMS_SEQ,
               TEST_VALUE
        )
        select 
               DISTINCT i_ETL_SP_NAME as ETL_SP_NAME,
               params_name as PARAMS_NAME,
               '3' as PARAMS_TYPE,
               upper(data_type_new) as PARAMS_DATA_TYPE,
               TRIM(substr(default_value, 1, instr(default_value, ';') - 1)) as PARAMS_DEFAULT_VALUE,
               case when instr(text,'--')>0 then substr(text,instr(text,'--')) else '' end as PARAMS_SUMMARY,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               i_version_id as VERSION_ID,
               '3.'||trim(to_char(row_number() over(order by LINE),'00')) as PARAMS_SEQ,
               '' as TEST_VALUE
        from   
               (SELECT text,
                      params_name,
                      data_type,
                      substr(data_type, 1, instr(REPLACE(data_type, ' ', ';'), ';') - 1) AS data_type_new,
                      CASE
                          WHEN lower(data_type) LIKE '% default %' THEN
                           substr(data_type, instr(lower(data_type), ' default ') + 9)
                          ELSE
                           ''
                      END AS default_value,
                      line
                FROM (SELECT TRIM(replace(a.text,chr(9),'    ')) AS text,
                             lower(substr(TRIM(replace(a.text,chr(9),'    ')), 1, instr(TRIM(replace(a.text,chr(9),'    ')), ' ') - 1)) AS params_name,
                             TRIM(substr(TRIM(replace(a.text,chr(9),'    ')), instr(TRIM(replace(a.text,chr(9),'    ')), ' '))) AS data_type,
                             a.LINE
                        FROM APP.tb_dba_source a
                       WHERE a.owner || '.' || a.NAME = upper(i_ETL_SP_NAME)
                         AND TRIM(lower(REPLACE(replace(a.text,chr(9),'    '), '_', '-'))) LIKE 'v-%'
                         and a.line<(select min(line) from APP.tb_dba_source b where b.owner || '.' || b.NAME = upper(i_ETL_SP_NAME) and TRIM(lower(b.text)) = 'begin')
                     )
               ) a
        where  data_type_new IS NOT NULL
        ;

        /*更新变动时间*/
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许修改参数';
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*返回*/
    commit;
    o_return_msg := '参数已载入';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P40000
(
    i_project_pk                         IN VARCHAR2 ,--
    i_project_id                         IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 项目模块管理
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:37:58
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
BEGIN
    /*返回查询结果*/
    OPEN rt_cursor FOR
    select a.project_id,
           a.project_name,
           a.project_version,
           a.if_upgraded,
           a.if_upgraded_name as if_upgraded_v,
           a.version_summary,
           a.upgrade_code,
           a.update_user,
           a.update_time,
           a.pk_id as sid,
           a.parent_pk as parent_id,
           case when (select count(1) from APP.vw_project b where b.PARENT_PK=a.pk_id and b.parent_pk is not null)>0 then 0 else 1 end as "_leaf"
    from   APP.vw_project a
    where  (a.PARENT_PK=i_project_pk or (i_project_pk is null and a.parent_pk is null))
    and    (a.project_id=i_project_id or i_project_id is null);

    o_return_code := 0;
    o_return_msg:='执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_JOIN_UPDATE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_join_seq                           IN NUMBER ,--
    i_join_table                         IN VARCHAR2 ,--
    i_join_as                            IN VARCHAR2 ,--
    i_join_type                          IN VARCHAR2 ,--
    i_join_sql                           IN VARCHAR2 ,--
    i_join_summary                       IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序插入步骤关联配置修改
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 23:55:54
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;--
    v_err_msg                            VARCHAR2 default '';--
    v_exists                             INTEGER default 0;--
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_target_table                       VARCHAR2 ;--
    v_join_table                         VARCHAR2 default APP.f_step_sql_set(i_join_table,'00');--
    v_join_sql                           VARCHAR2 default APP.f_step_sql_set(i_join_sql,'00');--
    v_blank_bar                          VARCHAR2 ;--
BEGIN
    /*获取版本状态*/
    SELECT version_status as vstatus,
           version_id as vid
    INTO   v_version_status,
           v_version_id
    FROM   APP.tb_etl_sp
    WHERE  etl_sp_name = i_etl_sp_name
    AND    version_id = i_version_id;

    /*判断关联表别名是否存在*/
    SELECT COUNT(1) as exist
    INTO   v_exists
    FROM   APP.tb_etl_sp_step_join a
    WHERE  etl_sp_name = i_etl_sp_name
    AND    version_id = i_version_id
    AND    step_seq = i_step_seq
    AND    join_seq <> i_join_seq
    AND    lower(TRIM(a.join_as)) = lower(TRIM(i_join_as));

    /*获取目标表*/
    SELECT MAX(target_table) as target_table
    INTO   v_target_table
    FROM   APP.tb_etl_sp_step
    WHERE  etl_sp_name = i_etl_sp_name
    AND    version_id = i_version_id
    AND    step_seq = i_step_seq;

        /*条件:状态修订中且别名不重复*/
    if v_version_status = '2' and v_exists=0 then

        /*获取前部空格串*/
        v_blank_bar:=substr(v_join_table,1,REGEXP_INSTR(v_join_table,'\S')-1);

        /*替换每行最前面的空格串*/
        v_join_table:=ltrim(replace(v_join_table,chr(10)||v_blank_bar,chr(10)));

        /*获取前部空格串*/
        v_blank_bar:=substr(v_join_sql,1,REGEXP_INSTR(v_join_sql,'\S')-1);

        /*替换每行最前面的空格串*/
        v_join_sql:=ltrim(replace(v_join_sql,chr(10)||v_blank_bar,chr(10)));

        /*修改表关联配置*/
        update APP.Tb_Etl_Sp_STEP_join a
           set a.JOIN_TABLE=case when v_join_table like '(%)' 
                                 then v_join_table
                                 else upper(v_join_table) end,
               a.join_as=lower(trim(i_join_as)),
               a.JOIN_TYPE=i_JOIN_TYPE,
               a.JOIN_SQL=case when ltrim(lower(v_join_sql)) like 'where %' then 
                                    ltrim(substr(v_join_sql,instr(lower(v_join_sql),'where ')+6))
                               else ltrim(v_join_sql) end ,
               a.JOIN_SUMMARY=i_JOIN_SUMMARY,
               a.UPDATE_TIME=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.UPDATE_USER=i_user_code
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
           and a.step_seq=i_step_seq
           and a.join_seq=i_join_seq
        ;

        /*插入步骤SQL生成*/
        APP.PR_ETL_SP_STEP_INSERT_SQL(i_ETL_SP_NAME,i_version_id,i_user_code,i_step_seq,v_target_table,v_errcode, v_err_msg);

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许修改步骤关联配置' 
                             when v_exists>0 then '存在相同别名的表,请修改'
                         end;
        rollback;
        return;

        /*条件分支04结束*/
    end if;

    /*返回*/
    commit;
    o_return_msg := '步骤关联配置已修改';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_JOIN_INSERT
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_join_table                         IN VARCHAR2 ,--
    i_join_as                            IN VARCHAR2 ,--
    i_join_type                          IN VARCHAR2 ,--
    i_join_sql                           IN VARCHAR2 ,--
    i_join_summary                       IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序插入步骤关联配置添加
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 23:51:16
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;--
    v_err_msg                            VARCHAR2 default '';--
    v_exists                             INTEGER default 0;--
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_join_seq                           INTEGER ;--
    v_target_table                       VARCHAR2 ;--
    v_join_table                         VARCHAR2 default APP.f_step_sql_set(i_join_table,'00');--
    v_join_sql                           VARCHAR2 default APP.f_step_sql_set(i_join_sql,'00');--
    v_blank_bar                          VARCHAR2 ;--
BEGIN
    /*获取版本状态*/
    SELECT version_status as vstatus,
           version_id as vid
    INTO   v_version_status,
           v_version_id
    FROM   APP.tb_etl_sp
    WHERE  etl_sp_name = i_etl_sp_name
    AND    version_id = i_version_id;

    /*获取目标表*/
    select max(TARGET_TABLE) as target_table
      into v_target_table
      from APP.tb_ETL_SP_step
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
       and step_seq=i_step_seq
    ;

    /*获取下一关联序号*/
    SELECT nvl(MAX(join_seq) + 1, 0) AS join_seq
    INTO   v_join_seq
    FROM   APP.tb_etl_sp_step_join a
    WHERE  etl_sp_name = i_etl_sp_name
    AND    version_id = i_version_id
    AND    step_seq = i_step_seq;

    /*判断关联表别名是否存在*/
    SELECT COUNT(1) as exist
    INTO   v_exists
    FROM   APP.tb_etl_sp_step_join a
    WHERE  etl_sp_name = i_etl_sp_name
    AND    version_id = i_version_id
    AND    step_seq = i_step_seq
    AND    join_seq <> v_join_seq
    AND    lower(TRIM(a.join_as)) = lower(TRIM(i_join_as));

        /*条件:状态修订中，且关联表别名没占用*/
    if v_version_status = '2' and v_exists=0 then

        /*获取前部空格串*/
        v_blank_bar:=substr(v_join_table,1,REGEXP_INSTR(v_join_table,'\S')-1);

        /*替换每行最前面的空格串*/
        v_join_table:=ltrim(replace(v_join_table,chr(10)||v_blank_bar,chr(10)));

        /*获取前部空格串*/
        v_blank_bar:=substr(v_join_sql,1,REGEXP_INSTR(v_join_sql,'\S')-1);

        /*替换每行最前面的空格串*/
        v_join_sql:=ltrim(replace(v_join_sql,chr(10)||v_blank_bar,chr(10)));

        /*插入表关联配置*/
        insert into APP.TB_ETL_SP_STEP_JOIN
        (
               ETL_SP_NAME,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               STEP_SEQ,
               JOIN_TABLE,
               JOIN_SEQ,
               JOIN_TYPE,
               JOIN_SQL,
               JOIN_SUMMARY,
               JOIN_AS
        )
        select 
               i_ETL_SP_NAME as ETL_SP_NAME,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               i_version_id as VERSION_ID,
               i_step_seq as STEP_SEQ,
               case when v_join_table like '(%)' then v_join_table else upper(v_join_table) end as JOIN_TABLE,
               v_join_seq as JOIN_SEQ,
               i_join_type as JOIN_TYPE,
               case when ltrim(lower(v_join_sql)) like 'where %' then ltrim(substr(v_join_sql,instr(lower(v_join_sql),'where ')+6)) else ltrim(v_join_sql) end as JOIN_SQL,
               i_join_summary as JOIN_SUMMARY,
               lower(trim(i_join_as)) as JOIN_AS
        from   
               dual a
        where  not exists(select 1 from APP.Tb_Etl_Sp_step_join b 
                        where b.etl_sp_name=i_ETL_SP_NAME 
                          and b.step_seq=i_step_seq
                          and b.version_id=i_version_id
                          and b.join_seq=v_join_seq)
        ;

        /*插入步骤SQL语句生成*/
        APP.PR_ETL_SP_STEP_INSERT_SQL(i_ETL_SP_NAME,i_version_id,i_user_code,i_step_seq,v_target_table,v_errcode, v_err_msg);

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许步骤关联配置' 
                             when v_exists>0 then '存在相同别名的表,请修改'
                         end
        ;
        rollback;
        return;

        /*条件分支05结束*/
    end if;

    /*返回*/
    commit;
    o_return_msg := '步骤关联新增完成';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_JOIN_DELETE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_join_seq                           IN NUMBER ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序插入步骤关联配置删除
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 23:25:46
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;--
    v_err_msg                            VARCHAR2(128) default '';--
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2(10) ;--
    v_target_table                       VARCHAR2(100) ;--
BEGIN
    /*获取版本状态*/
    SELECT version_status as vstatus,
           version_id as vid
    INTO   v_version_status,
           v_version_id
    FROM   APP.tb_etl_sp
    WHERE  etl_sp_name = i_etl_sp_name
    AND    version_id = i_version_id;

    /*获取目标表*/
    SELECT MAX(target_table) AS target_table
    INTO   v_target_table
    FROM   APP.tb_etl_sp_step
    WHERE  etl_sp_name = i_etl_sp_name
    AND    version_id = i_version_id
    AND    step_seq = i_step_seq;

        /*条件:状态修订中，且删除的非主表*/
    if v_version_status = '2' and i_join_seq>0 then

        /*删除表关联配置*/
        DELETE FROM APP.tb_etl_sp_step_join
        WHERE  etl_sp_name = i_etl_sp_name
        AND    version_id = i_version_id
        AND    step_seq = i_step_seq
        AND    join_seq = i_join_seq;

        /*插入步骤SQL生成*/
        APP.PR_ETL_SP_STEP_INSERT_SQL(i_ETL_SP_NAME,i_version_id,i_user_code,i_step_seq,v_target_table,v_errcode, v_err_msg);

        /*状态已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许删除步骤关联配置'
                             when i_join_seq=0 then '主表不能删除'
                         end
        ;
        rollback;
        return;

        /*条件分支03结束*/
    end if;

    /*返回*/
    commit;
    o_return_msg := '步骤关联配置已删除';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_INSERT_EDIT
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_target_table                       IN VARCHAR2 ,--
    i_column_comments                    IN VARCHAR2 ,--
    i_target_column                      IN VARCHAR2 ,--
    i_source_column                      IN VARCHAR2 ,--
    i_column_summary                     IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序插入步骤字段配置修改
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 23:11:22
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;--
    v_err_msg                            VARCHAR2 default '';--
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_source_column                      VARCHAR2 default APP.f_step_sql_set(i_source_column,'00');--
    v_blank_bar                          VARCHAR2 ;--
BEGIN
    /*取程序版本状态*/
    select VERSION_STATUS,
           VERSION_ID
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:状态修订中*/
    if v_version_status = '2' then

        /*获取前部空格串*/
        v_blank_bar:=substr(v_source_column,1,REGEXP_INSTR(v_source_column,'\S')-1);

        /*替换每行最前面的空格串*/
        v_source_column:=ltrim(replace(v_source_column,chr(10)||v_blank_bar,chr(10)));

        /*更新配置*/
        update APP.Tb_Etl_Sp_STEP_insert a
           set a.SOURCE_COLUMN=case when lower(v_source_column) like '% as %' then 
                                         substr(v_source_column,1,instr(lower(v_source_column),' as ',-1)-1)
                                    else rtrim(v_source_column,',') end,
               a.COLUMN_SUMMARY=i_COLUMN_SUMMARY,
               a.column_comments=i_column_comments,
               a.UPDATE_TIME=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.UPDATE_USER=i_user_code
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
           and a.step_seq=i_step_seq
           and a.target_table=i_target_table
           and a.target_column=i_target_column
        ;

        /*生成插入脚本*/
        APP.PR_ETL_SP_STEP_INSERT_SQL(i_ETL_SP_NAME,i_version_id,i_user_code,i_step_seq,i_target_table,v_errcode, v_err_msg);

        /*状态不满足条件*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许修改插入步骤字段配置'
                         end;
        rollback;
        return;

        /*条件分支02结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '插入步骤字段配置已修改';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P40003
(
    i_project_id                         IN VARCHAR2 ,--
    i_project_version                    IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT CLOB --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 开发项目版本升级脚本查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 21:46:15
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;--
    v_err_msg                            CLOB default '';--
    v_exists                             INTEGER default 0;--
    v_update_time                        VARCHAR2(100) default to_char(SYSDATE, 'YYYYMMDD hh24:mi:ss');--
BEGIN
        /*按刷库顺序拼接刷库脚本-循环开始*/
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
                       a.modify_sql
                from   APP.vw_project_tab_view_list a
                left   join 
                       (select distinct object_name,object_seq from APP.tb_dependencies) b
                on     a.tab_view_name=b.object_name
                where  a.modify_sql IS NOT NULL
                AND    a.project_id = i_project_id
                AND    a.project_version = i_project_version
                order by object_seq
               )
    loop

            /*条件:对象为程序*/
        if cur.object_type='sp' then

            /*根据待升级版本取程序代码*/
            APP.P30006(cur.object_name,cur.etl_sp_version_up,'admin',null,null,'1',v_errcode,v_err_msg);

            /*拼接升级脚本*/
            o_return_msg:=o_return_msg||v_err_msg||chr(10)||chr(10)||chr(10);

        else

            /*拼接表视图升级脚本*/
            o_return_msg:=o_return_msg||cur.modify_sql||chr(10)||chr(10)||chr(10);

            /*条件分支01.02结束*/
        end if;

        /*按刷库顺序拼接刷库脚本-循环结束*/
    end loop;

    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_INSERT
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_step_seq                           IN VARCHAR2 ,--
    i_step_summary                       IN VARCHAR2 ,--
    i_step_type                          IN VARCHAR2 ,--
    i_step_sql                           IN CLOB ,--
    i_target_table                       IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤添加
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:50:51
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;--
    v_err_msg                            VARCHAR2 default '';--
    v_exists                             INTEGER default 0;--
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_parent_step_seq                    VARCHAR2 ;--
    v_parent_step_type                   VARCHAR2 ;--
    v_end_check                          CHAR(1) default '1';--
    v_target_column_str                  VARCHAR2 ;--
    v_insert_column_str                  VARCHAR2 ;--
    v_join_str                           VARCHAR2 ;--
    v_blank_bar                          VARCHAR2 ;--
    v_step_seq                           VARCHAR2 default case when i_step_seq like '%+' then rtrim(i_step_seq,'+') else i_step_seq end;--
BEGIN
    /*获取版本状态*/
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid    
      into v_version_status,
           v_version_id           
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*条件:非根级步骤*/
    if v_step_seq like '%.%' then

        /*获取上级步骤序号*/
        select max(step_seq) as parent_step_SEQ,
               max(step_type) as parent_step_type
          into v_parent_step_SEQ,
               v_parent_step_type
          from APP.Tb_Etl_Sp_step a
         where ETL_SP_NAME=i_ETL_SP_NAME
           and version_id=i_version_id
           and v_step_seq like '%.%'
           and step_seq=substr(v_step_seq,1,instr(v_step_seq,'.',-1)-1)
        ;

        /*根级步骤*/
    else

        v_parent_step_SEQ:=v_step_seq;

        /*条件分支02结束*/
    end if;

        /*条件:插入、更新、变量赋值脚本没有以；结尾*/
    if i_step_type in ('1','2','3','4') and trim(rtrim(ltrim(i_step_sql,chr(10)),chr(10))) not like '%;' then

        /*结尾检查不通过*/
        v_end_check:='0';

        /*条件分支03结束*/
    end if;

    /*判断步骤号是否存在*/
    select count(1)
      into v_exists
      from APP.Tb_Etl_Sp_step a
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
       and step_seq=v_step_seq
    ;

        /*条件:*/
    if v_VERSION_STATUS = '2' and v_exists>0 and v_parent_step_SEQ is not null and v_end_check='1' and i_step_seq=v_step_seq||'+' THEN

        /*步骤下移*/
        APP.PR_ETL_SP_STEP_MOVE(I_ETL_SP_NAME,i_version_id,V_STEP_SEQ,i_user_code,v_errcode,v_err_msg);

            /*条件:*/
        if v_errcode<>0 THEN

            o_return_code := -1;
            o_return_msg := '步骤下移失败';
            return;

        ELSE

            v_exists:=0;

            /*条件分支05.03结束*/
        end if;

        /*条件分支05结束*/
    end if;

        /*条件:状态修订中，步骤序号不存在，根级步骤存在，代码结尾检查通过时*/
    if v_version_status = '2' and v_exists=0 and v_parent_step_SEQ is not null and v_end_check='1' then

        /*移除首尾换行*/
        i_step_sql:=rtrim(ltrim(i_step_sql,chr(10)),chr(10));

        /*获取前部空格串*/
        v_blank_bar:=substr(i_step_sql,1,REGEXP_INSTR(i_step_sql,'\S')-1);

        /*替换每行最前面的空格串*/
        i_step_sql:=ltrim(replace(i_step_sql,chr(10)||v_blank_bar,chr(10)));

        /*插入步骤，并根据步骤级别，进行缩进处理*/
        insert into APP.TB_ETL_SP_STEP
        (
               ETL_SP_NAME,
               UPDATE_TIME,
               UPDATE_USER,
               VERSION_ID,
               STEP_SEQ,
               STEP_SUMMARY,
               STEP_TYPE,
               STEP_SQL,
               TARGET_TABLE,
               STEP_SQL_AUTO,
               OTHER_PARAMS
        )
        select 
               i_ETL_SP_NAME as ETL_SP_NAME,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               i_version_id as VERSION_ID,
               v_step_seq as STEP_SEQ,
               case when trim(lower(i_step_sql)) like 'elsif%' then '条件：'||i_step_summary else i_step_summary end as STEP_SUMMARY,
               i_step_type as STEP_TYPE,
               case when i_step_type not in ('2','5','6') then APP.f_step_sql_set(case when trim(lower(i_step_sql)) like 'elsif%then;' or trim(lower(i_step_sql)) like 'else%;' then rtrim(i_step_sql,';') else i_step_sql end, case when v_parent_step_type='6' and (lower(trim(i_step_sql)) like 'else%' or lower(trim(i_step_sql)) like 'elsif%') then v_parent_step_SEQ else v_step_seq end) end as STEP_SQL,
               case when i_step_type in ('1','2','3') then upper(trim(i_target_table)) end as TARGET_TABLE,
               '' as STEP_SQL_AUTO,
               '' as OTHER_PARAMS
        from   
               DUAL a
        where  not exists(select 1 from APP.Tb_Etl_Sp_step b 
                          where b.etl_sp_name=i_ETL_SP_NAME 
                            and b.step_seq=v_step_seq
                            and b.version_id=i_version_id)
        ;

            /*条件:插入步骤处理*/
        if i_step_type ='2' then

            /*插入字段映射*/
            insert into APP.TB_ETL_SP_STEP_INSERT
            (
                   ETL_SP_NAME,
                   UPDATE_TIME,
                   UPDATE_USER,
                   VERSION_ID,
                   STEP_SEQ,
                   TARGET_TABLE,
                   TARGET_COLUMN,
                   SOURCE_COLUMN,
                   COLUMN_SUMMARY,
                   COLUMN_ID,
                   COLUMN_COMMENTS
            )
            select 
                   i_ETL_SP_NAME as ETL_SP_NAME,
                   to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
                   i_user_code as UPDATE_USER,
                   i_version_id as VERSION_ID,
                   v_step_seq as STEP_SEQ,
                   upper(trim(i_target_table)) as TARGET_TABLE,
                   a.COLUMN_NAME as TARGET_COLUMN,
                   '' as SOURCE_COLUMN,
                   '' as COLUMN_SUMMARY,
                   a.column_id as COLUMN_ID,
                   b.COMMENTS as COLUMN_COMMENTS
            from   
                   all_tab_columns a
            left join
                   all_col_comments b
            on     
                   a.OWNER=b.OWNER
            and a.TABLE_NAME=b.TABLE_NAME
            and a.COLUMN_NAME=b.COLUMN_NAME
            where  a.OWNER||'.'||a.TABLE_NAME=upper(trim(i_target_table))
            and not exists(select 1 from APP.tb_etl_sp_step_insert c
                            where i_ETL_SP_NAME=c.etl_sp_name
                              and i_version_id=c.VERSION_ID
                              and v_step_seq=c.STEP_SEQ
                              and upper(trim(i_target_table))=upper(trim(c.target_table))
                              and a.COLUMN_NAME=upper(trim(c.target_column))
                          )
             order by a.COLUMN_ID
            ;

            /*截取插入字段字符串*/
            v_target_column_str:=APP.f_step_insert_rebuild(i_step_sql,'insert');

            /*截取关联表字符串*/
            v_join_str:=APP.f_step_insert_rebuild(i_step_sql,'join');

                /*条件:插入字段字符串不为空*/
            if v_target_column_str is not null then

                /*截取插入字段*/
                v_insert_column_str:=substr(v_target_column_str,instr(v_target_column_str,'∷')+1);

                /*截取目标字段*/
                v_target_column_str:=substr(v_target_column_str,1,instr(v_target_column_str,'∷')-1);

                    /*一个一个字段进行映射-循环开始*/
                for cur in (select a.line_seq,
                                   trim(a.target_column) as target_column,
                                   trim(b.insert_column) as insert_column
                              from 
                                   (SELECT rownum as line_seq,
                                           TRIM(REGEXP_SUBSTR(v_target_column_str, '[^' || '⊙' || ']+', 1, LEVEL)) as target_column
                                    FROM   dual
                                    CONNECT BY LEVEL <= REGEXP_COUNT(v_target_column_str, '⊙') + 1
                                   ) a
                                   inner join 
                                   (SELECT rownum as line_seq,
                                           TRIM(REGEXP_SUBSTR(v_insert_column_str, '[^' || '⊙' || ']+', 1, LEVEL)) as insert_column
                                    FROM   dual
                                    CONNECT BY LEVEL <= REGEXP_COUNT(v_insert_column_str, '⊙') + 1
                                   ) b on a.line_seq=b.line_seq
                           )
                loop

                    /*更新字段映射表*/
                    update APP.tb_etl_sp_step_insert a
                       set a.SOURCE_COLUMN=case when lower(cur.insert_column) like '% as %' then 
                                                     substr(cur.insert_column,1,instr(lower(cur.insert_column),' as ',-1)-1)
                                                else rtrim(cur.insert_column,',') end
                     where a.etl_sp_name=i_etl_sp_name
                       and a.version_id=i_version_id
                       and a.step_seq=v_step_seq
                       and a.TARGET_COLUMN=rtrim(upper(cur.target_column),',')
                    ;

                    /*一个一个字段进行映射-循环结束*/
                end loop;

                /*条件分支06.06.05结束*/
            end if;

                /*条件:表关联字符串不为空*/
            if v_join_str is not null then

                    /*一个一个表插入关联表配置-循环开始*/
                for cur in (select a.line_seq,
                                   a.join_str as join_str,
                                   case when a.join_str like 'join left%' or a.join_str like 'join full%' then '2' else '1' end as join_type,
                                   case when a.join_str like 'join left%' or a.join_str like 'join full%' then APP.f_get_join_table('         '||substr(a.join_str,10))
                                        when a.join_str like 'join inner%' then APP.f_get_join_table('          '||substr(a.join_str,11))
                                        else APP.f_get_join_table(a.join_str) end as join_table,
                                   line_seq-1 as join_seq,
                                   APP.f_get_join_on(a.join_str) as join_sql,
                                   case when a.join_str like 'join left%' or a.join_str like 'join full%' then APP.f_get_join_table_as(substr(a.join_str,10))
                                        when a.join_str like 'join inner%' then APP.f_get_join_table_as(substr(a.join_str,11))
                                        else APP.f_get_join_table_as(a.join_str) end as join_as
                            from   (
                                    SELECT rownum as line_seq,
                                           TRIM(REGEXP_SUBSTR(v_join_str, '[^' || '⊙' || ']+', 1, LEVEL)) as join_str
                                    FROM   dual
                                    CONNECT BY LEVEL <= REGEXP_COUNT(v_join_str, '⊙') + 1
                                   ) a
                           )
                loop

                    insert into APP.TB_ETL_SP_STEP_JOIN
                    (
                           ETL_SP_NAME,
                           UPDATE_TIME,
                           UPDATE_USER,
                           VERSION_ID,
                           STEP_SEQ,
                           JOIN_TABLE,
                           JOIN_SEQ,
                           JOIN_TYPE,
                           JOIN_SQL,
                           JOIN_SUMMARY,
                           JOIN_AS
                    )
                    select 
                           i_etl_sp_name as ETL_SP_NAME,
                           to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
                           i_user_code as UPDATE_USER,
                           i_version_id as VERSION_ID,
                           v_step_seq as STEP_SEQ,
                           cur.join_table as JOIN_TABLE,
                           cur.join_seq as JOIN_SEQ,
                           cur.join_type as JOIN_TYPE,
                           case when ltrim(lower(cur.join_sql)) like 'where %' then ltrim(substr(cur.join_sql,instr(lower(cur.join_sql),'where ')+6)) else ltrim(cur.join_sql) end as JOIN_SQL,
                           '' as JOIN_SUMMARY,
                           cur.join_as as JOIN_AS
                    from   
                           dual a
                    where  1=1;

                    /*一个一个表插入关联表配置-循环结束*/
                end loop;

                /*条件分支06.06.06结束*/
            end if;

            /*拼接插入语句作为步骤SQL*/
            commit;
            APP.PR_ETL_SP_STEP_INSERT_SQL(i_ETL_SP_NAME,i_version_id,i_user_code,v_step_seq,upper(trim(i_target_table)),v_errcode, v_err_msg);

            /*条件分支06.06结束*/
        end if;

            /*条件:循环步骤*/
        if i_step_type ='5' then

            /*插入循环开始步骤*/
            insert into APP.TB_ETL_SP_STEP
            (
                   ETL_SP_NAME,
                   UPDATE_TIME,
                   UPDATE_USER,
                   VERSION_ID,
                   STEP_SEQ,
                   STEP_SUMMARY,
                   STEP_TYPE,
                   STEP_SQL,
                   TARGET_TABLE,
                   STEP_SQL_AUTO,
                   OTHER_PARAMS
            )
            select 
                   i_ETL_SP_NAME as ETL_SP_NAME,
                   to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
                   i_user_code as UPDATE_USER,
                   i_version_id as VERSION_ID,
                   v_step_seq||'.01' as STEP_SEQ,
                   i_step_summary||'-循环开始' as STEP_SUMMARY,
                   '9' as STEP_TYPE,
                   APP.f_step_sql_set( case when lower(trim(i_step_sql)) like 'select %' then 'for cur'||replace(v_step_seq,'.','_')||' in '||chr(10)||'('||rtrim(i_step_sql,';')||chr(10)||') loop'                                                   when lower(trim(i_step_sql)) like 'for %' then case when rtrim(lower(trim(i_step_sql)),';') like '% loop' or rtrim(lower(trim(i_step_sql)),';') like '%'||chr(10)||'loop'                                                                                                       then rtrim(trim(i_step_sql),';')                                                                                                       else rtrim(trim(i_step_sql),';')||chr(10)||'loop'                                                                                                  end                                                   when rtrim(lower(trim(i_step_sql)),';') like 'loop' then 'loop'                                                   else 'for cur'||replace(v_step_seq,'.','_')||' in '||chr(10)||'() loop'                                              end,                                             v_step_seq) as STEP_SQL,
                   '' as TARGET_TABLE,
                   '' as STEP_SQL_AUTO,
                   '' as OTHER_PARAMS
            from   
                   DUAL a
            where  not exists(select 1 from APP.Tb_Etl_Sp_step b
                              where b.etl_sp_name=i_ETL_SP_NAME 
                                and b.step_seq=v_step_seq||'.01'
                                and b.version_id=i_version_id);

            /*插入循环结束步骤*/
            insert into APP.TB_ETL_SP_STEP
            (
                   ETL_SP_NAME,
                   UPDATE_TIME,
                   UPDATE_USER,
                   VERSION_ID,
                   STEP_SEQ,
                   STEP_SUMMARY,
                   STEP_TYPE,
                   STEP_SQL,
                   TARGET_TABLE,
                   STEP_SQL_AUTO,
                   OTHER_PARAMS
            )
            select 
                   i_ETL_SP_NAME as ETL_SP_NAME,
                   to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
                   i_user_code as UPDATE_USER,
                   i_version_id as VERSION_ID,
                   v_step_seq||'.99' as STEP_SEQ,
                   i_step_summary||'-循环结束' as STEP_SUMMARY,
                   '9' as STEP_TYPE,
                   APP.f_step_sql_set('end loop;',v_step_seq) as STEP_SQL,
                   '' as TARGET_TABLE,
                   '' as STEP_SQL_AUTO,
                   '' as OTHER_PARAMS
            from   
                   dual a
            where  not exists(select 1 from APP.Tb_Etl_Sp_step b
                            where b.etl_sp_name=i_ETL_SP_NAME 
                              and b.step_seq=v_step_seq||'.99'
                              and b.version_id=i_version_id)
            ;

            /*条件分支06.07结束*/
        end if;

            /*条件:条件步骤*/
        if i_step_type ='6' then

            /*插入条件开始步骤*/
            insert into APP.TB_ETL_SP_STEP
            (
                   ETL_SP_NAME,
                   UPDATE_TIME,
                   UPDATE_USER,
                   VERSION_ID,
                   STEP_SEQ,
                   STEP_SUMMARY,
                   STEP_TYPE,
                   STEP_SQL,
                   TARGET_TABLE,
                   STEP_SQL_AUTO,
                   OTHER_PARAMS
            )
            select 
                   i_ETL_SP_NAME as ETL_SP_NAME,
                   to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
                   i_user_code as UPDATE_USER,
                   i_version_id as VERSION_ID,
                   v_step_seq||'.01' as STEP_SEQ,
                   '条件:'||i_step_summary as STEP_SUMMARY,
                   '9' as STEP_TYPE,
                   APP.f_step_sql_set( case when rtrim(lower(trim(i_step_sql)),';') like 'if %then' then rtrim(trim(i_step_sql),';') when trim(i_step_sql) is not null then 'if ('||rtrim(trim(i_step_sql),';')||') then' else 'if () then' end , v_step_seq) as STEP_SQL,
                   '' as TARGET_TABLE,
                   '' as STEP_SQL_AUTO,
                   '' as OTHER_PARAMS
            from   
                   DUAL a
            where  not exists(select 1 from APP.Tb_Etl_Sp_step a 
                              where a.etl_sp_name=i_ETL_SP_NAME 
                                and a.step_seq=v_step_seq||'.01'
                                and a.version_id=i_version_id);

            /*插入条件结束步骤*/
            insert into APP.TB_ETL_SP_STEP
            (
                   ETL_SP_NAME,
                   UPDATE_TIME,
                   UPDATE_USER,
                   VERSION_ID,
                   STEP_SEQ,
                   STEP_SUMMARY,
                   STEP_TYPE,
                   STEP_SQL,
                   TARGET_TABLE,
                   STEP_SQL_AUTO,
                   OTHER_PARAMS
            )
            select 
                   i_ETL_SP_NAME as ETL_SP_NAME,
                   to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
                   i_user_code as UPDATE_USER,
                   i_version_id as VERSION_ID,
                   v_step_seq||'.99' as STEP_SEQ,
                   '条件分支'||v_step_seq||'结束' as STEP_SUMMARY,
                   '9' as STEP_TYPE,
                   APP.f_step_sql_set('end if;',v_step_seq) as STEP_SQL,
                   '' as TARGET_TABLE,
                   '' as STEP_SQL_AUTO,
                   '' as OTHER_PARAMS
            from   
                   dual a
            where  not exists(select 1 from APP.Tb_Etl_Sp_step b
                            where b.etl_sp_name=i_ETL_SP_NAME 
                              and b.step_seq=v_step_seq||'.99'
                              and b.version_id=i_version_id)
            ;

            /*条件分支06.08结束*/
        end if;

        /*更新变动标志*/
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*不满足条件*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许步骤配置' 
                             when v_exists>0 then '步骤执行序号已被占用'
                             when v_step_seq like '%.%' and v_parent_step_SEQ is null then '上级步骤不存在,不能添加子步骤'
                             when v_end_check='0' then '步骤SQL请用符号“;”结尾'
                         end
        ;
        rollback;
        return;

        /*条件分支06结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '步骤新增完成';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_COMPILE
(
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_user_code                          IN VARCHAR2 ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 调试存储过程试编译
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 22:00:13
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;--
    v_err_msg                            CLOB ;--
    v_exists                             INTEGER default 0;--
    v_update_time                        VARCHAR2 default to_char(sysdate,'YYYYMMDD hh24:mi:ss');--
    v_ret_cur                            CURSOR ;--
    v_version_status                     CHAR(1) ;--
    v_version_id                         VARCHAR2 ;--
    v_sql_str                            CLOB ;--
    v_test_etl_sp_name                   VARCHAR2 default upper(i_ETL_SP_NAME);--
    v_etl_sp_type                        VARCHAR2 ;--
BEGIN
    /*获取程序版本状态*/
    select VERSION_STATUS,
           VERSION_ID,
           OBJECT_TYPE
      into v_version_status,
           v_version_id,
           v_etl_sp_type
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id;

    /*取原始代码*/
    select text
      into v_sql_str
      from all_source 
     where owner||'.'||name=i_ETL_SP_NAME;

        /*条件:修订中的程序可以试编译*/
    if v_version_status = '2' then

        /*取完整配置代码*/
        APP.P30006(i_ETL_SP_NAME,i_version_id,i_user_code,null,null,'1',v_errcode,v_err_msg);

            /*条件:执行成功*/
        if v_errcode=0 then

            /*编译前备份代码*/
            insert into APP.TB_DBA_SOURCE_BACK
            (
                   OWNER,
                   NAME,
                   TYPE,
                   LINE,
                   TEXT,
                   VERSION_DATE,
                   ETL_SP_NAME
            )
            select 
                   a.owner as OWNER,
                   a.name as NAME,
                   a.type as TYPE,
                   a.line as LINE,
                   a.text as TEXT,
                   a.last_ddl_time as VERSION_DATE,
                   a.etl_sp_name as ETL_SP_NAME
            from   
                   APP.tb_dba_source a
            where  a.etl_sp_name=i_ETL_SP_NAME
            and    not exists
                (select 1 from APP.TB_DBA_SOURCE_BACK b
                 where  b.etl_sp_name=i_ETL_SP_NAME
                 and    a.last_ddl_time=b.version_date
                );

            /*移除结尾“/”*/
            v_err_msg:=rtrim(v_err_msg,'/');

            /*执行编译*/
            execute immediate v_err_msg;

            /*取编译对象状态是否有效*/
            select count(1) as exist
            into   v_exists
            from   all_objects 
            where  owner||'.'||object_name=i_etl_sp_name
            and    status='VALID';

                /*条件:编译有错误*/
            if v_exists=0 then

                /*还原代码*/
                execute immediate v_sql_str;

                /*返回*/
                o_return_code=-1;
                o_return_msg:='编译有错误';
                rollback;
                return;

                /*条件分支03.03.06结束*/
            end if;

            /*取编译后源代码入库*/
            APP.PR_ETL_SP_GET_DBA_SOURCE(i_ETL_SP_NAME,i_user_code,v_errcode,v_err_msg);

            /*备份表保留5个最近版本，其余删除*/
            delete from APP.tb_dba_source_back a
            where  a.etl_sp_name=i_etl_sp_name
            and    exists
                   (select 1
                    from   (select min(b.version_date) as min_version_date
                              from (select version_date,
                                           dense_rank() over(partition by etl_sp_name order by version_date desc) as rk
                                      from APP.tb_dba_source_back
                                     where etl_sp_name=i_etl_sp_name
                                   ) b
                             where b.rk<=5
                           ) b
                    where a.version_date<b.min_version_date
                   );

            /*入备份表*/
            insert into APP.TB_DBA_SOURCE_BACK
            (
                   OWNER,
                   NAME,
                   TYPE,
                   LINE,
                   TEXT,
                   VERSION_DATE,
                   ETL_SP_NAME
            )
            select 
                   a.owner as OWNER,
                   a.name as NAME,
                   a.type as TYPE,
                   a.line as LINE,
                   a.text as TEXT,
                   a.last_ddl_time as VERSION_DATE,
                   a.etl_sp_name as ETL_SP_NAME
            from   
                   APP.tb_dba_source a
            where  a.etl_sp_name=i_ETL_SP_NAME;

            /*清除变动标志*/
            update APP.tb_etl_sp
            set    if_changed=null
            where  etl_sp_name=i_etl_sp_name;

            /*取配置代码报错*/
        else

            /*退出*/
            o_return_code := v_errcode;
            o_return_msg := v_err_msg;
            rollback;
            return;

            /*条件分支03.03结束*/
        end if;

        /*程序版本已发布*/
    else

        /*退出*/
        o_return_code := -1;
        o_return_msg := '版本状态不允许编译程序';
        rollback;
        return;

        /*条件分支03结束*/
    end if;

    /*提交返回*/
    commit;
    o_return_msg := '编译通过';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



CREATE OR REPLACE PROCEDURE APP.P30000
(
    i_if_check_change                    IN VARCHAR2 ,--
    i_version_status                     IN VARCHAR2 ,--
    i_if_exist                           IN VARCHAR2 ,--
    i_etl_sp_name                        IN VARCHAR2 ,--
    i_referenced_object                  IN VARCHAR2 ,--
    i_version_id                         IN VARCHAR2 ,--
    i_summary                            IN VARCHAR2 ,--
    rt_cursor                            OUT CURSOR ,--
    o_return_code                        OUT NUMBER ,--
    o_return_msg                         OUT VARCHAR2 --
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序版本管理
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20250616 16:08:44
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_return_code                        INTEGER ;--
    v_return_msg                         VARCHAR2(100) ;--
BEGIN
        /*条件:需要检查变动*/
    if i_if_check_change='1' then

        /*检查程序配置与库内是否一致*/
        APP.PR_ETL_SP_CHECK_CHANGE(upper(i_ETL_SP_NAME),null,v_return_code,v_return_msg);

        /*条件分支01结束*/
    end if;

    open rt_cursor for
    select a.object_type,
           a.etl_sp_name,
           a.etl_target_table,
           a.etl_data_source,
           a.update_time,
           a.update_user,
           a.version_id,
           a.version_status as version_status_k,
           decode(a.version_status,'1','已发布','2','修订中') as version_status_v,
           a.summary,
           a.upgrade_summary,
           a.etl_sp_name||'-'||a.version_id as pk_id,
           a.if_changed as if_changed
      from APP.tb_etl_sp a
      left join 
           (select etl_sp_name,max(version_id) as max_version from APP.tb_etl_sp group by etl_sp_name) a1
        on a.ETL_SP_NAME=a1.ETL_SP_NAME
      left join 
           all_objects b
        on a.etl_sp_name=b.owner||'.'||b.object_name
     where (a.etl_sp_name=upper(i_ETL_SP_NAME) or i_ETL_SP_NAME is null)
       and (instr(a.summary,i_SUMMARY)>0 or i_SUMMARY is null)
       and (instr(i_version_status,a.version_status)>0 or i_version_status is null)
       and (a.version_id=i_version_id or i_version_id is null or (i_version_id='-' and a.VERSION_ID=a1.MAX_VERSION))
       and ((i_if_exist='1' and b.object_name is not null) or i_if_exist='0')
       and (exists
            (select * from APP.tb_dependencies c
             where  c.referenced_object=upper(i_referenced_object)
             and    a.etl_sp_name=c.object_name
            ) or i_referenced_object is null
           )
     order by a.object_type,a.etl_sp_name,a.version_id desc;

    o_return_code := 0;
    o_return_msg := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
       o_return_code := SQLCODE;
       o_return_msg  := o_return_msg || SQLERRM;
       ROLLBACK;
END;



