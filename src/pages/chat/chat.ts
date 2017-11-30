import { Component,NgZone } from '@angular/core';
import { ToastController,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import {ChatProvider} from '../../providers/chat/chat';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  user_type:any;
  allUsers:any = [];
  myUsers:any = [];
  tempUsers:any = [];
  
  firedata = firebase.database().ref('/SalesNClients');
  constructor(public chatService:ChatProvider,public zone:NgZone,public toastCtrl:ToastController,public fireauth:AngularFireAuth,public userService:UserProvider,public storage:Storage,public navCtrl: NavController, public navParams: NavParams) {
 
  }


  ionViewDidLoad() {
    this.userService.getmyClients().then((res:any)=>{
      this.zone.run(()=>{
        this.myUsers = res;
        this.tempUsers = res;
      })   
    }).catch((error)=>{
      let toast = this.toastCtrl.create({
        message: error,
        duration: 2000,
        position: 'bottom'
      });
      
      toast.present();
    });
       
  }
  
  getItems(ev:any){
    this.myUsers = this.tempUsers;
    let val = ev.target.value;
    if(val && val.trim()!=''){
      this.myUsers = this.myUsers.filter((item)=>{
          return(item.displayName.toLowerCase().indexOf(val.toLowerCase())>-1);
      });
    }
  }

  detail(user){
   this.chatService.initializeuser(user);
   this.storage.get('user_type').then((user_type)=>{
    this.navCtrl.push('ChatDetailsPage',{"data":user,"user_type":user_type});
    
})
   
  }
}
