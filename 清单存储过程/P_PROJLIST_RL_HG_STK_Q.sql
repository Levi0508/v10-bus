Create or Replace PROCEDURE "THJS"."P_PROJLIST_RL_HG_STK_Q" (O_CURSOR out types.cursorType,
                                                                  i_order in char                                                  
                                                   ) as

  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20191021
  --模块编号：
  --模块名称：清单管理
  --功能名称：清单管理-限制清单合规导出查询
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'P_PROJLIST_RL_HG_STK_Q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_sql          varchar2(32767);
  v_order	     varchar2(500);
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  if i_order is null or trim(i_order)='' then
    v_order := ' order by rl_fill_time';
  else
    v_order := ' ' || i_order;
  end if;
  
  delete from thjs.t_projlist_stk_tmp;
  v_sql := 'insert into thjs.t_projlist_stk_tmp
            select tt.*, row_number() over(partition by null '||v_order||') as rn
             from(
  			select row_number() over(partition by null order by t.projid,stkcode) as rowno,
		           t.stkcode,
		           t.custname,
		           t.projtype,
		           t.rl_fill_time --入限制清单填报日期
		      from (select t.projid,
		                   t.custname, --客户名称
		                   case
		                     when t.stkcode is null or t.stkcode like ''A%'' then --剔除A开头股票
		                      null
		                     else
		                      t.windcode --20201026 邮件输出带市场的wind代码 t.stkcode
		                   end as stkcode, --证券代码
		                   case
		                     when t.stkcode is null or t.stkcode like ''A%'' then --剔除A开头股票
		                      null
		                     else
		                      t.stkname
		                   end as stkname, --股票简称
		                   t.projtype, --业务类型
		                   to_char(t.rl_fill_time, ''YYYY-MM-DD HH24:MI:SS'') as rl_fill_time, --入限制清单填报日期           
		                   ''母公司投行'' as source_type
		              from thjs.vw_projlist_stk t
		             where t.projlist_status = ''rl''
		            union all
		            select to_char(x.seqno),
		                   x.companyname,
		                   x.windcode,
		                   x.stkname,
		                   x.projtype,
		                   to_char(x.in_date, ''YYYY-MM-DD'') as rl_fill_time,
		                   ''香港国际'' as source_type
		              from thjs.vw_projlist_xggj x
		             where x.projlist_status = ''rl'') t) tt';
		             
  execute immediate v_sql;
  
  --同限制清单汇总表及变动表 邮件中限制清单sheet
  open O_CURSOR for
    select t.*
      from thjs.t_projlist_stk_tmp t
     order by t.rn;

  commit;

  ------------------------
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