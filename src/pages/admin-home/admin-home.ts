import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {
  photoURL:any;
  constructor(public alertCtrl:AlertController,public user:UserProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.user.getAllUsers().then((users:any)=>{
     
          for(let key in users){
            if(users[key].uid === firebase.auth().currentUser.uid){
                this.photoURL = users[key].photoURL;
            }
          }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminHomePage');
  }

  gotoNext(){
    this.navCtrl.push('SelectSalesPage');
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
}
