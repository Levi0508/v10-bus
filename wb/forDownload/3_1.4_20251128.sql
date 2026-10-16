drop table BONDDB.TB_BOND_HOLDING;
CREATE TABLE "BONDDB"."TB_BOND_HOLDING"
(
"BUSI_DATE" CHAR(8) NOT NULL,
"STOCKHOLDER" VARCHAR2(60) NOT NULL,
"STOCKHOLDER_NAME" VARCHAR2(150),
"CAPITAL_ACCOUNT" VARCHAR2(60),
"MARKET_CODE" CHAR(1) NOT NULL,
"BOND_CODE" VARCHAR2(30) NOT NULL,
"BOND_NAME" VARCHAR2(100),
"CURRENCY" CHAR(3),
"QTY" DECIMAL(19,4),
"COST" DECIMAL(19,4),
"HOLDING_AMOUNT" DECIMAL(19,4),
"DATA_SOURCE" VARCHAR2(10) NOT NULL,
"SOURCE_TABLE" VARCHAR2(100),
"SOURCE_ROW_ID" VARCHAR2(500),
"SOURCE_MARKET_CODE" VARCHAR2(20),
"SOURCE_BOND_CODE" VARCHAR2(30),
"SOURCE_CURRENCY" VARCHAR2(20),
"INTEREST" DECIMAL(19,4),
"FACE_VALUE" DECIMAL(10,3),
CONSTRAINT "PK_BONDDB_TB_BOND_HOLDING" NOT CLUSTER PRIMARY KEY("BUSI_DATE", "STOCKHOLDER", "MARKET_CODE", "BOND_CODE", "DATA_SOURCE")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE BONDDB.TB_BOND_HOLDING is '债券持仓表';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.BOND_CODE is '债券代码';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.BOND_NAME is '债券名称';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.BUSI_DATE is '业务日期';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.CAPITAL_ACCOUNT is '资金账户';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.COST is '成本';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.CURRENCY is '币种';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.DATA_SOURCE is '源系统';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.FACE_VALUE is '债券面额';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.HOLDING_AMOUNT is '持仓金额';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.INTEREST is '利息';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.MARKET_CODE is '市场代码';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.QTY is '持仓数量';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.SOURCE_BOND_CODE is '源债券代码';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.SOURCE_CURRENCY is '源币种';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.SOURCE_MARKET_CODE is '源市场';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.SOURCE_ROW_ID is '源表记录ID';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.SOURCE_TABLE is '源表';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.STOCKHOLDER is '证券账户';
COMMENT ON COLUMN BONDDB.TB_BOND_HOLDING.STOCKHOLDER_NAME is '证券账户名称';



alter table BONDDB.TB_COUNTERPARTY alter column IF_RELATED_CP rename to RELATED_CP_ID;
comment on column BONDDB.TB_COUNTERPARTY.RELATED_CP_ID is '关联对手方ID';
alter table BONDDB.TB_COUNTERPARTY modify RELATED_CP_ID VARCHAR2(30);



alter table BONDDB.TB_RESULT_2022 modify ORDER_SERIAL_NO_A VARCHAR2(50);
alter table BONDDB.TB_RESULT_2022 modify ORDER_SERIAL_NO_B VARCHAR2(50);
comment on TABLE BONDDB.TB_RESULT_2022 is '债券监控-间接交易结果表';


drop table BONDDB.TB_RESULT_2025;
CREATE TABLE "BONDDB"."TB_RESULT_2025"
(
"BUSI_DATE" CHAR(8),
"STOCKHOLDER" VARCHAR2(60),
"STOCKHOLDER_NAME" VARCHAR2(150),
"CP_ID_BUY" VARCHAR2(30),
"CP_NAME_BUY" VARCHAR2(200),
"CP_ID_SELL" VARCHAR2(30),
"CP_NAME_SELL" VARCHAR2(200),
"IF_RELATED_CP" CHAR(1),
"BOND_CODE" VARCHAR2(30),
"BOND_NAME" VARCHAR2(100),
"ORDER_SERIAL_NO_BUY" VARCHAR2(2000),
"ORDER_SERIAL_NO_SELL" VARCHAR2(2000),
"MATCH_QTY_BUY" DECIMAL(19,0),
"MATCH_QTY_SELL" DECIMAL(19,0),
"MATCH_AMOUNT_BUY" DECIMAL(19,4),
"MATCH_AMOUNT_SELL" DECIMAL(19,4),
"PROFIT" DECIMAL(19,4),
"MATCH_COUNT_BUY" INT,
"MATCH_COUNT_SELL" INT,
"ID" INT,
"MARKET_CODE" CHAR(1)) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE BONDDB.TB_RESULT_2025 is '债券监控-疑似过券结果表';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.BOND_CODE is '债券代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.BOND_NAME is '债券名称';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.BUSI_DATE is '业务日期';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.CP_ID_BUY is '对手方ID-买交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.CP_ID_SELL is '对手方ID-卖交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.CP_NAME_BUY is '对手方名称-买交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.CP_NAME_SELL is '对手方名称-卖交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.ID is '';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.IF_RELATED_CP is '交易对手是否关联方';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.MARKET_CODE is '市场代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.MATCH_AMOUNT_BUY is '买入金额';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.MATCH_AMOUNT_SELL is '卖出金额';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.MATCH_COUNT_BUY is '买入笔数';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.MATCH_COUNT_SELL is '卖出笔数';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.MATCH_QTY_BUY is '买入数量';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.MATCH_QTY_SELL is '卖出数量';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.ORDER_SERIAL_NO_BUY is '交易流水号-买交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.ORDER_SERIAL_NO_SELL is '交易流水号-卖交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.PROFIT is '损益';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.STOCKHOLDER is '证券账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2025.STOCKHOLDER_NAME is '证券账户名称';


drop table BONDDB.TB_RESULT_2029;
CREATE TABLE "BONDDB"."TB_RESULT_2029"
(
"BUSI_DATE" CHAR(8) NOT NULL,
"STOCKHOLDER" VARCHAR2(60),
"STOCKHOLDER_NAME" VARCHAR2(150),
"BOND_CODE" VARCHAR2(30),
"BOND_NAME" VARCHAR2(100),
"MATCH_QTY" DECIMAL(19,4),
"MATCH_PRICE_BUY" DECIMAL(19,4),
"MATCH_PRICE_SELL" DECIMAL(19,4),
"MATCH_AMOUNT_BUY" DECIMAL(19,4),
"MATCH_AMOUNT_SELL" DECIMAL(19,4),
"PROFIT" DECIMAL(19,4),
"ORDER_SERIAL_NO_BUY" VARCHAR2(50) NOT NULL,
"ORDER_SERIAL_NO_SELL" VARCHAR2(50) NOT NULL,
"ID" INT NOT NULL,
CONSTRAINT "PK_BONDDB_TB_RESULT_2029" NOT CLUSTER PRIMARY KEY("ORDER_SERIAL_NO_BUY", "ORDER_SERIAL_NO_SELL")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE BONDDB.TB_RESULT_2029 is '债券交易监控-做市亏损结果表';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.BOND_CODE is '债券代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.BOND_NAME is '债券名称';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.BUSI_DATE is '业务日期';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.ID is '';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.MATCH_AMOUNT_BUY is '买入金额';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.MATCH_AMOUNT_SELL is '卖出金额';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.MATCH_PRICE_BUY is '买入价格';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.MATCH_PRICE_SELL is '卖出价格';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.MATCH_QTY is '成交数量';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.ORDER_SERIAL_NO_BUY is '交易流水号-买交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.ORDER_SERIAL_NO_SELL is '交易流水号-卖交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.PROFIT is '损益';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.STOCKHOLDER is '证券账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2029.STOCKHOLDER_NAME is '证券账户名称';


drop table BONDDB.TMP_CP_RELATION;
CREATE GLOBAL TEMPORARY TABLE "BONDDB"."TMP_CP_RELATION"
(
"CP_ID" VARCHAR2(30),
"CP_NAME" VARCHAR2(600),
"RELATED_CP_ID" VARCHAR2(30))
ON COMMIT DELETE ROWS STORAGE(ON TEMP);
COMMENT ON TABLE BONDDB.TMP_CP_RELATION is '交易对手关系临时表';
COMMENT ON COLUMN BONDDB.TMP_CP_RELATION.CP_ID is '';
COMMENT ON COLUMN BONDDB.TMP_CP_RELATION.CP_NAME is '';
COMMENT ON COLUMN BONDDB.TMP_CP_RELATION.RELATED_CP_ID is '';


CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2025
(
    i_busi_date                          IN VARCHAR2 ,
    o_return_msg                         OUT VARCHAR2 ,
    o_return_code                        OUT NUMBER 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 债券交易监控-疑似过券
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251126 10:47:51
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0，新增疑似过券监控任务
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.tb_result_2025 where busi_date=i_busi_date;

    /*02:*/o_return_msg:='02';
    insert into BONDDB.TB_RESULT_2025
    (
           BUSI_DATE,
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           CP_ID_BUY,
           CP_NAME_BUY,
           CP_ID_SELL,
           CP_NAME_SELL,
           IF_RELATED_CP,
           BOND_CODE,
           BOND_NAME,
           ORDER_SERIAL_NO_BUY,
           ORDER_SERIAL_NO_SELL,
           MATCH_QTY_BUY,
           MATCH_QTY_SELL,
           MATCH_AMOUNT_BUY,
           MATCH_AMOUNT_SELL,
           PROFIT,
           MATCH_COUNT_BUY,
           MATCH_COUNT_SELL,
           MARKET_CODE
    )
    select 
           a.busi_date as BUSI_DATE,
           a.stockholder as STOCKHOLDER,
           a.stockholder_name as STOCKHOLDER_NAME,
           a.cp_id_buy as CP_ID_BUY,
           a.cp_name_buy as CP_NAME_BUY,
           b.cp_id_sell as CP_ID_SELL,
           b.cp_name_sell as CP_NAME_SELL,
           '0' as IF_RELATED_CP,
           a.bond_code as BOND_CODE,
           a.bond_name as BOND_NAME,
           a.order_serial_no_buy as ORDER_SERIAL_NO_BUY,
           b.order_serial_no_sell as ORDER_SERIAL_NO_SELL,
           a.match_qty_buy as MATCH_QTY_BUY,
           b.match_qty_sell as MATCH_QTY_SELL,
           a.MATCH_AMOUNT_BUY as MATCH_AMOUNT_BUY,
           b.MATCH_AMOUNT_SELL as MATCH_AMOUNT_SELL,
           b.MATCH_AMOUNT_SELL-a.MATCH_AMOUNT_BUY as PROFIT,
           a.MATCH_COUNT_BUY as MATCH_COUNT_BUY,
           b.MATCH_COUNT_SELL as MATCH_COUNT_SELL,
           a.market_code as MARKET_CODE
    from   
           (
            select a.busi_date,
                   a.stockholder,
                   a.stockholder_name,
                   coalesce(a.cp_id,a.cp_name) as cp_id_buy,
                   a.cp_name as cp_name_buy,
                   a.market_code,
                   a.bond_code,
                   a.bond_name,
                   sum(a.match_qty) as match_qty_buy,
                   sum(a.match_amount) as match_amount_buy,
                   count(1) as match_count_buy,
                   listagg(a.order_serial_no,',') within group(order by a.order_serial_no) as order_serial_no_buy,
                   max(a.order_serial_no) as max_serial_no_buy
            from   bonddb.tb_bond_deal a 
            where  a.busi_date=i_busi_date
            and    a.IF_MKT_MAKING<>'1'
            and    a.order_status='a'
            and    a.order_dir in ('01')
            and    a.STOCKHOLDER not like '%_as'
            and    a.STOCKHOLDER not like '%_AS'
            and    coalesce(a.cp_id,a.cp_name) is not null
            group by a.busi_date,
                   a.stockholder,
                   a.stockholder_name,
                   a.order_dir,
                   coalesce(a.cp_id,a.cp_name),
                   a.cp_name,
                   a.market_code,
                   a.bond_code,
                   a.bond_name
           ) a
    inner join
           (
            select a.busi_date,
                   a.stockholder,
                   a.stockholder_name,
                   coalesce(a.cp_id,a.cp_name) as cp_id_sell,
                   a.cp_name as cp_name_sell,
                   a.market_code,
                   a.bond_code,
                   a.bond_name,
                   sum(a.match_qty) as match_qty_sell,
                   sum(a.match_amount) as match_amount_sell,
                   count(1) as match_count_sell,
                   listagg(a.order_serial_no,',') within group(order by a.order_serial_no) as order_serial_no_sell,
                   min(a.order_serial_no) as min_serial_no_sell
            from   bonddb.tb_bond_deal a 
            where  a.busi_date=i_busi_date
            and    a.IF_MKT_MAKING<>'1'
            and    a.order_status='a'
            and    a.order_dir in ('02')
            and    a.STOCKHOLDER not like '%_as'
            and    a.STOCKHOLDER not like '%_AS'
            and    coalesce(a.cp_id,a.cp_name) is not null
            group by a.busi_date,
                   a.stockholder,
                   a.stockholder_name,
                   a.order_dir,
                   coalesce(a.cp_id,a.cp_name),
                   a.cp_name,
                   a.market_code,
                   a.bond_code,
                   a.bond_name
           ) b
    on     
           a.stockholder=b.stockholder
    and    a.market_code=b.market_code
    and    a.bond_code=b.bond_code
    and    a.cp_id_buy<>b.cp_id_sell
    and    a.max_serial_no_buy<b.min_serial_no_sell
    and    abs(b.match_qty_sell-a.match_qty_buy)/ a.match_qty_buy <= 0.1
    where  1=1;

    /*03:更新关联标志*/o_return_msg:='03';
    update BONDDB.tb_result_2025 a
    set   a.IF_RELATED_CP='1'
    where a.busi_date=i_busi_date
    and   exists(select 1 
                   from bonddb.TB_COUNTERPARTY b
                  inner join 
                        bonddb.TB_COUNTERPARTY c 
                     on b.related_cp_id=c.related_cp_id 
                    and a.cp_id_sell=c.cp_id
                    and a.CP_ID_BUY=b.cp_id );

    /*04:*/o_return_msg:='04';
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
       o_return_msg  := 'BONDDB.PR_TASK_2025执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



create or replace view BONDDB.VW_BOND_ISSUE_AMOUNT as 
select a.BOND_CODE,
       a.MARKET_CODE,
       a.S_INFO_NAME as BOND_NAME,
       a.BEGIN_DATE,
       coalesce(a.end_date,a.B_INFO_ENDDATE) as END_DATE,
       a.ISSUE_AMOUNT_REMAIN
from   (
        select substr(a.S_INFO_WINDCODE,1,instr(a.S_INFO_WINDCODE,'.')-1) as BOND_CODE,
               case when substr(a.S_INFO_WINDCODE,instr(a.S_INFO_WINDCODE,'.')+1)='SH' then '1'
                    when substr(a.S_INFO_WINDCODE,instr(a.S_INFO_WINDCODE,'.')+1)='SZ' then '2'
                    when substr(a.S_INFO_WINDCODE,instr(a.S_INFO_WINDCODE,'.')+1)='BJ' then '3'
                    when substr(a.S_INFO_WINDCODE,instr(a.S_INFO_WINDCODE,'.')+1)='IB' then '4'
                    else '?'
               end as market_code,
               a.S_INFO_ENDDATE as begin_date,
               lead(a.S_INFO_ENDDATE) over(partition by a.S_INFO_WINDCODE order by a.S_INFO_ENDDATE) as end_date,
               a.B_INFO_OUTSTANDINGBALANCE*100000000 as issue_amount_remain,
               b.B_INFO_ENDDATE,
               b.S_INFO_NAME
        from   WIND.TCL_CBONDAMOUNT a
        left join 
               WIND.TCL_CBONDDESCRIPTION b
        on     a.S_INFO_WINDCODE=b.S_INFO_WINDCODE
        where  a.S_INFO_WINDCODE like '%.SH' or a.S_INFO_WINDCODE like '%.SZ' or a.S_INFO_WINDCODE like '%.IB' or a.S_INFO_WINDCODE like '%.BJ'
       ) a
where  a.issue_amount_remain>0;
COMMENT ON VIEW BONDDB.VW_BOND_ISSUE_AMOUNT is '债券发行规模变动视图，暂时只取沪深北及银行间市场';
COMMENT ON COLUMN BONDDB.VW_BOND_ISSUE_AMOUNT.BEGIN_DATE is '';
COMMENT ON COLUMN BONDDB.VW_BOND_ISSUE_AMOUNT.BOND_CODE is '';
COMMENT ON COLUMN BONDDB.VW_BOND_ISSUE_AMOUNT.BOND_NAME is '';
COMMENT ON COLUMN BONDDB.VW_BOND_ISSUE_AMOUNT.END_DATE is '';
COMMENT ON COLUMN BONDDB.VW_BOND_ISSUE_AMOUNT.ISSUE_AMOUNT_REMAIN is '';
COMMENT ON COLUMN BONDDB.VW_BOND_ISSUE_AMOUNT.MARKET_CODE is '';


CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2022
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
    -- 功能名称: 债券交易监控-间接交易监控
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251125 10:31:35
    -- 修改内容:1.1:
    -- 修改内容:取交易日改为取一般证券交易日而非银行间市场交易日
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_type1_watch_days                   INT default 2;
    v_type1_begin_date                   CHAR(8) default app.get_n_tradedate(i_busi_date,-1);
    v_type2_watch_days                   INT default 5;
    v_type2_begin_date                   CHAR(8) default app.get_n_tradedate(i_busi_date,-4);
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.tb_result_2022 where busi_date_a=i_busi_date;

    /*02:2个交易日内,通过不同的交易对手,自营与投顾,投顾与投顾之间交易同一只债券,反向交易两笔相同数量的债券交易流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='02';
    insert into BONDDB.TB_RESULT_2022
    (
           BUSI_DATE_A,
           ORDER_DIR_A,
           ORDER_DIR_NAME_A,
           STOCKHOLDER_A,
           STOCKHOLDER_NAME_A,
           CP_ID_A,
           CP_NAME_A,
           ORDER_SERIAL_NO_A,
           BOND_CODE,
           BOND_NAME,
           MATCH_QTY,
           BUSI_DATE_B,
           ORDER_DIR_B,
           ORDER_DIR_NAME_B,
           STOCKHOLDER_B,
           STOCKHOLDER_NAME_B,
           CP_ID_B,
           CP_NAME_B,
           ORDER_SERIAL_NO_B,
           WATCH_TYPE,
           MARKET_CODE,
           MATCH_AMOUNT
    )
    select 
           a.BUSI_DATE as BUSI_DATE_A,
           a.ORDER_DIR as ORDER_DIR_A,
           a.order_dir_name as ORDER_DIR_NAME_A,
           a.STOCKHOLDER as STOCKHOLDER_A,
           A.STOCKHOLDER_NAME as STOCKHOLDER_NAME_A,
           a.CP_ID as CP_ID_A,
           a.cp_name as CP_NAME_A,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO_A,
           a.bond_code as BOND_CODE,
           a.bond_name as BOND_NAME,
           a.match_qty as MATCH_QTY,
           b.BUSI_DATE as BUSI_DATE_B,
           b.ORDER_DIR as ORDER_DIR_B,
           b.order_dir_name as ORDER_DIR_NAME_B,
           b.STOCKHOLDER as STOCKHOLDER_B,
           b.STOCKHOLDER_NAME as STOCKHOLDER_NAME_B,
           b.CP_ID as CP_ID_B,
           b.cp_name as CP_NAME_B,
           b.ORDER_SERIAL_NO as ORDER_SERIAL_NO_B,
           '现券'||g.V||'与'||h.V||v_type1_watch_days||'日内不同对手' as WATCH_TYPE,
           a.MARKET_CODE as MARKET_CODE,
           a.MATCH_AMOUNT as MATCH_AMOUNT
    from   
           bonddb.TB_BOND_DEAL a
    inner join
           bonddb.TB_BOND_DEAL b
    on     
           b.busi_date between v_type1_begin_date and i_busi_date
    and    a.order_dir<>b.ORDER_DIR 
    and    a.CP_ID<>b.CP_ID
    and    a.MARKET_CODE=b.MARKET_CODE
    and    a.BOND_CODE=b.BOND_CODE
    and    a.match_qty=b.MATCH_QTY
    and    a.STOCKHOLDER<>b.STOCKHOLDER
    inner join
           bonddb.TB_PORTFOLIO_TREE c
    on     
           a.stockholder=c.STOCKHOLDER
    and    c.ACCOUNT_PROP in ('1','2')
    inner join
           bonddb.TB_PORTFOLIO_TREE d
    on     
           b.stockholder=d.STOCKHOLDER
    and    d.ACCOUNT_PROP in ('1','2')
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP e
    on     
           a.stockholder=e.STOCKHOLDER
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP f
    on     
           b.stockholder=f.STOCKHOLDER
    left join
           app.VW_DICT g
    on     
           c.account_prop=g.K
    and    g.DICT_CODE='0004'
    left join
           app.VW_DICT h
    on     
           d.account_prop=h.K
    and    h.DICT_CODE='0004'
    where  a.busi_date=i_busi_date
    and    a.cp_id<>coalesce(e.INVEST_ADVISOR_ID,' ')
    and    b.cp_id<>coalesce(f.INVEST_ADVISOR_ID,' ')
    and    a.IF_MKT_MAKING<>'1'
    and    b.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('01','02')
    and    b.order_dir in ('01','02')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    b.STOCKHOLDER not like '%_as'
    and    b.STOCKHOLDER not like '%_AS'
    and    (c.ACCOUNT_PROP='2' or d.ACCOUNT_PROP='2');

    /*03:5个交易日内,通过相同的交易对手,自营与投顾,投顾与投顾之间交易同一只债券,反向交易两笔相同数量的债券交易流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='03';
    insert into BONDDB.TB_RESULT_2022
    (
           BUSI_DATE_A,
           ORDER_DIR_A,
           ORDER_DIR_NAME_A,
           STOCKHOLDER_A,
           STOCKHOLDER_NAME_A,
           CP_ID_A,
           CP_NAME_A,
           ORDER_SERIAL_NO_A,
           BOND_CODE,
           BOND_NAME,
           MATCH_QTY,
           BUSI_DATE_B,
           ORDER_DIR_B,
           ORDER_DIR_NAME_B,
           STOCKHOLDER_B,
           STOCKHOLDER_NAME_B,
           CP_ID_B,
           CP_NAME_B,
           ORDER_SERIAL_NO_B,
           WATCH_TYPE,
           MARKET_CODE,
           MATCH_AMOUNT
    )
    select 
           a.BUSI_DATE as BUSI_DATE_A,
           a.ORDER_DIR as ORDER_DIR_A,
           a.order_dir_name as ORDER_DIR_NAME_A,
           a.STOCKHOLDER as STOCKHOLDER_A,
           A.STOCKHOLDER_NAME as STOCKHOLDER_NAME_A,
           a.CP_ID as CP_ID_A,
           a.cp_name as CP_NAME_A,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO_A,
           a.bond_code as BOND_CODE,
           a.bond_name as BOND_NAME,
           a.match_qty as MATCH_QTY,
           b.BUSI_DATE as BUSI_DATE_B,
           b.ORDER_DIR as ORDER_DIR_B,
           b.order_dir_name as ORDER_DIR_NAME_B,
           b.STOCKHOLDER as STOCKHOLDER_B,
           b.STOCKHOLDER_NAME as STOCKHOLDER_NAME_B,
           b.CP_ID as CP_ID_B,
           b.cp_name as CP_NAME_B,
           b.ORDER_SERIAL_NO as ORDER_SERIAL_NO_B,
           '现券'||g.V||'与'||h.V||v_type2_watch_days||'日内相同对手' as WATCH_TYPE,
           a.MARKET_CODE as MARKET_CODE,
           a.MATCH_AMOUNT as MATCH_AMOUNT
    from   
           BONDDB.TB_BOND_DEAL a
    inner join
           bonddb.TB_BOND_DEAL b
    on     
           b.busi_date between v_type2_begin_date and i_busi_date
    and    a.order_dir<>b.ORDER_DIR 
    and    a.CP_ID=b.CP_ID
    and    a.MARKET_CODE=b.MARKET_CODE
    and    a.BOND_CODE=b.BOND_CODE
    and    a.match_qty=b.MATCH_QTY
    and    a.STOCKHOLDER<>b.STOCKHOLDER
    inner join
           bonddb.TB_PORTFOLIO_TREE c
    on     
           a.stockholder=c.STOCKHOLDER
    and    c.ACCOUNT_PROP in ('1','2')
    inner join
           bonddb.TB_PORTFOLIO_TREE d
    on     
           b.stockholder=d.STOCKHOLDER
    and    d.ACCOUNT_PROP in ('1','2')
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP e
    on     
           a.stockholder=e.STOCKHOLDER
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP f
    on     
           b.stockholder=f.STOCKHOLDER
    left join
           app.VW_DICT g
    on     
           c.account_prop=g.K
    and    g.DICT_CODE='0004'
    left join
           app.VW_DICT h
    on     
           d.account_prop=h.K
    and    h.DICT_CODE='0004'
    where  a.busi_date=i_busi_date
    and    a.cp_id<>coalesce(e.INVEST_ADVISOR_ID,' ')
    and    b.cp_id<>coalesce(f.INVEST_ADVISOR_ID,' ')
    and    a.IF_MKT_MAKING<>'1'
    and    b.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('01','02')
    and    b.order_dir in ('01','02')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    b.STOCKHOLDER not like '%_as'
    and    b.STOCKHOLDER not like '%_AS'
    and    (c.ACCOUNT_PROP='2' or d.ACCOUNT_PROP='2');

    /*04:2个交易日内,通过不同的交易对手,自营与投顾,投顾与投顾之间,正逆回购反向交易同一品种,两笔相同金额的回购交易流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='04';
    insert into BONDDB.TB_RESULT_2022
    (
           BUSI_DATE_A,
           ORDER_DIR_A,
           ORDER_DIR_NAME_A,
           STOCKHOLDER_A,
           STOCKHOLDER_NAME_A,
           CP_ID_A,
           CP_NAME_A,
           ORDER_SERIAL_NO_A,
           BOND_CODE,
           BOND_NAME,
           BUSI_DATE_B,
           ORDER_DIR_B,
           ORDER_DIR_NAME_B,
           STOCKHOLDER_B,
           STOCKHOLDER_NAME_B,
           CP_ID_B,
           CP_NAME_B,
           ORDER_SERIAL_NO_B,
           WATCH_TYPE,
           MARKET_CODE,
           MATCH_AMOUNT
    )
    select 
           a.BUSI_DATE as BUSI_DATE_A,
           a.ORDER_DIR as ORDER_DIR_A,
           a.order_dir_name as ORDER_DIR_NAME_A,
           a.STOCKHOLDER as STOCKHOLDER_A,
           A.STOCKHOLDER_NAME as STOCKHOLDER_NAME_A,
           a.CP_ID as CP_ID_A,
           a.cp_name as CP_NAME_A,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO_A,
           a.repo_code as BOND_CODE,
           a.repo_name as BOND_NAME,
           b.BUSI_DATE as BUSI_DATE_B,
           b.ORDER_DIR as ORDER_DIR_B,
           b.order_dir_name as ORDER_DIR_NAME_B,
           b.STOCKHOLDER as STOCKHOLDER_B,
           b.STOCKHOLDER_NAME as STOCKHOLDER_NAME_B,
           b.CP_ID as CP_ID_B,
           b.cp_name as CP_NAME_B,
           b.ORDER_SERIAL_NO as ORDER_SERIAL_NO_B,
           '回购'||g.V||'与'||h.V||v_type1_watch_days||'日内不同对手' as WATCH_TYPE,
           a.MARKET_CODE as MARKET_CODE,
           a.MATCH_AMOUNT as MATCH_AMOUNT
    from   
           BONDDB.TB_REPO a
    inner join
           bonddb.TB_REPO b
    on     
           b.busi_date between v_type1_begin_date and i_busi_date
    and    a.order_dir<>b.ORDER_DIR 
    and    a.CP_ID<>b.CP_ID
    and    a.MARKET_CODE=b.MARKET_CODE
    and    a.repo_code=b.repo_code
    and    a.MATCH_AMOUNT=b.MATCH_AMOUNT
    and    a.STOCKHOLDER<>b.STOCKHOLDER
    inner join
           bonddb.TB_PORTFOLIO_TREE c
    on     
           a.stockholder=c.STOCKHOLDER
    and    c.ACCOUNT_PROP in ('1','2')
    inner join
           bonddb.TB_PORTFOLIO_TREE d
    on     
           b.stockholder=d.STOCKHOLDER
    and    d.ACCOUNT_PROP in ('1','2')
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP e
    on     
           a.stockholder=e.STOCKHOLDER
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP f
    on     
           b.stockholder=f.STOCKHOLDER
    left join
           app.VW_DICT g
    on     
           c.account_prop=g.K
    and    g.DICT_CODE='0004'
    left join
           app.VW_DICT h
    on     
           d.account_prop=h.K
    and    h.DICT_CODE='0004'
    where  a.busi_date=i_busi_date
    and    a.cp_id<>coalesce(e.INVEST_ADVISOR_ID,' ')
    and    b.cp_id<>coalesce(f.INVEST_ADVISOR_ID,' ')
    and    a.IF_MKT_MAKING<>'1'
    and    b.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('03','04','28','29')
    and    b.order_dir in ('03','04','28','29')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    b.STOCKHOLDER not like '%_as'
    and    b.STOCKHOLDER not like '%_AS'
    and    (c.ACCOUNT_PROP='2' or d.ACCOUNT_PROP='2');

    /*05:5个交易日内,通过相同的交易对手,自营与投顾,投顾与投顾之间,正逆回购反向交易同一品种,两笔相同数量的回购交易流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='05';
    insert into BONDDB.TB_RESULT_2022
    (
           BUSI_DATE_A,
           ORDER_DIR_A,
           ORDER_DIR_NAME_A,
           STOCKHOLDER_A,
           STOCKHOLDER_NAME_A,
           CP_ID_A,
           CP_NAME_A,
           ORDER_SERIAL_NO_A,
           BOND_CODE,
           BOND_NAME,
           BUSI_DATE_B,
           ORDER_DIR_B,
           ORDER_DIR_NAME_B,
           STOCKHOLDER_B,
           STOCKHOLDER_NAME_B,
           CP_ID_B,
           CP_NAME_B,
           ORDER_SERIAL_NO_B,
           WATCH_TYPE,
           MARKET_CODE,
           MATCH_AMOUNT
    )
    select 
           a.BUSI_DATE as BUSI_DATE_A,
           a.ORDER_DIR as ORDER_DIR_A,
           a.order_dir_name as ORDER_DIR_NAME_A,
           a.STOCKHOLDER as STOCKHOLDER_A,
           A.STOCKHOLDER_NAME as STOCKHOLDER_NAME_A,
           a.CP_ID as CP_ID_A,
           a.cp_name as CP_NAME_A,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO_A,
           a.repo_code as BOND_CODE,
           a.repo_name as BOND_NAME,
           b.BUSI_DATE as BUSI_DATE_B,
           b.ORDER_DIR as ORDER_DIR_B,
           b.order_dir_name as ORDER_DIR_NAME_B,
           b.STOCKHOLDER as STOCKHOLDER_B,
           b.STOCKHOLDER_NAME as STOCKHOLDER_NAME_B,
           b.CP_ID as CP_ID_B,
           b.cp_name as CP_NAME_B,
           b.ORDER_SERIAL_NO as ORDER_SERIAL_NO_B,
           '回购'||g.V||'与'||h.V||v_type2_watch_days||'日内相同对手' as WATCH_TYPE,
           a.MARKET_CODE as MARKET_CODE,
           a.MATCH_AMOUNT as MATCH_AMOUNT
    from   
           BONDDB.TB_REPO a
    inner join
           bonddb.TB_REPO b
    on     
           b.busi_date between v_type2_begin_date and i_busi_date
    and    a.order_dir<>b.ORDER_DIR 
    and    a.CP_ID=b.CP_ID
    and    a.MARKET_CODE=b.MARKET_CODE
    and    a.repo_code=b.repo_code
    and    a.MATCH_AMOUNT=b.MATCH_AMOUNT
    and    a.STOCKHOLDER<>b.STOCKHOLDER
    inner join
           bonddb.TB_PORTFOLIO_TREE c
    on     
           a.stockholder=c.STOCKHOLDER
    and    c.ACCOUNT_PROP in ('1','2')
    inner join
           bonddb.TB_PORTFOLIO_TREE d
    on     
           b.stockholder=d.STOCKHOLDER
    and    d.ACCOUNT_PROP in ('1','2')
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP e
    on     
           a.stockholder=e.STOCKHOLDER
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP f
    on     
           b.stockholder=f.STOCKHOLDER
    left join
           app.VW_DICT g
    on     
           c.account_prop=g.K
    and    g.DICT_CODE='0004'
    left join
           app.VW_DICT h
    on     
           d.account_prop=h.K
    and    h.DICT_CODE='0004'
    where  a.busi_date=i_busi_date
    and    a.cp_id<>coalesce(e.INVEST_ADVISOR_ID,' ')
    and    b.cp_id<>coalesce(f.INVEST_ADVISOR_ID,' ')
    and    a.IF_MKT_MAKING<>'1'
    and    b.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('03','04','28','29')
    and    b.order_dir in ('03','04','28','29')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    b.STOCKHOLDER not like '%_as'
    and    b.STOCKHOLDER not like '%_AS'
    and    (c.ACCOUNT_PROP='2' or d.ACCOUNT_PROP='2');

    /*06:2个交易日内,通过不同的交易对手,自营与投顾,投顾与投顾之间借入借出同一只债券,反向交易两笔相同数量的债券借贷流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='06';
    insert into BONDDB.TB_RESULT_2022
    (
           BUSI_DATE_A,
           ORDER_DIR_A,
           ORDER_DIR_NAME_A,
           STOCKHOLDER_A,
           STOCKHOLDER_NAME_A,
           CP_ID_A,
           CP_NAME_A,
           ORDER_SERIAL_NO_A,
           BOND_CODE,
           BOND_NAME,
           MATCH_QTY,
           BUSI_DATE_B,
           ORDER_DIR_B,
           ORDER_DIR_NAME_B,
           STOCKHOLDER_B,
           STOCKHOLDER_NAME_B,
           CP_ID_B,
           CP_NAME_B,
           ORDER_SERIAL_NO_B,
           WATCH_TYPE,
           MARKET_CODE,
           MATCH_AMOUNT
    )
    select 
           a.BUSI_DATE as BUSI_DATE_A,
           a.ORDER_DIR as ORDER_DIR_A,
           a.order_dir_name as ORDER_DIR_NAME_A,
           a.STOCKHOLDER as STOCKHOLDER_A,
           A.STOCKHOLDER_NAME as STOCKHOLDER_NAME_A,
           a.CP_ID as CP_ID_A,
           a.cp_name as CP_NAME_A,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO_A,
           a.bond_code as BOND_CODE,
           a.bond_name as BOND_NAME,
           a.match_qty as MATCH_QTY,
           b.BUSI_DATE as BUSI_DATE_B,
           b.ORDER_DIR as ORDER_DIR_B,
           b.order_dir_name as ORDER_DIR_NAME_B,
           b.STOCKHOLDER as STOCKHOLDER_B,
           b.STOCKHOLDER_NAME as STOCKHOLDER_NAME_B,
           b.CP_ID as CP_ID_B,
           b.cp_name as CP_NAME_B,
           b.ORDER_SERIAL_NO as ORDER_SERIAL_NO_B,
           '借贷'||g.V||'与'||h.V||v_type1_watch_days||'日内不同对手' as WATCH_TYPE,
           a.MARKET_CODE as MARKET_CODE,
           a.MATCH_AMOUNT as MATCH_AMOUNT
    from   
           BONDDB.TB_BOND_LENDING a
    inner join
           bonddb.TB_BOND_LENDING b
    on     
           b.busi_date between v_type1_begin_date and i_busi_date
    and    a.order_dir<>b.ORDER_DIR 
    and    a.CP_ID<>b.CP_ID
    and    a.MARKET_CODE=b.MARKET_CODE
    and    a.BOND_CODE=b.BOND_CODE
    and    a.match_qty=b.MATCH_QTY
    and    a.STOCKHOLDER<>b.STOCKHOLDER
    inner join
           bonddb.TB_PORTFOLIO_TREE c
    on     
           a.stockholder=c.STOCKHOLDER
    and    c.ACCOUNT_PROP in ('1','2')
    inner join
           bonddb.TB_PORTFOLIO_TREE d
    on     
           b.stockholder=d.STOCKHOLDER
    and    d.ACCOUNT_PROP in ('1','2')
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP e
    on     
           a.stockholder=e.STOCKHOLDER
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP f
    on     
           b.stockholder=f.STOCKHOLDER
    left join
           app.VW_DICT g
    on     
           c.account_prop=g.K
    and    g.DICT_CODE='0004'
    left join
           app.VW_DICT h
    on     
           d.account_prop=h.K
    and    h.DICT_CODE='0004'
    where  a.busi_date=i_busi_date
    and    a.cp_id<>coalesce(e.INVEST_ADVISOR_ID,' ')
    and    b.cp_id<>coalesce(f.INVEST_ADVISOR_ID,' ')
    and    a.IF_MKT_MAKING<>'1'
    and    b.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('33','34')
    and    b.order_dir in ('33','34')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    b.STOCKHOLDER not like '%_as'
    and    b.STOCKHOLDER not like '%_AS'
    and    (c.ACCOUNT_PROP='2' or d.ACCOUNT_PROP='2');

    /*07:5个交易日内,通过相同的交易对手,自营与投顾,投顾与投顾之间借入借出同一只债券,反向交易两笔相同数量的债券借贷流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='07';
    insert into BONDDB.TB_RESULT_2022
    (
           BUSI_DATE_A,
           ORDER_DIR_A,
           ORDER_DIR_NAME_A,
           STOCKHOLDER_A,
           STOCKHOLDER_NAME_A,
           CP_ID_A,
           CP_NAME_A,
           ORDER_SERIAL_NO_A,
           BOND_CODE,
           BOND_NAME,
           MATCH_QTY,
           BUSI_DATE_B,
           ORDER_DIR_B,
           ORDER_DIR_NAME_B,
           STOCKHOLDER_B,
           STOCKHOLDER_NAME_B,
           CP_ID_B,
           CP_NAME_B,
           ORDER_SERIAL_NO_B,
           WATCH_TYPE,
           MARKET_CODE,
           MATCH_AMOUNT
    )
    select 
           a.BUSI_DATE as BUSI_DATE_A,
           a.ORDER_DIR as ORDER_DIR_A,
           a.order_dir_name as ORDER_DIR_NAME_A,
           a.STOCKHOLDER as STOCKHOLDER_A,
           A.STOCKHOLDER_NAME as STOCKHOLDER_NAME_A,
           a.CP_ID as CP_ID_A,
           a.cp_name as CP_NAME_A,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO_A,
           a.bond_code as BOND_CODE,
           a.bond_name as BOND_NAME,
           a.match_qty as MATCH_QTY,
           b.BUSI_DATE as BUSI_DATE_B,
           b.ORDER_DIR as ORDER_DIR_B,
           b.order_dir_name as ORDER_DIR_NAME_B,
           b.STOCKHOLDER as STOCKHOLDER_B,
           b.STOCKHOLDER_NAME as STOCKHOLDER_NAME_B,
           b.CP_ID as CP_ID_B,
           b.cp_name as CP_NAME_B,
           b.ORDER_SERIAL_NO as ORDER_SERIAL_NO_B,
           '借贷'||g.V||'与'||h.V||v_type2_watch_days||'日内相同对手' as WATCH_TYPE,
           a.MARKET_CODE as MARKET_CODE,
           a.MATCH_AMOUNT as MATCH_AMOUNT
    from   
           BONDDB.TB_BOND_LENDING a
    inner join
           bonddb.TB_BOND_LENDING b
    on     
           b.busi_date between v_type2_begin_date and i_busi_date
    and    a.order_dir<>b.ORDER_DIR 
    and    a.CP_ID=b.CP_ID
    and    a.MARKET_CODE=b.MARKET_CODE
    and    a.BOND_CODE=b.BOND_CODE
    and    a.match_qty=b.MATCH_QTY
    and    a.STOCKHOLDER<>b.STOCKHOLDER
    inner join
           bonddb.TB_PORTFOLIO_TREE c
    on     
           a.stockholder=c.STOCKHOLDER
    and    c.ACCOUNT_PROP in ('1','2')
    inner join
           bonddb.TB_PORTFOLIO_TREE d
    on     
           b.stockholder=d.STOCKHOLDER
    and    d.ACCOUNT_PROP in ('1','2')
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP e
    on     
           a.stockholder=e.STOCKHOLDER
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP f
    on     
           b.stockholder=f.STOCKHOLDER
    left join
           app.VW_DICT g
    on     
           c.account_prop=g.K
    and    g.DICT_CODE='0004'
    left join
           app.VW_DICT h
    on     
           d.account_prop=h.K
    and    h.DICT_CODE='0004'
    where  a.busi_date=i_busi_date
    and    a.cp_id<>coalesce(e.INVEST_ADVISOR_ID,' ')
    and    b.cp_id<>coalesce(f.INVEST_ADVISOR_ID,' ')
    and    a.IF_MKT_MAKING<>'1'
    and    b.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('33','34')
    and    b.order_dir in ('33','34')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    b.STOCKHOLDER not like '%_as'
    and    b.STOCKHOLDER not like '%_AS'
    and    (c.ACCOUNT_PROP='2' or d.ACCOUNT_PROP='2');

    /*08:2个交易日内,通过不同的交易对手,自营与投顾,投顾与投顾之间远期买卖同一只债券,反向交易两笔相同数量的债券远期流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='08';
    insert into BONDDB.TB_RESULT_2022
    (
           BUSI_DATE_A,
           ORDER_DIR_A,
           ORDER_DIR_NAME_A,
           STOCKHOLDER_A,
           STOCKHOLDER_NAME_A,
           CP_ID_A,
           CP_NAME_A,
           ORDER_SERIAL_NO_A,
           BOND_CODE,
           BOND_NAME,
           MATCH_QTY,
           BUSI_DATE_B,
           ORDER_DIR_B,
           ORDER_DIR_NAME_B,
           STOCKHOLDER_B,
           STOCKHOLDER_NAME_B,
           CP_ID_B,
           CP_NAME_B,
           ORDER_SERIAL_NO_B,
           WATCH_TYPE,
           MARKET_CODE,
           MATCH_AMOUNT
    )
    select 
           a.BUSI_DATE as BUSI_DATE_A,
           a.ORDER_DIR as ORDER_DIR_A,
           a.order_dir_name as ORDER_DIR_NAME_A,
           a.STOCKHOLDER as STOCKHOLDER_A,
           A.STOCKHOLDER_NAME as STOCKHOLDER_NAME_A,
           a.CP_ID as CP_ID_A,
           a.cp_name as CP_NAME_A,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO_A,
           a.bond_code as BOND_CODE,
           a.bond_name as BOND_NAME,
           a.match_qty as MATCH_QTY,
           b.BUSI_DATE as BUSI_DATE_B,
           b.ORDER_DIR as ORDER_DIR_B,
           b.order_dir_name as ORDER_DIR_NAME_B,
           b.STOCKHOLDER as STOCKHOLDER_B,
           b.STOCKHOLDER_NAME as STOCKHOLDER_NAME_B,
           b.CP_ID as CP_ID_B,
           b.cp_name as CP_NAME_B,
           b.ORDER_SERIAL_NO as ORDER_SERIAL_NO_B,
           '远期'||g.V||'与'||h.V||v_type1_watch_days||'日内不同对手' as WATCH_TYPE,
           a.MARKET_CODE as MARKET_CODE,
           a.MATCH_AMOUNT as MATCH_AMOUNT
    from   
           BONDDB.TB_BOND_FORWARD a
    inner join
           bonddb.TB_BOND_FORWARD b
    on     
           b.busi_date between v_type1_begin_date and i_busi_date
    and    a.order_dir<>b.ORDER_DIR 
    and    a.CP_ID<>b.CP_ID
    and    a.MARKET_CODE=b.MARKET_CODE
    and    a.BOND_CODE=b.BOND_CODE
    and    a.match_qty=b.MATCH_QTY
    and    a.STOCKHOLDER<>b.STOCKHOLDER
    inner join
           bonddb.TB_PORTFOLIO_TREE c
    on     
           a.stockholder=c.STOCKHOLDER
    and    c.ACCOUNT_PROP in ('1','2')
    inner join
           bonddb.TB_PORTFOLIO_TREE d
    on     
           b.stockholder=d.STOCKHOLDER
    and    d.ACCOUNT_PROP in ('1','2')
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP e
    on     
           a.stockholder=e.STOCKHOLDER
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP f
    on     
           b.stockholder=f.STOCKHOLDER
    left join
           app.VW_DICT g
    on     
           c.account_prop=g.K
    and    g.DICT_CODE='0004'
    left join
           app.VW_DICT h
    on     
           d.account_prop=h.K
    and    h.DICT_CODE='0004'
    where  a.busi_date=i_busi_date
    and    a.cp_id<>coalesce(e.INVEST_ADVISOR_ID,' ')
    and    b.cp_id<>coalesce(f.INVEST_ADVISOR_ID,' ')
    and    a.IF_MKT_MAKING<>'1'
    and    b.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('30','31')
    and    b.order_dir in ('30','31')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    b.STOCKHOLDER not like '%_as'
    and    b.STOCKHOLDER not like '%_AS'
    and    (c.ACCOUNT_PROP='2' or d.ACCOUNT_PROP='2');

    /*09:5个交易日内,通过相同的交易对手,自营与投顾,投顾与投顾之间远期买卖同一只债券,反向交易两笔相同数量的债券远期流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='09';
    insert into BONDDB.TB_RESULT_2022
    (
           BUSI_DATE_A,
           ORDER_DIR_A,
           ORDER_DIR_NAME_A,
           STOCKHOLDER_A,
           STOCKHOLDER_NAME_A,
           CP_ID_A,
           CP_NAME_A,
           ORDER_SERIAL_NO_A,
           BOND_CODE,
           BOND_NAME,
           MATCH_QTY,
           BUSI_DATE_B,
           ORDER_DIR_B,
           ORDER_DIR_NAME_B,
           STOCKHOLDER_B,
           STOCKHOLDER_NAME_B,
           CP_ID_B,
           CP_NAME_B,
           ORDER_SERIAL_NO_B,
           WATCH_TYPE,
           MARKET_CODE,
           MATCH_AMOUNT
    )
    select 
           a.BUSI_DATE as BUSI_DATE_A,
           a.ORDER_DIR as ORDER_DIR_A,
           a.order_dir_name as ORDER_DIR_NAME_A,
           a.STOCKHOLDER as STOCKHOLDER_A,
           A.STOCKHOLDER_NAME as STOCKHOLDER_NAME_A,
           a.CP_ID as CP_ID_A,
           a.cp_name as CP_NAME_A,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO_A,
           a.bond_code as BOND_CODE,
           a.bond_name as BOND_NAME,
           a.match_qty as MATCH_QTY,
           b.BUSI_DATE as BUSI_DATE_B,
           b.ORDER_DIR as ORDER_DIR_B,
           b.order_dir_name as ORDER_DIR_NAME_B,
           b.STOCKHOLDER as STOCKHOLDER_B,
           b.STOCKHOLDER_NAME as STOCKHOLDER_NAME_B,
           b.CP_ID as CP_ID_B,
           b.cp_name as CP_NAME_B,
           b.ORDER_SERIAL_NO as ORDER_SERIAL_NO_B,
           '远期'||g.V||'与'||h.V||v_type2_watch_days||'日内相同对手' as WATCH_TYPE,
           a.MARKET_CODE as MARKET_CODE,
           a.MATCH_AMOUNT as MATCH_AMOUNT
    from   
           BONDDB.TB_BOND_FORWARD a
    inner join
           bonddb.TB_BOND_FORWARD b
    on     
           b.busi_date between v_type2_begin_date and i_busi_date
    and    a.order_dir<>b.ORDER_DIR 
    and    a.CP_ID=b.CP_ID
    and    a.MARKET_CODE=b.MARKET_CODE
    and    a.BOND_CODE=b.BOND_CODE
    and    a.match_qty=b.MATCH_QTY
    and    a.STOCKHOLDER<>b.STOCKHOLDER
    inner join
           bonddb.TB_PORTFOLIO_TREE c
    on     
           a.stockholder=c.STOCKHOLDER
    and    c.ACCOUNT_PROP in ('1','2')
    inner join
           bonddb.TB_PORTFOLIO_TREE d
    on     
           b.stockholder=d.STOCKHOLDER
    and    d.ACCOUNT_PROP in ('1','2')
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP e
    on     
           a.stockholder=e.STOCKHOLDER
    left join
           bonddb.TB_PORTFOLIO_OTHER_PROP f
    on     
           b.stockholder=f.STOCKHOLDER
    left join
           app.VW_DICT g
    on     
           c.account_prop=g.K
    and    g.DICT_CODE='0004'
    left join
           app.VW_DICT h
    on     
           d.account_prop=h.K
    and    h.DICT_CODE='0004'
    where  a.busi_date=i_busi_date
    and    a.cp_id<>coalesce(e.INVEST_ADVISOR_ID,' ')
    and    b.cp_id<>coalesce(f.INVEST_ADVISOR_ID,' ')
    and    a.IF_MKT_MAKING<>'1'
    and    b.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('30','31')
    and    b.order_dir in ('30','31')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    b.STOCKHOLDER not like '%_as'
    and    b.STOCKHOLDER not like '%_AS'
    and    (c.ACCOUNT_PROP='2' or d.ACCOUNT_PROP='2');

    /*10:*/o_return_msg:='10';
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
       o_return_msg  := 'BONDDB.PR_TASK_2022执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



create OR REPLACE  view BONDDB.vw_2036 as 
    select a.BUSI_DATE,
           a.MARKET_CODE,
           a.bond_code,
           a.bond_name,
           sum(a.HOLDING_AMOUNT) as HOLDING_AMOUNT,
           coalesce(b.ISSUE_AMOUNT_REMAIN,c.issue_amount) as ISSUE_AMOUNT_REMAIN,
           case when coalesce(b.ISSUE_AMOUNT_REMAIN,c.issue_amount)=0 then null 
                else sum(a.HOLDING_AMOUNT)/coalesce(b.ISSUE_AMOUNT_REMAIN,c.issue_amount) 
           end as HOLDING_RATE
    from   bonddb.tb_bond_holding a
    left join 
           bonddb.vw_bond_issue_amount b
    on     a.market_code=b.market_code
    and    a.bond_code=b.bond_code
    and    a.busi_date>b.begin_date
    and    a.busi_date<=b.end_date
    left join 
           bonddb.TB_BOND_INFO c 
    on     a.market_code=c.MARKET_CODE
    and    a.bond_code=c.BOND_CODE
    group by a.BUSI_DATE,
           a.MARKET_CODE,
           a.bond_code,
           a.bond_name,
           coalesce(b.ISSUE_AMOUNT_REMAIN,c.issue_amount);
COMMENT ON VIEW BONDDB.VW_2036 is '债券监控-持仓集中度视图';
COMMENT ON COLUMN BONDDB.VW_2036.BOND_CODE is '';
COMMENT ON COLUMN BONDDB.VW_2036.BOND_NAME is '';
COMMENT ON COLUMN BONDDB.VW_2036.BUSI_DATE is '';
COMMENT ON COLUMN BONDDB.VW_2036.HOLDING_AMOUNT is '';
COMMENT ON COLUMN BONDDB.VW_2036.HOLDING_RATE is '';
COMMENT ON COLUMN BONDDB.VW_2036.ISSUE_AMOUNT_REMAIN is '';
COMMENT ON COLUMN BONDDB.VW_2036.MARKET_CODE is '';


