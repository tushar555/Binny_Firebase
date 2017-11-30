import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-select-sales',
  templateUrl: 'select-sales.html',
})
export class SelectSalesPage {

  salesPersons:any = [];
  tempUsers:any = [];
  
  constructor(public zone:NgZone,public user:UserProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
   this.getsalesPersons();
  }

  getsalesPersons(){
    this.user.getAllUsers().then((users:any)=>{
         for(let key in users){
            
            if(users[key].user_type=='sales'){
              this.zone.run(()=>{
                this.salesPersons.push(users[key]);  
                this.tempUsers.push(users[key]);                              
              });
            }

         }     
    });
   
  }

  getItems(ev: any) {
   
    this.salesPersons = this.tempUsers;
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.salesPersons = this.salesPersons.filter((item) => {
        return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

    gotoClient(salesP){
      console.log("sales",salesP);
      this.navCtrl.push('AssignClientsPage',{"salesP":salesP});
    }
}
