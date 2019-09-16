const express=require('express');
const appConfig=require('./../../config/appConfig');
const todoController=require('./../controllers/todoController');

module.exports.setRouter = (app) =>{

    let baseUrl = `${appConfig.apiVersion}/todo`;

    app.post(`${baseUrl}/initiate`, todoController.initiateTodo);

    app.post(`${baseUrl}/create`, todoController.createFirstTodo);

    app.post(`${baseUrl}/getTodo`, todoController.getResult);



}

