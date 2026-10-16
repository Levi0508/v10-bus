CREATE OR REPLACE PROCEDURE APP.P40003
(
    i_project_id                         IN VARCHAR2 ,
    i_project_version                    IN VARCHAR2 ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT CLOB 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.2
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 开发项目版本升级脚本查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251202 17:39:06
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
BEGIN
        /*01.01:按刷库顺序拼接刷库脚本-循环开始*/o_return_msg:='01.01';
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
                       case when a.modify_sql='use ddl' then case when a.tab_or_view='TABLE' then '--drop table '||a.tab_view_name||';'||chr(10) end||a.create_sql else a.modify_sql end as modify_sql
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

            /*01.02.01:条件:对象为程序*/o_return_msg:='01.02.01';
        if cur.object_type='sp' then

            /*01.02.02:根据待升级版本取程序代码*/o_return_msg:='01.02.02';
            APP.P30006(cur.object_name,cur.etl_sp_version_up,'admin',null,null,'1',v_errcode,v_err_msg);

            /*01.02.03:拼接升级脚本*/o_return_msg:='01.02.03';
            v_return_sql:=v_return_sql||v_err_msg||chr(10)||chr(10)||chr(10);

            /*01.02.04:*/o_return_msg:='01.02.04';
        else

            /*01.02.05:拼接表视图升级脚本*/o_return_msg:='01.02.05';
            v_return_sql:=v_return_sql||cur.modify_sql||chr(10)||chr(10)||chr(10);

            /*01.02.99:条件分支01.02结束*/o_return_msg:='01.02.99';
        end if;

        /*01.99:按刷库顺序拼接刷库脚本-循环结束*/o_return_msg:='01.99';
    end loop;

    /*02:*/o_return_msg:='02';
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
       o_return_code := -20000;
       o_return_msg  := 'APP.P40003执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



