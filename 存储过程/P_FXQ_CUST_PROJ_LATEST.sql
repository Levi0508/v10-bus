CREATE OR REPLACE PROCEDURE "THJS"."P_FXQ_CUST_PROJ_LATEST" (rt_cursor     out sys_refcursor, --返回游标结果集
                                                   i_client_id     in integer, --客户id
                                                   i_client_name   in varchar2, --客户名称
                                                   i_page_num in number default 0,  --默认值0,
                                              	   i_page_size in number default 0, --默认值0  如果i_page_num，i_page_size都为0 则不分页，查询全部
                                                   o_total_count out integer,
                                                   o_return_msg  out varchar2,
                                                   o_return_code out integer)
AS
  --版    权：
  --版    本：1.0.0
  --开发人员：
  --创建日期：20260408
  --模块编号：
  --模块名称：投行反洗钱 - 查询客户最新的项目信息
  --功能名称：
  ----------------------------------------------------------------------------------
  --==============================================================================
  --固定变量
  v_userexp      exception;                                  -- 用户定义错
  v_tradedate    varchar2(8);   
  v_exec_func_id integer default '0';                        -- 任务id
  v_func_own     varchar2(20) default 'thjs';           -- 任务归属用户（schema）
  v_func_name    varchar2(2000) default 'p_fxq_cust_rz_qry'; -- 任务名称(存储过程的名字)
  v_sqlerrm      varchar2(4000);                             -- 错误提示信息
  v_sqlcode      number;                                     -- 错误代码
  v_sqlerrl      varchar2(4000);                             -- 错误行号
  --==============================================================================
  ---------------------------------------------------------------------------------------
  --业务变量
  v_page_num  number default 0;
  v_page_size number;
  --=============================================================
  -- 业务处理过程
  --=============================================================

BEGIN

  v_tradedate := to_char(sysdate, 'yyyyMMdd');

  insert into thjs.tb_exec_log
    (log_id, proc_name, proc_param, exec_time)
  values
    (thjs.tb_exec_log_id_seq.nextval,
     'p_fxq_cust_proj_latest',
     'i_cust_id:' || i_client_id || ' -' || 'i_cust_name:' || i_client_name,
     sysdate);
  commit;
  
    --v102+ end
    if i_page_num is not null then
        v_page_num := i_page_num;
    end if;
    
    --统计记录条数
    if v_page_num < 1 then
      select count(1) into o_total_count
        from (select b.client_id,
      		 		 b.client_name,
      		 		 a.projname,
      		 		 a.projtype,
      		 		 a.prostatus,
      		 		 a.projphase,
      		 		 a.createtime,
      		 		 row_number() over(partition by b.client_id order by a.createtime desc) as rn
        		from thjs.ib_v_cust_info a
       		   inner join thjs.t_th_client_info b --thjs.tb_fxq_cust_rz t
          		  on replace(replace(a.khname,'(','（'),')','）') = replace(replace(b.client_name,'(','（'),')','）')) t
       WHERE (t.client_id = i_client_id or i_client_id is null)
         and (t.client_name = i_client_name or i_client_name is null);
    
    end if;
    
    if i_page_size is not null and i_page_size <> 0 then
        v_page_size := i_page_size;
    else
        v_page_size := o_total_count;
    end if;
    
    open rt_cursor for
      select t.client_id,
      		 t.client_name,
      		 t.projname,
      		 t.projtype,
      		 t.prostatus,
      		 t.projphase,
      		 t.createtime,
             t.rn
        from (select b.client_id,
      		 		 b.client_name,
      		 		 a.projname,
      		 		 a.projtype,
      		 		 a.prostatus,
      		 		 a.projphase,
      		 		 a.createtime,
                     row_number() over(partition by null order by a.createtime desc) as rn
        		from thjs.ib_v_cust_info a
       		   inner join thjs.t_th_client_info b --thjs.tb_fxq_cust_rz t
          		  on replace(replace(a.khname,'(','（'),')','）') = replace(replace(b.client_name,'(','（'),')','）')
               WHERE (b.client_id = i_client_id or i_client_id is null)
                 and (b.client_name = i_client_name or i_client_name is null)) t
       WHERE t.rn > v_page_num
         and t.rn <= v_page_num*v_page_size + v_page_size
    order by t.rn;
    
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
END;
