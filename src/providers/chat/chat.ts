import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';
import {AngularFireAuth } from 'angularfire2/auth';
@Injectable()
export class ChatProvider {

  usersChat = firebase.database().ref('/UsersChatDetails');

  getChat:any = [];
  messages:any = [];
  user:any; 
  constructor(public event:Events,public fireAuth:AngularFireAuth) {
    console.log('Hello ChatProvider Provider');
  }
  
  initializeuser(user){
      this.user = user;
    
  }

  addMessage(msg,msgType,fileName){
    console.log("USER",this.user.uid);
    
      var promise  = new Promise ((resolve,reject)=>{
        this.usersChat.child(this.fireAuth.auth.currentUser.uid).child(this.user.uid).push({
          sentBy : this.fireAuth.auth.currentUser.uid,         
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          messageType:msgType,
          fileName:fileName
        }).then(()=>{
            this.usersChat.child(this.user.uid).child(firebase.auth().currentUser.uid).push({
             sentBy :  this.fireAuth.auth.currentUser.uid,
             message: msg,
             timestamp: firebase.database.ServerValue.TIMESTAMP,
             messageType:msgType,
             fileName:fileName
            }) 
        }).then(()=>{
          resolve(true);
        });
     
     })
     return promise;
    
 
  }

  getMessages(){
    this.usersChat.child(this.fireAuth.auth.currentUser.uid).child(this.user.uid).on('value',(snapshot)=>{
      this.messages = [];   
      let  temp = snapshot.val();
          for(let key in temp){
              this.messages.push(temp[key]);
          }
        
          this.event.publish('newMessages',this.messages);
    });
  }

  getmyChat(){
    console.log("UID",this.fireAuth.auth.currentUser.uid);
      this.usersChat.child(this.fireAuth.auth.currentUser.uid).remove();
  }

}
