<?php

//high level class structure for managing candidates 
require_once('config.php');


Class Candidate{
    private static $dbConn=null;
    
    private $candidate=array();
    private $isFresh=false;
    private $candidate_id='';
    public static $ADDNEW=1;
    private static $required=array(
        "candidate_id","candidate_name","candidate_desc","candidate_thumb","candidate_type","candidate_post"
    );
    public function __construct($candidate_id)
    {
        
        $db=new DB(DB_NAME);
        self::$dbConn=$db->dbConnection();
        if(Candidate::$ADDNEW===$candidate_id){
            $this->isFresh=true;
        }
        else{
            $this->candidate_id=$candidate_id;
            $this->syncData();
        }
       
    }

    private function syncData(){
        $dataHandle=self::$dbConn->prepare("SELECT * FROM tbl_data WHERE candidate_id=:pid");
        $dataHandle->bindparam(':pid',$this->candidate_id);
        try{
            $dataHandle->execute();
            $this->candidate=$dataHandle->fetch(PDO::FETCH_ASSOC);
        }
        catch(\Exception $e){

        } 
    }
    
    public function commit()
    {   

        if($this->isFresh){
            $bindArray="  ";
            $count=0;
            if(!$this->validate()){
                return false;
            }
            foreach($this->candidate  as $item =>$data){
                if($count>0){
                    $bindArray.=" , ";
                }
                $bindArray.=  ":".$item;
                $count++;
            }
            //die($bindArray);
            $query="INSERT INTO  tbl_data VALUES( $bindArray , 0 , CURRENT_TIMESTAMP ) ";
            $dataHandle=self::$dbConn->prepare($query);
           foreach($this->candidate as $item => $data)
            {   
                $dataArray[":".$item]=$data;
            }

            //die(json_encode(array_merge(array($query),$dataArray)));
            try{
                if($dataHandle->execute($dataArray)){
                    return true;
                }   
            }
            catch(\Exception $e){
                return $e->getMessage();
                
            }
            return false;

        }
        else{
            $bindArray="  ";
            $count=0;
    
            foreach($this->candidate  as $item =>$data){
                if($count>0){
                    $bindArray.=" , ";
                }
                $bindArray.=  $item ." = :".$item;
                $count++;
            }
            //die($bindArray);
            $query="UPDATE tbl_data SET $bindArray , `timestamp`=CURRENT_TIMESTAMP WHERE candidate_id=:pid";
            $dataHandle=self::$dbConn->prepare($query);
            
            $dataArray=array(":pid"=>$this->candidate_id);
           foreach($this->candidate as $item => $data)
            {   
                $dataArray[":".$item]=$data;
            }
            try{
                if($dataHandle->execute($dataArray)){
                    return true;
                }   
            }
            catch(\Exception $e){
                return false;
                
            }
            return false;
        }
    }
    
    public function validate()
    {
        $data=array();
        foreach($this->candidate as $key => $value){
            $data[$key]=(strip_tags($this->candidate[$key]));
        }

        foreach(self::$required as $key){
            if(@empty($data[$key])){
                return false;
            }
        }
        $this->candidate=$data;
        return true;

    }
    public function setData($candidate){
        if(!is_array($candidate)){
            return false;
        }
        $this->candidate=$candidate;
        //return $this->candidate;

    }
    public function remove(){
        $query="DELETE  FROM tbl_data  WHERE candidate_id=:pid";
        $dataHandle=self::$dbConn->prepare($query);
        try{
            if($dataHandle->execute(array(':pid'=>$this->candidate_id))){
                return true;
            }
        }
        catch(\Exception $e){
        }
        
        return false;   
    }



    //getters and setters
    public function setName($data){
       
        $this->candidate['candidate_name']=$data;
    } 
    public function setDesc($data){
       
        $this->candidate['candidate_desc']=$data;
    }
    public function setThumb($data){
       
        $this->candidate['candidate_thumb']=$data;
    }
    public function setType($data){
       
        $this->candidate['candidate_type']=$data;
    }
    public function setPost($data){
       
        $this->candidate['candidate_post']=$data;
    }
    public function setVotes($data){
       
        $this->candidate['votes']=$data;
    }
  
    public function setTimestamp($data){
       
        $this->candidate['timestamp']=$data;
    }
    public function getData(){
        return $this->candidate;
    }
    public function getId(){
        return $this->candidate['candidate_id'];
        
    }
    public function getName(){
        return $this->candidate['candidate_name'];
        
    }

    public function getDesc(){
        return $this->candidate['candidate_desc'];
        
    }

    public function getThumb(){
        return $this->candidate['candidate_thumb'];
        
    }

    public function getType(){
        return $this->candidate['candidate_type'];
        
    }
    public function getPost(){
        return $this->candidate['candidate_post'];
        
    }  
    public function getVotes(){
        return $this->candidate['votes'];
        
    }  
    public function getTimestamp(){
        return $this->candidate['timestamp'];
        
    }
};
?>
