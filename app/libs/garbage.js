// let arr=[
//     {
//         "userId": "-jgtgjS",
//         "firstName": "def",
//         "lastName": "yellow",
//         "email": "def@gm.com",
//         "otp": 0,
//         "otpExpiry": "",
//         "mobileNumber": 9852145987,
//         "createdOn": "2019-09-15T11:50:29Z",
//         "gender": "female",
//         "friendList": {
//             "_id": "5d7e25852fffaa2858930878",
//             "userId": "-jgtgjS",
//             "friendCount": 0,
//             "userObject": "5d7e25852fffaa2858930877",
//             "allFriends": [
//                 {
//                     "friendId": "GsbItTr",
//                     "requestSent": true,
//                     "requestReceived": false,
//                     "friendSince": 1568549711731,
//                     "_id": "5d7e2b2f25207f161c718a64",
//                     "friendObject": "5d7e285aa6132b179cfa917c"
//                 },
//                 {
//                     "friendId": "ch4PXXn",
//                     "requestSent": false,
//                     "requestReceived": true,
//                     "friendSince": "",
//                     "_id": "5d7f16124c7b3f16ec308c1d",
//                     "friendObject": "5d7dce8d2a719a1d188ed641"
//                 }
//             ],
//             "__v": 2
//         }
//     },
//     {
//         "userId": "GsbItTr",
//         "firstName": "def",
//         "lastName": "yellow",
//         "email": "defghij@gm.com",
//         "otp": 0,
//         "otpExpiry": "",
//         "mobileNumber": 9852145987,
//         "createdOn": "2019-09-15T12:02:34Z",
//         "gender": "female",
//         "friendList": {
//             "_id": "5d7e285aa6132b179cfa917d",
//             "userId": "GsbItTr",
//             "friendCount": 0,
//             "userObject": "5d7e285aa6132b179cfa917c",
//             "allFriends": [
//                 {
//                     "friendId": "-jgtgjS",
//                     "requestSent": false,
//                     "requestReceived": true,
//                     "friendSince": 1568549711771,
//                     "_id": "5d7e2b2f25207f161c718a65",
//                     "friendObject": "5d7e25852fffaa2858930877"
//                 },
//                 {
//                     "friendId": "ch4PXXn",
//                     "requestSent": false,
//                     "requestReceived": true,
//                     "friendSince": "",
//                     "_id": "5d7f0e666876fe18f81cabf5",
//                     "friendObject": "5d7dce8d2a719a1d188ed641"
//                 }
//             ],
//             "__v": 2
//         }
//     },
//     {
//         "userId": "gZ2t0i7",
//         "firstName": "def",
//         "lastName": "yellow",
//         "email": "defgh@gm.com",
//         "otp": 0,
//         "otpExpiry": "",
//         "mobileNumber": 9852145987,
//         "createdOn": "2019-09-15T11:58:32Z",
//         "gender": "female",
//         "friendList": {
//             "_id": "5d7e276845a8522fdc4efb30",
//             "userId": "gZ2t0i7",
//             "friendCount": 0,
//             "userObject": "5d7e276845a8522fdc4efb2f",
//             "allFriends": [
//                 {
//                     "friendId": "ch4PXXn",
//                     "requestSent": true,
//                     "requestReceived": false,
//                     "friendSince": "",
//                     "_id": "5d7f0f876876fe18f81cabfb",
//                     "friendObject": "5d7dce8d2a719a1d188ed641"
//                 }
//             ],
//             "__v": 1
//         }
//     },
    
// ]

// import { Component } from '@angular/core';

// @Component({
//   selector: 'my-app',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
// //here another variable is there i.e 
// //loggedInUser='ch4PXXn';
// //the view is with respect to this userid. so we have only to find the status of userId with ch4PXXn out of the allFriends arr.

//   userList = [
//     {
//         "userId": "-jgtgjS",
//         "firstName": "def",
//         "lastName": "A",
//         "email": "def@gm.com",
//         "otp": 0,
//         "otpExpiry": "",
//         "mobileNumber": 9852145987,
//         "createdOn": "2019-09-15T11:50:29Z",
//         "gender": "female",
//         "friendList": {
//             "_id": "5d7e25852fffaa2858930878",
//             "userId": "-jgtgjS",
//             "friendCount": 0,
//             "userObject": "5d7e25852fffaa2858930877",
//             "allFriends": [
//                 {
//                     "friendId": "GsbItTr",
//                     "requestSent": true,
//                     "requestReceived": false,
//                     "friendSince": 1568549711731,
//                     "_id": "5d7e2b2f25207f161c718a64",
//                     "friendObject": "5d7e285aa6132b179cfa917c"
//                 },
//                 {
//                     "friendId": "ch4PXXn",
//                     "requestSent": true,
//                     "requestReceived": false,
//                     "friendSince": "",
//                     "_id": "5d7f16124c7b3f16ec308c1d",
//                     "friendObject": "5d7dce8d2a719a1d188ed641"
//                 }
//             ],
//             "__v": 2
//         }
//     },
//     {
//         "userId": "GsbItTr",
//         "firstName": "def",
//         "lastName": "B",
//         "email": "defghij@gm.com",
//         "otp": 0,
//         "otpExpiry": "",
//         "mobileNumber": 9852145987,
//         "createdOn": "2019-09-15T12:02:34Z",
//         "gender": "female",
//         "friendList": {
//             "_id": "5d7e285aa6132b179cfa917d",
//             "userId": "GsbItTr",
//             "friendCount": 0,
//             "userObject": "5d7e285aa6132b179cfa917c",
//             "allFriends": [
//                 {
//                     "friendId": "-jgtgjS",
//                     "requestSent": false,
//                     "requestReceived": true,
//                     "friendSince": 1568549711771,
//                     "_id": "5d7e2b2f25207f161c718a65",
//                     "friendObject": "5d7e25852fffaa2858930877"
//                 },
//                 {
//                     "friendId": "ch4PXXn",
//                     "requestSent": false,
//                     "requestReceived": true,
//                     "friendSince": "",
//                     "_id": "5d7f0e666876fe18f81cabf5",
//                     "friendObject": "5d7dce8d2a719a1d188ed641"
//                 }
//             ],
//             "__v": 2
//         }
//     },
//     {
//         "userId": "gZ2t0i7",
//         "firstName": "def",
//         "lastName": "C",
//         "email": "defgh@gm.com",
//         "otp": 0,
//         "otpExpiry": "",
//         "mobileNumber": 9852145987,
//         "createdOn": "2019-09-15T11:58:32Z",
//         "gender": "female",
//         "friendList": {
//             "_id": "5d7e276845a8522fdc4efb30",
//             "userId": "gZ2t0i7",
//             "friendCount": 0,
//             "userObject": "5d7e276845a8522fdc4efb2f",
//             "allFriends": [
//                 {
//                     "friendId": "ch4PXXn",
//                     "requestSent": true,
//                     "requestReceived": false,
//                     "friendSince": "",
//                     "_id": "5d7f0f876876fe18f81cabfb",
//                     "friendObject": "5d7dce8d2a719a1d188ed641"
//                 }
//             ],
//             "__v": 1
//         }
//     },
    
// ]
// }
// ////////////////////////////////////////////////////////////////////

// <!-- <div *ngFor="let friend of arr">
// <h3>{{friend.firstName}} {{friend.lastName}}</h3>
// <h4>{{friend.gender}} </h4>
// <h5>{{friend.email}} </h5>
// <h5>{{friend.mobileNumber}} </h5>
// <table>
//     <tr>
//         <th>Friend Id </th>
//         <th>Is Friend </th>
//     </tr>
//     <tr *ngFor="let item of friend.friendList.allFriends">
//         <td>{{item.friendId}}</td>
//         <td>{{item.friendSince == '' ? 'Not Friend' : 'Friend'}}</td>
//     </tr>
// </table>
// </div> -->

// <div class="container" style="width: 60%" *ngIf="userList.length>0 && loggedInId==userId">
// <div *ngFor="let friend of userList">
//     <!-- <div class="col-md-8"> -->
//     <div class="d-flex flex-row justify-content-around box">
//         <!-- <div class="align-self-center" *ngIf="friend.profilePic==''">
//             <img src="../../../assets/pics/small_profile.png" class="user align-self-center">
//         </div>
//         <div class="align-self-center" *ngIf="friend.profilePic!=''">
//             <img src="{{friend.profilePic}}" class="user align-self-center">
//         </div> -->
//         <div class="flex-column" style="text-align: left; width: 75%">
//             <div class="bx" ng-click="userHome()">{{friend.firstName}} {{friend.lastName}}</div>
//             <div>
//                 this is a description {{friend.description}}
//             </div>
//         </div>

//         <!-- here a button to be displayed based on booleans received from each user object
//         if requestReceived Accept request button/decline request should come
//         else if requestSent button should be decline request
//         else if friend since is having value, unfriend button should come. -->
//         <div class="align-self-center">
//             <button type="button" class="btn btn-primary" (click)="addFriend(friend.userId)"> Add Friend</button>
           
//         </div>
//     </div>
//     <br/>
//     <!-- </div> -->
// </div>
// </div>

// ///////////
// p {
//   font-family: Lato;
// }

// .profile-pic{
//     height: 10em;
//     width: 10em
// }

// .panel{
//     border: 1px blue double
// }

// .avatar{
//     padding:1px;
// }

// .user {
//     display: inline-block;
//     width: 65px;
//     height: 65px;
//     border-radius: 50%;
//     border:2px black solid;
//     object-fit: cover;
//     padding:4px;
//   }

//   .box{
//       border: 3px blue double;
//   }
//   .bx{
//       padding: 5px 0px 5px 0px;
//   }