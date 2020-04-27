import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username: string = "";
  password: string = "";
  confirm_password: string = "";

  constructor(private router: Router,
  	private postPvdr: PostProvider,
    private storage: Storage,
    public toastCtrl: ToastController,
    public http   : HttpClient,
  
    ) { }

  ngOnInit() {
  }
  formLogin(){
  	this.router.navigate(['/login']);
  }

  async prosesRegister(){
    if (this.username==""){
      
        const toast = await this.toastCtrl.create({
          message: 'username is required',
          duration: 2000
        });
        toast.present();
    }else if (this.password==""){
      const toast = await this.toastCtrl.create({
        message: 'password is required',
        duration: 2000
      });
      toast.present();
    }else if (this.password != this.confirm_password){
      const toast = await this.toastCtrl.create({
        message: 'password is invalid ',
        duration: 2000
      });
      toast.present();
    }else{
   
      let body =JSON.stringify({
        username: this.username,
        password: this.password,
        aksi: 'register'
        });

        this.http.post("https://woodyfyp.000webhostapp.com/server_api/proses-api.php",body)
        .subscribe(async response => {
          //Here your code
          // 'response' is json
          console.log(response)
          console.log(response['success'])
         
          
          if(response['success']==true){           
            const toast = await this.toastCtrl.create({
                   message: 'regester success',
                    duration: 2000
                  });
                 toast.present();
              this.router.navigate(['/login']);
          }else{
            const toast = await this.toastCtrl.create({
                    message: "wait for debug",
                  duration: 2000
                   });
                   toast.present(); 

          }
         
        });

      // this.postPvdr.postData(body, 'proses-api.php').subscribe(async data =>{
     
      //   var alertmsg = data.msg;
      //   if(data.success){
      //     this.router.navigate(['/login']);
      //     const toast = await this.toastCtrl.create({
      //       message: 'regester success',
      //       duration: 2000
      //     });
      //     toast.present();
      //   }else{
          
      //     const toast = await this.toastCtrl.create({
      //       message: alertmsg,
      //       duration: 2000
      //     });
      //     toast.present(); 
      //   }
      // });
    }
  }
}
