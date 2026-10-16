CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_002
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
    -- 功能名称: TIDM-债券交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251124 17:00:38
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
           SOURCE_BOND_CODE
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



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_004
(
    i_busi_date                          IN VARCHAR2 ,
    o_return_msg                         OUT VARCHAR2 ,
    o_return_code                        OUT NUMBER 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.5
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: TIDM-债券回购交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251124 17:12:12
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
           OUTRIGHT_BOND_CODE
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



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_005
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
    -- 功能名称: TIDM-交易员表转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251124 10:34:10
    -- 修改内容:1.2:
    -- 修改内容:增加海益系统内交易员信息
    -- 修改内容:1.1:
    -- 修改内容:因存在交易员可能离职注销的记录未推送问题，采用增量转换
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.TMP_TRADER;

    /*02:备份原数据至临时表*/o_return_msg:='02';
    insert into BONDDB.TMP_TRADER
    (
           TRADER,
           TRADER_NAME,
           STAFF_ID,
           PORTFOLIO_NO,
           TRADER_STATUS,
           DEPT_CODE,
           REMARK,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID
    )
    select 
           TRADER as TRADER,
           TRADER_NAME as TRADER_NAME,
           STAFF_ID as STAFF_ID,
           PORTFOLIO_NO as PORTFOLIO_NO,
           TRADER_STATUS as TRADER_STATUS,
           DEPT_CODE as DEPT_CODE,
           REMARK as REMARK,
           DATA_SOURCE as DATA_SOURCE,
           SOURCE_TABLE as SOURCE_TABLE,
           SOURCE_ROW_ID as SOURCE_ROW_ID
    from   
           BONDDB.TB_TRADER a
    where  data_source='TIDM';

    /*03:*/o_return_msg:='03';
    delete from BONDDB.TB_TRADER where DATA_SOURCE='TIDM';

    /*04:以新工号,姓名匹配的交易员*/o_return_msg:='04';
    insert into BONDDB.TB_TRADER
    (
           TRADER,
           TRADER_NAME,
           STAFF_ID,
           TRADER_STATUS,
           DEPT_CODE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID
    )
    select 
           distinct a.USER_ID as TRADER,
           a.USER_NAME as TRADER_NAME,
           b.STAFF_ID as STAFF_ID,
           '1' as TRADER_STATUS,
           b.DEPT_ID as DEPT_CODE,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_AGT_SYS_USER' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID
    from   
           (select a.*,a.rowid,row_number() over(partition by a.user_id order by case when a.email like '%@gtht.com%' then 0 else 1 end,a.load_time desc) as rn
            from   TIDM.TCL_AGT_SYS_USER a
           ) a
    inner join
           APP.WB_USER b
    on     
           a.USER_ID =b.STAFF_ID
    and  a.USER_NAME =b.DISPLAY_NAME
    and  b.STAFF_ID is not null
    where  a.rn=1;

    /*05:以老工号,姓名匹配的交易员*/o_return_msg:='05';
    insert into BONDDB.TB_TRADER
    (
           TRADER,
           TRADER_NAME,
           STAFF_ID,
           TRADER_STATUS,
           DEPT_CODE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID
    )
    select 
           distinct a.USER_ID as TRADER,
           a.USER_NAME as TRADER_NAME,
           b.STAFF_ID as STAFF_ID,
           '1' as TRADER_STATUS,
           b.DEPT_ID as DEPT_CODE,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_AGT_SYS_USER' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID
    from   
           (select a.*,a.rowid,row_number() over(partition by a.user_id order by case when a.email like '%@gtht.com%' then 0 else 1 end,a.load_time desc) as rn
            from   TIDM.TCL_AGT_SYS_USER a
           ) a
    inner join
           APP.WB_USER b
    on     
           a.USER_ID =b.USER_NAME
    and  a.USER_NAME =b.DISPLAY_NAME
    and  b.STAFF_ID is not null
    where  a.rn=1
    and    not exists(select 1 from BONDDB.TB_TRADER c
                      where  a.USER_ID=c.TRADER
                      and    c.DATA_SOURCE='TIDM');

    /*06:以邮箱,姓名匹配的交易员*/o_return_msg:='06';
    insert into BONDDB.TB_TRADER
    (
           TRADER,
           TRADER_NAME,
           STAFF_ID,
           TRADER_STATUS,
           DEPT_CODE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID
    )
    select 
           distinct a.USER_ID as TRADER,
           a.USER_NAME as TRADER_NAME,
           b.STAFF_ID as STAFF_ID,
           '1' as TRADER_STATUS,
           b.DEPT_ID as DEPT_CODE,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_AGT_SYS_USER' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID
    from   
           (select a.*,a.rowid,row_number() over(partition by a.user_id order by case when a.email like '%@gtht.com%' then 0 else 1 end,a.load_time desc) as rn
            from   TIDM.TCL_AGT_SYS_USER a
           ) a
    inner join
           APP.WB_USER b
    on     
           a.USER_NAME =b.DISPLAY_NAME
    and  (a.EMAIL=b.EMAIL/* or a.EMAIL=b.STAFF_EMAIL*/)
    and  b.STAFF_ID is not null
    where  a.rn=1
    and    not exists(select 1 from BONDDB.TB_TRADER c
                      where  a.USER_ID=c.TRADER
                      and    c.DATA_SOURCE='TIDM');

    /*07:以姓名无重名匹配的交易员*/o_return_msg:='07';
    insert into BONDDB.TB_TRADER
    (
           TRADER,
           TRADER_NAME,
           STAFF_ID,
           TRADER_STATUS,
           DEPT_CODE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID
    )
    select 
           distinct a.USER_ID as TRADER,
           a.USER_NAME as TRADER_NAME,
           b.STAFF_ID as STAFF_ID,
           '1' as TRADER_STATUS,
           b.DEPT_ID as DEPT_CODE,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_AGT_SYS_USER' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID
    from   
           (select a.*,a.rowid,row_number() over(partition by a.user_id order by case when a.email like '%@gtht.com%' then 0 else 1 end,a.load_time desc) as rn
            from   TIDM.TCL_AGT_SYS_USER a
           ) a
    inner join
           (select DISPLAY_NAME,max(DEPT_ID) as DEPT_ID,max(STAFF_ID) as STAFF_ID,count(distinct STAFF_ID) as cnt 
              from APP.WB_USER
             where STAFF_ID is not null
             group by DISPLAY_NAME
            having count(distinct STAFF_ID)=1
           ) b
    on     
           a.USER_NAME =b.DISPLAY_NAME
    where  a.rn=1
    and    not exists(select 1 from BONDDB.TB_TRADER c
                      where  a.USER_ID=c.TRADER
                      and    c.DATA_SOURCE='TIDM');

    /*08:其他未匹配工号的交易员*/o_return_msg:='08';
    insert into BONDDB.TB_TRADER
    (
           TRADER,
           TRADER_NAME,
           TRADER_STATUS,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID
    )
    select 
           a.USER_ID as TRADER,
           a.USER_NAME as TRADER_NAME,
           '1' as TRADER_STATUS,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_AGT_SYS_USER' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID
    from   
           (select a.*,a.rowid,row_number() over(partition by a.user_id order by case when a.email like '%@gtht.com%' then 0 else 1 end,a.load_time desc) as rn
            from   TIDM.TCL_AGT_SYS_USER a
           ) a
    where  a.RN=1
    and    not exists(select 1 from BONDDB.TB_TRADER c
                      where  a.USER_ID=c.TRADER
                      and    c.DATA_SOURCE='TIDM')
    ;

    /*09:从交易数据集市的海益交易数据中取交易员信息*/o_return_msg:='09';
    insert into BONDDB.TB_TRADER
    (
           TRADER,
           TRADER_NAME,
           STAFF_ID,
           TRADER_STATUS,
           DEPT_CODE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID
    )
    select 
           distinct a.delr as TRADER,
           a.delr as TRADER_NAME,
           b.STAFF_ID as STAFF_ID,
           '1' as TRADER_STATUS,
           b.DEPT_ID as DEPT_CODE,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_EVT_SECU_MATCH' as SOURCE_TABLE,
           null as SOURCE_ROW_ID
    from   
           tidm.TCL_EVT_SECU_MATCH a
    left join
           app.wb_user b
    on     
           a.delr=b.display_name
    where  a.data_source='HIT'
    and    a.delr is not null
    and    not exists(select 1 from BONDDB.TB_TRADER c 
                      where  a.delr=c.TRADER);

    /*10:更新人工识别的交易员的人力信息*/o_return_msg:='10';
    update BONDDB.TB_TRADER a 
    set    (a.STAFF_ID,a.DEPT_CODE,a.REMARK)=
                 (select b.STAFF_ID,b.DEPT_CODE,b.REMARK from BONDDB.TMP_TRADER b
                  where  a.trader=b.trader
                  and    a.data_source=b.data_source
                  and    b.STAFF_ID is not null
                 )
    where  a.STAFF_ID is null
    and    a.data_source='TIDM'
    and    exists(select 1 from BONDDB.TMP_TRADER b
                  where  a.trader=b.trader
                  and    a.data_source=b.data_source
                  and    b.STAFF_ID is not null
                 );

    /*11:补上剩余交易员信息*/o_return_msg:='11';
    insert into BONDDB.TB_TRADER
    (
           TRADER,
           TRADER_NAME,
           STAFF_ID,
           PORTFOLIO_NO,
           TRADER_STATUS,
           DEPT_CODE,
           REMARK,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID
    )
    select 
           a.TRADER as TRADER,
           a.TRADER_NAME as TRADER_NAME,
           a.STAFF_ID as STAFF_ID,
           a.PORTFOLIO_NO as PORTFOLIO_NO,
           a.TRADER_STATUS as TRADER_STATUS,
           a.DEPT_CODE as DEPT_CODE,
           a.REMARK as REMARK,
           a.DATA_SOURCE as DATA_SOURCE,
           a.SOURCE_TABLE as SOURCE_TABLE,
           a.SOURCE_ROW_ID as SOURCE_ROW_ID
    from   
           BONDDB.TMP_TRADER a
    where  a.data_source='TIDM'
    and    not exists(select 1 from BONDDB.TB_TRADER b
                      where  a.TRADER=b.TRADER
                      and    a.data_source=b.data_source
                     );

    /*12:*/o_return_msg:='12';
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
       o_return_msg  := 'APP.PR_DATA_ETL_TIDM_005执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_008
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
    -- 功能名称: TIDM-海益投顾业务投资组合转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251124 11:15:38
    -- 修改内容:1.0:
    -- 修改内容:达梦1.0版，增加海益投顾业务的投资组合数据转换
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.TB_PORTFOLIO_TREE where DATA_SOURCE='TIDM';

    /*02:手工创建根节点，交投数据集市未发现海益的投资组合树*/o_return_msg:='02';
    insert into BONDDB.TB_PORTFOLIO_TREE
    (
           PORTFOLIO_NO,
           PORTFOLIO_NAME,
           PARENT_PORTFOLIO,
           IF_LEAF,
           ACCOUNT_PROP,
           DATA_SOURCE,
           SOURCE_TABLE
    )
    select 
           'HYTG' as PORTFOLIO_NO,
           '海益投顾' as PORTFOLIO_NAME,
           '海益投顾' as PARENT_PORTFOLIO,
           '0' as IF_LEAF,
           '2' as ACCOUNT_PROP,
           'TIDM' as DATA_SOURCE,
           'dual' as SOURCE_TABLE
    from   
           dual a
    where  1=1;

    /*03:海益投顾业务的投资组合*/o_return_msg:='03';
    insert into BONDDB.TB_PORTFOLIO_TREE
    (
           PORTFOLIO_NO,
           PORTFOLIO_NAME,
           PARENT_PORTFOLIO,
           IF_LEAF,
           ACCOUNT_PROP,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID,
           STOCKHOLDER
    )
    select 
           a.PORTFOLIO_ID as PORTFOLIO_NO,
           a.PORTFOLIO_NAME as PORTFOLIO_NAME,
           'HYTG' as PARENT_PORTFOLIO,
           '1' as IF_LEAF,
           '2' as ACCOUNT_PROP,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_AGT_PORTFOLIO' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID,
           a.PORTFOLIO_ID as STOCKHOLDER
    from   
           TIDM.TCL_AGT_PORTFOLIO a
    where  a.PORTFOLIO_ID like 'P-%-%';

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
       o_return_msg  := 'APP.PR_DATA_ETL_TIDM_008执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_XIR_002
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
    -- 功能名称: XIR-交易对手转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251126 10:33:56
    -- 修改内容:1.1:
    -- 修改内容:修改原字段IF_RELATED_CP,改为关联对手方ID,取关联关系树的顶层ID
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
BEGIN
    /*01:找到关系树根节点作为关联对手ID*/o_return_msg:='01';
    insert into bonddb.tmp_cp_relation
    (cp_id,
     cp_name,
     related_cp_id
    )
    with recursive CTE_CHILD(CHILD,parent,cp_name) as 
     (select partyid,
             '-1' as parentorganpartyid,
             partyname
      from   XIR.TCL_TTRD_OTC_COUNTERPARTY
      where  parentorganpartyid='-1' or partyid=parentorganpartyid
      union all
      select A.partyid,
             A.parentorganpartyid,
             A.partyname
      from   XIR.TCL_TTRD_OTC_COUNTERPARTY A
      inner  join CTE_CHILD B
      on     A.parentorganpartyid = B.CHILD
      and    a.parentorganpartyid<>'-1' 
      and    a.partyid<>a.parentorganpartyid
     )
    select 
           C.CHILD as cp_id,
           c.cp_name,
           case when C.parent='-1' then C.CHILD else C.parent end as related_cp_id
    from   
           CTE_CHILD C
    ;

    /*02:*/o_return_msg:='02';
    delete from BONDDB.TB_COUNTERPARTY where DATA_SOURCE='XIR';

    /*03:*/o_return_msg:='03';
    insert into BONDDB.TB_COUNTERPARTY
    (
           CP_ID,
           CP_NAME,
           PARENT_CP_ID,
           SOCIAL_CREDIT_CODE,
           CP_NAME_SHORT,
           RELATED_CP_ID,
           CP_NAME_WIND,
           SOURCE_TABLE,
           SOURCE_ROW_ID,
           IF_LEGAL_PERSON,
           ACCOUNT_PROP,
           DATA_SOURCE,
           ENABLE_FLAG
    )
    select 
           a.partyid as CP_ID,
           a.partyname as CP_NAME,
           a.parentorganpartyid as PARENT_CP_ID,
           a.creditcode as SOCIAL_CREDIT_CODE,
           a.partyname_short as CP_NAME_SHORT,
           coalesce(c.related_cp_id,a.partyid) as RELATED_CP_ID,
           a.wind_party_name as CP_NAME_WIND,
           'XIR.TCL_TTRD_OTC_COUNTERPARTY' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID,
           case when a.islegalperson='1' then '1' else '0' end as IF_LEGAL_PERSON,
           case when b.pool_id in ('882') then '3' --资管
                when b.pool_id in ('883','1682') then '2' --投顾
                else 'Z' --其他
           end as ACCOUNT_PROP,
           'XIR' as DATA_SOURCE,
           a.PARTY_STATUS as ENABLE_FLAG
    from   
           XIR.TCL_TTRD_OTC_COUNTERPARTY a
    left join
           TIDM.TCL_EVT_I_POOL_COMPON b
    on     
           a.partyid=b.compon
    and b.pool_id in ('882','883','1682')
    left join
           BONDDB.TMP_CP_RELATION c
    on     
           a.partyid=c.cp_id
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
       o_return_msg  := 'APP.PR_DATA_ETL_XIR_002执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
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
    -- 版    本: 1.3
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: XIR-债券银行间回购基准利率表转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251127 08:13:08
    -- 修改内容:1.3:
    -- 修改内容:对于缺失的品种优先取近一年内最近一天的该品种数据，改为根据品种期限向前找同期限天数，比如1M，找30天内，6M找180天内，1Y找365天内
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
                                    where  a.loaddate >= to_char(to_date(v_busi_date,'YYYY-MM-DD')
                                                                 -case when item='R001' then 3
                                                                       when item='R007' then 7
                                                                       when item='R014' then 14
                                                                       when item='R021' then 21
                                                                       when item='R1M' then 30
                                                                       when item='R2M' then 60
                                                                       when item='R3M' then 90
                                                                       when item='R4M' then 120
                                                                       when item='R6M' then 180
                                                                       when item='R9M' then 270
                                                                       when item='R1Y' then 365
                                                                  end,'YYYY-MM-DD')
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



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_XIR_009
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
    -- 功能名称: XIR-债券现券持仓表转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251128 10:04:13
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
           a.rowid as SOURCE_ROW_ID,
           a.M_TYPE as SOURCE_MARKET_CODE,
           a.I_CODE as SOURCE_BOND_CODE,
           c.CURRENCY as SOURCE_CURRENCY,
           a.AI as INTEREST,
           case when a.REAL_VOLUME=0 then null else a.REAL_AMOUNT/a.REAL_VOLUME end as FACE_VALUE
    from   
           XIR.TCL_TTRD_ACCOUNTING_SECU_OBJ_HIS a
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
    where  a.BUSI_DATE=i_busi_date
    and    to_number(a.REAL_VOLUME)>0
    and    not exists(select 1 from XIR.TCL_TTRD_ACCOUNTING_SECU_OBJ_HIS b
                      where  a.busi_date=b.busi_date
                      and    a.secu_acct_id=b.secu_acct_id
                      and    a.m_type=b.m_type
                      and    a.i_code=b.i_code
                      and    a.rowid<>b.rowid
                     )
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
       o_return_msg  := 'APP.PR_DATA_ETL_XIR_009执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



