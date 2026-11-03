Create or Replace procedure "THJS"."P_PROJLIST_MULTISTK_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                       i_projid      in varchar2,
                                                       i_usercode    in varchar2, --查询用户
                                                       o_return_msg  out varchar2,
                                                       o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190510
  --模块编号：
  --模块名称：清单管理 - 清单填报页信息查询 - 关联多上市公司信息查询
  --功能名称：清单填报页信息查询
  ----------------------------------------------------------------------------------
  --v101 ylt 20201022 新增带市场信息的股票代码
  --v102 ylt 20201113 关联多家上市公司信息，新增【关联性质】及【备注】字段
  
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_projlist_multistk_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  open rt_cursor for
    select m.busidate, --填业务日期
           m.projid, --项目id
           m.fill_id, --填报批次id
           m.comp_name, --上市公司名称
           m.stk_name, --股票简称
           m.stk_code, --证券代码
           m.write_date, --填报日期
           m.create_user, --操作人员
           m.create_time --操作时间
           ,m.windcode--带市场信息的股票代码 v101+
            --v102+ start
           ,m.related_property, --关联性质：1-客户其他代码/2-交易对手方/3-交易标的/4-其他
           m.ralated_ramark, --关联性质为4-其他时填写备注信息
           1 data_flag
           --v102+ end
      from thjs.tb_projlist_multistk m
     inner join thjs.tb_projlist_main p
        on p.projid = m.projid
       and p.multistk_id = m.fill_id
     where m.projid = i_projid
     order by m.create_time--v102+
     ;

  commit;

  o_return_msg  := '执行成功';
  o_return_code := 0;

exception
  -- 非预定义异常处理
  when v_userexp then
    rollback;
  
    v_sqlerrm := sqlerrm;
    v_sqlcode := sqlcode;
    v_sqlerrl := dbms_utility.format_error_backtrace();
  
    thjs.p_write_error_log(i_tradedate    => v_tradedate,
                            i_exec_func_id => v_exec_func_id,
                            i_func_own     => v_func_own,
                            i_func_name    => v_func_name,
                            i_occur_time   => sysdate,
                            i_sqlerrm      => v_sqlerrm,
                            i_sqlcode      => v_sqlcode,
                            i_sqlerrl      => v_sqlerrl);
    commit;
    raise;
    -- 预定义异常处理
  when others then
    rollback;
  
    v_sqlerrm := sqlerrm;
    v_sqlcode := sqlcode;
    v_sqlerrl := dbms_utility.format_error_backtrace();
  
    thjs.p_write_error_log(i_tradedate    => v_tradedate,
                            i_exec_func_id => v_exec_func_id,
                            i_func_own     => v_func_own,
                            i_func_name    => v_func_name,
                            i_occur_time   => sysdate,
                            i_sqlerrm      => v_sqlerrm,
                            i_sqlcode      => v_sqlcode,
                            i_sqlerrl      => v_sqlerrl);
    commit;
    raise;
end;