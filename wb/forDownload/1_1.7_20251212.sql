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
    -- 版    本: 1.3
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 程序步骤SQL查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251212 09:19:33
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
    v_return_msg                         VARCHAR2 ;
BEGIN
        /*01.01:条件:查询的是程序步骤配置代码*/o_return_msg:='01.01';
    if i_step_seq is not null and i_source_from='set' then

        /*01.02:取步骤SQL和步骤类别*/o_return_msg:='01.02';
        select a.STEP_SQL,
               a.step_type
          into v_step_sql,
               v_step_type
          from APP.tb_etl_sp_step a
         where a.etl_sp_name=i_etl_sp_name
            and a.version_id=i_version_id
            and a.step_seq=i_step_seq
        ;

        /*01.03:*/o_return_msg:='01.03';
        v_return_sql:=v_step_sql;

        /*01.04:条件：查询数据库当前程序代码*/o_return_msg:='01.04';
    elsif i_source_from='db' then

        /*01.05:取源代码*/o_return_msg:='01.05';
        APP.PR_ETL_SP_GET_DBA_SOURCE(i_ETL_SP_NAME,i_user_code,v_return_code,v_return_msg);

            /*01.06.01:-循环开始*/o_return_msg:='01.06.01';
        for cur in (select text as sql_code from APP.tb_dba_source where etl_sp_name=i_etl_sp_name order by LINE)
        loop

            /*01.06.02:*/o_return_msg:='01.06.02';
            v_return_sql:=v_return_sql||cur.sql_code||chr(10);

            /*01.06.99:-循环结束*/o_return_msg:='01.06.99';
        end loop;

        /*01.07:查询完整程序配置代码*/o_return_msg:='01.07';
    else

        /*01.08:取程序类别*/o_return_msg:='01.08';
        select max(a.object_type) as etl_sp_type
          into v_etl_sp_type
          from APP.tb_etl_sp a
         where a.etl_sp_name=i_etl_sp_name
           and a.version_id=i_version_id;

        /*01.09:清空程序代码数据*/o_return_msg:='01.09';
        delete from APP.tb_etl_sp_code a
         where a.etl_sp_name=i_etl_sp_name
           and a.version_id=i_version_id;

        /*01.10:拼接完成程序SQL，插入代码表*/o_return_msg:='01.10';
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
                            else '    '||APP.f_step_sql_set('/*',a.step_seq)||a.step_seq||':'||case when a.STEP_SUMMARY is not null then replace(a.STEP_SUMMARY,chr(10),chr(10)||'    ') end||'*/'||case when v_etl_sp_type='PROCEDURE' then 'o_return_msg:='''||a.step_seq||''';' end||chr(10)||'    '||replace(a.step_sql,chr(10),chr(10)||'    ')||chr(10) end,
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
                       '   if sqlcode=-20000 then'||chr(10)||
                       '       raise;'||chr(10)||
                       '   else '||chr(10)||
                       '       o_return_code := -20000;'||chr(10)||
                       '       o_return_msg  := '''||v_test_etl_sp_name||'执行报错，步骤号:''||o_return_msg||chr(10)||SQLERRM;'||chr(10)||
                       '       ROLLBACK;'||chr(10)||
                       '       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);'||chr(10)||
                       '   end if;'||chr(10)||
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

            /*01.11.01:-循环开始*/o_return_msg:='01.11.01';
        for cur in (select sql_code from APP.tb_etl_sp_code where etl_sp_name=i_etl_sp_name and version_id=i_version_id order by LINE)
        loop

            /*01.11.02:*/o_return_msg:='01.11.02';
            v_return_sql:=v_return_sql||cur.sql_code||chr(10);

            /*01.11.99:-循环结束*/o_return_msg:='01.11.99';
        end loop;

        /*01.99:条件分支01结束*/o_return_msg:='01.99';
    end if;

    /*02:*/o_return_msg:='02';
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



