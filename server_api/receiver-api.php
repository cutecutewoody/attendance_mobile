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

///////////////////////////////////////////


if($postjson['aksi']=="login"){
    
    $query = mysqli_query($mysqli, "SELECT * FROM receiver_user WHERE
      user_id = '$postjson[user_id]'AND
      password = '$postjson[password]'
      ");

    $check = mysqli_num_rows($query);
    if($check>0){
      $data = mysqli_fetch_array($query);

      if($data['is_valid_user']==1){
        $datauser = array(
          'user_id' => $data['user_id'],
          'username' => $data['username'],
          'bind_index' => $data['bind_index'],
          'bind_count' => $data['bind_count'],
          'bind_device' => $data['bind_device'],
          'password' => $data['password'],
          'is_valid_user' => $data['is_valid_user'],
          'is_valid_description' => $data['is_valid_description']
        );
      $result = json_encode(array('success'=>true, 'data'=>$datauser));
      }else{
         $datauser = array(
           'is_valid_user' => $data['is_valid_user'],
           'is_valid_description' => $data['is_valid_description']
         );
         $result = json_encode(array('success'=>false, 'data'=>$datauser));
      }  
    }else{
      $result = json_encode(array('success'=>false, 'msg'=>'Account Inactive'));
    }
  echo $result;


}else if($postjson['aksi']=="getUserInfo"){
  $query = mysqli_query($mysqli, "SELECT * FROM receiver_user WHERE
  user_id = '$postjson[user_id]'
  ");
  $check = mysqli_num_rows($query);
if($check>0){
  $data = mysqli_fetch_array($query);
    $datauser = array(
      'user_id' => $data['user_id'],
      'username' => $data['username'],
      'bind_index' => $data['bind_index'],
      'bind_count' => $data['bind_count'],
      'bind_device' => $data['bind_device'],
      'password' => $data['password'],
      'is_valid_user' => $data['is_valid_user'],
      'is_valid_description' => $data['is_valid_description']
    );
  $result = json_encode(array('success'=>true, 'data'=>$datauser));
  
}else{
  $result = json_encode(array('success'=>false, 'msg'=>'CAN_NOT_GET_INFO'));
}
echo $result;

}else if($postjson['aksi']=="registerDevice"){
  $regSuccess = false;
  if($postjson['bind_count']<=5){
    
    $query = mysqli_query($mysqli, "UPDATE receiver_user SET 
          bind_count='$postjson[bind_count]',
          bind_device='$postjson[bind_device]',
          bind_index = '$postjson[bind_index]'
        WHERE user_id='$postjson[user_id]'");
        $regSuccess = true;

  }else{
    $query = mysqli_query($mysqli, "UPDATE receiver_user SET 
        bind_count='$postjson[bind_count]',
        bind_device='0',
        bind_index = '0',
        is_valid_user = '0',
        is_valid_description= 'NOT VALID USER! EXECCEED MAX OF DEVICED BINDDING'
    WHERE user_id='$postjson[user_id]'");
       $regSuccess = false;
  }
    if($query) $result = json_encode(array('success'=>true,'regSuccess'=>$regSuccess));
    else $result = json_encode(array('success'=>false, 'result'=>'error'));

  echo $result;
  }else if($postjson['aksi']=="getgorc"){

      $query = mysqli_query($mysqli, "SELECT DISTINCT participant.*,GorC.section_total 
      FROM participant 
      LEFT JOIN GorC 
      ON GorC.GorC_id= participant.GorC_id 
      AND GorC.GorC_charger_id= participant.GorC_charger_id
      WHERE
      participant.participant_id = '$postjson[user_id]'
      ");


    $check = mysqli_num_rows($query);
    if($check>0){
     
      while($data = mysqli_fetch_array($query)){
        $gorcs[]= array(
        'GorC_id' => $data['GorC_id'],
        'GorC_charger_id'=>$data['GorC_charger_id'],
        'atten_time' => $data['atten_time'],
        'id' => $data['id'],
        'section_total' => $data['section_total'],
        );
      }
       $result = json_encode(array('success'=>true, 'data'=>$gorcs,'total'=>$check));
      }else{
        $result = json_encode(array('success'=>true, 'total'=>$check));
      }
  
  echo $result;


  }else if($postjson['aksi']=="takeAttendance"){


    $query = mysqli_query($mysqli, "SELECT * FROM attendance_record
    WHERE user_id = '$postjson[userId]' 
    AND section_id = '$postjson[sectionId]' 
     ");
    $check = mysqli_num_rows($query);
    if($check>0){
      $query = mysqli_query($mysqli, "UPDATE attendance_record SET 
          take_index='1'
        WHERE user_id='$postjson[userId]' 
        AND   section_id='$postjson[sectionId]'
        ");
        if($query) $result = json_encode(array('success'=>true));
        else $result = json_encode(array('success'=>false));
    }else{
      $query = mysqli_query($mysqli, "INSERT INTO attendance_record SET
  		user_id     = '$postjson[userId]',
  		section_id  = '$postjson[sectionId]',
      GorC_id     = '$postjson[courseId]',
      take_index  ='1'
    ");
     if($query ){
      $query2 = mysqli_query($mysqli, "UPDATE participant SET
      atten_time = atten_time+1
      WHERE GorC_id='$postjson[courseId]' 
      AND GorC_charger_id='$postjson[courseCharger]' 
      AND participant_id='$postjson[userId]'
    ");} 
    
   if($query2) $result = json_encode(array('success'=>true));
   else $result = json_encode(array('success'=>false));
  }
    echo $result;
  }else if ($postjson['aksi']=="untakeAttendance"){

    $query = mysqli_query($mysqli, "DELETE FROM attendance_record WHERE
  		user_id     = '$postjson[userId]' AND
  		section_id  = '$postjson[sectionId]'
    ");
      if($query){
          $query2 = mysqli_query($mysqli, "UPDATE participant SET
          atten_time = atten_time-1
          WHERE GorC_id='$postjson[courseId]' 
          AND GorC_charger_id='$postjson[courseCharger]' 
          AND participant_id='$postjson[userId]'
        ");
     }
       
    if($query2) $result = json_encode(array('success'=>true));
    else $result = json_encode(array('success'=>false));

    echo $result;
  }else if($postjson['aksi']=="updateAttenTime"){

  $query = mysqli_query($mysqli, "SELECT * FROM attendance_record
    WHERE user_id = '$postjson[userId]' 
    AND GorC_id = '$postjson[GorC_id]' 
    AND GorC_charger_id = '$postjson[GorC_charger_id]'
     ");
    $check = mysqli_num_rows($query);

    if($query) $result = json_encode(array('success'=>true,'num'=>$check));
   else $result = json_encode(array('success'=>false));

   echo $result;
  }else if ($postjson['aksi']=="viewPercentD"){

    $courseId = $postjson['course_id'];
    $chargerId = $postjson['charger_id'];
    $userId = $postjson['user_id'];

    $query = mysqli_query($mysqli, "SELECT DISTINCT section.*,attendance_record.take_index,attendance_record.user_id
    FROM section 
    LEFT OUTER JOIN attendance_record 
    ON section.section_id= attendance_record.section_id
    AND (attendance_record.user_id ='$userId' OR attendance_record.user_id IS null)
    WHERE
    section.GorC_charger_id = '$chargerId' AND section.GorC_id= '$courseId'
    
    ");


    $check = mysqli_num_rows($query);
        if($check>0){
        
          while($data = mysqli_fetch_array($query)){
            $record[]= array(
            'section_id' => $data['section_id'],
            'section_name'=>$data['section_name'],
            'GorC_charger_id' => $data['GorC_charger_id'],
            'GorC_id' => $data['GorC_id'],
            'take_index' => $data['take_index'],
            );
          }
          $result = json_encode(array('success'=>true, 'data'=>$record,'total'=>$check));
          }else{
            $result = json_encode(array('success'=>true, 'total'=>$check));
          }
    echo $result;
  }

?>