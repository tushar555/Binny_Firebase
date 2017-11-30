import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { AlertController,Platform } from 'ionic-angular';
import {Camera} from '@ionic-native/camera';
import {} from '';

@Injectable()
export class ImagehandlerProvider {

  firestore = firebase.storage();
  extension:any; 
  nativepath: any;
 
  constructor(public camera:Camera,public platform:Platform,public alertCtrl:AlertController,public filechooser:FileChooser) {
  // cordova.FilePicker.pickFile(successCallback,errorCallback);
    function successCallback(path) {
      alert("You picked this file: " + path);
    }
  }

  storeImage(){
    var promise = new Promise((resolve,reject)=>{

              this.filechooser.open().then((url)=>{
                (<any>window).FilePath.resolveNativePath(url,(result)=>{
                  let currentName = result.replace(/^.*[\\\/]/, '');
                  var splitted = currentName.split(".");
                  let array = ['jpg','jpeg','png','xlsx','xls','xlsm','pdf'];
                  if( array.indexOf(splitted[1]) === -1){
                        reject("This file format Not Suppported");            
                  }else{
                    let imagealert = this.alertCtrl.create({
                      title: 'Confirm Sending',
                      message: 'Do you want to send this image?',
                      buttons: [
                        {
                          text: 'Cancel',
                          role: 'cancel',
                          handler: () => {
                           reject("User Cancel Sending..");
                          }
                        },
                        {
                          text: 'Send',
                          handler: () => {
                              alert("Enter");
                            (<any>window).resolveLocalFileSystemURL(result,(res)=>{
                                alert("Enter 1");              
                              res.file((resFile)=>{
                                alert("Enter 2");              
                                var reader = new FileReader();
                                reader.readAsArrayBuffer(resFile);
                                reader.onloadend = (eve:any)=>{
                                alert("Enter 3");
                            
                                  var imgBlob = new Blob([eve.target.result],{ type: splitted[1] });
                                   
                
                                  var imageStore = this.firestore.ref('/SentFiles').child(firebase.auth().currentUser.uid).child(currentName);
                                 
                                  imageStore.put(imgBlob).then((res)=>{
                                                       
                                  this.firestore.ref('/SentFiles').child(firebase.auth().currentUser.uid).child(currentName).getDownloadURL().then((url)=>{ 
                                        resolve({"url":url,"extension":splitted[1],"fileName":currentName});
                                      }).catch((error)=>{
                                       
                                        reject(error);
                                      });
                                  }).catch((error)=>{
                                      reject(error);
                                  });
                                }
                              })
                          })
                          }
                        }
                      ]
                    });
                    imagealert.present();
                  }    
                })
          })
    
        });
     return promise;   
  }


  storeImageOnstorage(result){
    var promise = new Promise((resolve,reject)=>{
  

  });
  return promise;
  }



  uploadimage() {
    let user = firebase.auth().currentUser.uid;
  //  console.log(user);
    //var imageStore = this.firestore.ref(user).child('/profilepic');alert(imageStore);
    var promise = new Promise((resolve, reject) => {
        this.filechooser.open().then((url) => {
          (<any>window).FilePath.resolveNativePath(url, (result) => {
            this.nativepath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
              res.file((resFile) => {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });//alert("aalo ikde"+imageStore);
                  var imageStore = this.firestore.ref('/profileimages').child(user);
                  imageStore.put(imgBlob).then((res) => {
                    this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                      resolve(url);
                    }).catch((err) => {
                        reject(err);
                    })
                  }).catch((err) => {
                    reject(err);
                  })
                }
              })
            })
          })
      })
    })
     return promise;
  }

}

