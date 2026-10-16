CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_002
(
    i_busi_date                          IN VARCHAR2 ,
    o_return_msg                         OUT VARCHAR2 ,
    o_return_code                        OUT NUMBER 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.4
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: TIDM-债券交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251210 15:38:34
    -- 修改内容:1.4:
    -- 修改内容:增加审批时间字段转换
    -- 修改内容:1.3:
    -- 修改内容:优化交易对手取数逻辑，交投数据集市海益的数据对手编号为空，现通过匹配对手名称找到衡泰的对手编号
    -- 修改内容:1.2:
    -- 修改内容:来自海益的数据存在净价不准确和缺失的问题，改为从债券估值表取利息价格通过全价减利息价格得到净价,
    -- 修改内容:日期字段从IMP_DATE改为BEG_DATE,利用索引提升效率
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
           SOURCE_BOND_CODE,
           APPROVED_TIME
    )
    select 
           a.PORTFOLIO_ID as STOCKHOLDER,
           b.PORTFOLIO_NAME as STOCKHOLDER_NAME,
           b.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,
           isnull(dm0002.DICT_KEY,'?') as ORDER_DIR,
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
           a.I_CODE as SOURCE_BOND_CODE,
           replace(a1.APPROVED_TIME,'-','') as APPROVED_TIME
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
           a3.BEG_DATE=v_busi_date
    and    case when a.TRADE_TYPE in ('D_00_13','D_00_15','D_00_11','J_00_01','J_00_02') then a1.U_I_CODE else a.I_CODE end=a3.I_CODE
    and    a1.M_TYPE=a3.M_TYPE
    left join
           XIR.TCL_TCB_BOND_EVAL a4
    on     
           a4.BEG_DATE=v_busi_date
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
           isnull(dm0002.DICT_KEY,'?') as ORDER_DIR,
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
           a.TRADE_PRICE-coalesce(a4.interday_ai,0) as NET_PRICE,
           a.TRADE_PRICE as FULL_PRICE,
           a.SOURCE_TYPE_TRADE_ID as ORDER_SERIAL_NO,
           a.TRADE_GRP_ID as GRP_ID,
           isnull(d.IF_MKT_MAKING,'0') as IF_MKT_MAKING,
           a.DELR as TRADER,
           a.OPP_DELR as TRADER_CP,
           e.PARTYID as CP_ID,
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
           a3.BEG_DATE=v_busi_date
    and    a.I_CODE=a3.I_CODE
    and    a.MKT_TYPE=a3.M_TYPE
    left join
           XIR.TCL_TCB_BOND_EVAL a4
    on     
           a4.BEG_DATE=v_busi_date
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
    left join
           (select a.*,row_number() over(partition by a.partyname_short order by case when a.creditcode is not null then 1 else 2 end) as rn
            from   xir.TCL_TTRD_OTC_COUNTERPARTY a
            where  a.partyname_short is not null
            and    a.party_status='1'
           ) e
    on     
           a.cntpty_tmp=e.partyname_short
    and    e.rn=1
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



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_003
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
    -- 功能名称: TIDM-债券远期交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251210 15:39:37
    -- 修改内容:1.2:
    -- 修改内容:增加审批时间字段转换
    -- 修改内容:1.1:
    -- 修改内容:日期字段从IMP_DATE改为BEG_DATE,利用索引提升效率
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.TB_BOND_FORWARD where DATA_SOURCE='TIDM' and BUSI_DATE=i_busi_date;

    /*02:*/o_return_msg:='02';
    insert into BONDDB.TB_BOND_FORWARD
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
           NOTIONAL_PRINCIPAL,
           FORWARD_PRICE,
           MATCH_AMOUNT,
           TERM,
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
           SOURCE_BOND_CODE,
           APPROVED_TIME
    )
    select 
           a.PORTFOLIO_ID as STOCKHOLDER,
           b.PORTFOLIO_NAME as STOCKHOLDER_NAME,
           b.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,
           isnull(dm0002.DICT_KEY,'?') as ORDER_DIR,
           dm0002.SOURCE_VALUE as ORDER_DIR_NAME,
           isnull(dm0005.DICT_KEY,'?') as ORDER_STATUS,
           a.TRADE_DATE as BUSI_DATE,
           replace(a.TRADE_TIME,'-','') as ORDER_TIME,
           replace(left(a.CNFM_TIME,10),'-','') as CONFIRM_DATE,
           replace(a.CNFM_TIME,'-','') as CONFIRM_TIME,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           a.TRADE_QTY as MATCH_QTY,
           replace(a1.ENDSETDATE,'-','') as SETT_DATE,
           a1.UBREAKCOUNT as NOTIONAL_PRINCIPAL,
           a.TRADE_PRICE as FORWARD_PRICE,
           a.TRADE_AMT as MATCH_AMOUNT,
           substr(a.I_NAME,1,instr(a.I_NAME,'日')) as TERM,
           a.SOURCE_TYPE_TRADE_ID as ORDER_SERIAL_NO,
           a.TRADE_GRP_ID as GRP_ID,
           isnull(d.IF_MKT_MAKING,'0') as IF_MKT_MAKING,
           a.DELR as TRADER,
           a.OPP_DELR as TRADER_CP,
           a.CNTPTY_ID as CP_ID,
           c.CNTPTY_ABBR as CP_NAME,
           '0' as IF_RELATED_CP,
           a1.U_I_CODE as BOND_CODE,
           a2.B_NAME as BOND_NAME,
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
           a.I_CODE as SOURCE_BOND_CODE,
           replace(a1.APPROVED_TIME,'-','') as APPROVED_TIME
    from   
           TIDM.TCL_EVT_SECU_MATCH a
    inner join
           XIR.TCL_VTTRD_OTC_TRADE_END a1
    on     
           a.SOURCE_TYPE_TRADE_ID=a1.SYSORDID
    inner join
           XIR.TCL_TBND a2
    on     
           a1.U_I_CODE=a2.I_CODE
    and    a1.U_M_TYPE=a2.M_TYPE
    left join
           XIR.TCL_TZZ_BOND_EVAL a3
    on     
           a3.BEG_DATE=v_busi_date
    and    a1.U_I_CODE=a3.I_CODE
    and    a1.M_TYPE=a3.M_TYPE
    left join
           XIR.TCL_TCB_BOND_EVAL a4
    on     
           a4.BEG_DATE=v_busi_date
    and    a1.U_I_CODE=a4.I_CODE
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
           app.TB_DICT_MAP dm0002
    on     
           a.TRADE_TYPE=dm0002.SOURCE_KEY
    and    dm0002.DATA_SOURCE='TIDM'
    and    dm0002.DICT_CODE='0002'
    left join
           app.TB_DICT_MAP dm0005
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
    and    a.TRADE_TYPE in ('J_00_01','J_00_02')
    and    a.TRADE_DATE=i_busi_date
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
       o_return_msg  := 'APP.PR_DATA_ETL_TIDM_003执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
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
    -- 版    本: 1.6
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: TIDM-债券回购交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251210 16:17:54
    -- 修改内容:1.6:
    -- 修改内容:增加审批时间字段转换
    -- 修改内容:1.5:
    -- 修改内容:优化交易对手取数逻辑，交投数据集市海益的数据对手编号为空，现通过匹配对手名称找到衡泰的对手编号
    -- 修改内容:1.4:
    -- 修改内容:增加交投数据集市的海益回购交易流水转换
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

    /*04:衡泰的交易流水*/o_return_msg:='04';
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
           OUTRIGHT_BOND_CODE,
           APPROVED_TIME
    )
    select 
           a.PORTFOLIO_ID as STOCKHOLDER,
           b.PORTFOLIO_NAME as STOCKHOLDER_NAME,
           b.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,
           isnull(dm0002.DICT_KEY,'?') as ORDER_DIR,
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
           a.I_CODE as INTERNAL_ORDER_ID,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_EVT_SECU_MATCH' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID,
           a.TRADE_TYPE as SOURCE_ORDER_DIR,
           a.TRADE_STATUS as SOURCE_ORDER_STATUS,
           a.MKT_TYPE as SOURCE_MARKET_CODE,
           a.TRADE_CRRC as SOURCE_CURRENCY,
           case when a.TRADE_TYPE in ('L_03_01','L_03_04') then a1.U_I_CODE end as OUTRIGHT_BOND_CODE,
           replace(a1.APPROVED_TIME,'-','') as APPROVED_TIME
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
    where  a.DATA_SOURCE='XIR'
    and    a.CNTPTY_ID<>'0'
    and    a.TRADE_TYPE in ('L_02_01','L_02_04','L_03_01','L_03_04')--质押式正逆回购,买断式正逆回购
    and    a.TRADE_DATE=i_busi_date
    ;

    /*05:海益的质押式回购交易流水*/o_return_msg:='05';
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
           b.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,--空值  
           isnull(dm0002.DICT_KEY,'?') as ORDER_DIR,
           dm0002.SOURCE_VALUE as ORDER_DIR_NAME,
           isnull(dm0005.DICT_KEY,'?') as ORDER_STATUS,
           a.TRADE_DATE as BUSI_DATE,
           replace(a.TRADE_TIME,'-','') as ORDER_TIME,
           '' as CONFIRM_DATE,
           '' as CONFIRM_TIME,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           isnull(e.repo_code,a.trade_catg) as REPO_CODE,
           isnull(e.REPO_NAME,a.I_NAME) as REPO_NAME,
           cast(to_date(a1.expare_settle_day,'YYYYMMDD')-to_date(a.TRADE_DATE,'YYYYMMDD') as int)||'日' as TERM,
           a.TRADE_AMT as MATCH_AMOUNT,
           a.TRADE_PRICE as MATCH_PRICE,
           a.SOURCE_TYPE_TRADE_ID as ORDER_SERIAL_NO,
           a.TRADE_GRP_ID as GRP_ID,
           isnull(d.IF_MKT_MAKING,'0') as IF_MKT_MAKING,
           a1.expare_settle_day as MATURITY_DATE,
           a1.expare_settle_amt as MATURITY_SETT_AMOUNT,
           a.DELR as TRADER,
           a.OPP_DELR as TRADER_CP,
           f.PARTYID as CP_ID,
           a.cntpty_tmp as CP_NAME,
           '0' as IF_RELATED_CP,
           a.SETDAYS as SETT_DAYS,
           a.TRADE_CRRC as CURRENCY,
           a.DELR as OPERATOR_NO,
           a.MEMO as REMARK,
           a.CNTPTY_PORTFOLIO_ID as STOCKHOLDER_CP,
           a.I_CODE as INTERNAL_ORDER_ID,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_EVT_SECU_MATCH' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID,
           a.TRADE_TYPE as SOURCE_ORDER_DIR,
           a.TRADE_STATUS as SOURCE_ORDER_STATUS,
           a.MKT_TYPE as SOURCE_MARKET_CODE,
           a.TRADE_CRRC as SOURCE_CURRENCY,
           null as OUTRIGHT_BOND_CODE
    from   
           TIDM.TCL_EVT_SECU_MATCH a
    left join
           TIDM.TCL_AGT_PLEDGE_REPO_CONTRACT a1
    on     
           a.I_CODE=a1.I_CODE
    and    a1.DATA_SOURCE='HIT'
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
           --按实际天数匹配+市场匹配回购品种，上海市场还需要区分204开头和206开头的品种
           to_date(a1.expare_settle_day,'YYYYMMDD')-to_date(a.TRADE_DATE,'YYYYMMDD') between e.MIN_DAYS and e.MAX_DAYS
    and    dm0001.DICT_KEY=e.MARKET_CODE
    and    case when dm0001.DICT_KEY='1' and a.trade_catg like '206%' then '质押式协议回购'
                else '质押式回购'
           end =e.repo_type
    left join
           (select a.*,row_number() over(partition by a.partyname_short order by case when a.creditcode is not null then 1 else 2 end) as rn
            from   xir.TCL_TTRD_OTC_COUNTERPARTY a
            where  a.partyname_short is not null
            and    a.party_status='1'
           ) f
    on     
           a.cntpty_tmp=f.partyname_short
    and    f.rn=1
    where  a.DATA_SOURCE ='HIT'
    and    a.TRADE_TYPE in ('L_02_01','L_02_04')--质押式正逆回购
    and    a.TRADE_DATE=i_busi_date
    ;

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
       o_return_msg  := 'APP.PR_DATA_ETL_TIDM_004执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_006
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
    -- 功能名称: TIDM-债券借贷交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251210 16:18:34
    -- 修改内容:1.2:
    -- 修改内容:增加审批时间字段转换
    -- 修改内容:1.1:
    -- 修改内容:日期字段从IMP_DATE改为BEG_DATE,利用索引提升效率
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.TB_BOND_LENDING where DATA_SOURCE='TIDM' and BUSI_DATE=i_busi_date;

    /*02:*/o_return_msg:='02';
    insert into BONDDB.TB_BOND_LENDING
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
           LENDING_PRICE,
           MATCH_AMOUNT,
           TERM,
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
           SOURCE_BOND_CODE,
           APPROVED_TIME
    )
    select 
           a.PORTFOLIO_ID as STOCKHOLDER,
           b.PORTFOLIO_NAME as STOCKHOLDER_NAME,
           b.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,
           isnull(dm0002.DICT_KEY,'?') as ORDER_DIR,
           dm0002.SOURCE_VALUE as ORDER_DIR_NAME,
           isnull(dm0005.DICT_KEY,'?') as ORDER_STATUS,
           a.TRADE_DATE as BUSI_DATE,
           replace(a.TRADE_TIME,'-','') as ORDER_TIME,
           replace(left(a.CNFM_TIME,10),'-','') as CONFIRM_DATE,
           replace(a.CNFM_TIME,'-','') as CONFIRM_TIME,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           a.TRADE_QTY as MATCH_QTY,
           replace(a1.ENDSETDATE,'-','') as SETT_DATE,
           a.TRADE_PRICE as LENDING_PRICE,
           a.TRADE_AMT as MATCH_AMOUNT,
           substr(a.I_NAME,1,instr(a.I_NAME,'日')) as TERM,
           a.SOURCE_TYPE_TRADE_ID as ORDER_SERIAL_NO,
           a.TRADE_GRP_ID as GRP_ID,
           isnull(d.IF_MKT_MAKING,'0') as IF_MKT_MAKING,
           a.DELR as TRADER,
           a.OPP_DELR as TRADER_CP,
           a.CNTPTY_ID as CP_ID,
           c.CNTPTY_ABBR as CP_NAME,
           '0' as IF_RELATED_CP,
           a1.U_I_CODE as BOND_CODE,
           a2.B_NAME as BOND_NAME,
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
           a.I_CODE as SOURCE_BOND_CODE,
           replace(a1.APPROVED_TIME,'-','') as APPROVED_TIME
    from   
           TIDM.TCL_EVT_SECU_MATCH a
    inner join
           XIR.TCL_VTTRD_OTC_TRADE_END a1
    on     
           a.SOURCE_TYPE_TRADE_ID=a1.SYSORDID
    inner join
           XIR.TCL_TBND a2
    on     
           a1.U_I_CODE=a2.I_CODE
    and    a1.U_M_TYPE=a2.M_TYPE
    left join
           XIR.TCL_TZZ_BOND_EVAL a3
    on     
           a3.BEG_DATE=v_busi_date
    and    a1.U_I_CODE=a3.I_CODE
    and    a1.M_TYPE=a3.M_TYPE
    left join
           XIR.TCL_TCB_BOND_EVAL a4
    on     
           a4.BEG_DATE=v_busi_date
    and    a1.U_I_CODE=a4.I_CODE
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
           app.TB_DICT_MAP dm0002
    on     
           a.TRADE_TYPE=dm0002.SOURCE_KEY
    and    dm0002.DATA_SOURCE='TIDM'
    and    dm0002.DICT_CODE='0002'
    left join
           app.TB_DICT_MAP dm0005
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
    and    a.TRADE_TYPE in ('L_04_01','L_04_02')
    and    a.TRADE_DATE=i_busi_date
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
       o_return_msg  := 'APP.PR_DATA_ETL_TIDM_006执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_XIR_009
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
    -- 功能名称: XIR-债券现券持仓表转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251210 11:06:42
    -- 修改内容:1.1:
    -- 修改内容:源表存在相同账户，相同债券多笔持仓，需要汇总处理
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0，新增债券现券持仓转换
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.TB_BOND_HOLDING where DATA_SOURCE='XIR' and BUSI_DATE=i_busi_date;

    /*02:*/o_return_msg:='02';
    insert into BONDDB.TB_BOND_HOLDING
    (
           BUSI_DATE,
           STOCKHOLDER,
           STOCKHOLDER_NAME,
           CAPITAL_ACCOUNT,
           MARKET_CODE,
           BOND_CODE,
           BOND_NAME,
           CURRENCY,
           QTY,
           COST,
           HOLDING_AMOUNT,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID,
           SOURCE_MARKET_CODE,
           SOURCE_BOND_CODE,
           SOURCE_CURRENCY,
           INTEREST,
           FACE_VALUE
    )
    select 
           BUSI_DATE as BUSI_DATE,
           SECU_ACCT_ID as STOCKHOLDER,
           b.ACCNAME as STOCKHOLDER_NAME,
           b.CASH_ACCID as CAPITAL_ACCOUNT,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           a.I_CODE as BOND_CODE,
           c.B_NAME as BOND_NAME,
           c.CURRENCY as CURRENCY,
           a.REAL_VOLUME as QTY,
           a.REAL_CP as COST,
           a.REAL_AMOUNT as HOLDING_AMOUNT,
           'XIR' as DATA_SOURCE,
           'XIR.TCL_TTRD_ACCOUNTING_SECU_OBJ_HIS' as SOURCE_TABLE,
           a.row_id as SOURCE_ROW_ID,
           a.M_TYPE as SOURCE_MARKET_CODE,
           a.I_CODE as SOURCE_BOND_CODE,
           c.CURRENCY as SOURCE_CURRENCY,
           a.AI as INTEREST,
           case when a.REAL_VOLUME=0 then null else a.REAL_AMOUNT/a.REAL_VOLUME end as FACE_VALUE
    from   
           (
            select a.busi_date,
                   a.SECU_ACCT_ID,
                   a.M_TYPE,
                   a.I_CODE,
                   sum(a.REAL_VOLUME) as REAL_VOLUME,
                   sum(a.REAL_CP) as REAL_CP,
                   sum(a.REAL_AMOUNT) as REAL_AMOUNT,
                   sum(a.AI) as AI,
                   listagg(a.rowid,',') within group(order by a.rowid) as row_id
            from   XIR.TCL_TTRD_ACCOUNTING_SECU_OBJ_HIS a
            where  a.BUSI_DATE=i_busi_date
            group by a.busi_date,
                   a.SECU_ACCT_ID,
                   a.M_TYPE,
                   a.I_CODE
           ) a
    inner join
           XIR.TCL_TTRD_ACC_SECU b
    on     
           a.SECU_ACCT_ID=b.ACCID
    left join
           XIR.TCL_TBND c
    on     
           a.M_TYPE=c.M_TYPE
    and    a.I_CODE=c.I_CODE
    left join
           APP.TB_DICT_MAP dm0001
    on     
           a.M_TYPE=dm0001.SOURCE_KEY
    and    dm0001.DATA_SOURCE='XIR'
    and    dm0001.DICT_CODE='0001'
    where  a.BUSI_DATE=i_busi_date;

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
       o_return_msg  := 'APP.PR_DATA_ETL_XIR_009执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_TABLE_ETL_Q
(
    i_begin_date                         IN VARCHAR2 ,
    i_end_date                           IN VARCHAR2 ,
    i_data_source                        IN VARCHAR2 ,
    i_target_table                       IN VARCHAR2 ,
    i_etl_status                         IN VARCHAR2 ,
    i_exec_date                          IN CHAR(8) ,
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
    -- 功能名称: 表数据转换记录查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251212 09:06:54
    -- 修改内容:1.3:
    -- 修改内容:增加按执行日期查询
    -- 修改内容:1.2:
    -- 修改内容:增加输出提示信息
    -- 修改内容:1.1:
    -- 修改内容:查询按执行时间倒序
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    open rt_cursor FOR
    SELECT a.BUSI_DATE,
           a.DATA_SOURCE,
           a.TARGET_TABLE,
           a.BEGIN_TIME,
           a.END_TIME,
           a.ETL_STATUS,
           a.EXEC_SQL,
           a.ETL_NO,
           a.EXEC_SEQ,
           b.etl_sp_name,
           a.error_step,
           a.WARNING_MESSAGE
    from   app.tb_data_etl_log a
    left join 
           app.tb_data_etl_table b
    on     a.DATA_SOURCE=b.DATA_SOURCE
    and    a.etl_no=b.etl_no
    where  a.BUSI_DATE between isnull(i_begin_date,'20200101') and isnull(i_end_date,'20991231')
    and    (a.DATA_SOURCE=i_data_source or i_data_source is null)
    and    (a.TARGET_TABLE=upper(i_target_table) or upper(i_target_table) is null)
    and    (a.ETL_STATUS =i_etl_status or i_etl_status is null)
    and    (to_char(a.BEGIN_TIME,'YYYYMMDD')=i_exec_date or i_exec_date is null)
    order by a.begin_time desc,a.end_time desc,a.exec_seq desc
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
       o_return_msg  := 'APP.PR_TABLE_ETL_Q执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_THJS_001
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
    -- 功能名称: THJS-投行限制观察清单转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251208 16:10:13
    -- 修改内容:1.2:
    -- 修改内容:无证券信息时增加非空处理
    -- 修改内容:1.1:
    -- 修改内容:优化一条记录中含多个证券以逗号分隔的情况，需要先拆成单独证券的多条记录后处理
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
BEGIN
    /*01:观察，限制，静默清单为全删全插*/o_return_msg:='01';
    delete from EQUITYDB.TB_STOCK_LIMIT where DATA_SOURCE='THJS' and LIMIT_TYPE in ('l','o','q','?') ;

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
                else '-' 
           end as MARKET_CODE,
           case when a.WINDCODE like '%.SH' or a.WINDCODE like '%.SZ' or a.WINDCODE like '%.BJ' or a.WINDCODE like '%.HK' or a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then substr(a.WINDCODE,1,instr(a.WINDCODE,'.')-1) else coalesce(a.WINDCODE,'-') end as STOCK_CODE,
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
                   REGEXP_SUBSTR(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, '[^,]+', 1, LEVEL) AS WINDCODE,
                   REGEXP_SUBSTR(STKNAME, '[^,]+', 1, LEVEL) AS STKNAME,
                   row_number() over(partition by a.PROJNAME,REGEXP_SUBSTR(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, '[^,]+', 1, LEVEL),a.RL_FILL_TIME order by a.CL_FILL_TIME desc) as rn
            from   THJS.TCL_HGPT_PROJLIST_QD a
            where  a.RL_FILL_TIME is not null
            CONNECT BY 
            LEVEL <= REGEXP_COUNT(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, ',') + 1  -- 拆分后的值数量 = 逗号数 + 1
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
                else '-' 
           end as MARKET_CODE,
           case when a.WINDCODE like '%.SH' or a.WINDCODE like '%.SZ' or a.WINDCODE like '%.BJ' or a.WINDCODE like '%.HK' or a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then substr(a.WINDCODE,1,instr(a.WINDCODE,'.')-1) else coalesce(a.WINDCODE,'-') end as STOCK_CODE,
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
                   REGEXP_SUBSTR(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, '[^,]+', 1, LEVEL) AS WINDCODE,
                   REGEXP_SUBSTR(STKNAME, '[^,]+', 1, LEVEL) AS STKNAME,
                   row_number() over(partition by a.PROJNAME,REGEXP_SUBSTR(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, '[^,]+', 1, LEVEL),a.RO_FILL_TIME order by a.CO_FILL_TIME desc) as rn
            from   THJS.TCL_HGPT_PROJLIST_QD a
            where  a.RO_FILL_TIME is not null
            CONNECT BY 
            LEVEL <= REGEXP_COUNT(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, ',') + 1  -- 拆分后的值数量 = 逗号数 + 1
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
                else '-' 
           end as MARKET_CODE,
           case when a.WINDCODE like '%.SH' or a.WINDCODE like '%.SZ' or a.WINDCODE like '%.BJ' or a.WINDCODE like '%.HK' or a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then substr(a.WINDCODE,1,instr(a.WINDCODE,'.')-1) else coalesce(a.WINDCODE,'-') end as STOCK_CODE,
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
                   REGEXP_SUBSTR(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, '[^,]+', 1, LEVEL) AS WINDCODE,
                   REGEXP_SUBSTR(STKNAME, '[^,]+', 1, LEVEL) AS STKNAME,
                   row_number() over(partition by a.PROJNAME,REGEXP_SUBSTR(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, '[^,]+', 1, LEVEL),a.RQ_FILL_TIME order by a.CQ_FILL_TIME desc) as rn
            from   THJS.TCL_HGPT_PROJLIST_QD a
            where  a.RQ_FILL_TIME is not null
            CONNECT BY 
            LEVEL <= REGEXP_COUNT(case when WINDCODE like '%.%' then WINDCODE  else STKCODE end, ',') + 1  -- 拆分后的值数量 = 逗号数 + 1
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
           distinct case when a.WINDCODE like '%.SH' then '1' 
                when a.WINDCODE like '%.SZ' then '2'
                when a.WINDCODE like '%.BJ' then '3' 
                when a.WINDCODE like '%.HK' then '5' 
                when a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then '6' 
                else '-' 
           end as MARKET_CODE,
           case when a.WINDCODE like '%.SH' or a.WINDCODE like '%.SZ' or a.WINDCODE like '%.BJ' or a.WINDCODE like '%.HK' or a.WINDCODE like '%.NQ' or a.WINDCODE like '%.OC' then substr(a.WINDCODE,1,instr(a.WINDCODE,'.')-1) else coalesce(a.WINDCODE,'-') end as STOCK_CODE,
           a.STKNAME as STOCK_NAME,
           case when a.PROJLIST_STATUS like '%l' then 'l' when a.PROJLIST_STATUS like '%o' then 'o' when a.PROJLIST_STATUS like '%q' then 'q' else '?' end as LIMIT_TYPE,
           replace(a.R_FILL_TIME,'-','') as BEGIN_TIME,
           replace(a.C_FILL_TIME,'-','') as END_TIME,
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
                   REGEXP_SUBSTR(case when WINDCODE like '%.%' then WINDCODE else STKCODE end, '[^,]+', 1, LEVEL) AS WINDCODE,
                   REGEXP_SUBSTR(STKNAME, '[^,]+', 1, LEVEL) AS STKNAME,
                   row_number() over(partition by a.PROJTYPE,a.CUSTNAME ,REGEXP_SUBSTR(case when WINDCODE like '%.%' then WINDCODE else STKCODE end, '[^,]+', 1, LEVEL),right(a.PROJLIST_STATUS,1),a.R_FILL_TIME order by a.C_FILL_TIME desc,a.rowid) as rn
            from THJS.TCL_HGPT_PROJLIST_QD_XGGJ a
            CONNECT BY 
            LEVEL <= REGEXP_COUNT(case when WINDCODE like '%.%' then WINDCODE else STKCODE end, ',') + 1  -- 拆分后的值数量 = 逗号数 + 1
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



