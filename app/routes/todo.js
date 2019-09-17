const express=require('express');
const appConfig=require('./../../config/appConfig');
const todoController=require('./../controllers/todoController');
const todoExpr=require('./../controllers/todoExpr');

module.exports.setRouter = (app) =>{

    let baseUrl = `${appConfig.apiVersion}/todo`;

    app.post(`${baseUrl}/initiate`, todoController.initiateTodo);

    app.post(`${baseUrl}/create`, todoController.createTodo);

    app.post(`${baseUrl}/getTodo`, todoController.getResult);

    // app.post(`${baseUrl}/getTodo`, todoExpr.getTodo);



}

