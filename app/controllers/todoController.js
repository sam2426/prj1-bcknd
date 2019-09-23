const check = require('../libs/checkLib');
const shortid = require('shortid');
var bluebird = require('bluebird');

const logger = require('./../libs/loggerLib');
const response = require('./../libs/responseLib');
const time = require('./../libs/timeLib');
const UserModel = require('./../models/User');
const TodoModel = require('./../models/Todo');

let initiateTodo=(req,res)=>{

    let createTodo=(req,res)=>{
        return new Promise((resolve,reject)=>{
            let newTodo= new TodoModel({
                todoId:'hd-'+shortid.generate(),
                todoBody:req.body.message,
                contributors:req.body.users,
                type:'header',
                time:time.now().format(),
            })
            newTodo.save((err,data)=>{
                if (err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    let updateUserData=(todoData)=>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({userId:req.body.users},(err,response)=>{
                if(err){
                    console.log(err);
                    reject('User not found');
                }else if(check.isEmpty(response)){
                    reject('User not found');
                }else{
                    response.userTodo.push(todoData._id)
                    response.save((err,data)=>{
                        if(err){
                            console.log(err);
                            reject(err);
                        }else{
                            resolve(todoData);
                        }
                    })
                    // resolve(response.childNodes);
                }
            })
        })
    }


    createTodo(req,res)
    .then(updateUserData)
    // findParent(req,res)
    .then((resolve)=>{
        logger.info('Todo Header Created', 'createFirstTodo:save', 10);
        let apiResponse=response.generate(false,'Todo Created', 200, resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        logger.error(err.message, 'createFirstTodo:save', 10);
        let apiResponse=response.generate(false,err, 400, null);
        res.send(apiResponse);
    })

}

let deleteInitiatorTodo=(req,res)=>{
    
    let deleteChild = () => {
        return new Promise((resolve, reject) => {
            TodoModel.findOneAndDelete({ todoId: req.body.todoId })
                .select('_id')
                .lean()
                .exec((err, response) => {
                    if (err) {
                        reject('Unable to delete')
                        // reject(err)
                    } else {
                        resolve(response);
                    }
                })
        })
    }
    let deleteNodeFromUser=(data)=>{
        return new Promise((resolve,reject)=>{
            UserModel.findOne({userId:req.body.userId},(err,response)=>{

                let index = response.userTodo.indexOf(data._id);
                if (index > -1) {
                    response.userTodo.splice(index, 1);
                    response.save((err,UserDetails)=>{
                        if(err){
                            console.log(err);
                            reject(err);
                        }else{
                            resolve(UserDetails);
                        }
                    })
                }
                // resolve(index)
                else{
                    reject('User not modified');
                }
                
            })
        })
    }

    // getId(req,res)
    // .then(deleteChild)
    deleteChild(req,res)
    .then(deleteNodeFromUser)
    .then((resolve)=>{
        let apiResponse=response.generate(false,'Todo Deleted',200,resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        let apiResponse=response.generate(true,err,400,null);
        res.send(apiResponse);
    })
}

let createTodo=(req,res)=>{
    
    let createNode = (req,res) => {
        return new Promise((resolve,reject)=>{
            let newTodo= new TodoModel({
                todoId:'td-'+shortid.generate(),
                todoBody:req.body.message,
                contributors:req.body.users,
                time:time.now().format(),
            })
            newTodo.save((err,data)=>{
                if(err){
                    console.log(err)
                    reject('Todo create not created');
                }else{
                    // data=responce.toObject();
                    // data.parentId=req.body.todoId;
                    resolve(data);
                }
            })
        })  
    }

    let findParent=(childData)=>{
        // let findParent=()=>{
        return new Promise((resolve,reject)=>{
            TodoModel.findOne({todoId:req.body.todoId},(err,response)=>{
                if(err){
                    console.log(err);
                    reject('parent not found');
                }else if(check.isEmpty(response)){
                    reject('parent not found');
                }else{
                    response.childNodes.push(childData._id)
                    response.save((err,parentTodo)=>{
                        if(err){
                            console.log(err);
                            reject(err);
                        }else{
                            resolve(childData);
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

    let findTodo=()=>{
        return new Promise((resolve,reject)=>{
            TodoModel.findOne(
                {todoId:req.body.todoId},(err,todoData)=>{
                if(err){
                    console.log(err);
                    reject();
                }else{
                    resolve(todoData._id);
                }
            })
        })
    }

    let myTodo = (id) => {
        console.log(id);
        // return new Promise((resolve,reject)=>{
        return TodoModel.findOne({ _id: id }).lean().exec()
            .then(function (data) {
                return bluebird.props({
                    type:data.type,
                    todoId: data.todoId,
                    todoBody: data.todoBody,
                    contributors: data.contributors,
                    time: data.time,
                    childNodes: bluebird.map(data.childNodes, myTodo)
                })
            });
        // })
    }


    findTodo(req,res)
    .then(myTodo)
        .then((todoTree)=>{
            let apiResponse=response.generate(false, 'Projecting data',200,todoTree )
            res.send(apiResponse)
        })
        .catch((err) => {
            let apiResponse=response.generate(true,'Data not found', 400, null);
            res.send(apiResponse);
        })

        //make responce with headerId of any todo node eg : todoId:5d80d28de3be7a2770cd631f
} 

let getHeaders=(req,res)=>{
    // req.params.userId
    TodoModel.find({contributors:req.params.userId, type:'header'},(err,data)=>{
        if(err){
            console.log(err);
            let apiResponse=response.generate(true,'Failed to find Headers',400,null);
            res.send(apiResponse);
        }else if(check.isEmpty(response)){
            console.log('empty');
            let apiResponse=response.generate(true,'No Todos created yet!',400,null);
            res.send(apiResponse);
        }else{
            console.log(data);
            let apiResponse=response.generate(false,'Todo Edited',200,data);
            res.send(apiResponse);
        }
    })
}

let editTodo=(req,res)=>{

    let findTodo=()=>{

        return new Promise((resolve,reject)=>{
            TodoModel.findOneAndUpdate(
                {todoId:req.body.todoId},
                {todoBody:req.body.message},
                {new:true},         //this sends back updated result, else old data is sent.
                (err,todoData)=>{
                if(err){
                    console.log(err);
                    reject();
                }else{
                    resolve(todoData);
                }
            })
        })
    }

   findTodo(req,res)
    .then((resolve)=>{
        let apiResponse=response.generate(false,'Todo Edited',200,resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        let apiResponse=response.generate(true,'Unable to Edit',400,null)
        res.send(apiResponse);
    })
}

let deleteTodo=(req,res)=>{
    let getId=()=>{
        return new Promise((resolve,reject)=>{
            TodoModel.find({todoId:req.body.todoId})
            .select('_id')
            .lean()
            .exec((err,data)=>{
                if(err){
                    reject('unable to find todoId')
                    // reject(err)
                }else{
                    resolve(data);
                }
            })
        })
    }
    let deleteChild = (id) => {
        return new Promise((resolve, reject) => {
            // TodoModel.findAndDelete(id,(err,response)=>{
            TodoModel.findOneAndDelete({ todoId: req.body.todoId })
                .select('_id')
                .lean()
                .exec((err, response) => {
                    if (err) {
                        // reject('unable to delete todoId')
                        reject(err)
                    } else {
                        resolve(response);
                    }
                })
        })
    }
    let deleteNodeFromParent=(data)=>{
        return new Promise((resolve,reject)=>{
            TodoModel.findOne({todoId:req.body.parentId},(err,response)=>{

                let index = response.childNodes.indexOf(data._id);
                if (index > -1) {
                    response.childNodes.splice(index, 1);
                    response.save((err,parentTodo)=>{
                        if(err){
                            console.log(err);
                            reject(err);
                        }else{
                            resolve(parentTodo);
                        }
                    })
                }
                // resolve(index)
                else{
                    reject('todo parent not modified');
                }
                
            })
        })
    }

    // getId(req,res)
    // .then(deleteChild)
    deleteChild(req,res)
    .then(deleteNodeFromParent)
    .then((resolve)=>{
        let apiResponse=response.generate(false,'Todo Deleted',200,resolve);
        res.send(apiResponse);
    })
    .catch((err)=>{
        let apiResponse=response.generate(true,err,400,null);
        res.send(apiResponse);
    })
}
module.exports = {
    initiateTodo:initiateTodo,
    createTodo:createTodo,
    editTodo:editTodo,
    getResult:getResult,
    getHeaders:getHeaders,
    deleteTodo:deleteTodo,
    deleteInitiatorTodo:deleteInitiatorTodo
}