CREATE OR REPLACE FUNCTION APP.F_EXTRACT_DELETE_TABLE
(
    i_sql                                IN VARCHAR2 
) RETURN VARCHAR2(32767) IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 解析DELETE FROM语句的目标表
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260105 10:58:41
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_clean_sql                          CLOB ;-- 清理注释后的SQL
    v_table_full                         VARCHAR2(200) ;-- 完整的模式名.表名
    v_pattern                            VARCHAR2(1000) default 'DELETE\s+FROM\s+(([A-Za-z0-9_$]+|"\S+?")(\.([A-Za-z0-9_$]+|"\S+?"))?)';-- 修正正则：整体匹配 DELETE FROM + 表名
BEGIN
    /*01:*/
    v_clean_sql := REGEXP_REPLACE(i_sql, '--.*$', '', 1, 0, 'm');

    /*02:*/
    v_clean_sql := REGEXP_REPLACE(v_clean_sql, '/\*.*?\*/', '', 1, 0, 'n');

    /*03:*/
    v_clean_sql := UPPER(TRIM(v_clean_sql));

    /*04:*/
    v_table_full := REGEXP_SUBSTR(v_clean_sql, v_pattern, 1, 1, 'i');

        /*05.01:条件:*/
    IF v_table_full IS NOT NULL THEN

        /*05.02:*/
        v_table_full := LTRIM(REGEXP_REPLACE(v_table_full, '^DELETE\s+FROM\s+', '', 1, 1, 'i'));

        /*05.03:*/
        v_table_full := REGEXP_SUBSTR(v_table_full, '^[^ \(\)\,\=]+', 1, 1, 'i');

        /*05.99:条件分支05结束*/
    end if;

    /*06:*/
    RETURN NVL(v_table_full, '未识别到删除表名');


END;



CREATE OR REPLACE FUNCTION APP.F_EXTRACT_INSERT_TABLE
(
    i_sql                                IN VARCHAR2 
) RETURN VARCHAR2(32767) IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 解析INSERT INTO语句的目标表
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260105 10:58:02
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_clean_sql                          CLOB ;-- 清理注释后的SQL
    v_table_full                         VARCHAR2(200) ;-- 完整的模式名.表名
    v_pattern                            VARCHAR2(1000) default 'INSERT\s+INTO\s+(([A-Za-z0-9_$]+|"\S+?")(\.([A-Za-z0-9_$]+|"\S+?"))?)';-- 修正正则：整体匹配 INSERT INTO + 表名
BEGIN
    /*01:*/
    v_clean_sql := REGEXP_REPLACE(i_sql, '--.*$', '', 1, 0, 'm');

    /*02:*/
    v_clean_sql := REGEXP_REPLACE(v_clean_sql, '/\*.*?\*/', '', 1, 0, 'n');

    /*03:*/
    v_clean_sql := UPPER(TRIM(v_clean_sql));

    /*04:*/
    v_table_full := REGEXP_SUBSTR(v_clean_sql, v_pattern, 1, 1, 'i');

        /*05.01:条件:*/
    IF v_table_full IS NOT NULL THEN

        /*05.02:*/
        v_table_full := LTRIM(REGEXP_REPLACE(v_table_full, '^INSERT\s+INTO\s+', '', 1, 1, 'i'));

        /*05.03:*/
        v_table_full := REGEXP_SUBSTR(v_table_full, '^[^ \(\)\,\=]+', 1, 1, 'i');

        /*05.99:条件分支05结束*/
    end if;

    /*06:*/
    RETURN NVL(v_table_full, '未识别到插入表名');


END;



CREATE OR REPLACE FUNCTION APP.F_EXTRACT_UPDATE_TABLE
(
    i_sql                                IN VARCHAR2 
) RETURN VARCHAR2(32767) IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 解析UPDATE语句的目标表
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260105 10:55:58
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_clean_sql                          CLOB ;-- 清理注释后的SQL
    v_table_full                         VARCHAR2(200) ;-- 完整的模式名.表名
    v_pattern                            VARCHAR2(1000) default 'UPDATE\s+(([A-Za-z0-9_$]+|"\S+?")(\.([A-Za-z0-9_$]+|"\S+?"))?)';-- 修正正则：将「模式名.表名」作为整体匹配（第0分组），分组1/2仅用于内部匹配
BEGIN
    /*01:*/
    v_clean_sql := REGEXP_REPLACE(i_sql, '--.*$', '', 1, 0, 'm');  

    /*02:*/
    v_clean_sql := REGEXP_REPLACE(v_clean_sql, '/\*.*?\*/', '', 1, 0, 'n');  

    /*03:*/
    v_clean_sql := UPPER(TRIM(v_clean_sql));  

    /*04:*/
    v_table_full := REGEXP_SUBSTR(v_clean_sql, v_pattern, 1, 1, 'i');

        /*05.01:条件:*/
    IF v_table_full IS NOT NULL THEN

        /*05.02:*/
        v_table_full := LTRIM(REGEXP_REPLACE(v_table_full, '^UPDATE\s+', '', 1, 1, 'i'));

        /*05.03:*/
        v_table_full := REGEXP_SUBSTR(v_table_full, '^[^ \(\)\,\=]+', 1, 1, 'i');

        /*05.99:条件分支05结束*/
    end if;

    /*06:*/
    RETURN NVL(v_table_full, '未识别到更新表名');


END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_CHECK_STEP_CHANGE
(
    i_etl_sp_name                        IN VARCHAR2 ,
    i_user_code                          IN VARCHAR2 ,
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
    -- 功能名称: 程序步骤代码与数据库代码是否一致检查
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260105 09:51:08
    -- 修改内容:1.1:
    -- 修改内容:优化步骤变动检查准确找到步骤代码
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2 ;
    v_dba_source                         CLOB ;
    v_etl_sp_code                        CLOB ;
    v_start_line                         INT ;
    v_end_line                           INT ;
BEGIN
        /*01.01:每个步骤循环比较数据库代码-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.01' else o_return_msg end;
    for cur in (select a.etl_sp_name,
                              a.step_seq,
                              regexp_replace(regexp_replace(a.STEP_SQL,'(['||chr(10)||']+)[[:space:]]+',chr(10)),'[[:space:]]+(['||chr(10)||']+)',chr(10)) as STEP_SQL,
                              a.VERSION_ID,
                              a.STEP_SUMMARY,
                              lead(a.step_seq) over(partition by a.etl_sp_name,a.version_id order by a.step_seq) as next_step,
                              lead(a.step_summary) over(partition by a.etl_sp_name,a.version_id order by a.step_seq) as next_summary
                         from APP.tb_etl_sp_step a
                        inner join 
                              (select etl_sp_name,max(version_id) as version_id from APP.tb_etl_sp group by etl_sp_name) a1
                           on a.ETL_SP_NAME=a1.ETL_SP_NAME
                          and a.VERSION_ID=a1.version_id
                        inner join 
                              all_procedures b
                           on a.etl_sp_name=b.owner||'.'||b.object_name
                        where a.etl_sp_name=i_etl_sp_name
                          and a.STEP_SQL is not null
                      )
    loop

        /*01.02:找到步骤标记的代码行号*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.02' else o_return_msg end;
        select min(line),
               max(line)
        into   v_start_line,
               v_end_line
        from   app.tb_dba_source a
        where  a.owner||'.'||a.name=i_etl_sp_name
        and    cur.next_step is not null
        and    (trim(a.text) like '/*'||cur.step_seq||':'||cur.step_summary||'*/%'
             or trim(a.text) like '/*'||cur.next_step||':'||cur.next_summary||'*/%'
               );

        /*01.03:拼接成完整步骤代码,清空每行前后空格与连续回车*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.03' else o_return_msg end;
        select listagg(trim(a.text),chr(10)) within group (order by a.line)
        into   v_dba_source
        from   app.tb_dba_source a
        where  a.line>v_start_line
        and    a.line<v_end_line
        and    trim(a.TEXT) is not null
        and    a.etl_sp_name=i_etl_sp_name;

        /*01.04:更新步骤代码变动标志*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.04' else o_return_msg end;
        update app.tb_etl_sp_step a
        set    a.other_params=case when isnull(v_dba_source,'未步骤号标记')<>trim(cur.step_sql) then 'step_changed' end
        where  a.etl_sp_name=i_etl_sp_name
        and    a.version_id=cur.version_id
        and    a.step_seq=cur.step_seq
        and    cur.next_step is not null;

        /*01.99:每个步骤循环比较数据库代码-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.99' else o_return_msg end;
    end loop;

    /*02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02' else o_return_msg end;
    commit;
    o_return_code := 0;
    o_return_msg  := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_ETL_SP_CHECK_STEP_CHANGE执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_GET_DBA_SOURCE
(
    i_etl_sp_name                        IN VARCHAR2 ,
    i_user_code                          IN VARCHAR2 ,
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
    -- 功能名称: 数据库代码处理
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260105 09:53:39
    -- 修改内容:1.1:
    -- 修改内容:处理instr对clob的时会异常的情况
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_text_clob                          CLOB ;
    v_type                               VARCHAR2(10) ;
    v_owner                              VARCHAR2(100) ;
    v_name                               VARCHAR2(100) ;
    v_line                               INTEGER ;
    v_exists                             INTEGER ;
    v_last_ddl_time                      DATETIME(6) ;
    v_pos                                INTEGER ;
    v_last_pos                           INTEGER default 1;
    v_sql_str                            CLOB ;
BEGIN
    /*01:取源程序是否存在和最近DDL时间*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01' else o_return_msg end;
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

        /*02.01:条件:程序存在且最新版未取*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.01' else o_return_msg end;
    if v_exists=0 then

        /*02.02:删除旧版代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.02' else o_return_msg end;
        delete from APP.tb_dba_source a 
        where  a.owner || '.' || a.NAME = upper(i_ETL_SP_NAME);

        /*02.03:取数据库源代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.03' else o_return_msg end;
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

        /*02.04:行号初始化*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.04' else o_return_msg end;
        v_line:=1;

            /*02.05.01:循环每行插入表-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.01' else o_return_msg end;
        loop

            /*02.05.02:找到换行符*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.02' else o_return_msg end;
            v_pos:=DBMS_LOB.instr(v_text_clob,chr(10),v_last_pos);

            /*02.05.03:退出条件*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.03' else o_return_msg end;
            exit when trim(replace(v_text_clob,chr(10),''))=to_clob('')  or trim(replace(v_text_clob,chr(10),'')) is null;

                /*02.05.04.01:条件:无换行情况*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.04.01' else o_return_msg end;
            if v_pos=0 then

                /*02.05.04.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.04.02' else o_return_msg end;
                v_sql_str:=to_char(v_text_clob);

                /*02.05.04.03:有换行*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.04.03' else o_return_msg end;
            else

                /*02.05.04.04:截取本行代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.04.04' else o_return_msg end;
                v_sql_str:=DBMS_LOB.SUBSTR(v_text_clob,v_pos-v_last_pos,v_last_pos);

                /*02.05.04.99:条件分支02.05.04结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.04.99' else o_return_msg end;
            end if;

            /*02.05.05:当前行代码入表*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.05' else o_return_msg end;
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

            /*02.05.06:下一行*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.06' else o_return_msg end;
            v_line:=v_line+1;

            /*02.05.07:保留下次搜索开始位置*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.07' else o_return_msg end;
            v_last_pos:=v_pos+1;

            /*02.05.08:结束循环条件*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.08' else o_return_msg end;
            exit when DBMS_LOB.instr(v_text_clob,chr(10),v_last_pos)=0;

            /*02.05.99:循环每行插入表-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05.99' else o_return_msg end;
        end loop;

        /*02.99:条件分支02结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.99' else o_return_msg end;
    end if;

    /*03:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03' else o_return_msg end;
    commit;
    o_return_msg := '执行成功';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_ETL_SP_GET_DBA_SOURCE执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.P30006
(
    i_etl_sp_name                        IN VARCHAR2 ,
    i_version_id                         IN VARCHAR2 ,
    i_step_seq                           IN VARCHAR2 ,
    i_target_table                       IN VARCHAR2 ,
    i_source_from                        IN VARCHAR2 ,
    i_user_code                          IN VARCHAR2 ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT CLOB 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.5
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤SQL查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260106 11:08:57
    -- 修改内容:1.5:
    -- 修改内容:处理o_return_msg赋值步骤与自动生成代码间冲突的问题
    -- 修改内容:1.4:
    -- 修改内容:处理没有o_return_msg输出参数的存储过程时不会自动生成相关的配置代码
    -- 修改内容:1.3:
    -- 修改内容:生成完整程序代码的参数顺序调整
    -- 修改内容:1.2:
    -- 修改内容:错误处理部分代码增加抛出错误
    -- 修改内容:1.1:
    -- 修改内容:修复取参数部分代码时重复取多个版本的参数的bug，增加骤执行报错时的返回步骤信息
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_step_sql                           VARCHAR2 ;
    v_return_sql                         CLOB ;
    v_step_type                          CHAR(1) ;
    v_test_etl_sp_name                   VARCHAR2 default upper(i_ETL_SP_NAME);
    v_etl_sp_type                        VARCHAR2 ;
    v_return_code                        INTEGER ;
    v_return_msg                         CLOB ;
    v_if_have_return_msg                 CHAR(1) ;--是否存在o_retrun_msg输出参数
    v_func_ret_type                      VARCHAR2 ;
BEGIN
        /*01.01:条件:查询的是程序步骤配置代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.01' else o_return_msg end;
    if i_step_seq is not null and i_source_from='set' then

        /*01.02:取步骤SQL和步骤类别*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.02' else o_return_msg end;
        select a.STEP_SQL,
               a.step_type
          into v_step_sql,
               v_step_type
          from APP.tb_etl_sp_step a
         where a.etl_sp_name=i_etl_sp_name
            and a.version_id=i_version_id
            and a.step_seq=i_step_seq
        ;

        /*01.03:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.03' else o_return_msg end;
        v_return_sql:=v_step_sql;

        /*01.04:条件：查询数据库当前程序代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.04' else o_return_msg end;
    elsif i_source_from='db' then

        /*01.05:取源代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.05' else o_return_msg end;
        APP.PR_ETL_SP_GET_DBA_SOURCE(i_ETL_SP_NAME,i_user_code,v_return_code,v_return_msg);

            /*01.06.01:-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.06.01' else o_return_msg end;
        for cur in (select text as sql_code from APP.tb_dba_source where etl_sp_name=i_etl_sp_name order by LINE)
        loop

            /*01.06.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.06.02' else o_return_msg end;
            v_return_sql:=v_return_sql||cur.sql_code||chr(10);

            /*01.06.99:-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.06.99' else o_return_msg end;
        end loop;

        /*01.07:查询完整程序配置代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.07' else o_return_msg end;
    else

        /*01.08:取程序类别*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.08' else o_return_msg end;
        select max(a.object_type) as etl_sp_type,
               count(b.params_name),
               max(case when c.data_type in ('VARCHAR2','VARCHAR','NVARCHAR2','NVARCHAR','NCHAR','CHAR') then c.data_type||'('||case when c.data_type in ('NVARCHAR2','NVARCHAR','NCHAR') then 0.5 else 1 end*c.data_length||')'
                        when c.data_type in ('NUMBER','DEC','DECIMAL','NUMERIC') then c.data_type||case when c.data_precision>0 then '('||c.data_precision ||','||c.data_scale||')' end
                        when c.data_type in ('TIMESTAMP','DATETIME') then c.data_type||'('||c.data_scale||')'
                        else c.data_type
                   end) 
          into v_etl_sp_type,
               v_if_have_return_msg,
               v_func_ret_type
          from APP.tb_etl_sp a
          left join 
               APP.TB_ETL_SP_PARAMS b 
            on a.ETL_SP_NAME=b.ETL_SP_NAME
           and a.VERSION_ID=b.VERSION_ID
           and b.PARAMS_TYPE='2'
           and b.PARAMS_NAME='o_return_msg'
          left join 
               all_arguments c 
            on a.ETL_SP_NAME=c.owner||'.'||c.object_name
           and c.in_out='OUT'
           and a.object_type='FUNCTION'
         where a.etl_sp_name=i_etl_sp_name
           and a.version_id=i_version_id;

        /*01.09:清空程序代码数据*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.09' else o_return_msg end;
        delete from APP.tb_etl_sp_code a
         where a.etl_sp_name=i_etl_sp_name
           and a.version_id=i_version_id;

        /*01.10:拼接完成程序SQL，插入代码表*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.10' else o_return_msg end;
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
                              case when a.PARAMS_DEFAULT_VALUE is not null then 'default '||a.PARAMS_DEFAULT_VALUE else '' end as params_sql,
                              ltrim(a.params_summary,'--') as params_summary,
                              1.2 as part_seq,
                              row_number() over(order by a.params_type,coalesce(b.sequence,999),a.params_seq) as line_seq,count(1) over() as line_count
                         from APP.tb_etl_sp_params a
                        inner join 
                              app.tb_etl_sp a1
                           on a.ETL_SP_NAME=a1.ETL_SP_NAME
                          and a.version_id=a1.version_id
                         left join
                              all_arguments b
                           on a.etl_sp_name=b.OWNER||'.'||b.OBJECT_NAME
                          and upper(a.params_name)=b.ARGUMENT_NAME
                        where a.etl_sp_name=i_etl_sp_name
                          and a.version_id=i_version_id
                          and ((a.params_type in ('1','2') and a1.OBJECT_TYPE='PROCEDURE') or (a.params_type in ('1') and a1.OBJECT_TYPE='FUNCTION'))
                       )
                union all
                select ') '||decode(v_etl_sp_type,'PROCEDURE','AUTHID definer IS','FUNCTION','RETURN '||v_func_ret_type||' IS')||chr(10)||
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
                       case when a.PARAMS_DEFAULT_VALUE is not null then 'default '||a.PARAMS_DEFAULT_VALUE else '' end||';'||
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
                            else '    '||APP.f_step_sql_set('/*',a.step_seq)||a.step_seq||':'||
                            case when a.STEP_SUMMARY is not null then replace(a.STEP_SUMMARY,chr(10),chr(10)||'    ') end||'*/'||
                            case when v_etl_sp_type='PROCEDURE' and v_if_have_return_msg='1' then 'o_return_msg:=case when o_return_msg like ''步骤号：%'' then ''步骤号：''||'''||a.step_seq||''' else o_return_msg end;' end||chr(10)||
                            '    '||replace(a.step_sql,chr(10),chr(10)||'    ')||chr(10) end,
                       3 as part_seq,
                       row_number() over(order by a.step_seq) as line_seq
                  from APP.tb_etl_sp_step a
                 where a.step_type not in ('5','6')
                   and a.etl_sp_name=i_etl_sp_name
                   and a.version_id=i_version_id
                 union all
                select decode(v_etl_sp_type||v_if_have_return_msg,
                       'PROCEDURE1',
                       '    -- ============================================================================'||chr(10)||
                       '    -- 错误处理部分'||chr(10)||
                       '    -- ============================================================================'||chr(10)||
                       'EXCEPTION'||chr(10)||
                       '   WHEN OTHERS THEN'||chr(10)||
                       '   if sqlcode=-20000 then'||chr(10)||
                       '       raise;'||chr(10)||
                       '   else '||chr(10)||
                       '       o_return_code := -20000;'||chr(10)||
                       '       o_return_msg  := '''||v_test_etl_sp_name||'执行报错，步骤号:''||o_return_msg||chr(10)||SQLERRM;'||chr(10)||
                       '       ROLLBACK;'||chr(10)||
                       '       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);'||chr(10)||
                       '   end if;'||chr(10)||
                       'END;',
                       'PROCEDURE0',chr(10)||'END;',
                       'FUNCTION0',chr(10)||'END;'),
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

            /*01.11.01:-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.11.01' else o_return_msg end;
        for cur in (select sql_code from APP.tb_etl_sp_code where etl_sp_name=i_etl_sp_name and version_id=i_version_id order by LINE)
        loop

            /*01.11.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.11.02' else o_return_msg end;
            v_return_sql:=v_return_sql||cur.sql_code||chr(10);

            /*01.11.99:-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.11.99' else o_return_msg end;
        end loop;

        /*01.99:条件分支01结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.99' else o_return_msg end;
    end if;

    /*02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02' else o_return_msg end;
    commit;
    o_return_code := 0;
    o_return_msg  := replace(v_return_sql,chr(9),'    ');

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.P30006执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_PARAMS_LOAD
(
    i_etl_sp_name                        IN VARCHAR2 ,
    i_version_id                         IN VARCHAR2 ,
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
    -- 功能名称: 加载程序参数
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260105 10:18:27
    -- 修改内容:1.2:
    -- 修改内容:加载函数的参数时不加载输出参数，对默认值增加支持:=的解析
    -- 修改内容:1.1:
    -- 修改内容:将''替换为null
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_version_status                     CHAR(1) ;
    v_version_id                         VARCHAR2 ;
    v_return_msg                         VARCHAR2 ;
    v_return_code                        INTEGER ;
BEGIN
    /*01:获取版本状态*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01' else o_return_msg end;
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid
      into v_version_status,
           v_version_id
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*02.01:条件:状态修订中*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.01' else o_return_msg end;
    if v_version_status = '2' then

        /*02.02:删除参数*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.02' else o_return_msg end;
        delete from APP.Tb_Etl_Sp_Params
         where ETL_SP_NAME=i_ETL_SP_NAME
           and VERSION_ID=i_version_id
        ;

        /*02.03:加载输入和输出参数*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.03' else o_return_msg end;
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
               lower(a.ARGUMENT_NAME) as PARAMS_NAME,
               decode(a.IN_OUT,'IN','1','OUT','2') as PARAMS_TYPE,
               decode(a.DATA_TYPE,'REF CURSOR','TYPES.CURSORTYPE',a.DATA_TYPE) as PARAMS_DATA_TYPE,
               a.default_value as PARAMS_DEFAULT_VALUE,
               null as PARAMS_SUMMARY,
               to_char(sysdate,'YYYYMMDD hh24:mi:ss') as UPDATE_TIME,
               i_user_code as UPDATE_USER,
               i_version_id as VERSION_ID,
               decode(a.IN_OUT,'IN','1.','OUT','2.')||trim(to_char(a.POSITION,'00')) as PARAMS_SEQ,
               null as TEST_VALUE
        from   
               all_arguments a
        inner join
               ALL_OBJECTS b
        on     
               a.OBJECT_ID=b.OBJECT_ID
        and    (b.object_type='PROCEDURE' or (a.IN_OUT='IN' and b.object_type='FUNCTION'))
        where  a.owner||'.'||a.object_name=upper(i_ETL_SP_NAME)
        and    a.ARGUMENT_NAME is not null;

        /*02.04:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.04' else o_return_msg end;
        APP.PR_ETL_SP_GET_DBA_SOURCE(i_ETL_SP_NAME,i_user_code,v_return_code,v_return_msg);

        /*02.05:插入业务过程参数*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.05' else o_return_msg end;
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
               null as TEST_VALUE
        from   
               (SELECT text,
                      params_name,
                      data_type,
                      substr(data_type, 1, instr(REPLACE(data_type, ' ', ';'), ';') - 1) AS data_type_new,
                      CASE
                          WHEN lower(data_type) LIKE '% default %' THEN
                           substr(data_type, instr(lower(data_type), ' default ') + 9)
                          when lower(data_type) LIKE '%:=%' THEN
                           substr(data_type, instr(lower(data_type), ':=') + 2)
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

        /*02.06:更新变动时间*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.06' else o_return_msg end;
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*02.07:状态已发布*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.07' else o_return_msg end;
    else

        /*02.08:退出*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.08' else o_return_msg end;
        o_return_code := -1;
        o_return_msg := '版本状态不允许修改参数';
        rollback;
        return;

        /*02.99:条件分支02结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.99' else o_return_msg end;
    end if;

    /*03:返回*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03' else o_return_msg end;
    commit;
    o_return_msg := '参数已载入';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_ETL_SP_PARAMS_LOAD执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_CHECK_CHANGE
(
    i_etl_sp_name                        IN VARCHAR2 ,
    i_user_code                          IN VARCHAR2 ,
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
    -- 功能名称: 程序配置代码与数据库代码是否已变动检查
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260105 09:49:33
    -- 修改内容:1.3:
    -- 修改内容:调整参数类型
    -- 修改内容:1.2:
    -- 修改内容:检查时忽略程序更新时间的不一致
    -- 修改内容:1.1:
    -- 修改内容:检查前先刷新配置代码，否则可能会存在检查结果错误
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         CLOB ;
    v_dba_source                         CLOB ;
    v_etl_sp_code                        CLOB ;
BEGIN
        /*01.01:-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.01' else o_return_msg end;
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

        /*01.02:源代码处理*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.02' else o_return_msg end;
        APP.PR_ETL_SP_GET_DBA_SOURCE(cur_etl_sp.ETL_SP_NAME,i_user_code,v_return_code,v_return_msg);

        /*01.03:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.03' else o_return_msg end;
        v_dba_source:='';

            /*01.04.01:拼接源代码-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.04.01' else o_return_msg end;
        for cur_dba_source in (select case when trim(text) like '/*%:%*/o_return_msg:=%' then '' 
                                           else text
                                      end as sql_code
                               from   APP.tb_dba_source 
                               where  etl_sp_name=cur_etl_sp.etl_sp_name 
                               and    text not like '    -- 修改日期:________ __:__:__'
                               order by LINE
                              )
        loop

            /*01.04.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.04.02' else o_return_msg end;
            v_dba_source:=replace(v_dba_source||case when cur_dba_source.sql_code is not null then cur_dba_source.sql_code||chr(10) end,chr(10)||chr(10),chr(10));

            /*01.04.99:拼接源代码-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.04.99' else o_return_msg end;
        end loop;

        /*01.05:刷新配置代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.05' else o_return_msg end;
        APP.P30006(cur_etl_sp.ETL_SP_NAME,cur_etl_sp.version_id,null,null,'set',i_user_code,v_return_code,v_return_msg);

        /*01.06:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.06' else o_return_msg end;
        v_etl_sp_code:='';

            /*01.07.01:拼接配置代码-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.07.01' else o_return_msg end;
        for cur_etl_sp_code in (select case when trim(sql_code) like '/*%:%*/o_return_msg:=%' then substr(sql_code,instr(sql_code,chr(10))+1) 
                                            else REGEXP_REPLACE(sql_code, '    -- 修改日期:.*$'||chr(10), '', 1, 0, 'm') 
                                       end as sql_code 
                                from   APP.tb_etl_sp_code 
                                where  etl_sp_name=cur_etl_sp.etl_sp_name 
                                and    version_id=cur_etl_sp.version_id 
                                order by LINE
                               )
        loop

            /*01.07.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.07.02' else o_return_msg end;
            v_etl_sp_code:=replace(v_etl_sp_code||cur_etl_sp_code.sql_code||chr(10),chr(10)||chr(10),chr(10));

            /*01.07.99:拼接配置代码-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.07.99' else o_return_msg end;
        end loop;

        /*01.08:修改变动标志*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.08' else o_return_msg end;
        update APP.tb_etl_sp 
        set    if_changed=case when DBMS_LOB.COMPARE(v_dba_source, v_etl_sp_code)<>0 then 'Y' end
        where  etl_sp_name=cur_etl_sp.etl_sp_name
        and    version_id=cur_etl_sp.version_id;

        /*01.09:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.09' else o_return_msg end;
        commit;

        /*01.99:-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01.99' else o_return_msg end;
    end loop;

    /*02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02' else o_return_msg end;
    commit;
    o_return_code := 0;
    o_return_msg  := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_ETL_SP_CHECK_CHANGE执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_ETL_SP_STEP_INSERT
(
    i_etl_sp_name                        IN VARCHAR2 ,
    i_version_id                         IN VARCHAR2 ,
    i_step_seq                           IN VARCHAR2 ,
    i_step_summary                       IN VARCHAR2 ,
    i_step_type                          IN VARCHAR2 ,
    i_step_sql                           IN CLOB ,
    i_target_table                       IN VARCHAR2 ,
    i_user_code                          IN VARCHAR2 ,
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
    -- 功能名称: 程序步骤添加
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260105 15:05:02
    -- 修改内容:1.3:
    -- 修改内容:去除自动添加的条件及循环步骤的注释
    -- 修改内容:1.2:
    -- 修改内容:将''替换为null
    -- 修改内容:1.1:
    -- 修改内容:解析插入步骤的字段映射时,会去除 as 别名,此处增加判断 as 是否在引号及括号内
    -- 修改内容:增加对插入字段映射时注释的解析处理
    -- 修改内容:增加对关联表的注释解析处理
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_errcode                            NUMBER default 0;
    v_err_msg                            VARCHAR2 default '';
    v_exists                             INTEGER default 0;
    v_version_status                     CHAR(1) ;
    v_version_id                         VARCHAR2 ;
    v_parent_step_seq                    VARCHAR2 ;
    v_parent_step_type                   VARCHAR2 ;
    v_end_check                          CHAR(1) default '1';
    v_target_column_str                  VARCHAR2 ;
    v_insert_column_str                  VARCHAR2 ;
    v_join_str                           VARCHAR2 ;
    v_blank_bar                          VARCHAR2 ;
    v_step_seq                           VARCHAR2 default case when i_step_seq like '%+' then rtrim(i_step_seq,'+') else i_step_seq end;
    v_pos                                INT ;
BEGIN
    /*01:获取版本状态*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01' else o_return_msg end;
    select VERSION_STATUS as vstatus,
           VERSION_ID as vid    
      into v_version_status,
           v_version_id           
      from APP.tb_ETL_SP
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
    ;

        /*02.01:条件:非根级步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.01' else o_return_msg end;
    if v_step_seq like '%.%' then

        /*02.02:获取上级步骤序号*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.02' else o_return_msg end;
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

        /*02.03:根级步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.03' else o_return_msg end;
    else

        /*02.04:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.04' else o_return_msg end;
        v_parent_step_SEQ:=v_step_seq;

        /*02.99:条件分支02结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.99' else o_return_msg end;
    end if;

        /*03.01:条件:插入、更新、变量赋值脚本没有以；结尾*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.01' else o_return_msg end;
    if i_step_type in ('1','2','3','4') and trim(rtrim(ltrim(i_step_sql,chr(10)),chr(10))) not like '%;' then

        /*03.02:结尾检查不通过*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.02' else o_return_msg end;
        v_end_check:='0';

        /*03.99:条件分支03结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.99' else o_return_msg end;
    end if;

    /*04:判断步骤号是否存在*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04' else o_return_msg end;
    select count(1)
      into v_exists
      from APP.Tb_Etl_Sp_step a
     where ETL_SP_NAME=i_ETL_SP_NAME
       and version_id=i_version_id
       and step_seq=v_step_seq
    ;

        /*05.01:条件:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05.01' else o_return_msg end;
    if v_VERSION_STATUS = '2' and v_exists>0 and v_parent_step_SEQ is not null and v_end_check='1' and i_step_seq=v_step_seq||'+' THEN

        /*05.02:步骤下移*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05.02' else o_return_msg end;
        APP.PR_ETL_SP_STEP_MOVE(I_ETL_SP_NAME,i_version_id,V_STEP_SEQ,i_user_code,v_errcode,v_err_msg);

            /*05.03.01:条件:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05.03.01' else o_return_msg end;
        if v_errcode<>0 THEN

            /*05.03.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05.03.02' else o_return_msg end;
            o_return_code := -1;
            o_return_msg := '步骤下移失败';
            return;

            /*05.03.03:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05.03.03' else o_return_msg end;
        ELSE

            /*05.03.04:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05.03.04' else o_return_msg end;
            v_exists:=0;

            /*05.03.99:条件分支05.03结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05.03.99' else o_return_msg end;
        end if;

        /*05.99:条件分支05结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05.99' else o_return_msg end;
    end if;

        /*06.01:条件:状态修订中，步骤序号不存在，根级步骤存在，代码结尾检查通过时*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.01' else o_return_msg end;
    if v_version_status = '2' and v_exists=0 and v_parent_step_SEQ is not null and v_end_check='1' then

        /*06.02:移除首尾换行*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.02' else o_return_msg end;
        i_step_sql:=rtrim(ltrim(i_step_sql,chr(10)),chr(10));

        /*06.03:获取前部空格串*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.03' else o_return_msg end;
        v_blank_bar:=substr(i_step_sql,1,REGEXP_INSTR(i_step_sql,'\S')-1);

        /*06.04:替换每行最前面的空格串*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.04' else o_return_msg end;
        i_step_sql:=ltrim(replace(i_step_sql,chr(10)||v_blank_bar,chr(10)));

        /*06.05:插入步骤，并根据步骤级别，进行缩进处理*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.05' else o_return_msg end;
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
               i_step_summary as STEP_SUMMARY,
               i_step_type as STEP_TYPE,
               case when i_step_type not in ('2','5','6') then APP.f_step_sql_set(case when trim(lower(i_step_sql)) like 'elsif%then;' or trim(lower(i_step_sql)) like 'else%;' then rtrim(i_step_sql,';') else i_step_sql end, case when v_parent_step_type='6' and (lower(trim(i_step_sql)) like 'else%' or lower(trim(i_step_sql)) like 'elsif%') then v_parent_step_SEQ else v_step_seq end) end as STEP_SQL,
               case when i_step_type in ('1','2','3') then upper(trim(i_target_table)) end as TARGET_TABLE,
               null as STEP_SQL_AUTO,
               null as OTHER_PARAMS
        from   
               DUAL a
        where  not exists(select 1 from APP.Tb_Etl_Sp_step b 
                          where b.etl_sp_name=i_ETL_SP_NAME 
                            and b.step_seq=v_step_seq
                            and b.version_id=i_version_id)
        ;

            /*06.06.01:条件:插入步骤处理*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.01' else o_return_msg end;
        if i_step_type ='2' then

            /*06.06.02:插入字段映射*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.02' else o_return_msg end;
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
                   null as SOURCE_COLUMN,
                   null as COLUMN_SUMMARY,
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

            /*06.06.03:截取插入字段字符串*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.03' else o_return_msg end;
            v_target_column_str:=APP.f_step_insert_rebuild(i_step_sql,'insert');

            /*06.06.04:截取关联表字符串*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.04' else o_return_msg end;
            v_join_str:=APP.f_step_insert_rebuild(i_step_sql,'join');

                /*06.06.05.01:条件:插入字段字符串不为空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.01' else o_return_msg end;
            if v_target_column_str is not null then

                /*06.06.05.02:截取插入字段*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.02' else o_return_msg end;
                v_insert_column_str:=replace(substr(v_target_column_str,instr(v_target_column_str,'∷')+1),'』',chr(10));

                /*06.06.05.03:截取目标字段*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.03' else o_return_msg end;
                v_target_column_str:=substr(v_target_column_str,1,instr(v_target_column_str,'∷')-1);

                    /*06.06.05.04.01:一个一个字段进行映射-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.04.01' else o_return_msg end;
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

                        /*06.06.05.04.02.01:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.04.02.01' else o_return_msg end;
                        v_pos:=instr(lower(cur.insert_column),' as ',-1);

                        /*06.06.05.04.02.02:条件:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.04.02.02' else o_return_msg end;
                    if APP.f_is_in_quotes(cur.insert_column,v_pos)='1' or APP.f_is_in_parentheses(cur.insert_column,v_pos)='1' then

                        /*06.06.05.04.02.03:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.04.02.03' else o_return_msg end;
                        v_pos:=0;

                        /*06.06.05.04.02.99:条件分支06.06.05.04.02结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.04.02.99' else o_return_msg end;
                    end if;

                    /*06.06.05.04.03:更新字段映射表*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.04.03' else o_return_msg end;
                    update APP.tb_etl_sp_step_insert a
                       set a.SOURCE_COLUMN=case when v_pos>0 then 
                                                     substr(cur.insert_column,1,v_pos-1)
                                                else rtrim(cur.insert_column,',') end,
                           a.COLUMN_SUMMARY=case when instr(cur.insert_column,'--',-1)>0 and substr(cur.insert_column,instr(cur.insert_column,'--',-1)+2) not like '%'||chr(10)||'%,%' then substr(cur.insert_column,instr(cur.insert_column,'--',-1)+2) end
                     where a.etl_sp_name=i_etl_sp_name
                       and a.version_id=i_version_id
                       and a.step_seq=v_step_seq
                       and a.TARGET_COLUMN=rtrim(upper(cur.target_column),',')
                    ;

                    /*06.06.05.04.99:一个一个字段进行映射-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.04.99' else o_return_msg end;
                end loop;

                /*06.06.05.99:条件分支06.06.05结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.05.99' else o_return_msg end;
            end if;

                /*06.06.06.01:条件:表关联字符串不为空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.06.01' else o_return_msg end;
            if v_join_str is not null then

                    /*06.06.06.02.01:一个一个表插入关联表配置-循环开始*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.06.02.01' else o_return_msg end;
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

                    /*06.06.06.02.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.06.02.02' else o_return_msg end;
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
                           case when cur.join_as like '%--%' then ltrim(substr(cur.join_as,instr(cur.join_as,'--')+2),'-') end as JOIN_SUMMARY,
                           case when cur.join_as like '%--%' then substr(cur.join_as,1,instr(cur.join_as,'--')-1) else cur.join_as end as JOIN_AS
                    from   
                           dual a
                    where  1=1;

                    /*06.06.06.02.99:一个一个表插入关联表配置-循环结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.06.02.99' else o_return_msg end;
                end loop;

                /*06.06.06.99:条件分支06.06.06结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.06.99' else o_return_msg end;
            end if;

            /*06.06.07:拼接插入语句作为步骤SQL*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.07' else o_return_msg end;
            commit;
            APP.PR_ETL_SP_STEP_INSERT_SQL(i_ETL_SP_NAME,i_version_id,i_user_code,v_step_seq,upper(trim(i_target_table)),v_errcode, v_err_msg);

            /*06.06.99:条件分支06.06结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.06.99' else o_return_msg end;
        end if;

            /*06.07.01:条件:循环步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.07.01' else o_return_msg end;
        if i_step_type ='5' then

            /*06.07.02:插入循环开始步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.07.02' else o_return_msg end;
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
                   i_step_summary as STEP_SUMMARY,
                   '9' as STEP_TYPE,
                   APP.f_step_sql_set( case when lower(trim(i_step_sql)) like 'select %' then 'for cur'||replace(v_step_seq,'.','_')||' in '||chr(10)||'('||rtrim(i_step_sql,';')||chr(10)||') loop'                                                   when lower(trim(i_step_sql)) like 'for %' then case when rtrim(lower(trim(i_step_sql)),';') like '% loop' or rtrim(lower(trim(i_step_sql)),';') like '%'||chr(10)||'loop'                                                                                                       then rtrim(trim(i_step_sql),';')                                                                                                       else rtrim(trim(i_step_sql),';')||chr(10)||'loop'                                                                                                  end                                                   when rtrim(lower(trim(i_step_sql)),';') like 'loop' then 'loop'                                                   else 'for cur'||replace(v_step_seq,'.','_')||' in '||chr(10)||'() loop'                                              end,                                             v_step_seq) as STEP_SQL,
                   null as TARGET_TABLE,
                   null as STEP_SQL_AUTO,
                   null as OTHER_PARAMS
            from   
                   DUAL a
            where  not exists(select 1 from APP.Tb_Etl_Sp_step b
                              where b.etl_sp_name=i_ETL_SP_NAME 
                                and b.step_seq=v_step_seq||'.01'
                                and b.version_id=i_version_id);

            /*06.07.03:插入循环结束步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.07.03' else o_return_msg end;
            insert into APP.TB_ETL_SP_STEP
            (
                   ETL_SP_NAME,
                   UPDATE_TIME,
                   UPDATE_USER,
                   VERSION_ID,
                   STEP_SEQ,
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
                   '9' as STEP_TYPE,
                   APP.f_step_sql_set('end loop;',v_step_seq) as STEP_SQL,
                   null as TARGET_TABLE,
                   null as STEP_SQL_AUTO,
                   null as OTHER_PARAMS
            from   
                   dual a
            where  not exists(select 1 from APP.Tb_Etl_Sp_step b
                            where b.etl_sp_name=i_ETL_SP_NAME 
                              and b.step_seq=v_step_seq||'.99'
                              and b.version_id=i_version_id)
            ;

            /*06.07.99:条件分支06.07结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.07.99' else o_return_msg end;
        end if;

            /*06.08.01:条件:条件步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.08.01' else o_return_msg end;
        if i_step_type ='6' then

            /*06.08.02:插入条件开始步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.08.02' else o_return_msg end;
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
                   i_step_summary as STEP_SUMMARY,
                   '9' as STEP_TYPE,
                   APP.f_step_sql_set( case when rtrim(lower(trim(i_step_sql)),';') like 'if %then' then rtrim(trim(i_step_sql),';') when trim(i_step_sql) is not null then 'if ('||rtrim(trim(i_step_sql),';')||') then' else 'if () then' end , v_step_seq) as STEP_SQL,
                   null as TARGET_TABLE,
                   null as STEP_SQL_AUTO,
                   null as OTHER_PARAMS
            from   
                   DUAL a
            where  not exists(select 1 from APP.Tb_Etl_Sp_step a 
                              where a.etl_sp_name=i_ETL_SP_NAME 
                                and a.step_seq=v_step_seq||'.01'
                                and a.version_id=i_version_id);

            /*06.08.03:插入条件结束步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.08.03' else o_return_msg end;
            insert into APP.TB_ETL_SP_STEP
            (
                   ETL_SP_NAME,
                   UPDATE_TIME,
                   UPDATE_USER,
                   VERSION_ID,
                   STEP_SEQ,
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
                   '9' as STEP_TYPE,
                   APP.f_step_sql_set('end if;',v_step_seq) as STEP_SQL,
                   null as TARGET_TABLE,
                   null as STEP_SQL_AUTO,
                   null as OTHER_PARAMS
            from   
                   dual a
            where  not exists(select 1 from APP.Tb_Etl_Sp_step b
                            where b.etl_sp_name=i_ETL_SP_NAME 
                              and b.step_seq=v_step_seq||'.99'
                              and b.version_id=i_version_id)
            ;

            /*06.08.99:条件分支06.08结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.08.99' else o_return_msg end;
        end if;

        /*06.09:更新变动标志*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.09' else o_return_msg end;
        update APP.tb_ETL_SP a
           set a.update_time=to_char(sysdate,'YYYYMMDD hh24:mi:ss'),
               a.update_user=i_user_code,
               a.if_changed='Y'
         where a.ETL_SP_NAME=i_ETL_SP_NAME
           and a.version_id=i_version_id
        ;

        /*06.10:不满足条件*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.10' else o_return_msg end;
    else

        /*06.11:退出*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.11' else o_return_msg end;
        o_return_code := -1;
        o_return_msg := case when nvl(v_VERSION_STATUS,' ')<>'2' then '版本状态不允许步骤配置' 
                             when v_exists>0 then '步骤执行序号已被占用'
                             when v_step_seq like '%.%' and v_parent_step_SEQ is null then '上级步骤不存在,不能添加子步骤'
                             when v_end_check='0' then '步骤SQL请用符号“;”结尾'
                         end
        ;
        rollback;
        return;

        /*06.99:条件分支06结束*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06.99' else o_return_msg end;
    end if;

    /*07:提交返回*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'07' else o_return_msg end;
    commit;
    o_return_msg := '步骤新增完成';    
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_ETL_SP_STEP_INSERT执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
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
    -- 版    本: 1.1
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤加载
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260106 10:08:02
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
BEGIN
    /*01:取修订中最新版本*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'01' else o_return_msg end;
    select coalesce(max(version_id),' ')
    into   v_load_version
    from   app.tb_etl_sp 
    where  etl_sp_name=upper(i_etl_sp_name)
    and    version_status='2'
    ;

        /*02.01:非初始版本不能操作*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.01' else o_return_msg end;
    if v_load_version<>'1.0' THEN

        /*02.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.02' else o_return_msg end;
        o_return_code:=-1;

        /*02.03:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.03' else o_return_msg end;
        o_return_msg:='修订中1.0版本程序可加载';

        /*02.04:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.04' else o_return_msg end;
        return;

        /*02.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'02.99' else o_return_msg end;
    end if;

        /*03.01:完整程序加载*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.01' else o_return_msg end;
    if i_step_seq is null then

        /*03.02:清空步骤及配置*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.02' else o_return_msg end;
        delete from app.tb_etl_sp_step where etl_sp_name=upper(i_etl_sp_name);

        /*03.03:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.03' else o_return_msg end;
        delete from app.TB_ETL_SP_STEP_INSERT where etl_sp_name=upper(i_etl_sp_name);

        /*03.04:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.04' else o_return_msg end;
        delete from app.TB_ETL_SP_STEP_join where etl_sp_name=upper(i_etl_sp_name);

        /*03.05:获取代码起始行与结束行*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.05' else o_return_msg end;
        select min(line),
               max(line)
        into   v_start_line,
               v_end_line 
        from   app.tb_dba_source 
        where  etl_sp_name=upper(i_etl_sp_name)
        and    (upper(trim(text)) = 'BEGIN' or upper(trim(rtrim(text,';'))) = 'END');

        /*03.06:加载条件及循环部分*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.06' else o_return_msg end;
    ELSE

        /*03.07:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.07' else o_return_msg end;
        v_start_line:=i_begin_line;

        /*03.08:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.08' else o_return_msg end;
        v_end_line:=99999;

        /*03.09:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.09' else o_return_msg end;
        v_step_seq:='02';

        /*03.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'03.99' else o_return_msg end;
    end if;

        /*04.01:逐行读取代码并解析*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.01' else o_return_msg end;
    for cur in (select a.etl_sp_name,
                       a.line,
                       replace(case when trim(a.text) like '/*%*/o_return_msg:=%;' 
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

            /*04.02.01:完整加载程序碰到exception就退出*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.02.01' else o_return_msg end;
        if i_step_seq is null and lower(trim(cur.line_sql)) like 'exception' THEN

            /*04.02.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.02.02' else o_return_msg end;
            o_return_msg := cur.line;    

            /*04.02.03:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.02.03' else o_return_msg end;
            o_return_code := 0;

            /*04.02.04:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.02.04' else o_return_msg end;
            return;

            /*04.02.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.02.99' else o_return_msg end;
        end if;

            /*04.03.01:从起始行开始读取    */o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.01' else o_return_msg end;
        if cur.line>coalesce(v_start_line,0) then

            /*04.03.02:拼接步骤代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.02' else o_return_msg end;
            v_step_sql:=v_step_sql||case when coalesce(v_step_sql,' ')<>' ' then chr(10) end||cur.line_sql;

                /*04.03.03.01:开头是注释代码的需找到代码起始位置*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.03.01' else o_return_msg end;
            if lower(trim(v_step_sql)) like '/*%*/%' or lower(trim(v_step_sql)) like '--%'  THEN

                /*04.03.03.02:获取步骤注释*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.03.02' else o_return_msg end;
                v_step_summary:=v_step_summary||substr(v_step_sql,
                                                       case when lower(trim(v_step_sql)) like '--%' then instr(v_step_sql,'--')+2
                                                            else instr(v_step_sql,'/*')+2
                                                       end,
                                                       case when lower(trim(v_step_sql)) like '--%' then 999
                                                            else instr(v_step_sql,'*/',-1)-instr(v_step_sql,'/*')-2
                                                       end);

                /*04.03.03.03:取到不带注释的步骤代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.03.03' else o_return_msg end;
                v_step_sql:=substr(v_step_sql,case when lower(trim(v_step_sql)) like '--%' and instr(v_step_sql,chr(10))>0 
                                                   THEN instr(v_step_sql,chr(10))+1 
                                                   when lower(trim(v_step_sql)) like '--%' 
                                                   then '' 
                                                   else instr(v_step_sql,'*/')+2 
                                              end);

                /*04.03.03.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.03.99' else o_return_msg end;
            end if;

                /*04.03.04.01:判断是union语句*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.04.01' else o_return_msg end;
            if lower(trim(cur.line_sql)) like 'union%' and APP.F_IS_IN_PARENTHESES(v_step_sql,length(v_step_sql))='0' then

                /*04.03.04.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.04.02' else o_return_msg end;
                v_if_union:='1';

                /*04.03.04.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.04.99' else o_return_msg end;
            end if;

                /*04.03.05.01:找到代码结束位置*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.01' else o_return_msg end;
            if (lower(trim(v_step_sql)) like '%;' and app.f_is_in_quotes(lower(trim(v_step_sql)),length(lower(trim(v_step_sql))))='0') or 
                lower(trim(v_step_sql)) like '% loop' or lower(trim(v_step_sql))='loop' or
                lower(trim(v_step_sql)) like 'if % then' or 
                lower(trim(v_step_sql)) like 'end loop;' or 
                lower(trim(v_step_sql)) like 'else' or lower(trim(v_step_sql)) like 'elsif %then' or
                lower(trim(v_step_sql)) like 'end if;' THEN

                /*04.03.05.02:确定步骤类别*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.02' else o_return_msg end;
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

                    /*04.03.05.03.01:删除步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.03.01' else o_return_msg end;
                if v_step_type='1' THEN

                    /*04.03.05.03.02:获取目标表*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.03.02' else o_return_msg end;
                    v_target_table := app.F_EXTRACT_DELETE_TABLE(v_step_sql);

                    /*04.03.05.03.03:添加步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.03.03' else o_return_msg end;
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,v_target_table,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.03.04:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.03.04' else o_return_msg end;
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.03.05:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.03.05' else o_return_msg end;
                    v_step_sql:=null;

                    /*04.03.05.03.06:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.03.06' else o_return_msg end;
                    v_step_summary:=null;

                    /*04.03.05.03.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.03.99' else o_return_msg end;
                end if;

                    /*04.03.05.04.01:插入步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.04.01' else o_return_msg end;
                if v_step_type='2' THEN

                    /*04.03.05.04.02:获取目标表*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.04.02' else o_return_msg end;
                    v_target_table := app.F_EXTRACT_INSERT_TABLE(v_step_sql);

                    /*04.03.05.04.03:添加步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.04.03' else o_return_msg end;
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,v_target_table,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.04.04:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.04.04' else o_return_msg end;
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.04.05:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.04.05' else o_return_msg end;
                    v_step_sql:=null;

                    /*04.03.05.04.06:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.04.06' else o_return_msg end;
                    v_step_summary:=null;

                    /*04.03.05.04.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.04.99' else o_return_msg end;
                end if;

                    /*04.03.05.05.01:更新步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.05.01' else o_return_msg end;
                if v_step_type='3' THEN

                    /*04.03.05.05.02:获取目标表*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.05.02' else o_return_msg end;
                    v_target_table := app.F_EXTRACT_UPDATE_TABLE(v_step_sql);

                    /*04.03.05.05.03:添加步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.05.03' else o_return_msg end;
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,v_target_table,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.05.04:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.05.04' else o_return_msg end;
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.05.05:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.05.05' else o_return_msg end;
                    v_step_sql:=null;

                    /*04.03.05.05.06:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.05.06' else o_return_msg end;
                    v_step_summary:=null;

                    /*04.03.05.05.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.05.99' else o_return_msg end;
                end if;

                    /*04.03.05.06.01:赋值步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.06.01' else o_return_msg end;
                if v_step_type='4' THEN

                    /*04.03.05.06.02:添加步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.06.02' else o_return_msg end;
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.06.03:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.06.03' else o_return_msg end;
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.06.04:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.06.04' else o_return_msg end;
                    v_step_sql:=null;

                    /*04.03.05.06.05:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.06.05' else o_return_msg end;
                    v_step_summary:=null;

                    /*04.03.05.06.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.06.99' else o_return_msg end;
                end if;

                    /*04.03.05.07.01:循环步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.07.01' else o_return_msg end;
                if v_step_type='5' THEN

                    /*04.03.05.07.02:添加步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.07.02' else o_return_msg end;
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.07.03:加载循环部分代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.07.03' else o_return_msg end;
                    app.PR_ETL_SP_STEP_LOAD(cur.etl_sp_name,case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,cur.line,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.07.04:获取循环返回行号，作为下一步骤的起始行号*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.07.04' else o_return_msg end;
                    v_start_line:=to_number(v_ret_msg);

                    /*04.03.05.07.05:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.07.05' else o_return_msg end;
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.07.06:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.07.06' else o_return_msg end;
                    v_step_sql:=null;

                    /*04.03.05.07.07:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.07.07' else o_return_msg end;
                    v_step_summary:=null;

                    /*04.03.05.07.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.07.99' else o_return_msg end;
                end if;

                    /*04.03.05.08.01:条件步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.08.01' else o_return_msg end;
                if v_step_type='6' THEN

                    /*04.03.05.08.02:添加步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.08.02' else o_return_msg end;
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.08.03:加载条件部分代码*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.08.03' else o_return_msg end;
                    app.PR_ETL_SP_STEP_LOAD(cur.etl_sp_name,case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,cur.line,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.08.04:获取条件返回行号，作为下一步骤的起始行号*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.08.04' else o_return_msg end;
                    v_start_line:=to_number(v_ret_msg);

                    /*04.03.05.08.05:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.08.05' else o_return_msg end;
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.08.06:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.08.06' else o_return_msg end;
                    v_step_sql:=null;

                    /*04.03.05.08.07:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.08.07' else o_return_msg end;
                    v_step_summary:=null;

                    /*04.03.05.08.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.08.99' else o_return_msg end;
                end if;

                    /*04.03.05.09.01:条件分支步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.09.01' else o_return_msg end;
                if v_step_type='6.1' then

                    /*04.03.05.09.02:添加步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.09.02' else o_return_msg end;
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,'9',v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.09.03:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.09.03' else o_return_msg end;
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.09.04:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.09.04' else o_return_msg end;
                    v_step_sql:=null;

                    /*04.03.05.09.05:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.09.05' else o_return_msg end;
                    v_step_summary:=null;

                    /*04.03.05.09.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.09.99' else o_return_msg end;
                end if;

                    /*04.03.05.10.01:条件、循环结束步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.01' else o_return_msg end;
                if v_step_type in ('5.1','6.2') then

                        /*04.03.05.10.02.01:根步骤处理*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.01' else o_return_msg end;
                    if i_step_seq is null THEN

                        /*04.03.05.10.02.02:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.02' else o_return_msg end;
                        v_start_line := cur.line;

                        /*04.03.05.10.02.03:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.03' else o_return_msg end;
                        v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                        /*04.03.05.10.02.04:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.04' else o_return_msg end;
                        v_step_sql:=null;

                        /*04.03.05.10.02.05:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.05' else o_return_msg end;
                        v_step_summary:=null;

                        /*04.03.05.10.02.06:子步骤处理，返回结束行号*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.06' else o_return_msg end;
                    else

                        /*04.03.05.10.02.07:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.07' else o_return_msg end;
                        o_return_msg := cur.line;   

                        /*04.03.05.10.02.08:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.08' else o_return_msg end;
                        o_return_code := 0;

                        /*04.03.05.10.02.09:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.09' else o_return_msg end;
                        return; 

                        /*04.03.05.10.02.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.02.99' else o_return_msg end;
                    end if;

                    /*04.03.05.10.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.10.99' else o_return_msg end;
                end if;

                    /*04.03.05.11.01:其他自定义步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.11.01' else o_return_msg end;
                if v_step_type='9' THEN

                    /*04.03.05.11.02:添加步骤*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.11.02' else o_return_msg end;
                    app.pr_etl_sp_step_insert(cur.etl_sp_name,'1.0',case when i_step_seq is not null then i_step_seq||'.' end||v_step_seq,v_step_summary,v_step_type,v_step_sql,null,i_user_code,v_ret_code,v_ret_msg);

                    /*04.03.05.11.03:步骤号自增*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.11.03' else o_return_msg end;
                    v_step_seq:=trim(to_char(to_number(v_step_seq)+1,'00'));

                    /*04.03.05.11.04:步骤代码清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.11.04' else o_return_msg end;
                    v_step_sql:=null;

                    /*04.03.05.11.05:步骤注释清空*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.11.05' else o_return_msg end;
                    v_step_summary:=null;

                    /*04.03.05.11.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.11.99' else o_return_msg end;
                end if;

                /*04.03.05.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.05.99' else o_return_msg end;
            end if;

            /*04.03.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.03.99' else o_return_msg end;
        end if;

        /*04.99:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'04.99' else o_return_msg end;
    end loop;

    /*05:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'05' else o_return_msg end;
    commit;

    /*06:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'06' else o_return_msg end;
    o_return_msg := '执行成功';    

    /*07:*/o_return_msg:=case when o_return_msg like '步骤号：%' then '步骤号：'||'07' else o_return_msg end;
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_ETL_SP_STEP_LOAD执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



