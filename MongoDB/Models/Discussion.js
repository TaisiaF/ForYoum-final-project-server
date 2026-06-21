import mongoose from "mongoose";

const discussionSchema = mongoose.Schema({

title:{
    type:String,
    required:true,
    minLength:2
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
category:{
    type:String,
    required:true,
    enum:[
        'Gaming',
        'Movies',
        'Music',
        'Sports',
        'Food',
        'Education',
        'Art',
        'Other'
    ]
},
likedBy:[{    //שומרים את המשתמשים ששמו לייק כדי שמשתמש לא יוכל לשים לייק פעמיים ושיוכל למחוק לייק
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
}],
replyCount:{
    type:Number,
    default:0
}

},
{
    timestamps:true
}
)

//אינדקסים לשדות שנקראים הרבה-תומכים בשאילתות שלי (שמירת ערכי שדות בעץ חיפוש להגברת יעילות חיפוש)
discussionSchema.index({ createdAt: -1 });

discussionSchema.index({ category: 1 });

discussionSchema.index({
    title: "text",
    content: "text"  //תומך בחיפוש לפי מילות מפתח
});

discussionSchema.index({ authorId: 1 });

export default mongoose.model("discussion",discussionSchema)