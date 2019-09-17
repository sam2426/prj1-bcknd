const check = require('../libs/checkLib');
const shortid = require('shortid');
var bluebird = require('bluebird');

const logger = require('./../libs/loggerLib');
const response = require('./../libs/responseLib');
const time = require('./../libs/timeLib');
const UserModel = require('./../models/User');
const TodoModel = require('./../models/Todo');

let initiateTodo=(req,res)=>{
    let newTodo= new TodoModel({
        todoId:'td-'+shortid.generate(),
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

let createTodo=(req,res)=>{
    
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

    let findParent=(childData)=>{
        // let findParent=()=>{
        return new Promise((resolve,reject)=>{
            TodoModel.findOne({todoId:req.body.todoId},(err,todoData)=>{
                if(err){
                    console.log(err);
                    reject('parent not found');
                }else{
                    todoData.childNodes.push(childData._id)
                    todoData.save((err,parentTodo)=>{
                        if(err){
                            console.log(err);
                            reject(err);
                        }else{
                            resolve(parentTodo)
                        }
                    })
                    // resolve(response.childNodes);
                }
            })
        })
    }

    createNode(req,res)
    .then(findParent)
    // findParent(req,res)
    .then((resolve)=>{
        let apiResponse=response.generate(false,'Todo Created', 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        let apiResponse=response.generate(false,err, 400, null);
        res.send(apiResponse);
    })
}

// let getResult=(req,res)=>{
//     TodoModel.findOne({todoId:req.body.todoId})
//     .populate('childNodes')
//     .exec((err,result)=>{
//         if(err){
//             let apiResponse=response.generate(true,'Unable to Load Todo',400,null);
//             res.send(apiResponse);
//         }else{
//             let apiResponse=response.generate(false,'Todo Loaded',200, result);
//             res.send(apiResponse);
//         }
//     })
// }

let getResult = (req, res) => {
    let myTodo = (id) => {
        return TodoModel.findOne({ _id: id }).lean().exec()
            .then(function (data) {
                return bluebird.props({
                    todoId: data.todoId,
                    todo: data.todo,
                    contributors: data.contributors,
                    time: data.time,
                    childNodes: bluebird.map(data.childNodes, myTodo)
                })
            });
    }

    myTodo(req.body.todoId)
        .then(function (todoTree) {
            let apiResponse=response.generate(false, 'Projecting data',200,todoTree )
            res.send(apiResponse)
        })
        .catch((err) => {
            let apiResponse=response.generate(true,'Data not found', 400, null);
            res.send(apiResponse);
        })

        //make responce with headerId of any todo node eg : todoId:5d80d28de3be7a2770cd631f
} 

let editTodo=(req,res)=>{

    let findTodo=()=>{

        return new Promise((resolve,reject)=>{
            TodoModel.findOne({todoId:req.body.todoId},(err,todoData)=>{
                if(err){
                    console.log(err);
                    reject();
                }else{
                    // todoData.childNodes.push(childData._id)
                    // todoData.save((err,parentTodo)=>{
                    //     if(err){
                    //         console.log(err);
                    //         reject(err);
                    //     }else{
                    //         resolve(parentTodo)
                    //     }
                    // })
                    resolve(todoData);
                }
            })
        })
    }

    let edit=()=>{

        return new Promise((resolve,reject)=>{

        })
    }

    findTodo(req,res)
    .then(edit)
    .then((resolve)=>{
        let apiResponse=response.generate(false,'Todo Edited',200,resolve)
    })
    .catch((err)=>{
        let apiResponse=response.generate(false,'Unable to Edit',400,null)
        res.send(apiResponse);
    })
}
module.exports = {
    initiateTodo:initiateTodo,
    createTodo:createTodo,
    editTodo:editTodo,
    getResult:getResult,
}