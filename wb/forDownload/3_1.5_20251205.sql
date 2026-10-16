
alter table BONDDB.TB_BOND_DEAL modify NET_PRICE DECIMAL(20,12);


--drop table BONDDB.TB_RESULT_2026;
CREATE TABLE "BONDDB"."TB_RESULT_2026"
(
"BUSI_DATE" CHAR(8),
"STOCKHOLDER" VARCHAR2(60),
"STOCKHOLDER_NAME" VARCHAR2(150),
"CP_ID" VARCHAR2(30),
"CP_NAME" VARCHAR2(200),
"ORDER_DIR" CHAR(2),
"ORDER_DIR_NAME" VARCHAR2(40),
"MARKET_CODE" CHAR(1),
"BOND_CODE" VARCHAR2(30),
"BOND_NAME" VARCHAR2(100),
"ORDER_SERIAL_NO" VARCHAR2(50),
"MATCH_QTY" DECIMAL(19,0),
"NET_PRICE" DECIMAL(20,12),
"REVERSE_AVG_PRICE" DECIMAL(20,12),
"PROFIT" DECIMAL(19,4)) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE BONDDB.TB_RESULT_2026 is '债券交易监控-高买低卖结果表';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.BOND_CODE is '债券代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.BOND_NAME is '债券名称';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.BUSI_DATE is '业务日期';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.CP_ID is '对手方ID';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.CP_NAME is '对手方名称';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.MARKET_CODE is '市场代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.MATCH_QTY is '成交数量';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.NET_PRICE is '交易净价';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.ORDER_DIR is '交易方向代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.ORDER_DIR_NAME is '交易方向';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.ORDER_SERIAL_NO is '交易流水号';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.PROFIT is '损益';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.REVERSE_AVG_PRICE is '前期反向交易加权均价';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.STOCKHOLDER is '证券账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2026.STOCKHOLDER_NAME is '证券账户名称';



alter table BONDDB.TB_RESULT_2029 alter column ID rename to MARKET_CODE;
comment on column BONDDB.TB_RESULT_2029.MARKET_CODE is '市场代码';
alter table BONDDB.TB_RESULT_2029 modify MARKET_CODE CHAR(1);
alter table BONDDB.TB_RESULT_2029 modify MATCH_QTY DECIMAL(19,0);


CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2025
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
    -- 功能名称: 债券交易监控-疑似过券
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251202 09:05:03
    -- 修改内容:1.1:
    -- 修改内容:补充买断式回购的监控逻辑
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0，新增疑似过券监控任务
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.tb_result_2025 where busi_date=i_busi_date;

    /*02:现券交易疑似过券，同一标的，先买后卖，交易数量总量匹配*/o_return_msg:='02';
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

    /*03:买断式回购疑似过券，相同标的，相同期限，相同金额，正逆利差超过阀值*/o_return_msg:='03';
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
           MATCH_AMOUNT_BUY,
           MATCH_AMOUNT_SELL,
           PROFIT,
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
           a.repo_code as BOND_CODE,
           a.repo_name as BOND_NAME,
           a.order_serial_no_buy as ORDER_SERIAL_NO_BUY,
           b.order_serial_no_sell as ORDER_SERIAL_NO_SELL,
           a.MATCH_AMOUNT_BUY as MATCH_AMOUNT_BUY,
           b.MATCH_AMOUNT_SELL as MATCH_AMOUNT_SELL,
           a.maturity_sett_amount-b.maturity_sett_amount as PROFIT,
           a.market_code as MARKET_CODE
    from   
           (
            select a.busi_date,
                   a.stockholder,
                   a.stockholder_name,
                   coalesce(a.cp_id,a.cp_name) as cp_id_buy,
                   a.cp_name as cp_name_buy,
                   a.market_code,
                   a.repo_code,
                   a.repo_name,
                   a.match_amount as match_amount_buy,
                   a.match_price as match_price_buy,
                   a.order_serial_no as order_serial_no_buy,
                   a.maturity_sett_amount,
                   a.outright_bond_code
            from   bonddb.tb_repo a 
            where  a.busi_date=i_busi_date
            and    a.IF_MKT_MAKING<>'1'
            and    a.order_status='a'
            and    a.order_dir in ('28')
            and    a.STOCKHOLDER not like '%_as'
            and    a.STOCKHOLDER not like '%_AS'
            and    coalesce(a.cp_id,a.cp_name) is not null
           ) a
    inner join
           (
            select a.busi_date,
                   a.stockholder,
                   a.stockholder_name,
                   coalesce(a.cp_id,a.cp_name) as cp_id_sell,
                   a.cp_name as cp_name_sell,
                   a.market_code,
                   a.repo_code,
                   a.repo_name,
                   a.match_amount as match_amount_sell,
                   a.match_price as match_price_sell,
                   a.order_serial_no as order_serial_no_sell,
                   a.maturity_sett_amount,
                   a.outright_bond_code
            from   bonddb.tb_repo a 
            where  a.busi_date=i_busi_date
            and    a.IF_MKT_MAKING<>'1'
            and    a.order_status='a'
            and    a.order_dir in ('29')
            and    a.STOCKHOLDER not like '%_as'
            and    a.STOCKHOLDER not like '%_AS'
            and    coalesce(a.cp_id,a.cp_name) is not null
           ) b
    on     
           a.stockholder=b.stockholder
    and    a.market_code=b.market_code
    and    a.repo_code=b.repo_code
    and    a.outright_bond_code=b.outright_bond_code
    and    a.match_amount_buy=b.match_amount_sell
    and    a.cp_id_buy<>b.cp_id_sell
    where  abs(a.match_price_buy-b.match_price_sell)>= 0.01;

    /*04:更新关联标志*/o_return_msg:='04';
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

    /*05:*/o_return_msg:='05';
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



CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2029
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
    -- 功能名称: 债券交易监控-做市亏损
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251201 10:09:40
    -- 修改内容:1.0:
    -- 修改内容:达梦1.0
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.tb_result_2029 where busi_date=i_busi_date;

    /*02:先买后卖的亏损*/o_return_msg:='02';
    insert into BONDDB.TB_RESULT_2029
    (
           BUSI_DATE,
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           BOND_CODE,
           BOND_NAME,
           MATCH_QTY,
           MATCH_PRICE_BUY,
           MATCH_PRICE_SELL,
           MATCH_AMOUNT_BUY,
           MATCH_AMOUNT_SELL,
           PROFIT,
           ORDER_SERIAL_NO_BUY,
           ORDER_SERIAL_NO_SELL,
           MARKET_CODE
    )
    select 
           a.BUSI_DATE as BUSI_DATE,
           a.STOCKHOLDER as STOCKHOLDER,
           a.STOCKHOLDER_NAME as STOCKHOLDER_NAME,
           a.BOND_CODE as BOND_CODE,
           a.BOND_NAME as BOND_NAME,
           a.MATCH_QTY as MATCH_QTY,
           a.MATCH_PRICE_BUY as MATCH_PRICE_BUY,
           a.MATCH_PRICE_SELL as MATCH_PRICE_SELL,
           a.MATCH_AMOUNT_BUY as MATCH_AMOUNT_BUY,
           a.MATCH_AMOUNT_SELL as MATCH_AMOUNT_SELL,
           a.PROFIT as PROFIT,
           a.ORDER_SERIAL_NO_BUY as ORDER_SERIAL_NO_BUY,
           a.ORDER_SERIAL_NO_SELL as ORDER_SERIAL_NO_SELL,
           a.MARKET_CODE as MARKET_CODE
    from   
           (
            select a.BUSI_DATE,
                   a.STOCKHOLDER,
                   a.STOCKHOLDER_NAME,
                   a.market_code,
                   a.bond_code,
                   a.bond_name,
                   a.match_qty,
                   b.match_price as MATCH_PRICE_BUY,
                   a.match_price as MATCH_PRICE_SELL,
                   b.match_amount as MATCH_AMOUNT_BUY,
                   a.match_amount as MATCH_AMOUNT_SELL,
                   a.match_amount-b.match_amount as PROFIT,
                   b.order_serial_no as ORDER_SERIAL_NO_BUY,
                   a.order_serial_no as ORDER_SERIAL_NO_SELL,
                   ROW_NUMBER() over(partition by a.busi_date,a.order_serial_no order by b.order_serial_no desc) as rn
            from   
                   BONDDB.tb_bond_deal a
            inner join 
                   BONDDB.tb_bond_deal b
            on     b.busi_date=i_busi_date
            and    b.if_mkt_making='1'
            and    b.order_dir in ('01')
            and    a.order_dir<>b.order_dir
            and    a.stockholder=b.stockholder
            and    a.market_code=b.market_code
            and    a.bond_code=b.bond_code
            and    a.match_qty=b.match_qty
            and    a.order_serial_no>b.order_serial_no
            and    a.MATCH_AMOUNT<b.MATCH_AMOUNT
            where  a.busi_date=i_busi_date
            and    a.if_mkt_making='1'
            and    a.order_dir in ('02')
           ) a
    where  a.rn=1;

    /*03:先卖后买的亏损*/o_return_msg:='03';
    insert into BONDDB.TB_RESULT_2029
    (
           BUSI_DATE,
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           BOND_CODE,
           BOND_NAME,
           MATCH_QTY,
           MATCH_PRICE_BUY,
           MATCH_PRICE_SELL,
           MATCH_AMOUNT_BUY,
           MATCH_AMOUNT_SELL,
           PROFIT,
           ORDER_SERIAL_NO_BUY,
           ORDER_SERIAL_NO_SELL,
           MARKET_CODE
    )
    select 
           a.BUSI_DATE as BUSI_DATE,
           a.STOCKHOLDER as STOCKHOLDER,
           a.STOCKHOLDER_NAME as STOCKHOLDER_NAME,
           a.BOND_CODE as BOND_CODE,
           a.BOND_NAME as BOND_NAME,
           a.MATCH_QTY as MATCH_QTY,
           a.MATCH_PRICE_BUY as MATCH_PRICE_BUY,
           a.MATCH_PRICE_SELL as MATCH_PRICE_SELL,
           a.MATCH_AMOUNT_BUY as MATCH_AMOUNT_BUY,
           a.MATCH_AMOUNT_SELL as MATCH_AMOUNT_SELL,
           a.PROFIT as PROFIT,
           a.ORDER_SERIAL_NO_BUY as ORDER_SERIAL_NO_BUY,
           a.ORDER_SERIAL_NO_SELL as ORDER_SERIAL_NO_SELL,
           a.MARKET_CODE as MARKET_CODE
    from   
           (
            select a.BUSI_DATE,
                   a.STOCKHOLDER,
                   a.STOCKHOLDER_NAME,
                   a.market_code,
                   a.bond_code,
                   a.bond_name,
                   a.match_qty,
                   a.match_price as MATCH_PRICE_BUY,
                   b.match_price as MATCH_PRICE_SELL,
                   a.match_amount as MATCH_AMOUNT_BUY,
                   b.match_amount as MATCH_AMOUNT_SELL,
                   b.match_amount-a.match_amount as PROFIT,
                   a.order_serial_no as ORDER_SERIAL_NO_BUY,
                   b.order_serial_no as ORDER_SERIAL_NO_SELL,
                   ROW_NUMBER() over(partition by a.busi_date,a.order_serial_no order by b.order_serial_no desc) as rn
            from   
                   BONDDB.tb_bond_deal a
            inner join 
                   BONDDB.tb_bond_deal b
            on     b.busi_date=i_busi_date
            and    b.if_mkt_making='1'
            and    b.order_dir in ('02')
            and    a.order_dir<>b.order_dir
            and    a.stockholder=b.stockholder
            and    a.market_code=b.market_code
            and    a.bond_code=b.bond_code
            and    a.match_qty=b.match_qty
            and    a.order_serial_no>b.order_serial_no
            and    a.MATCH_AMOUNT>b.MATCH_AMOUNT
            where  a.busi_date=i_busi_date
            and    a.if_mkt_making='1'
            and    a.order_dir in ('01')
           ) a
    where  a.rn=1;

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
       o_return_msg  := 'BONDDB.PR_TASK_2029执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



