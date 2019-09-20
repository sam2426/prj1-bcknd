const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time=require('./../libs/timeLib');

const userSchema = new Schema({
    userId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: 'password',
        required: true
    },
    email: {
        type: String,
        default: '',
        unique: true,
        required: true
    },
    otp: {
        type: Number,
        default: 0
    },
    otpExpiry: {
        type: time,
        default: ''
    },
    mobileNumber: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: time,
        default: ''
    },
    gender:{
        type:String,
        default:'Male'
    },
    profilePic:{
        type:String,
        default:''
    },
    friendList:{
        type:Schema.Types.ObjectId,
        ref:'Friends',
        unique:true,
    },
    userTodo:{
        type:[Schema.Types.ObjectId],
        ref:'Todo'
    },
    groupTodo:{
        type:[Schema.Types.ObjectId],
        ref:'Todo'
    }
})


module.exports = mongoose.model('User', userSchema);