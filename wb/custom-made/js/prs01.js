// 表单数据
function getRuleForm() {
  return {
    // 机构户
    ruleForm1: {
      client_name: '',
      office_address: '',
      register_country: '',
      register_money_type: '',
      register_fund: '',
      id_begindate: '',
      id_enddate: '',
      industry: '',
      industry_name:'',
      tel: '',
      setup_date: '',
      id_type: '',
      id_no: '',
      busi_scope: '',
      province: '',// 办公地址 省
      city: '',
      district: '',
    },
    // 个人户
    ruleForm2: {
      client_name: '',
      birthday: '',
      gender: '',
      nationality: '',
      id_begindate: '',
      id_enddate: '',
      profession_code: '',
      tel: '',
      id_type: '',
      id_no: '',
      id_address: '',// 证件地址
      province1: '',
      city1: '',
      district1: '',
      address: '',// 联系地址
      province2: '',
      city2: '',
      district2: '',
      income: ''
    },
    ruleForm3: {
      is_special: '0',// 默认“否”
      client_type: [],
      client_type_other: '',
      special_matters: [],
      missing_information: '',
      missing_draft: '',
      special_matters_other: '',
      special_reason: '',
      completed_cdd: '',
      low_risk_explanation: '',
      take_measures: ''
    }
  }
}
// 表单校验规则
function getRules() {
  return {
    client_name: [
      { required: true, message: '请输入“客户名称”', trigger: 'change' },
    ],
    office_address: [
      { required: true, message: '请输入“办公地址”', trigger: 'change' }
    ],
    register_country: [
      { required: true, message: '请选择“注册国家地区”', trigger: 'change' }
    ],
    register_money_type: [
      { required: true, message: '请选择“注册资金币种”', trigger: 'change' }
    ],
    register_fund: [
      { required: true, message: '请输入“注册资本金”', trigger: 'change' }
    ],
    id_begindate: [
      { required: true, message: '请输入“最新的发证日期”', trigger: 'change' }
    ],
    id_enddate: [
      { required: true, message: '请输入“证件有效期止”', trigger: 'change' }
    ],
    industry_type: [
      { required: true, message: '请选择“行业分类”', trigger: 'change' }
    ],
    industry_name: [
      { required: true, message: '请输入“行业注明”', trigger: 'change' }
    ],
    tel: [
      { required: true, message: '请输入“联系电话”', trigger: 'change' }
    ],
    setup_date: [
      { required: true, message: '请输入“成立日期”', trigger: 'change' }
    ],
    id_type: [
      { required: true, message: '请选择“证件类型”', trigger: 'change' }
    ],
    id_no: [
      { required: true, message: '请输入“证件号码”', trigger: 'change' }
    ],
    busi_scope: [
      { required: true, message: '请输入“经营范围”', trigger: 'change' }
    ],
    // province
    // city
    // district
    //
    birthday: [
      { required: true, message: '请输入“出生年月”', trigger: 'change' }
    ],
    gender: [
      { required: true, message: '请选择“客户性别”', trigger: 'change' }
    ],
    nationality: [
      { required: true, message: '请选择“客户国籍”', trigger: 'change' }
    ],
    profession_code: [
      { required: true, message: '请选择“职业分类”', trigger: 'change' }
    ],
    income: [
      { required: true, message: '请输入“年收入”', trigger: 'change' }
    ],
    // province1
    // city1
    // district1
    //
    id_address: [
      { required: true, message: '请输入“证件地址”', trigger: 'change' }
    ],
    address: [
      { required: true, message: '请输入“联系地址”', trigger: 'change' }
    ],
    // province2
    // city2
    // district2

    // ruleForm3
    is_special: [
      { required: true, message: '请选择“是否存在反洗钱尽职调查特殊情况”', trigger: 'change' }
    ],
    client_type: [
      { required: true, message: '请选择“客户类型”', trigger: 'change' }
    ],
    client_type_other: [
      { required: true, message: '请输入“客户类型具体说明”', trigger: 'change' }
    ],
    special_matters: [
      { required: true, message: '请选择“特殊事项”', trigger: 'change' }
    ],
    missing_information: [
      { required: true, message: '请输入“具体说明缺失的信息”', trigger: 'change' }
    ],
    missing_draft: [
      { required: true, message: '请输入“具体说明缺失的底稿”', trigger: 'change' }
    ],
    special_matters_other: [
      { required: true, message: '请输入“特殊事项具体说明”', trigger: 'change' }
    ],
    special_reason: [
      { required: true, message: '请输入“特殊事项原因”', trigger: 'change' }
    ],
    completed_cdd: [
      { required: true, message: '请输入“已开展的反洗钱尽职调查工作”', trigger: 'change' }
    ],
    low_risk_explanation: [
      { required: true, message: '请输入“客户洗钱风险较低的评估说明”', trigger: 'change' }
    ],
    take_measures: [
      { required: true, message: '请输入“后续措施”', trigger: 'change' }
    ],
    associated_date: [
      { required: true, message: '请输入“建立业务关系日期”', trigger: 'change' }
    ],
  }
}
// 关联人弹窗表单校验规则
function getRules1() {
  return {
    related_name: [
      { required: true, message: '请输入“关联人名称”', trigger: 'blur' },
    ],
    birthday: [
      { required: true, message: '请输入“出生年月”', trigger: 'blur' },
    ],
    birthday1: [
      { required: true, message: '请输入“出生年月”', trigger: 'blur' },
    ],
    nationality: [
      { required: true, message: '请选择“国籍”', trigger: 'blur' },
    ],
    id_type: [
      { required: true, message: '请选择“证件类型”', trigger: 'blur' },
    ],
    id_no: [
      { required: true, message: '请输入“证件号码”', trigger: 'blur' },
    ],
    id_begindate: [
      { required: true, message: '请输入“证件有效期开始日期”', trigger: 'blur' },
    ],
    id_enddate: [
      { required: true, message: '请输入“证件有效期结束日期”', trigger: 'blur' },
    ],
    is_government_dept: [
      { required: true, message: '请选择“是否政府部门”', trigger: 'blur' },
    ],
    beneficiary: [
      { required: true, message: '请选择“受益所有人类型”', trigger: 'blur' },
    ],
    shareholding_ratio: [
      { required: true, message: '请输入“股权/表决权比例”', trigger: 'blur' },
      { type: 'number', min: 0, max: 100, message: '请输入0-100的有效值', trigger: 'blur' }
    ],
    address: [
      { required: true, message: '请输入“联系地址”', trigger: 'blur' },
    ],
    mobno1:[
      { required: true, message: '请输入“联系方式”', trigger: 'blur' },
    ]
  }
}
// 附件目录维护
function getDirConfig() {
  return {
    // 机构户附件目录
    directoryConfig1: [
      {
        value: '1,2,21,22,23,3,31,32,4,41,42,5,51,52,6,61,62,63,64,7,71,72',
        label: '全部'
      },
      {
        value: 1,
        label: '1 基本信息表（盖章版）',
        disabled: true,
      },
      {
        value: 2,
        label: '2 客户情况',
        disabled: true,
        children: [{
          value: 21,
          label: '2-1 营业执照复印件',
        }, {
          value: 22,
          label: '2-2 公司章程复印件（盖章或公开披露版）',
        }, {
          value: 23,
          label: '2-3 法定代表人身份证明文件的复印件',
        }]
      },
      {
        value: 3,
        label: '3 控股股东情况（如有）',
        disabled: true,
        children: [{
          value: 31,
          label: '3-1 营业执照复印件（控股股东如为非自然人-公司）',
        }, {
          value: 32,
          label: '3-2 控股股东身份证明文件的复印件（如为自然人）',
        }]
      },
      {
        value: 4,
        label: '4 实际控制人情况（如有）',
        disabled: true,
        children: [{
          value: 41,
          label: '4-1 营业执照复印件（实际控制人如为非自然人-公司）',
        }, {
          value: 42,
          label: '4-2 实际控制人身份证明文件的复印件（如为自然人）',
        }]
      },
      {
        value: 5,
        label: '5 授权代表人情况',
        disabled: true,
        children: [{
          value: 51,
          label: '5-1 授权代表人身份证明文件的复印件',
        },{
          value: 52,
          label: '5-2 授权委托书（授权代表人非法代时适用）',
        }
        ]
      },
      {
        value: 6,
        label: '6 受益所有人情况',
        disabled: true,
        children: [{
          value: 61,
          label: '6-1 受益所有人的身份证明文件的复印件',
        }, {
          value: 62,
          label: '6-2 确认受益所有人的证明文件，包括但不限于股权架构图、公司章程、委托持股协议、一致行动协议、表决权差异安排协议、任命文件等',
        }, {
          value: 63,
          label: '6-3 关于股权/表决权比例计算的说明（如涉及比例）',
        }, {
          value: 64,
          label: '6-4 在受益所有人信息查询管理系统（BOMIS系统）备案的信息截图（如有）',
        }]
      },
      {
        value: 7,
        label: '7 工作记录',
        disabled: true,
        children: [{
          value: 71,
          label: '7-1 在工商外部数据库（如“企查查”）查验的报告',
        }, {
          value: 72,
          label: '7-2 各类其他工作记录（如有）',
        }]
      }],
    // 自然人附件目录
    directoryConfig2: [
      {
        value:'1,2,3',
        label:'全部',
      },
      {
        value: 1,
        label: '1 基本信息表(签章版)',
        disabled: true,
      },
      {
        value: 2,
        label: '2 身份证明文件的复印件',
        disabled: true,
      },
      {
        value: 3,
        label: '3 工作记录（如有）',
        disabled: true,
      }
    ],
  }
}
// wb_key表键值编辑器数据
function getSelectKey() {
  return {
    // 查wb_key表
    list: [
      {
        "KEY_NAME": "currency_type",
        "BIND_DATA": "register_money_type",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "industry_type",
        "BIND_DATA": "industry_type",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "id_type",
        "BIND_DATA": "id_type",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "related_type",
        "BIND_DATA": "related_type",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "grade_value",
        "BIND_DATA": "grade_value",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "client_type",
        "BIND_DATA": "client_type",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "special_matters",
        "BIND_DATA": "special_matters",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "id_type_jg",
        "BIND_DATA": "id_type_jg",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "id_type_gr",
        "BIND_DATA": "id_type_gr",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "year_income",
        "BIND_DATA": "year_income",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_yesno",
        "BIND_DATA": "benefit_yesno",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_gender",
        "BIND_DATA": "benefit_gender",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_actctrlcpny",
        "BIND_DATA": "benefit_actctrlcpny",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_actctrltype",
        "BIND_DATA": "benefit_actctrltype",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_seniormgrpos",
        "BIND_DATA": "benefit_seniormgrpos",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_seniormgrposcn",
        "BIND_DATA": "benefit_seniormgrposcn",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_flag",
        "BIND_DATA": "benefit_flag",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_company_no",
        "BIND_DATA": "benefit_company_no",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_type",
        "BIND_DATA": "benefit_type",
        "COMPONENT_TYPE": "4"
      }, {
        "KEY_NAME": "benefit_id_type",
        "BIND_DATA": "benefit_id_type",
        "COMPONENT_TYPE": "4"
      }
    ],
    // 查t_dict_subentry表
    dict: [
      {
        "ENTRY_NO": "1040",
        "BIND_DATA": "nationality"
      },
      {
        "ENTRY_NO": "PROFESSION_CODE",
        "BIND_DATA": "profession_code"
      },
      {
        "ENTRY_NO": "BENEFICIAL_TYPE",
        "BIND_DATA": "beneficiary"
      },
      {
        "ENTRY_NO": "BENEFICIAL_TYPEMix",
        "BIND_DATA": "bnf_type_mix"
      },
      {
        "ENTRY_NO": "BENEFICIAL_TYPENew",
        "BIND_DATA": "bnf_type_new"
      },
      {
        "ENTRY_NO": "bomis_nationality",
        "BIND_DATA": "bomis_nationality"
      }
    ]
  }
}