Create or Replace procedure "THJS"."P_PROJLIST_MAIN_Q" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                   i_projid      in varchar2, --项目编号，接口传入指定项目
                                                   i_username    in varchar2,
                                                   i_projname    in varchar2,
                                                   i_khname      in varchar2,
                                                   i_page_num    in number default 0, --默认值0,
                                                   i_page_size   in number default 0, --默认值0  如果i_page_num，i_page_size都为0 则不分页，查询全部
                                                   i_order in char,                                                   
                                                   o_total_count out integer,
                                                   o_return_msg  out varchar2,
                                                   o_return_code out integer) is
  ----------------------------------------------------------------------------------
  --版    权：GTJA
  --版    本：1.0.0
  --开发人员：CZC@GTJA
  --创建日期：20190426
  --模块编号：
  --模块名称：清单管理 - 清单信息查询
  --功能名称：清单信息查询
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp exception; -- 用户定义错
  v_tradedate    varchar2(8); -- 任务执行时间(业务日期)
  v_exec_func_id integer default '0'; -- 任务id
  v_func_own     varchar2(20) default 'thjs'; -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_projlist_main_q'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000); -- 错误提示信息
  v_sqlcode      number; -- 错误代码
  v_sqlerrl      varchar2(4000); -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_superuser  integer default 0;
  v_user_pcode varchar2(100);
  v_pcode      varchar2(100);
  v_page_num  number default 0;
  v_page_size number;
  --============================================================
  -- 业务处理过程
  v_order	varchar2(500);
  v_sql	    varchar2(32767);
  --=============================================================
begin
  dbms_output.enable();
  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  --判断是否超级用户

  select count(1)
    into v_superuser
    from table(thjs.splitstr('admin,chenhaiyang,huangzhichang,hechuan', ',')) t
   where instr(',' || t.column_value || ',', ',' || i_username || ',') > 0;

  delete from thjs.TMP_USER_PROJID;
  
  commit;

  --获取用户所在组

  if v_superuser = 0 then
    /*select t.p_code
     into v_user_pcode
     from thjs.vw_userinfo_tree t
    where t.ccode = i_username;*/
    delete from thjs.TMP_USER_PROJINFO t where t.username = i_username;
    insert into thjs.TMP_USER_PROJINFO
      (username, projid)
      select u.user_name, t.proj_id
        from THJS.IB_V_FINANCE_PROJMEMBER t
       inner join BASIC_THJS.wb_user u
          on u.user_id = t.workno
      /*inner join thjs.ib_v_gtja_empname e
         on e.workno = t.workno
      where e.username = i_username*/
       where u.user_name = i_username
         and t.projrole = '项目负责人'; --只有项目负责人可以填报清单
    /*where exists (select *
     from thjs.vw_userinfo_tree_root r
    where r.root_code = v_user_pcode
      and r.ccode = e.username);*/  

  end if;

  if i_page_num is not null then
    v_page_num := i_page_num;
  end if;
  
  if i_order is null or trim(i_order)='' then
    v_order := ' order by update_time';
  else
    v_order := ' ' || i_order;
  end if;

  if v_superuser = 0 then
  
  --统计记录条数
  if v_page_num < 1 then 
    SELECT sum(cnt)
      into o_total_count
      FROM (select count(1) cnt
              from thjs.vw_projlist_main_all p
        left join thjs.tb_ib_cust_info c
          on c.projid = p.projid
        left join thjs.tb_projlist_inout ro
          on ro.projid = p.projid
         and ro.inout_id = p.robserve_id
        left join thjs.tb_projlist_inout co
          on co.projid = p.projid
         and co.inout_id = p.cobserve_id
        left join thjs.tb_projlist_inout rl
          on rl.projid = p.projid
         and rl.inout_id = p.rlimit_id
        left join thjs.tb_projlist_inout cl
          on cl.projid = p.projid
         and cl.inout_id = p.climit_id
        left join thjs.tb_projlist_inout rq
          on rq.projid = p.projid
         and rq.inout_id = p.rquiet_id
        left join thjs.tb_projlist_inout cq
          on cq.projid = p.projid
         and cq.inout_id = p.cquiet_id
        left join (select m.projid, m.fill_id, count(1) as cn
                     from thjs.tb_projlist_multistk m
                    group by m.projid, m.fill_id) m
          on m.projid = p.projid
         and m.fill_id = p.multistk_ID
       where (i_projid is null or p.projid = i_projid)
         and (i_projname is null or instr(p.projname, i_projname) > 0)
         and (i_khname is null or instr(p.custname, i_khname) > 0)
         and exists (select t.projid
                from thjs.TMP_USER_PROJINFO t
               where t.username = i_username
                 and t.projid = p.projid)); --用户相关， 用户所在上级下属所有  

  end if;

  if i_page_size is not null and i_page_size <> 0 then
    v_page_size := i_page_size;
  else
    v_page_size := o_total_count;
  end if;

    --非超级用户 根据登录用户 显示用户及用户所属组权限项目   
    delete from thjs.t_projlist_main_all_tmp ;
    v_sql := 'insert into thjs.t_projlist_main_all_tmp(
    SOURCE_FLAG,PROJID,PROJNAME,PROJTYPE,CUSTID,CUSTNAME,STKCODE,STKNAME,GTJAROLE,RO_INOUT_DATE,RO_INOUT_REASON,RO_INOUT_REMARK,RO_FILEPATH,CO_INOUT_DATE,CO_INOUT_REASON,CO_INOUT_REMARK,CO_FILEPATH,RL_INOUT_DATE,RL_INOUT_REASON,RL_INOUT_REMARK,RL_FILEPATH,CL_INOUT_DATE,CL_INOUT_REASON,CL_INOUT_REMARK,CL_FILEPATH,RQ_INOUT_DATE,CQ_INOUT_DATE,PROJLIST_STATUS,MULTI_STK,UPDATE_TIME,RN,CHECK_RESULT,CHECK_DATE)
    select SOURCE_FLAG,PROJID,PROJNAME,PROJTYPE,CUSTID,CUSTNAME,STKCODE,STKNAME,GTJAROLE,RO_INOUT_DATE,RO_INOUT_REASON,RO_INOUT_REMARK,RO_FILEPATH,CO_INOUT_DATE,CO_INOUT_REASON,CO_INOUT_REMARK,CO_FILEPATH,RL_INOUT_DATE,RL_INOUT_REASON,RL_INOUT_REMARK,RL_FILEPATH,CL_INOUT_DATE,CL_INOUT_REASON,CL_INOUT_REMARK,CL_FILEPATH,RQ_INOUT_DATE,CQ_INOUT_DATE,PROJLIST_STATUS,MULTI_STK,UPDATE_TIME,RN,CHECK_RESULT,CHECK_DATE
         from (
            select t.*,
                    row_number() over(partition by null '|| v_order || '/*order by t.update_time desc*/) as rn
              from (
      select decode(p.source_flag, ''0'', ''新增'', ''历史'') as source_flag, --来源标志
             p.projid, --项目编号
             p.projname, --项目名称
             p.projtype, --项目类型
             p.custid, --客户编号
             p.custname, --客户名称
             p.stkcode, --证券代码
             p.stkname, --证券名称
             p.gtjarole, --我司角色
             ro.inout_date as ro_inout_date, --入观察清单日期
             ro.inout_reason as ro_inout_reason, --入观察清单事由
             ro.inout_remark as ro_inout_remark, --入观察清单备注
             ro.filepath as ro_filepath, --入观察清单附件
             co.inout_date as co_inout_date, --出观察清单日期
             co.inout_reason as co_inout_reason, --出观察清单事由
             co.inout_remark as co_inout_remark, --出观察清单备注
             co.filepath as co_filepath, --出观察清单附件
             rl.inout_date as rl_inout_date, --入限制清单日期
             rl.inout_reason as rl_inout_reason, --入限制清单事由
             rl.inout_remark as rl_inout_remark, --入限制清单备注
             rl.filepath as rl_filepath, --入限制清单附件
             cl.inout_date as cl_inout_date, --出限制清单日期
             cl.inout_reason as cl_inout_reason, --出限制清单事由
             cl.inout_remark as cl_inout_remark, --出限制清单备注
             cl.filepath as cl_filepath, --出限制清单附件
             rq.inout_date as rq_inout_date, --入静默期日期
             --rq.inout_reason   as rq_inout_reason, --入静默期事由
             --rq.inout_remark   as rq_inout_remark, --入静默期备注
             --rq.filepath       as rq_filepath, --入静默期附件
             cq.inout_date as cq_inout_date, --出静默期日期
             --cq.inout_reason   as cq_inout_reason, --出静默期事由
             --cq.inout_remark   as cq_inout_remark, --出静默期备注
             --cq.filepath       as cq_filepath, --出静默期附件
             decode(c.pro_is_valid,
                    ''1'',
                    p.projlist_status,
                    ''失效项目-'' || p.projlist_status) as projlist_status, --清单状态
             nvl(m.cn, 0) as multi_stk, --项目是否关联多家上市公司 0 否 1 是
             p.update_time,
             case when rs.projid is null then ''2'' else
               decode(rs.check_result_sum,0,''0'',''1'') end as check_result,
		   rr.check_date
        from thjs.vw_projlist_main_all p
        left join thjs.tb_ib_cust_info c
          on c.projid = p.projid
        left join thjs.tb_projlist_inout ro
          on ro.projid = p.projid
         and ro.inout_id = p.robserve_id
        left join thjs.tb_projlist_inout co
          on co.projid = p.projid
         and co.inout_id = p.cobserve_id
        left join thjs.tb_projlist_inout rl
          on rl.projid = p.projid
         and rl.inout_id = p.rlimit_id
        left join thjs.tb_projlist_inout cl
          on cl.projid = p.projid
         and cl.inout_id = p.climit_id
        left join thjs.tb_projlist_inout rq
          on rq.projid = p.projid
         and rq.inout_id = p.rquiet_id
        left join thjs.tb_projlist_inout cq
          on cq.projid = p.projid
         and cq.inout_id = p.cquiet_id
        left join (select r.projid,r.check_id, r.check_result,to_char(r.update_time,''yyyymmdd'') as check_date,
					    row_number() over(partition by r.projid order by r.update_time desc) as rn
				   from thjs.tb_projlist_check_result r) rr
	    on p.projid = rr.projid
	   and rr.rn = 1
	   left join (select b.projid,b.check_id,sum(decode(b.check_result,''0'',0,1)) as check_result_sum
       from  thjs.TB_PROJLIST_CHECK_RESULT b
        group by b.projid,b.check_id)rs
       on p.projid=rs.projid
       and rr.check_id=rs.check_id  
        left join (select m.projid, m.fill_id, count(1) as cn
                     from thjs.tb_projlist_multistk m
                    group by m.projid, m.fill_id) m
          on m.projid = p.projid
         and m.fill_id = p.multistk_ID
       where ('''||i_projid||''' is null or p.projid = '''||i_projid||''')
         and ('''||i_projname||''' is null or instr(p.projname, '''||i_projname||''') > 0)
         and ('''||i_khname||''' is null or instr(p.custname, '''||i_khname||''') > 0)
         and exists (select t.projid
                from thjs.TMP_USER_PROJINFO t
               where t.username = '''||i_username||'''
                 and t.projid = p.projid) --用户相关， 用户所在上级下属所有         
       order by p.source_flag, p.update_time desc) t)r';
    
    execute immediate v_sql;
    
    open rt_cursor for
      select r.*
        from thjs.t_projlist_main_all_tmp r
     where r.rn > v_page_num
       and r.rn <= v_page_num + v_page_size
     order by r.rn;
  
  else

  --统计记录条数
  if v_page_num < 1 then

    SELECT sum(cnt)
      into o_total_count
      FROM (select count(1) cnt
              from thjs.vw_projlist_main_all p
        left join thjs.tb_ib_cust_info c
          on c.projid = p.projid
        left join thjs.tb_projlist_inout ro
          on ro.projid = p.projid
         and ro.inout_id = p.robserve_id
        left join thjs.tb_projlist_inout co
          on co.projid = p.projid
         and co.inout_id = p.cobserve_id
        left join thjs.tb_projlist_inout rl
          on rl.projid = p.projid
         and rl.inout_id = p.rlimit_id
        left join thjs.tb_projlist_inout cl
          on cl.projid = p.projid
         and cl.inout_id = p.climit_id
        left join thjs.tb_projlist_inout rq
          on rq.projid = p.projid
         and rq.inout_id = p.rquiet_id
        left join thjs.tb_projlist_inout cq
          on cq.projid = p.projid
         and cq.inout_id = p.cquiet_id
        left join (select m.projid, m.fill_id, count(1) as cn
                     from thjs.tb_projlist_multistk m
                    group by m.projid, m.fill_id) m
          on m.projid = p.projid
         and m.fill_id = p.multistk_ID
       where (i_projid is null or p.projid = i_projid)
         and (i_projname is null or instr(p.projname, i_projname) > 0)
         and (i_khname is null or instr(p.custname, i_khname) > 0) --超级用户查询所选节点，管理人员权限待确定
         );

  end if;

  if i_page_size is not null and i_page_size <> 0 then
    v_page_size := i_page_size;
  else
    v_page_size := o_total_count;
  end if;
  
  if i_order is null or trim(i_order)='' then
    v_order := ' order by update_time';
  else
    v_order := ' ' || i_order;
  end if;

    --超级用户根据所选择用户组或用户 查询
    delete from thjs.t_projlist_main_all_tmp;
    v_sql := 'insert into thjs.t_projlist_main_all_tmp(
    SOURCE_FLAG,PROJID,PROJNAME,PROJTYPE,CUSTID,CUSTNAME,STKCODE,STKNAME,GTJAROLE,RO_INOUT_DATE,RO_INOUT_REASON,RO_INOUT_REMARK,RO_FILEPATH,CO_INOUT_DATE,CO_INOUT_REASON,CO_INOUT_REMARK,CO_FILEPATH,RL_INOUT_DATE,RL_INOUT_REASON,RL_INOUT_REMARK,RL_FILEPATH,CL_INOUT_DATE,CL_INOUT_REASON,CL_INOUT_REMARK,CL_FILEPATH,RQ_INOUT_DATE,CQ_INOUT_DATE,PROJLIST_STATUS,MULTI_STK,UPDATE_TIME,RN,CHECK_RESULT,CHECK_DATE)
    select SOURCE_FLAG,PROJID,PROJNAME,PROJTYPE,CUSTID,CUSTNAME,STKCODE,STKNAME,GTJAROLE,RO_INOUT_DATE,RO_INOUT_REASON,RO_INOUT_REMARK,RO_FILEPATH,CO_INOUT_DATE,CO_INOUT_REASON,CO_INOUT_REMARK,CO_FILEPATH,RL_INOUT_DATE,RL_INOUT_REASON,RL_INOUT_REMARK,RL_FILEPATH,CL_INOUT_DATE,CL_INOUT_REASON,CL_INOUT_REMARK,CL_FILEPATH,RQ_INOUT_DATE,CQ_INOUT_DATE,PROJLIST_STATUS,MULTI_STK,UPDATE_TIME,RN,CHECK_RESULT,CHECK_DATE
        from (
            select t.*,
                    row_number() over(partition by null '||v_order||'/*order by t.update_time desc*/) as rn
              from (
      select decode(p.source_flag, ''0'', ''新增'', ''历史'') as source_flag, --来源标志
             p.projid, --项目编号
             p.projname, --项目名称
             p.projtype, --项目类型
             p.custid, --客户编号
             p.custname, --客户名称
             p.stkcode, --证券代码
             p.stkname, --证券名称
             p.gtjarole, --我司角色
             ro.inout_date as ro_inout_date, --入观察清单日期
             ro.inout_reason as ro_inout_reason, --入观察清单事由
             ro.inout_remark as ro_inout_remark, --入观察清单备注
             ro.filepath as ro_filepath, --入观察清单附件
             co.inout_date as co_inout_date, --出观察清单日期
             co.inout_reason as co_inout_reason, --出观察清单事由
             co.inout_remark as co_inout_remark, --出观察清单备注
             co.filepath as co_filepath, --出观察清单附件
             rl.inout_date as rl_inout_date, --入限制清单日期
             rl.inout_reason as rl_inout_reason, --入限制清单事由
             rl.inout_remark as rl_inout_remark, --入限制清单备注
             rl.filepath as rl_filepath, --入限制清单附件
             cl.inout_date as cl_inout_date, --出限制清单日期
             cl.inout_reason as cl_inout_reason, --出限制清单事由
             cl.inout_remark as cl_inout_remark, --出限制清单备注
             cl.filepath as cl_filepath, --出限制清单附件
             rq.inout_date as rq_inout_date, --入静默期日期
             --rq.inout_reason   as rq_inout_reason, --入静默期事由
             --rq.inout_remark   as rq_inout_remark, --入静默期备注
             --rq.filepath       as rq_filepath, --入静默期附件
             cq.inout_date as cq_inout_date, --出静默期日期
             --cq.inout_reason   as cq_inout_reason, --出静默期事由
             --cq.inout_remark   as cq_inout_remark, --出静默期备注
             --cq.filepath       as cq_filepath, --出静默期附件
             decode(c.pro_is_valid,
                    ''1'',
                    p.projlist_status,
                    ''失效项目-'' || p.projlist_status) as projlist_status, --清单状态
             nvl(m.cn, 0) as multi_stk, --项目是否关联多家上市公司 0 否 1 是
             p.update_time,
             case when rs.projid is null then ''2'' else
               decode(rs.check_result_sum,0,''0'',''1'') end as check_result,
		   rr.check_date
        from thjs.vw_projlist_main_all p
        left join thjs.tb_ib_cust_info c
          on c.projid = p.projid
        left join thjs.tb_projlist_inout ro
          on ro.projid = p.projid
         and ro.inout_id = p.robserve_id
        left join thjs.tb_projlist_inout co
          on co.projid = p.projid
         and co.inout_id = p.cobserve_id
        left join thjs.tb_projlist_inout rl
          on rl.projid = p.projid
         and rl.inout_id = p.rlimit_id
        left join thjs.tb_projlist_inout cl
          on cl.projid = p.projid
         and cl.inout_id = p.climit_id
        left join thjs.tb_projlist_inout rq
          on rq.projid = p.projid
         and rq.inout_id = p.rquiet_id
        left join thjs.tb_projlist_inout cq
          on cq.projid = p.projid
         and cq.inout_id = p.cquiet_id
         left join (select r.projid,r.check_id, r.check_result,to_char(r.update_time,''yyyymmdd'') as check_date,
					    row_number() over(partition by r.projid order by r.update_time desc) as rn
				   from thjs.tb_projlist_check_result r) rr
	    on p.projid = rr.projid
	   and rr.rn = 1
	   left join (select b.projid,b.check_id,sum(decode(b.check_result,''0'',0,1)) as check_result_sum
       from  thjs.TB_PROJLIST_CHECK_RESULT b
        group by b.projid,b.check_id)rs
       on p.projid=rs.projid
       and rr.check_id=rs.check_id  
        left join (select m.projid, m.fill_id, count(1) as cn
                     from thjs.tb_projlist_multistk m
                    group by m.projid, m.fill_id) m
          on m.projid = p.projid
         and m.fill_id = p.multistk_ID
       where ('''||i_projid||''' is null or p.projid = '''||i_projid||''')
         and ('''||i_projname||''' is null or instr(p.projname, '''||i_projname||''') > 0)
         and ('''||i_khname||''' is null or instr(p.custname, '''||i_khname||''') > 0) --超级用户查询所选节点，管理人员权限待确定 
       ) t)r';
    
    
  dbms_output.put_line(v_sql);
    execute immediate v_sql;
    
    open rt_cursor for
    select r.*
      from thjs.t_projlist_main_all_tmp r  
     where r.rn > v_page_num
       and r.rn <= v_page_num + v_page_size
     order by r.rn;
 
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