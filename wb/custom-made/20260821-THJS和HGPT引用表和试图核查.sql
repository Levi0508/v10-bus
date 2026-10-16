--THJS引用的HGPT的表和视图：
select distinct t.referenced_owner||'.'||t.referenced_name from dba_dependencies t where upper(t.owner)='THJS' and upper(t.referenced_owner)='HGPT';
HGPT.TB_HG_PROJLIST_RL2_HGMAIL
HGPT.TB_HG_PROJLIST_RL_ALL
HGPT.TB_HG_QD_PROJLIST_RL_ZY_STK_Q
HGPT.TB_HG_XX_070402
HGPT.TB_HG_XX_070403_ALL
HGPT.TB_HG_XX_070404
HGPT.TB_HG_XX_070501_XGGJ
HGPT.TB_HG_XX_070501_XGGJ_HIS
HGPT.TB_HG_XX_070501_XGGJ_NEW
HGPT.VW_HG_XX_ZSQD_MAIL


----HGPT引用的THJS的表和视图：
select distinct t.referenced_owner||'.'||t.referenced_name from dba_dependencies t where upper(t.owner)='HGPT' and upper(t.referenced_owner)='THJS'
and t.referenced_name like 'VW%'
union 
select distinct a.referenced_owner||'.'||a.referenced_name from  dba_dependencies A
WHERE a.owner||'.'||a.name in(
select distinct t.referenced_owner||'.'||t.referenced_name from dba_dependencies t where upper(t.owner)='HGPT' and upper(t.referenced_owner)='THJS'
and t.referenced_name like 'VW%')
and a.referenced_owner='THJS'
union 
select distinct a1.referenced_owner||'.'||a1.referenced_name from  dba_dependencies A1
where a1.owner||'.'||a1.name in(
select distinct a.referenced_owner||'.'||a.referenced_name from  dba_dependencies A
WHERE a.owner||'.'||a.name in(
select distinct t.referenced_owner||'.'||t.referenced_name from dba_dependencies t where upper(t.owner)='HGPT' and upper(t.referenced_owner)='THJS'
and t.referenced_name like 'VW%')
and a.referenced_owner='THJS')
and a1.referenced_owner='THJS'
;

THJS.TB_IB_CUST_INFO
THJS.TB_PROJLIST_CHECK
THJS.TB_PROJLIST_INOUT
THJS.TB_PROJLIST_MAIN
THJS.TB_PROJLIST_MULTISTK 
THJS.VW_PROJLIST_INOUT
THJS.VW_PROJLIST_MAIN
THJS.VW_PROJLIST_MAIN_ALL
THJS.VW_PROJLIST_MAIN_LTD
THJS.VW_PROJLIST_MULTISTK
THJS.VW_PROJLIST_WIND_STK
THJS.VW_PROJLIST_XGGJ
THJS.VW_PROJLIST_XGGJ_PLUG
THJS.VW_WIND_STK_AH 
