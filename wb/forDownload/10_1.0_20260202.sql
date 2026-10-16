--drop table FLHGDB.TB_DRAFT_LAW;

20260112 16:05:01
CREATE TABLE "FLHGDB"."TB_DRAFT_LAW"
(
"TITLE" VARCHAR2(500),
"CREATE_USER" VARCHAR2(50),
"CREATE_TIME" TIMESTAMP(0) DEFAULT SYSDATE,
"DEPT_CODE" VARCHAR2(10),
"DEPT_NAME" VARCHAR2(100),
"DRAFT_LAW_NO" VARCHAR2(50) NOT NULL,
"DRAFT_LAW_ID" VARCHAR2(36) NOT NULL,
"ISSUING_AUTHORITY" CHAR(1),
"ISSUING_AUTHORITY_NAME" VARCHAR2(100),
"LAW_LEVEL" CHAR(1),
"DRAFT_LAW_TYPE" CHAR(1),
"END_TIME" VARCHAR2(20),
"LAW_DESC" CLOB,
"CONSULT_STATUS" CHAR(1),
"DRAFT_LAW_NAME" VARCHAR2(500),
CONSTRAINT "PK_FLHGDB_TB_DRAFT_LAW" NOT CLUSTER PRIMARY KEY("DRAFT_LAW_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_DRAFT_LAW is '立法草案信息表';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.CONSULT_STATUS is '征询状态';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.CREATE_TIME is '创建时间';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.CREATE_USER is '创建人';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.DEPT_CODE is '部门代码';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.DEPT_NAME is '部门名称';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.DRAFT_LAW_ID is '草案UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.DRAFT_LAW_NAME is '草案文件名';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.DRAFT_LAW_NO is '文件编号，格式：国泰海通立法点[2025]第（）号';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.DRAFT_LAW_TYPE is '文件类别';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.END_TIME is '截止时间';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.ISSUING_AUTHORITY is '发布/征询单位编号';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.ISSUING_AUTHORITY_NAME is '发布/征询单位，编号为Z其他时填写';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.LAW_DESC is '制度详细信息';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.LAW_LEVEL is '层级/效力';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW.TITLE is '标题，格式：国泰海通 证券基层立法联系点关于反 馈（ ）《 》的意见建议';



--drop table FLHGDB.TB_DRAFT_LAW_ARTICLE;

20260112 16:25:29
CREATE TABLE "FLHGDB"."TB_DRAFT_LAW_ARTICLE"
(
"DRAFT_LAW_ID" VARCHAR2(36) NOT NULL,
"ARTICLE_NO" INT NOT NULL,
"ARTICLE_ID" VARCHAR2(36) NOT NULL,
"ARTICLE_DESC" CLOB,
"ARTICLE_DESC_ORGINAL" CLOB,
"IF_CONSULT" CHAR(1),
CONSTRAINT "PK_FLHGDB_TB_DRAFT_LAW_ARTICLE" NOT CLUSTER PRIMARY KEY("ARTICLE_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_DRAFT_LAW_ARTICLE is '立法草案条目表';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_ARTICLE.ARTICLE_DESC is '条目内容';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_ARTICLE.ARTICLE_DESC_ORGINAL is '原文条目内容';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_ARTICLE.ARTICLE_ID is '条目UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_ARTICLE.ARTICLE_NO is '条目编号';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_ARTICLE.DRAFT_LAW_ID is '草案UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_ARTICLE.IF_CONSULT is '是否征询意见，1是0否';



--drop table FLHGDB.TB_DRAFT_LAW_CONSULT;

20260121 16:53:59
CREATE TABLE "FLHGDB"."TB_DRAFT_LAW_CONSULT"
(
"DRAFT_LAW_ID" VARCHAR2(36) NOT NULL,
"ARTICLE_ID" VARCHAR2(36) NOT NULL,
"SUGGESTIONS_ID" VARCHAR2(36) NOT NULL,
"SUGGESTIONS_NO" INT NOT NULL,
"EDIT_TYPE" CHAR(1),
"CONSULT_ARTICLE_DESC" CLOB,
"ADOPTED_FLAG" CHAR(1),
"CONSULT_SUGGESTIONS" VARCHAR2(600),
"CONSULT_USER" VARCHAR2(10),
"CONSULT_TIME" VARCHAR2(20),
"DEPT_CODE" VARCHAR2(10),
"DEPT_NAME" VARCHAR2(100),
CONSTRAINT "PK_FLHGDB_TB_DRAFT_LAW_CONSULT" NOT CLUSTER PRIMARY KEY("SUGGESTIONS_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_DRAFT_LAW_CONSULT is '立法草案征询意见表';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.ADOPTED_FLAG is '采纳标志';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.ARTICLE_ID is '条目UUID，其他意见填‘-’';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_ARTICLE_DESC is '征询后条目内容';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_SUGGESTIONS is '征询意见\理由';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_TIME is '征询意见时间';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_USER is '征询人';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DEPT_CODE is '部门代码';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DEPT_NAME is '部门名称';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DRAFT_LAW_ID is '草案UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.EDIT_TYPE is '编辑类别';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.SUGGESTIONS_ID is '征询意见UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.SUGGESTIONS_NO is '征询意见编号';

20260127 09:26:10
CREATE TABLE "FLHGDB"."TB_DRAFT_LAW_CONSULT"
(
"DRAFT_LAW_ID" VARCHAR2(36) NOT NULL,
"ARTICLE_ID" VARCHAR2(36) NOT NULL,
"SUGGESTIONS_ID" VARCHAR2(36) NOT NULL,
"SUGGESTIONS_NO" INT NOT NULL,
"EDIT_TYPE" CHAR(1),
"CONSULT_ARTICLE_DESC" CLOB,
"ADOPTED_FLAG" CHAR(1),
"CONSULT_SUGGESTIONS" VARCHAR2(600),
"CONSULT_USER" VARCHAR2(10),
"CONSULT_TIME" VARCHAR2(20),
"DEPT_CODE" VARCHAR2(10),
"DEPT_NAME" VARCHAR2(100),
CONSTRAINT "PK_FLHGDB_TB_DRAFT_LAW_CONSULT" NOT CLUSTER PRIMARY KEY("SUGGESTIONS_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_DRAFT_LAW_CONSULT is '立法草案征询意见表';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.ADOPTED_FLAG is '采纳标志';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.ARTICLE_ID is '条目UUID，其他意见填‘-’';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_ARTICLE_DESC is '征询后条目内容';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_SUGGESTIONS is '征询意见\理由';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_TIME is '征询意见时间';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_USER is '征询人';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DEPT_CODE is '部门代码';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DEPT_NAME is '部门名称';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DRAFT_LAW_ID is '草案UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.EDIT_TYPE is '编辑类别';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.SUGGESTIONS_ID is '征询意见UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.SUGGESTIONS_NO is '征询意见编号';

20260129 10:27:35
CREATE TABLE "FLHGDB"."TB_DRAFT_LAW_CONSULT"
(
"DRAFT_LAW_ID" VARCHAR2(36) NOT NULL,
"ARTICLE_ID" VARCHAR2(36) NOT NULL,
"SUGGESTIONS_ID" VARCHAR2(36) NOT NULL,
"SUGGESTIONS_NO" INT NOT NULL,
"EDIT_TYPE" CHAR(1),
"CONSULT_ARTICLE_DESC" CLOB,
"ADOPTED_FLAG" CHAR(1),
"CONSULT_SUGGESTIONS" VARCHAR2(6000),
"CONSULT_USER" VARCHAR2(10),
"CONSULT_TIME" VARCHAR2(20),
"DEPT_CODE" VARCHAR2(10),
"DEPT_NAME" VARCHAR2(100),
CONSTRAINT "PK_FLHGDB_TB_DRAFT_LAW_CONSULT" NOT CLUSTER PRIMARY KEY("SUGGESTIONS_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_DRAFT_LAW_CONSULT is '立法草案征询意见表';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.ADOPTED_FLAG is '采纳标志';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.ARTICLE_ID is '条目UUID，其他意见填‘-’';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_ARTICLE_DESC is '征询后条目内容';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_SUGGESTIONS is '征询意见\理由';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_TIME is '征询意见时间';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.CONSULT_USER is '征询人';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DEPT_CODE is '部门代码';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DEPT_NAME is '部门名称';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.DRAFT_LAW_ID is '草案UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.EDIT_TYPE is '编辑类别';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.SUGGESTIONS_ID is '征询意见UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_CONSULT.SUGGESTIONS_NO is '征询意见编号';



--drop table FLHGDB.TB_DRAFT_LAW_FLOW;

20260115 16:57:04
CREATE TABLE "FLHGDB"."TB_DRAFT_LAW_FLOW"
(
"FLOW_ID" VARCHAR2(36) NOT NULL,
"PARENT_FLOW_ID" VARCHAR2(36),
"FLOW_PROCESSOR" VARCHAR2(100),
"FLOW_LEVEL" INT,
"DRAFT_LAW_NO" VARCHAR2(50),
"DRAFT_LAW_ID" VARCHAR2(36),
"FLOW_TIME" TIMESTAMP(0) DEFAULT SYSDATE,
"CREATE_USER" VARCHAR2(50),
"FLOW_DEPT_CODE" VARCHAR2(10),
"FLOW_DEPT_NAME" VARCHAR2(100),
"CONSULT_STATUS" CHAR(1),
CONSTRAINT "PK_FLHGDB_TB_DRAFT_LAW_FLOW" NOT CLUSTER PRIMARY KEY("FLOW_ID")) STORAGE(ON "TS_FLHG_USER", CLUSTERBTR) ;
COMMENT ON TABLE FLHGDB.TB_DRAFT_LAW_FLOW is '立法草案征询流程表';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.CONSULT_STATUS is '征询状态';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.CREATE_USER is '创建人';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.DRAFT_LAW_ID is '草案UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.DRAFT_LAW_NO is '文件编号，格式：国泰海通立法点[2025]第（）号';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.FLOW_DEPT_CODE is '流程部门编号';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.FLOW_DEPT_NAME is '流程部门名称';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.FLOW_ID is '流程UUID';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.FLOW_LEVEL is '流程层级';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.FLOW_PROCESSOR is '流程经办人';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.FLOW_TIME is '流程创建时间';
COMMENT ON COLUMN FLHGDB.TB_DRAFT_LAW_FLOW.PARENT_FLOW_ID is '上级流程UUID';



--drop table FLHGDB.TMP_NODE_JSON;

20260114 13:22:52
CREATE GLOBAL TEMPORARY TABLE "FLHGDB"."TMP_NODE_JSON"
(
"ID" VARCHAR2(100),
"PARENT_ID" VARCHAR2(100),
"JSON_STR" CLOB,
"IS_LEAF" INT)
ON COMMIT PRESERVE ROWS STORAGE(ON TEMP);
COMMENT ON TABLE FLHGDB.TMP_NODE_JSON is '树形结构数据JSON字符串表';
COMMENT ON COLUMN FLHGDB.TMP_NODE_JSON.ID is '';
COMMENT ON COLUMN FLHGDB.TMP_NODE_JSON.IS_LEAF is '';
COMMENT ON COLUMN FLHGDB.TMP_NODE_JSON.JSON_STR is '';
COMMENT ON COLUMN FLHGDB.TMP_NODE_JSON.PARENT_ID is '';



--drop table FLHGDB.TMP_TREE_FLAT;

20260114 13:17:50
CREATE GLOBAL TEMPORARY TABLE "FLHGDB"."TMP_TREE_FLAT"
(
"ID" VARCHAR2(36),
"PARENT_ID" VARCHAR2(36),
"LEVEL" INT)
ON COMMIT PRESERVE ROWS STORAGE(ON TEMP);
COMMENT ON TABLE FLHGDB.TMP_TREE_FLAT is '树形结构数据临时表';
COMMENT ON COLUMN FLHGDB.TMP_TREE_FLAT.ID is '';
COMMENT ON COLUMN FLHGDB.TMP_TREE_FLAT.LEVEL is '';
COMMENT ON COLUMN FLHGDB.TMP_TREE_FLAT.PARENT_ID is '';



CREATE OR REPLACE PROCEDURE FLHGDB.P2100_CREATE_DRAFT_LAW_FLOW
(
    i_draft_law_json                     IN CLOB ,
    o_return_code                        OUT INT ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询流程创建
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260126 16:25:53
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_parent_flow_id                     VARCHAR2(100) ;
    v_create_user                        VARCHAR2(100) ;
    v_flow_time                          VARCHAR2(30) default to_char(sysdate,'YYYYMMDD hh24:mi:ss');
    v_undo_flow_processor                VARCHAR2(1000) ;
    v_draft_law_id                       VARCHAR2(100) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:删除json日志记录*/v_step_msg:='01';
    delete from FLHGDB.TB_JSON_STR_LOG 
    where  etl_sp_name='FLHGDB.P2100_CREATE_DRAFT_LAW_FLOW' 
    and    sysdate-to_date(execute_time,'yyyymmdd hh24:mi:ss')>3;

    /*02:插入json日志*/v_step_msg:='02';
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
           i_draft_law_json as JSON_STR,
           'FLHGDB.P2100_CREATE_DRAFT_LAW_FLOW' as ETL_SP_NAME,
           '1' as PARAMS_TYPE,
           'i_draft_law_json' as PARAMS_NAME,
           json_valid(i_draft_law_json) as VALID_FLAG,
           to_char(sysdate,'yyyymmdd hh24:mi:ss') as EXECUTE_TIME
    from   
           dual a
    where  1=1;

    /*03:*/v_step_msg:='03';
    commit;

    /*04:*/v_step_msg:='04';
    v_draft_law_id:=JSON_VALUE(i_draft_law_json, '$.draftLawId');

        /*05.01:未保存立法草案*/
    if not exists(select 1 from FLHGDB.TB_DRAFT_LAW where DRAFT_LAW_ID=v_draft_law_id) then

        /*05.02:*/v_step_msg:='05.02';
        o_return_code := -20000;
        o_return_msg := '未找到立法草案或请先保存立法草案后推送';
        return;

        /*05.99:*/
    end if;

    /*06:*/v_step_msg:='06';
    v_parent_flow_id:=JSON_VALUE(i_draft_law_json, '$.flowId');

        /*08.01:上级流程为空*/
    if v_parent_flow_id is not null then

        /*08.02:为流程人员推送，取流程推送人*/v_step_msg:='08.02';
        select max(a.flow_processor)
        into   v_create_user
        from   FLHGDB.TB_DRAFT_LAW_FLOW a 
        where  a.FLOW_ID=v_parent_flow_id
        and    a.DRAFT_LAW_ID=v_draft_law_id;

        /*08.03:*/
    ELSE

        /*08.04:为管理员推送，取草案创建人*/v_step_msg:='08.04';
        select max(a.create_user)
        into   v_create_user
        from   FLHGDB.TB_DRAFT_LAW a 
        where  a.DRAFT_LAW_ID=v_draft_law_id;

        /*08.99:*/
    end if;

    /*09:返回信息，不推送人员清单*/v_step_msg:='09';
    select listagg(c.display_name||'('||c.dept_name||')',chr(10)) within group(order by c.dept_name,c.display_name)
    into   v_undo_flow_processor
    from   JSON_TABLE(
                i_draft_law_json,
                '$.flowProcessor[*]'  -- JSON路径，提取flow数组
                COLUMNS (
                    FLOW_PROCESSOR varchar2(100) PATH '$'
                )
            ) a 
    inner join 
            FLHGDB.TB_DRAFT_LAW_FLOW b 
    on      a.FLOW_PROCESSOR=b.FLOW_PROCESSOR
    and     b.DRAFT_LAW_ID=v_draft_law_id
    inner join 
            app.wb_user c
    on      a.FLOW_PROCESSOR=c.STAFF_ID;

    /*10:立法草案录入*/v_step_msg:='10';
    insert into FLHGDB.TB_DRAFT_LAW_FLOW
    (
           FLOW_ID,
           PARENT_FLOW_ID,
           FLOW_PROCESSOR,
           FLOW_LEVEL,
           DRAFT_LAW_NO,
           DRAFT_LAW_ID,
           FLOW_TIME,
           CREATE_USER,
           FLOW_DEPT_CODE,
           FLOW_DEPT_NAME,
           CONSULT_STATUS
    )
    select 
           sys_guid() as FLOW_ID,
           v_parent_flow_id as PARENT_FLOW_ID,
           a.FLOW_PROCESSOR as FLOW_PROCESSOR,
           coalesce(b.flow_level,0)+1 as FLOW_LEVEL,
           c.DRAFT_LAW_NO as DRAFT_LAW_NO,
           c.DRAFT_LAW_ID as DRAFT_LAW_ID,
           v_flow_time as FLOW_TIME,
           v_create_user as CREATE_USER,
           d.dept_id as FLOW_DEPT_CODE,
           d.dept_name as FLOW_DEPT_NAME,
           '2' as CONSULT_STATUS
    from   
           (
            select * 
            from 
            JSON_TABLE(
                 i_draft_law_json,
                 '$.flowProcessor[*]'  -- JSON路径，提取flow数组
                 COLUMNS (
                     FLOW_PROCESSOR varchar2(100) PATH '$'
                 )
            )
           ) a
    left join
           FLHGDB.TB_DRAFT_LAW_FLOW b
    on     
           v_parent_flow_id=b.flow_id
    left join
           FLHGDB.TB_DRAFT_LAW c
    on     
           v_draft_law_id=c.DRAFT_LAW_ID
    left join
           APP.WB_USER d
    on     
           a.flow_processor=d.STAFF_ID
    where  not exists(select 1 from FLHGDB.TB_DRAFT_LAW_FLOW e
                      where  a.FLOW_PROCESSOR=e.FLOW_PROCESSOR
                      and    e.DRAFT_LAW_ID=v_draft_law_id);

    /*11:更新成带-的uuid*/v_step_msg:='11';
    update FLHGDB.TB_DRAFT_LAW_FLOW
    set    FLOW_ID=SUBSTR(to_char(FLOW_ID), 1, 8) || '-' ||
                   SUBSTR(to_char(FLOW_ID), 9, 4) || '-' ||
                   SUBSTR(to_char(FLOW_ID), 13, 4) || '-' ||
                   SUBSTR(to_char(FLOW_ID), 17, 4) || '-' ||
                   SUBSTR(to_char(FLOW_ID), 21, 12)
    where DRAFT_LAW_ID=v_draft_law_id
    and   FLOW_TIME=v_flow_time;

    /*12:下发待办视为开始征询*/v_step_msg:='12';
    update FLHGDB.TB_DRAFT_LAW a 
    set    a.consult_status='2'
    where  a.DRAFT_LAW_ID=v_draft_law_id;

    /*13:返回本次推送记录*/v_step_msg:='13';
    select a.FLOW_ID,
           a.flow_processor,
           to_char(a.flow_time,'yyyymmdd hh24:mi:ss') as flow_time,
           b.title
    from   FLHGDB.TB_DRAFT_LAW_FLOW a 
    inner join 
           FLHGDB.TB_DRAFT_LAW b 
    on     a.DRAFT_LAW_ID=b.DRAFT_LAW_ID
    where  a.flow_time=v_flow_time
    and    a.DRAFT_LAW_ID=v_draft_law_id;

    /*14:*/v_step_msg:='14';
    o_return_code := 0;

    /*15:*/v_step_msg:='15';
    o_return_msg := case when v_undo_flow_processor is not null then '推送成功！以下人员已经推送过，本次不再推送！'||chr(10)||v_undo_flow_processor else '推送成功！' end;

    /*16:*/v_step_msg:='16';
    commit;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2100_CREATE_DRAFT_LAW_FLOW执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE FLHGDB.P2100_SEND_THANK_EMAIL
(
    i_mail_json                          IN CLOB ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询感谢信发送
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260128 09:15:05
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_draft_law_no                       VARCHAR2(50) ;
    v_json_str                           CLOB ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:删除JSON日志记录*/v_step_msg:='01';
    delete from FLHGDB.TB_JSON_STR_LOG 
    where  etl_sp_name='FLHGDB.P2100_SEND_THANK_EMAIL' 
    and    sysdate-to_date(execute_time,'yyyymmdd hh24:mi:ss')>3;

    /*02:插入json日志*/v_step_msg:='02';
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
           i_mail_json as JSON_STR,
           'FLHGDB.P2100_SEND_THANK_EMAIL' as ETL_SP_NAME,
           '1' as PARAMS_TYPE,
           'i_mail_json' as PARAMS_NAME,
           json_valid(i_mail_json) as VALID_FLAG,
           to_char(sysdate,'yyyymmdd hh24:mi:ss') as EXECUTE_TIME
    from   
           dual a
    where  1=1;

    /*03:*/v_step_msg:='03';
    commit;

    /*04:立法草案录入*/v_step_msg:='04';
    insert into FLHGDB.TB_EMAIL_MSG_SEND
    (
           MODEL_ID,
           PROJECT_ID,
           TITLE,
           CONTENT,
           SEND_ID,
           RECEIVER,
           EMAIL,
           BUSINESS_ID,
           BUSINESS_REMARK,
           SEND_TIME,
           RECEIVER_NAME,
           DEPT_CODE,
           DEPT_NAME
    )
    select 
           a.model_id  as MODEL_ID,
           a.project_id as PROJECT_ID,
           b.title as TITLE,
           b.content as CONTENT,
           b.send_id as SEND_ID,
           b.ehr_id as RECEIVER,
           b.email as EMAIL,
           b.business_id as BUSINESS_ID,
           '业务主键对应立法草案' as BUSINESS_REMARK,
           to_char(sysdate,'YYYYMMDD hh24:mi:ss') as SEND_TIME,
           b.ehr_name as RECEIVER_NAME,
           b.dept_id as DEPT_CODE,
           b.dept_name as DEPT_NAME
    from   
           flhgdb.TB_EMAIL_MSG_MODEL a
    inner join
           (
           select * from 
              JSON_TABLE(
                i_mail_json,
                '$[*]'  -- JSON路径，提取emails数组
                COLUMNS (
                    title varchar2(300) PATH '$.title',
                    content clob PATH '$.email_content',
                    send_id varchar2(36) PATH '$.uuid',
                    model_id varchar2(100) PATH '$.model_id',
                    ehr_id varchar2(100) PATH '$.ehr_id',
                    ehr_name varchar2(100) PATH '$.ehr_name',
                    dept_id varchar2(100) PATH '$.dept_id',
                    dept_name varchar2(100) PATH '$.dept_name',
                    email varchar2(100) PATH '$.email',
                    business_id varchar2(100) PATH '$.business_id'
                )
              )
           ) b
    on     
           a.model_id=b.model_id
    where  1=1;

    /*05:*/v_step_msg:='05';
    o_return_code := 0;

    /*06:*/v_step_msg:='06';
    o_return_msg := '执行成功';

    /*07:*/v_step_msg:='07';
    commit;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2100_SEND_THANK_EMAIL执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE FLHGDB.P2100_UPDATE_DRAFT_LAW
(
    i_draft_law_json                     IN CLOB ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询录入编辑
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260126 16:26:43
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_draft_law_id                       VARCHAR2(36) ;
    v_draft_law_no                       VARCHAR2(50) ;
    v_json_str                           CLOB ;
    v_law_desc                           CLOB ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:删除JSON日志记录*/v_step_msg:='01';
    delete from FLHGDB.TB_JSON_STR_LOG 
    where  etl_sp_name='FLHGDB.P2100_UPDATE_DRAFT_LAW' 
    and    sysdate-to_date(execute_time,'yyyymmdd hh24:mi:ss')>3;

    /*02:插入json日志*/v_step_msg:='02';
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
           i_draft_law_json as JSON_STR,
           'FLHGDB.P2100_UPDATE_DRAFT_LAW' as ETL_SP_NAME,
           '1' as PARAMS_TYPE,
           'i_draft_law_json' as PARAMS_NAME,
           json_valid(i_draft_law_json) as VALID_FLAG,
           to_char(sysdate,'yyyymmdd hh24:mi:ss') as EXECUTE_TIME
    from   
           dual a
    where  1=1;

    /*03:*/v_step_msg:='03';
    commit;

    /*04:*/v_step_msg:='04';
    v_law_desc:=JSON_EXTRACT(i_draft_law_json,'$.lawDesc');

    /*05:*/v_step_msg:='05';
    v_law_desc:=replace(replace(trim('"' from v_law_desc),'\"','"'),'\\','\');

    /*06:*/v_step_msg:='06';
    v_draft_law_id:=JSON_VALUE(i_draft_law_json,'$.uuid');

    /*07:*/v_step_msg:='07';
    select max(DRAFT_LAW_NO)
    into   v_draft_law_no
    from   FLHGDB.TB_DRAFT_LAW
    where  DRAFT_LAW_ID=v_draft_law_id;

        /*08.01:新草案*/
    if v_draft_law_no is null THEN

        /*08.02:生成编号*/v_step_msg:='08.02';
        SELECT '国泰海通立法点['||to_char(sysdate,'YYYY')||']第('||
               coalesce(max(to_number(substr(draft_law_no,
                                             instr(draft_law_no,'(')+1,
                                             instr(draft_law_no,')')-instr(draft_law_no,'(')-1)
                                            ))+1,1)||')号'
        into   v_draft_law_no
        from   FLHGDB.TB_DRAFT_LAW 
        where  draft_law_no like '国泰海通立法点['||to_char(sysdate,'YYYY')||']第(%)号';

        /*08.99:*/
    end if;

    /*09:*/v_step_msg:='09';
    delete from FLHGDB.TB_DRAFT_LAW where DRAFT_LAW_ID=v_draft_law_id;

    /*10:立法草案录入*/v_step_msg:='10';
    insert into FLHGDB.TB_DRAFT_LAW
    (
           TITLE,
           CREATE_USER,
           DEPT_CODE,
           DEPT_NAME,
           DRAFT_LAW_NO,
           DRAFT_LAW_ID,
           ISSUING_AUTHORITY,
           ISSUING_AUTHORITY_NAME,
           LAW_LEVEL,
           DRAFT_LAW_TYPE,
           END_TIME,
           LAW_DESC,
           CONSULT_STATUS,
           DRAFT_LAW_NAME
    )
    select 
           JSON_VALUE(i_draft_law_json, '$.title') as TITLE,
           JSON_VALUE(i_draft_law_json, '$.ehrId') as CREATE_USER,
           b.dept_id as DEPT_CODE,
           b.dept_name as DEPT_NAME,
           v_draft_law_no as DRAFT_LAW_NO,
           v_draft_law_id as DRAFT_LAW_ID,
           coalesce(JSON_VALUE(i_draft_law_json, '$.values.issuingAuthority.key'),JSON_VALUE(i_draft_law_json, '$.values.issuingAuthority')) as ISSUING_AUTHORITY,
           JSON_VALUE(i_draft_law_json, '$.values.otherAuthority') as ISSUING_AUTHORITY_NAME,
           coalesce(JSON_VALUE(i_draft_law_json, '$.values.lawLevel.key'),JSON_VALUE(i_draft_law_json, '$.values.lawLevel')) as LAW_LEVEL,
           coalesce(JSON_VALUE(i_draft_law_json, '$.values.lawType.key'),JSON_VALUE(i_draft_law_json, '$.values.lawType')) as DRAFT_LAW_TYPE,
           JSON_VALUE(i_draft_law_json, '$.values.deadlineDate') as END_TIME,
           v_law_desc as LAW_DESC,
           '1' as CONSULT_STATUS,
           JSON_VALUE(i_draft_law_json, '$.values.lawName') as DRAFT_LAW_NAME
    from   
           dual a
    left join
           APP.WB_USER b
    on     
           b.STAFF_ID=JSON_VALUE(i_draft_law_json, '$.ehrId')
    where  1=1;

    /*11:*/v_step_msg:='11';
    delete from FLHGDB.TB_DRAFT_LAW_ARTICLE where DRAFT_LAW_ID=v_draft_law_id;

    /*12:立法草案条目录入*/v_step_msg:='12';
    insert into FLHGDB.TB_DRAFT_LAW_ARTICLE
    (
           DRAFT_LAW_ID,
           ARTICLE_NO,
           ARTICLE_ID,
           ARTICLE_DESC,
           ARTICLE_DESC_ORGINAL,
           IF_CONSULT
    )
    select 
           v_draft_law_id as DRAFT_LAW_ID,
           a.ARTICLE_NO as ARTICLE_NO,
           to_char(sys_guid()) as ARTICLE_ID,
           a.ARTICLE_DESC as ARTICLE_DESC,
           a.ARTICLE_DESC as ARTICLE_DESC_ORGINAL,
           a.IF_CONSULT as IF_CONSULT
    from   
           (
           select * from 
              JSON_TABLE(
                i_draft_law_json,
                '$.articles[*]'  -- JSON路径，提取articles数组
                COLUMNS (
                    ARTICLE_NO INT PATH '$.id',
                    ARTICLE_DESC clob PATH '$.content',
                    IF_CONSULT int PATH '$.ifConsult'
                )
              )
           ) a
    where  1=1;

    /*13:更新成带符号的UUID*/v_step_msg:='13';
    update FLHGDB.TB_DRAFT_LAW_ARTICLE 
    set    ARTICLE_ID=SUBSTR(to_char(ARTICLE_ID), 1, 8) || '-' ||
                      SUBSTR(to_char(ARTICLE_ID), 9, 4) || '-' ||
                      SUBSTR(to_char(ARTICLE_ID), 13, 4) || '-' ||
                      SUBSTR(to_char(ARTICLE_ID), 17, 4) || '-' ||
                      SUBSTR(to_char(ARTICLE_ID), 21, 12)
    where DRAFT_LAW_ID=v_draft_law_id;

    /*14:*/v_step_msg:='14';
    o_return_code := 0;

    /*15:*/v_step_msg:='15';
    o_return_msg := '执行成功';

    /*16:*/v_step_msg:='16';
    commit;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2100_UPDATE_DRAFT_LAW执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE FLHGDB.P2100_UPDATE_DRAFT_LAW_CONSULT
(
    i_draft_law_json                     IN CLOB ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询意见修改
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260127 09:19:31
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_draft_law_id                       VARCHAR2(36) ;
    v_article_id                         VARCHAR2(36) ;
    v_consult_user                       VARCHAR2(20) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:删除JSON日志记录*/v_step_msg:='01';
    delete from FLHGDB.TB_JSON_STR_LOG 
    where  etl_sp_name='FLHGDB.P2100_UPDATE_DRAFT_LAW_CONSULT' 
    and    sysdate-to_date(execute_time,'yyyymmdd hh24:mi:ss')>3;

    /*02:插入json日志*/v_step_msg:='02';
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
           i_draft_law_json as JSON_STR,
           'FLHGDB.P2100_UPDATE_DRAFT_LAW_CONSULT' as ETL_SP_NAME,
           '1' as PARAMS_TYPE,
           'i_draft_law_json' as PARAMS_NAME,
           json_valid(i_draft_law_json) as VALID_FLAG,
           to_char(sysdate,'yyyymmdd hh24:mi:ss') as EXECUTE_TIME
    from   
           dual a
    where  1=1;

    /*03:*/v_step_msg:='03';
    commit;

    /*04:*/v_step_msg:='04';
    v_draft_law_id:=JSON_VALUE(i_draft_law_json,'$.draftLawId');

    /*05:*/v_step_msg:='05';
    v_article_id:=JSON_VALUE(i_draft_law_json,'$.articleId');

    /*06:*/v_step_msg:='06';
    v_consult_user:=JSON_VALUE(i_draft_law_json,'$.consultUser');

    /*07:*/v_step_msg:='07';
    delete from FLHGDB.TB_DRAFT_LAW_consult 
    where DRAFT_LAW_ID=v_draft_law_id 
    and article_id = v_article_id
    and CONSULT_USER=v_consult_user;

    /*08:*/v_step_msg:='08';
    insert into FLHGDB.TB_DRAFT_LAW_CONSULT
    (
           DRAFT_LAW_ID,
           ARTICLE_ID,
           SUGGESTIONS_ID,
           SUGGESTIONS_NO,
           EDIT_TYPE,
           CONSULT_ARTICLE_DESC,
           ADOPTED_FLAG,
           CONSULT_SUGGESTIONS,
           CONSULT_USER,
           CONSULT_TIME,
           DEPT_CODE,
           DEPT_NAME
    )
    select 
           v_draft_law_id as DRAFT_LAW_ID,
           v_article_id as ARTICLE_ID,
           a.suggestions_id as SUGGESTIONS_ID,
           a.suggestions_no as SUGGESTIONS_NO,
           a.edit_type as EDIT_TYPE,
           a.consult_article_desc as CONSULT_ARTICLE_DESC,
           a.adopted_flag as ADOPTED_FLAG,
           a.consult_suggestions as CONSULT_SUGGESTIONS,
           v_consult_user as CONSULT_USER,
           to_char(sysdate,'YYYYMMDD hh24:mi:ss') as CONSULT_TIME,
           b.dept_id as DEPT_CODE,
           b.dept_name as DEPT_NAME
    from   
           (
           select * from
                      JSON_TABLE(
                          i_draft_law_json,
                          '$.suggestions[*]'  -- JSON路径，提取suggestions数组
                          COLUMNS (
                              suggestions_no INT PATH '$.id',
                              suggestions_id varchar2(36) PATH '$.uuid',
                              edit_type char(1) PATH '$.editType',
                              adopted_flag char(1) PATH '$.adoptedFlag',
                              consult_article_desc clob PATH '$.consultArticleDesc',
                              consult_suggestions varchar2(1000) PATH '$.consultSuggestions'
                          )
                      )
           ) a
    left join
           APP.WB_USER b
    on     
           b.staff_id=v_consult_user
    where  1=1;

    /*09:*/v_step_msg:='09';
    o_return_code := 0;

    /*10:*/v_step_msg:='10';
    o_return_msg := '执行成功';

    /*11:*/v_step_msg:='11';
    commit;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2100_UPDATE_DRAFT_LAW_CONSULT执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;




20260126 16:53:26
CREATE  OR REPLACE  VIEW FLHGDB.VW_DEPT_BELONG AS 
select A.DEPT_ID as dept_code,
       A.DEPT_NAME,
       A.PARENT_ID,
       A.PARENT_NAME,
       A.DEPT_TYPE,
       A.PP_ID,
       A.STATUS,
       A.BELONG_ID,
       b.DEPT_NAME as BELONG_NAME
  from (
		SELECT A.DEPT_ID,
		       A.DEPT_NAME,
		       A.PARENT_ID,
		       A.PARENT_NAME,
		       A.DEPT_TYPE,
		       A.PP_ID,
		       A.STATUS,
		       CASE WHEN (A.DEPT_ID = '0148' OR A.PARENT_ID = '0148') THEN '*'
		            WHEN A.DEPT_TYPE = '总部部门' THEN A.DEPT_ID
		            WHEN A.DEPT_TYPE = '二级总部部门' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '一级分公司' THEN A.DEPT_ID
		            WHEN A.DEPT_TYPE = '二级分公司' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '一级分公司部门' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '营业部' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '一级子公司' THEN A.DEPT_ID
		            WHEN A.DEPT_TYPE = '二级子公司' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '一级子公司部门' THEN A.PARENT_ID
		            ELSE '待定' END AS BELONG_ID
		  FROM (SELECT A.DEPT_ID,
		               A.DEPT_NAME,
		               A.PARENT_ID,
		               B.DEPT_NAME AS PARENT_NAME,
		               CASE WHEN A.PARENT_ID in ('D1') THEN CASE WHEN A.DEPT_ID = '0148' THEN '法律合规部'
		                                                         ELSE '总部部门' END
		                    WHEN B.PARENT_ID in ('D1') THEN '二级总部部门' 
		                    WHEN A.PARENT_ID in ('D2') THEN '一级分公司'
		                    WHEN B.PARENT_ID in ('D2') THEN CASE WHEN A.DEPT_NAME LIKE '%分公司' THEN '二级分公司'
		                                                         WHEN A.DEPT_NAME LIKE '%营业部' THEN '营业部'
		                                                         ELSE '一级分公司部门' END
		                    WHEN (A.PARENT_ID IN ('0','D3') AND NOT (A.DEPT_ID IN ('D1', 'D2', 'D3'))) THEN '一级子公司'
		                    WHEN (A.DEPT_NAME LIKE '%公司' AND NOT (A.DEPT_NAME LIKE '%分公司') AND B.PARENT_ID IN ('0', 'D3')) THEN '二级子公司'
		                    WHEN (B.PARENT_ID IN ('0','D3') AND NOT (B.DEPT_ID IN ('D1', 'D2', 'D3'))) THEN '一级子公司部门'
		                    ELSE '待定' END AS DEPT_TYPE,
		               B.PARENT_ID AS PP_ID,
		               A.STATUS
		          FROM APP.WB_DEPT AS A
		          LEFT JOIN APP.WB_DEPT AS B
		            ON A.PARENT_ID = B.DEPT_ID
		       ) AS A
	   ) a
  left join 
       APP.WB_DEPT b
    on a.BELONG_ID=b.DEPT_ID
;
COMMENT ON VIEW FLHGDB.VW_DEPT_BELONG is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.BELONG_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.BELONG_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.DEPT_CODE is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.DEPT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.DEPT_TYPE is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.PARENT_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.PARENT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.PP_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.STATUS is '';

20260130 08:29:22
CREATE  OR REPLACE  VIEW FLHGDB.VW_DEPT_BELONG AS 
select A.DEPT_ID as dept_code,
       A.DEPT_NAME,
       A.PARENT_ID,
       A.PARENT_NAME,
       A.DEPT_TYPE,
       A.PP_ID,
       A.STATUS,
       A.BELONG_ID,
       b.DEPT_NAME as BELONG_NAME
  from (
		SELECT A.DEPT_ID,
		       A.DEPT_NAME,
		       A.PARENT_ID,
		       A.PARENT_NAME,
		       A.DEPT_TYPE,
		       A.PP_ID,
		       A.STATUS,
		       CASE WHEN (A.DEPT_ID = '0148' OR A.PARENT_ID = '0148') THEN '*'
		            WHEN A.DEPT_TYPE = '总部部门' THEN A.DEPT_ID
		            WHEN A.DEPT_TYPE = '二级总部部门' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '一级分公司' THEN A.DEPT_ID
		            WHEN A.DEPT_TYPE = '二级分公司' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '一级分公司部门' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '营业部' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '一级子公司' THEN A.DEPT_ID
		            WHEN A.DEPT_TYPE = '二级子公司' THEN A.PARENT_ID
		            WHEN A.DEPT_TYPE = '一级子公司部门' THEN A.PARENT_ID
		            ELSE '待定' END AS BELONG_ID
		  FROM (SELECT A.DEPT_ID,
		               A.DEPT_NAME,
		               A.PARENT_ID,
		               B.DEPT_NAME AS PARENT_NAME,
		               CASE WHEN A.PARENT_ID in ('D1') THEN CASE WHEN A.DEPT_ID = '0148' THEN '法律合规部'
		                                                         ELSE '总部部门' END
		                    WHEN B.PARENT_ID in ('D1') THEN '二级总部部门' 
		                    WHEN A.PARENT_ID in ('D2') THEN '一级分公司'
		                    WHEN B.PARENT_ID in ('D2') THEN CASE WHEN A.DEPT_NAME LIKE '%分公司' THEN '二级分公司'
		                                                         WHEN A.DEPT_NAME LIKE '%营业部' THEN '营业部'
		                                                         ELSE '一级分公司部门' END
		                    WHEN (A.PARENT_ID IN ('D0','D3') AND NOT (A.DEPT_ID IN ('D1', 'D2', 'D3'))) THEN '一级子公司'
		                    WHEN (A.DEPT_NAME LIKE '%公司' AND NOT (A.DEPT_NAME LIKE '%分公司') AND B.PARENT_ID IN ('D0', 'D3')) THEN '二级子公司'
		                    WHEN (B.PARENT_ID IN ('D0','D3') AND NOT (B.DEPT_ID IN ('D1', 'D2', 'D3'))) THEN '一级子公司部门'
		                    ELSE '待定' END AS DEPT_TYPE,
		               B.PARENT_ID AS PP_ID,
		               A.STATUS
		          FROM APP.WB_DEPT AS A
		          LEFT JOIN APP.WB_DEPT AS B
		            ON A.PARENT_ID = B.DEPT_ID
		       ) AS A
	   ) a
  left join 
       APP.WB_DEPT b
    on a.BELONG_ID=b.DEPT_ID
;
COMMENT ON VIEW FLHGDB.VW_DEPT_BELONG is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.BELONG_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.BELONG_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.DEPT_CODE is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.DEPT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.DEPT_TYPE is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.PARENT_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.PARENT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.PP_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DEPT_BELONG.STATUS is '';



CREATE OR REPLACE PROCEDURE FLHGDB.P2100_CREATE_THANK_EMAIL
(
    i_draft_law_id                       IN VARCHAR2 ,
    o_return_code                        OUT INT ,
    o_return_msg                         OUT CLOB 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询感谢信生成
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260128 16:31:53
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         CLOB ;
    v_receiver                           VARCHAR2(1000) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:被采纳的人才发送*/v_step_msg:='01';
    select listagg(flow_processor,',') within group(order by flow_processor)
    into   v_receiver 
    from   flhgdb.tb_draft_law_flow a 
    where  a.draft_law_id=i_draft_law_id
    and    exists(select 1 from flhgdb.tb_draft_law_consult b 
                  where  a.draft_law_id=b.draft_law_id
                  and    a.flow_processor=b.consult_user
                  and    b.adopted_flag in ('1','2')
                 );

    /*02:发送立法草案征询感谢信*/v_step_msg:='02';
    app.pr_create_email_msg('449B648B3FE2B2111692C4B55EE67051',v_receiver,i_draft_law_id,v_return_code,v_return_msg);

    /*03:*/v_step_msg:='03';
    o_return_code := 0;

    /*04:*/v_step_msg:='04';
    o_return_msg := v_return_msg;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2100_CREATE_THANK_EMAIL执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE FLHGDB.P2100_QUERY_FLOW_PROCESSOR_LIST
(
    i_flow_processor                     IN VARCHAR2 ,
    o_return_code                        OUT INT ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 查询当前流程处理人继续推送可选人员
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260126 16:22:01
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_return_json                        CLOB ;
    v_dept_code                          VARCHAR2(100) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:取节点人员所在部门*/v_step_msg:='01';
    select a.dept_id
    into   v_dept_code
    from   app.wb_user a
    where  a.staff_id=i_flow_processor;

    /*02:拼接可选人员清单,速度较慢*/
    /*
    for cur in (select a.staff_id,a.display_name
                from   app.wb_user a
                inner join 
                       (SELECT b.dept_code
                        from   flhgdb.vw_dept_belong a 
                        inner join 
                               flhgdb.vw_dept_belong b 
                        on     (a.BELONG_ID=b.DEPT_CODE or b.PARENT_ID=a.BELONG_ID or a.belong_id='*') 
                        and    b.dept_type not in ('待定','营业部','二级分公司','二级子公司')
                        where  a.dept_type not in ('待定','营业部','二级分公司','二级子公司') 
                        and    a.dept_code=v_dept_code
                       ) b
                on     a.dept_id =b.dept_code
                where  a.STATUS='1')
    loop
        v_return_json:=v_return_json||
                       case when v_return_json is null then '' else ',' end||
                       '{"value": "'||cur.staff_id||'"'||
                       ',"label": "'||cur.display_name||'('||cur.staff_id||')"}'; 
    end loop;*/

    /*03:*/v_step_msg:='03';
    select a.staff_id as "value",
           a.display_name||'('||a.staff_id||')' as "label"
    from   app.wb_user a
    inner join 
           (SELECT b.dept_code
            from   flhgdb.vw_dept_belong a 
            inner join 
                   flhgdb.vw_dept_belong b 
            on     (a.BELONG_id=b.DEPT_CODE or b.PARENT_id=a.BELONG_id or a.belong_id='*') 
            and    b.dept_type not in ('待定','营业部','二级分公司','二级子公司')--不在可推送范围
            where  a.dept_type not in ('待定','营业部','二级分公司','二级子公司')--不在可推送范围
            and    a.dept_code=v_dept_code
           ) b
    on     a.dept_id =b.dept_code
    where  a.STATUS='1';

    /*04:*/v_step_msg:='04';
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
       v_step_msg  := 'FLHGDB.P2100_QUERY_FLOW_PROCESSOR_LIST执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;




20260126 16:31:51
create or replace view FLHGDB.VW_DRAFT_LAW as 
select a.TITLE,
       a.DRAFT_LAW_NAME,
       a.CREATE_USER,
       f.display_name as CREATE_USER_NAME,
       to_char(a.CREATE_TIME,'YYYYMMDD hh24:mi:ss') as CREATE_TIME,
       a.DEPT_CODE,
       a.DEPT_NAME,
       a.DRAFT_LAW_NO,
       a.DRAFT_LAW_ID,
       a.ISSUING_AUTHORITY,
       case when a.ISSUING_AUTHORITY='Z' then a.ISSUING_AUTHORITY_NAME else e.v end as ISSUING_AUTHORITY_NAME,
       a.LAW_LEVEL,
       c.v as LAW_LEVEL_NAME,
       a1.ARTICLE_COUNT,
       a.END_TIME,
       a.LAW_DESC,
       a.CONSULT_STATUS,
       b.v as CONSULT_STATUS_NAME,
       a.DRAFT_LAW_TYPE,
       d.v as DRAFT_LAW_TYPE_NAME
from   FLHGDB.tb_draft_law a
left join 
       (select DRAFT_LAW_ID,
               count(1) as ARTICLE_COUNT
        from   FLHGDB.tb_draft_law_ARTICLE
        group by DRAFT_LAW_ID
       ) a1
on     a.DRAFT_LAW_ID=a1.DRAFT_LAW_ID
left join 
       app.VW_DICT b
on     a.CONSULT_STATUS=b.K
and    b.KEY_NAME='CONSULT_STATUS'
left join 
       app.VW_DICT c
on     a.LAW_LEVEL=c.K
and    c.KEY_NAME='LAW_LEVEL'
left join 
       app.VW_DICT d
on     a.DRAFT_LAW_TYPE=d.K
and    d.KEY_NAME='DRAFT_LAW_TYPE'
left join 
       app.VW_DICT e
on     a.ISSUING_AUTHORITY=e.K
and    e.KEY_NAME='ISSUING_AUTHORITY'
left join 
       app.wb_user f 
on     a.CREATE_USER=f.STAFF_ID
;
COMMENT ON VIEW FLHGDB.VW_DRAFT_LAW is '立法草案信息视图';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.ARTICLE_COUNT is '条目数';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.CONSULT_STATUS is '征询状态';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.CONSULT_STATUS_NAME is '征询状态名';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.CREATE_TIME is '创建时间';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.CREATE_USER is '创建人';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.CREATE_USER_NAME is '创建人姓名';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.DEPT_CODE is '部门代码';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.DEPT_NAME is '部门名称';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.DRAFT_LAW_ID is '草案UUID';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.DRAFT_LAW_NAME is '草案文件名';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.DRAFT_LAW_NO is '文件编号，格式：国泰海通立法点[2025]第（）号';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.DRAFT_LAW_TYPE is '文件类别';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.DRAFT_LAW_TYPE_NAME is '编辑类别名';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.END_TIME is '截止时间';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.ISSUING_AUTHORITY is '发布/征询单位编号';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.ISSUING_AUTHORITY_NAME is '发布/征询单位，编号为Z其他时填写';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.LAW_DESC is '制度详细信息';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.LAW_LEVEL is '层级/效力';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.LAW_LEVEL_NAME is '层级/效力名';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW.TITLE is '标题，格式：国泰海通 证券基层立法联系点关于反 馈（ ）《 》的意见建议';



CREATE OR REPLACE PROCEDURE FLHGDB.P2100
(
    i_title                              IN VARCHAR2 ,--标题
    i_draft_law_no                       IN VARCHAR2 ,--文件编号
    i_draft_law_id                       IN VARCHAR2 ,--草案UUID
    i_issuing_authority                  IN VARCHAR2 ,--征询单位
    i_law_level                          IN VARCHAR2 ,--层级
    i_consult_status                     IN VARCHAR2 ,--征询状态
    i_draft_law_type                     IN VARCHAR2 ,--文件类别
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询文件查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260123 09:18:40
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:*/v_step_msg:='01';
    select a.TITLE as "title",
           a.draft_law_name as "lawName",
           a.CREATE_USER as "creatorUser",
           a.CREATE_USER_NAME as "creatorUserName",
           a.CREATE_TIME as "createTime",
           a.DEPT_CODE as "deptCode",
           a.DEPT_NAME as "deptName",
           a.DRAFT_LAW_NO as "draftLawNo",
           a.DRAFT_LAW_ID as "draftLawId",
           a.ISSUING_AUTHORITY as "issuingAuthority",
           a.ISSUING_AUTHORITY_NAME as "issuingAuthorityName",
           a.LAW_LEVEL as "lawLevel",
           a.LAW_LEVEL_NAME as "lawLevelName",
           a.ARTICLE_COUNT as "articleCount",
           a.END_TIME as "endTime",
           a.LAW_DESC as "lawDesc",
           a.CONSULT_STATUS as "consultStatus",
           a.CONSULT_STATUS_NAME as "consultStatusName",
           a.DRAFT_LAW_TYPE as "draftLawType",
           a.DRAFT_LAW_TYPE_NAME as "draftLawTypeName" 
    from   FLHGDB.vw_draft_law a
    where  (instr(a.title,i_title)>0 or i_title is null)
    and    (instr(a.draft_law_no,i_draft_law_no)>0 or i_draft_law_no is null)
    and    (a.draft_law_id=i_draft_law_id or i_draft_law_id is null)
    and    (instr(i_issuing_authority,a.issuing_authority)>0 or i_issuing_authority is null)
    and    (instr(i_law_level,a.law_level)>0 or i_law_level is null)
    and    (instr(i_consult_status,a.consult_status)>0 or i_consult_status is null)
    and    (instr(i_draft_law_type,a.draft_law_type)>0 or i_draft_law_type is null)
    order by a.CREATE_TIME desc
    ;

    /*02:*/v_step_msg:='02';
    o_return_code := 0;

    /*03:*/v_step_msg:='03';
    o_return_msg := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2100执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE FLHGDB.P2101
(
    i_title                              IN VARCHAR2 ,--标题
    i_draft_law_no                       IN VARCHAR2 ,--文件编号
    i_draft_law_id                       IN VARCHAR2 ,--草案UUID或流程UUID
    i_article_id                         IN VARCHAR2 ,--条目UUID
    i_if_consult                         IN VARCHAR2 ,--是否征询
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询文件条目查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260126 08:40:56
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_draft_law_id                       VARCHAR2(36) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:输入流程ID获取草案ID或直接取输入的草案ID*/v_step_msg:='01';
    select max(coalesce(b.draft_law_id,a.draft_law_id))
    into   v_draft_law_id
    from   FLHGDB.tb_draft_law a 
    left join 
           FLHGDB.tb_draft_law_flow b 
    on     a.DRAFT_LAW_ID=b.DRAFT_LAW_ID
    and    b.flow_id=i_draft_law_id
    where  (a.DRAFT_LAW_ID=i_draft_law_id or b.flow_id=i_draft_law_id);

    /*02:*/v_step_msg:='02';
    select a.TITLE as "title",
           a.DRAFT_LAW_NO  as "draftLawNo",
           a.DRAFT_LAW_ID  as "draftLawId",
           b.ARTICLE_NO as "articleNo",
           b.ARTICLE_ID as "articleId",
           b.ARTICLE_DESC as "articleDesc",
           b.ARTICLE_DESC_ORGINAL as "articleDescOrginal",
           b.IF_CONSULT as "ifConsult",
           a.CONSULT_STATUS,
           a.CONSULT_STATUS_NAME,
           a.ISSUING_AUTHORITY ,
           a.ISSUING_AUTHORITY_NAME ,
           a.LAW_LEVEL ,
           a.LAW_LEVEL_NAME ,
           a.DRAFT_LAW_TYPE ,
           a.DRAFT_LAW_TYPE_NAME as LAWTYPE_NAME ,
           a.END_TIME as DEADLINE 
    from   FLHGDB.vw_draft_law a
    left join 
           FLHGDB.tb_draft_law_article b 
    on     a.DRAFT_LAW_ID=b.DRAFT_LAW_ID
    where  (instr(a.title,i_title)>0 or i_title is null)
    and    (instr(a.draft_law_no,i_draft_law_no)>0 or i_draft_law_no is null)
    and    (a.draft_law_id=v_draft_law_id or v_draft_law_id is null)
    and    (b.article_id=i_article_id or i_article_id is null)
    and    (instr(i_if_consult,b.if_consult)>0 or i_if_consult is null)
    order by a.DRAFT_LAW_NO desc,b.ARTICLE_NO
    ;

    /*03:*/v_step_msg:='03';
    o_return_code := 0;

    /*04:*/v_step_msg:='04';
    o_return_msg := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2101执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE FLHGDB.P2102
(
    i_draft_law_id                       IN VARCHAR2 ,--草案UUID
    i_flow_id                            IN VARCHAR2 ,--流程UUID
    i_article_id                         IN VARCHAR2(36) ,
    i_user_code                          IN VARCHAR2(100) ,
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询文件条目意见查询
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260126 16:24:55
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_draft_law_id                       VARCHAR2(36) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:获取输入的流程ID对应的草案ID或输入的草案ID*/v_step_msg:='01';
    select max(coalesce(b.draft_law_id,a.draft_law_id))
    into   v_draft_law_id
    from   FLHGDB.tb_draft_law a 
    left join 
           FLHGDB.tb_draft_law_flow b 
    on     a.DRAFT_LAW_ID=b.DRAFT_LAW_ID
    and    b.flow_id=i_flow_id
    where  (a.DRAFT_LAW_ID=i_draft_law_id or b.flow_id=i_flow_id);

    /*03:条目意见和其他意见union*/v_step_msg:='03';
    select d.TITLE,
           d.draft_law_name,
           d.DRAFT_LAW_NO,
           d.DRAFT_LAW_ID,
           a.ARTICLE_NO,
           a.ARTICLE_ID,
           b.SUGGESTIONS_ID,
           b.SUGGESTIONS_NO,
           c.CONSULT_STATUS,
           e.V as CONSULT_STATUS_NAME,
           b.EDIT_TYPE,
           f.V as EDIT_TYPE_NAME,
           a.ARTICLE_DESC,
           b.CONSULT_ARTICLE_DESC,
           b.ADOPTED_FLAG,
           g.V as ADOPTED_FLAG_NAME,
           b.CONSULT_SUGGESTIONS,
           b.CONSULT_USER,
           h.display_name as CONSULT_USER_NAME,
           b.CONSULT_TIME,
           b.DEPT_CODE,
           b.DEPT_NAME,
           d.ISSUING_AUTHORITY,
           d.ISSUING_AUTHORITY_NAME,
           d.LAW_LEVEL,
           d.LAW_LEVEL_NAME,
           d.DRAFT_LAW_TYPE,
           d.DRAFT_LAW_TYPE_NAME as LAWTYPE_NAME,
           to_char(d.END_TIME,'YYYYMMDD hh24:mi:ss') as DEADLINE,
           a.IF_CONSULT
    from   FLHGDB.TB_DRAFT_LAW_ARTICLE a 
    left join 
           FLHGDB.TB_DRAFT_LAW_CONSULT b
    on     a.ARTICLE_ID=b.ARTICLE_ID
    left join 
           FLHGDB.TB_DRAFT_LAW_FLOW c 
    on     a.DRAFT_LAW_ID=c.DRAFT_LAW_ID
    and    b.CONSULT_USER=c.flow_processor
    and    (c.FLOW_ID=i_flow_id or i_flow_id is null)
    inner join 
           FLHGDB.VW_DRAFT_LAW d
    on     a.draft_law_id=d.draft_law_id
    left join 
           app.VW_DICT e
    on     c.CONSULT_STATUS=e.K
    and    e.KEY_NAME='CONSULT_STATUS'
    left join 
           app.VW_DICT f
    on     b.EDIT_TYPE=f.K
    and    f.KEY_NAME='EDIT_TYPE'
    left join 
           app.VW_DICT g
    on     b.ADOPTED_FLAG=g.K
    and    g.KEY_NAME='ADOPTED_FLAG'
    left join 
           app.wb_user h 
    on     b.CONSULT_USER=h.staff_id
    where  a.DRAFT_LAW_ID=v_draft_law_id
    and    (a.ARTICLE_ID=i_article_id or i_article_id is null)
    and    ((i_flow_id is not null and b.CONSULT_USER=c.flow_processor) or i_flow_id is null)
    union all
    select d.TITLE,
           d.draft_law_name,
           d.DRAFT_LAW_NO,
           d.DRAFT_LAW_ID,
           9999,
           '-',
           b.SUGGESTIONS_ID,
           b.SUGGESTIONS_NO,
           c.CONSULT_STATUS,
           e.V as CONSULT_STATUS_NAME,
           b.EDIT_TYPE,
           f.V as EDIT_TYPE_NAME,
           null,
           b.CONSULT_ARTICLE_DESC,
           b.ADOPTED_FLAG,
           g.V as ADOPTED_FLAG_NAME,
           b.CONSULT_SUGGESTIONS,
           b.CONSULT_USER,
           h.display_name as CONSULT_USER_NAME,
           b.CONSULT_TIME,
           b.DEPT_CODE,
           b.DEPT_NAME,
           d.ISSUING_AUTHORITY,
           d.ISSUING_AUTHORITY_NAME,
           d.LAW_LEVEL,
           d.LAW_LEVEL_NAME,
           d.DRAFT_LAW_TYPE,
           d.DRAFT_LAW_TYPE_NAME as LAWTYPE_NAME,
           to_char(d.END_TIME,'YYYYMMDD hh24:mi:ss') as DEADLINE,
           '1'
    from   FLHGDB.TB_DRAFT_LAW_CONSULT b
    left join 
           FLHGDB.TB_DRAFT_LAW_FLOW c 
    on     b.DRAFT_LAW_ID=c.DRAFT_LAW_ID
    and    b.CONSULT_USER=c.flow_processor
    and    (c.FLOW_ID=i_flow_id or i_flow_id is null)
    inner join 
           FLHGDB.VW_DRAFT_LAW d
    on     b.draft_law_id=d.draft_law_id
    left join 
           app.VW_DICT e
    on     c.CONSULT_STATUS=e.K
    and    e.KEY_NAME='CONSULT_STATUS'
    left join 
           app.VW_DICT f
    on     b.EDIT_TYPE=f.K
    and    f.KEY_NAME='EDIT_TYPE'
    left join 
           app.VW_DICT g
    on     b.ADOPTED_FLAG=g.K
    and    g.KEY_NAME='ADOPTED_FLAG'
    left join 
           app.wb_user h 
    on     b.CONSULT_USER=h.staff_id
    where  b.DRAFT_LAW_ID=v_draft_law_id
    and    b.ARTICLE_ID='-'
    and    (b.ARTICLE_ID=i_article_id or i_article_id is null)
    and    ((i_flow_id is not null and b.CONSULT_USER=c.flow_processor) or i_flow_id is null)
    ;

    /*04:*/v_step_msg:='04';
    o_return_code := 0;

    /*05:*/v_step_msg:='05';
    o_return_msg := '执行成功';

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2102执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;




20260126 16:53:26
create or replace view flhgdb.vw_draft_law_flow as 
select a.CREATE_USER as flow_processor,
       b.DISPLAY_NAME as processor_name,
       a.CREATE_TIME as flow_time,
       a.DEPT_CODE as flow_dept_code,
       a.DEPT_NAME as flow_dept_name,
       a.DRAFT_LAW_ID as flow_id,
       null as parent_id,
       a.CONSULT_STATUS,
       a.CONSULT_STATUS_NAME,
       a.DRAFT_LAW_ID,
       a.TITLE,
       a.DRAFT_LAW_NAME,
       a.DRAFT_LAW_NO,
       a.ISSUING_AUTHORITY,
       a.ISSUING_AUTHORITY_NAME,
       a.LAW_LEVEL,
       a.LAW_LEVEL_NAME,
       a.DRAFT_LAW_TYPE,
       a.DRAFT_LAW_TYPE_NAME,
       a.END_TIME
from   FLHGDB.vw_draft_law a
left join 
       basic_hg.wb_user b 
on     a.CREATE_USER=b.STAFF_ID
where  a.CONSULT_STATUS is not null
union all
select a.flow_processor,
       b.DISPLAY_NAME as processor_name,
       a.flow_time,
       coalesce(decode(c.belong_id,'*','0148',c.belong_id),a.flow_dept_code) as flow_dept_code,
       coalesce(decode(c.belong_id,'*','法律合规部',c.belong_name),a.flow_dept_name) as flow_dept_name,
       a.flow_id,
       coalesce(a.parent_flow_id,a.DRAFT_LAW_ID),
       a.consult_status,
       d.V as CONSULT_STATUS_NAME,
       a.draft_law_id,
       a1.TITLE,
       a1.DRAFT_LAW_NAME,
       a1.DRAFT_LAW_NO,
       a1.ISSUING_AUTHORITY,
       a1.ISSUING_AUTHORITY_NAME,
       a1.LAW_LEVEL,
       a1.LAW_LEVEL_NAME,
       a1.DRAFT_LAW_TYPE,
       a1.DRAFT_LAW_TYPE_NAME,
       a1.END_TIME
from   flhgdb.tb_draft_law_flow a
inner join 
       FLHGDB.vw_draft_law a1 
on     a.DRAFT_LAW_id=a1.draft_law_id
left join 
       app.wb_user b 
on     a.flow_processor=b.STAFF_ID
left join 
       flhgdb.VW_DEPT_BELONG c 
on     a.flow_dept_code=c.dept_code
and    c.belong_id<>'待定'
left join 
       app.VW_DICT d
on     a.CONSULT_STATUS=d.K
and    d.KEY_NAME='CONSULT_STATUS';
COMMENT ON VIEW FLHGDB.VW_DRAFT_LAW_FLOW is '立法草案征询流程视图';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.CONSULT_STATUS is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.CONSULT_STATUS_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_NO is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_TYPE is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_TYPE_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.END_TIME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_DEPT_CODE is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_DEPT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_PROCESSOR is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_TIME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.ISSUING_AUTHORITY is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.ISSUING_AUTHORITY_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.LAW_LEVEL is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.LAW_LEVEL_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.PARENT_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.PROCESSOR_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.TITLE is '';

20260130 08:29:22
create or replace view flhgdb.vw_draft_law_flow as 
select a.CREATE_USER as flow_processor,
       b.DISPLAY_NAME as processor_name,
       a.CREATE_TIME as flow_time,
       a.DEPT_CODE as flow_dept_code,
       a.DEPT_NAME as flow_dept_name,
       a.DRAFT_LAW_ID as flow_id,
       null as parent_id,
       a.CONSULT_STATUS,
       a.CONSULT_STATUS_NAME,
       a.DRAFT_LAW_ID,
       a.TITLE,
       a.DRAFT_LAW_NAME,
       a.DRAFT_LAW_NO,
       a.ISSUING_AUTHORITY,
       a.ISSUING_AUTHORITY_NAME,
       a.LAW_LEVEL,
       a.LAW_LEVEL_NAME,
       a.DRAFT_LAW_TYPE,
       a.DRAFT_LAW_TYPE_NAME,
       a.END_TIME
from   FLHGDB.vw_draft_law a
left join 
       basic_hg.wb_user b 
on     a.CREATE_USER=b.STAFF_ID
where  a.CONSULT_STATUS is not null
union all
select a.flow_processor,
       b.DISPLAY_NAME as processor_name,
       a.flow_time,
       coalesce(decode(c.belong_id,'*','0148',c.belong_id),a.flow_dept_code) as flow_dept_code,
       coalesce(decode(c.belong_id,'*','法律合规部',c.belong_name),a.flow_dept_name) as flow_dept_name,
       a.flow_id,
       coalesce(a.parent_flow_id,a.DRAFT_LAW_ID),
       a.consult_status,
       d.V as CONSULT_STATUS_NAME,
       a.draft_law_id,
       a1.TITLE,
       a1.DRAFT_LAW_NAME,
       a1.DRAFT_LAW_NO,
       a1.ISSUING_AUTHORITY,
       a1.ISSUING_AUTHORITY_NAME,
       a1.LAW_LEVEL,
       a1.LAW_LEVEL_NAME,
       a1.DRAFT_LAW_TYPE,
       a1.DRAFT_LAW_TYPE_NAME,
       a1.END_TIME
from   flhgdb.tb_draft_law_flow a
inner join 
       FLHGDB.vw_draft_law a1 
on     a.DRAFT_LAW_id=a1.draft_law_id
left join 
       app.wb_user b 
on     a.flow_processor=b.STAFF_ID
left join 
       flhgdb.VW_DEPT_BELONG c 
on     a.flow_dept_code=c.dept_code
and    c.belong_id<>'待定'
left join 
       app.VW_DICT d
on     a.CONSULT_STATUS=d.K
and    d.KEY_NAME='CONSULT_STATUS';
COMMENT ON VIEW FLHGDB.VW_DRAFT_LAW_FLOW is '立法草案征询流程视图';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.CONSULT_STATUS is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.CONSULT_STATUS_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_NO is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_TYPE is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.DRAFT_LAW_TYPE_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.END_TIME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_DEPT_CODE is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_DEPT_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_PROCESSOR is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.FLOW_TIME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.ISSUING_AUTHORITY is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.ISSUING_AUTHORITY_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.LAW_LEVEL is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.LAW_LEVEL_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.PARENT_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.PROCESSOR_NAME is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW.TITLE is '';



CREATE OR REPLACE PROCEDURE FLHGDB.P2100_QUERY_FLOW_1
(
    i_draft_law_id                       IN VARCHAR2 ,--草案UUID或流程UUID
    i_flow_processor                     IN VARCHAR2 ,--流程节点人员
    o_return_code                        OUT INT ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询流程树查询nodes_edges版（JSON字符串）
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260130 09:40:45
    -- 修改内容:1.0:
    -- 修改内容:达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_return_json                        CLOB ;
    v_edges                              CLOB ;
    v_nodes                              CLOB ;
    v_root_id                            VARCHAR2(36) ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
    v_draft_law_id                       VARCHAR2(100) ;
BEGIN
    /*01:草案创建人获取根节点即草案UUID*/v_step_msg:='01';
    select max(a.flow_id),
           max(a.draft_law_id)
    into   v_root_id,
           v_draft_law_id
    from   flhgdb.VW_DRAFT_LAW_FLOW a
    where  ((a.FLOW_ID=i_draft_law_id and a.parent_id is not null) or (a.DRAFT_LAW_ID=i_draft_law_id and a.parent_id is null))
    and    (a.flow_processor=i_flow_processor or i_flow_processor is null);

    /*03:*/v_step_msg:='03';
    delete from FLHGDB.tmp_tree_flat;

    /*04:插入树形数据到临时表*/v_step_msg:='04';
    insert into FLHGDB.tmp_tree_flat
    (
    id,
    PARENT_ID,
    level
    )
    WITH RECURSIVE tree(id,parent_id,level) AS 
    (
    -- 根节点
    SELECT 
        t.flow_id,
        null as parent_id,
        1 AS level
    FROM flhgdb.VW_DRAFT_LAW_FLOW t
    WHERE t.flow_id=v_root_id
    and   t.draft_law_id=v_draft_law_id
    UNION ALL
    -- 子节点
    SELECT 
        c.flow_id,
        c.parent_id,
        p.level + 1 AS level
    FROM flhgdb.VW_DRAFT_LAW_FLOW c
    INNER JOIN tree p ON c.parent_id = p.id
    where c.draft_law_id=v_draft_law_id
    )
    select id,parent_id,level from tree;

    /*05:拼接节点关系对象数组*/v_step_msg:='05';
    select listagg('{"source":"'||a.parent_id||'","target": "'||a.id||'"}',',') within group (order by a.parent_id)
    into   v_edges
    from   FLHGDB.tmp_tree_flat a
    where  a.parent_id is not null
    ;

    /*06:*/v_step_msg:='06';
    v_edges:='"edges": ['||v_edges||']';

    /*07:拼接节点对象数组*/v_step_msg:='07';
    select listagg('{"id":"'||a.id||'","data": {"flow_processor":"'||b.flow_processor||'",'||
                                               '"processor_name":"'||b.processor_name||'",'||
                                               '"flow_time":"'||b.flow_time||'",'||
                                               '"flow_dept_code":"'||b.flow_dept_code||'",'||
                                               '"flow_dept_name":"'||b.flow_dept_name||'",'||
                                               '"consult_status":"'||b.consult_status||'"'||
                                               '}}',',') within group (order by a.parent_id)
    into   v_nodes
    from   FLHGDB.tmp_tree_flat a
    inner join 
    flhgdb.VW_DRAFT_LAW_FLOW b 
    on     a.id=b.flow_id
    and    b.draft_law_id=v_draft_law_id
    ;

    /*08:*/v_step_msg:='08';
    v_nodes:='"nodes": ['||v_nodes||']';

    /*09:*/v_step_msg:='09';
    v_return_json:='{'||v_nodes||','||v_edges||'}';

    /*10:*/v_step_msg:='10';
    o_return_code := 0;

    /*11:*/v_step_msg:='11';
    o_return_msg := case when JSON_VALID(v_return_json)='1' then v_return_json else '格式错误'||v_return_json end;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2100_QUERY_FLOW_1执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;



CREATE OR REPLACE PROCEDURE FLHGDB.P2100_QUERY_FLOW_2
(
    i_draft_law_id                       IN VARCHAR2 ,--草案UUID或流程UUID
    i_flow_processor                     IN VARCHAR2 ,
    o_return_code                        OUT INT ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.0
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 立法草案征询流程树查询id_children版（JSON字符串）
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20260130 09:35:31
    -- 修改内容:1.0:
    -- 修改内容: 达梦版1.0
    --==============================================================================
    v_return_code                        INTEGER ;
    v_return_msg                         VARCHAR2(100) ;
    v_return_json                        CLOB ;
    v_root_id                            VARCHAR2(100) ;
    v_draft_law_id                       VARCHAR2(100) ;
    v_max_level                          INT ;
    v_current_level                      INT ;
    v_step_msg                           VARCHAR2(1000) ;--记录执行步骤号
BEGIN
    /*01:*/v_step_msg:='01';
    select max(a.flow_id),
           max(a.draft_law_id)
    into   v_root_id,
           v_draft_law_id
    from   flhgdb.VW_DRAFT_LAW_FLOW a
    where  ((a.FLOW_ID=i_draft_law_id and a.parent_id is not null) or (a.DRAFT_LAW_ID=i_draft_law_id and a.parent_id is null))
    and    (a.flow_processor=i_flow_processor or i_flow_processor is null);

    /*03:*/v_step_msg:='03';
    delete from FLHGDB.tmp_tree_flat;

    /*04:插入树形数据到临时表*/v_step_msg:='04';
    insert into FLHGDB.tmp_tree_flat
    (
    id,
    PARENT_ID,
    level
    )
    WITH RECURSIVE tree(id,parent_id,level) AS 
    (
    -- 根节点
    SELECT 
        t.flow_id,
        null as parent_id,
        1 AS level
    FROM flhgdb.VW_DRAFT_LAW_FLOW t
    WHERE t.flow_id=v_root_id
    and   t.DRAFT_LAW_ID=v_draft_law_id
    UNION ALL
    -- 子节点
    SELECT 
        c.flow_id,
        c.parent_id,
        p.level + 1 AS level
    FROM flhgdb.VW_DRAFT_LAW_FLOW c
    INNER JOIN tree p ON c.parent_id = p.id
    where c.DRAFT_LAW_ID=v_draft_law_id
    )
    select id,parent_id,level from tree;

    /*05:插入叶子节点 JSON*/v_step_msg:='05';
    insert into FLHGDB.TMP_NODE_JSON
    (
           ID,
           PARENT_ID,
           JSON_STR,
           IS_LEAF
    )
    select 
           a.id as ID,
           a.parent_id as PARENT_ID,
           '{"id":"' || a.id || '"' || 
           ',"flow_processor":"' || b.flow_processor || '"' || 
           ',"processor_name":"' || b.processor_name || '"' || 
           ',"flow_time":"' || b.flow_time || '"' || 
           ',"flow_dept_code":"' || b.flow_dept_code || '"' || 
           ',"flow_dept_name":"' || b.flow_dept_name || '"' || 
           ',"consult_status":"' || b.consult_status || '"' || 
           '}' as JSON_STR,
           1 as IS_LEAF
    from   
           flhgdb.tmp_tree_flat a
    inner join
           flhgdb.VW_DRAFT_LAW_FLOW b
    on     
           a.ID=b.FLOW_ID
    and    b.DRAFT_LAW_ID=v_draft_law_id
    where  NOT EXISTS (SELECT 1 FROM flhgdb.tmp_tree_flat c WHERE c.parent_id = a.id);

    /*06:*/v_step_msg:='06';
    SELECT MAX(level) INTO v_max_level FROM flhgdb.tmp_tree_flat;

    /*07:*/v_step_msg:='07';
    v_current_level := v_max_level - 1;

        /*08.01:*/
    WHILE v_current_level >= 1 LOOP

        /*08.02: 插入当前层级的非叶子节点 JSON*/v_step_msg:='08.02';
        insert into FLHGDB.TMP_NODE_JSON
        (
               ID,
               PARENT_ID,
               JSON_STR,
               IS_LEAF
        )
        select 
               a.id as ID,
               a.parent_id as PARENT_ID,
               case when v_current_level>1 then 
                       '{"id":"' || a.id || '"' || 
                       ',"flow_processor":"' || b.flow_processor || '"' || 
                       ',"processor_name":"' || b.processor_name || '"' || 
                       ',"flow_time":"' || b.flow_time || '"' || 
                       ',"flow_dept_code":"' || b.flow_dept_code || '"' || 
                       ',"flow_dept_name":"' || b.flow_dept_name || '"' || 
                       ',"consult_status":"' || b.consult_status || '"' || 
                       ',"children":[' || LISTAGG(tnj.json_str, ',') WITHIN GROUP (ORDER BY a.id) || ']}'
                    else '[' || LISTAGG(tnj.json_str, ',') WITHIN GROUP (ORDER BY a.id) || ']' end as JSON_STR,
               0 as IS_LEAF
        from   
               FLHGDB.TMP_TREE_FLAT a
        inner join
               FLHGDB.VW_DRAFT_LAW_FLOW b
        on     
               a.ID=b.FLOW_ID
                and    b.DRAFT_LAW_ID=v_draft_law_id
        inner join
               flhgdb.tmp_node_json tnj
        on     
               a.id = tnj.parent_id
        where  a.level = v_current_level
          AND NOT EXISTS (SELECT 1 FROM flhgdb.tmp_node_json t WHERE t.id = a.id)
        GROUP BY a.id, a.parent_id, b.flow_processor,b.processor_name,b.flow_time,b.flow_dept_code,b.flow_dept_name, b.consult_status;

        /*08.03:*/v_step_msg:='08.03';
        v_current_level := v_current_level - 1;

        /*08.99:*/
    end loop;

    /*09:*/v_step_msg:='09';
    select case when a.json_str not like '[%]' then '['||a.json_str||']' else a.json_str end
    into   v_return_json
    from   flhgdb.tmp_node_json a
    where  a.id=v_root_id;

    /*10:*/v_step_msg:='10';
    o_return_code := 0;

    /*11:*/v_step_msg:='11';
    o_return_msg := v_return_json;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       v_step_msg  := 'FLHGDB.P2100_QUERY_FLOW_2执行报错，步骤号:'||v_step_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(-20000 ,v_step_msg);
   end if;
END;




20260126 16:53:26
create or replace view flhgdb.VW_DRAFT_LAW_FLOW_right as 
    WITH RECURSIVE tree(id,parent_id,level,flow_processor,can_watch_by_id,can_watch_by_user) AS 
    (
    -- 根节点
    SELECT 
        t.flow_id,
        null as parent_id,
        0 AS level,
        t.flow_processor,
        t.flow_id as can_watch_by_id,
        t.flow_processor as can_watch_by_user
    FROM flhgdb.VW_DRAFT_LAW_FLOW t
    WHERE t.parent_id is null
    UNION ALL
    -- 子节点
    SELECT 
        c.flow_id,
        c.parent_id,
        p.level + 1 AS level,
        c.flow_processor,
        c.parent_id||','||p.can_watch_by_id as can_watch_by_id,
        c.flow_processor||','||p.can_watch_by_user as can_watch_by_user
    FROM flhgdb.VW_DRAFT_LAW_FLOW c
    INNER JOIN tree p ON c.parent_id = p.id
    )
    select a.id as flow_id,a.parent_id,a.level,a.flow_processor,a.can_watch_by_id,a.can_watch_by_user from tree a 
    ;
COMMENT ON VIEW FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT is '立法草案流程查看权限视图';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.CAN_WATCH_BY_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.CAN_WATCH_BY_USER is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.FLOW_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.FLOW_PROCESSOR is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.LEVEL is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.PARENT_ID is '';

20260130 08:29:22
create or replace view flhgdb.VW_DRAFT_LAW_FLOW_right as 
    WITH RECURSIVE tree(id,parent_id,level,flow_processor,can_watch_by_id,can_watch_by_user) AS 
    (
    -- 根节点
    SELECT 
        t.flow_id,
        null as parent_id,
        0 AS level,
        t.flow_processor,
        t.flow_id as can_watch_by_id,
        t.flow_processor as can_watch_by_user
    FROM flhgdb.VW_DRAFT_LAW_FLOW t
    WHERE t.parent_id is null
    UNION ALL
    -- 子节点
    SELECT 
        c.flow_id,
        c.parent_id,
        p.level + 1 AS level,
        c.flow_processor,
        c.parent_id||','||p.can_watch_by_id as can_watch_by_id,
        c.flow_processor||','||p.can_watch_by_user as can_watch_by_user
    FROM flhgdb.VW_DRAFT_LAW_FLOW c
    INNER JOIN tree p ON c.parent_id = p.id
    )
    select a.id as flow_id,a.parent_id,a.level,a.flow_processor,a.can_watch_by_id,a.can_watch_by_user from tree a 
    ;
COMMENT ON VIEW FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT is '立法草案流程查看权限视图';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.CAN_WATCH_BY_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.CAN_WATCH_BY_USER is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.FLOW_ID is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.FLOW_PROCESSOR is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.LEVEL is '';
COMMENT ON COLUMN FLHGDB.VW_DRAFT_LAW_FLOW_RIGHT.PARENT_ID is '';



