CREATE OR REPLACE PROCEDURE APP.PR_DEPENDENCIES_REFRESH
(
    o_return_code                        OUT NUMBER ,
    o_return_msg                         OUT VARCHAR2 
) AUTHID definer IS
    -------------------------------------------------------------------------------------
    -- 版    权: 国泰海通
    -- 版    本: 1.1
    -- 开发人员:
    -- 创建日期:
    -- 模块编号:
    -- 模块名称:
    -- 功能名称: 对象引用列表和代码刷库顺序数据刷新程序
    ---------------------------------------------------------------------------------------
    -- 修改作者:
    -- 修改日期:20251126 18:01:46
    -- 修改内容:1.1:
    -- 修改内容:用户扩大到全部
    -- 修改内容:1.0:
    -- 修改内容:国泰海通达梦版
    --==============================================================================
    v_exists                             INTEGER default 0;
    v_seq                                INTEGER default 1;
BEGIN
    /*01:删除旧数据*/o_return_msg:='01';
    delete from APP.tb_dependencies
    where owner in ('APP');

    /*02:插入新的数据库对象及引用数据*/o_return_msg:='02';
    insert into APP.TB_DEPENDENCIES
    (
           OWNER,
           OBJECT_NAME,
           OBJECT_TYPE,
           REFERENCED_OBJECT,
           REFERENCED_TYPE,
           OBJECT_SEQ
    )
    select 
           a.owner as OWNER,
           a.owner||'.'||a.object_name as OBJECT_NAME,
           a.object_type as OBJECT_TYPE,
           b.referenced_owner||'.'||b.referenced_name as REFERENCED_OBJECT,
           b.referenced_type as REFERENCED_TYPE,
           null as OBJECT_SEQ
    from   
           ALL_OBJECTS a
    left join
           all_dependencies b
    on     
           a.owner=b.owner
    and    a.object_name=b.name
    and    b.referenced_name<>'DUAL'
    and    b.referenced_owner not in ('SYS')
    and    b.referenced_type in ('TABLE','VIEW','PROCEDURE','FUNCTION')
    where  a.object_type in ('TABLE','VIEW','PROCEDURE','FUNCTION');

    /*03:所有对象的刷库顺序初始化*/o_return_msg:='03';
    update APP.tb_dependencies a
    set    a.object_seq=null;

    /*04:不引用其他对象的刷库顺序更新为1*/o_return_msg:='04';
    update APP.tb_dependencies a
    set    a.object_seq=1
    where  a.object_seq is null
    and    a.referenced_object='.'
    ;

        /*05.01:按引用顺序更新刷库顺序-循环开始*/o_return_msg:='05.01';
    loop

        /*05.02:是否存在未定顺序的对象引用了已确定顺序的其他对象*/o_return_msg:='05.02';
        select count(1) as cnt
        into   v_exists
        from   APP.tb_dependencies a
        where  a.object_seq is null
        and    exists
               (select 1 
                  from (select b.object_name,
                               count(1) as referenced_count,
                               count(c.object_seq) as ready_count 
                          from APP.tb_dependencies b
                          left join 
                               APP.tb_dependencies c
                            on b.referenced_object=c.object_name
                         where b.object_seq is null
                         group by 
                               b.object_name
                       ) b
                where  a.object_name=b.object_name
                and    b.referenced_count=b.ready_count
               );

            /*05.03.01:条件:存在后续的刷库对象*/o_return_msg:='05.03.01';
        if v_exists>0 then

            /*05.03.02:刷库顺序加1*/o_return_msg:='05.03.02';
            v_seq:=v_seq+1;

            /*05.03.03:更新刷库顺序*/o_return_msg:='05.03.03';
            update APP.tb_dependencies a
            set    a.object_seq=v_seq
            where  a.object_seq is null
            and    exists
                   (select 1 
                      from (select b.object_name,
                                   count(1) as referenced_count,
                                   count(c.object_seq) as ready_count 
                              from APP.tb_dependencies b
                              left join 
                                   APP.tb_dependencies c
                                on b.referenced_object=c.object_name
                             where b.object_seq is null
                             group by 
                                   b.object_name
                           ) b
                    where  a.object_name=b.object_name
                    and    b.referenced_count=b.ready_count
                   );

            /*05.03.04:无后续刷库对象*/o_return_msg:='05.03.04';
        else

            /*05.03.05:退出循环*/o_return_msg:='05.03.05';
            exit;

            /*05.03.99:条件分支05.03结束*/o_return_msg:='05.03.99';
        end if;

        /*05.99:按引用顺序更新刷库顺序-循环结束*/o_return_msg:='05.99';
    end loop;

    /*06:退出*/o_return_msg:='06';
    commit;
    o_return_msg := '执行成功';
    o_return_code := 0;

    -- ============================================================================
    -- 错误处理部分
    -- ============================================================================
EXCEPTION
   WHEN OTHERS THEN
   if sqlcode=-20000 then
       raise;
   else 
       o_return_code := -20000;
       o_return_msg  := 'APP.PR_DEPENDENCIES_REFRESH执行报错，步骤号:'||o_return_msg||chr(10)||SQLERRM;
       ROLLBACK;
       RAISE_APPLICATION_ERROR(o_return_code ,o_return_msg);
   end if;
END;



