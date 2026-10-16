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
    -- 版    本: 1.3
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 表字段配置查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251212 14:04:45
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
    and (i_if_modified_recently='1' and a.MODIFY_HISTORY like '%alter table%' and exists(select 1 from app.tb_tradedate b 
                                               where  REGEXP_LIKE(a.MODIFY_HISTORY,'alter table[^\n]*'||chr(10)||'{1}[^\n]*'||b.tradedate,'n')
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



