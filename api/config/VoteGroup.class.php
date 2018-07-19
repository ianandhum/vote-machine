<?php

//high level class structure for managing votes 
require_once('config.php');


Class VoteGroup{
    private static $dbConn=null;
    
    private $vote=array();
    private $isFresh=false;
    private $candidate_id='';
    public static $ADDNEW=-1;
    private static $required=array(
        "candidate_id","class"
    );
    public function __construct($candidate_id,$class="")
    {
        
        $db=new DB(DB_NAME);
        self::$dbConn=$db->dbConnection();
        if(VoteGroup::$ADDNEW===$candidate_id){
            $this->isFresh=true;
        }
        else{
            $this->candidate_id=$candidate_id;
            $this->vote['class']=$class;
            $this->syncData();
        }
       
    }

    private function syncData(){
        $dataHandle=self::$dbConn->prepare("SELECT * FROM tbl_vote WHERE candidate_id=:pid AND class=:cls");
        $dataHandle->bindparam(':pid',$this->candidate_id);
        $dataHandle->bindparam(":cls",$this->vote['class']);
        try{
            $dataHandle->execute();
            $this->vote=$dataHandle->fetch(PDO::FETCH_ASSOC);
        }
        catch(\Exception $e){

        } 
    }
    
    public function commit()
    {   

        if($this->isFresh){
            foreach (explode(',',STANDARDS) as $i => $std) {
                $this->vote['class']=$std;
                $this->newEntry();
            }
                
        }
        else{
           return $this->updateEntry();
        }
    }
    private function updateEntry(){
        
            
            $query="UPDATE `tbl_vote` SET `votes` = :votes  WHERE `candidate_id`=:pid AND `class`=:cls";
            $dataHandle=self::$dbConn->prepare($query);            
            $dataArray=array(":pid"=>$this->candidate_id,":votes"=>$this->vote['votes'],":cls"=>$this->vote['class']);
            
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
    private function newEntry()
    {
            
            if(!$this->validate()){
                return false;
            }
            //die($bindArray);
            $query="INSERT INTO  tbl_vote( candidate_id,class,votes ) VALUES( :cid , :cls , 0 ) ";
            $dataHandle=self::$dbConn->prepare($query);
           
            //die(json_encode(array_merge(array($query),$dataArray)));
            try{
                if($dataHandle->execute(array(":cid"=>$this->vote['candidate_id'],":cls"=>$this->vote['class']))){
                    return true;
                }   
            }
            catch(\Exception $e){
                return $e->getMessage();
                
            }
            return false;

    }
    public function validate()
    {
        $data=array();
        foreach($this->vote as $key => $value){
            $data[$key]=(strip_tags($this->vote[$key]));
        }

        foreach(self::$required as $key){
            if(@empty($data[$key])){
                echo $key,$data[$key];
                return false;
            }
        }
        $this->vote=$data;
        return true;

    }
    public function setData($vote){
        if(!is_array($vote)){
            return false;
        }
        $this->vote=$vote;
        //return $this->vote;

    }
    public function remove(){
        $query="DELETE  FROM tbl_vote  WHERE candidate_id=:pid";
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



    
    
    public function setVotes($data){
       
        $this->vote['votes']=$data;
    }
    public function setClass($data){
       
        $this->vote['class']=$data;
    }
  
    public function getData(){
        return $this->vote;
    }
   
   
    public function getVotes(){
        return $this->vote['votes'];
        
    } 
    public function getClass(){
        return $this->vote['class'];
        
    }  
    
};
?>
