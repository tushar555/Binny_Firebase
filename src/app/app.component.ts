import { Component,ViewChild } from '@angular/core';
import { Platform ,Nav,AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SmartAudioProvider } from '../providers/smart-audio/smart-audio';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = "LoginPage";
  backAlert:any;
  constructor(public alertCtrl:AlertController,smartAudio: SmartAudioProvider,public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        
                         if(this.nav.canGoBack()){
                           this.nav.pop();
                         }else{
                           if(this.backAlert){
                             this.backAlert.dismiss();
                             this.backAlert=null
                           }else{
                            this.myHandlerFunction();
                           }
                         }
                       });
      statusBar.styleDefault();
      splashScreen.hide();
      smartAudio.preload('sendSuccess', 'assets/sound/send_message.mp3');
    });
  }
  myHandlerFunction(){
    this.backAlert = this.alertCtrl.create({
    title: 'Exit?',
    message: 'Do you want to exit the app?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {

        }
      },
      {
        text: 'Exit',
        handler: () => {
          this.platform.exitApp();
        }
      }
    ]
  });
  this.backAlert.present();
} 
}
