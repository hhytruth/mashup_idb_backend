var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var utils=require('/utils/utils');
var pagination=require('pagination');


var SchemaObj={};
var postSchema=new Schema({
    username:{type:String},
    postList:[{
        created_at:{type:Number,default:Date.now()},
        updated_at:{type:Number,default:Date.now()},
        title:{type:String,required:true,default:''},
        content:{type:String,required:true,default:''},
        writer:{type:mongoose.Schema.ObjectId,required:true,ref:'user'},
        commentList:[{
            commentWriter:{type:mongoose.Schema.ObjectId,required:true,ref:'user'},
            commentContent:{type:String,required:true,default:''},
            created_at:{type:Number,default:Date.now()}
        }]
    }]
});

PostSchema.path('title').required(true,'글 제목을 입력해주세요.');
PostSchema.path('content').required(true,'글 내용을 입력해주세요.');

PostSchema.methods={
    savePost:function(callback){
        var self=this;
        self.save(callback);
    },

    addComment:function(user,comment,callback){
        this.commentList.push({
            content:comment.commentContent,
            writer:user._id
        });
        this.save(callback);
    },

    removeComment:function(id,callback){
        var index=utils.indexOf(this.commentList,{id:id});

        if(~index){
            this.commentList.splice(index,1);
        }
        else{
            return callback('ID [ '+id+']의 댓글을 찾을 수 없습니다.');
        }
        this.save(callback);
    }
};

PostSchema.statics={
    load:function(id,callback){
        this.findOne({_id:id})
            .populate('writer')
            .populate('commentList.commentWriter')
            .exec(callback);
    },
    list:function(options,callback) {
        var criteria = options.criteria || {};

        this.find(criteria)
            .populate('writer')
            .sort({'created_at': -1})
            .limit(Number(options.perPage))
            .skip(options.perPage * options.page)
            .exec(callback);

    }
};

return PostSchema;

module.exports=SchemaObj;

var PostInfo=mongoose.model("PostInf",PostSchema);

module.exports=PostInfo;

