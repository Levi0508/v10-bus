
comment on column APP.TB_DICT.KEY_NAME is '键名';


--drop table APP.TB_KEY_SEQ;
CREATE TABLE "APP"."TB_KEY_SEQ"
(
"DICT_CODE" VARCHAR2(4) NOT NULL,
"MAP_K" VARCHAR2(50) NOT NULL,
"SET_NO" VARCHAR2(10) NOT NULL,
"KEY_SEQ" INT,
"REMARK" VARCHAR(100),
CONSTRAINT "PK_APP_TB_KEY_SEQ" NOT CLUSTER PRIMARY KEY("DICT_CODE", "MAP_K", "SET_NO")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE APP.TB_KEY_SEQ is '码值排序设置';
COMMENT ON COLUMN APP.TB_KEY_SEQ.DICT_CODE is '字典代码';
COMMENT ON COLUMN APP.TB_KEY_SEQ.KEY_SEQ is '序号';
COMMENT ON COLUMN APP.TB_KEY_SEQ.MAP_K is 'KEY';
COMMENT ON COLUMN APP.TB_KEY_SEQ.REMARK is '备注';
COMMENT ON COLUMN APP.TB_KEY_SEQ.SET_NO is '排序设置编号';


create OR REPLACE  view app.VW_DICT as 
select a.DICT_CODE,
    a.DICT_NAME,
    a.KEY_NAME,
    c.MAP_K as K,
    c.MAP_V as V
from app.TB_DICT a
left join basic_hg.WB_KEY_TYPE b
on a.KEY_NAME =b.KEY_NAME
left join basic_hg.WB_KEY c
on b.sid =c.RID;
COMMENT ON VIEW APP.VW_DICT is '字典码值视图';
COMMENT ON COLUMN APP.VW_DICT.DICT_CODE is '字典代码';
COMMENT ON COLUMN APP.VW_DICT.DICT_NAME is '字典名称';
COMMENT ON COLUMN APP.VW_DICT.K is 'KEY';
COMMENT ON COLUMN APP.VW_DICT.KEY_NAME is '键名';
COMMENT ON COLUMN APP.VW_DICT.V is 'VALUE';


create OR REPLACE  view app.VW_DICT_WITH_SEQ as 
select a.DICT_CODE,
    a.DICT_NAME,
    a.KEY_NAME,
    c.MAP_K as K,
    c.MAP_V as V,
    coalesce(d.SET_NO,'default') as SEQ_SET_NO,
    d.REMARK as SEQ_REMARK,
    d.KEY_SEQ,
    c.SID
from app.TB_DICT a
left join basic_hg.WB_KEY_TYPE b
on a.KEY_NAME =b.KEY_NAME
left join basic_hg.WB_KEY c
on b.sid =c.RID
left join app.tb_key_seq d 
on a.DICT_CODE=d.DICT_CODE
and c.MAP_K=d.MAP_K
order by a.DICT_CODE,d.SET_NO,d.KEY_SEQ,c.MAP_K;
COMMENT ON VIEW APP.VW_DICT_WITH_SEQ is '字典码值视图(带自定义排序)';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.DICT_CODE is '字典代码';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.DICT_NAME is '字典名称';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.K is 'KEY';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.KEY_NAME is '键名';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.KEY_SEQ is '码值序号';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.SEQ_REMARK is '排序设置说明';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.SEQ_SET_NO is '排序设置编号';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.SID is '';
COMMENT ON COLUMN APP.VW_DICT_WITH_SEQ.V is 'VALUE';



comment on column APP.VW_SOURCE_DICT.DICT_NAME is '字典名称';


CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_THJS_001
(
    i_busi_date                          IN VARCHAR2 ,
    o_return_msg                         OUT VARCHAR2 ,
    o_return_code                        OUT NUMBER 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.1
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: THJS-投行限制观察清单转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251205 13:14:33
    -- 修改内容:1.1:
    -- 修改内容:优化一条记录中含多个证券以逗号分隔的情况，需要先拆成单独证券的多条记录后处理
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
BEGIN
    /*01:观察，限制，静默清单为全删全插*/o_return_msg:='01';
    delete from EQUITYDB.TB_STOCK_LIMIT where DATA_SOURCE='THJS' and LIMIT_TYPE in ('l','o','q') ;

    /*02:限制清单*/o_return_msg:='02';
    insert into EQUITYDB.TB_STOCK_LIMIT
    (
           MARKET_CODE,
           STOCK_CODE,
           STOCK_NAME,
           LIMIT_TYPE,
           BEGIN_TIME,
           END_TIME,
           LIMIT_STATUS,
           OTHER_INFO,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_MARKET_CODE,
           SOURCE_STOCK_CODE,
           SOURCE_ROW_ID,
           PROJECT_INFO,
           CUST_NAME,
           PROJECT_SOURCE
    )
    select 
           case when a.WINDCODE like '%.SH' then '1' 
                when a.WINDCODE like '%.SZ' then '2' 
                when a.WINDCODE like '%.BJ' then '3'
                when a.WINDCODE like '%.HK' then '5' 
                when a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then '6' 
                else '?' 
           end as MARKET_CODE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,1,instr(a.WINDCODE,'.')-1) else a.WINDCODE end as STOCK_CODE,
           a.STKNAME as STOCK_NAME,
           'l' as LIMIT_TYPE,
           replace(a.RL_FILL_TIME,'-','') as BEGIN_TIME,
           isnull(replace(a.CL_FILL_TIME,'-',''),'20991231') as END_TIME,
           a.PROJLIST_STATUS as LIMIT_STATUS,
           a.PROJTYPE as OTHER_INFO,
           'THJS' as DATA_SOURCE,
           'THJS.TCL_HGPT_PROJLIST_QD' as SOURCE_TABLE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,instr(a.WINDCODE,'.')+1,3) end as SOURCE_MARKET_CODE,
           a.WINDCODE as SOURCE_STOCK_CODE,
           a.rowid as SOURCE_ROW_ID,
           a.PROJNAME as PROJECT_INFO,
           a.CUSTNAME as CUST_NAME,
           '母公司投行' as PROJECT_SOURCE
    from   
           (select a.RL_FILL_TIME,a.CL_FILL_TIME,a.PROJLIST_STATUS,a.PROJTYPE,a.PROJNAME,a.CUSTNAME,a.rowid,
                   REGEXP_SUBSTR(WINDCODE, '[^,]+', 1, LEVEL) AS WINDCODE,
                   REGEXP_SUBSTR(STKNAME, '[^,]+', 1, LEVEL) AS STKNAME,
                   row_number() over(partition by a.PROJNAME,REGEXP_SUBSTR(WINDCODE, '[^,]+', 1, LEVEL),a.RL_FILL_TIME order by a.CL_FILL_TIME desc) as rn
            from   THJS.TCL_HGPT_PROJLIST_QD a
            where  a.RL_FILL_TIME is not null
            CONNECT BY 
            LEVEL <= REGEXP_COUNT(WINDCODE, ',') + 1  -- 拆分后的值数量 = 逗号数 + 1
            AND PRIOR rowid = rowid  -- 按原记录id分组，避免跨记录混乱
            AND PRIOR DBMS_RANDOM.VALUE IS NOT NULL
           ) a
    where  a.rn=1;

    /*03:观察清单*/o_return_msg:='03';
    insert into EQUITYDB.TB_STOCK_LIMIT
    (
           MARKET_CODE,
           STOCK_CODE,
           STOCK_NAME,
           LIMIT_TYPE,
           BEGIN_TIME,
           END_TIME,
           LIMIT_STATUS,
           OTHER_INFO,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_MARKET_CODE,
           SOURCE_STOCK_CODE,
           SOURCE_ROW_ID,
           PROJECT_INFO,
           CUST_NAME,
           PROJECT_SOURCE
    )
    select 
           case when a.WINDCODE like '%.SH' then '1' 
                when a.WINDCODE like '%.SZ' then '2' 
                when a.WINDCODE like '%.BJ' then '3'
                when a.WINDCODE like '%.HK' then '5' 
                when a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then '6' 
                else '?' 
           end as MARKET_CODE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,1,instr(a.WINDCODE,'.')-1) else a.WINDCODE end as STOCK_CODE,
           a.STKNAME as STOCK_NAME,
           'o' as LIMIT_TYPE,
           replace(a.RO_FILL_TIME,'-','') as BEGIN_TIME,
           isnull(replace(a.CO_FILL_TIME,'-',''),'20991231') as END_TIME,
           a.PROJLIST_STATUS as LIMIT_STATUS,
           a.PROJTYPE as OTHER_INFO,
           'THJS' as DATA_SOURCE,
           'THJS.TCL_HGPT_PROJLIST_QD' as SOURCE_TABLE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,instr(a.WINDCODE,'.')+1,3) end as SOURCE_MARKET_CODE,
           a.WINDCODE as SOURCE_STOCK_CODE,
           a.rowid as SOURCE_ROW_ID,
           a.PROJNAME as PROJECT_INFO,
           a.CUSTNAME as CUST_NAME,
           '母公司投行' as PROJECT_SOURCE
    from   
           (select a.RO_FILL_TIME,a.CO_FILL_TIME,a.PROJLIST_STATUS,a.PROJTYPE,a.PROJNAME,a.CUSTNAME,a.rowid,
                   REGEXP_SUBSTR(WINDCODE, '[^,]+', 1, LEVEL) AS WINDCODE,
                   REGEXP_SUBSTR(STKNAME, '[^,]+', 1, LEVEL) AS STKNAME,
                   row_number() over(partition by a.PROJNAME,REGEXP_SUBSTR(WINDCODE, '[^,]+', 1, LEVEL),a.RO_FILL_TIME order by a.CO_FILL_TIME desc) as rn
            from   THJS.TCL_HGPT_PROJLIST_QD a
            where  a.RO_FILL_TIME is not null
            CONNECT BY 
            LEVEL <= REGEXP_COUNT(WINDCODE, ',') + 1  -- 拆分后的值数量 = 逗号数 + 1
            AND PRIOR rowid = rowid  -- 按原记录id分组，避免跨记录混乱
            AND PRIOR DBMS_RANDOM.VALUE IS NOT NULL
           ) a
    where  a.rn=1;

    /*04:静默清单*/o_return_msg:='04';
    insert into EQUITYDB.TB_STOCK_LIMIT
    (
           MARKET_CODE,
           STOCK_CODE,
           STOCK_NAME,
           LIMIT_TYPE,
           BEGIN_TIME,
           END_TIME,
           LIMIT_STATUS,
           OTHER_INFO,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_MARKET_CODE,
           SOURCE_STOCK_CODE,
           SOURCE_ROW_ID,
           PROJECT_INFO,
           CUST_NAME,
           PROJECT_SOURCE
    )
    select 
           case when a.WINDCODE like '%.SH' then '1' 
                when a.WINDCODE like '%.SZ' then '2' 
                when a.WINDCODE like '%.BJ' then '3'
                when a.WINDCODE like '%.HK' then '5' 
                when a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then '6' 
                else '?' 
           end as MARKET_CODE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,1,instr(a.WINDCODE,'.')-1) else a.WINDCODE end as STOCK_CODE,
           a.STKNAME as STOCK_NAME,
           'q' as LIMIT_TYPE,
           replace(a.RQ_FILL_TIME,'-','') as BEGIN_TIME,
           isnull(replace(a.CQ_FILL_TIME,'-',''),'20991231') as END_TIME,
           a.PROJLIST_STATUS as LIMIT_STATUS,
           a.PROJTYPE as OTHER_INFO,
           'THJS' as DATA_SOURCE,
           'THJS.TCL_HGPT_PROJLIST_QD' as SOURCE_TABLE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,instr(a.WINDCODE,'.')+1,3) end as SOURCE_MARKET_CODE,
           a.WINDCODE as SOURCE_STOCK_CODE,
           a.rowid as SOURCE_ROW_ID,
           a.PROJNAME as PROJECT_INFO,
           a.CUSTNAME as CUST_NAME,
           '母公司投行' as PROJECT_SOURCE
    from   
           (select a.RQ_FILL_TIME,a.CQ_FILL_TIME,a.PROJLIST_STATUS,a.PROJTYPE,a.PROJNAME,a.CUSTNAME,a.rowid,
                   REGEXP_SUBSTR(WINDCODE, '[^,]+', 1, LEVEL) AS WINDCODE,
                   REGEXP_SUBSTR(STKNAME, '[^,]+', 1, LEVEL) AS STKNAME,
                   row_number() over(partition by a.PROJNAME,REGEXP_SUBSTR(WINDCODE, '[^,]+', 1, LEVEL),a.RQ_FILL_TIME order by a.CQ_FILL_TIME desc) as rn
            from   THJS.TCL_HGPT_PROJLIST_QD a
            where  a.RQ_FILL_TIME is not null
            CONNECT BY 
            LEVEL <= REGEXP_COUNT(WINDCODE, ',') + 1  -- 拆分后的值数量 = 逗号数 + 1
            AND PRIOR rowid = rowid  -- 按原记录id分组，避免跨记录混乱
            AND PRIOR DBMS_RANDOM.VALUE IS NOT NULL
           ) a
    where  a.rn=1;

    /*05:香港国际及Y国际投行限制，观察，静默清单*/o_return_msg:='05';
    insert into EQUITYDB.TB_STOCK_LIMIT
    (
           MARKET_CODE,
           STOCK_CODE,
           STOCK_NAME,
           LIMIT_TYPE,
           BEGIN_TIME,
           END_TIME,
           LIMIT_STATUS,
           OTHER_INFO,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_MARKET_CODE,
           SOURCE_STOCK_CODE,
           SOURCE_ROW_ID,
           PROJECT_INFO,
           CUST_NAME,
           PROJECT_SOURCE
    )
    select 
           case when a.WINDCODE like '%.SH' then '1' 
                when a.WINDCODE like '%.SZ' then '2'
                when a.WINDCODE like '%.BJ' then '3' 
                when a.WINDCODE like '%.HK' then '5' 
                when a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then '6' 
                else '?' 
           end as MARKET_CODE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,1,instr(a.WINDCODE,'.')-1) else a.WINDCODE end as STOCK_CODE,
           a.STKNAME as STOCK_NAME,
           case when a.PROJLIST_STATUS like '%l' then 'l' when a.PROJLIST_STATUS like '%o' then 'o' when a.PROJLIST_STATUS like '%q' then 'q' else '?' end as LIMIT_TYPE,
           a.R_FILL_TIME as BEGIN_TIME,
           a.C_FILL_TIME as END_TIME,
           a.PROJLIST_STATUS as LIMIT_STATUS,
           a.PROJTYPE as OTHER_INFO,
           'THJS' as DATA_SOURCE,
           'THJS.TCL_HGPT_PROJLIST_QD_XGGJ' as SOURCE_TABLE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,instr(a.WINDCODE,'.')+1,3) end as SOURCE_MARKET_CODE,
           a.WINDCODE as SOURCE_STOCK_CODE,
           a.rowid as SOURCE_ROW_ID,
           a.PROJTYPE||'-'||a.CUSTNAME as PROJECT_INFO,
           a.CUSTNAME as CUST_NAME,
           a.SOURCE_TYPE as PROJECT_SOURCE
    from   
           (select a.PROJLIST_STATUS,a.R_FILL_TIME,a.C_FILL_TIME,a.PROJTYPE,a.CUSTNAME,a.SOURCE_TYPE,a.rowid,
                   REGEXP_SUBSTR(WINDCODE, '[^,]+', 1, LEVEL) AS WINDCODE,
                   REGEXP_SUBSTR(STKNAME, '[^,]+', 1, LEVEL) AS STKNAME,
                   row_number() over(partition by a.PROJTYPE,a.CUSTNAME ,REGEXP_SUBSTR(WINDCODE, '[^,]+', 1, LEVEL),right(a.PROJLIST_STATUS,1),a.R_FILL_TIME order by a.C_FILL_TIME desc) as rn
            from THJS.TCL_HGPT_PROJLIST_QD_XGGJ a
            CONNECT BY 
            LEVEL <= REGEXP_COUNT(WINDCODE, ',') + 1  -- 拆分后的值数量 = 逗号数 + 1
            AND PRIOR rowid = rowid  -- 按原记录id分组，避免跨记录混乱
            AND PRIOR DBMS_RANDOM.VALUE IS NOT NULL
           ) a
    where  a.rn=1;

    /*07:补上港股通证券*/o_return_msg:='07';
    insert into EQUITYDB.TB_STOCK_LIMIT
    (
           MARKET_CODE,
           STOCK_CODE,
           STOCK_NAME,
           LIMIT_TYPE,
           BEGIN_TIME,
           END_TIME,
           LIMIT_STATUS,
           OTHER_INFO,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_MARKET_CODE,
           SOURCE_STOCK_CODE,
           SOURCE_ROW_ID,
           PROJECT_INFO,
           CUST_NAME,
           PROJECT_SOURCE
    )
    select 
           b.K as MARKET_CODE,
           '0'||a.STOCK_CODE as STOCK_CODE,
           a.STOCK_NAME as STOCK_NAME,
           a.LIMIT_TYPE as LIMIT_TYPE,
           a.BEGIN_TIME as BEGIN_TIME,
           a.END_TIME as END_TIME,
           a.LIMIT_STATUS as LIMIT_STATUS,
           a.OTHER_INFO as OTHER_INFO,
           a.DATA_SOURCE as DATA_SOURCE,
           a.SOURCE_TABLE as SOURCE_TABLE,
           a.SOURCE_MARKET_CODE as SOURCE_MARKET_CODE,
           a.SOURCE_STOCK_CODE as SOURCE_STOCK_CODE,
           a.SOURCE_ROW_ID as SOURCE_ROW_ID,
           a.PROJECT_INFO as PROJECT_INFO,
           a.CUST_NAME as CUST_NAME,
           a.PROJECT_SOURCE as PROJECT_SOURCE
    from   
           EQUITYDB.TB_STOCK_LIMIT a
    left join
           app.vw_dict b
    on     
           b.DICT_CODE='0001'
    and    b.V like '港股通%'
    where  a.DATA_SOURCE='THJS'
    and    a.MARKET_CODE='5'
    and    length(a.stock_code)=4;

    /*09:删除做市清单*/o_return_msg:='09';
    delete from EQUITYDB.TB_STOCK_LIMIT a 
    where a.LIMIT_TYPE='m'
    and   exists(select 1 from THJS.TCL_HGPT_ZSQD b 
                 where  a.STOCK_CODE=b.STK_CODE
                 and    b.BUSI_DATE=a.BEGIN_TIME
                )
    ;

    /*10:做市清单没有开始时间结束时间，数据每天一份*/o_return_msg:='10';
    insert into EQUITYDB.TB_STOCK_LIMIT
    (
           MARKET_CODE,
           STOCK_CODE,
           STOCK_NAME,
           LIMIT_TYPE,
           BEGIN_TIME,
           END_TIME,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_MARKET_CODE,
           SOURCE_STOCK_CODE,
           SOURCE_ROW_ID,
           PROJECT_INFO,
           PROJECT_SOURCE
    )
    select 
           case when a.WINDCODE like '%.SH' then '1' 
                when a.WINDCODE like '%.SZ' then '2' 
                when a.WINDCODE like '%.BJ' then '3'
                when a.WINDCODE like '%.HK' then '5' 
                when a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then '6' 
                else '?' 
           end as MARKET_CODE,
           a.STK_CODE as STOCK_CODE,
           a.STK_NAME as STOCK_NAME,
           'm' as LIMIT_TYPE,
           a.BUSI_DATE as BEGIN_TIME,
           a.BUSI_DATE as END_TIME,
           'THJS' as DATA_SOURCE,
           'THJS.TCL_HGPT_ZSQD' as SOURCE_TABLE,
           case when a.WINDCODE like '%.%' then substr(a.WINDCODE,instr(a.WINDCODE,'.')+1,3) end as SOURCE_MARKET_CODE,
           a.WINDCODE as SOURCE_STOCK_CODE,
           a.rowid as SOURCE_ROW_ID,
           a.STK_NAME as PROJECT_INFO,
           a.DATA_SOURCE as PROJECT_SOURCE
    from   
           THJS.TCL_HGPT_ZSQD a
    where  1=1;

    /*11:*/o_return_msg:='11';
    commit;
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
       o_return_msg  := 'APP.PR_DATA_ETL_THJS_001执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



