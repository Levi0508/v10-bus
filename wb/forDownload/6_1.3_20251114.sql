
alter table APP.TB_DATA_ETL_LOG modify ERROR_STEP VARCHAR2(1000);
alter table APP.TB_DATA_ETL_LOG modify ERROR_STEP VARCHAR2(1000);
alter table APP.TB_DATA_ETL_LOG modify ERROR_STEP VARCHAR2(1000);
alter table APP.TB_DATA_ETL_LOG modify ERROR_STEP VARCHAR2(1000);


CREATE OR REPLACE FUNCTION APP.GET_N_TRADEDATE_IB
(
    i_tradedate                          IN VARCHAR2 ,
    i_count                              IN INT 
) RETURN VARCHAR2 IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 取银行间市场交易日函数
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251110 17:35:59
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_r                                  CHAR(8) ;
BEGIN
        /*01.01:条件:*/
    IF i_count>0 then

        /*01.02:*/
        SELECT TRADEDATE 
        into   v_r
        FROM   (SELECT TRADEDATE,row_number() over(order by TRADEDATE) AS RN 
                  FROM APP.TB_TRADEDATE 
                 WHERE TRADEDATE>i_tradedate 
                   AND TRADE_IB='1'
               ) a
        WHERE a.RN=i_count;

        /*01.03:条件：*/
    elsif i_count<0 THEN

        /*01.04:*/
        SELECT TRADEDATE 
        into   v_r
        FROM   (SELECT TRADEDATE,row_number() over(order by TRADEDATE desc) AS RN 
                  FROM APP.TB_TRADEDATE 
                 WHERE TRADEDATE<i_tradedate 
                   AND TRADE_IB='1'
               ) a
        WHERE a.RN=abs(i_count);

        /*01.05:*/
    else

        /*01.06:*/
        SELECT max(TRADEDATE)
        into   v_r
        from   APP.TB_TRADEDATE 
        WHERE  TRADEDATE<=i_tradedate 
        AND    TRADE_IB='1';

        /*01.99:条件分支01结束*/
    end if;

        /*02.01:条件:*/
    if v_r is null then

        /*02.02:*/
        v_r:=to_char(to_date(i_tradedate,'YYYYMMDD')+i_count,'YYYYMMDD');

        /*02.99:条件分支02结束*/
    end if;

    /*03:*/
    return v_r;


END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_002
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
    -- 功能名称: TIDM-债券交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251114 15:47:22
    -- 修改内容:1.1:
    -- 修改内容:增加交投数据集市的海益系统交易流水转换
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.TB_BOND_DEAL where DATA_SOURCE='TIDM' and BUSI_DATE=i_busi_date;

    /*02:衡泰的交易流水*/o_return_msg:='02';
    insert into BONDDB.TB_BOND_DEAL
    (
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           CAPITAL_ACCOUNT,
           ORDER_DIR,
           ORDER_DIR_NAME,
           ORDER_STATUS,
           BUSI_DATE,
           ORDER_TIME,
           CONFIRM_DATE,
           CONFIRM_TIME,
           MARKET_CODE,
           MATCH_QTY,
           SETT_DATE,
           MATCH_AMOUNT,
           MATCH_PRICE,
           NET_PRICE,
           FULL_PRICE,
           ORDER_SERIAL_NO,
           GRP_ID,
           IF_MKT_MAKING,
           TRADER,
           TRADER_CP,
           CP_ID,
           CP_NAME,
           IF_RELATED_CP,
           BOND_CODE,
           BOND_NAME,
           SETT_DAYS,
           CURRENCY,
           OPERATOR_NO,
           VALUATION_SHCH,
           VALUATION_CB,
           VALUATION_CSI,
           REMARK,
           BOND_YTM,
           STOCKHOLDER_CP,
           INTERNAL_ORDER_ID,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_MARKET_CODE,
           SOURCE_ORDER_DIR,
           SOURCE_ROW_ID,
           SOURCE_CURRENCY,
           SOURCE_ORDER_STATUS,
           SOURCE_BOND_CODE
    )
    select 
           a.PORTFOLIO_ID as STOCKHOLDER,
           b.PORTFOLIO_NAME as STOCKHOLDER_NAME,
           b.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,
           isnull(dm0002.DICT_KEY,'??') as ORDER_DIR,
           dm0002.SOURCE_VALUE as ORDER_DIR_NAME,
           isnull(dm0005.DICT_KEY,'?') as ORDER_STATUS,
           a.TRADE_DATE as BUSI_DATE,
           replace(a.TRADE_TIME,'-','') as ORDER_TIME,
           replace(left(a.CNFM_TIME,10),'-','') as CONFIRM_DATE,
           replace(a.CNFM_TIME,'-','') as CONFIRM_TIME,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           a.TRADE_QTY as MATCH_QTY,
           a.SETTLE_DATE as SETT_DATE,
           a.TRADE_AMT as MATCH_AMOUNT,
           a.TRADE_PRICE as MATCH_PRICE,
           a.TRADE_CP as NET_PRICE,
           a.TRADE_PRICE as FULL_PRICE,
           a.SOURCE_TYPE_TRADE_ID as ORDER_SERIAL_NO,
           a.TRADE_GRP_ID as GRP_ID,
           isnull(d.IF_MKT_MAKING,'0') as IF_MKT_MAKING,
           a.DELR as TRADER,
           a.OPP_DELR as TRADER_CP,
           a.CNTPTY_ID as CP_ID,
           c.CNTPTY_NAME as CP_NAME,
           '0' as IF_RELATED_CP,
           case when a.TRADE_TYPE in ('D_00_13','D_00_15','D_00_11','J_00_01','J_00_02') then a1.U_I_CODE else a.I_CODE end as BOND_CODE,
           case when a.TRADE_TYPE in ('D_00_13','D_00_15','D_00_11','J_00_01','J_00_02') then a2.B_NAME else a.I_NAME end as BOND_NAME,
           a.SETDAYS as SETT_DAYS,
           a.TRADE_CRRC as CURRENCY,
           a1.OPERATOR as OPERATOR_NO,
           a1.EVAL_NETPRICE_QSS as VALUATION_SHCH,
           isnull(a4.NETPRICE,a1.EVAL_NETPRICE_OE) as VALUATION_CB,
           isnull(a3.NETPRICE,a1.EVAL_NETPRICE_ZZ) as VALUATION_CSI,
           a.MEMO as REMARK,
           a.YTM as BOND_YTM,
           a.CNTPTY_PORTFOLIO_ID as STOCKHOLDER_CP,
           substr(a.SECU_TRADE_ID,5) as INTERNAL_ORDER_ID,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_EVT_SECU_MATCH' as SOURCE_TABLE,
           a.MKT_TYPE as SOURCE_MARKET_CODE,
           a.TRADE_TYPE as SOURCE_ORDER_DIR,
           a.rowid as SOURCE_ROW_ID,
           a.TRADE_CRRC as SOURCE_CURRENCY,
           a.TRADE_STATUS as SOURCE_ORDER_STATUS,
           a.I_CODE as SOURCE_BOND_CODE
    from   
           TIDM.TCL_EVT_SECU_MATCH a
    inner join
           XIR.TCL_VTTRD_OTC_TRADE_END a1
    on     
           a.SOURCE_TYPE_TRADE_ID=a1.SYSORDID
    left join
           XIR.TCL_TBND a2
    on     
           a1.U_I_CODE=a2.I_CODE
    and    a1.U_M_TYPE=a2.M_TYPE
    left join
           XIR.TCL_TZZ_BOND_EVAL a3
    on     
           a3.IMP_DATE=v_busi_date
    and    case when a.TRADE_TYPE in ('D_00_13','D_00_15','D_00_11','J_00_01','J_00_02') then a1.U_I_CODE else a.I_CODE end=a3.I_CODE
    and    a1.M_TYPE=a3.M_TYPE
    left join
           XIR.TCL_TCB_BOND_EVAL a4
    on     
           a4.IMP_DATE=v_busi_date
    and    case when a.TRADE_TYPE in ('D_00_13','D_00_15','D_00_11','J_00_01','J_00_02') then a1.U_I_CODE else a.I_CODE end=a4.I_CODE
    and    a1.M_TYPE=a4.M_TYPE
    inner join
           TIDM.TCL_AGT_PORTFOLIO b
    on     
           a.PORTFOLIO_ID =b.PORTFOLIO_ID
    left join
           TIDM.TCL_PTY_CNTPTY c
    on     
           a.CNTPTY_ID=c.CNTPTY_ID
    and    c.DATA_SOURCE='XIR'
    left join
           APP.TB_DICT_MAP dm0002
    on     
           a.TRADE_TYPE=dm0002.SOURCE_KEY
    and    dm0002.DATA_SOURCE='TIDM'
    and    dm0002.DICT_CODE='0002'
    left join
           APP.TB_DICT_MAP dm0005
    on     
           a.TRADE_STATUS=dm0005.SOURCE_KEY
    and    dm0005.DATA_SOURCE='TIDM'
    and    dm0005.DICT_CODE='0005'
    left join
           APP.TB_DICT_MAP dm0001
    on     
           a.MKT_TYPE=dm0001.SOURCE_KEY
    and    dm0001.DATA_SOURCE='TIDM'
    and    dm0001.DICT_CODE='0001'
    left join
           BONDDB.TB_PORTFOLIO_OTHER_PROP d
    on     
           a.PORTFOLIO_ID=d.STOCKHOLDER
    and    d.DATA_SOURCE='XIR'
    where  a.DATA_SOURCE='XIR'
    and    a.CNTPTY_ID<>'0'
    and    a.TRADE_TYPE in ('D_00_01','D_00_02','D_00_13','D_00_15','D_00_11','C_00_01','C_00_02')--债券买卖，债券分销，承销注册，集合投资工具买卖
    and    a.TRADE_DATE=i_busi_date
    ;

    /*03:海益的投顾账户交易流水*/o_return_msg:='03';
    insert into BONDDB.TB_BOND_DEAL
    (
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           CAPITAL_ACCOUNT,
           ORDER_DIR,
           ORDER_DIR_NAME,
           ORDER_STATUS,
           BUSI_DATE,
           ORDER_TIME,
           CONFIRM_DATE,
           CONFIRM_TIME,
           MARKET_CODE,
           MATCH_QTY,
           SETT_DATE,
           MATCH_AMOUNT,
           MATCH_PRICE,
           NET_PRICE,
           FULL_PRICE,
           ORDER_SERIAL_NO,
           GRP_ID,
           IF_MKT_MAKING,
           TRADER,
           TRADER_CP,
           CP_ID,
           CP_NAME,
           IF_RELATED_CP,
           BOND_CODE,
           BOND_NAME,
           SETT_DAYS,
           CURRENCY,
           OPERATOR_NO,
           VALUATION_SHCH,
           VALUATION_CB,
           VALUATION_CSI,
           REMARK,
           BOND_YTM,
           STOCKHOLDER_CP,
           INTERNAL_ORDER_ID,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_MARKET_CODE,
           SOURCE_ORDER_DIR,
           SOURCE_ROW_ID,
           SOURCE_CURRENCY,
           SOURCE_ORDER_STATUS,
           SOURCE_BOND_CODE
    )
    select 
           a.PORTFOLIO_ID as STOCKHOLDER,
           b.PORTFOLIO_NAME as STOCKHOLDER_NAME,
           b.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,--空值 
           isnull(dm0002.DICT_KEY,'??') as ORDER_DIR,
           dm0002.SOURCE_VALUE as ORDER_DIR_NAME,
           isnull(dm0005.DICT_KEY,'?') as ORDER_STATUS,
           a.TRADE_DATE as BUSI_DATE,
           replace(a.TRADE_TIME,'-','') as ORDER_TIME,
           '' as CONFIRM_DATE,
           '' as CONFIRM_TIME,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           case when a.trade_price<>0 then round(a.trade_amt/a.trade_price,0) end as MATCH_QTY,
           a.SETTLE_DATE as SETT_DATE,
           a.TRADE_AMT as MATCH_AMOUNT,
           a.TRADE_PRICE as MATCH_PRICE,
           a.TRADE_CP as NET_PRICE,
           a.TRADE_PRICE as FULL_PRICE,
           a.SOURCE_TYPE_TRADE_ID as ORDER_SERIAL_NO,
           a.TRADE_GRP_ID as GRP_ID,
           isnull(d.IF_MKT_MAKING,'0') as IF_MKT_MAKING,
           a.DELR as TRADER,
           a.OPP_DELR as TRADER_CP,
           a.CNTPTY_ID as CP_ID,
           a.cntpty_tmp as CP_NAME,
           '0' as IF_RELATED_CP,
           a.I_CODE as BOND_CODE,
           a.I_NAME as BOND_NAME,
           a.SETDAYS as SETT_DAYS,
           a.TRADE_CRRC as CURRENCY,
           a.DELR as OPERATOR_NO,
           null as VALUATION_SHCH,
           a4.NETPRICE as VALUATION_CB,
           a3.NETPRICE as VALUATION_CSI,
           a.MEMO as REMARK,
           a.YTM as BOND_YTM,
           a.CNTPTY_PORTFOLIO_ID as STOCKHOLDER_CP,
           substr(a.SECU_TRADE_ID,5) as INTERNAL_ORDER_ID,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_EVT_SECU_MATCH' as SOURCE_TABLE,
           a.MKT_TYPE as SOURCE_MARKET_CODE,
           a.TRADE_TYPE as SOURCE_ORDER_DIR,
           a.rowid as SOURCE_ROW_ID,
           a.TRADE_CRRC as SOURCE_CURRENCY,
           a.TRADE_STATUS as SOURCE_ORDER_STATUS,
           a.I_CODE as SOURCE_BOND_CODE
    from   
           TIDM.TCL_EVT_SECU_MATCH a
    left join
           XIR.TCL_TZZ_BOND_EVAL a3
    on     
           a3.IMP_DATE=v_busi_date
    and    a.I_CODE=a3.I_CODE
    and    a.MKT_TYPE=a3.M_TYPE
    left join
           XIR.TCL_TCB_BOND_EVAL a4
    on     
           a4.IMP_DATE=v_busi_date
    and    a.I_CODE=a4.I_CODE
    and    a.MKT_TYPE=a4.M_TYPE
    inner join
           TIDM.TCL_AGT_PORTFOLIO b
    on     
           a.PORTFOLIO_ID =b.PORTFOLIO_ID
    left join
           BONDDB.TB_PORTFOLIO_OTHER_PROP d
    on     
           a.PORTFOLIO_ID=d.STOCKHOLDER
    and    d.DATA_SOURCE='HIT'
    left join
           APP.TB_DICT_MAP dm0001
    on     
           a.MKT_TYPE=dm0001.SOURCE_KEY
    and    dm0001.DATA_SOURCE='TIDM'
    and    dm0001.DICT_CODE='0001'
    left join
           APP.TB_DICT_MAP dm0002
    on     
           a.TRADE_TYPE=dm0002.SOURCE_KEY
    and    dm0002.DATA_SOURCE='TIDM'
    and    dm0002.DICT_CODE='0002'
    left join
           APP.TB_DICT_MAP dm0005
    on     
           a.TRADE_STATUS=dm0005.SOURCE_KEY
    and    dm0005.DATA_SOURCE='TIDM'
    and    dm0005.DICT_CODE='0005'
    where  a.TRADE_TYPE in ('D_00_01','D_00_02','D_00_13','D_00_14','D_00_15','D_00_16','D_00_11','C_00_01','C_00_02')--债券买卖，债券分销，承销注册，集合投资工具买卖
    and    a.DATA_SOURCE='HIT'
    and    a.TRADE_DATE=i_busi_date;

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
       o_return_msg  := 'APP.PR_DATA_ETL_TIDM_002执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_004
(
    i_busi_date                          IN VARCHAR2 ,
    o_return_msg                         OUT VARCHAR2 ,
    o_return_code                        OUT NUMBER 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.3
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: TIDM-债券回购交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251112 17:41:43
    -- 修改内容:1.3:
    -- 修改内容:严格按照自然日期限确定回购品种，不做到期日顺延修正
    -- 修改内容:1.2:
    -- 修改内容:回购品种人工填写存在错误，以实际到期天数+市场匹配品种，上海市场还需增加204开头或206开头匹配，银行间还需要匹配买断式和质押式,还需要考虑到期日是顺延非交易日的问题
    -- 修改内容:1.1:
    -- 修改内容:回购期限改为取实际期限
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*03:*/o_return_msg:='03';
    delete from BONDDB.TB_REPO where DATA_SOURCE='TIDM' and BUSI_DATE=i_busi_date;

    /*04:*/o_return_msg:='04';
    insert into BONDDB.TB_REPO
    (
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           CAPITAL_ACCOUNT,
           ORDER_DIR,
           ORDER_DIR_NAME,
           ORDER_STATUS,
           BUSI_DATE,
           ORDER_TIME,
           CONFIRM_DATE,
           CONFIRM_TIME,
           MARKET_CODE,
           REPO_CODE,
           REPO_NAME,
           TERM,
           MATCH_AMOUNT,
           MATCH_PRICE,
           ORDER_SERIAL_NO,
           GRP_ID,
           IF_MKT_MAKING,
           MATURITY_DATE,
           MATURITY_SETT_AMOUNT,
           TRADER,
           TRADER_CP,
           CP_ID,
           CP_NAME,
           IF_RELATED_CP,
           SETT_DAYS,
           CURRENCY,
           OPERATOR_NO,
           REMARK,
           STOCKHOLDER_CP,
           INTERNAL_ORDER_ID,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID,
           SOURCE_ORDER_DIR,
           SOURCE_ORDER_STATUS,
           SOURCE_MARKET_CODE,
           SOURCE_CURRENCY,
           OUTRIGHT_BOND_CODE
    )
    select 
           a.PORTFOLIO_ID as STOCKHOLDER,
           b.PORTFOLIO_NAME as STOCKHOLDER_NAME,
           b.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,
           isnull(dm0002.DICT_KEY,'??') as ORDER_DIR,
           dm0002.SOURCE_VALUE as ORDER_DIR_NAME,
           isnull(dm0005.DICT_KEY,'?') as ORDER_STATUS,
           a.TRADE_DATE as BUSI_DATE,
           replace(a.TRADE_TIME,'-','') as ORDER_TIME,
           replace(left(a.CNFM_TIME,10),'-','') as CONFIRM_DATE,
           replace(a.CNFM_TIME,'-','') as CONFIRM_TIME,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           isnull(e.repo_code,a.trade_catg) as REPO_CODE,
           isnull(e.REPO_NAME,a.I_NAME) as REPO_NAME,
           cast(to_date(replace(a1.ENDSETDATE,'-',''),'YYYYMMDD')-to_date(a.TRADE_DATE,'YYYYMMDD') as int)||'日' as TERM,
           a.TRADE_AMT as MATCH_AMOUNT,
           case when a.TRADE_TYPE in ('L_03_01','L_03_04') then a2.RATE else a.TRADE_PRICE end as MATCH_PRICE,
           a.SOURCE_TYPE_TRADE_ID as ORDER_SERIAL_NO,
           a.TRADE_GRP_ID as GRP_ID,
           isnull(d.IF_MKT_MAKING,'0') as IF_MKT_MAKING,
           replace(a1.ENDSETDATE,'-','') as MATURITY_DATE,
           a1.ENDAMOUNT as MATURITY_SETT_AMOUNT,
           a.DELR as TRADER,
           a.OPP_DELR as TRADER_CP,
           a.CNTPTY_ID as CP_ID,
           c.CNTPTY_ABBR as CP_NAME,
           '0' as IF_RELATED_CP,
           a.SETDAYS as SETT_DAYS,
           a.TRADE_CRRC as CURRENCY,
           a1.OPERATOR as OPERATOR_NO,
           a.MEMO as REMARK,
           a.CNTPTY_PORTFOLIO_ID as STOCKHOLDER_CP,
           substr(a.SECU_TRADE_ID,5) as INTERNAL_ORDER_ID,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_EVT_SECU_MATCH' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID,
           a.TRADE_TYPE as SOURCE_ORDER_DIR,
           a.TRADE_STATUS as SOURCE_ORDER_STATUS,
           a.MKT_TYPE as SOURCE_MARKET_CODE,
           a.TRADE_CRRC as SOURCE_CURRENCY,
           case when a.TRADE_TYPE in ('L_03_01','L_03_04') then a1.U_I_CODE end as OUTRIGHT_BOND_CODE
    from   
           TIDM.TCL_EVT_SECU_MATCH a
    inner join
           XIR.TCL_VTTRD_OTC_TRADE_END a1
    on     
           a.SOURCE_TYPE_TRADE_ID=a1.SYSORDID 
    and    a1.ENDSETDATE>v_busi_date
    left join
           XIR.TCL_TTRD_OTC_OUTRIGHT a2--取买断式回购交易价格
    on     
           a1.I_CODE=a2.I_CODE
    inner join
           TIDM.TCL_AGT_PORTFOLIO b
    on     
           a.PORTFOLIO_ID =b.PORTFOLIO_ID
    left join
           TIDM.TCL_PTY_CNTPTY c
    on     
           a.CNTPTY_ID=c.CNTPTY_ID
    and    c.DATA_SOURCE='XIR'
    left join
           APP.TB_DICT_MAP dm0002
    on     
           a.TRADE_TYPE=dm0002.SOURCE_KEY
    and    dm0002.DATA_SOURCE='TIDM'
    and    dm0002.DICT_CODE='0002'
    left join
           APP.TB_DICT_MAP dm0005
    on     
           a.TRADE_STATUS=dm0005.SOURCE_KEY
    and    dm0005.DATA_SOURCE='TIDM'
    and    dm0005.DICT_CODE='0005'
    left join
           APP.TB_DICT_MAP dm0001
    on     
           a.MKT_TYPE=dm0001.SOURCE_KEY
    and    dm0001.DATA_SOURCE='TIDM'
    and    dm0001.DICT_CODE='0001'
    left join
           BONDDB.TB_PORTFOLIO_OTHER_PROP d
    on     
           a.PORTFOLIO_ID=d.STOCKHOLDER
    and    d.DATA_SOURCE='XIR'
    left join
           BONDDB.VW_REPO_CODE e
    on     
           --按实际天数匹配+市场匹配回购品种，上海市场还需要区分204开头和206开头的品种，银行间还需要区分买断式和质押式
           to_date(replace(a1.ENDSETDATE,'-',''),'YYYYMMDD')-to_date(a.TRADE_DATE,'YYYYMMDD') between e.MIN_DAYS and e.MAX_DAYS
    and    dm0001.DICT_KEY=e.MARKET_CODE
    and    case when dm0001.DICT_KEY='1' and a.trade_catg like '206%' then '质押式协议回购'
                when a.TRADE_TYPE in ('L_03_01','L_03_04') then '买断式回购'
                else '质押式回购'
           end =e.repo_type
    where  a.SECU_TRADE_ID like 'XIR_%'
    and    a.CNTPTY_ID<>'0'
    and    a.TRADE_TYPE in ('L_02_01','L_02_04','L_03_01','L_03_04')--质押式正逆回购,买断式正逆回购
    and    a.TRADE_DATE=i_busi_date
    ;

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
       o_return_msg  := 'APP.PR_DATA_ETL_TIDM_004执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_WIND_001
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
    -- 功能名称: WIND-回购基准利率数据转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251114 13:19:40
    -- 修改内容:1.1:
    -- 修改内容:1上交所，深交所和银行间买断式回购：当对应的品种数据缺失时，就近取值，优先向下取（往更长期限取），没有取到后再向上取（往更短期限取）
    -- 修改内容:2.新增银行间质押式回购加权行情价作为外汇中心数据的补充。
    -- 修改内容:
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.TB_REPO_BM_RATE where DATA_SOURCE='WIND' and BUSI_DATE=i_busi_date;

    /*02:就近取基准利率,优先向下取（往更长期限取），没有取到后再向上取（往更短期限取）*/o_return_msg:='02';
    insert into BONDDB.TB_REPO_BM_RATE
    (
           BUSI_DATE,
           MARKET_CODE,
           REPO_CODE,
           REPO_NAME,
           TERM,
           MODEL_NAME,
           REPO_BM_RATE,
           REPO_BM_RATE_REVERSE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_REPO_CODE,
           SOURCE_MARKET_CODE,
           SOURCE_ROW_ID
    )
    select 
           a.BUSI_DATE as BUSI_DATE,
           a.MARKET_CODE as MARKET_CODE,
           a.REPO_CODE as REPO_CODE,
           a.REPO_NAME as REPO_NAME,
           a.TERM as TERM,
           a.MODEL_NAME as MODEL_NAME,
           a.REPO_BM_RATE as REPO_BM_RATE,
           a.REPO_BM_RATE_REVERSE as REPO_BM_RATE_REVERSE,
           a.DATA_SOURCE as DATA_SOURCE,
           a.SOURCE_TABLE as SOURCE_TABLE,
           a.SOURCE_REPO_CODE as SOURCE_REPO_CODE,
           a.SOURCE_MARKET_CODE as SOURCE_MARKET_CODE,
           a.SOURCE_ROW_ID as SOURCE_ROW_ID
    from   
           (
            select 
                   b.TRADE_DT as BUSI_DATE,
                   a.MARKET_CODE as MARKET_CODE,
                   a.REPO_CODE as REPO_CODE,
                   a.REPO_NAME as REPO_NAME,
                   a.REPO_TERM as TERM,
                   case when cast(replace(a.REPO_TERM,'日','') as int)=b.TERM then a.REPO_NAME 
                        when cast(replace(a.REPO_TERM,'日','') as int)<=b.TERM and cast(replace(a.REPO_TERM,'日','') as int)> b.LAST_TERM then '向下就近:'||b.REPO_NAME 
                        when cast(replace(a.REPO_TERM,'日','') as int)>=b.TERM and cast(replace(a.REPO_TERM,'日','') as int)< b.NEXT_TERM then '向上就近:'||b.REPO_NAME 
                   end as MODEL_NAME,
                   b.RATE as REPO_BM_RATE,
                   b.REVERSE_RATE as REPO_BM_RATE_REVERSE,
                   'WIND' as DATA_SOURCE,
                   'WIND.TCL_CBONDPRICESREPO' as SOURCE_TABLE,
                   a.SOURCE_REPO_CODE as SOURCE_REPO_CODE,
                   right(a.SOURCE_REPO_CODE,2) as SOURCE_MARKET_CODE,
                   b.rowid as SOURCE_ROW_ID,
                   row_number() over(partition by b.BUSI_DATE,a.MARKET_CODE,a.REPO_CODE 
                                order by case when cast(replace(a.REPO_TERM,'日','') as int)=b.TERM then '0' 
                                              when cast(replace(a.REPO_TERM,'日','') as int)<=b.TERM and cast(replace(a.REPO_TERM,'日','') as int)> b.LAST_TERM then '1.向下就近:'||b.REPO_NAME 
                                              when cast(replace(a.REPO_TERM,'日','') as int)>=b.TERM and cast(replace(a.REPO_TERM,'日','') as int)< b.NEXT_TERM then '2.向上就近:'||b.REPO_NAME 
                                         end) as rn
            from   
                   BONDDB.VW_REPO_CODE a
            inner join
                   (select a.rowid,
                           i_busi_date as BUSI_DATE,
                           a.TRADE_DT,
                           b.MARKET_CODE,
                           b.REPO_CODE,
                           b.REPO_NAME,
                           a.S_DQ_AVGPRICE as RATE,
                           a.S_DQ_AVGPRICE as REVERSE_RATE,
                           a.S_INFO_WINDCODE as SOURCE_REPO_CODE,
                           b.REPO_TYPE,
                           cast(replace(b.REPO_TERM,'日','') as int) as TERM,
                           lead(cast(replace(b.REPO_TERM,'日','') as int),1,0) over(partition by a.TRADE_DT,b.MARKET_CODE,b.REPO_TYPE order by cast(replace(b.REPO_TERM,'日','') as int) desc)  as LAST_TERM,
                           lead(cast(replace(b.REPO_TERM,'日','') as int),1,999) over(partition by a.TRADE_DT,b.MARKET_CODE,b.REPO_TYPE order by cast(replace(b.REPO_TERM,'日','') as int))  as NEXT_TERM
                    from   WIND.TCL_CBONDPRICESREPO a
                    inner join 
                           BONDDB.VW_REPO_CODE b
                    on     a.S_INFO_WINDCODE=b.SOURCE_REPO_CODE
                    and    b.DATA_SOURCE='WIND'
                    where  a.TRADE_DT=i_busi_date
                   ) b
            on     
                   a.MARKET_CODE=b.MARKET_CODE
            and    a.REPO_TYPE=b.REPO_TYPE
            and    ((cast(replace(a.REPO_TERM,'日','') as int)>=b.TERM and cast(replace(a.REPO_TERM,'日','') as int)< b.NEXT_TERM)--向上取近似值
                 or (cast(replace(a.REPO_TERM,'日','') as int)<=b.TERM and cast(replace(a.REPO_TERM,'日','') as int)> b.LAST_TERM)--向下取近似值
                   )
            where  a.DATA_SOURCE='WIND'
           ) a
    where  a.rn=1
    ;

    /*03:万得银行间回购行情加权价*/o_return_msg:='03';
    insert into BONDDB.TB_REPO_BM_RATE
    (
           BUSI_DATE,
           MARKET_CODE,
           REPO_CODE,
           REPO_NAME,
           TERM,
           MODEL_NAME,
           REPO_BM_RATE,
           REPO_BM_RATE_REVERSE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_REPO_CODE,
           SOURCE_MARKET_CODE,
           SOURCE_ROW_ID
    )
    select 
           a.f1_1343 as BUSI_DATE,
           b.MARKET_CODE as MARKET_CODE,
           b.repo_code as REPO_CODE,
           b.repo_name as REPO_NAME,
           b.repo_term as TERM,
           '万得银行间回购行情加权价-'||b.repo_code as MODEL_NAME,
           a.f7_1343 as REPO_BM_RATE,
           a.f7_1343 as REPO_BM_RATE_REVERSE,
           'WIND' as DATA_SOURCE,
           'WIND.TCL_TB_OBJECT_1343' as SOURCE_TABLE,
           a.f2_1343 as SOURCE_REPO_CODE,
           'IB' as SOURCE_MARKET_CODE,
           a.rowid as SOURCE_ROW_ID
    from   
           WIND.TCL_TB_OBJECT_1343 a
    inner join
           BONDDB.VW_REPO_CODE b
    on     
           a.f2_1343=b.REPO_CODE
    and    b.MARKET_CODE='4'
    where  a.f1_1343=i_busi_date
    and    a.f2_1343 like 'R%';

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
       o_return_msg  := 'APP.PR_DATA_ETL_WIND_001执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_XIR_005
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
    -- 功能名称: XIR-债券银行间回购基准利率表转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251114 15:25:50
    -- 修改内容:1.2:
    -- 修改内容:1.增加了手工补漏表，部分缺失数据手工导入存放在手工补漏表，转换时进行补漏
    -- 修改内容:2.对于缺失的品种优先取近一年内最近一天的该品种数据，如果仍然取不到，则再取当天接近品种（短期方向）的数据
    -- 修改内容:1.1:
    -- 修改内容:当对应的品种数据缺失时，就近取值，优先向下取（往更长期限取），没有取到后再向上取（往更短期限取）
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*01:从手工补漏表补上遗漏日期的数据*/o_return_msg:='01';
    insert into XIR.TCL_TRPT_MTR_C2_RATE
    (
           SUBJECT,
           M_TYPE,
           ITEM,
           RATE_1,
           AMOUNT_1,
           RATE_0,
           AMOUNT_0,
           LOADDATE,
           MODELNAME,
           ID,
           RATE_1_50BP,
           RATE_0_50BP,
           NET_AMOUNT,
           REST_AMOUNT_1,
           REST_AMOUNT_0
    )
    select 
           SUBJECT as SUBJECT,
           M_TYPE as M_TYPE,
           ITEM as ITEM,
           coalesce(a.RATE_1,0) as RATE_1,
           AMOUNT_1 as AMOUNT_1,
           coalesce(a.RATE_0,0) as RATE_0,
           AMOUNT_0 as AMOUNT_0,
           LOADDATE as LOADDATE,
           MODELNAME as MODELNAME,
           ID as ID,
           RATE_1_50BP as RATE_1_50BP,
           RATE_0_50BP as RATE_0_50BP,
           NET_AMOUNT as NET_AMOUNT,
           REST_AMOUNT_1 as REST_AMOUNT_1,
           REST_AMOUNT_0 as REST_AMOUNT_0
    from   
           XIR.TCL_TRPT_MTR_C2_RATE_TMP a
    where  a.LOADDATE=v_busi_date
    and    (coalesce(a.RATE_1,0) <>0 or coalesce(a.RATE_0,0)<>0)
    and    not exists(select 1 from XIR.TCL_TRPT_MTR_C2_RATE b 
                      where  b.LOADDATE=v_busi_date)
    ;

    /*02:*/o_return_msg:='02';
    delete from BONDDB.TB_REPO_BM_RATE where DATA_SOURCE='XIR' and BUSI_DATE=i_busi_date;

    /*03:对于缺失的品种优先取近一年内最近一天的该品种数据，如果仍然取不到，则再取当天接近品种（短期方向）的数据*/o_return_msg:='03';
    insert into BONDDB.TB_REPO_BM_RATE
    (
           BUSI_DATE,
           MARKET_CODE,
           REPO_CODE,
           REPO_NAME,
           TERM,
           MODEL_NAME,
           REPO_BM_RATE,
           REPO_BM_RATE_REVERSE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_REPO_CODE,
           SOURCE_MARKET_CODE,
           SOURCE_ROW_ID
    )
    select 
           b.busi_date as BUSI_DATE,
           a.MARKET_CODE as MARKET_CODE,
           a.REPO_CODE as REPO_CODE,
           a.REPO_NAME as REPO_NAME,
           a.REPO_TERM as TERM,
           case when a.repo_code=b.repo_code then b.MODELNAME else '近似品种:'||b.repo_code||','||b.MODELNAME end as MODEL_NAME,
           b.RATE as REPO_BM_RATE,
           b.REVERSE_RATE as REPO_BM_RATE_REVERSE,
           b.DATA_SOURCE as DATA_SOURCE,
           b.SOURCE_TABLE as SOURCE_TABLE,
           b.SOURCE_REPO_CODE as SOURCE_REPO_CODE,
           b.M_TYPE as SOURCE_MARKET_CODE,
           b.SOURCE_ROW_ID as SOURCE_ROW_ID
    from   
           BONDDB.VW_REPO_CODE a
    inner join
           (
             select a.busi_date,
                    a.MARKET_CODE,
                    a.REPO_CODE,
                    a.REPO_NAME,
                    a.REPO_TERM,
                    a.MODELNAME,
                    a.RATE,
                    a.REVERSE_RATE,
                    a.DATA_SOURCE,
                    a.SOURCE_TABLE,
                    a.SOURCE_REPO_CODE,
                    a.M_TYPE,
                    a.SOURCE_ROW_ID,
                    cast(replace(a.REPO_TERM,'日','') as int) as TERM,
                    lead(cast(replace(a.REPO_TERM,'日','') as int),1,999) over( order by a.max_days)  as NEXT_TERM,
                    a.repo_type
             from   (
                    select  i_busi_date as busi_date,
                            a.MARKET_CODE,
                            a.REPO_CODE,
                            a.REPO_NAME,
                            a.REPO_TERM,
                            case when BUSI_DATE<i_busi_date then '最近日期:'||BUSI_DATE||',' end||a.MODELNAME as MODELNAME,
                            a.RATE,
                            a.REVERSE_RATE,
                            'XIR' as DATA_SOURCE,
                            'XIR.TCL_TRPT_MTR_C2_RATE' as SOURCE_TABLE,
                            a.SOURCE_REPO_CODE,
                            a.M_TYPE,
                            a.SOURCE_ROW_ID,
                            a.max_days,
                            a.repo_type
                    from   (
                            select c.SOURCE_ROW_ID,
                                   replace(c.loaddate,'-','') as BUSI_DATE,
                                   b.MARKET_CODE,
                                   b.REPO_CODE,
                                   b.REPO_NAME,
                                   case when c.item is not null then '外汇中心(证券公司)-'||c.MODELNAME end as MODELNAME,
                                   c.RATE_1 as RATE,
                                   c.RATE_0 as REVERSE_RATE,
                                   c.ITEM as SOURCE_REPO_CODE,
                                   b.REPO_TYPE,
                                   c.M_TYPE,
                                   b.REPO_TERM,
                                   row_number() over(partition by b.REPO_CODE order by c.loaddate desc) as rn,
                                   b.max_days
                            from   BONDDB.VW_REPO_CODE b
                            left join 
                                   (
                                    select a.*,a.rowid as SOURCE_ROW_ID
                                    from   
                                           XIR.TCL_TRPT_MTR_C2_RATE a
                                    inner join 
                                           (select LOADDATE,
                                                   min(case when SUBJECT='证券公司' then ID end) as start_id,
                                                   min(case when SUBJECT='保险公司' then ID end) as end_id
                                            from   XIR.TCL_TRPT_MTR_C2_RATE 
                                            where  LOADDATE BETWEEN (to_number(substr(v_busi_date,1,4))-1)||substr(v_busi_date,5) and v_busi_date
                                            group by LOADDATE
                                           ) a1
                                    on     a.LOADDATE=a1.LOADDATE  
                                    and    a.ID>=a1.start_id
                                    and    a.ID< a1.end_id
                                    where  a.LOADDATE BETWEEN (to_number(substr(v_busi_date,1,4))-1)||substr(v_busi_date,5) and v_busi_date--取近一年内
                                    and    (a.RATE_1<>0 or a.rate_0<>0)
                                   ) c
                            on     c.item=b.SOURCE_REPO_CODE
                            where  b.DATA_SOURCE='XIR'
                            and    b.REPO_TYPE='质押式回购'
                            and    b.MARKET_CODE='4' 
                           ) a
                    where  a.rn=1--最近一天的品种基准利率
                    and    a.MODELNAME is not null
                    ) a
           ) b
    on     
           a.MARKET_CODE=b.MARKET_CODE
    and    a.REPO_type=b.REPO_type
    and    cast(replace(a.REPO_TERM,'日','') as int)>=b.TERM 
    and    cast(replace(a.REPO_TERM,'日','') as int)< b.NEXT_TERM--取短期接近的品种
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
       o_return_msg  := 'APP.PR_DATA_ETL_XIR_005执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



