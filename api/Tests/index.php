<?php
   
   require_once('../vendor/autoload.php');
   require_once('../config/User.class.php');
   require_once('../config/Post.class.php');
   require_once('../config/PostManager.class.php');
    
   use Psr\Http\Message\ServerRequestInterface  as Request;
   use Psr\Http\Message\ResponseInterface as Response;
  $test=new Slim\App();

  $test->get("/isLogged",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();

    if($user->isLoggedIn()){
      $json['state']=true; 
    }
    else{
      $json['state']=false;

    }
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->get("/login/{mail}",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();

    if(!$user->isLoggedIn()){
      
      if($user->login($args['mail'],'fire.Lock') ){
        $json['state']=true; 
      }
      else{
        $json['state']=false;
      }
    }
    
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->get("/logout",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();

    if($user->logout()){
      $json['state']=true; 
    }
    else{
      $json['state']=false;

    }
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->get("/getName",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();

    $json['name']=$user->getUserFullName();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->get("/getMail",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();

    $json['name']=$user->getUserEmail();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->get("/user/{id}",function(Request $req,Response $res,array $args){
    $user= new User();
    $json=array();

    if($args['id']==$user->getUserEmail()){
      $json['name']=$args['id'];
    }
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  
  $test->post("/upload",function(Request $req,Response $res,array $args){
    $user= new User();
    $json=array();
    $storage = new \Upload\Storage\FileSystem('../config/Storage/');
    $file = new \Upload\File('file1', $storage);
    

    $new_filename = "doc_".uniqid();
    $file->setName($new_filename);
    
    $file->addValidations(array(
       
        new \Upload\Validation\Mimetype(array('application/pdf')),

        new \Upload\Validation\Size('50M')
    ));
    
    $data = array(
        'name'       => $file->getNameWithExtension(),
        'extension'  => $file->getExtension(),
        'mime'       => $file->getMimetype(),
        'size'       => $file->getSize(),
        'md5'        => $file->getMd5(),
        'dimensions' => $file->getDimensions()
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
    $json=$data;
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });

  $test->post("/upload/v2",function(Request $req,Response $res,array $args){
    $user= new User();
    $json=array();
    $options=array(
      "dir"=>DIR_THUMB,
      'object_name'=>"thumb_img",
      "prefix"=>"thumb_",
      "mimetypes"=>array("image/png","image/jpg"),
      "size"=>"10M"

    );
    //die(json_encode($options));
    $json=PostManager::uploadFile($options);
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });

  $test->post("/upload/m2",function(Request $req,Response $res,array $args){
    $user= new User();
    $json=array();
    $storage = new \Upload\Storage\FileSystem('../config/Storage/Doc');
    $storage2 = new \Upload\Storage\FileSystem('../config/Storage/Thumb');
    $file = new \Upload\File('doc_pdf', $storage);
    $file2 = new \Upload\File('thumb_img', $storage2);
    

    $new_filename = "doc_".uniqid();
    $file->setName($new_filename);
    $file2->setName("thumb_".uniqid());
    
    $file->addValidations(array(
       
      new \Upload\Validation\Mimetype(array('application/pdf')),

      new \Upload\Validation\Size('50M')
  ));
  $file2->addValidations(array(
       
    new \Upload\Validation\Mimetype(array('image/png')),

    new \Upload\Validation\Size('10M')
  ));

    $data = array(
        'name'       => $file->getNameWithExtension(),
        'extension'  => $file->getExtension(),
        'mime'       => $file->getMimetype(),
        'size'       => $file->getSize(),
        'md5'        => $file->getMd5(),
        'dimensions' => $file->getDimensions()
    );
    $data2 = array(
      'name'       => $file2->getNameWithExtension(),
      'extension'  => $file2->getExtension(),
      'mime'       => $file2->getMimetype(),
      'size'       => $file2->getSize(),
      'md5'        => $file2->getMd5(),
      'dimensions' => $file2->getDimensions()
    );
    
    try {
        // Success!
        $file->upload();
        $file2->upload();
        $data['status']=true;
    } catch (\Exception $e) {
        // Fail!
        $errors = $file->getErrors();
        $data['status']=false;
        $data['errorInfo']=$errors;
    }
    $json['d1']=$data;
    $json['d2']=$data2;
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  



  //sym tests

  $test->get("/Post/{id}",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();
    $post=new Post($args['id']);
    $json['data']=$post->getData();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });


  $test->get("/Post/{id}/All",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();
    $post=new Post($args['id']);
    $json['Name']=$post->getHeader();
    $json['desc']=$post->getDesc();
    $json['Year']=$post->getYear();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  
  $test->get("/Post/{id}/commit",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();
    $post=new Post($args['id']);
    $data=$post->getData();
    $json['prev']=$data;
    //$data['post_head']="helloween.gif";
    //$data['post_desc']="helloween.gif";
    $data['post_thumb']="coldfusion::freed";
    
    $json['post']=$post->setData($data);
    $json['data']=$post->commit();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->get("/Post/add/new",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();
    $post=new Post(Post::$ADDNEW);
    $recPost=new Post('uid9292');
    $data=$recPost->getData();
    $data['post_id']="uid92922332";
    $json['prev']=$data;
    $json['post']=$post->setData($data);
    $json['data']=$post->commit();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->post("/Post/add/new/v2",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();
    $post=PostManager::addNew();
    $recPost=new Post('uid9292');
    $data=$recPost->getData();
    $data['post_id']="uid9292w33";
    $json['prev']=$data;
    $json['post']=$post->setData($data);
    $json['data']=$post->commit();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  
  $test->delete("/Post/{id}/remove",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();
    $json['removed']=PostManager::remove($args['id']);
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->get("/Post/fetch/all",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();
    $json=PostManager::fetch();
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  $test->get("/Post/fetch/{lim}",function(Request $req,Response $res,$args){
    $user= new User();
    $json=array();
    $json=PostManager::fetch(PDO::FETCH_ASSOC,$args['lim']);
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  
  $test->get("/session/new",function(Request $req,Response $res,$args){
    session_start();
    $_SESSION['sess_token']=uniqid();
    $json['data']=$_SESSION;
    
    return $res->withHeader('Content-Type','application/json')->write(json_encode($json));
  });
  

  $test->run();
?>