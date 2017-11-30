import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,PopoverController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import {ImagehandlerProvider} from '../../providers/imagehandler/imagehandler';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  avatar: string;
  displayName: string;
 user_type:any;
  constructor(public popoverCtrl:PopoverController,public storage:Storage,public imghandler: ImagehandlerProvider, public zone: NgZone, public alertCtrl: AlertController, public userservice: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.storage.get('user_type').then((user_type)=>{
      this.user_type = user_type
    });
  }

  ionViewDidLoad() {
    
    this.loaduserdetail();
  }
  loaduserdetail() {

    this.userservice.getuserdetails().then((res: any) => {
      this.displayName = res.displayName;
      console.log(this.displayName);
      this.zone.run(() => {
        this.avatar = res.photoURL;
      });

    })
  }

  editimage() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    this.imghandler.uploadimage().then((url: any) => {
      this.userservice.updateimage(url).then((res: any) => {
        if (res.success) {
          statusalert.setTitle('Updated');
          statusalert.setSubTitle('Your profile pic has been changed successfully!!');
          statusalert.present();
          this.zone.run(() => {
            this.avatar = url;
          })
        }
      }).catch((err) => {
        statusalert.setTitle('Failed');
        statusalert.setSubTitle('Your profile pic was not changed');
        statusalert.present();
      })
    })
  }

  editname() {
    let statusalert = this.alertCtrl.create({
      buttons: ['okay']
    });
    let alert = this.alertCtrl.create({
      title: 'Edit Nickname',
      inputs: [{
        name: 'nickname',
        placeholder: 'Nickname'
      }],
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Edit',
          handler: data => {
            if (data.nickname) {
              this.userservice.updatedisplayname(data.nickname).then((res: any) => {
                if (res.success) {
                  statusalert.setTitle('Updated');
                  statusalert.setSubTitle('Your nickname has been changed successfully!!');
                  statusalert.present();
                  this.zone.run(() => {
                    this.displayName = data.nickname;
                  })
                } else {
                  statusalert.setTitle('Failed');
                  statusalert.setSubTitle('Your nickname was not changed');
                  statusalert.present();
                }

              })
            }
          }

        }
      ]
    });
    alert.present();
  }

  logout() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Logout',
      message: 'Do you want to exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            firebase.auth().signOut().then(() => {
              this.navCtrl.setRoot('LoginPage');
            })
          }
        }
      ]
    });
    alert.present();
   
  }

  goback(){
    console.log("sdsds");
    this.navCtrl.pop();
  }


}


