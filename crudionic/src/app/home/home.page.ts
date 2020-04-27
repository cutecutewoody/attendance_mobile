import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { StorageService } from '../storage.service'
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  deviceID: any;
  subscribtion: any;
  constructor(private router: Router,
    private uniqueDeviceID: UniqueDeviceID,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
    private storage: Storage,
    public storageService: StorageService) {
      this.checkIfRegDevice();
      
  }

checkIfRegDevice(){
  // this.storageService.getObject('person').then(result => {
  //   if (result != null) {
  //   console.log('Person: '+ result);
  //   this.router.navigate(['/customer']);
  //   }else{
  //     this.router.navigate(['/login']);
  //     console.log('did not reg before, need to login to reg the device');
  //   }
  //   }).catch(e => {
  //   console.log('error: ', e);
  //   });

  this.storage.get('registerIndex').then((res)=>{
		if(res){
      this.checkIfBindingDevice();
    }else{
      this.getPermission();
    }
    });
}

  checkIfBindingDevice(){
    this.router.navigate(['/customer']);
  }


// getUniqueDeviceID() {
  // this.uniqueDeviceID.get()
  //   .then((uuid: any) => {
  //     console.log(uuid);
  //     this.deviceID = uuid;
  //     this.storageService.set('UniqueDeviceID', this.deviceID).then(result => {
  //       console.log('Data is saved');
  //       }).catch(e => {
  //       console.log("error: " + e);
  //       });
  //   })
  //   .catch((error: any) => {
  //     console.log(error);
  //     this.deviceID = "Error! ${error}";
  //   });

  //alert("this.uid.IMEI"+this.uid.IMEI);
// }

// getID_UID(type){
//   if(type == "IMEI"){
//     return this.uid.IMEI;
//   }else if(type == "ICCID"){
//     return this.uid.ICCID;
//   }else if(type == "IMSI"){
//     return this.uid.IMSI;
//   }else if(type == "MAC"){
//     return this.uid.MAC;
//   }else if(type == "UUID"){
//     return this.uid.UUID;
//   }
// }
getPermission(){
  this.androidPermissions.checkPermission(
    this.androidPermissions.PERMISSION.READ_PHONE_STATE
  ).then(res => {
    if(res.hasPermission){
      this.storageService.set('UniqueDeviceID', this.uid.IMEI);
      this.router.navigate(['/login']);
    }else{
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(res => {
      
        if(res.hasPermission){
          this.storageService.set('UniqueDeviceID', this.uid.IMEI);
          alert("Persmission Granted Please Restart App!");
          navigator['app'].exitApp();

        }else{
          //alert(JSON.stringify(res));
          navigator['app'].exitApp();
        }
       
      }).catch(error => {
        alert("Error! "+error);
      });
    }
  }).catch(error => {
    alert("Error! "+error);
  });
}
// formPublish(){
//   this.googleNearby.publish('Hello')
//   .then((res: any) => console.log(res))
//   .catch((error: any) => console.error(error));
// }

// formSubscribe(){
//   this.googleNearby.subscribe().subscribe(result => {
//     console.log(result)})

// }
}