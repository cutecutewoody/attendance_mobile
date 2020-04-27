import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router ,ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-show-percentage',
  templateUrl: './show-percentage.page.html',
  styleUrls: ['./show-percentage.page.scss'],
})
export class ShowPercentagePage implements OnInit {
  username: string;
  userId : string;
  courseID:string;
  chargerID:string;
  percentageStr:string;
  percentage:any;
  attenRecords: any;

  constructor(
    private router: Router,
    private storage: Storage,
    private actRoute: ActivatedRoute,
    public http   : HttpClient,
  ) { }

  ngOnInit() {

    this.storage.get('session_storage').then((res)=>{
      
      this.username = res.username;
      this.userId = res.user_id;   
      console.log(res);

      this.actRoute.params.subscribe((res: any) =>{
        this.courseID = res.courseid;
        this.chargerID = res.chargerid;
        this.percentage = res.percentage;
        this.percentageStr = res.percentageStr;
       this.loadRecord()
       });
      });  
  }


  loadRecord(){
      let body =JSON.stringify({
        aksi      :'viewPercentD',
        user_id   :this.userId, 
        course_id :this.courseID,
        charger_id:this.chargerID
      });
  console.log("body: " +body)
  this.http.post("https://woodyfyp.000webhostapp.com/server_api/receiver-api.php",body)
            .subscribe(async response => {
              this.attenRecords = response['data'];
              for(let record of this.attenRecords){
                if(record['take_index']!=null){  

                  record.imgsrc = 'assets/icon/green_circle.png'
                }else{
                  record.imgsrc = 'assets/icon/red_circle.png'
                }
              }
              
              console.log(response);
  });
  }




}
