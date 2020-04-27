<?php

  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
  header("Content-Type: application/json; charset=utf-8");

    include "library/config.php";

    if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
    } 
    $postjson = json_decode(file_get_contents('php://input'),true);
    
   // $today = date('y-m-d');

   if($postjson['aksi']=='add'){

  	$query = mysqli_query($mysqli, "INSERT INTO receiver_user SET
  		name_customer = '$postjson[name_customer]',
  		dec_customer = '$postjson[desc_customer]',
      user_type     ='1'
  	");

  //	$idcust = mysqli_insert_id($mysqli);

  	if($query) $result = json_encode(array('success'=>true, $mysqli -> insert_id));
  	else $result = json_encode(array('success'=>false));

  	echo $result;

  }
  elseif($postjson['aksi']=='getdata'){
  	$data = array();
  	$query = mysqli_query($mysqli, "SELECT * FROM receiver_user ORDER BY customer_id DESC LIMIT $postjson[start],$postjson[limit]");

  	while($row = mysqli_fetch_array($query)){

  		$data[] = array(
  			'customer_id' => $row['customer_id'],
  			'name_customer' => $row['name_customer'],
  			'desc_customer' => $row['dec_customer'],
        'created_at' => $row['created_at'],       
  		);
  	}

  	if($query) $result = json_encode(array('success'=>true, 'result'=>$data));
  	else $result = json_encode(array('success'=>false));

  	echo $result;

  }

  elseif($postjson['aksi']=='update'){
  	$query = mysqli_query($mysqli, "UPDATE receiver_user SET 
  		name_customer='$postjson[name_customer]',
  		dec_customer='$postjson[desc_customer]' WHERE customer_id='$postjson[customer_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }
  elseif($postjson['aksi']=='delete'){
  	$query = mysqli_query($mysqli, "DELETE FROM receiver_user WHERE customer_id='$postjson[customer_id]'");

  	if($query) $result = json_encode(array('success'=>true, 'result'=>'success'));
  	else $result = json_encode(array('success'=>false, 'result'=>'error'));

  	echo $result;

  }  
  elseif($postjson['aksi']=="login"){
    $password = md5($postjson['password']);
    $query = mysqli_query($mysqli, "SELECT * FROM master_user WHERE
      username = '$postjson[username]'AND
      password = '$password'");

    $check = mysqli_num_rows($query);

    if($check>0){
      $data = mysqli_fetch_array($query);
      $datauser = array(
        'user_id' => $data['user_id'],
        'username' => $data['username'],
        'datatype' => $data['type']
      );
      if($data['status']=='y'){
        $result = json_encode(array('success'=>true, 'result'=>$datauser)); 
      }else{
        $result = json_encode(array('success'=>false, 'msg'=>'Account Inactive')); 
      }
    }else{
      $result = json_encode(array('success'=>false, 'msg'=>'Wrong Password or User Name'));
    }     
  echo $result;
  }
elseif($postjson['aksi']=="register"){
    $password = md5($postjson['password']);
    $query = mysqli_query($mysqli, "INSERT INTO master_user SET
      username = '$postjson[username]',
      password = '$password',
      status   = 'y',
      type     = '1'
    ");

    if($query) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false, 'msg'=>'error, please try again'));

    echo $result;
}
elseif($postjson['aksi']=="getSections"){
    $data = array();
    $query = mysqli_query($mysqli, "SELECT * FROM section
    WHERE GorC_id='$postjson[courseId]'
    AND GorC_charger_id = '$postjson[chargerId]'
    ");

  $check = mysqli_num_rows($query);
  if($query) {
    if($check>0){
    
      mysqli_query($mysqli, "UPDATE GorC SET
      section_total = $check WHERE GorC_id='$postjson[courseId]' AND GorC_charger_id = '$postjson[chargerId]'");

      while($row = mysqli_fetch_array($query)){
        $data[]= array(
          'section_id' => $row['section_id'],
          'section' => $row['section_name'],
          'create_at' => $row['create_at'],
          'GorC_charger_id' => $row['GorC_charger_id'],
          'GorC_id' => $row['GorC_id']
        );
      }     
      
      }else{
        $data = array(
          'GorC_charger_id' => $postjson['chargerId'],
          'GorC_id' => $postjson['courseId']
        );
      }
    $result = json_encode(array('success'=>true,'rowNum'=>$check,'result'=>$data));	
  }else{ 
    $result = json_encode(array('success'=>false, 'msg'=>'error, can not get section from database'));
  }   
      echo $result;      
}
elseif($postjson['aksi']=="addSection"){
    $query = mysqli_query($mysqli, "INSERT INTO section SET
    section_name = '$postjson[secctionName]',
    GorC_charger_id = '$postjson[chargerId]',
    GorC_id = '$postjson[courseId]'
    ");

    $query2 = mysqli_query($mysqli, "UPDATE GorC SET 
     section_total='$postjson[sectionTotal]'
        WHERE GorC_charger_id = '$postjson[chargerId]'
        AND GorC_id = '$postjson[courseId]'
    ");

    $data = array(
      'secctionName' => $postjson['secctionName'],
      'chargerId' => $postjson['chargerId'],
      'courseId' => $postjson['courseId']
    );

  
  if($query2) $result =json_encode(array('success'=>true, 'result'=>$data));

  else $result = json_encode(array('success'=>false,'result'=>$data, 'msg'=>'error, can not get section from database')); 

  echo $result;      
}elseif($postjson['aksi']=="manageCourse"){
  $query = mysqli_query($mysqli, "SELECT * FROM GorC");

  $dataCourse = array();

           while($row = mysqli_fetch_array($query)){
            $dataCourse[]= array(
              'GorC_id' => $row['GorC_id'],
              'GorC_charger_id' => $row['GorC_charger_id'],
              'GorC_name' => $row['GorC_name'],
              'GorC_description' => $row['GorC_description']
            );
          }

if($query) $result =json_encode(array('success'=>true, 'result'=>$dataCourse));
else $result = json_encode(array('success'=>false,'result'=>$data, 'msg'=>'error, can not get course')); 

echo $result;      

}else if($postjson['aksi']=="loadCourse"){
    $userId = $postjson['userID'];
    $userName = $postjson['userName'];

  $query = mysqli_query($mysqli, "SELECT * FROM GorC
    WHERE GorC_charger_id='$userId'");

    $dataCourse = array();
     while($row = mysqli_fetch_array($query)){
      $dataCourse[]= array(
        'GorC_id' => $row['GorC_id'],
        'GorC_charger_id' => $row['GorC_charger_id'],
        'GorC_name' => $row['GorC_name'],
        'GorC_description' => $row['GorC_description'],
        'section_total'=>$row['section_total']
      );
    }
    if($query) { 
      $datauser = array(
        'user_id' => $userId,
        'username' => $userName,
        'datacourse' =>$dataCourse
      );
    $result = json_encode(array('success'=>true, 'result'=>$datauser));
    }else{
      $result = json_encode(array('success'=>false, 'msg'=>'cannot get course'));
    }
    echo $result; 

}elseif($postjson['aksi']=="getCourseByCourseID"){
  $query = mysqli_query($mysqli, "SELECT * FROM GorC 
          WHERE GorC_id='$postjson[courseId]'");

  $check = mysqli_num_rows($query);
  $dataCourse = array();
  if($check>0){
    while($row = mysqli_fetch_array($query)){
      $dataCourse[]= array(
        'GorC_id' => $row['GorC_id'],
        'GorC_charger_id' => $row['GorC_charger_id'],
        'GorC_name' => $row['GorC_name'],
        'GorC_description' => $row['GorC_description']
        
      );
    }
    $result =json_encode(array('success'=>true,'rowNum'=> $check, 'result'=>$dataCourse));
  }else{
    $result = json_encode(array('success'=>false,'rowNum'=> $check,'msg'=>'error, can not get course')); 
  }

echo $result;  


}elseif($postjson['aksi']=="getCourseByChargerID"){
  
  $datatemp = $postjson['chargerId'];

  $query = mysqli_query($mysqli, "SELECT * FROM GorC
    WHERE GorC_charger_id='$datatemp'");

    $dataCourse = array();
     while($row = mysqli_fetch_array($query)){
      $dataCourse[]= array(
        'GorC_id' => $row['GorC_id'],
        'GorC_charger_id' => $row['GorC_charger_id'],
        'GorC_name' => $row['GorC_name'],
        'GorC_description' => $row['GorC_description'],
        'section_total'=>$row['section_total']
      );
    }
    //In order to align with the format of <login> 
    $datatemp=array(
      'datacourse' =>$dataCourse
    );

   if($query) $result =json_encode(array('success'=>true, 'result'=>$datatemp));
    else $result =json_encode(array('success'=>false,'msg'=>'cannot get course by charger id'));
    echo $result;

}elseif($postjson['aksi']=="addCourse"){

  $query = mysqli_query($mysqli, "INSERT INTO GorC SET
      GorC_id = '$postjson[courseId]',
      GorC_charger_id = '$postjson[courseChargerId]',
      GorC_name   = '$postjson[courseName]',
      GorC_description     = '$postjson[courseDesc]'
    ");

    $data = array(
      'chargerId' => $postjson['courseChargerId'],
      'courseId' => $postjson['courseId']
    );

    if($query)$result =json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false,'msg'=>'error!! Can not get course')); 
   
    echo $result;  

}elseif($postjson['aksi']=="modifyCourse"){

      $query = mysqli_query($mysqli, "UPDATE GorC SET
      GorC_id = '$postjson[courseId]',
      GorC_charger_id = '$postjson[courseChargerId]',
      GorC_name   = '$postjson[courseName]',
      GorC_description     = '$postjson[courseDesc]'
      WHERE GorC_id = '$postjson[courseId]'
      AND GorC_charger_id = '$postjson[courseChargerId]'
    ");

    $data = array(
      'courseId' => $postjson['courseId'],
      'courseChargerId' => $postjson['courseChargerId'],
      'courseName' => $postjson['courseName'],
      'courseDesc' => $postjson['courseDesc']
    );

    if($query) $result =json_encode(array('success'=>true, 'result'=>$data));
    else $result = json_encode(array('success'=>false,'msg'=>'error!! Can not update course'));
    echo $result;  

}elseif($postjson['aksi']=="addParticipant"){
  
  $arr = json_decode($postjson['participantArray']);
  $arrLength = count($arr);
  $sql = "INSERT INTO participant (GorC_id,participant_id,GorC_charger_id) VALUES";
      
        for ($i =0; $i<$arrLength; $i++){          
         $sql .= "('$postjson[courseId]','$arr[$i]','$postjson[courseChargerId]')";
         if($i<$arrLength-1){
          $sql .=",";
         }
        }

    $query = mysqli_query($mysqli, $sql);
       
    if($query) $result =json_encode(array('success'=>true, 'result'=>$sql,'length'=>$arrLength));
    else  $result = json_encode(array('success'=>false,'msg'=>'error!! Can not Add Participant'));

    echo $result;  
}elseif($postjson['aksi']=="getParticipant"){
  
  $query = mysqli_query($mysqli, "SELECT * FROM participant 
  WHERE GorC_id='$postjson[courseId]'
  AND GorC_charger_id = '$postjson[chargerId]'
  ");


  $check = mysqli_num_rows($query);
  $data = array();
  if($check>0){
      while($row = mysqli_fetch_array($query)){
          $data[]= array(
          'GorC_id' => $row['GorC_id'],
          'GorC_charger_id' => $row['GorC_charger_id'],
          'participant_id' => $row['participant_id'],
          'id' =>$row['id'],
          'atten_time'=>$row['atten_time']
      );}
      $result =json_encode(array('success'=>true,'rowNum'=> $check, 'result'=>$data));
   }else{
      $result = json_encode(array('success'=>false,'rowNum'=> $check,'msg'=>'error, can not get course')); 
   }
       
    echo $result;  
}

?>