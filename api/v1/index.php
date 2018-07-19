<?php

   require_once('../vendor/autoload.php');
   require_once('../config/User.class.php');
   require_once('../config/Candidate.class.php');
   require_once('../config/VoteGroup.class.php');
   require_once('../config/CandidateManager.class.php');

    //Security Authentication

    //DISABLED due to BUG
   /*


   if(!isset($_SESSION['sess_token']))
   {
        ob_clean();
        header("HTTP/1.1 403 Permission Denied");
        header("Content-Type: application/json");
         $json=array();
        $json['status']=false;
        $json['session']=$_SESSION;
        $json['reason']="You dont have the permission to address this request";
        die(json_encode($json));
    }

    */

   //global  variales

   function CORS(){
        // Allow from any origin
        //NOTE :: SEVERE SECURITY ISSUE BUT ALLOWED FOR PROPER FUNCTIONING
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
        }
   }



   //Slim REST API

   use Psr\Http\Message\ServerRequestInterface  as Request;

   use Psr\Http\Message\ResponseInterface as Response;

   $app=new Slim\App();

      ////
     ////
    ////     Routes
   ////


     //-----///
    //Standard user Routes
   //-----///


   // entry path to api
   $app->get("/",function(Request $req,Response $res,$args){

      $json=array();
      $json['type']="API";
      $json['methodology']="REST";
      $json['app_name']=APP_NAME;
      $json['home']=SERVER_HOME;
      return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
    });


   // get indiviual candidate details with candidateId
   $app->get("/candidate/{id}",function(Request $req,Response $res,$args){
    $admin=new User();
    $json=array();
    if($admin->isLoggedIn()){
        $json['status']=true;
        $candidate=CandidateManager::getCandidate($args['id']);
        if($candidate==null)exit;
        $candidateData=$candidate->getData();
        $candidateNew=array();
        foreach($candidateData as $key => $value){

            if($key!='candidate_thumb'){
                if($key=='candidate_desc'){
                    $candidateNew['candidate_desc']=preg_replace("/[\r][\n]/"," ",$value);
                }
                else{
                    $candidateNew[$key]=$value;
                }

            }
            $candidate=new Candidate($args['id']);
            $json['data']=$candidateNew;
        }
    }
    else{
        $json['status']=false;
        $json['data']="Permission Denied";
    }

    CORS();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
    });


     //get all candidates based on the limit
    //BUGGY: INCOMPLETE
    $app->get("/candidates/{lim}",function(Request $req,Response $res,$args){
        $admin=new User();
        $json=array();
        if($admin->isLoggedIn() ){
        $limit="";
        if($args['lim']=="all" ||  $args['lim']==null){
            $limit="1000";
         }
         else{
            // TODO or BUG :: make range of rows accessible
           //         eg:1,3 - meaning rows 1 to 3
          //         modifiy regexp to do that
         //         in this stage it cries that attack stopped
             if(preg_match("(^[0-9]+$)",$args['lim'])){
               $limit=$args['lim'];
             }
           else{
                 header("Content-Type:application/json");
                 die(
                   json_encode(
                        array(
                            'status'=>false,
                           'data'=>"Invalid range"
                            )
                    )
                );
             }
         }
       $json['status']=true;
       $json['data']=array();
       $resData=CandidateManager::fetch(PDO::FETCH_ASSOC,$limit,"ASC","candidate_name");
       foreach ($resData as $candidateData){
            $candidateNew=array();
            foreach($candidateData as $key => $value){

                if($key!='candidate_thumb'){
                    if($key=='candidate_desc'){
                        $candidateNew['candidate_desc']=preg_replace("/[\r][\n]/"," ",$value);
                     }
                     else{
                         $candidateNew[$key]=$value;
                     }
                }
            }
            array_push($json['data'],$candidateNew);
       }
    }
    else{
        $json['status']=false;
        $json['data']="permission denied";

    }

    CORS();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
});

$app->get("/candidates/{lim}/sorted",function(Request $req,Response $res,$args){
    $admin=new User();
    $json=array();
    if($admin->isLoggedIn() ){
    $limit="";
    if($args['lim']=="all" ||  $args['lim']==null){
        $limit="1000";
     }
     else{
        // TODO or BUG :: make range of rows accessible
       //         eg:1,3 - meaning rows 1 to 3
      //         modifiy regexp to do that
     //         in this stage it cries that attack stopped
         if(preg_match("(^[0-9]+$)",$args['lim'])){
           $limit=$args['lim'];
         }
       else{
             header("Content-Type:application/json");
             die(
               json_encode(
                    array(
                        'status'=>false,
                       'data'=>"Invalid range"
                        )
                )
            );
         }
     }
     $json['status']=true;
     $resData=CandidateManager::fetchGrouped(PDO::FETCH_ASSOC,$limit,"ASC","candidate_name");
     $json['data']=$resData;
   }
   else{
     $json['status']=false;
     $json['data']="permission denied";

   }
   CORS();
   return $res->withHeader('Content-Type','application/json')->write(json_encode($json,true));
  });


    // get thumb image
    $app->get("/thumb/{id}",function(Request $req,Response $res,$args){
        $admin=new User();
        $json=array();
        if($admin->isLoggedIn()){
            $candidate=new Candidate($args['id']);

            $docURI="../config/".DIR_THUMB."/".$candidate->getThumb();
            if(file_exists($docURI) && !is_dir($docURI)){
                ob_clean();
                header("Content-Type:image/png");
                CORS();
                readfile($docURI);
                exit;
            }
            else{
                $json['status']=false;
                $json['data']="Error loading asset";
                CORS();
                return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
            }
        }
        else{
            $json['status']=false;
            $json['data']="permission denied";

        }
        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($json));


    });

    //vote for the candidate with id
    $app->get("/voteup/{id}",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn() && $admin->isNaiveUser()){

            $candidate=CandidateManager::getCandidate($args['id']);
            $newcandidate['votes']=(int)($candidate->getVotes())+1;
            $cVoteGroup=new VoteGroup($candidate->getId(),$admin->getExtra('voteClass','client'));

            $cVoteGroup->setVotes((int)($cVoteGroup->getVotes())+1);

            $candidate->setData($newcandidate);

            $result['status']=$candidate->commit();
            if($result['status']){
                $result['status']=$cVoteGroup->commit();
            }


        }
        else{
            $result['status']=false;
            $result['data']="Permission denied";
        }

        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });

    $app->get("/voteClass/{cls}",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn() && $admin->isStdUser()){

            $clsName = in_array($args['cls'],explode(",",STANDARDS)) ? $args['cls'] : null ;
            if($clsName!=null){
                $result['status']=$admin->setExtra('voteClass',$clsName,'client');
                $result['voteClass']=$clsName;
            }
            else{
                $result['status']=false;
                $result['data']="Invalid Class Name";
            }

        }
        else{
            $result['status']=false;
            $result['data']="Permission denied";
        }
        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));
    });


    $app->get("/voteClass",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn()){
            $result['status']=true;
            $result['voteClass']=$admin->getExtra('voteClass','client');

        }
        else{
            $result['status']=false;
            $result['data']="Permission denied";
        }
        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));
    });


    //Login Routes

    $app->post("/login",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if(!$admin->isLoggedIn() || 1){

            $request=$req->getParsedBody();
            ob_clean();
            CORS();
            if(@$admin->login($request['uname'],$request['upass'])){
                $result['status']=true;

            }
            else{
                $result['status']=false;
                $userData['admin']=$admin->isStdUser();
                $userData['name']=$admin->getUserId();
                $userData['lockState']=$admin->isLocked();
                $result['data']=$admin->lastError;
            }
        }
        else{
            $result['status']=true;
            $result['data']="Already Logged in";
        }

        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });


    $app->get("/login/admin/{id}",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn() && $admin->isStdUser()){
            ob_clean();
            CORS();
            if($admin->login($args['id'],"",true,"DEV_WEB_STD",true)){
                $result['status']=true;
                $result['data']['uname']=$admin->getUserId();
                $result['data']['uid']=$admin->getSessionId();
            }
            else{
                $result['status']=false;
                $result['data']=$admin->lastError;
            }
        }
        else{
            $result['status']=false;
            $result['data']="Permission denied";
        }

        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });
    $app->get("/loginstatus/admin/{id}",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn() && $admin->isStdUser()){
            ob_clean();
            CORS();
            $client=new User(false);
            $client->selectUserByMail($args['id']);
            $result['status']=true;
            $result['data']['uname']=$client->getUserId();
            $result['data']['uid']=$client->getSessionId();

        }
        else{
            $result['status']=false;
            $result['data']="Permission denied";
        }

        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });



    $app->get("/login/status",function(Request $req,Response $res,$args){

        $admin=new User();
        $result=array();
        if($admin->isLoggedIn()){
            $result['status']=true;
            $userData['admin']=$admin->isStdUser();
            $userData['name']=$admin->getUserId();
            $userData['lockState']=$admin->isLocked();
            $result['data']=$userData;

        }
        else{
            $result['status']=false;
            $result['data']="Not Logged In";
        }
        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });


    $app->post("/cloneSession",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if(!$admin->isLoggedIn()){

            $request=$req->getParsedBody();
            if(!empty($request['uname'])&& !empty($request['upass'])){
                setcookie(ACTIVE_USER_NAME_IDENTIFIER , $request['uname'], time()+60*60*24,"/", $domain = SERVER, $secure = null, $httponly=true);
                setcookie(ACTIVE_USER_TOKEN_IDENTIFIER, $request['upass'], time()+60*60*24, "/", $domain = SERVER, $secure = null, $httponly = true);
                $result['status']=true;
            }
            else{
                $result['status']=false;
                $result['data']="Provide Creds";
            }
        }
        else{
            $result['status']=true;
            $result['data']="Already Logged in";
        }

        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });
    $app->get("/lock/{id}",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn() && $admin->isStdUser()){

            $client=new User(false);
            if(!empty($args['id'])){
                $client->selectUser($args['id']);
            }
            if($client->isNaiveUser()){
                $result['status']=$client->lockAccess();if($result['status'])
                $result['isLocked']=true;

            }
            else{
                $result['status']=false;
                $result['data']="Admin account cannot be locked";
            }

        }
        else{
            $result['status']=false;
            $result['data']="permission denied";
        }

        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });
    $app->get("/lockstatus",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isNaiveUser()){
            $result['status']=$admin->isLocked();
        }
        else{
            $result['status']=false;
            $result['data']="permission denied";
        }

        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });

    $app->get("/unlock/{id}",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();

        if($admin->isLoggedIn() && $admin->isStdUser()){

            $client=new User(false);
            if(!empty($args['id'])){
                $client->selectUser($args['id']);
            }
            $result['status']=$client->unlockAccess();
            if($result['status'])
                $result['isLocked']=false;


        }
        else{
            $result['status']=false;
            $result['data']="permission denied";
        }

        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });

    $app->get("/logout",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn()){
            if($admin->logout()){
                $result['status']=true;
            }
            else{
                $result['status']=false;
                $result['data']="InternalError:$admin->lastError";
            }
        }
        else{
            $result['status']=false;
            $result['data']="Not logged in";
        }
        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));


    });

      ///-----------------///
     ///Admin user Routes///
    ///-----------------///

    //Require Authentication for the following routes



    //new candidate creation
    $app->post("/candidate/new",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn() && $admin->isStdUser()){

            $newcandidate=CandidateManager::addNew();
            $request=$req->getParsedBody();

            //BUG:
            //      order of entry of each field in $candidateData should match exactly
            //      with sql relation schema order.

            $candidateData=array(
                "candidate_id"   =>  CANDIDATE_PREFIX.(((int)candidateManager::getLastID())+rand(1,9)),
                "candidate_name" =>  $request['name'],
                "candidate_desc" =>  $request['desc']

            );
            $fileUploads=CandidateManager::uploadAssets();
            if($fileUploads['thumb']['status']===true){

                $candidateData['candidate_thumb']=$fileUploads['thumb']['name'];

            }
            else{
                $candidateData['candidate_thumb']=DEFAULT_THUMB;
            }
            $candidateData["candidate_type"]= $request['type'];
            $candidateData["candidate_post"]= $request['post'];
            $newcandidate->setData($candidateData);
            $result['status']=$newcandidate->commit();
            if($result['status']){
                $cVoteGroup=new VoteGroup(VoteGroup::$ADDNEW);
                $cVoteGroup->setData(array('candidate_id'=>$candidateData['candidate_id']));
                $cVoteGroup->commit();
                $result['data']=array("candidate_id"=>$candidateData['candidate_id']);
            }
            else{
                $result['data']="invalid entries";
            }





        }
        else{
            $result['status']=false;
            $result['data']="permission denied";

        }
        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));

    });

    //delete a candidate
    $app->post("/candidate/{id}/delete",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn() && $admin->isStdUser()){
            if(CandidateManager::remove($args['id'])){

                $cVoteGroup=new VoteGroup($args['id']);
                $result['status']=$cVoteGroup->remove();
            }

        }
        else{
            $result['status']=false;
            $result['data']="permission denied";

        }
        CORS();
        return $res->withHeader("Content-Type","application/json ")->write(json_encode($result));

    });

    //edit an exisiting candidate
    $app->post("/candidate/{id}/edit",function(Request $req,Response $res,$args){
        $admin=new User();
        $result=array();
        if($admin->isLoggedIn() && $admin->isStdUser()){
            $newcandidate=CandidateManager::getCandidate($args['id']);
            $request=$req->getParsedBody();
            if($request!=null) {
                if(!empty($request['name'])){
                    $candidateData["candidate_name" ]=  $request['name'];
                }
                if(!empty($request['desc'])){
                    $candidateData["candidate_desc" ]=  $request['desc'];
                }
                if(!empty($request['type'])){
                    $candidateData["candidate_type" ]=  $request['type'];
                }
                if(!empty($request['post'])){
                    $candidateData["candidate_post" ]=  $request['post'];
                }

                $fileUploads=CandidateManager::uploadAssets();
                if($fileUploads['thumb']['status']===true){

                    $candidateData['candidate_thumb']=$fileUploads['thumb']['name'];

                }

                $newcandidate->setData($candidateData);
                $result['status']=$newcandidate->commit();
                if($result['status']){
                    $result['data']=array("candidate_id"=>$args['id']);
                }
                else{
                    $result['data']="invalid entries";
                }
            }
            else{
                $result['status']=false;
                $result['data']="Request not complete";
            }



        }
        else{
            $result['status']=false;
            $result['data']="permission denied";

        }
        CORS();
        return $res->withHeader("Content-Type","application/json")->write(json_encode($result));

    });



  //run app
  $app->run();
