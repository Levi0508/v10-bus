
alter table APP.TB_DATA_ETL_LOG add column WARNING_MESSAGE VARCHAR2(4000);
comment on column APP.TB_DATA_ETL_LOG.WARNING_MESSAGE is '提示信息';


CREATE OR REPLACE PROCEDURE APP.PR_TABLE_ETL_Q
(
    i_begin_date                         IN VARCHAR2 ,
    i_end_date                           IN VARCHAR2 ,
    i_data_source                        IN VARCHAR2 ,
    i_target_table                       IN VARCHAR2 ,
    i_etl_status                         IN VARCHAR2 ,
    rt_cursor                            OUT CURSOR ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.2
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 表数据转换记录查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251120 15:32:41
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



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_JZJY_005
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
    -- 功能名称: JZJY-子公司账户证券持仓转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251120 16:02:30
    -- 修改内容:1.1:
    -- 修改内容:调整字典无映射时取值，从？？改为？
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    delete from SUBSDB.TB_STOCK_HOLDING where DATA_SOURCE='JZJY' and BUSI_DATE=i_busi_date ;

    /*02:*/o_return_msg:='02';
    insert into SUBSDB.TB_STOCK_HOLDING
    (
           BUSI_DATE,
           BRANCH_CODE,
           DEPT_CODE,
           ACCOUNT_FLAG,
           CAPITAL_ACCOUNT,
           ACCOUNT_NAME,
           CURRENCY,
           CUST_ID,
           MARKET_CODE,
           STOCKHOLDER,
           SEAT_NO,
           STOCK_CODE,
           STOCK_NAME,
           STOCK_TYPE,
           BEGIN_QTY,
           QTY,
           AVAILABLE_QTY,
           BUY_UNFREEZE_QTY,
           SELL_FREEZE_QTY,
           BUY_UNCOME_QTY,
           SELL_UNCOME_QTY,
           FREEZE_QTY,
           UNFREEZE_QTY,
           LAST_BUY_COST,
           LAST_PROFIT,
           BUY_COST,
           PROFIT,
           MARKET_VALUE,
           REMAIN_QTY,
           CORP_REMAIN_QTY,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID,
           SOURCE_CURRENCY,
           SOURCE_STOCK_TYPE,
           SOURCE_MARKET_CODE,
           SOURCE_ACCOUNT_FLAG
    )
    select 
           a.BUSI_DATE as BUSI_DATE,
           a.BRHID as BRANCH_CODE,
           b.DEPID as DEPT_CODE,
           isnull(dm0021.DICT_KEY,'?') as ACCOUNT_FLAG,
           a.FUNDID as CAPITAL_ACCOUNT,
           a.FUNDNAME as ACCOUNT_NAME,
           isnull(dm0009.DICT_KEY,'?') as CURRENCY,
           a.CUSTID as CUST_ID,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           trim(a.SECUID) as STOCKHOLDER,
           trim(a.SEAT) as SEAT_NO,
           trim(a.STKCODE) as STOCK_CODE,
           trim(c.STKNAME) as STOCK_NAME,
           isnull(dm0010.DICT_KEY,'?') as STOCK_TYPE,
           a.STKLASTBAL as BEGIN_QTY,
           a.STKBAL as QTY,
           a.STKAVL as AVAILABLE_QTY,
           a.STKBUY as BUY_UNFREEZE_QTY,
           a.STKSALE as SELL_FREEZE_QTY,
           a.STKUNCOMEBUY as BUY_UNCOME_QTY,
           a.STKUNCOMESALE as SELL_UNCOME_QTY,
           a.STKFRZ as FREEZE_QTY,
           a.STKUNFRZ as UNFREEZE_QTY,
           a.LASTBUYCOST as LAST_BUY_COST,
           a.LASTPROFITCOST as LAST_PROFIT,
           a.BUYCOST as BUY_COST,
           a.PROFITCOST as PROFIT,
           a.MKTVAL as MARKET_VALUE,
           a.STKREMAIN as REMAIN_QTY,
           a.STKCORPREMAIN as CORP_REMAIN_QTY,
           'JZJY' as DATA_SOURCE,
           'JZJY.TCL_SUBS_STKASSET' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID,
           a.MONEYTYPE as SOURCE_CURRENCY,
           c.STKTYPE as SOURCE_STOCK_TYPE,
           a.MARKET as SOURCE_MARKET_CODE,
           a.CREDITFLAG as SOURCE_ACCOUNT_FLAG
    from   
           JZJY.TCL_SUBS_STKASSET a
    left join
           JZJY.TCL_BRANCH_EHR b
    on     
           a.brhid=b.brhid
    left join
           JZJY.TCL_STOCK c
    on     
           a.market=c.MARKET
    and    a.stkcode=c.stkcode
    left join
           APP.TB_DICT_MAP dm0009
    on     
           a.moneytype=dm0009.SOURCE_KEY
    and    dm0009.DATA_SOURCE ='JZJY'
    and    dm0009.DICT_CODE ='0009'
    and    dm0009.DICT_KEY is not null
    left join
           APP.TB_DICT_MAP dm0021
    on     
           a.creditflag=dm0021.SOURCE_KEY
    and    dm0021.DATA_SOURCE ='JZJY'
    and    dm0021.DICT_CODE ='0021'
    and    dm0021.DICT_KEY is not null
    left join
           APP.TB_DICT_MAP dm0001
    on     
           a.market=dm0001.SOURCE_KEY
    and    dm0001.DATA_SOURCE ='JZJY'
    and    dm0001.DICT_CODE ='0001'
    and    dm0001.DICT_KEY is not null
    left join
           APP.TB_DICT_MAP dm0010
    on     
           c.stktype=dm0010.SOURCE_KEY
    and    dm0010.DATA_SOURCE ='JZJY'
    and    dm0010.DICT_CODE ='0010'
    and    dm0010.DICT_KEY is not null
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
       o_return_msg  := 'APP.PR_DATA_ETL_JZJY_005执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_JZJY_006
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
    -- 功能名称: JZJY-子公司账户资金股份变动流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251120 16:01:03
    -- 修改内容:1.1:
    -- 修改内容:调整字典无映射时取值，从？？改为？
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
BEGIN
    /*01:*/o_return_msg:='01';
    delete from SUBSDB.TB_FUND_STOCK_CHG where DATA_SOURCE='JZJY' and BUSI_DATE=i_busi_date ;

    /*02:*/o_return_msg:='02';
    insert into SUBSDB.TB_FUND_STOCK_CHG
    (
           BUSI_DATE,
           BRANCH_CODE,
           DEPT_CODE,
           CAPITAL_ACCOUNT,
           ACCOUNT_NAME,
           CURRENCY,
           CUST_ID,
           MARKET_CODE,
           STOCKHOLDER,
           STOCK_CODE,
           STOCK_NAME,
           STOCK_TYPE,
           MATCH_DATE,
           BUSI_SERIAL_NO,
           RELATE_SERIAL_NO,
           BUSI_TYPE,
           BUSI_FLAG,
           BUSI_FLAG_NAME,
           OCCUR_AMOUNT,
           AFTER_BALANCE,
           OCCUR_QTY,
           AFTER_QTY,
           CONTRACT_NO,
           ORDER_SERIAL_NO,
           ORDER_DIR,
           ORDER_QTY,
           ORDER_PRICE,
           ORDER_DATE,
           ORDER_TIME,
           SEAT_NO,
           MATCH_QTY,
           MATCH_AMOUNT,
           MATCH_TIMES,
           MATCH_PRICE,
           MATCH_TIME,
           MATCH_NO,
           AGENT_ID,
           OPERATOR_NO,
           ORDER_WAY,
           ORDER_WAY_NAME,
           NET_ADDR,
           CHECK_OPERATOR_NO,
           REMARK,
           EXCH_RATE,
           CUST_RISK_LEVEL,
           PRODUCT_RISK_LEVEL,
           OUTER_ORDER_ID,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID,
           SOURCE_CURRENCY,
           SOURCE_STOCK_TYPE,
           SOURCE_MARKET_CODE,
           SOURCE_BUSI_TYPE,
           SOURCE_ORDER_DIR
    )
    select 
           a.BUSI_DATE as BUSI_DATE,
           a.BRHID as BRANCH_CODE,
           b.DEPID as DEPT_CODE,
           a.FUNDID as CAPITAL_ACCOUNT,
           a.CUSTNAME as ACCOUNT_NAME,
           isnull(dm0009.DICT_KEY,'?') as CURRENCY,
           a.CUSTID as CUST_ID,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           trim(a.SECUID) as STOCKHOLDER,
           trim(a.STKCODE) as STOCK_CODE,
           trim(a.STKNAME) as STOCK_NAME,
           isnull(dm0010.DICT_KEY,'?') as STOCK_TYPE,
           a.CLEARDATE as MATCH_DATE,
           a.SNO as BUSI_SERIAL_NO,
           a.RELATIVESNO as RELATE_SERIAL_NO,
           isnull(dm0023.DICT_KEY,'?') as BUSI_TYPE,
           a.DIGESTID as BUSI_FLAG,
           trim(c.DIGESTNAME) as BUSI_FLAG_NAME,
           a.FUNDEFFECT as OCCUR_AMOUNT,
           a.FUNDBAL as AFTER_BALANCE,
           a.STKEFFECT as OCCUR_QTY,
           a.STKBAL as AFTER_QTY,
           trim(a.ORDERID) as CONTRACT_NO,
           a.ORDERSNO as ORDER_SERIAL_NO,
           isnull(dm0002.DICT_KEY,'?') as ORDER_DIR,
           a.ORDERQTY as ORDER_QTY,
           a.ORDERPRICE as ORDER_PRICE,
           a.ORDERDATE as ORDER_DATE,
           to_char(to_date(substr(to_char(a.ordertime,'00000000'),1,6),'hh24:mi:ss'),'hh24:mi:ss') as ORDER_TIME,
           trim(a.seat) as SEAT_NO,
           a.MATCHQTY as MATCH_QTY,
           a.MATCHAMT as MATCH_AMOUNT,
           a.MATCHTIMES as MATCH_TIMES,
           a.MATCHPRICE as MATCH_PRICE,
           to_char(to_date(substr(to_char(a.matchtime,'00000000'),1,6),'hh24:mi:ss'),'hh24:mi:ss') as MATCH_TIME,
           a.MATCHCODE as MATCH_NO,
           a.AGENTID as AGENT_ID,
           a.OPERID as OPERATOR_NO,
           a.OPERWAY as ORDER_WAY,
           d.SOURCE_VALUE as ORDER_WAY_NAME,
           a.NETADDR as NET_ADDR,
           a.CHKOPER as CHECK_OPERATOR_NO,
           trim(a.remark) as REMARK,
           a.CLEAREXCHRATE as EXCH_RATE,
           a.CRISKLEVEL as CUST_RISK_LEVEL,
           a.PRISKLEVEL as PRODUCT_RISK_LEVEL,
           a.OUTBIZSNO as OUTER_ORDER_ID,
           'JZJY' as DATA_SOURCE,
           'JZJY.TCL_SUBS_STKASSET' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID,
           a.MONEYTYPE as SOURCE_CURRENCY,
           a.STKTYPE as SOURCE_STOCK_TYPE,
           a.MARKET as SOURCE_MARKET_CODE,
           a.biztype as SOURCE_BUSI_TYPE,
           a.BSFLAG as SOURCE_ORDER_DIR
    from   
           JZJY.TCL_SUBS_H_LOGASSET a
    left join
           JZJY.TCL_BRANCH_EHR b
    on     
           a.brhid=b.brhid
    left join
           JZJY.TCL_DIGEST c
    on     
           a.digestid=c.DIGESTID
    left join
           app.VW_SOURCE_DICT d
    on     
           a.operway=d.SOURCE_KEY
    and    d.DATA_SOURCE='JZJY'
    and    d.SOURCE_DICT='Ewtfs'
    left join
           APP.TB_DICT_MAP dm0009
    on     
           a.moneytype=dm0009.SOURCE_KEY
    and    dm0009.DATA_SOURCE ='JZJY'
    and    dm0009.DICT_CODE ='0009'
    and    dm0009.DICT_KEY is not null
    left join
           APP.TB_DICT_MAP dm0001
    on     
           a.market=dm0001.SOURCE_KEY
    and    dm0001.DATA_SOURCE ='JZJY'
    and    dm0001.DICT_CODE ='0001'
    and    dm0001.DICT_KEY is not null
    left join
           APP.TB_DICT_MAP dm0010
    on     
           a.stktype=dm0010.SOURCE_KEY
    and    dm0010.DATA_SOURCE ='JZJY'
    and    dm0010.DICT_CODE ='0010'
    and    dm0010.DICT_KEY is not null
    left join
           APP.TB_DICT_MAP dm0023
    on     
           a.biztype=dm0023.SOURCE_KEY
    and    dm0023.DATA_SOURCE ='JZJY'
    and    dm0023.DICT_CODE ='0023'
    and    dm0023.DICT_KEY is not null
    left join
           APP.TB_DICT_MAP dm0002
    on     
           a.bsflag=dm0002.SOURCE_KEY
    and    dm0002.DATA_SOURCE ='JZJY'
    and    dm0002.DICT_CODE ='0002'
    and    dm0002.DICT_KEY is not null
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
       o_return_msg  := 'APP.PR_DATA_ETL_JZJY_006执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_LOG
(
    i_busi_date                          IN VARCHAR2 ,
    i_data_source                        IN VARCHAR2 ,
    i_target_table                       IN VARCHAR2 ,
    i_etl_status                         IN VARCHAR2 ,
    i_exec_sql                           IN VARCHAR2 ,
    i_exec_seq                           IN INT ,
    i_etl_no                             IN VARCHAR2 ,
    i_error_step                         IN VARCHAR2 ,
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
    -- 功能名称: 写数据转换日志
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251120 16:24:33
    -- 修改内容:1.1:
    -- 修改内容:增加执行成功后检查转换字典是否存在未映射情况
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_check_sql                          VARCHAR2(4000) ;
    v_check_message                      VARCHAR2(4000) ;
BEGIN
    /*01:删除转换中日志*/o_return_msg:='01';
    delete from app.TB_DATA_ETL_LOG a
    where  a.busi_date=i_busi_date
    and    a.data_source=i_data_source
    and    a.target_table=i_target_table
    and    i_etl_status='2';

    /*02:插入开始转换记录*/o_return_msg:='02';
    insert into APP.TB_DATA_ETL_LOG
    (
           BUSI_DATE,
           DATA_SOURCE,
           TARGET_TABLE,
           BEGIN_TIME,
           END_TIME,
           ETL_STATUS,
           EXEC_SQL,
           ETL_NO,
           EXEC_SEQ
    )
    select 
           i_busi_date as BUSI_DATE,
           i_data_source as DATA_SOURCE,
           i_target_table as TARGET_TABLE,
           sysdate as BEGIN_TIME,
           null as END_TIME,
           i_etl_status as ETL_STATUS,
           i_exec_sql as EXEC_SQL,
           i_etl_no as ETL_NO,
           i_exec_seq as EXEC_SEQ
    from   
           DUAL a
    where  i_etl_status='2';

    /*03:更新完成或失败记录*/o_return_msg:='03';
    update app.tb_data_etl_log a
       set a.end_time=sysdate,
           a.etl_status=i_etl_status,
           a.error_step=case when i_etl_status='4' then i_error_step end
     where a.busi_date=i_busi_date
       and a.data_source=i_data_source
       and a.target_table=i_target_table
       and a.etl_status='2'
       and i_etl_status in ('3','4');

        /*04.01:条件:执行成功，检查字典映射是否有遗漏*/o_return_msg:='04.01';
    if i_etl_status='3' then

        /*04.02:生成检查sql*/o_return_msg:='04.02';
        select listagg(a.check_sql,' union ') within group(order by a.check_sql) as check_sql
        into   v_check_sql
        from   (
                select 
                      'select dict_column,listagg(a.source_key,'','') within group(order by a.dict_column) as source_key from ('||
                      'select '''||a.column_name||''' as dict_column,'||a2.column_name||' as source_key,count(1) from '||a.table_name||
                      ' where data_source='''||i_data_source||''''||case when b.date_column is not null then ' and '||b.date_column||'='''||i_busi_date||'''' end||
                      ' and '||a.column_name||' = ''?'' and trim('||a2.column_name||') is not null group by '||a2.column_name||
                      ' ) a group by a.dict_column' as check_sql
                from   app.TB_COLUMN_DICT_ENTRY a--字典字段配置
                inner join 
                      app.VW_COLUMNS a1--字段存在
                on     a.table_name=a1.owner||'.'||a1.table_name
                and    a.column_name=a1.column_name
                inner join 
                      app.VW_COLUMNS a2--源字段存在
                on     a.table_name=a2.owner||'.'||a2.table_name
                and    'SOURCE_'||a.column_name=a2.column_name
                left join
                      app.TB_TABLE_PROPS b--取表的日期字段
                on     a.table_name=b.owner||'.'||b.table_name
                where  a.TABLE_NAME=i_target_table) a;

            /*04.03.01:条件:需要检查情况*/o_return_msg:='04.03.01';
        if v_check_sql is not null then

            /*04.03.02:生成执行语句*/o_return_msg:='04.03.02';
            v_check_sql:='select listagg(dict_column||''有未映射字典值:''||source_key,chr(10)) within group(order by dict_column) from('||v_check_sql||')';

            /*04.03.03:*/o_return_msg:='04.03.03';
            execute immediate v_check_sql into v_check_message;

            /*04.03.04:更新至提示信息*/o_return_msg:='04.03.04';
            update app.tb_data_etl_log a
               set a.WARNING_MESSAGE=v_check_message
             where a.busi_date=i_busi_date
               and a.data_source=i_data_source
               and a.target_table=i_target_table
               and i_etl_status ='3'
               and v_check_message is not null;

            /*04.03.99:条件分支04.03结束*/o_return_msg:='04.03.99';
        end if;

        /*04.99:条件分支04结束*/o_return_msg:='04.99';
    end if;

    /*05:*/o_return_msg:='05';
    COMMIT;
    o_return_code := 0;
    o_return_msg  := '操作成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_DATA_ETL_LOG执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_002
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
    -- 功能名称: TIDM-债券交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251120 15:55:01
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
    -- 版    本: 1.1
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: TIDM-债券远期交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251121 15:37:13
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
           a.I_CODE as SOURCE_BOND_CODE
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
    -- 版    本: 1.4
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: TIDM-债券回购交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251121 13:32:53
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
           a.CNTPTY_ID as CP_ID,
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
    -- 版    本: 1.1
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: TIDM-债券借贷交易流水转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251121 15:40:55
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
           a.I_CODE as SOURCE_BOND_CODE
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



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_TIDM_007
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
    -- 功能名称: TIDM-回购质押券明细转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251121 15:35:58
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0，从衡泰取数改为从交投数据集市取数转换而新增
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*01:*/o_return_msg:='01';
    delete from BONDDB.TB_REPO_PLEDGE_BOND where DATA_SOURCE='TIDM' and BUSI_DATE=i_busi_date;

    /*02:*/o_return_msg:='02';
    insert into BONDDB.TB_REPO_PLEDGE_BOND
    (
           BUSI_DATE,
           ORDER_SERIAL_NO,
           INTERNAL_ORDER_ID,
           STOCKHOLDER,
           CAPITAL_ACCOUNT,
           STOCKHOLDER_NAME,
           MARKET_CODE,
           BOND_CODE,
           BOND_NAME,
           PLEDGE_AMOUNT,
           CONVERSION_RATE,
           CONVERSION_VALUE,
           DATA_SOURCE,
           SOURCE_TABLE,
           SOURCE_ROW_ID,
           SOURCE_MARKET_CODE,
           SOURCE_BOND_CODE
    )
    select 
           b.TRADE_DATE as BUSI_DATE,
           b.SOURCE_TYPE_TRADE_ID as ORDER_SERIAL_NO,
           a.I_CODE as INTERNAL_ORDER_ID,
           b.PORTFOLIO_ID as STOCKHOLDER,
           c.INNER_CAP_ACCT_ID as CAPITAL_ACCOUNT,
           c.PORTFOLIO_NAME as STOCKHOLDER_NAME,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           a.UDLY_I_CODE as BOND_CODE,
           d.B_NAME as BOND_NAME,
           a.UDLY_PAR_V as PLEDGE_AMOUNT,
           a.COVT_RATE as CONVERSION_RATE,
           a.COVT_AMT as CONVERSION_VALUE,
           'TIDM' as DATA_SOURCE,
           'TIDM.TCL_AGT_PLEDGE_STK_DETAIL' as SOURCE_TABLE,
           a.rowid as SOURCE_ROW_ID,
           a.udly_mkt_type as SOURCE_MARKET_CODE,
           a.UDLY_I_CODE as SOURCE_BOND_CODE
    from   
           TIDM.TCL_AGT_PLEDGE_STK_DETAIL a
    inner join
           TIDM.TCL_EVT_SECU_MATCH b
    on     
           a.I_CODE=b.I_CODE
    and    a.DATA_SOURCE=b.DATA_SOURCE
    and    b.TRADE_DATE=i_busi_date
    and    b.TRADE_TYPE in ('L_02_01','L_02_04')
    and    (b.CNTPTY_ID<>'0' or b.DATA_SOURCE='HIT')
    and    b.DATA_SOURCE in ('XIR','HIT')
    inner join
           TIDM.TCL_AGT_PORTFOLIO c
    on     
           b.PORTFOLIO_ID =c.PORTFOLIO_ID
    left join
           XIR.TCL_TBND d
    on     
           a.udly_mkt_type=d.M_TYPE
    and    a.UDLY_I_CODE=d.I_CODE
    inner join
           APP.TB_DICT_MAP dm0001
    on     
           dm0001.DICT_CODE='0001'
    and    dm0001.DATA_SOURCE='TIDM'
    and    dm0001.DICT_KEY is not null
    and    a.udly_mkt_type=dm0001.SOURCE_KEY
    where  1=1;

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
       o_return_msg  := 'APP.PR_DATA_ETL_TIDM_007执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_XIR_003
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
    -- 功能名称: XIR-源数据字典转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251120 09:08:54
    -- 修改内容:1.1:
    -- 修改内容:增加准备数据，单日债券估值数据，后续从单日表取估值
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*01:*/o_return_msg:='01';
    delete from XIR.TCL_TCB_BOND_EVAL_TMP;

    /*02:取单日数据*/o_return_msg:='02';
    insert into XIR.TCL_TCB_BOND_EVAL_TMP
    (
           I_CODE,
           A_TYPE,
           M_TYPE,
           BEG_DATE,
           END_DATE,
           NETPRICE,
           AI,
           YIELD,
           TERM,
           MODIFIED_D,
           CONVEXITY,
           DVBP,
           RD_MODIFIED,
           RD_CONVEXITY,
           R_MODIFIED,
           R_CONVEXITY,
           FULLPRICE,
           IMP_DATE,
           IMP_TIME,
           PIPE_ID,
           EVAL_TYPE,
           EXERCISED_COUPON,
           INTERDAY_FULLPRICE,
           INTERDAY_AI,
           SYBJ
    )
    select 
           I_CODE as I_CODE,
           A_TYPE as A_TYPE,
           M_TYPE as M_TYPE,
           BEG_DATE as BEG_DATE,
           END_DATE as END_DATE,
           NETPRICE as NETPRICE,
           AI as AI,
           YIELD as YIELD,
           TERM as TERM,
           MODIFIED_D as MODIFIED_D,
           CONVEXITY as CONVEXITY,
           DVBP as DVBP,
           RD_MODIFIED as RD_MODIFIED,
           RD_CONVEXITY as RD_CONVEXITY,
           R_MODIFIED as R_MODIFIED,
           R_CONVEXITY as R_CONVEXITY,
           FULLPRICE as FULLPRICE,
           IMP_DATE as IMP_DATE,
           IMP_TIME as IMP_TIME,
           PIPE_ID as PIPE_ID,
           EVAL_TYPE as EVAL_TYPE,
           EXERCISED_COUPON as EXERCISED_COUPON,
           INTERDAY_FULLPRICE as INTERDAY_FULLPRICE,
           INTERDAY_AI as INTERDAY_AI,
           SYBJ as SYBJ
    from   
           XIR.TCL_TCB_BOND_EVAL a
    where  BEG_DATE=v_busi_date;

    /*03:*/o_return_msg:='03';
    delete from XIR.TCL_TZZ_BOND_EVAL_TMP;

    /*04:取单日数据*/o_return_msg:='04';
    insert into XIR.TCL_TZZ_BOND_EVAL_TMP
    (
           I_CODE,
           A_TYPE,
           M_TYPE,
           BEG_DATE,
           END_DATE,
           NETPRICE,
           AI,
           YIELD,
           TERM,
           MODIFIED_D,
           CONVEXITY,
           DVBP,
           RD_MODIFIED,
           RD_CONVEXITY,
           R_MODIFIED,
           R_CONVEXITY,
           FULLPRICE,
           IMP_TIME,
           IMP_DATE,
           SOURCE,
           PIPE_ID,
           EVAL_TYPE
    )
    select 
           I_CODE as I_CODE,
           A_TYPE as A_TYPE,
           M_TYPE as M_TYPE,
           BEG_DATE as BEG_DATE,
           END_DATE as END_DATE,
           NETPRICE as NETPRICE,
           AI as AI,
           YIELD as YIELD,
           TERM as TERM,
           MODIFIED_D as MODIFIED_D,
           CONVEXITY as CONVEXITY,
           DVBP as DVBP,
           RD_MODIFIED as RD_MODIFIED,
           RD_CONVEXITY as RD_CONVEXITY,
           R_MODIFIED as R_MODIFIED,
           R_CONVEXITY as R_CONVEXITY,
           FULLPRICE as FULLPRICE,
           IMP_TIME as IMP_TIME,
           IMP_DATE as IMP_DATE,
           SOURCE as SOURCE,
           PIPE_ID as PIPE_ID,
           EVAL_TYPE as EVAL_TYPE
    from   
           XIR.TCL_TZZ_BOND_EVAL a
    where  BEG_DATE=v_busi_date;

    /*05:*/o_return_msg:='05';
    delete from APP.TB_SOURCE_DICT where DATA_SOURCE='XIR';

    /*06:市场字典，来自交投数据集市*/o_return_msg:='06';
    insert into APP.TB_SOURCE_DICT
    (
           DATA_SOURCE,
           SOURCE_DICT,
           DICT_NAME,
           SOURCE_KEY,
           SOURCE_VALUE
    )
    select 
           'XIR' as DATA_SOURCE,
           a.DICT_CODE as SOURCE_DICT,
           b.DICT_NAME as DICT_NAME,
           a.DICT_ENUM_CODE as SOURCE_KEY,
           a.DICT_ENUM_NAME as SOURCE_VALUE
    from   
           TIDM.TCL_PUB_DICT_ENUM a
    inner join
           TIDM.TCL_PUB_DICT b
    on     
           a.DICT_CODE=b.DICT_CODE
    where  a.DICT_CODE='F0004';

    /*07:债券类别，来自债券信息表*/o_return_msg:='07';
    insert into APP.TB_SOURCE_DICT
    (
           DATA_SOURCE,
           SOURCE_DICT,
           DICT_NAME,
           SOURCE_KEY,
           SOURCE_VALUE
    )
    select 
           distinct 'XIR' as DATA_SOURCE,
           'B_P_CLASS' as SOURCE_DICT,
           '债券类别' as DICT_NAME,
           a.B_P_CLASS as SOURCE_KEY,
           a.B_P_CLASS as SOURCE_VALUE
    from   
           XIR.TCL_TBND a
    where  a.B_P_CLASS is not null;

    /*08:*/o_return_msg:='08';
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
       o_return_msg  := 'APP.PR_DATA_ETL_XIR_003执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE APP.PR_DATA_ETL_XIR_007
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
    -- 功能名称: XIR-债券估值表转换
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251120 09:11:04
    -- 修改内容:1.1:
    -- 修改内容:日期字段从IMP_DATE改为BEG_DATE,利用索引提升效率，估值表改为取单日临时表，单日临时表数据由APP.PR_DATA_ETL_XIR_003准备。
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_busi_date                          CHAR(10) default substr(i_busi_date,1,4)||'-'||substr(i_busi_date,5,2)||'-'||substr(i_busi_date,7,2);
BEGIN
    /*05:*/o_return_msg:='05';
    delete from BONDDB.TB_BOND_VALUATION where DATA_SOURCE='XIR' and BUSI_DATE=i_busi_date;

    /*06:*/o_return_msg:='06';
    insert into BONDDB.TB_BOND_VALUATION
    (
           BUSI_DATE,
           MARKET_CODE,
           BOND_CODE,
           BOND_NAME,
           NET_PRICE_CB,
           FULL_PRICE_CB,
           INTEREST_CB,
           YIELD_RATIO_CB,
           MODIFIED_DURATION_CB,
           CONVEXITY_CB,
           DVBP_CB,
           NET_PRICE_CSI,
           FULL_PRICE_CSI,
           INTEREST_CSI,
           YIELD_RATIO_CSI,
           MODIFIED_DURATION_CSI,
           CONVEXITY_CSI,
           DVBP_CSI,
           SOURCE_TABLE,
           DATA_SOURCE,
           SOURCE_ROW_ID,
           SOURCE_BOND_CODE,
           SOURCE_MARKET_CODE
    )
    select 
           i_busi_date as BUSI_DATE,
           isnull(dm0001.DICT_KEY,'?') as MARKET_CODE,
           a.I_CODE as BOND_CODE,
           a.B_NAME as BOND_NAME,
           b.NETPRICE as NET_PRICE_CB,
           b.FULLPRICE as FULL_PRICE_CB,
           b.AI as INTEREST_CB,
           b.YIELD as YIELD_RATIO_CB,
           b.MODIFIED_D as MODIFIED_DURATION_CB,
           b.CONVEXITY as CONVEXITY_CB,
           b.DVBP as DVBP_CB,
           c.NETPRICE as NET_PRICE_CSI,
           c.FULLPRICE as FULL_PRICE_CSI,
           c.AI as INTEREST_CSI,
           c.YIELD as YIELD_RATIO_CSI,
           c.MODIFIED_D as MODIFIED_DURATION_CSI,
           c.CONVEXITY as CONVEXITY_CSI,
           c.DVBP as DVBP_CSI,
           case when b.I_CODE is not null then 'XIR.TCL_TCB_BOND_EVAL' end||','||case when c.I_CODE is not null then 'XIR.TCL_TZZ_BOND_EVAL' end as SOURCE_TABLE,
           'XIR' as DATA_SOURCE,
           b.rowid||','||c.rowid as SOURCE_ROW_ID,
           a.I_CODE as SOURCE_BOND_CODE,
           a.M_TYPE as SOURCE_MARKET_CODE
    from   
           XIR.TCL_TBND a
    left join
           XIR.TCL_TCB_BOND_EVAL_TMP b
    on     
           a.M_TYPE=b.M_TYPE
    and    a.I_CODE=b.I_CODE
    and    b.BEG_DATE=v_busi_date
    left join
           XIR.TCL_TZZ_BOND_EVAL_TMP c
    on     
           a.M_TYPE=c.M_TYPE
    and    a.I_CODE=c.I_CODE
    and    c.BEG_DATE=v_busi_date
    inner join
           APP.TB_DICT_MAP dm0001
    on     
           dm0001.DICT_CODE='0001'
    and    dm0001.DATA_SOURCE='XIR'
    and    dm0001.DICT_KEY is not null
    and    a.M_TYPE=dm0001.SOURCE_KEY
    where  b.I_CODE is not null or c.I_CODE is not null
    ;

    /*07:*/o_return_msg:='07';
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
       o_return_msg  := 'APP.PR_DATA_ETL_XIR_007执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



