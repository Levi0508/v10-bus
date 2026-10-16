alter table APP.TB_TABLE_PROPS add column DATA_TOPIC char(1);
comment on column APP.TB_TABLE_PROPS.DATA_TOPIC is '数据主题';
alter table APP.TB_TABLE_PROPS add column SENSITIVITY_LEVEL char(1);
comment on column APP.TB_TABLE_PROPS.SENSITIVITY_LEVEL is '敏感等级';
alter table APP.TB_TABLE_PROPS add column DATA_STATUS char(1);
comment on column APP.TB_TABLE_PROPS.DATA_STATUS is '数据状态';


CREATE OR REPLACE PROCEDURE APP.PR_TABLE_COLUMN_Q
(
    i_if_modified_recently               IN CHAR(1) ,--是否近期修改
    i_table_search                       IN VARCHAR2 ,
    i_column_search                      IN VARCHAR2 ,
    i_project_id                         IN VARCHAR2 ,
    i_data_source                        IN VARCHAR2 ,
    i_table_type                         IN VARCHAR2 ,
    i_data_topic                         IN CHAR(1) ,
    rt_cursor                            OUT CURSOR ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.6
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 表字段配置查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260209 10:02:54
    -- 修改内容:1.6:
    -- 修改内容:增加更新创建脚本的步骤,输出新字段，主题，敏感级别，状态
    -- 修改内容:1.5:
    -- 修改内容:修改是否近期修改逻辑
    -- 修改内容:1.4:
    -- 修改内容:解决部分信息设置无法实时刷新的问题
    -- 修改内容:1.3:
    -- 修改内容:近期修改只显示alter table部分
    -- 修改内容:1.2:
    -- 修改内容:替换视图app.vw_columns，提升效率
    -- 修改内容:1.1:
    -- 修改内容:增加显示表修改历史,增加查询近期变动功能
    -- 修改内容:1.0:
    -- 修改内容:达梦1.0版
    --==============================================================================
    v_recent_date                        CHAR(8) default app.get_n_tradedate(to_char(sysdate,'YYYYMMDD'),-5);--近期开始日期
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
        /*01.01:更新创建脚本*/
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
                where  (a.project_id=i_project_id or i_project_id is null)
               ) 
    loop

        /*01.02:*/v_step_msg:='01.02';
        update app.TB_PROJECT_TAB_VIEW a 
        set    a.CREATE_SQL=a.CREATE_SQL||chr(10)||cur.LAST_DDL_TIME||chr(10)||cur.DDL_SQL||chr(10),
               a.UPDATE_TIME=cur.LAST_DDL_TIME
        where  a.tab_view_name=cur.tab_view_name;

        /*01.03:*/v_step_msg:='01.03';
        commit;

        /*01.99:*/
    end loop;

    /*04:*/v_step_msg:='04';
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
        d.DICT_ENTRY,
        case when e.column_name is not null then '1' else '0' end as if_locked,
        a.TABLE_TYPE,
        a.NOT_NULL,
        a.PRIMARY_KEY,
        h.DATA_SOURCE,
        a.SYNONYM_TABLE,
        h.IF_HIS,
        case when a.COLUMN_NAME=h.DATE_COLUMN then '1' else '0' end as IF_DATE_COLUMN,
        h.DATE_COLUMN,
        h.MODIFY_HISTORY,
        b.create_sql,
        h.DATA_TOPIC,
        h.SENSITIVITY_LEVEL,
        h.DATA_STATUS
    from 
        app.tb_columns a
    left join 
        app.tb_project_tab_view b 
    on  a.table_name=b.object_name
    and a.owner=b.owner
    left join 
       app.TB_COLUMN_DICT_ENTRY d 
    on  a.table_full_name=d.TABLE_NAME
    and a.column_name=d.column_name
    left join 
        app.TB_TABLE_LOCK e 
    on  a.owner=e.OWNER
    and a.table_name=e.table_name
    and (a.column_name=e.column_name or e.column_name='*')
    left join 
        app.TB_TABLE_PROPS h
    on  a.owner=h.OWNER
    and a.table_name=h.table_name
    where 
        (  a.table_name=upper(I_TABLE_SEARCH) 
        or a.table_full_name=upper(I_TABLE_SEARCH) 
        or a.SYNONYM_TABLE=upper(I_TABLE_SEARCH) 
        or a.table_full_name in (select referenced_object 
                                   from app.tb_dependencies
                                  where object_name=upper(I_TABLE_SEARCH) 
                                    and referenced_type in ('TABLE','VIEW') 
                                )
        or I_TABLE_SEARCH is null)
    and (a.table_type=i_table_type or i_table_type is null)
    and (a.table_full_name in (select tab_view_name 
                                 from app.tb_project_tab_view_list
                                where project_id=i_project_id 
                              ) or i_project_id is null)
    and (a.DATA_SOURCE=i_data_source or i_data_source is null)
    and (instr(a.column_name,I_COLUMN_SEARCH)>0 or instr(a.column_comments,I_COLUMN_SEARCH)>0 or I_COLUMN_SEARCH is null)
    and ((i_if_modified_recently='1' and substr(b.update_time,1,8)>=v_recent_date) 
       or i_if_modified_recently<>'1' or i_if_modified_recently is null
        )
    and (h.data_topic=i_data_topic or i_data_topic is null)
    order by a.owner,a.table_name,a.column_id
    ;

    /*05:*/v_step_msg:='05';
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
       v_step_msg  := 'APP.PR_TABLE_COLUMN_Q执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



