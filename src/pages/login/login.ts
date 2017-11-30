import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import {FormBuilder,Validators } from '@angular/forms';
import {TabsPage} from '../tabs/tabs';
import {Storage} from '@ionic/storage';
import {ChatProvider} from '../../providers/chat/chat';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: any;  
  public backgroundImage: any = "./assets/bg1.jpg";
  public imgLogo: any = "./assets/medium_150.70391061453px_1202562_easyicon.net.png";

  constructor(public chatService:ChatProvider,public storage:Storage,public toastCtrl:ToastController,public loadingCtrl:LoadingController,public fb: FormBuilder,public authService:AuthProvider,public navCtrl: NavController, public navParams: NavParams) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginForm = fb.group({
          email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
          password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });  
  }
  
 
  login(){
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent', 
      content: ''
    });
    loadingPopup.present();
    this.authService.login(this.loginForm.value).then((res:any)=>{
      
      if(res.success){

        this.authService.checkUserType().then((res:any)=>{
          this.presentToast("Login SuccessFull!",true,res.user_type,res.salesDetails,1000); 
          loadingPopup.dismiss();
        });
                
      }
    }).catch((res:any)=>{
   
        if(res.message.code=='auth/network-request-failed')
           this.presentToast("No Internet Connection! Please Check Network Setting",false,'','',2000); 
        else   
           this.presentToast("Please Check your Credentials",false,'','',2000); 
      
      loadingPopup.dismiss(); 
    });
  }

  presentToast(message,flag,user_type,salesDetails,timeout) {
    
     const toast = this.toastCtrl.create({
       message: message,
       duration: timeout,
       position: 'bottom'
     });
   
     toast.onDidDismiss(() => {
       if(flag){
        this.storage.set('user_type',user_type);
         if(user_type=='sales'){       
          this.navCtrl.setRoot(TabsPage,{"user_type":user_type});    
         }
         else if(user_type=='client'){    
          this.chatService.initializeuser(salesDetails);
          this.navCtrl.setRoot("ChatDetailsPage",{"user_type":user_type,"salesDetails":salesDetails});   
         }else if(user_type=='admin'){
           this.navCtrl.setRoot('AdminHomePage');
         }
       }    
     });
   
     toast.present();
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
