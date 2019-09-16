const check = require('../libs/checkLib');
const shortid = require('shortid');

const logger = require('./../libs/loggerLib');
const response = require('./../libs/responseLib');
const time = require('./../libs/timeLib');
const UserModel = require('./../models/User');
const TodoModel = require('./../models/Todo');

let initiateTodo=(req,res)=>{
    let newTodo= new TodoModel({
        todoId:'ct-'+shortid.generate(),
        todo:req.body.message,
        contributors:req.body.users,
        time:time.now().format(),

    })
    newTodo.save((err,data)=>{
        if (err){
            console.log(err);
            logger.error(err.message, 'createFirstTodo:save', 10);
            let apiResponse=response.generate(true,'Failed to initiate ToDo', 400, nul);
            res.send(apiResponse);
        }else{
            let apiResponse=response.generate(false,'ToDo initiated', 200, data);
            res.send(apiResponse);
        }
    })

}

let createFirstTodo=(req,res)=>{
    
    let createNode = () => {
        return new Promise((resolve,reject)=>{
            let newTodo= new TodoModel({
                todoId:'ct-'+shortid.generate(),
                todo:req.body.message,
                contributors:req.body.users,
                time:time.now().format(),
            })
            newTodo.save((err,data)=>{
                if(err){
                    console.log(err)
                    reject('Todo create not created');
                }else{
                    resolve(data);
                }
            })
        })  
    }

    let findParent=(child)=>{
        return new Promise((resolve,reject)=>{
            TodoModel.findOneAndUpdate({todoId:req.body.todoId},{'$addToSet':{childNodes:child._id}},{
                new: true },(err,response)=>{
                if(err){
                    console.log(err);
                    reject('parent not found');
                }else{
                    resolve(response)
                }
            })
        })
    }

    createNode(req,res)
    .then(findParent)
    .then((resolve)=>{
        let apiResponse=response.generate(false,'Todo Created', 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        let apiResponse=response.generate(false,'Todo not Created', 400, null);
        res.send(apiResponse);
    })
}

let getResult=(req,res)=>{
    TodoModel.findOne({todoId:req.body.todoId})
    .populate('childNodes')
    .exec((err,result)=>{
        res.send(result);
    })
}

module.exports = {
    initiateTodo:initiateTodo,
    createFirstTodo:createFirstTodo,
    getResult:getResult,
}