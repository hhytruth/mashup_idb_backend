module.exports={
    db_schemas:[
        {file:'/models/post',collection:'post',schemaName:'PostSchema',
        modelName:'PostModel'}
    ],
    route_info:[
        {file:'./post',path : '/process/addpost',method:'addpost',type:'post'}
        ,{file:'./post',path:'/process/showpost',method:'showpost',type:'get'}
        ,{file:'./post',path:'/process/listpost',method:'listpost',type:'post'}
        ,{file:'./post',path:'/process/listpost',method:'listpost',type:'get'}
    ]
};

