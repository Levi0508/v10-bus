      
-- 1. 先查询将要处理的数据量
SELECT r.*--COUNT(DISTINCT r.cust_id) AS cust_count --23
FROM thjs.TB_FXQ_CERT_REMIND r
LEFT JOIN thjs.T_TH_CLIENT_INFO t ON t.client_id = r.cust_id
WHERE r.cert_flag IN ('客户证件有效截止', '受益所有人证件有效截止', '法人代表证件有效截止')
  AND t.data_status = '1'
  AND t.cust_biz <> '测试'
  AND ((r.remind_date <= '20260904' AND r.remind_date >= '20260725') OR (r.remind_date <= '20260904' AND r.remind_date >= '20260518' AND t.client_id >= 80000)) --正式上线后所以数据，新老系统并行期间新系统客户数据
  AND t.client_id IS NOT NULL;

-- 2. 查询某个客户的具体证件到期明细
SELECT r.* FROM thjs.TB_FXQ_CERT_REMIND r
LEFT JOIN thjs.T_TH_CLIENT_INFO t ON t.client_id = r.cust_id
WHERE r.cust_id = '28238'
  AND r.cert_flag IN ('客户证件有效截止', '受益所有人证件有效截止', '法人代表证件有效截止')
  AND ((r.remind_date <= '20260904' AND r.remind_date >= '20260725') OR (r.remind_date <= '20260904' AND r.remind_date >= '20260518' AND t.client_id >= 80000)); --正式上线后所以数据，新老系统并行期间新系统客户数据;


--3.list表补数
create table thjs.T_TH_APPR_LIST_bak260904_18_11 as select * from thjs.T_TH_APPR_LIST;

select * from thjs.T_TH_APPR_LIST_bak260904_18_11;--5380行数据

INSERT INTO thjs.T_TH_APPR_LIST (client_id, audit_id, remark, create_user, create_time)
SELECT DISTINCT
    t.client_id,
    SYS_GUID() AS audit_id,
    '已设置限制状态，请及时联系客户更新反洗钱表单信息和底稿，完善后请发邮件到合规管理组邮箱（cm_ibd@gtht.com）抄送反洗钱专员，申请解限。' AS remark,
    'admin' AS create_user,
    TO_TIMESTAMP(r.remind_date || ' 08:00:00', 'YYYYMMDD HH24:MI:SS') AS create_time
FROM thjs.TB_FXQ_CERT_REMIND r
LEFT JOIN thjs.T_TH_CLIENT_INFO t ON t.client_id = r.cust_id
WHERE r.cert_flag IN ('客户证件有效截止', '受益所有人证件有效截止', '法人代表证件有效截止')
  AND t.data_status = '1'
  AND t.cust_biz <> '测试'
  AND ((r.remind_date <= '20260904' AND r.remind_date >= '20260725') OR (r.remind_date <= '20260904' AND r.remind_date >= '20260518' AND t.client_id >= 80000)) --正式上线后所以数据，新老系统并行期间新系统客户数据
  AND t.client_id IS NOT NULL;
 
select count(*) from thjs.T_TH_APPR_LIST; --5423条

--4.details表补数
create table thjs.T_TH_APPR_DETAIL_bak260904_18_14 as select * from thjs.T_TH_APPR_DETAIL;

select * from thjs.T_TH_APPR_DETAIL_bak260904_18_14; --11358行数据

INSERT INTO thjs.T_TH_APPR_DETAIL (client_id, audit_id, audit_seq, audit_desc, dispose_desc, score, pk_id, create_user, create_time, update_user, update_time)
SELECT
    t.cust_id AS client_id,
    l.audit_id,
    ROW_NUMBER() OVER (PARTITION BY t.cust_id ORDER BY t.cert_order) AS audit_seq,
    CASE
        WHEN t.cert_flag = '客户证件有效截止' THEN '客户信息错误'
        WHEN t.cert_flag = '法人代表证件有效截止' THEN '客户信息错误'
        WHEN t.cert_flag = '受益所有人证件有效截止' THEN '受益所有人信息错误'
    END AS audit_desc,
    CASE
        WHEN t.cert_flag = '客户证件有效截止' THEN '客户证照有效期截止过期90个自然日'
        WHEN t.cert_flag = '法人代表证件有效截止' THEN '法人代表' || t.dispose_desc || '证件有效截止过期90个自然日'
        WHEN t.cert_flag = '受益所有人证件有效截止' THEN '受益所有人' || t.dispose_desc || '证件有效截止过期90个自然日'
    END AS dispose_desc,
    NULL AS score,
    SYS_GUID() AS pk_id,
    'admin' AS create_user,
    TO_TIMESTAMP(t.remind_date || ' 08:00:00', 'YYYYMMDD HH24:MI:SS') AS create_time,
    'admin' AS update_user,
    TO_TIMESTAMP(t.remind_date || ' 08:00:00', 'YYYYMMDD HH24:MI:SS') AS update_time
FROM (
    SELECT
        r.cust_id,
        r.cert_flag,
        MIN(r.cert_order) AS cert_order,
        LISTAGG(r.remind_name, '、') WITHIN GROUP (ORDER BY r.remind_name) AS dispose_desc,
        MAX(r.remind_date) AS remind_date
    FROM thjs.TB_FXQ_CERT_REMIND r
    LEFT JOIN thjs.T_TH_CLIENT_INFO t ON t.client_id = r.cust_id
    WHERE r.cert_flag IN ('客户证件有效截止', '受益所有人证件有效截止', '法人代表证件有效截止')
      AND t.data_status = '1'
      AND t.cust_biz <> '测试'
      AND ((r.remind_date <= '20260904' AND r.remind_date >= '20260725') OR (r.remind_date <= '20260904' AND r.remind_date >= '20260518' AND t.client_id >= 80000))--正式上线后所以数据，新老系统并行期间新系统客户数据
      AND t.client_id IS NOT NULL
    GROUP BY r.cust_id, r.cert_flag
) t
INNER JOIN thjs.T_TH_APPR_LIST l ON l.client_id = t.cust_id
WHERE l.remark = '已设置限制状态，请及时联系客户更新反洗钱表单信息和底稿，完善后请发邮件到合规管理组邮箱（cm_ibd@gtht.com）抄送反洗钱专员，申请解限。'
  AND l.create_time >= TO_TIMESTAMP(t.remind_date || ' 08:00:00', 'YYYYMMDD HH24:MI:SS') - INTERVAL '1' MINUTE
  AND l.create_time <= TO_TIMESTAMP(t.remind_date || ' 08:00:00', 'YYYYMMDD HH24:MI:SS') + INTERVAL '1' MINUTE;
  
select count(*) from thjs.T_TH_APPR_DETAIL; --11429条

    