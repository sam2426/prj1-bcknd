// const Todo = require('./../models/Todo');
// const mongoose=require('mongoose');


// mongoose.Promise = global.Promise;

// function autoPopulateSubs(next) {
//     this.populate('childNodes');
//     next();
//   }

//   TodoModel
//   .pre('findOne', autoPopulateSubs)
//   .pre('find', autoPopulateSubs);

// Todo.todoSchema
// .pre('findOne', autoPopulateSubs)
// .pre('find', autoPopulateSubs);

// const TodoModel = mongoose.model('TodoModel', Todo.todoSchema);

// const Company = mongoose.model('Company', companySchema);

// function log(data) {
//   console.log(JSON.stringify(data, undefined, 2))
// }

// (async function() {

//   try {
    // const conn = await mongoose.connect(uri,options);

    // Clean data
    // await Promise.all(
    //   Object.keys(conn.models).map(m => conn.models[m].remove({}))
    // );

    // Create data
    // await [5,4,3,2,1].reduce((acc,name) =>
    //   (name === 5) ? acc.then( () => Company.create({ name }) )
    //     : acc.then( child => Company.create({ name, subs: [child] }) ),
    //   Promise.resolve()
    // );

    // Fetch and populate
//     let company = await TodoModel.findOne({ todoId: 'td-Dg4T2zG' });
//     log(company);

//   } catch(e) {
//     console.error(e);
//   } 
//   finally {
//     mongoose.disconnect();
//   }

// })()

// async function f(req,res) {

    // let promise = new Promise((resolve, reject) => {
    //   setTimeout(() => resolve("done!"), 1000)
    // });
  
//     console.log(req.body.todoId);
//     let result = await TodoModel.findOne({ todoId: req.body.todoId });
//     log(result);
//     res.send(result)// "done!"
//   }
  
//   f();

//   module.exports={
//       getTodo:f,

//   }
//////////////////////////////////////////////////////////////////////////////
// const Todo = require('./../models/Todo');
// const mongoose=require('mongoose');

// function autoPopulateSubs(next) {
//     this.populate('childNodes');
//     next();
//   }

//   const TodoModel = mongoose.model('TodoModel', Todo.todoSchema);
// //   Todo.todoSchema
// TodoModel
// .pre('findOne', autoPopulateSubs)
// .pre('find', autoPopulateSubs);



// async function f(req,res) {
//     console.log(req.body.todoId);
//     let result = await TodoModel.findOne({ todoId: req.body.todoId });
//     res.send(result);
//   }

//   module.exports={
//     getTodo:f,
// }

//************************************************************************* */

// const mongoose = require('mongoose'),
//       Schema = mongoose.Schema;

// mongoose.set('debug',true);
// mongoose.Promise = global.Promise;
// const uri = 'mongodb://localhost/test',
//       options = { useMongoClient: true };

// const companySchema = new Schema({
//   name: String,
//   subs: [{ type: Schema.Types.ObjectId, ref: 'Company' }]
// });

// function autoPopulateSubs(next) {
//   this.populate('subs');
//   next();
// }

// companySchema
//   .pre('findOne', autoPopulateSubs)
//   .pre('find', autoPopulateSubs);

//   const Company = mongoose.model('Company', companySchema);

// function log(data) {
//   console.log(JSON.stringify(data, undefined, 2))
// }

// (async function() {

//   try {
//     const conn = await mongoose.connect(uri,options);

//     // Clean data
//     await Promise.all(
//       Object.keys(conn.models).map(m => conn.models[m].remove({}))
//     );

//     // Create data
//     await [5,4,3,2,1].reduce((acc,name) =>
//       (name === 5) ? acc.then( () => Company.create({ name }) )
//         : acc.then( child => Company.create({ name, subs: [child] }) ),
//       Promise.resolve()
//     );

//     // Fetch and populate
//     let company = await Company.findOne({ name: 1 });
//     log(company);

//   } catch(e) {
//     console.error(e);
//   } finally {
//     mongoose.disconnect();
//   }

// })()

//*************************************************************************************** */

var bluebird = require('bluebird');
var mongoose = require('mongoose');
const TodoModel = require('./../models/Todo');

let getTodo=(req,res)=>{
let myTodo=(id)=> {
  return TodoModel.findOne({_id:id}).lean().exec()
    .then(function(dataa){
      return bluebird.props({
        todoId:dataa.todoId,
        todo: dataa.todo,
        contributors:dataa.contributors,
        time:dataa.time,
        childNodes: bluebird.map(dataa.childNodes, myTodo),
        // parents: bluebird.map(user.parents, getUser),
        // partner: bluebird.map(user.partner, getUser),
        // sibling: bluebird.map(user.sibling, getUser)
      })
    });
}

// Then call getUser once on the root node, e.g.
myTodo(req.body.todoId)
  .then(function(todoTree){
    // console.log(todoTree)
    res.send(todoTree)
  })
  .catch((err)=>{
    res.send(err);
  })
}

module.exports={
    getTodo:getTodo
}