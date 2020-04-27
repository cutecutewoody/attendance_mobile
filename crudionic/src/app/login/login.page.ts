import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service'
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  password: string;
  user_id: string;
  deviceID: string;
  constructor(
    private router: Router,
  	private postPvdr: PostProvider,
    private storage: Storage,
    public toastCtrl: ToastController,
    public http   : HttpClient,
    public storageService: StorageService,
    private androidFingerprintAuth: AndroidFingerprintAuth
  ) { 
    
  }

  ngOnInit() {
  }
 async prosesLogin(){
  this.getUID();
  if (this.password !="" && this.user_id!=""){   
       let body = JSON.stringify({
         password: this.password,
         user_id: this.user_id,
         aksi: 'login'
         });
   
         this.http.post("https://woodyfyp.000webhostapp.com/server_api/receiver-api.php",body)
         .subscribe( async response => {
          if(response['success']==true){
            console.log(response)           
            alert("You have already binded device for No." + response['data']['bind_count']+" times. Your number of bind will be +1; Please note that no more than 5 times")
            var bindCount = parseInt(response['data']['bind_count'])+1;
            alert("bindCount:" + bindCount);
            let body2 = JSON.stringify({
              password: this.password,
              user_id: this.user_id,
              bind_device:this.deviceID,
              bind_count: bindCount,
              bind_index:1,
              aksi: 'registerDevice'
              });
           
            console.log(body2)
            this.http.post("https://woodyfyp.000webhostapp.com/server_api/receiver-api.php",body2)
            .subscribe(async response2 => {
              console.log(response2) 
                if(response2['regSuccess']==true){
                  this.storage.set('session_storage', response['data']); 
                  this.storage.set('registerIndex', true); 
                  //this.storageService.setObject('person', {user_id : this.user_id, deviceId:this.deviceID});
      
                       this.router.navigate(['/customer']);
                       const toast = await this.toastCtrl.create({
                        message: 'login success',
                        duration: 2000
                      });
                     toast.present();
                      this.user_id = "";
                      this.password = "";

                }else{
                  alert("Exceed MAX times of Device Bingding");
                }
            
            });
            
          }else{       
            
            console.log(response);
            const toast = await this.toastCtrl.create({
            message: "Invalid",
            duration: 2000
         });
         toast.present(); 
        }

         });

      // this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
        
      //   var alertmsg = data.msg;
      //   if(data.success){
      //     this.storage.set('session_storage', data.result);
      //     this.router.navigate(['/customer']);
      //     const toast = await this.toastCtrl.create({
      //       message: 'login success',
      //       duration: 2000
      //     });
      //     toast.present();
      //     this.username = "";
		  //     this.password = "";
      //     console.log(data);
      //   }else{          
      //     const toast = await this.toastCtrl.create({
      //       message: alertmsg,
      //       duration: 2000
      //     });
      //     toast.present(); 
      //   }
      // });
    }else{
          
      const toast = await this.toastCtrl.create({
        message: "username or password invalid",
        duration: 2000
      });
      toast.present(); 
    }

  }
  formRegister(){
  	this.router.navigate(['/register']);
  }
  getUID(){
    console.log("enter the get UID")
    this.storageService.get('UniqueDeviceID').then(result => {
      if (result != null) {
      console.log('UniqueDeviceID: '+ result);
      this.deviceID = result;
      }
      }).catch(e => {
      console.log('error: '+ e);
      // Handle errors here
      });
    
  }

}
