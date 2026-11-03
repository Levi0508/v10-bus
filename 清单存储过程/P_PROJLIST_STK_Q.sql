Create or Replace procedure "THJS"."P_PROJLIST_STK_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                  i_comp_name   in varchar2, --公司名称
                                                  i_stk_code    in varchar2, --证券代码
                                                  i_stk_name    in varchar2, --股票简称
                                                  o_return_msg  out varchar2,
                                                  o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190426
  --模块编号：
  --模块名称：清单管理 - 清单信息查询 - 股票上市公司自动匹配查询
  --功能名称：清单信息查询
  ----------------------------------------------------------------------------------
  --v101 ylt 20201022 匹配范围加上科创板，且查询返回新增带市场信息的股票代码
  --v102 ylt 20201026 传入查询的股票代码不足5位的自动补足5位（港股4-5位）
  --v103 ylt 20210115 只匹配当前有效的证券
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_projlist_stk_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_count    integer default 0;
  v_stk_code varchar2(20);
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  v_tradedate := to_char(sysdate, 'yyyyMMdd');
  v_stk_code  := substr('00000', length(i_stk_code) + 1) || i_stk_code; --v102+

  --根据传入参数 ，按证券代码，股票简称，公司名称的优先级进行匹配
  --查询范围：A股 B股 港股
  --多条返回第一条记录 公司名称模糊匹配

  select count(1)
    into v_count
    from (select d.s_info_windcode,
                 d.s_info_code,
                 d.s_info_name,
                 d.s_info_compname
            from wind.tcl_asharedescription d
            --主板A股 zx90.vw_wdzx_asharedescription
          --v101+ start
          union all
          --科创板
          select x.s_info_windcode,
                 x.s_info_code,
                 x.s_info_name,
                 c.comp_name
            from wind.tcl_neeqsdescription x
            left join wind.tcl_compintroduction c
              on c.comp_id = x.s_info_compcode
          --v101+ end
          union all
          select s.s_info_windcode,
                 s.s_info_code,
                 s.s_info_name,
                 c.s_info_compname
            from wind.tcl_hksharedescription s
           inner join wind.tcl_hkcompanyinfo c
              on c.s_info_compcode = s.s_info_compcode
          union all
          select b.s_info_windcode,
                 b.s_info_code,
                 b.s_info_name,
                 b.s_info_compname
            from wind.tcl_bsharedescription b
            
            /*
            select d.s_info_windcode, d.s_info_code, d.s_info_name, d.s_info_compname
                from zx90.tcl_asharedescription d
              --主板A股 zx90.vw_wdzx_asharedescription
              --v103+ start
               where d.s_info_name not like '%终止)'
                 and d.s_info_windcode not like 'A%'
                 and not exists (select 1
                        from wind.neeqsdescription x
                       where x.s_info_compcode = d.s_info_compcode
                         and trim(x.s_info_delistdate) is null
                         and x.s_info_code not like 'T%')
              --v103+ end

              --v101+ start
              union all
              --科创板
              select x.s_info_windcode, x.s_info_code, x.s_info_name, c.comp_name
                from wind.neeqsdescription x
                left join wind.compintroduction c
                  on c.comp_id = x.s_info_compcode
              --v101+ end
              --v103+ start
               where trim(x.s_info_delistdate) is null --未退市 
                 and x.s_info_code not like 'T%' --未挂牌终止
              --v103+ end
              union all

              --港股
              select s.s_info_windcode, s.s_info_code, s.s_info_name, c.s_info_compname
                from zx90.tcl_hksharedescription s
               inner join zx90.tcl_hkcompanyinfo c
                  on c.s_info_compcode = s.s_info_compcode
              --v103+ start
               where s.s_info_name not like '%退市%'
              --v103+ end

              union all
              
              --B股
              select b.s_info_windcode, b.s_info_code, b.s_info_name, b.s_info_compname
                from zx90.tcl_bsharedescription b
              --v103+ start
               where b.s_info_name not like '%退市%'
              --v103+ end
            */
            ) d
   where substr('00000', length(d.s_info_code) + 1) || d.s_info_code =
         v_stk_code;

  if v_count > 0 then
  
    open rt_cursor for
      select d.s_info_windcode, --带市场信息的股票代码v101+
             d.s_info_compname, --上市公司名称
             d.s_info_code, --股票代码
             d.s_info_name --证券名称
        from (select d.s_info_windcode,
                     d.s_info_code,
                     d.s_info_name,
                     d.s_info_compname
                from wind.tcl_asharedescription d
              --v101+ start
              --主板A股 zx90.vw_wdzx_asharedescription
              union all
              --科创板
              select x.s_info_windcode,
                     x.s_info_code,
                     x.s_info_name,
                     c.comp_name
                from wind.tcl_neeqsdescription x
                left join wind.tcl_compintroduction c
                  on c.comp_id = x.s_info_compcode
              --v101+ end
              union all
              select s.s_info_windcode,
                     s.s_info_code,
                     s.s_info_name,
                     c.s_info_compname
                from wind.tcl_hksharedescription s
               inner join wind.tcl_hkcompanyinfo c
                  on c.s_info_compcode = s.s_info_compcode
              union all
              select b.s_info_windcode,
                     b.s_info_code,
                     b.s_info_name,
                     b.s_info_compname
                from wind.tcl_bsharedescription b) d
       where substr('00000', length(d.s_info_code) + 1) || d.s_info_code =
             v_stk_code
         and rownum = 1;
  else
  
    select count(1)
      into v_count
      from (select d.s_info_windcode,
                   d.s_info_code,
                   d.s_info_name,
                   d.s_info_compname
              from wind.tcl_asharedescription d
            --v101+ start
            --主板A股 zx90.vw_wdzx_asharedescription
            union all
            --科创板
            select x.s_info_windcode,
                   x.s_info_code,
                   x.s_info_name,
                   c.comp_name
              from wind.tcl_neeqsdescription x
              left join wind.tcl_compintroduction c
                on c.comp_id = x.s_info_compcode
            --v101+ end
            union all
            select s.s_info_windcode,
                   s.s_info_code,
                   s.s_info_name,
                   c.s_info_compname
              from wind.tcl_hksharedescription s
             inner join wind.tcl_hkcompanyinfo c
                on c.s_info_compcode = s.s_info_compcode
            union all
            select b.s_info_windcode,
                   b.s_info_code,
                   b.s_info_name,
                   b.s_info_compname
              from wind.tcl_bsharedescription b) d
     where d.s_info_name = i_stk_name;
  
    if v_count > 0 then
    
      open rt_cursor for
        select d.s_info_windcode, --带市场信息的股票代码v101+
               d.s_info_compname, --上市公司名称
               d.s_info_code, --股票代码
               d.s_info_name --证券名称
          from (select d.s_info_windcode,
                       d.s_info_code,
                       d.s_info_name,
                       d.s_info_compname
                  from wind.tcl_asharedescription d
                --v101+ start
                --主板A股 zx90.vw_wdzx_asharedescription
                union all
                --科创板
                select x.s_info_windcode,
                       x.s_info_code,
                       x.s_info_name,
                       c.comp_name
                  from wind.tcl_neeqsdescription x
                  left join wind.tcl_compintroduction c
                    on c.comp_id = x.s_info_compcode
                --v101+ end
                union all
                select s.s_info_windcode,
                       s.s_info_code,
                       s.s_info_name,
                       c.s_info_compname
                  from wind.tcl_hksharedescription s
                 inner join wind.tcl_hkcompanyinfo c
                    on c.s_info_compcode = s.s_info_compcode
                union all
                select b.s_info_windcode,
                       b.s_info_code,
                       b.s_info_name,
                       b.s_info_compname
                  from wind.tcl_bsharedescription b) d
         where d.s_info_name = i_stk_name
           and rownum = 1;
    
    else
    
      open rt_cursor for
        select d.s_info_windcode, --带市场信息的股票代码v101+
               d.s_info_compname, --上市公司名称
               d.s_info_code, --股票代码
               d.s_info_name --证券名称
          from (select d.s_info_windcode,
                       d.s_info_code,
                       d.s_info_name,
                       d.s_info_compname
                  from wind.tcl_asharedescription d
                --v101+ start
                --主板A股 zx90.vw_wdzx_asharedescription
                union all
                --科创板
                select x.s_info_windcode,
                       x.s_info_code,
                       x.s_info_name,
                       c.comp_name
                  from wind.tcl_neeqsdescription x
                  left join wind.tcl_compintroduction c
                    on c.comp_id = x.s_info_compcode
                --v101+ end
                union all
                select s.s_info_windcode,
                       s.s_info_code,
                       s.s_info_name,
                       c.s_info_compname
                  from wind.tcl_hksharedescription s
                 inner join wind.tcl_hkcompanyinfo c
                    on c.s_info_compcode = s.s_info_compcode
                union all
                select b.s_info_windcode,
                       b.s_info_code,
                       b.s_info_name,
                       b.s_info_compname
                  from wind.tcl_bsharedescription b) d
         where instr(d.s_info_compname, i_comp_name) > 0
           and rownum = 1;
    
    end if;
  end if;

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