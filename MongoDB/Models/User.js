import mongoose from "mongoose";

const userSchema = mongoose.Schema({

username:{
    type:String,
    required:true,
    unique:true,
    minLength:3,
    trim: true
},
role:{
    type:String,
    required:true,
    enum: ['user','admin'],
    default: 'user'
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase: true,  //הפיכה לאותיות קטנות לא משפיעה על מייל + עוזרת בזמן השוואה
    match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
},
passwordHash:{
    type:String,
    required:true
},
verified: {
    type: Boolean,
    default: false
},
verificationCode: {
    type: String,
    default: null
},
verificationCodeExpires: {
    type: Date,
    default: null
},
banned: {
    type: Boolean,
    default: false
},

isPrivate: {
    type: Boolean,
    default: false
},

profilePicture: {
    type: String,
    default: null
},

bookmarkedDiscussions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "discussion"
}]


})
export default mongoose.model("user",userSchema)