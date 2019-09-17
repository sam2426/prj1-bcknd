const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const time= require('./../libs/timeLib');

const todoSchema=new Schema({
    todoId:{
        type:String,
        default:'',
        required:true,
    },
    todo:{
        type:String,
        default:'',
        required:true,
    },
    contributors:{
        type:[],
        default:[],
        required:true,
    },
    time:{
        type:time,
        default:'',
    },
    childNodes:{
        type:[Schema.Types.ObjectId],
        ref:'Todo',
    }
      
})

module.exports = mongoose.model('Todo', todoSchema);