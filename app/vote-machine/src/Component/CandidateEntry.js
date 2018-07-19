import React from 'react'
import $ from 'jquery'
import {Redirect} from "react-router-dom"
import Col from "react-bootstrap/lib/Col"
import Row from "react-bootstrap/lib/Row"
import LoadError from "./LoadError"
import PermissionError from "./PermissionError"
import "./css/candidate.css"
class CandidateEntry extends React.Component{
    
    constructor(props){

        super(props);
        this.host="http://votehost.local/api/v1"
        this.url= "/login/status"
        
        fetch(this.host+this.url,{method:"GET",credentials:"include"}).then(
            this.onJsonResult.bind(this),
            this.onJsonError.bind(this)
        )
        
        this.state={
            loaded:false,
            loadError:false,
            loggedIn:false,
            formData:{
                name:"",
                desc:"null",
                type:"SENIOR",
                post:"HB",
                thumb:null
            },
            displayData:[],
            display:{
                currentPost:"HB"
            },
            isHome:true,
            page:"",
            currentView:"home",
            data:null,
            fullScreen:false,
            updateCId:""
            
        }
        this.navigateTo=this.navigateTo.bind(this);
        this.setCurrentPost=this.setCurrentPost.bind(this);
        this.setCurrentView=this.setCurrentView.bind(this);
        this.onDataChange=this.onDataChange.bind(this);
        this.newDataSubmit=this.newDataSubmit.bind(this);
        this.oldDataSubmit=this.oldDataSubmit.bind(this);
        this.OnThumbUpload=this.OnThumbUpload.bind(this);
        this.fillUpdateFields=this.fillUpdateFields.bind(this);
        this.oldDataDelete=this.oldDataDelete.bind(this);
        this.requestFullScreen=this.requestFullScreen.bind(this);
        this.cancelFullScreen=this.cancelFullScreen.bind(this);
        console.log(this.host+this.url)
        
    }
    

    
    onJsonResult(result){
        if(result.ok){
            result.json().then(this.onJsonFetch.bind(this),this.onJsonError.bind(this))
            fetch(this.host+"/candidates/all",{method:"GET",credentials:"include"}).then(
                this.onListJsonResult.bind(this),
                this.onJsonError.bind(this)
            )
        }

    }
    onListJsonResult(result){
        if(result.ok){
            result.json().then(this.onListJsonFetch.bind(this),this.onJsonError.bind(this))
        }

    }
    onNewJsonResult(result){
        if(result.ok){
            result.json().then(this.onNewJsonFetch.bind(this),this.onJsonError.bind(this))
        }

    }
    onJsonError(result){
        var prevState=this.state;
        console.log('could not load data')
        if(typeof this.props.onLoadError==='function')
            this.props.onLoadError()
        prevState.loadError=true;
        this.setState(prevState);
            
    }
    onJsonFetch(json){
        console.log(json);
        var prevState=this.state;
        if(json){
            prevState.loaded=true;
            prevState.loggedIn=json.status;
            prevState.data=json.data;
            this.setState(prevState);
        }
        else{
            prevState.loadError=true;
            this.setState(prevState);
        }

    }
    onListJsonFetch(json){
        console.log(json);
        var prevState=this.state;
        if(json){
           prevState.loaded=true;
            prevState.displayData=json.data;
            prevState.currentView="home";
            this.setState(prevState);
        }
        else{
            prevState.loadError=true;
            this.setState(prevState);
        }

    }
    onNewJsonFetch(json){
        console.log(json);
        var prevState=this.state;
        if(json){
           fetch(this.host+"/candidates/all",{method:"GET",credentials:"include"}).then(
            this.onListJsonResult.bind(this),
            this.onJsonError.bind(this)
            )
        }
        else{
            prevState.loadError=true;
            this.setState(prevState);
        }

    }
    setCurrentPost(post){
        var prevState=this.state;
        if(post!==null){
            prevState.display.currentPost=post;
            this.setState(prevState);
        }
        
    }
    navigateTo(url){
        var prevState=this.state;
        if(url!==null){
            prevState.isHome=false
            prevState.page=url;
            this.setState(prevState);
        }
        
    }
    setCurrentView(view,extra,callback){
        var prevState=this.state;
        if(view!==null){
            extra && extra.forEach(item => {
                prevState[item[0]]=item[1]
            });
            prevState.currentView=view;
            console.log(prevState);
            
            this.setState(prevState,callback);
        }
        
    }
    onDataChange(e){
        var prevState=this.state;
        prevState.formData[e.target.name]=e.target.value;
        this.setState(prevState);

    }
    OnThumbUpload(e){
        var prevState=this.state;
        prevState.formData.thumb=e.target.files[0];
        this.setState(prevState);

    }
    newDataSubmit(e){
        e.preventDefault();
        var data = new FormData();
        data.append("name",this.state.formData.name);
        data.append("desc",this.state.formData.desc);
        data.append("type",this.state.formData.type);
        data.append("post",this.state.formData.post);
        data.append("thumb_img",this.state.formData.thumb);
       
        fetch(this.host+"/candidate/new",{method:"POST",body:data,credentials:"include"}).then(
            this.onNewJsonResult.bind(this),
            this.onJsonError.bind(this)
        )

    }
    fillUpdateFields(data){
        var prevState=this.state
        if(data){
            prevState.formData.name=data.candidate_name
            prevState.formData.desc=data.candidate_desc
            prevState.formData.post=data.candidate_post
            prevState.formData.type=data.candidate_type
            this.setState(prevState);
        }
    }
    oldDataSubmit(e){
        e.preventDefault();
        var data = new FormData();
        data.append("name",this.state.formData.name);
        data.append("desc",this.state.formData.desc);
        data.append("type",this.state.formData.type);
        data.append("post",this.state.formData.post);
        this.state.formData.thumb && data.append("thumb_img",this.state.formData.thumb);
        
        fetch(this.host+"/candidate/"+ this.state.updateCId +"/edit",{method:"POST",body:data,credentials:"include"}).then(
            this.onNewJsonResult.bind(this),
            this.onJsonError.bind(this)
        )

    }
    oldDataDelete(e){
        e.preventDefault();
        fetch(this.host+"/candidate/"+ this.state.updateCId+"/delete",{method:"POST",credentials:"include"}).then(
            this.onNewJsonResult.bind(this),
            this.onJsonError.bind(this)
        )

    }
    requestFullScreen(element) {
        // Supports most browsers and their versions.
        var requestMethod =element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
            var prevState=this.state;
            prevState.fullScreen=true;
            this.setState(prevState);
        }
        else {
            alert("Full screen not Supported press F11");
        }
        
  }
  cancelFullScreen(element) {
          // Supports most browsers and their versions.
          var requestMethod = element.cancelFullScreen || element.webkitCancelFullScreen || element.mozCancelFullScreen || element.msCancelFullScreen;

          if (requestMethod) { // Native full screen.
              requestMethod.call(element);
              var prevState=this.state;
              prevState.fullScreen=false;
              this.setState(prevState);
          }
          else {
            alert("Full screen not Supported back press F11");
          }
  }
    render(){
        if(this.state.loaded){
            
            if(this.state.loggedIn){
                $("#preload").children().fadeOut("slow",function(){
                    $("#preload").fadeOut("slow")
                })
                if(this.state.data.admin){
                   if(this.state.isHome){
                       var currentView={}
                       if(this.state.currentView==="new"){
                            console.log("on new")
                            currentView=(
                                <Col xs={12} md={8} className="nC_content" key="new">
                                <h4 className="h">Add new candidate</h4>
                                    <form className="form-horizontal nC_form" onSubmit={this.newDataSubmit}>
                                   
                                        <div className="form-group">
                                             <label className="control-label col-sm-4">Full name</label>
                                            <div className="col-sm-8">
                                                <input type="text" name="name" className="form-control" onChange={this.onDataChange} value={this.state.formData.name} placeholder="Enter Full name"/>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group">
                                             <label className="control-label col-sm-4">Competing Designation</label>
                                            <div className="col-sm-8">
                                                <select type="text" name="post" className="form-control" onChange={this.onDataChange} value={this.state.formData.post} >
                                                    <option value="HB">Head Boy</option>
                                                    <option value="HG">Head Girl</option>
                                                    <option  value="GS">General Secretary</option>
                                                    <option  value="GC">General Captain</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                             <label className="control-label col-sm-4">JUNIOR/SENIOR</label>
                                            <div className="col-sm-8">
                                                <select name="type" className="form-control" onChange={this.onDataChange} value={this.state.formData.type} >
                                                    
                                                    <option  value="JUNIOR">Junior</option>
                                                    <option  value="SENIOR">Senior</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                             <label className="control-label col-sm-4">Upload Photo</label>
                                            <div className="col-sm-8">
                                                <input type="file"  className="form-control" onChange={this.OnThumbUpload}/>
                                            </div>
                                        </div>
                                        <Row>
                                            <input type="submit" className="btn btn-primary pull-right" value="Save" style={{width:"100px",margin:"15px"}}></input>
                                        </Row>
        
                                                                                    
        
        
        
                                    </form>
                                </Col>
                            )
                       }
                       else if(this.state.currentView==="update"){
                        currentView=(
                            <Col xs={12} md={8} className="nC_content" key="update">
                            <h4 className="h">Update Candidate data</h4>
                                <form className="form-horizontal nC_form" onSubmit={this.oldDataSubmit}>
                               
                                    <div className="form-group">
                                         <label className="control-label col-sm-4">Full name</label>
                                        <div className="col-sm-8">
                                            <input type="text" name="name" className="form-control" onChange={this.onDataChange} value={this.state.formData.name} placeholder="Enter Full name"/>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                         <label className="control-label col-sm-4">Competing Designation</label>
                                        <div className="col-sm-8">
                                            <select type="text" name="post" className="form-control" onChange={this.onDataChange} value={this.state.formData.post} >
                                                <option value="HB">Head Boy</option>
                                                <option value="HG">Head Girl</option>
                                                <option  value="GS">General Secretary</option>
                                                <option  value="GC">General Captain</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                         <label className="control-label col-sm-4">JUNIOR/SENIOR</label>
                                        <div className="col-sm-8">
                                            <select name="type" className="form-control" onChange={this.onDataChange} value={this.state.formData.type} >
                                                
                                                <option  value="JUNIOR">Junior</option>
                                                <option  value="SENIOR">Senior</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                         <label className="control-label col-sm-4">Upload Photo</label>
                                        <div className="col-sm-8">
                                            <input type="file"  className="form-control" onChange={this.OnThumbUpload}/>
                                        </div>
                                    </div>
                                    <Row>
                                        <input type="submit" className="btn btn-primary pull-right" value="Save" style={{width:"100px",margin:"15px"}}></input>
                                        <input type="button" className="btn btn-danger pull-right" value="Delete" onClick={this.oldDataDelete} style={{width:"100px",margin:"15px"}}></input>
                                        
                                    </Row>
    
                                                                                
    
    
    
                                </form>
                            </Col>
                        )
                   }
                   
                       else{
                        
                        currentView=([
                            <Col xs={4}  md={2} className="left-drawer" key="lf">
                                <h4 style={{fontWeight:"bold",padding:"10px",color:"#fff"}}>select post</h4>
                                <Btn name="Head Boy" onClick={()=>this.setCurrentPost("HB")}/>
                                <Btn name="Head Girl" onClick={()=>this.setCurrentPost("HG")}/>
                                <Btn name="General Secretary" onClick={()=>this.setCurrentPost("GS")}/>
                                <Btn name="General Captain" onClick={()=>this.setCurrentPost("GC")}/>
                            </Col>,
                            <Col xs={8}  md={10} className="right-drawer" key="rf">
                                {
                                    this.state.displayData.map((item)=>(
                                        
                                          (item.candidate_post===this.state.display.currentPost) &&  <UserCard 
                                            name={item.candidate_name}
                                            type={item.candidate_type}
                                            post={item.candidate_post}
                                            onClick={()=>(this.setCurrentView('update',[["updateCId",item.candidate_id]],()=>this.fillUpdateFields(item)))}
                                            thumb={this.host+"/thumb/"+item.candidate_id}
                                            key={item.candidate_id}
                                            />
                                    ))
                                }
                            </Col>
                        ])
                       }
                    return(
                        
                        <div className="home sub">
                        <div className="fs" onClick={()=>(this.state.fullScreen)?this.cancelFullScreen(document):this.requestFullScreen(document.documentElement)}><i className={(this.state.fullScreen)?"glyphicon glyphicon-resize-small":"glyphicon glyphicon-resize-full"}></i></div>
                        
                        <header className="title-head sub">
                            <div>School Parliament Elections 2018</div>
                            <span>
                                Candidates
                            </span>
                        </header>
                        <Row className="action sub" >
                        <div style={{minHeight:"30px"}}>
                            <Tile name="home" onClick={()=>this.navigateTo("/")}/>
                            <Tile name="Votting Console" onClick={()=>this.navigateTo("/vottingConsole")}/>
                            <Tile name="Client Access" onClick={()=>this.navigateTo("/clientAccess")}/>
                            <Tile name={(this.state.currentView!=="home")?"back":"new candidate"} width="180px" onClick={()=>{this.setCurrentView((this.state.currentView!=="home")?"home":"new")}}/>
                            
                          
                        </div> 
                        
                        </Row>
                        <Row className="cont_box">
                        
                            {
                                currentView
                            }

                        </Row>
        
                        </div>
                    )
                   }
                   else{
                      return <Redirect to={this.state.page}/>
                   }
                }
                else {
                    return (
                        <PermissionError/>
                    )
                }
            }
            else{
                return (
                    <Redirect to="/login"/>
                )
            }
            
        }
        
        else{
            if(this.state.loadError){
                return (
                   <LoadError/>
                )
            }
            return null;
        }
        
    }
}
const Tile=(props)=>{
    return (
        <Col className="tile small" onClick={props.onClick} style={{width:props.width}}>
           <div className="name">{props.name}</div>
        </Col>
    )
}
const Btn=(props)=>{
    return (
        <Col className="tile btn" onClick={props.onClick}>
           <div className="name">{props.name}</div>
        </Col>
    )
}
const UserCard=(props)=>{
    return (
        <div className="user-card" onClick={props.onClick}>
            <div className="cont" style={{backgroundImage:"url('"+props.thumb+"')"}}></div>
            <div className="foot">
                <div className="nm">{props.name}</div>
                <span>
                    <span className="label label-primary">{props.type}</span>
                    <span className="label label-primary">{props.post}</span>
                </span>
                
            </div>


        </div>
    )
}
export default CandidateEntry;