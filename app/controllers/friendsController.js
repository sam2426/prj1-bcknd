const FriendsModel = require('./../models/FriendList');
const check = require('../libs/checkLib');

let createRecords = (userObj, cb) => {
    console.log(userObj);
    FriendsModel.findOne({ userObject: userObj._id })
        .exec((err, retrievedObjDetails) => {
            if (err) {
                logger.error(err.message, 'FriendsModel:record', 10);
                cb(err,null);
            } else if (check.isEmpty(retrievedObjDetails)) {
               console.log(userObj._id);
                let newFriendRecord = new FriendsModel({
                    userObject:userObj._id,
                    userId: userObj.userId,
                })
                newFriendRecord.save((err, newRecord) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'FriendController:dbSaveUser', 10)
                        cb(err,null);
                    } else {
                        console.log(newRecord);
                        cb(null,newRecord);
                    }
                })
            }
            else {
                logger.error('Record Cannot be created as user already present', 'FriendController:CreateRecord', 4);
                cb('Record already Present',null);
            }
        })
}

let addFriend=(req,res)=>{
    let updateSenderRecords=()=>{
        return new Promise((resolve,reject)=>{
            FriendsModel.findOne
        })
    }

    let updateReceiverRecords=()=>{
        return new Promise((resolve,reject)=>{
            
        })
    }

    updateSenderRecords(req,res)
    .then(updateReceiverRecords)
    .then((resolve)=>{
        let apiResponse = response.generate(false, 'Login Successful', 200, resolve);
        res.send(apiResponse)
    })
    .catch((err)=>{
        let apiResponse = response.generate(true, 'Login Unsuccessful', 500, null);
        res.send(apiResponse);
    })
}

module.exports = {
    createRecords: createRecords,
    addFriendRecord:addFriend,
}