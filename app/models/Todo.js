const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const time= require('./../libs/timeLib');

const todoSchema=new Schema({
    todoId:{
        type:String,
        default:'',
        required:true,
    },
    todoBody:{
        type:String,
        default:'',
    },
    contributors:{
        type:[],
        // default:[],
        required:true,
    },
    type:{
        type:String,
        default:'child',    
    },
    time:{
        type:time,
        default:'',
    },
    childNodes:{
        type:[Schema.Types.ObjectId],
        ref:'Todo',
    },
    showChildren:{
        type:Boolean,
        default:false,
        required:true,
    }
})

module.exports = mongoose.model('Todo', todoSchema);

// module.exports={
//     todoSchema:todoSchema,
// }