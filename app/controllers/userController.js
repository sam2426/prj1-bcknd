const shortid = require('shortid');

const UserModel = require('./../models/User');
const AuthModel = require('./../models/auth');

const friendsController=require('./friendsController');

const check = require('../libs/checkLib');
const logger = require('./../libs/loggerLib');
const mailerLib = require('./../libs/mailerLib');
const passwordLib = require('./../libs/generatePasswordLib');
const profilePicUploadLib = require('./../libs/profilePicUploadLib');
const response = require('./../libs/responseLib');
const time = require('./../libs/timeLib');
const token = require('./../libs/tokenLib');
const validateInput = require('./../libs/paramsValidationLib');


let signUpFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, "Email didn't meet the requirement", 400, null);
                    reject(apiResponse);
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, "Please Enter Proper Password", 400, null);
                    reject(apiResponse);
                } else if (!validateInput.Password(req.body.password)) {
                    let apiResponse = response.generate(true, "Password parameters are not met", 400, null);
                    reject(apiResponse);
                    //include here else if number checker. now if putting string in phone field. unhandled error.
                } else {
                    resolve(req);
                }
            } else {
                logger.error('input field missing in user creation', 'userController:validateUser', 10);
                let apiResponse = response.generate(true, 'One or more parameter is missing', 400, null);
                reject(apiResponse);
            }
        })
    } // end user validate function

    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserdetails) => {
                    if (err) {
                        logger.error(err.message, 'userController:createUser', 10);
                        let apiResponse = response.generate(true, 'failed to create user', 400, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(retrievedUserdetails)) {
                        console.log(req.body);
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            gender: req.body.gender,
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now(),
                            profilePic:req.body.profilePic,
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController:dbSaveUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new user', 400, null);
                                reject(apiResponse);
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj);
                            }
                        })
                    }
                    else {
                        logger.error('User Cannot be created as user already present', 'userController:Createuser', 4);
                        let apiResponse = response.generate(true, 'Email ID exists', 403, null);
                        reject(apiResponse);
                    }
                })
        })
    }//createUser function ends

    let insertIntoFriendList=(userObj)=>{
        return new Promise((resolve,reject)=>{
            friendsController.createRecords(userObj,(err,isCreated)=>{
                if(err){
                    console.log(err)
                    logger.error(err.message, 'insertIntoFriendList:dbCreateList', 10)
                    let apiResponse = response.generate(true, 'Failed to create friendList', 400, null);
                    reject(apiResponse);
                }else{
                    //here have to use isCreated object as a transport to pass the inherited object.
                    isCreated.userObj=userObj; 
                    resolve(isCreated);
                }
            })
        })
    }

    validateUserInput(req, res)
        .then(createUser)
        .then(insertIntoFriendList)
        .then((resolve) => {
            delete resolve.userObj.password;
            delete resolve.userObj._id;
            delete resolve.userObj.__v;
            let apiResponse = response.generate(false, 'user created', 200, resolve.userObj);
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
} // end of user signUp

const singleUpload=profilePicUploadLib.upload.single('image');
let uploadImage=(req,res)=>{
    singleUpload(req,res,(err)=>{
        let apiResponse=response.generate(false,'File Uploaded', 200, req.file.location);
        return res.send(apiResponse);
    })
}


// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("email is there in the body");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                logger.error('Email not entered', 'userController: findUser()', 5);
                let apiResponse = response.generate(true, "Please Enter Email", 400, null);
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10);
                    let apiResponse = response.generate(true, 'Login Failed', 500, null);
                    reject(apiResponse);
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                    delete retrievedUserDetailsObj.password
                    // delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err);
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null);
                    reject(apiResponse);
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        console.log("save tokens");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController:saveToken', 10);
                    let apiResponse = response.generate(true, 'failed to generate token', 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err);
                            logger.error(err.message, 'userController:saveToken', 10)
                            let apiResponse = response.generate(true, 'failed to generate token', 500, null);
                            reject(apiResponse);
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token;
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                    retrievedTokenDetails.tokenGenerationTime = time.now();
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController:saveToken', 10);
                            let apiResponse = response.generate(true, 'failed to generate token', 500, null);
                            reject(apiResponse);
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    })
                }
            })
        })
    }

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve);
            // res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            let apiResponse = response.generate(true, 'Login Unsuccessful', 500, null);
            // res.status(err.status)
            res.send(apiResponse);
        })
}

//revise once the concept of edit/update user
let editUser = (req, res) => {

    let options = req.body;
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update
}


/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find({'userId':{$ne:req.params.userId}})
        .select(' -__v -_id -password')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users


/* Get single user details use it for profile view */
let getSingleUser = (req, res) => {
    console.log(req.params.userId);
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id -otp -otpExpiry')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user


/**
* function to logout user.
* auth params: userId.
*/
let logout = (req, res) => {
    AuthModel.findOneAndRemove({ userId: req.user.userId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'user Controller: logout', 10);
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null);
            res.send(apiResponse);
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null);
            res.send(apiResponse);
        }
    })
} // end of the logout function.



//try to develop a backgate only to delete an user.
let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove

}// end delete user

//forget password functionality
let forgetPassword = (req, res) => {

    let validateUser = (req, res) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'email': req.body.email }).exec((err, result) => {
                if (err) {
                    // console.log(err);
                    logger.error(err.message, 'UserController:forgetPassword', 10);
                    let apiResponse = response.generate(true, 'Failed to find User', 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(result)) {
                    logger.info('No user Found', 'UserController:email search empty');
                    let apiResponse = response.generate(true, 'No User Found', 404, null);
                    reject(apiResponse);
                } else {
                    let output = {
                        result: result,
                        req: req
                    }
                    resolve(output);
                }
            })
        })
    }

    let setOtp = (input) => {
        return new Promise((resolve, reject) => {
            const randomNumber = Math.floor(Math.random() * 899999 + 100000);
            console.log(time.now().format()); //this is how to get current time.
            let updateBody = {
                otp: randomNumber,
                otpExpiry: time.now().add(10, 'm').format(),
            }
            //DeprecationWarning: collection.update is deprecated. Use updateOne, updateMany, or bulkWrite instead.
            UserModel.updateOne({ 'email': input.req.body.email }, updateBody).exec((err, results) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController:dbSaveUser', 10)
                    let apiResponse = response.generate(true, 'Failed to update otp', 400, null);
                    reject(apiResponse);
                } else {
                    let output = {
                        randomNumber: randomNumber,
                        result: input.result
                    }
                    resolve(output);
                }
            })
        })
    }

    let mailer = (input) => {
        return new Promise((resolve, reject) => {
            mailerLib.mail(input.result.email, input.result.firstName, input.randomNumber, (err, mailResponse) => {
                if (err) {
                    console.log(err);
                    logger.error(err.message, 'UserController:mailsend', 10);
                    let apiResponse = response.generate(true, 'Failed to send mail', 500, null);
                    reject(apiResponse);
                } else {
                    resolve(mailResponse);
                }
            })
        })
    }

    validateUser(req, res)
        .then(setOtp)
        .then(mailer)
        .then((mailResponse) => {
            let apiResponse = response.generate(false, 'OTP sent to email', 200, mailResponse);
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}

let resetPassword = (req, res) => {

    let validateUser = (req, res) => {
        return new Promise((resolve, reject) => {
            let condition = { email: req.body.email, otp: req.body.otp, otpExpiry: { $gt: time.now().format() } }
            UserModel.findOne(condition,(err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController:validateOTP', 10)
                    let apiResponse = response.generate(true, 'OTP Discarded', 400, null);
                    reject(apiResponse);
                } else if (check.isEmpty(result)) {
                    logger.info('OTP Discarded', 'UserController:validateOTP',5);
                    let apiResponse = response.generate(true, 'OTP Discarded', 404, null);
                    reject(apiResponse);
                }else {
                    resolve(req)
                }
            })
        })
    }//end of validateUser

    let updatePassword = (req) => {
        return new Promise((resolve, reject) => {
            let condition = { 'email': req.body.email };
            let pass={
                password: passwordLib.hashpassword(req.body.password),
                otp:0
            }
            UserModel.updateOne(condition, pass).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController:updatePassword', 10)
                    let apiResponse = response.generate(true, 'Password Not Updated', 400, null);
                    reject(apiResponse);
                } else {
                    resolve(result)
                }
            })
        })
    }

    validateUser(req, res)
        .then(updatePassword)
        .then((result) => {
            let apiResponse = response.generate(false, 'Password Updated', 200, result);
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
}

// let allUser=(req,res)=>{
//     UserModel.find()
//         .select(' -__v -_id -password')
//         .lean()
//         .exec((err, result) => {
//             if (err) {
//                 console.log(err)
//                 logger.error(err.message, 'User Controller: getAllUser', 10)
//                 let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
//                 res.send(apiResponse)
//             } else if (check.isEmpty(result)) {
//                 logger.info('No User Found', 'User Controller: getAllUser', 10)
//                 let apiResponse = response.generate(true, 'No User Found', 404, null)
//                 res.send(apiResponse)
//             } else {
//                 let apiResponse = response.generate(false, 'All User Details Found', 200, result)
//                 res.send(apiResponse)
//             }
//         })

// }

module.exports = {
    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    editUser: editUser,
    getAllUser: getAllUser,
    getSingleUser: getSingleUser,
    logout: logout,
    deleteUser: deleteUser,
    forgetPassword: forgetPassword,
    resetPassword: resetPassword,
    uploadImage:uploadImage,
    // allUsers: allUsers,
}