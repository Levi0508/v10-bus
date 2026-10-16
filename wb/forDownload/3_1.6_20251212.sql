
alter table BONDDB.TB_BOND_DEAL add column APPROVED_TIME VARCHAR2(20);
comment on column BONDDB.TB_BOND_DEAL.APPROVED_TIME is '审批时间';



alter table BONDDB.TB_BOND_FORWARD add column APPROVED_TIME VARCHAR2(20);
comment on column BONDDB.TB_BOND_FORWARD.APPROVED_TIME is '审批时间';



alter table BONDDB.TB_BOND_LENDING add column APPROVED_TIME VARCHAR2(20);
comment on column BONDDB.TB_BOND_LENDING.APPROVED_TIME is '审批时间';



alter table BONDDB.TB_REPO add column APPROVED_TIME VARCHAR2(20);
comment on column BONDDB.TB_REPO.APPROVED_TIME is '审批时间';


--drop table BONDDB.TB_RESULT_2031;
CREATE TABLE "BONDDB"."TB_RESULT_2031"
(
"BUSI_DATE" CHAR(8),
"ORDER_DIR" CHAR(2),
"ORDER_DIR_NAME" VARCHAR2(40),
"MARKET_CODE" CHAR(1),
"BOND_CODE" VARCHAR2(30),
"BOND_NAME" VARCHAR2(100),
"STOCKHOLDER_PRE" VARCHAR2(60),
"STOCKHOLDER_NAME_PRE" VARCHAR2(150),
"MATCH_QTY_PRE" DECIMAL(19,0),
"MATCH_AMOUNT_PRE" DECIMAL(19,4),
"AVG_PRICE_PRE" DECIMAL(16,8),
"STOCKHOLDER_AFTER" VARCHAR2(60),
"STOCKHOLDER_NAME_AFTER" VARCHAR2(150),
"MATCH_QTY_AFTER" DECIMAL(19,0),
"MATCH_AMOUNT_AFTER" DECIMAL(19,4),
"AVG_PRICE_AFTER" DECIMAL(16,8),
"ORDER_SERIAL_NO" VARCHAR2(1000),
"PRICE_CHG_RATE" DECIMAL(16,8),
"MATCH_TIME_PRE" VARCHAR2(20),
"MATCH_TIME_AFTER" VARCHAR2(20)) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE BONDDB.TB_RESULT_2031 is '债券交易监控-自营投顾同向交易结果表';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.AVG_PRICE_AFTER is '平均价格-后交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.AVG_PRICE_PRE is '平均价格-先交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.BOND_CODE is '债券代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.BOND_NAME is '债券名称';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.BUSI_DATE is '业务日期';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.MARKET_CODE is '市场代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.MATCH_AMOUNT_AFTER is '成交金额-后交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.MATCH_AMOUNT_PRE is '成交金额-先交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.MATCH_QTY_AFTER is '成交数量-后交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.MATCH_QTY_PRE is '成交数量-先交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.MATCH_TIME_AFTER is '交易时间-后交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.MATCH_TIME_PRE is '交易时间-先交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.ORDER_DIR is '交易方向代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.ORDER_DIR_NAME is '交易方向';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.ORDER_SERIAL_NO is '交易流水号集合';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.PRICE_CHG_RATE is '价格变动比例';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.STOCKHOLDER_AFTER is '证券账户-后交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.STOCKHOLDER_NAME_AFTER is '证券账户名称-后交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.STOCKHOLDER_NAME_PRE is '证券账户名称-先交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2031.STOCKHOLDER_PRE is '证券账户-先交易';


--drop table BONDDB.TB_RESULT_2032;
CREATE TABLE "BONDDB"."TB_RESULT_2032"
(
"BUSI_DATE" CHAR(8),
"STOCKHOLDER" VARCHAR2(60),
"STOCKHOLDER_NAME" VARCHAR2(150),
"ORDER_DIR" CHAR(2),
"ORDER_DIR_NAME" VARCHAR2(40),
"MARKET_CODE" CHAR(1),
"BOND_CODE" VARCHAR2(30),
"BOND_NAME" VARCHAR2(100),
"ORDER_SERIAL_NO" VARCHAR2(50),
"MATCH_QTY" DECIMAL(19,0),
"MATCH_AMOUNT" DECIMAL(19,4),
"CP_ID" VARCHAR2(30),
"CP_NAME" VARCHAR2(200),
"ISSUER_NAME" VARCHAR2(100),
"RELATION" VARCHAR2(100)) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE BONDDB.TB_RESULT_2032 is '债券交易监控-疑似协助结构化发行现券交易';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.BOND_CODE is '债券代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.BOND_NAME is '债券名称';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.BUSI_DATE is '业务日期';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.CP_ID is '对手方ID';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.CP_NAME is '对手方名称';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.ISSUER_NAME is '发行方';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.MARKET_CODE is '市场代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.MATCH_AMOUNT is '成交金额';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.MATCH_QTY is '成交数量';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.ORDER_DIR is '交易方向代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.ORDER_DIR_NAME is '交易方向';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.ORDER_SERIAL_NO is '交易流水号';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.RELATION is '债券发行人与交易对手关系';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.STOCKHOLDER is '证券账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2032.STOCKHOLDER_NAME is '证券账户名称';


--drop table BONDDB.TB_TASK_FUNCTION_PARAMS;
CREATE TABLE "BONDDB"."TB_TASK_FUNCTION_PARAMS"
(
"FUNCTION_ID" INT NOT NULL,
"PARAM_SUMMARY" VARCHAR2(500),
"PARAM_NAME" VARCHAR2(50) NOT NULL,
"PARAM_VALUE" VARCHAR2(50),
CONSTRAINT "PK_BONDDB_TB_TASK_FUNCTION_PARAMS" NOT CLUSTER PRIMARY KEY("FUNCTION_ID", "PARAM_NAME")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE BONDDB.TB_TASK_FUNCTION_PARAMS is '债券交易监控-阀值参数表';
COMMENT ON COLUMN BONDDB.TB_TASK_FUNCTION_PARAMS.FUNCTION_ID is '功能号';
COMMENT ON COLUMN BONDDB.TB_TASK_FUNCTION_PARAMS.PARAM_NAME is '参数名';
COMMENT ON COLUMN BONDDB.TB_TASK_FUNCTION_PARAMS.PARAM_SUMMARY is '参数说明';
COMMENT ON COLUMN BONDDB.TB_TASK_FUNCTION_PARAMS.PARAM_VALUE is '参数值';


CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2025
(
    i_busi_date                          IN VARCHAR2 ,
    o_return_msg                         OUT VARCHAR2 ,
    o_return_code                        OUT NUMBER 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.2
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 债券交易监控-疑似过券
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251209 15:03:39
    -- 修改内容:1.2:
    -- 修改内容:阀值参数不再写死，改为读配置表
    -- 修改内容:1.1:
    -- 修改内容:补充买断式回购的监控逻辑
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0，新增疑似过券监控任务
    --==============================================================================
    v_match_qty_rate                     DECIMAL(10,4) ;
    v_repo_price_gap                     DECIMAL(10,4) ;
BEGIN
    /*01:取阀值参数*/o_return_msg:='01';
    select max(case when param_name='match_qty_rate' then param_value end),
           max(case when param_name='repo_price_gap' then param_value end)
    into   v_match_qty_rate,
           v_repo_price_gap
    from   bonddb.tb_task_function_params a 
    where  a.function_id=2025;

    /*02:*/o_return_msg:='02';
    delete from BONDDB.tb_result_2025 where busi_date=i_busi_date;

    /*03:现券交易疑似过券，同一标的，先买后卖，交易数量总量匹配*/o_return_msg:='03';
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
    and    abs(b.match_qty_sell-a.match_qty_buy)/ a.match_qty_buy <= v_match_qty_rate
    where  1=1;

    /*04:买断式回购疑似过券，相同标的，相同期限，相同金额，正逆利差超过阀值*/o_return_msg:='04';
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
    where  abs(a.match_price_buy-b.match_price_sell)>= v_repo_price_gap;

    /*05:更新关联标志*/o_return_msg:='05';
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

    /*06:*/o_return_msg:='06';
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



CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2026
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
    -- 功能名称: 债券交易监控-高买低卖
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251209 15:37:20
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0，债券交易监控-高买低卖
    --==============================================================================
    v_begin_date                         CHAR(8) ;--取前N个自然日的反向交易加权均价
    v_profit_lost                        DECIMAL(19,4) ;
BEGIN
    /*01:取阀值参数*/o_return_msg:='01';
    select to_char(to_date(i_busi_date,'YYYYMMDD')-1*max(case when a.param_name='watch_days' then param_value end),'YYYYMMDD'),
           max(case when a.param_name='profit_lost' then param_value end)
    into   v_begin_date,
           v_profit_lost
    from   bonddb.tb_task_function_params a 
    where  a.function_id=2026;

    /*02:*/o_return_msg:='02';
    delete from BONDDB.tb_result_2026 where busi_date=i_busi_date;

    /*03:*/o_return_msg:='03';
    insert into BONDDB.TB_RESULT_2026
    (
           BUSI_DATE,
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           CP_ID,
           CP_NAME,
           ORDER_DIR,
           ORDER_DIR_NAME,
           MARKET_CODE,
           BOND_CODE,
           BOND_NAME,
           ORDER_SERIAL_NO,
           MATCH_QTY,
           NET_PRICE,
           REVERSE_AVG_PRICE,
           PROFIT
    )
    select 
           a.busi_date as BUSI_DATE,
           a.STOCKHOLDER as STOCKHOLDER,
           a.STOCKHOLDER_NAME as STOCKHOLDER_NAME,
           coalesce(a.cp_id,a.cp_name) as CP_ID,
           a.CP_NAME as CP_NAME,
           a.ORDER_DIR as ORDER_DIR,
           a.ORDER_DIR_NAME as ORDER_DIR_NAME,
           a.MARKET_CODE as MARKET_CODE,
           a.BOND_CODE as BOND_CODE,
           a.BOND_NAME as BOND_NAME,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO,
           a.match_qty as MATCH_QTY,
           a.NET_PRICE as NET_PRICE,
           b.avg_price as REVERSE_AVG_PRICE,
           case when a.order_dir='01' then -1 else 1 end*(a.net_price-b.avg_price)*a.match_qty as PROFIT
    from   
           BONDDB.TB_BOND_DEAL a
    inner join
           (
           select a.stockholder,
                  a.market_code,
                  a.bond_code,
                  a.order_dir,
                  coalesce(a.cp_id,a.cp_name) as cp_id,
                  sum(a.match_qty*a.net_price)/sum(a.match_qty) as avg_price
           from   bonddb.tb_bond_deal a 
           where  a.IF_MKT_MAKING<>'1'
           and    a.order_dir in ('01','02')
           and    a.STOCKHOLDER not like '%_as'
           and    a.STOCKHOLDER not like '%_AS'
           and    a.cp_id<>'-1'
           and    a.busi_date between v_begin_date and i_busi_date
           and    a.busi_date<>i_busi_date
           group by a.stockholder,
                  a.market_code,
                  a.bond_code,
                  a.order_dir,
                  coalesce(a.cp_id,a.cp_name)
           ) b
    on     
           a.stockholder=b.stockholder
    and    a.market_code=b.market_code
    and    a.bond_code=b.bond_code
    and    coalesce(a.cp_id,a.cp_name)=b.cp_id
    and    a.order_dir<>b.order_dir
    where  a.BUSI_DATE=i_busi_date
    and    a.IF_MKT_MAKING<>'1'
    and    a.order_dir in ('01','02')
    and    a.STOCKHOLDER not like '%_as'
    and    a.STOCKHOLDER not like '%_AS'
    and    a.cp_id<>'-1'
    and    case when a.order_dir='01' then -1 else 1 end*(a.net_price-b.avg_price)*a.match_qty<=-1*v_profit_lost
    ;

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
       o_return_msg  := 'BONDDB.PR_TASK_2026执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2032
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
    -- 功能名称: 债券交易监控-疑似协助结构化发行现券交易
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251211 17:13:24
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0，一级分销卖出和二级现券交易卖出的交易对手为债券发行方或其关联方。
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.tb_result_2032 where busi_date=i_busi_date;

    /*02:*/o_return_msg:='02';
    insert into BONDDB.TB_RESULT_2032
    (
           BUSI_DATE,
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           ORDER_DIR,
           ORDER_DIR_NAME,
           MARKET_CODE,
           BOND_CODE,
           BOND_NAME,
           ORDER_SERIAL_NO,
           MATCH_QTY,
           MATCH_AMOUNT,
           CP_ID,
           CP_NAME,
           ISSUER_NAME,
           RELATION
    )
    select 
           a.BUSI_DATE as BUSI_DATE,
           a.STOCKHOLDER as STOCKHOLDER,
           a.STOCKHOLDER_NAME as STOCKHOLDER_NAME,
           a.ORDER_DIR as ORDER_DIR,
           a.ORDER_DIR_NAME as ORDER_DIR_NAME,
           a.MARKET_CODE as MARKET_CODE,
           a.BOND_CODE as BOND_CODE,
           a.BOND_NAME as BOND_NAME,
           a.ORDER_SERIAL_NO as ORDER_SERIAL_NO,
           a.MATCH_QTY as MATCH_QTY,
           a.MATCH_AMOUNT as MATCH_AMOUNT,
           a.CP_ID as CP_ID,
           a.CP_NAME as CP_NAME,
           b.ISSUER_NAME as ISSUER_NAME,
           case when a.CP_NAME=b.ISSUER_NAME then '交易对手为发行方' else '交易对手为发行关联方' end as RELATION
    from   
           bonddb.tb_bond_deal a
    inner join
           bonddb.tb_bond_info b
    on     
           a.market_code=b.market_code
    and    a.bond_code=b.bond_code
    and    b.source_bond_type not in ('储蓄国债','地方政府债','记账式国债','凭证式国债','政策性银行债')--取信用债
    where  a.busi_date=i_busi_date
    and    a.order_dir in ('02','13')--分销卖出或现券卖出
    and    exists(select 1 from bonddb.TB_COUNTERPARTY c 
                  where  b.issuer_name=c.CP_NAME
                  and    (a.cp_id=c.RELATED_CP_ID or a.cp_id=c.cp_id))
    ;

    /*03:*/o_return_msg:='03';
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
       o_return_msg  := 'BONDDB.PR_TASK_2032执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2022
(
    i_busi_date                          IN VARCHAR2 ,
    o_return_msg                         OUT VARCHAR2 ,
    o_return_code                        OUT NUMBER 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.2
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 债券交易监控-间接交易监控
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251209 11:06:17
    -- 修改内容:1.2:
    -- 修改内容:阀值参数不再写死，改为读配置表
    -- 修改内容:1.1:
    -- 修改内容:取交易日改为取一般证券交易日而非银行间市场交易日
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_type1_watch_days                   INT ;
    v_type1_begin_date                   CHAR(8) ;
    v_type2_watch_days                   INT ;
    v_type2_begin_date                   CHAR(8) ;
BEGIN
    /*01:取阀值参数*/o_return_msg:='01';
    select max(case when param_name='type1_watch_days' then param_value end),
           app.get_n_tradedate(i_busi_date,max(case when param_name='type1_watch_days' then -1*param_value end)+1),
           max(case when param_name='type2_watch_days' then param_value end),
           app.get_n_tradedate(i_busi_date,max(case when param_name='type2_watch_days' then -1*param_value end)+1)
    into   v_type1_watch_days,
           v_type1_begin_date,
           v_type2_watch_days,
           v_type2_begin_date
    from   bonddb.tb_task_function_params a 
    where  a.function_id=2022
    ;

    /*02:*/o_return_msg:='02';
    delete from BONDDB.tb_result_2022 where busi_date_a=i_busi_date;

    /*03:类型1,通过不同的交易对手,自营与投顾,投顾与投顾之间交易同一只债券,反向交易两笔相同数量的债券交易流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='03';
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

    /*04:类型2,通过相同的交易对手,自营与投顾,投顾与投顾之间交易同一只债券,反向交易两笔相同数量的债券交易流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='04';
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

    /*05:类型1,通过不同的交易对手,自营与投顾,投顾与投顾之间,正逆回购反向交易同一品种,两笔相同金额的回购交易流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='05';
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

    /*06:类型2,通过相同的交易对手,自营与投顾,投顾与投顾之间,正逆回购反向交易同一品种,两笔相同数量的回购交易流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='06';
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

    /*07:类型1,通过不同的交易对手,自营与投顾,投顾与投顾之间借入借出同一只债券,反向交易两笔相同数量的债券借贷流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='07';
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

    /*08:类型2,通过相同的交易对手,自营与投顾,投顾与投顾之间借入借出同一只债券,反向交易两笔相同数量的债券借贷流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='08';
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

    /*09:类型1,通过不同的交易对手,自营与投顾,投顾与投顾之间远期买卖同一只债券,反向交易两笔相同数量的债券远期流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='09';
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

    /*10:类型2,通过相同的交易对手,自营与投顾,投顾与投顾之间远期买卖同一只债券,反向交易两笔相同数量的债券远期流水,剔除交易账户与特定投顾,剔除做市账户,剔除AS或as结尾的账户*/o_return_msg:='10';
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
       o_return_msg  := 'BONDDB.PR_TASK_2022执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2031
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
    -- 功能名称: 债券交易监控-自营投顾同向交易
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251211 10:40:31
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0，同日内或间隔两个交易日内，就同一只非利率债，投顾账户与自营账户发生同向买入交易，先交易的买方在完成交易量的X%后后交易的买方完成交易量的Y%，计算双方的交易加权平均净价，差异超过1%。以上阈值可视数据量情况调整。
    --==============================================================================
    v_begin_date                         CHAR(8) ;
    v_rate_pre                           DECIMAL(10,4) ;--先买方交易量达到整体X%时确定交易时间
    v_rate_after                         DECIMAL(10,4) ;--后买方交易量达到整体Y%时确定交易时间
    v_price_chg_rate                     DECIMAL(10,4) ;--后买方与先买方加权均价拉升比例
BEGIN
    /*01:取阀值参数*/o_return_msg:='01';
    SELECT app.get_n_tradedate(i_busi_date,-1*max(case when a.param_name='watch_days' then a.param_value end)),
           max(case when a.param_name='rate_pre' then a.param_value end),
           max(case when a.param_name='rate_after' then a.param_value end),
           max(case when a.param_name='price_chg_rate' then a.param_value end)
    into   v_begin_date,
           v_rate_pre,
           v_rate_after,
           v_price_chg_rate
    from   bonddb.tb_task_function_params a 
    where  a.function_id=2031;

    /*02:*/o_return_msg:='02';
    delete from BONDDB.tb_result_2031 where busi_date=i_busi_date;

    /*03:*/o_return_msg:='03';
    insert into BONDDB.TB_RESULT_2031
    (
           BUSI_DATE,
           ORDER_DIR,
           ORDER_DIR_NAME,
           MARKET_CODE,
           BOND_CODE,
           BOND_NAME,
           STOCKHOLDER_PRE,
           STOCKHOLDER_NAME_PRE,
           MATCH_QTY_PRE,
           MATCH_AMOUNT_PRE,
           AVG_PRICE_PRE,
           STOCKHOLDER_AFTER,
           STOCKHOLDER_NAME_AFTER,
           MATCH_QTY_AFTER,
           MATCH_AMOUNT_AFTER,
           AVG_PRICE_AFTER,
           ORDER_SERIAL_NO,
           PRICE_CHG_RATE,
           MATCH_TIME_PRE,
           MATCH_TIME_AFTER
    )
    select 
           i_busi_date as BUSI_DATE,
           a.order_dir as ORDER_DIR,
           a.order_dir_name as ORDER_DIR_NAME,
           a.market_code as MARKET_CODE,
           a.bond_code as BOND_CODE,
           a.bond_name as BOND_NAME,
           a.stockholder as STOCKHOLDER_PRE,
           a.stockholder_name as STOCKHOLDER_NAME_PRE,
           a.total_match_qty as MATCH_QTY_PRE,
           a.total_match_amount as MATCH_AMOUNT_PRE,
           a.avg_price as AVG_PRICE_PRE,
           b.stockholder as STOCKHOLDER_AFTER,
           b.stockholder_name as STOCKHOLDER_NAME_AFTER,
           b.total_match_qty as MATCH_QTY_AFTER,
           b.total_match_amount as MATCH_AMOUNT_AFTER,
           b.avg_price as AVG_PRICE_AFTER,
           a.order_serial_no||','||b.order_serial_no as ORDER_SERIAL_NO,
           round(b.avg_price/a.avg_price-1,4) as PRICE_CHG_RATE,
           a.match_time_pre as MATCH_TIME_PRE,
           b.match_time_after as MATCH_TIME_AFTER
    from   
           (
            select a.stockholder,
                   a.stockholder_name,
                   a.order_dir,
                   a.order_dir_name,
                   a.market_code,
                   a.bond_code,
                   a.bond_name,
                   listagg(a.ORDER_SERIAL_NO,',') within group (order by a.ORDER_SERIAL_NO) as ORDER_SERIAL_NO,
                   a.ACCOUNT_PROP,
                   min(case when a.part_match_qty/a.total_match_qty>=v_rate_pre then a.match_time end) as match_time_pre,
                   a.TOTAL_MATCH_QTY,
                   a.TOTAL_MATCH_AMOUNT,
                   round(a.AVG_PRICE,4) as AVG_PRICE
            from   
                   (
                    select a.busi_date,
                           a.stockholder,
                           a.stockholder_name,
                           a.order_dir,
                           a.order_dir_name,
                           a.market_code,
                           a.bond_code,
                           a.bond_name,
                           a.ORDER_SERIAL_NO,
                           b.ACCOUNT_PROP,
                           case when b.ACCOUNT_PROP='1' then a.confirm_time else coalesce(a.approved_time,a.order_time) end as match_time,
                           sum(a.match_qty) over(partition by a.stockholder,a.market_code,a.bond_code) as total_match_qty,
                           sum(a.match_amount) over(partition by a.stockholder,a.market_code,a.bond_code) as total_match_amount,
                           sum(a.match_amount) over(partition by a.stockholder,a.market_code,a.bond_code)/sum(a.match_qty) over(partition by a.stockholder,a.market_code,a.bond_code) as avg_price,
                           sum(a.match_qty) over(partition by a.stockholder,a.market_code,a.bond_code order by a.order_serial_no) as part_match_qty
                    from   
                           BONDDB.tb_bond_deal a
                    inner join 
                           BONDDB.TB_PORTFOLIO_TREE b 
                    on     a.STOCKHOLDER=b.STOCKHOLDER
                    inner join 
                           bonddb.tb_bond_info c
                    on     a.market_code=c.market_code
                    and    a.bond_code=c.bond_code
                    and    c.source_bond_type not in ('储蓄国债','地方政府债','记账式国债','凭证式国债','政策性银行债')
                    and    b.ACCOUNT_PROP in ('1','2')
                    where  a.IF_MKT_MAKING<>'1'
                    and    a.order_dir in ('01')
                    and    a.STOCKHOLDER not like '%_as'
                    and    a.STOCKHOLDER not like '%_AS'
                    and    a.cp_id<>'-1'
                    and    a.busi_date between v_begin_date and i_busi_date
                   ) a
            group by a.stockholder,
                   a.stockholder_name,
                   a.order_dir,
                   a.order_dir_name,
                   a.market_code,
                   a.bond_code,
                   a.bond_name,
                   a.ACCOUNT_PROP,
                   a.TOTAL_MATCH_QTY,
                   a.TOTAL_MATCH_AMOUNT,
                   a.AVG_PRICE
           ) a--先买方
    inner join
           (
            select a.stockholder,
                   a.stockholder_name,
                   a.order_dir,
                   a.order_dir_name,
                   a.market_code,
                   a.bond_code,
                   a.bond_name,
                   listagg(a.ORDER_SERIAL_NO,',') within group (order by a.ORDER_SERIAL_NO) as ORDER_SERIAL_NO,
                   a.ACCOUNT_PROP,
                   max(case when a.part_match_qty/a.total_match_qty<=v_rate_after then a.match_time end) as match_time_after,
                   a.TOTAL_MATCH_QTY,
                   a.TOTAL_MATCH_AMOUNT,
                   round(a.AVG_PRICE,4) as AVG_PRICE
            from   
                   (
                    select a.busi_date,
                           a.stockholder,
                           a.stockholder_name,
                           a.order_dir,
                           a.order_dir_name,
                           a.market_code,
                           a.bond_code,
                           a.bond_name,
                           a.ORDER_SERIAL_NO,
                           b.ACCOUNT_PROP,
                           case when b.ACCOUNT_PROP='1' then a.confirm_time else coalesce(a.approved_time,a.order_time) end as match_time,
                           sum(a.match_qty) over(partition by a.stockholder,a.market_code,a.bond_code) as total_match_qty,
                           sum(a.match_amount) over(partition by a.stockholder,a.market_code,a.bond_code) as total_match_amount,
                           sum(a.match_amount) over(partition by a.stockholder,a.market_code,a.bond_code)/sum(a.match_qty) over(partition by a.stockholder,a.market_code,a.bond_code) as avg_price,
                           sum(a.match_qty) over(partition by a.stockholder,a.market_code,a.bond_code order by a.order_serial_no) as part_match_qty
                    from   
                           BONDDB.tb_bond_deal a
                    inner join 
                           BONDDB.TB_PORTFOLIO_TREE b 
                    on     a.STOCKHOLDER=b.STOCKHOLDER
                    inner join 
                           bonddb.tb_bond_info c
                    on     a.market_code=c.market_code
                    and    a.bond_code=c.bond_code
                    and    c.source_bond_type not in ('储蓄国债','地方政府债','记账式国债','凭证式国债','政策性银行债')
                    and    b.ACCOUNT_PROP in ('1','2')
                    where  a.IF_MKT_MAKING<>'1'
                    and    a.order_dir in ('01')
                    and    a.STOCKHOLDER not like '%_as'
                    and    a.STOCKHOLDER not like '%_AS'
                    and    a.cp_id<>'-1'
                    and    a.busi_date between v_begin_date and i_busi_date
                   ) a
            group by a.stockholder,
                   a.stockholder_name,
                   a.order_dir,
                   a.order_dir_name,
                   a.market_code,
                   a.bond_code,
                   a.bond_name,
                   a.ACCOUNT_PROP,
                   a.TOTAL_MATCH_QTY,
                   a.TOTAL_MATCH_AMOUNT,
                   a.AVG_PRICE
            having max(a.busi_date)=i_busi_date--考虑当日交易导致的
           ) b--后买拉升方
    on     
           a.market_code=b.market_code
    and    a.bond_code=b.bond_code
    and    a.order_dir=b.order_dir
    and    a.ACCOUNT_PROP<>b.ACCOUNT_PROP
    and    b.avg_price>=a.avg_price*(1+v_price_chg_rate)--均价拉升比例超限
    and    b.match_time_after>=a.match_time_pre--整体拉升交易时间在后
    where  1=1;

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
       o_return_msg  := 'BONDDB.PR_TASK_2031执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



