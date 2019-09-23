const express=require('express');
const appConfig=require('./../../config/appConfig');
const todoController=require('./../controllers/todoController');


module.exports.setRouter = (app) =>{

    let baseUrl = `${appConfig.apiVersion}/todo`;

    app.post(`${baseUrl}/initiate`, todoController.initiateTodo);

    app.post(`${baseUrl}/create`, todoController.createTodo);

    app.post(`${baseUrl}/getTodo`, todoController.getResult);

    app.get(`${baseUrl}/:userId/getHeaders`, todoController.getHeaders);

    app.post(`${baseUrl}/edit`, todoController.editTodo);

    app.post(`${baseUrl}/delete`, todoController.deleteTodo);

    app.post(`${baseUrl}/deleteHead`, todoController.deleteInitiatorTodo);

}

