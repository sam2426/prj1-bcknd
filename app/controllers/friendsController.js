const FriendsModel = require('./../models/FriendList');
const UserModel = require('./../models/User');
const check = require('../libs/checkLib');
const logger = require('./../libs/loggerLib');
const response = require('./../libs/responseLib');
const time = require('./../libs/timeLib');


let createRecords = (userObj, cb) => {
    console.log(userObj);
    FriendsModel.findOne({ userObject: userObj._id })
        .exec((err, retrievedObjDetails) => {
            if (err) {
                logger.error(err.message, 'FriendsModel:record', 10);
                cb(err, null);
            } else if (check.isEmpty(retrievedObjDetails)) {
                console.log(userObj._id);
                let newFriendRecord = new FriendsModel({
                    userObject: userObj._id,
                    userId: userObj.userId,
                })
                newFriendRecord.save((err, newRecord) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'FriendController:dbSaveUser', 10)
                        cb(err, null);
                    } else {
                        console.log(newRecord);
                        cb(null, newRecord);
                    }
                })
            }
            else {
                logger.error('Record Cannot be created as user already present', 'FriendController:CreateRecord', 4);
                cb('Record already Present', null);
            }
        })
}

let addFriend = (req, res) => {

    let updateSenderRecords = () => {
        return new Promise((resolve, reject) => {
            updateRecord(req.body.senderUserId, req.body.receiverUserId, 'send', (err, reresponse) => {
                if (err) {
                    console.log(err);
                    logger.error(err, 'friendController:addRecord', 10);
                    let apiResponse = response.generate(true, err, 400, null);
                    reject(apiResponse);
                } else {
                    logger.info(null, 'friendController:addRecord', 10);
                    resolve();
                }
            })
        })
    }

    let updateReceiverRecords = () => {
        return new Promise((resolve, reject) => {
            updateRecord(req.body.receiverUserId, req.body.senderUserId,  'received', (err, reresponse) => {
                if (err) {
                    console.log(err)
                    logger.error(err, 'friendController:addRecord', 10)
                    let apiResponse = response.generate(true, err, 400, null);
                    reject(apiResponse);
                } else {
                    logger.info(null, 'friendController:addRecord', 10)
                    let apiResponse = response.generate(false,reresponse , 200, null);
                    resolve(apiResponse);
                }
            })
        })
    }

    let updateRecord = (id1, id2, request, cb) => {
        FriendsModel.findOne({ userId: id1 }, (err, userDetails) => {
            if (err) {
                return cb(err, null);
            }
            else if (check.isEmpty(userDetails)) {
                return cb('Id invalid', null);
            }
            else {
                let obj = userDetails.allFriends.find(obj => obj.friendId == id2);
                if (check.isEmpty(obj)) {
                    UserModel.findOne({ 'userId': id2 })
                        .select('_id')
                        .lean()
                        .exec((err, receiverObjectId) => {
                            if (err) {
                                return cb('Failed To Find Details', null)
                            } else {
                                let requestSent = false;
                                let requestReceived = false;
                                (request == 'send') ? (requestSent = true) : (requestReceived = true)
                                let finalObject = {
                                    friendObject: receiverObjectId,
                                    friendId: id2,
                                    requestSent: requestSent,
                                    requestReceived: requestReceived,
                                }
                                userDetails.allFriends.push(finalObject);
                                userDetails.save((err, newRecord) => {
                                    if (err) {
                                        cb(err, null);
                                    } else {
                                        return cb(null, 'Request Sent');
                                    }
                                })
                            }
                        })
                }
                else {
                    return cb(null, 'Request already sent');
                }
            }
        })
    }

    updateSenderRecords(req, res)
        .then(updateReceiverRecords)
        .then((apiResponse) => {
            res.send(apiResponse);
        })
        .catch((apiResponse) => {
            res.send(apiResponse);
        })
}

let deleteRequest = (req, res) => {

    let deleteFromReceiver = () => {
        return new Promise((resolve, reject) => {
            deleteId(req.body.senderUserId, req.body.receiverUserId, (err, reresponse) => {
                if (err) {
                    console.log(err)
                    logger.error(err, 'friendController:dbDeleteRecord', 10)
                    let apiResponse = response.generate(true, 'Failed to delete a record', 400, null);
                    reject(apiResponse);
                } else {
                    logger.info(null, 'friendController:dbDeleteRecord', 10)
                    resolve();
                }
            })
        })
    }

    let deleteFromSender = () => {
        return new Promise((resolve, reject) => {
            deleteId(req.body.receiverUserId, req.body.senderUserId, (err, reresponse) => {
                if (err) {
                    console.log(err)
                    logger.error(err, 'friendController:dbDeleteRecord', 10);
                    let apiResponse = response.generate(true, 'Request not processed', 400, null);
                    reject(apiResponse);
                } else {
                    logger.info(null, 'friendController:dbDeleteRecord', 10)
                    let apiResponse = response.generate(false, 'Request Deleted', 200, null);
                    resolve(apiResponse);
                }
            })
        })
    }

    let deleteId = (id1, id2, cb) => {
        FriendsModel.findOne({ userId: id1 }, (err, userDetails) => {
            if (err) {
                return cb('Request not processed', null);
            }
            else {
                userDetails.allFriends = remove(userDetails.allFriends, 'friendId', id2);
                userDetails.save((err, updateResponse) => {
                    if (err) {
                        return cb(err, null);
                    } else {
                        return cb(null, updateResponse);
                    }
                })
            }
        })
    }

    let remove = (array, key, value) => {
        const index = array.findIndex(obj => obj[key] === value);
        //ternary operator rturns sliced array with key value removed, else if not found returns whole array as 
        //at that time the index will be -1
        return index >= 0 ? [
            ...array.slice(0, index),
            ...array.slice(index + 1)
        ] : array;
    }

    deleteFromReceiver(req, res)
        .then(deleteFromSender)
        .then((apiResponse) => {
            res.send(apiResponse);
        })
        .catch((apiResponse) => {
            res.send(apiResponse);
        })
}

let acceptFriendRequest =(req,res)=>{

    let acceptAtReceiver=()=>{
        return new Promise((resolve,reject)=>{
            updateAcceptRequest(req.body.senderUserId,req.body.receiverUserId,(err,reresponse)=>{
                if (err) {
                    console.log(err)
                    logger.error(err, 'friendController:acceptRequest', 10);
                    let apiResponse = response.generate(true, 'Failed to process request', 400, null);
                    reject(apiResponse);
                } else {
                    logger.info(null, 'friendController:acceptRequest', 10);
                    // let apiResponse = response.generate(false, 'Request Processed', 200, null);
                    // resolve(apiResponse);
                    resolve();
                }
            })
        })
    }

    let acceptAtSender=()=>{
        return new Promise((resolve,reject)=>{
            updateAcceptRequest(req.body.receiverUserId,req.body.senderUserId,(err,reresponse)=>{
                if (err) {
                    console.log(err)
                    logger.error(err, 'friendController:acceptRequest', 10);
                    let apiResponse = response.generate(true, 'Failed to process Request', 400, null);
                    reject(apiResponse);
                } else {
                    logger.info(null, 'friendController:acceptRequest', 10);
                    let apiResponse = response.generate(false, 'Request Processed', 200, null);
                    resolve(apiResponse);
                }
            })
        })
    }

    let updateAcceptRequest = (id1, id2, cb) => {
        FriendsModel.findOne({ userId: id1 }, (err, userDetails) => {
            if (err) {
                return cb('Failed To process request', null);
            }
            else if (check.isEmpty(userDetails)) {
                return cb('Failed To process request', null);
            }
            else {
                const index = userDetails.allFriends.findIndex(obj => obj['friendId'] === id2);
                if (index >= 0) {
                    console.log(userDetails.allFriends[index]);
                    userDetails.allFriends[index].friendSince = time.now();
                    userDetails.save((err, updateResponse) => {
                        if (err) {
                            return cb(err, null);
                        } else {
                            return cb(null, updateResponse);
                        }
                    })
                }else{
                    return cb('Unable to Process Request',null);
                }

            }
        })
    }

    acceptAtReceiver(req,res)
    .then(acceptAtSender)
    .then((apiResponse)=>{
        res.send(apiResponse);
    })
    .catch((apiResponse)=>{
        res.send(apiResponse)
    })
}

let usersFriend=(userId,cb)=>{
    let friendsarr=[];
    FriendsModel.find({'userId':userId})
    .select('allFriends.friendId -_id')
    .exec((err,response)=>{
        if(err){
            console.log(err);
            cb(err,null);
        }
        else{
            friendsarr=response[0].allFriends.map(obj=>obj.friendId);
            console.log(response[0].allFriends);
            console.log(friendsarr);
            // return friendsarr;
            cb(null,friendsarr);
        }
        
    })
    // console.log('my arr is '+friendsarr);
    // return friendsarr;
}

module.exports = {
    createRecords: createRecords,
    addFriendRecord: addFriend,
    acceptFriendRequest:acceptFriendRequest,
    deleteRequest: deleteRequest,
    usersFriend:usersFriend,
}