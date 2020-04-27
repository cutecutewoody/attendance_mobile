import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import  {PostProvider } from '../../providers/post-provider'
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
	anggota: any;
	 username: string;
	 userId : string;
	 password: string;
    gorcs: any = [];
    deviceID: any;
  	// limit: number = 15; // LIMIT GET PERDATA
  	// start: number = 0;

  constructor(
    private  postPvdr : PostProvider,
	private router: Router,
	private storage: Storage,
	public toastCtrl: ToastController,
	public http   : HttpClient,
	public storageService: StorageService,
	public anFinAutho: AndroidFingerprintAuth,
  ) { }

  ngOnInit() {
    
  }
  ionViewWillEnter(){
	this.storage.get('session_storage').then((res)=>{
		this.anggota = res;
		this.username = this.anggota.username;
		this.userId = this.anggota.user_id;
		this.password = this.anggota.password;

    this.getUID();

    });
    

	// this.storageService.getObject('person').then(result => {
	// 	if (result != null) {
	// 	console.log('Person: '+ result);
	// 	 	this.anggota = result;
	//  		this.username = this.anggota.username;
	// 	}
	// 	}).catch(e => {
	// 	console.log('error: ', e);
	// 	});
	// 	this.customers = [];
	// 	this.start = 0;
	// 	this.loadCustomer();
  }

   checkMobile(){
    let body =JSON.stringify({
      aksi : 'getUserInfo',
      user_id: this.userId,          
    });
    console.log("body: " +body);
    this.http.post("https://woodyfyp.000webhostapp.com/server_api/receiver-api.php",body)
    .subscribe(async response => {

        console.log(response['data']['bind_device'])
        if(response['data']['bind_device']==this.deviceID){
        this.loadGorC();
        }else{
          alert('This Account has been register by another device');
          alert('Account in this device will be de-registered')
          this.storage.clear();
          navigator['app'].exitApp();
        }
    });
  }
  // addCustomer(){

  //   this.router.navigate(['/addcustomer']);
  // }
  // updateCustomer(id,name,desc){
  // 	this.router.navigate(['/addcustomer/' + id + '/' + name + '/' + desc]);
  // }
  // delCustomer(id){

  // 	let body = {
  // 			aksi : 'delete',
  // 			customer_id : id
  // 		};

  // 		this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
  // 			this.ionViewWillEnter();
  // 		});

  // }
  // showCustomer(id,name,desc){
  // 	this.router.navigate(['/showcustomer/' + id + '/' + name + '/' + desc]);
  // }
  // loadCustomer(){
  // 	return new Promise(resolve => {
  // 		let body =JSON.stringify({
  // 			aksi : 'getdata',
  // 			limit : this.limit,
  // 			start : this.start,
	// 	  });
	// 	this.http.post("https://woodyfyp.000webhostapp.com/server_api/proses-api.php",body)
  //        .subscribe( async response => {
	// 		for(let customer of response['result']){
	// 				this.customers.push(customer);
	// 				}
	// 		 	resolve(true);
	// 		console.log(response);

	// 	 });

  // 		// this.postPvdr.postData(body, 'proses-api.php').subscribe(data => {
  // 		// 	for(let customer of data.result){
  // 		// 		this.customers.push(customer);
  // 		// 	}
  // 		// 	resolve(true);
  // 		// });
  // 	});
  // }
  loadGorC(){
 
    let body =JSON.stringify({
            aksi : 'getgorc',
            user_id: this.userId,          
          });
          console.log("body: " +body)
    this.http.post("https://woodyfyp.000webhostapp.com/server_api/receiver-api.php",body)
    .subscribe(async response => {
      this.gorcs=[];
      if(response['total']>0){
        for(let gorc of response['data']){
          if(gorc.section_total<=0){
            gorc.cal="No section";
            gorc.calDigit =0;
          }else if(gorc.atten_time<=0){
            gorc.cal="0%";
            gorc.calDigit =0;
          }else {
            gorc.cal=Math.round(gorc.atten_time/gorc.section_total*100)+"%";
            gorc.calDigit =gorc.atten_time/gorc.section_total;
          }
          this.gorcs.push(gorc);
        }   
        
      }else{
        alert("you do not have any register Course yet")
      }
      
     console.log(response);
     console.log(this.gorcs);
    });


  }
  doRefresh(event){
  	setTimeout(() =>{
    //do something here
    this.loadGorC();
  		event.target.complete();
  	}, 500);
  }
  // loadData(event:any){
  // 	this.start += this.limit;
  // 	setTimeout(() =>{
  // 	this.loadCustomer().then(()=>{
  // 		event.target.complete();
  // 	});
  // 	}, 500);
  // }
  async prosesLogout(){
    this.storage.clear();
    this.router.navigate(['/login']);
    const toast = await this.toastCtrl.create({
        message: 'logout succesful',
        duration: 3000
      });
    toast.present()
  }
  viewPercentageDetl(courseid:string,chargerid:string,percentage:any,percentageStr:any){
        this.router.navigate(['/show-percentage'+'/'+courseid+'/'+chargerid+'/'+percentage+'/'+percentageStr]);
  }

  bioAuthen(){
    this.anFinAutho.isAvailable().then((result)=>{
      if(result.isAvailable){
        this.anFinAutho.encrypt({
          clientId:this.userId,
          username:this.username,
          password:this.password,
          disableBackup:true,
          userAuthRequired:true
        }).then((result)=>{
          if(result.withFingerprint){
              //alert("successfully encrypted credencial ")
              console.log("successfully encrypted credencial");
              console.log(result);
              console.log("encrypted credencial: "+result.token);
              this.router.navigate(['/scanner']);
          }else if(result.withBackup){
            alert("successfully authenticated with backup password")
          }else{
            alert("did not authenticated")}

        },(err)=>{
          if(err== this.anFinAutho.ERRORS.FINGERPRINT_CANCELLED){
            alert("fingerprint authenticated cancelled")
          }else if(err== this.anFinAutho.ERRORS.INIT_CIPHER_FAILED){
            alert('Finger Print On you device has been changed');
            alert('Account in this device will be de-registered')
            this.storage.clear();
            navigator['app'].exitApp();
          }else{
            alert(JSON.stringify(err))
            console.log(err)
            console.log(JSON.stringify(err))
          }
        })
      }else{
        alert("You should add Your fingerprint authentication")
      }
  });
  }

  getUID(){
    this.storageService.get('UniqueDeviceID').then(result => {
      if (result != null) {
      this.deviceID = result;
     // alert("customerPage: "+this.deviceID);
      this.checkMobile(); 
      }
      }).catch(e => {
      console.log('error: '+ e);
      });
  }
}
