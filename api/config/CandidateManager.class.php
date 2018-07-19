<?php

//DB connection
require_once('config.php');
//require_once('../../vendor/autoload.php');


//CandidateManager for managing all Candidates
//Usage CandidateManager::member()
abstract Class CandidateManager{
    private static $dbConn;
    public static function getCandidate($id){
        $Candidate=new Candidate($id);
        return $Candidate;
    }
    public static function addNew(){
        $Candidate=new Candidate(Candidate::$ADDNEW);
        return $Candidate;
    }
    public static function remove($Candidate_id){
        $Candidate=new Candidate($Candidate_id);
        return $Candidate->remove();
    }
    public static function fetch($pdoMode=PDO::FETCH_ASSOC,$limit="1000",$sort="DESC",$col='timestamp'){
        self::$dbConn=new DB(DB_NAME);
        self::$dbConn=self::$dbConn->dbConnection();
        $query="SELECT * FROM tbl_data ORDER BY `$col` $sort , candidate_id DESC LIMIT $limit";
        $dataHandle=self::$dbConn->prepare($query);
        try{
            $dataHandle->execute();
        }
        catch(\Exception $e){
            return false;
        }
        $result=$dataHandle->fetchAll($pdoMode);
        if($result){
            return $result;
        }
        return false;

    }
    public static function fetchGrouped($pdoMode=PDO::FETCH_ASSOC,$limit="1000",$sort="DESC",$col='candidate_name'){
        self::$dbConn=new DB(DB_NAME);
        self::$dbConn=self::$dbConn->dbConnection();
        $query="SELECT * FROM tbl_vote ORDER BY `class` ASC , `votes` DESC";

        $dataHandle=self::$dbConn->prepare($query);
        try{
            $dataHandle->execute();

        }
        catch(\Exception $e){
            return false;
        }

        $resultIntermediate=$dataHandle->fetchAll($pdoMode);
        $result=array();
        //die(json_encode($resultIntermediate));
        if($resultIntermediate){
            $lastClassName="";
            
            foreach ($resultIntermediate as  $value) {
                //print_r($value);
                //continue;
                if($lastClassName!=$value['class']){
                    $lastClassName=$value['class'];
                    $result[$lastClassName]=array();
                }
                $querySet="SELECT * FROM tbl_data WHERE candidate_id='".$value['candidate_id']."'";

                $dataHandleSet=self::$dbConn->prepare($querySet);
                try{
                    $dataHandleSet->execute();
        
                }
                catch(\Exception $e){
                    return false;
                }
        
                $resultImmediate=$dataHandleSet->fetch($pdoMode);
                $resultImmediate['votes']=$value['votes'];
                $candidateNew=array();
                foreach($resultImmediate as $key => $value){

                    if($key!='candidate_thumb'){
                        if($key=='candidate_desc'){
                            $candidateNew['candidate_desc']=preg_replace("/[\r][\n]/"," ",$value);
                         }
                         else{
                             $candidateNew[$key]=$value;
                         }
                    }
                }
                array_push($result[$lastClassName],$candidateNew);
              
            }
            return $result;
        }
        return false;

    }

    public static function uploadAssets()
    {
        $result=array();
        $options=array(
            "dir"=>__DIR__ ."/". DIR_THUMB,
            'object_name'=>"thumb_img",
            "prefix"=>"thumb_",
            "mimetypes"=>array("image/png","image/jpg","image/jpeg"),
            "size"=>"10M"
          );
        $result['thumb']=CandidateManager::uploadFile($options);
        return $result;

    }
    public static function uploadFile($opt)
    {

        $storage = new \Upload\Storage\FileSystem($opt['dir']);
        try{
            $file = new \Upload\File($opt['object_name'], $storage);
        }
        catch(\Exception $e){

            $data['status']=false;
            return $data;
        }


        $new_filename = uniqid($opt['prefix']);

          $file->setName($new_filename);

        $file->addValidations(array(

            new \Upload\Validation\Mimetype($opt['mimetypes']),

            new \Upload\Validation\Size($opt['size'])
        ));

        $data = array(
            'name'       => $file->getNameWithExtension(),
            'md5'        => $file->getMd5()
        );

        try {
            // Success!
            $file->upload();
            $data['status']=true;
        } catch (\Exception $e) {
            // Fail!
            $errors = $file->getErrors();
            $data['status']=false;
            $data['errorInfo']=$errors;
        }
        return $data;
    }
    public static function getLastID()
    {
        self::$dbConn=new DB(DB_NAME);
        self::$dbConn=self::$dbConn->dbConnection();
        $query="SELECT `candidate_id` FROM tbl_data ORDER BY `timestamp` DESC LIMIT 1";
        $dataHandle=self::$dbConn->prepare($query);
        try{
            $dataHandle->execute();
        }
        catch(\Exception $e){
            return false;
        }
        $result=$dataHandle->fetch(PDO::FETCH_ASSOC);
        if(is_array($result)){
            return explode(CANDIDATE_PREFIX,$result['candidate_id'])[1];
        }
        else{
            return INIT_ID;
        }
    }
    public static function isDupli(string $col,$val)
    {
        self::$dbConn=new DB(DB_NAME);
        self::$dbConn=self::$dbConn->dbConnection();
        $query="SELECT `$col` FROM tbl_data WHERE $col=$val";
        $dataHandle=self::$dbConn->prepare($query);
        try{
            $dataHandle->execute();
        }
        catch(\Exception $e){
            return false;
        }
        $result=$dataHandle->fetchAll(PDO::FETCH_ASSOC);
	      return @count($result);
    }
}
?>
