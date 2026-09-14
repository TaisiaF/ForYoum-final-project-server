import mongoose from "mongoose";

const userSchema = mongoose.Schema({

username:{
    type:String,
    required:true,
    unique:true,
    minLength:2,
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
}


})
export default mongoose.model("user",userSchema)