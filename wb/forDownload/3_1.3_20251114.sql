
alter table BONDDB.TB_BOND_DEAL modify ORDER_SERIAL_NO VARCHAR2(50);



alter table BONDDB.TB_BOND_FORWARD modify ORDER_SERIAL_NO VARCHAR2(50);



alter table BONDDB.TB_BOND_LENDING modify ORDER_SERIAL_NO VARCHAR2(50);



alter table BONDDB.TB_BOND_LENDING_COLLATERAL modify ORDER_SERIAL_NO VARCHAR2(50);



alter table BONDDB.TB_REPO modify ORDER_SERIAL_NO VARCHAR2(50);


alter table BONDDB.TB_REPO_BM_RATE modify constraint PK_TB_REPO_BM_RATE to primary key (BUSI_DATE,MARKET_CODE,REPO_CODE,DATA_SOURCE) ;



alter table BONDDB.TB_REPO_PLEDGE_BOND modify ORDER_SERIAL_NO VARCHAR2(50);


drop table BONDDB.TB_RESULT_2022;
CREATE TABLE "BONDDB"."TB_RESULT_2022"
(
"BUSI_DATE_A" CHAR(8) NOT NULL,
"ORDER_DIR_A" CHAR(2),
"ORDER_DIR_NAME_A" VARCHAR2(40),
"STOCKHOLDER_A" VARCHAR2(60),
"STOCKHOLDER_NAME_A" VARCHAR2(150),
"CP_ID_A" VARCHAR2(30),
"CP_NAME_A" VARCHAR2(200),
"ORDER_SERIAL_NO_A" VARCHAR2(20) NOT NULL,
"MARKET_CODE" CHAR(1),
"BOND_CODE" VARCHAR2(30),
"BOND_NAME" VARCHAR2(100),
"MATCH_QTY" DECIMAL(19,0),
"MATCH_AMOUNT" DECIMAL(19,4),
"BUSI_DATE_B" CHAR(8) NOT NULL,
"ORDER_DIR_B" CHAR(2),
"ORDER_DIR_NAME_B" VARCHAR2(40),
"STOCKHOLDER_B" VARCHAR2(60),
"STOCKHOLDER_NAME_B" VARCHAR2(150),
"CP_ID_B" VARCHAR2(30),
"CP_NAME_B" VARCHAR2(200),
"ORDER_SERIAL_NO_B" VARCHAR2(20) NOT NULL,
"WATCH_TYPE" VARCHAR2(40),
"ID" INT IDENTITY(1, 1) NOT NULL,
CONSTRAINT "PK_BONDDB_TB_RESULT_2022" NOT CLUSTER PRIMARY KEY("ORDER_SERIAL_NO_A", "ORDER_SERIAL_NO_B") USING INDEX TABLESPACE "TS_FLHG_USER" ) STORAGE(ON "MAIN", CLUSTERBTR) ;
COMMENT ON TABLE BONDDB.TB_RESULT_2022 is '间接交易监控结果表';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.BOND_CODE is '债券代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.BOND_NAME is '债券名称';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.BUSI_DATE_A is '交易日期-A账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.BUSI_DATE_B is '交易日期-B账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.CP_ID_A is '对手方ID-A账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.CP_ID_B is '对手方ID-B账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.CP_NAME_A is '对手方名称-A账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.CP_NAME_B is '对手方名称-B账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.ID is '';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.MARKET_CODE is '市场代码';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.MATCH_AMOUNT is '成交金额';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.MATCH_QTY is '成交数量';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.ORDER_DIR_A is '交易方向代码-A账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.ORDER_DIR_B is '交易方向代码-B账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.ORDER_DIR_NAME_A is '交易方向-A账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.ORDER_DIR_NAME_B is '交易方向-B账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.ORDER_SERIAL_NO_A is '交易流水号-A账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.ORDER_SERIAL_NO_B is '交易流水号-B账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.STOCKHOLDER_A is '证券账户-A账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.STOCKHOLDER_B is '证券账户-B账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.STOCKHOLDER_NAME_A is '证券账户名称-A账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.STOCKHOLDER_NAME_B is '证券账户名称-B账户';
COMMENT ON COLUMN BONDDB.TB_RESULT_2022.WATCH_TYPE is '监控类别';


drop table BONDDB.TMP_REPO_CODE;
CREATE GLOBAL TEMPORARY TABLE "BONDDB"."TMP_REPO_CODE"
(
"DAYS_MINUS" DOUBLE,
"TRADEDATE" CHAR(8),
"DATA_SOURCE" VARCHAR2(4),
"SOURCE_REPO_CODE" VARCHAR2(9),
"REPO_CODE" VARCHAR2(6),
"MARKET_CODE" VARCHAR2(1),
"REPO_TYPE" VARCHAR2(14),
"REPO_NAME" VARCHAR2(26),
"REPO_TERM" VARCHAR2(5),
"MIN_DAYS" INTEGER,
"MAX_DAYS" INTEGER)
ON COMMIT DELETE ROWS STORAGE(ON TEMP);
COMMENT ON TABLE BONDDB.TMP_REPO_CODE is '回购品种临时表';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.DATA_SOURCE is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.DAYS_MINUS is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.MARKET_CODE is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.MAX_DAYS is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.MIN_DAYS is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.REPO_CODE is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.REPO_NAME is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.REPO_TERM is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.REPO_TYPE is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.SOURCE_REPO_CODE is '';
COMMENT ON COLUMN BONDDB.TMP_REPO_CODE.TRADEDATE is '';


CREATE OR REPLACE  view BONDDB.VW_REPO_CODE as
select 'WIND' as DATA_SOURCE,'204001.SH' as SOURCE_REPO_CODE,'204001' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC001' as REPO_NAME, '1日'   as REPO_TERM,1 as min_days,1 as max_days union all
select 'WIND' as DATA_SOURCE,'204002.SH' as SOURCE_REPO_CODE,'204002' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC002' as REPO_NAME, '2日'   as REPO_TERM,2 as min_days,2 as max_days union all
select 'WIND' as DATA_SOURCE,'204003.SH' as SOURCE_REPO_CODE,'204003' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC003' as REPO_NAME, '3日'   as REPO_TERM,3 as min_days,3 as max_days union all
select 'WIND' as DATA_SOURCE,'204004.SH' as SOURCE_REPO_CODE,'204004' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC004' as REPO_NAME, '4日'   as REPO_TERM,4 as min_days,4 as max_days union all
select 'WIND' as DATA_SOURCE,'204007.SH' as SOURCE_REPO_CODE,'204007' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC007' as REPO_NAME, '7日'   as REPO_TERM,5 as min_days,7 as max_days union all
select 'WIND' as DATA_SOURCE,'204014.SH' as SOURCE_REPO_CODE,'204014' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC014' as REPO_NAME, '14日'  as REPO_TERM,8 as min_days,14 as max_days union all
select 'WIND' as DATA_SOURCE,'204028.SH' as SOURCE_REPO_CODE,'204028' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC028' as REPO_NAME, '28日'  as REPO_TERM,15 as min_days,28 as max_days union all
select 'WIND' as DATA_SOURCE,'204091.SH' as SOURCE_REPO_CODE,'204091' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC091' as REPO_NAME, '91日'  as REPO_TERM,29 as min_days,91 as max_days union all
select 'WIND' as DATA_SOURCE,'204182.SH' as SOURCE_REPO_CODE,'204182' as REPO_CODE, '1' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'上交所固收平台质押式-GC182' as REPO_NAME, '182日' as REPO_TERM,92 as min_days,192 as max_days union all
select 'WIND' as DATA_SOURCE,'206001.SH' as SOURCE_REPO_CODE,'206001' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R001'  as REPO_NAME, '1日'   as REPO_TERM,1 as min_days,1 as max_days union all
select 'WIND' as DATA_SOURCE,'206007.SH' as SOURCE_REPO_CODE,'206007' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R007'  as REPO_NAME, '7日'   as REPO_TERM,2 as min_days,7 as max_days union all
select 'WIND' as DATA_SOURCE,'206014.SH' as SOURCE_REPO_CODE,'206014' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R014'  as REPO_NAME, '14日'  as REPO_TERM,8 as min_days,14 as max_days union all
select 'WIND' as DATA_SOURCE,'206021.SH' as SOURCE_REPO_CODE,'206021' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R021'  as REPO_NAME, '21日'  as REPO_TERM,15 as min_days,21 as max_days union all
select 'WIND' as DATA_SOURCE,'206030.SH' as SOURCE_REPO_CODE,'206030' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R1M'   as REPO_NAME, '30日'  as REPO_TERM,22 as min_days,30 as max_days union all
select 'WIND' as DATA_SOURCE,'206090.SH' as SOURCE_REPO_CODE,'206090' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R3M'   as REPO_NAME, '90日'  as REPO_TERM,31 as min_days,90 as max_days union all
select 'WIND' as DATA_SOURCE,'206180.SH' as SOURCE_REPO_CODE,'206180' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R6M'   as REPO_NAME, '180日' as REPO_TERM,91 as min_days,180 as max_days union all
select 'WIND' as DATA_SOURCE,'206270.SH' as SOURCE_REPO_CODE,'206270' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R9M'   as REPO_NAME, '270日' as REPO_TERM,181 as min_days,270 as max_days union all
select 'WIND' as DATA_SOURCE,'206365.SH' as SOURCE_REPO_CODE,'206365' as REPO_CODE, '1' as MARKET_CODE,'质押式协议回购' as REPO_TYPE,'上交所固收平台质押式-R1Y'   as REPO_NAME, '365日' as REPO_TERM,271 as min_days,375 as max_days union all
select 'WIND' as DATA_SOURCE,'OR001.IB'  as SOURCE_REPO_CODE,'OR001'  as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR001'         as REPO_NAME, '1日'   as REPO_TERM,1 as min_days,1 as max_days union all
select 'WIND' as DATA_SOURCE,'OR007.IB'  as SOURCE_REPO_CODE,'OR007'  as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR007'         as REPO_NAME, '7日'   as REPO_TERM,2 as min_days,7 as max_days union all
select 'WIND' as DATA_SOURCE,'OR014.IB'  as SOURCE_REPO_CODE,'OR014'  as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR014'         as REPO_NAME, '14日'  as REPO_TERM,8 as min_days,14 as max_days union all
select 'WIND' as DATA_SOURCE,'OR021.IB'  as SOURCE_REPO_CODE,'OR021'  as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR021'         as REPO_NAME, '21日'  as REPO_TERM,15 as min_days,21 as max_days union all
select 'WIND' as DATA_SOURCE,'OR1M.IB'   as SOURCE_REPO_CODE,'OR1M'   as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR1M'          as REPO_NAME, '30日'  as REPO_TERM,22 as min_days,30 as max_days union all
select 'WIND' as DATA_SOURCE,'OR2M.IB'   as SOURCE_REPO_CODE,'OR2M'   as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR2M'          as REPO_NAME, '60日'  as REPO_TERM,31 as min_days,60 as max_days union all
select 'WIND' as DATA_SOURCE,'OR3M.IB'   as SOURCE_REPO_CODE,'OR3M'   as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR3M'          as REPO_NAME, '90日'  as REPO_TERM,61 as min_days,90 as max_days union all
select 'WIND' as DATA_SOURCE,'OR4M.IB'   as SOURCE_REPO_CODE,'OR4M'   as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR4M'          as REPO_NAME, '120日' as REPO_TERM,91 as min_days,120 as max_days union all
select 'WIND' as DATA_SOURCE,'OR6M.IB'   as SOURCE_REPO_CODE,'OR6M'   as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR6M'          as REPO_NAME, '180日' as REPO_TERM,121 as min_days,180 as max_days union all
select 'WIND' as DATA_SOURCE,'OR9M.IB'   as SOURCE_REPO_CODE,'OR9M'   as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR9M'          as REPO_NAME, '270日' as REPO_TERM,181 as min_days,270 as max_days union all
select 'WIND' as DATA_SOURCE,'OR1Y.IB'   as SOURCE_REPO_CODE,'OR1Y'   as REPO_CODE, '4' as MARKET_CODE,'买断式回购'     as REPO_TYPE,'银行间买断式-OR1Y'          as REPO_NAME, '365日' as REPO_TERM,271 as min_days,365 as max_days union all
select 'WIND' as DATA_SOURCE,'131810.SZ' as SOURCE_REPO_CODE,'131810' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-001'   as REPO_NAME, '1日'   as REPO_TERM,1 as min_days,1 as max_days union all
select 'WIND' as DATA_SOURCE,'131811.SZ' as SOURCE_REPO_CODE,'131811' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-002'   as REPO_NAME, '2日'   as REPO_TERM,2 as min_days,2 as max_days union all
select 'WIND' as DATA_SOURCE,'131800.SZ' as SOURCE_REPO_CODE,'131800' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-003'   as REPO_NAME, '3日'   as REPO_TERM,3 as min_days,3 as max_days union all
select 'WIND' as DATA_SOURCE,'131809.SZ' as SOURCE_REPO_CODE,'131809' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-004'   as REPO_NAME, '4日'   as REPO_TERM,4 as min_days,4 as max_days union all
select 'WIND' as DATA_SOURCE,'131801.SZ' as SOURCE_REPO_CODE,'131801' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-007'   as REPO_NAME, '7日'   as REPO_TERM,5 as min_days,7 as max_days union all
select 'WIND' as DATA_SOURCE,'131802.SZ' as SOURCE_REPO_CODE,'131802' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-014'   as REPO_NAME, '14日'  as REPO_TERM,8 as min_days,14 as max_days union all
select 'WIND' as DATA_SOURCE,'131803.SZ' as SOURCE_REPO_CODE,'131803' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-028'   as REPO_NAME, '28日'  as REPO_TERM,15 as min_days,28 as max_days union all
select 'WIND' as DATA_SOURCE,'131804.SZ' as SOURCE_REPO_CODE,'131804' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-063'   as REPO_NAME, '63日'  as REPO_TERM,29 as min_days,63 as max_days union all
select 'WIND' as DATA_SOURCE,'131805.SZ' as SOURCE_REPO_CODE,'131805' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-091'   as REPO_NAME, '91日'  as REPO_TERM,64 as min_days,91 as max_days union all
select 'WIND' as DATA_SOURCE,'131806.SZ' as SOURCE_REPO_CODE,'131806' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-182'   as REPO_NAME, '182日' as REPO_TERM,92 as min_days,182 as max_days union all
select 'WIND' as DATA_SOURCE,'131807.SZ' as SOURCE_REPO_CODE,'131807' as REPO_CODE, '2' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'深交所综合协议平台-R-273'   as REPO_NAME, '273日' as REPO_TERM,183 as min_days,283 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R001'     as SOURCE_REPO_CODE, 'R001'  as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R001'          as REPO_NAME, '1日'   as REPO_TERM, 1 as min_days, 1 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R007'     as SOURCE_REPO_CODE, 'R007'  as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R007'          as REPO_NAME, '7日'   as REPO_TERM, 2 as min_days, 7 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R014'     as SOURCE_REPO_CODE, 'R014'  as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R014'          as REPO_NAME, '14日'  as REPO_TERM, 8 as min_days, 14 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R021'     as SOURCE_REPO_CODE, 'R021'  as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R021'          as REPO_NAME, '21日'  as REPO_TERM, 15 as min_days, 21 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R1M'      as SOURCE_REPO_CODE, 'R1M'   as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R1M'           as REPO_NAME, '30日'  as REPO_TERM, 22 as min_days, 30 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R2M'      as SOURCE_REPO_CODE, 'R2M'   as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R2M'           as REPO_NAME, '60日'  as REPO_TERM, 31 as min_days, 60 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R3M'      as SOURCE_REPO_CODE, 'R3M'   as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R3M'           as REPO_NAME, '90日'  as REPO_TERM, 61 as min_days, 90 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R4M'      as SOURCE_REPO_CODE, 'R4M'   as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R4M'           as REPO_NAME, '120日' as REPO_TERM, 91 as min_days, 120 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R6M'      as SOURCE_REPO_CODE, 'R6M'   as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R6M'           as REPO_NAME, '180日' as REPO_TERM, 121 as min_days, 180 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R9M'      as SOURCE_REPO_CODE, 'R9M'   as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R9M'           as REPO_NAME, '270日' as REPO_TERM, 181 as min_days, 270 as max_days union all
select 'XIR'  as DATA_SOURCE, 'R1Y'      as SOURCE_REPO_CODE, 'R1Y'   as REPO_CODE, '4' as MARKET_CODE,'质押式回购'     as REPO_TYPE,'银行间质押式-R1Y'           as REPO_NAME, '365日' as REPO_TERM, 271 as min_days, 375 as max_days ;
COMMENT ON VIEW BONDDB.VW_REPO_CODE is '债券回购代码视图';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.DATA_SOURCE is '';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.MARKET_CODE is '';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.MAX_DAYS is '';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.MIN_DAYS is '';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.REPO_CODE is '';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.REPO_NAME is '';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.REPO_TERM is '';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.REPO_TYPE is '';
COMMENT ON COLUMN BONDDB.VW_REPO_CODE.SOURCE_REPO_CODE is '';


CREATE OR REPLACE PROCEDURE BONDDB.PR_TASK_2022
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
    -- 功能名称: 债券交易监控-间接交易监控
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251112 11:16:59
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_type1_watch_days                   INT default 2;
    v_type1_begin_date                   CHAR(8) default app.get_n_tradedate_ib(i_busi_date,-1);
    v_type2_watch_days                   INT default 5;
    v_type2_begin_date                   CHAR(8) default app.get_n_tradedate_ib(i_busi_date,-4);
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



