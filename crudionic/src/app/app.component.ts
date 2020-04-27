import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public anFinAutho: AndroidFingerprintAuth,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();     
    },(err=>{

      alert(err)
    }
      
      ));
  }

  bioAuthen(){
    this.anFinAutho.isAvailable().then((result)=>{
      if(result.isAvailable){
        this.anFinAutho.encrypt({
          clientId:"clientId",
          username:"username",
          password:"password",
        }).then((result)=>{
          if(result.withFingerprint){
            alert("successfully encrypted credencial ")
            alert("encrypted credencial: "+result.token);
          }else if(result.withBackup){
            alert("successfully authenticated with backup password")
          }else{
            alert("did not authenticated")}

        },(err)=>{
          if(err== this.anFinAutho.ERRORS.FINGERPRINT_CANCELLED){
            alert("fingerprint authenticated cancelled")
          }else{

            alert(JSON.stringify(err))
          }
        })
      }else{
        alert("Autheticated not avaliable")
      }
  });
  }
}
