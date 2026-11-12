CREATE OR REPLACE PROCEDURE "THJS"."P_WRITE_ERROR_LOG" (I_TRADEDATE      IN VARCHAR2,
															 I_EXEC_FUNC_ID   IN INTEGER,
															 I_FUNC_OWN		  IN VARCHAR2,
															 I_FUNC_NAME      IN VARCHAR2,
															 I_OCCUR_TIME     IN DATE,
															 I_SQLERRM        IN VARCHAR2,
															 I_SQLCODE        IN NUMBER,
															 I_SQLERRL        IN VARCHAR2)
AS
BEGIN
	INSERT INTO thjs.T_ERROR_LOG
      (TRADEDATE,
       EXEC_FUNC_ID,
       FUNC_OWN,
       FUNC_NAME,
       OCCUR_TIME,
       SQLERRM,
       SQLCODE,
       SQLERRL,
       GROUND_TIME)
    VALUES
      (TO_CHAR(TRUNC(SYSDATE),'YYYYMMDD'),  --业务日期
       I_EXEC_FUNC_ID,  --任务ID
       I_FUNC_OWN,  --任务归属用户
       I_FUNC_NAME,  --任务名称
       I_OCCUR_TIME,  --任务执行时间
       I_SQLERRM,  --错误提示信息
       I_SQLCODE,  --错误代码
       I_SQLERRL,  --错误行号
       SYSDATE);  --落地时间
    COMMIT;
       
END;
