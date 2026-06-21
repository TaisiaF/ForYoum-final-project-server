import mongoose from "mongoose";

const replySchema = mongoose.Schema({

discussionId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'discussion' 

},
parentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Reply",
    default:null
},
authorId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
},
content:{
    type:String,
    required:true,
    minLength:2
},
likedBy:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
}]

},
{
    timestamps:true
}
)

//אינדקסים
replySchema.index({ discussionId: 1 });

replySchema.index({ parentId: 1 });

replySchema.index({ authorId: 1 });

export default mongoose.model("reply",replySchema)