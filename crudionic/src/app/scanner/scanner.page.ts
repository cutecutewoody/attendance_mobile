import { Component, OnInit } from '@angular/core'
import { QRScanner,QRScannerStatus }from '@ionic-native/qr-scanner/ngx'
import { Platform } from '@ionic/angular'
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  qrScan: any;
  username: string;
  userId : string;
  constructor(public platform :Platform,
              private router: Router,
              public qr       : QRScanner,
              public http     : HttpClient, 
              private storage: Storage,
              public toastCtrl: ToastController,
              ) {

    //cancel scanning when cancel button is clicked
    this.platform.backButton.subscribeWithPriority(0,()=>{
      document.getElementsByTagName("body")[0].style.opacity="1"
      this.qrScan.unsubscribe()
    })

   }

  ngOnInit() {
    this.storage.get('session_storage').then((res)=>{
      this.username = res.username;
      this.userId = res.user_id;
      });
    this.startScan()
  }
  startScan(){
      this.qr.prepare()
      
    .then((status:QRScannerStatus)=>{

        if(status.authorized){
          // camera permission was granted
          this.qr.show();
          document.getElementsByTagName("body")[0].style.opacity="0"
          
          this.qrScan =this.qr.scan().subscribe((textFound)=>{
            document.getElementsByTagName("body")[0].style.opacity="1"
            this.qrScan.unsubscribe()
            this.handleAttendance(textFound)
            },(err)=>{
            alert("err"+JSON.stringify(err))
          })
        }else if(status.denied){
          alert("please grant your camera permission!")
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
        }else{
          alert("please grant your camera permission!")
          // permission was denied, but not permanently. You can ask for permission again at a later time.
    
        }
      })
  .catch((e: any) => console.log('Error is', e))
  }

  handleAttendance(qrtext:string){
      var splitted = qrtext.split(";",4);
      var courseID = splitted[0];
      var sectionID = splitted[1];
      var timestamp = splitted[2];
      var courseCharger = splitted[3];

      let body =JSON.stringify({
        aksi        : 'checkClock',    
        timestamp   : timestamp
      });

        console.log("body: " +body)
        this.http.post("https://woodyfyp.000webhostapp.com/server_api/clock.php",body)
        .subscribe(response => {
          console.log(response)
          if(response['success']){
            this.takeAttendance(courseID,sectionID,courseCharger);
          }else{
            alert("try agagin")
          }
        });
  }

  takeAttendance(courseID:string,sectionid:string,courseCharger:string){

    let body =JSON.stringify({
      aksi        : 'takeAttendance',
      courseId    : courseID,
      sectionId   : sectionid,
      courseCharger:courseCharger,
      userId      : this.userId

    })
    
    console.log(body)

    this.http.post("https://woodyfyp.000webhostapp.com/server_api/receiver-api.php",body)
    .subscribe(async response => {
      console.log(response['success']);

      if(response['success']){
       
        this.router.navigate(['/customer']);
        const toast = await this.toastCtrl.create({
          message: 'Take attendance successfully',
          duration: 2000
        });
       toast.present();
      }else{
        const toast = await this.toastCtrl.create({
          message: 'Unsuccessfully action! Try again later.',
          duration: 2000
        });
       toast.present();
      }
        

    })
  }

  back(){
    this.router.navigate(['/customer']);
  }
}
