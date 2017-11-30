import { Injectable } from '@angular/core';
import { usercredentials } from '../../model/interface/usercredentials';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { UserProvider } from "../../providers/user/user";

@Injectable()
export class AuthProvider {
  fireData = firebase.database().ref('/chatUser');
  credentials = {} as usercredentials;
  constructor(public userService:UserProvider,public authfire:AngularFireAuth) {
    
  }

  login(credentials:usercredentials){
    var promise  = new Promise((resolve,reject)=>{
      this.authfire.auth.signInWithEmailAndPassword(credentials.email,credentials.password).then((res:any)=>{
          resolve({success:true,uid:res.uid});
      }).catch((error)=>{
          reject({success:false,message:error});
      });
      
    })
    return promise;
  }

  checkUserType(){
    var promise = new Promise((resolve,reject)=>{
        this.fireData.child(this.authfire.auth.currentUser.uid).once('value',(snapshot)=>{
              let user_type= snapshot.val().user_type;
              if(user_type=='sales'){
                  resolve({"user_type":user_type,"salesDetails":''});
              }else if(user_type=='client'){
                      let salesPName = snapshot.val().associate_sales;
                      this.userService.getAllUsers().then((res:any)=>{
                          for(let i in res){
                            
                            if(salesPName==res[i].uid){
                                console.log("SVV",res[i]);
                              resolve({"user_type":snapshot.val().user_type,"salesDetails":res[i]});
                            
                            }
                           
                          }
                          
                      });     
              }else if(user_type=='admin'){
                  resolve({"user_type":user_type,'salesDetails':''})
              }
            
        }).catch((error)=>{reject(error)});
    });
    return promise;
  }
}
