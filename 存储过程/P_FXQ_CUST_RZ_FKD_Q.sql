Create or Replace procedure "THJS"."P_FXQ_CUST_RZ_FKD_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                     i_client_id     in integer, --客户id
                                                     i_usercode    in varchar2, --查询人
                                                     o_return_msg  out varchar2,
                                                     o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20191125
  --模块编号：
  --模块名称：投行反洗钱 - 客户基本信息（融资端）-反馈结果描述查询
  --功能名称：
  ----------------------------------------------------------------------------------
  --v101 YLT@GTJA 20210303 新增风险筛查描述

  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_fxq_cust_rz_fkd_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_count       integer default 0;
  v_client_id     varchar2(100);
  v_ztgs_count  integer default 0;
  v_ztgs_name   varchar2(200);
  v_index_count integer default 0;
  v_fk_flag     char(1) default '0'; --反馈结果查看权限标识
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  open rt_cursor for
    select r.client_id,
           r.client_name,
           r.screen_code, --风险名单筛查 0/1
           r.screen_name, --风险名单筛查描述 不涉及/涉及
           case
             when rst.if_a is null then
              ''
             else
              decode(rst.if_a,
                     'A1',
                     '黑名单',
                     'A2',
                     '特定自然人及其特定关系人',
                     'A3',
                     '高风险国家或者地区',
                     --v101+ start
                     'A4',
                     '其他国际制裁名单',
                     'A5',
                     '国内政要',
                     'A6',
                     '其他',
                     --v101+ end
                     '') || '（道琼斯ID：' || rst.exposed_id || '）'
           end as problem_desc
      from thjs.vw_fxq_cust_rsk r
      left join (select distinct --v101+
                                 t.sc_client_id,
                                 t.exposed_id,
                                 regexp_substr(t.if_a, '[^,]+', 1, l) as if_a
                   from (select t.sc_client_id, t.if_a, t.exposed_id
                           from (select max(t.busi_date) over(partition by t.sc_client_id) as max_date,
                                        t.*
                                   from thjs.tb_fxq_cust_rz_rst t) t
                          where t.busi_date = t.max_date
                         union
                         select t.cust_id, t.risk_type, t.risk_id
                           from thjs.tb_fxq_cust_rsk_zhlc t --实时核查表，历史以反洗钱系统返回为准
                          where t.risk_id is not null
                            and to_char(t.create_date, 'yyyyMMdd') =
                                v_tradedate) t --显示涉及的相关类型及涉及方（客户本身、控制人、股东等 需要增加采集字段）
                   left join (select level as l
                               from dual
                             /*connect by level <= 3*/ --v101-
                             connect by level <= 6)
                     on l <=
                        length(t.if_a) - length(replace(t.if_a, ',', '')) + 1) rst
        on rst.sc_client_id = r.client_id
     where r.client_id = i_client_id
      /*union
    select r.client_id,
           r.client_name,
           r.screen_code, --风险名单筛查 0/1
           r.screen_name, --风险名单筛查描述 不涉及/涉及
           case
             when rst.if_risk_client is null then
              ''
             else
              decode(rst.problem_desc,
                     'A1',
                     '黑名单',
                     'A2',
                     '特定自然人及其特定关系人',
                     'A3',
                     '高风险国家或者地区',
                     --v101+ start
                     'A4',
                     '其他国际制裁名单',
                     'A5',
                     '国内政要',
                     'A6',
                     '其他',
                     --v101+ end
                     '') || '（道琼斯ID：' || rst.exposed_id || '）'
           end as problem_desc
      from thjs.vw_fxq_cust_rsk r
      left join thjs.t_th_feedback_results rst
        on r.client_id = rst.client_id
     where r.client_id = i_client_id*/;

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
