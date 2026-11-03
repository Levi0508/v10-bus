Create or Replace procedure "THJS"."P_PROJLIST_MULTISTK_S" (i_projid          in varchar2, --项目id
                                                       i_fill_id         in varchar2, --填报批次id， 多条记录提交，每次调用fill_id相同
                                                       i_comp_name       in varchar2, --上市公司名称
                                                       i_stk_name        in varchar2, --股票简称
                                                       i_stk_code        in varchar2, --证券代码
                                                       i_write_date      in varchar2, --填报日期
                                                       i_projlist_status in varchar2, --清单状态
                                                       i_submit_status   in varchar2, --提交状态 0 草稿 1 提交 
                                                       --v102+ start
                                                       i_related_property in varchar2, --关联性质：1-客户其他代码/2-交易对手方/3-交易标的/4-其他
                                                       i_ralated_ramark  in varchar2, --关联性质备注
                                                       --v102+ end
                                                       --v103+ start
                                                       i_clear_flag       in varchar2, --是否清空关联公司 1-是 0-否
                                                       --v103+ end
                                                       i_usercode    in varchar2, --操作员
                                                       o_return_msg  out varchar2,
                                                       o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190510
  --模块编号：
  --模块名称：清单管理 - 清单填报页面信息保存 - 关联多上市公司明细
  --功能名称：清单填报页面信息保存
  ----------------------------------------------------------------------------------
  --v101 ylt 20201022 新增带市场信息的股票代码
  --v102 ylt 20201113 关联多家上市公司信息，新增【关联性质】及【备注】字段

  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_projlist_multistk_s'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_count integer default 0;
  --v101+ start
  return_msg  varchar2(100);
  return_code integer;
  rcursor     sys_refcursor;
  cursor tmpcursor is
    select t.s_info_windcode,
           t.s_info_code,
           t.s_info_name,
           t.s_info_compname
      from thjs.vw_wdzx_asharedescription t
     where rownum = 1;
  r          tmpcursor%rowtype;
  v_windcode varchar2(100);
  v_stk_code varchar2(100);
  --v101+ end
  --=============================================================
  -- 业务处理过程
  --=============================================================

begin

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  --v101+ start
  /* insert into thjs.tb_exec_log
    (log_id, proc_name, proc_param, exec_time)
  values
    (thjs.tb_exec_log_id_seq.nextval,
     'p_projlist_multistk_s',
     'i_projid:' || i_projid || '-' || 'i_fill_id:' || i_fill_id || '-' ||
     'i_comp_name:' || i_comp_name || '-' || 'i_stk_name:' || i_stk_name || '-' ||
     'i_stk_code:' || i_stk_code || '-' || 'i_write_date:' || i_write_date || '-' ||
     'i_projlist_status:' || i_projlist_status || '-' || 'i_submit_status:' ||
     i_submit_status || '-' || 'i_related_property:' || i_related_property || '-' ||
     'i_ralated_ramark:' || i_ralated_ramark || '-' || 'i_usercode:' ||
     i_usercode,
     sysdate);
  commit;*/
  --v101+ end

  select count(1)
    into v_count
    from thjs.tb_projlist_main m
   where m.projid = i_projid;
   
  
  
  if v_count = 1 and i_comp_name is null then
  	update thjs.tb_projlist_main m
       	set m.multistk_id = i_fill_id
     	where m.projid = i_projid;
    commit;
  end if;

  if v_count = 1 and i_comp_name is not null then
  
    --v101+ start
    v_stk_code := i_stk_code;
    if i_stk_code is not null then
      	select case
             when instr(v_stk_code, '.') > 0 then
                substr(v_stk_code, 0, instr(v_stk_code, '.') - 1)
             else
                v_stk_code
             end stk_code
        into v_stk_code
        from dual;
    end if;
  
    --获取带市场信息的股票代码
    thjs.p_projlist_stk_q(rcursor,
                         i_comp_name,
                         v_stk_code,
                         i_stk_name,
                         return_msg,
                         return_code);
    loop
      fetch rcursor
        into r;
      exit when rcursor%notfound;
      v_windcode := r.s_info_windcode;
    end loop;
    --v101+ end
  
    --保存关联多上市公司信息
    insert into thjs.tb_projlist_multistk
      (busidate,
       projid,
       fill_id,
       comp_name,
       stk_name,
       stk_code,
       write_date,
       create_user,
       windcode --v101+
       --v102+ start
       ,related_property,
       ralated_ramark
       --v102+ end
       )
    values
      (v_tradedate,
       i_projid,
       i_fill_id,
       i_comp_name,
       i_stk_name,
       i_stk_code,
       i_write_date,
       i_usercode,
       v_windcode --v101+
       --v102+ start
       ,i_related_property,
       i_ralated_ramark
       --v102+ end
      );
  
    --更新清单主表中的关联多家上市公司填报ID
    update thjs.tb_projlist_main m
       set m.multistk_id = i_fill_id
     where m.projid = i_projid;
    commit;
  
    --v101+ start
    --首次全量更新tb_projlist_multistk中的windcode
    /*
    merge into thjs.tb_projlist_multistk t
    using (select d.s_info_windcode, --带市场信息的股票代码
                  d.s_info_compname, --上市公司名称
                  d.s_info_code, --股票代码
                  d.s_info_name, --证券名称
                  t.fill_id， t.stk_code
             from --主板A股
                  (select d.s_info_windcode,
                          d.s_info_code,
                          d.s_info_name,
                          d.s_info_compname
                     from zx90.tcl_asharedescription d
                   union all
                   --科创板
                   select x.s_info_windcode,
                          x.s_info_code,
                          x.s_info_name,
                          c.comp_name
                     from wind.neeqsdescription x
                     left join wind.compintroduction c
                       on c.comp_id = x.s_info_compcode
                   union all
                   select s.s_info_windcode,
                          s.s_info_code,
                          s.s_info_name,
                          c.s_info_compname
                     from zx90.tcl_hksharedescription s
                    inner join zx90.tcl_hkcompanyinfo c
                       on c.s_info_compcode = s.s_info_compcode
                   union all
                   select b.s_info_windcode,
                          b.s_info_code,
                          b.s_info_name,
                          b.s_info_compname
                     from zx90.tcl_bsharedescription b) d
            inner join thjs.tb_projlist_multistk t
               on case
                    when instr(t.stk_code, '.') > 0 then
                     substr(substr('00000', length(t.stk_code) + 1) || t.stk_code,
                            0,
                            instr(t.stk_code, '.') - 1)
                    else
                     substr('00000', length(t.stk_code) + 1) || t.stk_code
                  end =
                  substr('00000', length(d.s_info_code) + 1) || d.s_info_code) d
    on (t.fill_id = d.fill_id and t.stk_code = d.stk_code)
    when matched then
      update set t.windcode = nvl(d.s_info_windcode, t.stk_code);
    commit;
    */
  
    --没有匹配上的将输入的stkcode更新为windcode
    update thjs.tb_projlist_multistk t
       set t.windcode = t.stk_code
     where t.windcode is null;
    commit;
    --v101+ end
  
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