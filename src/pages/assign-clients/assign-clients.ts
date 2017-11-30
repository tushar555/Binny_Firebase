import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Events } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-assign-clients',
  templateUrl: 'assign-clients.html',
})
export class AssignClientsPage {

  salespDetails: any;
  salesName: any;
  clientList: any = [];
  tempUsers: any = [];
  addedClientsArray: any = [];
  constructor(public event: Events, private toastCtrl: ToastController, public alertCtrl: AlertController, public zone: NgZone, public user: UserProvider, public navCtrl: NavController, public navParams: NavParams) {

    this.salespDetails = this.navParams.get('salesP');
  }

  ionViewWillEnter() {

  
    this.user.checkAlreadyadded().then((clients) => {
     
      let tempArray1 = [];
      

      let tempClients = clients;

      this.user.getAllUsers().then((res: any) => {
       
        this.zone.run(()=>{
          for (let i in tempClients) {
            tempArray1.push(tempClients[i].clientId);
          }
          for (let j in res) {
            if (tempArray1.indexOf(res[j].uid) === -1 && res[j].user_type == 'client') {
              this.addedClientsArray.push(res[j]);
              this.tempUsers.push(res[j]);
            };
          }
        })

      });
    });


  }

  
  getItems(ev: any) {

    this.clientList = this.tempUsers;
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.clientList = this.clientList.filter((item) => {
        return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addClient(person) {
    let addalert = this.alertCtrl.create({
      title: 'Confirm adding',
      message: 'Do you want add ' + person.displayName + ' with ' + this.salespDetails.displayName,
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.user.addClient(person, this.salespDetails).then((res) => {
              if (res) {
                let toast = this.toastCtrl.create({
                  message: 'Client has been added successfully',
                  duration: 1000,
                  position: 'bottom'
                });

                toast.onDidDismiss(() => {
                 // this.ionViewWillEnter();
                  let addedClientId = this.addedClientsArray.indexOf(person);
                  this.addedClientsArray.splice(addedClientId, 1);
                });

                toast.present();
              }
            })
          }
        }
      ]
    });
    addalert.present();

  }



}

