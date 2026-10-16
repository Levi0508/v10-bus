--drop table FLHGDB.TB_EMAIL_MSG_MODEL;

20260128 08:14:54
CREATE TABLE "FLHGDB"."TB_EMAIL_MSG_MODEL"
(
"MODEL_ID" VARCHAR2(32) DEFAULT SYS_GUID() NOT NULL,
"PROJECT_ID" VARCHAR2(100),
"MODEL_TYPE" CHAR(1),
"TITLE" NVARCHAR2(100),
"CONTENT" CLOB,
"UPDATE_TIME" TIMESTAMP(0) DEFAULT SYSDATE,
CONSTRAINT "PK_FLHGDB_TB_EMAIL_MSG_MODEL" NOT CLUSTER PRIMARY KEY("MODEL_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_EMAIL_MSG_MODEL is '邮件短信模板配置表';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.CONTENT is '文本内容';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.MODEL_ID is '模板ID';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.MODEL_TYPE is '模板类型,1邮件，2短信';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.PROJECT_ID is '项目编号';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.TITLE is '标题';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.UPDATE_TIME is '更新时间';

20260128 09:30:09
CREATE TABLE "FLHGDB"."TB_EMAIL_MSG_MODEL"
(
"MODEL_ID" VARCHAR2(32) DEFAULT SYS_GUID() NOT NULL,
"PROJECT_ID" VARCHAR2(100),
"MODEL_TYPE" CHAR(1),
"TITLE" NVARCHAR2(100),
"CONTENT" CLOB,
"UPDATE_TIME" TIMESTAMP(0) DEFAULT SYSDATE,
"REMARK" VARCHAR2(1000),
CONSTRAINT "PK_FLHGDB_TB_EMAIL_MSG_MODEL" NOT CLUSTER PRIMARY KEY("MODEL_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_EMAIL_MSG_MODEL is '邮件短信模板配置表';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.CONTENT is '文本内容';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.MODEL_ID is '模板ID';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.MODEL_TYPE is '模板类型,1邮件，2短信';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.PROJECT_ID is '项目编号';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.REMARK is '备注';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.TITLE is '标题';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL.UPDATE_TIME is '更新时间';



--drop table FLHGDB.TB_EMAIL_MSG_MODEL_TEXT;

20260127 14:38:06
CREATE TABLE "FLHGDB"."TB_EMAIL_MSG_MODEL_TEXT"
(
"MODEL_ID" VARCHAR2(32) NOT NULL,
"POSITION_FLAG" NVARCHAR2(1) NOT NULL,
"SQL_STR" CLOB,
CONSTRAINT "PK_FLHGDB_TB_EMAIL_MSG_MODEL_TEXT" NOT CLUSTER PRIMARY KEY("MODEL_ID", "POSITION_FLAG")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_EMAIL_MSG_MODEL_TEXT is '邮件短信模板动态文本配置表';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.MODEL_ID is '模板ID';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.POSITION_FLAG is '占位符，尽量用特殊符号';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.SQL_STR is '取值脚本';

20260128 08:15:38
CREATE TABLE "FLHGDB"."TB_EMAIL_MSG_MODEL_TEXT"
(
"MODEL_ID" VARCHAR2(32) NOT NULL,
"POSITION_FLAG" NVARCHAR2(1) NOT NULL,
"SQL_STR" CLOB,
"UPDATE_TIME" TIMESTAMP(0) DEFAULT SYSDATE,
CONSTRAINT "PK_FLHGDB_TB_EMAIL_MSG_MODEL_TEXT" NOT CLUSTER PRIMARY KEY("MODEL_ID", "POSITION_FLAG")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_EMAIL_MSG_MODEL_TEXT is '邮件短信模板动态文本配置表';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.MODEL_ID is '模板ID';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.POSITION_FLAG is '占位符，尽量用特殊符号';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.SQL_STR is '取值脚本';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.UPDATE_TIME is '更新时间';

20260128 08:55:28
CREATE TABLE "FLHGDB"."TB_EMAIL_MSG_MODEL_TEXT"
(
"MODEL_ID" VARCHAR2(32) NOT NULL,
"POSITION_FLAG" NVARCHAR2(1) NOT NULL,
"SQL_STR" CLOB,
"UPDATE_TIME" TIMESTAMP(0) DEFAULT SYSDATE,
"REMARK" VARCHAR2(1000),
CONSTRAINT "PK_FLHGDB_TB_EMAIL_MSG_MODEL_TEXT" NOT CLUSTER PRIMARY KEY("MODEL_ID", "POSITION_FLAG")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_EMAIL_MSG_MODEL_TEXT is '邮件短信模板动态文本配置表';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.MODEL_ID is '模板ID';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.POSITION_FLAG is '占位符，尽量用特殊符号';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.REMARK is '备注';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.SQL_STR is '取值脚本';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_MODEL_TEXT.UPDATE_TIME is '更新时间';



--drop table FLHGDB.TB_EMAIL_MSG_SEND;

20260128 09:10:33
CREATE TABLE "FLHGDB"."TB_EMAIL_MSG_SEND"
(
"MODEL_ID" VARCHAR2(32),
"PROJECT_ID" VARCHAR2(100),
"TITLE" NVARCHAR2(100),
"CONTENT" CLOB,
"SEND_ID" VARCHAR2(36) NOT NULL,
"RECEIVER" VARCHAR2(50),
"EMAIL" VARCHAR2(100),
"BUSINESS_ID" VARCHAR2(36),
"BUSINESS_REMARK" VARCHAR2(100),
"SEND_TIME" VARCHAR2(20),
"RECEIVER_NAME" VARCHAR2(100),
"DEPT_CODE" VARCHAR2(10),
"DEPT_NAME" VARCHAR2(100),
CONSTRAINT "PK_FLHGDB_TB_EMAIL_MSG_SEND" NOT CLUSTER PRIMARY KEY("SEND_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_EMAIL_MSG_SEND is '邮件短信发送记录';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.BUSINESS_ID is '业务事项主键';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.BUSINESS_REMARK is '业务事项说明';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.CONTENT is '文本内容';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.DEPT_CODE is '部门编号';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.DEPT_NAME is '部门名称';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.EMAIL is '邮箱';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.MODEL_ID is '模板ID';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.PROJECT_ID is '项目编号';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.RECEIVER is '收件人工号';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.RECEIVER_NAME is '收件人';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.SEND_ID is '发送ID';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.SEND_TIME is '发送时间';
COMMENT ON COLUMN FLHGDB.TB_EMAIL_MSG_SEND.TITLE is '标题';



CREATE OR REPLACE PROCEDURE APP.PR_CREATE_EMAIL_MSG
(
    i_model_id                           IN VARCHAR2 ,--邮件模板ID
    i_receiver                           IN VARCHAR2 ,--收件人工号，逗号分隔
    i_id                                 IN VARCHAR2 ,--业务相关主键ID
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT CLOB 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 邮件生成程序（返回json）
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260128 09:19:28
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_query_sql                          CLOB ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
    v_content                            CLOB ;
    v_value                              CLOB ;
    v_return_json                        CLOB ;
BEGIN
        /*01.01:按发送人员清单一个一个生成邮件内容*/
    for cur in (select a.staff_id,
                       a.display_name,
                       a.dept_id,
                       a.dept_name,
                       a.EMAIL,
                       b.MODEL_TYPE,
                       TO_JSON(b.TITLE) as TITLE,
                       TO_JSON(b.CONTENT) as CONTENT
                from   app.wb_user a
                inner join 
                       flhgdb.TB_EMAIL_MSG_MODEL b 
                on     b.model_id=i_model_id
                where  instr(i_receiver,a.staff_id)>0
                order by a.dept_id,a.staff_id
               )
    loop

        /*01.02:*/v_step_msg:='01.02';
        v_content:=cur.CONTENT;

            /*01.03.01:循环获取邮件模版中需要取数的动态文本*/
        for cur_t in (select b.POSITION_FLAG,
                             b.SQL_STR
                      from   flhgdb.TB_EMAIL_MSG_MODEL_TEXT b 
                      where  b.model_id=i_model_id
                     )
        LOOP

            /*01.03.02:替换邮件对应的业务主键ID,收件人等参数*/v_step_msg:='01.03.02';
            v_query_sql:=replace(cur_t.SQL_STR,'{?receiver?}',cur.staff_id);

            /*01.03.03:*/v_step_msg:='01.03.03';
            v_query_sql:=replace(v_query_sql,'{?id?}',i_id);

            /*01.03.04:执行取数语句*/v_step_msg:='01.03.04';
            execute immediate v_query_sql into v_value;

            /*01.03.05:占位符替换成实际数值*/v_step_msg:='01.03.05';
            v_content:=replace(v_content,cur_t.POSITION_FLAG,v_value);

            /*01.03.99:*/
        end loop;

        /*01.04:拼接邮件发送json对象*/v_step_msg:='01.04';
        v_return_json:=v_return_json||case when v_return_json is not null then ','||chr(10) end||
                       '{"ehr_id":"'||cur.staff_id||'"'||
                       ',"ehr_name":"'||cur.display_name||'"'||
                       ',"dept_id":"'||cur.dept_id||'"'||
                       ',"dept_name":"'||cur.dept_name||'"'||
                       ',"email":"'||cur.email||'"'||
                       ',"model_id":"'||i_model_id||'"'||
                       ',"business_id":"'||i_id||'"'||
                       ',"title":'||cur.title||
                       ',"email_content":'||v_content||
                       '}';

        /*01.99:*/
    end loop;

    /*02:删除json日志记录*/v_step_msg:='02';
    delete from FLHGDB.TB_JSON_STR_LOG 
    where  etl_sp_name='APP.PR_CREATE_EMAIL_MSG' 
    and    sysdate-to_date(execute_time,'yyyymmdd hh24:mi:ss')>3;

    /*03:插入json日志*/v_step_msg:='03';
    insert into FLHGDB.TB_JSON_STR_LOG
    (
           JSON_STR,
           ETL_SP_NAME,
           PARAMS_TYPE,
           PARAMS_NAME,
           VALID_FLAG,
           EXECUTE_TIME
    )
    select 
           '['||v_return_json||']' as JSON_STR,
           'APP.PR_CREATE_EMAIL_MSG' as ETL_SP_NAME,
           '2' as PARAMS_TYPE,
           'o_return_msg' as PARAMS_NAME,
           json_valid('['||v_return_json']') as VALID_FLAG,
           to_char(sysdate,'yyyymmdd hh24:mi:ss') as EXECUTE_TIME
    from   
           dual a
    where  1=1;

    /*04:*/v_step_msg:='04';
    o_return_code := 0;

    /*05:*/v_step_msg:='05';
    o_return_msg := '['||v_return_json||']';

    /*06:*/v_step_msg:='06';
    commit;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'APP.PR_CREATE_EMAIL_MSG执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;




20260128 10:39:39
create OR REPLACE  view flhgdb.VW_EMAIL_MSG_MODEL as 
select a.model_id,
       a.project_id,
       b.project_name,
       a.model_type,
       a.title,
       a.content,
       to_char(a.update_time,'yyyymmdd hh24:mi:ss') as update_time,
       a.remark 
from flhgdb.TB_EMAIL_MSG_MODEL a
left join 
     app.tb_project b 
on   a.project_id=b.project_id;
COMMENT ON VIEW FLHGDB.VW_EMAIL_MSG_MODEL is '邮件模版视图';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.CONTENT is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.MODEL_ID is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.MODEL_TYPE is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.PROJECT_ID is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.PROJECT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.REMARK is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.TITLE is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.UPDATE_TIME is '';

20260128 17:21:15
create OR REPLACE  view flhgdb.VW_EMAIL_MSG_MODEL as 
select a.model_id,
       a.project_id,
       a.project_id||'-'||b.project_name as project_name,
       a.model_type,
       a.title,
       a.content,
       to_char(a.update_time,'yyyymmdd hh24:mi:ss') as update_time,
       a.remark 
from flhgdb.TB_EMAIL_MSG_MODEL a
left join 
     app.tb_project b 
on   a.project_id=b.project_id;
COMMENT ON VIEW FLHGDB.VW_EMAIL_MSG_MODEL is '邮件模版视图';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.CONTENT is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.MODEL_ID is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.MODEL_TYPE is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.PROJECT_ID is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.PROJECT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.REMARK is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.TITLE is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL.UPDATE_TIME is '';




20260128 17:21:15
create or replace view flhgdb.VW_EMAIL_MSG_MODEL_TEXT as 
select a.model_id,
       b.project_id,
       b.project_name,
       b.title,
       a.position_flag,
       a.sql_str,
       to_char(a.update_time,'yyyymmdd hh24:mi:ss') as update_time,
       a.remark 
from flhgdb.tb_EMAIL_MSG_MODEL_TEXT a
left join 
     flhgdb.VW_EMAIL_MSG_MODEL b 
on   a.model_id=b.model_id;
COMMENT ON VIEW FLHGDB.VW_EMAIL_MSG_MODEL_TEXT is '邮件模版动态文本配置视图';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL_TEXT.MODEL_ID is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL_TEXT.POSITION_FLAG is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL_TEXT.PROJECT_ID is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL_TEXT.PROJECT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL_TEXT.REMARK is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL_TEXT.SQL_STR is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL_TEXT.TITLE is '';
COMMENT ON COLUMN FLHGDB.VW_EMAIL_MSG_MODEL_TEXT.UPDATE_TIME is '';



