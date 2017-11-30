import { Component,ViewChild,NgZone } from '@angular/core';
import { ModalController,Platform,AlertController,LoadingController,IonicPage, NavController, NavParams,Events,ToastController,Content } from 'ionic-angular';
import {ChatProvider } from '../../providers/chat/chat';
import {ImagehandlerProvider} from '../../providers/imagehandler/imagehandler';
import { Storage } from '@ionic/storage';
//import { FileTransfer,FileTransferObject } from '@ionic-native/file-transfer';
import { NativeAudio } from '@ionic-native/native-audio';
import { SmartAudioProvider } from '../../providers/smart-audio/smart-audio';

@IonicPage()
@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html',
})
export class ChatDetailsPage {
  @ViewChild('content') content: Content;
 
  user_type: any;
  data: any = [];
  name: any;
  photoUrl: any;
  userDetails: any;
  uid: any;
  message: any;
  allMessages: any = [];
  imageOrNot:any = [];
  storageDir:any;
  salesDetails:any;
  loading:any;
  constructor(public audoProvider:SmartAudioProvider,public nativeAudio: NativeAudio,public modalCtrl:ModalController,public platform:Platform,public alertCtrl:AlertController,public storage:Storage,public loadingCtrl: LoadingController, public imageService: ImagehandlerProvider, public zone: NgZone, public toastCtrl: ToastController, public event: Events, public chatService: ChatProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.platform.ready().then(()=>{
      if(this.platform.is('ios')){
        //this.storageDir = this.file.dataDirectory;
      }else if(this.platform.is('android')){
       // this.storageDir = this.file.dataDirectory;
       this.storageDir = "file:///storage/emulated/0/Download/";
      }
      });
   

    this.user_type = this.navParams.get('user_type');
    this.message = '';
    console.log(this.user_type);
    this.onScroll();
    
    

    
    if (this.user_type == 'sales') {
      this.userDetails = this.chatService.user;
      this.name = this.userDetails.displayName;
      this.photoUrl = this.userDetails.photoURL;
      this.uid = this.userDetails.uid;     
    }

    if (this.user_type == 'client') {
      let salesDetails = this.navParams.get('salesDetails');
      this.salesDetails = salesDetails;
      this.name = salesDetails.displayName;
      this.photoUrl = salesDetails.photoURL;
      this.uid = salesDetails.uid;
   
    }

    this.event.subscribe('newMessages', () => {
      this.allMessages = [];
      this.zone.run(() => {
        this.allMessages = this.chatService.messages;

        for(var key in this.allMessages){
         
          if(this.allMessages[key].message.substring(0,4) =='http' || this.allMessages[key].message.substring(0,4) =='https' )
            this.imageOrNot.push(this.allMessages[key].messageType);
          else
            this.imageOrNot.push(this.allMessages[key].messageType);  
        
        }
      
       
      })

     
      this.onScroll();
    });

  }

  ionViewDidEnter() {
    this.chatService.getMessages();
  }
  

  sendMessage(message) {
    console.log("Mesage",this.message);
    if (this.message === '') {
      let toast = this.toastCtrl.create({
        message: 'Message Cannot be Empty!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    } else {
      this.chatService.addMessage(this.message,null,null).then((res: any) => {
        this.onScroll();
        this.nativeAudio.play('assets/sound/send_message.mp3', () => console.log('uniqueId1 is done playing'));        
       this.audoProvider.play('sendSuccess');
        this.message = '';
      })
    }

  }

  attachFile() {

    this.loading = this.loadingCtrl.create({
      content: 'Please wait file is sending...',
      spinner: 'crescent'
    });
    this.loading.present();
    this.imageService.storeImage().then((res: any) => {
      this.loading.dismiss();
      this.chatService.addMessage(res.url,res.extension,res.fileName).then(() => {
        //this.conte
      }).catch((error) => {
        this.presentToast(error);
        this.loading.dismiss();
      })
    }).catch((error) => {
      this.presentToast(error);

      this.loading.dismiss();


    });

  }

  ionViewDidLeave(){
    this.loading.dismiss();
  }

  gotoProfile(){
    this.navCtrl.push('ProfilePage');
  }

  presentToast(error) {
    let toast = this.toastCtrl.create({
      message: error,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  onScroll() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000)
  }


  clearChat(){

      let alert = this.alertCtrl.create({
        title: 'Confirm Delete',
        message: 'Do you want to clear all chat?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Clear All',
            handler: () => {
              this.chatService.getmyChat();
            }
          }
        ]
      });
      alert.present();
    
  }
  
 

  downloadFile(path,name){
  //   let  loadingPopup = this.loadingCtrl.create({
  //     spinner: 'crescent',
  //     content: "Please wait your image  Downloading is in process..",
  // });
  // loadingPopup.present();

  // const fileTransfer: FileTransferObject = this.transfer.create();
  // const location = path;
  // fileTransfer.download(location,this.storageDir+name).then((entry)=>{
  //   const alertSuccess = this.alertCtrl.create({
  //     title: `Download Succeeded!`,
  //     subTitle: `Successfully downloaded to: ${entry.toURL()}`,
  //     buttons: [
  //       {
  //         text: 'OK',
  //         handler: () => {
  //           // let link = "https://progressiveinteractive.com/communication/change_status.php";
  //           // let data = JSON.stringify({"imageId":id,"name":name});
           
  //           // this.http.post(link,data).map(res=>res.json()).subscribe((data)=>{
              
  //           //   loadingPopup.dismiss();
  //           //   this.ionViewDidLoad();
  //           // });
  //           loadingPopup.dismiss();
  //         }

  //       }  
  //     ]
  //   });

  //   alertSuccess.present();
  // },(error)=>{
  //   const alertFailure = this.alertCtrl.create({
  //     title: `Download Failed!`,
  //     subTitle: `was not downloaded. Error code: ${error}`,
  //     buttons: ['Ok']
  //   });
  //   loadingPopup.dismiss();
  //   alertFailure.present();

  // }); 
  }

}

