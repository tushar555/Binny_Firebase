import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import {Events} from 'ionic-angular';


@Injectable()
export class UserProvider {
  firedata = firebase.database().ref('/SalesNClients');
  getUser = firebase.database().ref('/chatUser');
  //ProdfileData = firebase.database.ref('/');
  nameArray: any = [];
  messages:any=[];
  constructor(public event:Events,public fireAuth: AngularFireAuth) {
    console.log('Hello UserProvider Provider');
  }

  getAllUsers() {

    var promise = new Promise((resolve, reject) => {
      this.getUser.orderByChild("uid").once('value', (snapshot) => {
        // console.log("service",snapshot.val());
        let snaparray = snapshot.val();
        let temparray = [];
        for (let key in snaparray) {
          temparray.push(snaparray[key]);
        }

        resolve(temparray);
      }).catch((Error) => {
        reject(Error)
      });
    });
    return promise;
  }

  getmyClients() {

    var promise = new Promise((resolve, reject) => {
      this.firedata.child(this.fireAuth.auth.currentUser.uid).once('value', (snapshot) => {

        let temparray = [];

        let snaparray = snapshot.val();
        for (let key in snaparray) {
          temparray.push(snaparray[key].clientId);
        }
        this.getAllUsers().then((res: any) => {

          for (let temp in temparray) {
            for (let nametemp in res) {
              if (res[nametemp].uid === temparray[temp]) {
                this.nameArray.push(res[nametemp]);
              }
              console.log(temparray[temp]);
            }
          }
        });

      }).then(() => {
        resolve(this.nameArray);
      }).catch((error) => {
        reject(error);
      });
    });
    return (promise);
  }

  getuserdetails() {

    var promise = new Promise((resolve, reject) => {
      this.getUser.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updateimage(imageurl) {
    var promise = new Promise((resolve, reject) => {
      this.fireAuth.auth.currentUser.updateProfile({
        displayName: this.fireAuth.auth.currentUser.displayName,
        photoURL: imageurl
      }).then(() => {
        firebase.database().ref('/chatUser/' + firebase.auth().currentUser.uid).update({
          displayName: this.fireAuth.auth.currentUser.displayName,
          photoURL: imageurl,
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          resolve({
            success: true
          });
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updatedisplayname(newname) {
    var promise = new Promise((resolve, reject) => {
      this.fireAuth.auth.currentUser.updateProfile({
        displayName: newname,
        photoURL: this.fireAuth.auth.currentUser.photoURL
      }).then(() => {
        this.getUser.child(firebase.auth().currentUser.uid).update({
          displayName: newname,
          photoURL: this.fireAuth.auth.currentUser.photoURL,
          uid: this.fireAuth.auth.currentUser.uid
        }).then(() => {
          resolve({
            success: true
          });
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  addClient(client, sales) {

    var promise = new Promise((resolve, reject) => {
      this.firedata.child(sales.uid).push({
        clientId: client.uid
      }).then(() => {
        this.getUser.child(client.uid).update({
          associate_sales:sales.uid
        })
        resolve({
          success: true
        })
      })

    });

    return promise;
  }

  checkAlreadyadded(){  

    var promise = new Promise((resolve,reject)=>{

      this.firedata.orderByChild('uid').on('value',(snapshot)=>{
        this.messages = [];       
        let  temp = snapshot.val();
            for(let key in temp){     
             this.firedata.child(key).on('value',(snapshot)=>{

                let clientarr = snapshot.val();
                
                  for(let j in clientarr){
                   this.messages.push(clientarr[j]);

                  }

              })
                
            }
            resolve(this.messages);     
      }) 
    });
    return promise;   
  }

}

