const express=require('express');
const appConfig=require('./../../config/appConfig');
const userController=require('./../controllers/userController');

module.exports.setRouter = (app) =>{

    let baseUrl = `${appConfig.apiVersion}/users`;


    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    app.post(`${baseUrl}/login`, userController.loginFunction);

    app.get(`${baseUrl}/view/all`,userController.getAllUser);

    app.get(`${baseUrl}/:userId/details`, userController.getSingleUser);

    app.put(`${baseUrl}/:userId/edit`, userController.editUser);

    app.post(`${baseUrl}/:userId/delete`, userController.deleteUser);

    app.post(`${baseUrl}/logout`, userController.logout);

}

