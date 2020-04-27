<?Php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

$postjson = json_decode(file_get_contents('php://input'),true);
    
   if($postjson['aksi']=='refreshclock'){

      date_default_timezone_set('Asia/Hong_Kong');
      $nowtime = mktime(date("h"),date("i"),date("s"),date("m"),date("d"),date("y"));
      $displayNowtime = date("M-d-Y h:i:sa",$nowtime);
      $result = json_encode(array('success'=>true, 'nowtime'=>$nowtime,'showtime'=>$displayNowtime));
      echo $result;

  }else if($postjson['aksi']=='checkClock'){
      $timestamp = $postjson['timestamp'];

      date_default_timezone_set('Asia/Hong_Kong');
      $nowtime = mktime(date("h"),date("i"),date("s"),date("m"),date("d"),date("y"));
      $displayNowtime = date("M-d-Y h:i:sa",$nowtime);
      if($nowtime-$timestamp<=11){
        $result = json_encode(array('success'=>true));
      }else{
        $result = json_encode(array('success'=>false,'msg'=>'Not In time'));
      }
    echo $result;


  }

?>