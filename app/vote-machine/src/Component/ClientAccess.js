import React from 'react'
import $ from 'jquery'
import {Redirect} from "react-router-dom"
import Col from "react-bootstrap/lib/Col"
import Row from "react-bootstrap/lib/Row"
import LoadError from "./LoadError"
import PermissionError from "./PermissionError"
import "./css/access.css"
class ClientAccess extends React.Component{
    
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
            
            displayData:[],
            isLocked:true,
            isHome:true,
            data:null,
            voteClass:"STD1",
            fullscreen:false
            
        }
        this.navigateTo=this.navigateTo.bind(this);
        this.newClientSession=this.newClientSession.bind(this);
        this.getClientSession=this.getClientSession.bind(this);
        this.lockSession=this.lockSession.bind(this);
        this.unLockSession=this.unLockSession.bind(this);
        this.requestFullScreen=this.requestFullScreen.bind(this);
        this.cancelFullScreen=this.cancelFullScreen.bind(this);
        this.voteClassChange=this.voteClassChange.bind(this);
        this.getVoteClass=this.getVoteClass.bind(this);
        this.getClientSession();
        this.lockSession();
        this.getVoteClass();
        
    }    
    onJsonResult(result){
        if(result.ok){
            result.json().then(this.onJsonFetch.bind(this),this.onJsonError.bind(this))
        }

    }
    onSessionResult(result){
        if(result.ok){
            result.json().then(this.onSessionJsonFetch.bind(this),this.onJsonError.bind(this))
        }

    }
    onLockResult(result){
        if(result.ok){
            result.json().then(this.onLockJsonFetch.bind(this),this.onJsonError.bind(this))
        }

    }
    onVoteClassResult(result){
        if(result.ok){
            result.json().then(this.onVoteClassFetch.bind(this),this.onJsonError.bind(this))
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
    onVoteClassFetch(json){
        console.log(json);
        var prevState=this.state;
        if(json.status){
            prevState.voteClass=json.voteClass;
            this.setState(prevState);
        }
        else{
            prevState.loadError=true;
            this.setState(prevState);
        }

    }

    onSessionJsonFetch(json){
        console.log(json);
        var prevState=this.state;
        if(json){
            prevState.statLoaded=true;
            prevState.displayData=json.data;
            this.setState(prevState);
        }
        else{
            prevState.loadError=true;
            this.setState(prevState);
        }

    }
    onLockJsonFetch(json){
        console.log(json);
        var prevState=this.state;
        if(json){
            prevState.statLoaded=true;
            prevState.isLocked=json.isLocked;
            this.setState(prevState);
        }
        else{
            prevState.loadError=true;
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
    newClientSession(){
        fetch(this.host+"/login/admin/client",{method:"GET",credentials:"include"}).then(
            this.onSessionResult.bind(this),
            this.onJsonError.bind(this)
        )
    }
    getClientSession(){
        fetch(this.host+"/loginstatus/admin/client",{method:"GET",credentials:"include"}).then(
            this.onSessionResult.bind(this),
            this.onJsonError.bind(this)
        )
    }

    lockSession(){
        fetch(this.host+"/lock/client",{method:"GET",credentials:"include"}).then(
            this.onLockResult.bind(this),
            this.onJsonError.bind(this)
        )
    }
    unLockSession(){
        fetch(this.host+"/unlock/client",{method:"GET",credentials:"include"}).then(
            this.onLockResult.bind(this),
            this.onJsonError.bind(this)
        )
    }
    getVoteClass(){
        fetch(this.host+"/voteClass",{method:"GET",credentials:"include"}).then(
            this.onVoteClassResult.bind(this),
            this.onJsonError.bind(this)
        )
    }
    voteClassChange(e){
        var prevState=this.state;
        prevState.voteClass=e.target.value;
        this.setState(prevState);
        fetch(this.host+"/voteClass/"+this.state.voteClass,{method:"GET",credentials:"include"}).then(
            this.onVoteClassResult.bind(this),
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
                       if(this.state.statLoaded){
                           console.log(this.state)
                        currentView=([
                           
                            <Col xs={4}  md={6} className="left-drawer" key="lf" style={{minHeight:"400px",height:"400px",padding: "20px"}}>
                                <h4 className="ac_head">Token for Client Access</h4>
                                <h5 className="ac_main">Client User name : <big className="pull-right"><b>{this.state.displayData.uname || "not set"}</b></big></h5>
                                <h5 className="ac_main">Client Token : <big className="pull-right"><b>{this.state.displayData.uid || "not set"}</b></big></h5>
                                <h5 className="ac_head">Note <br/><big>Use this  user name and token to login to client session</big></h5>
                            
                            </Col>,
                            <Col xs={8}  md={6} className="right-drawer" key="rf" style={{minHeight:"400px",overflow:"hidden",height:"400px"}}>
                               <h4 className="ac_head">Control Vote Access</h4>
                                <form className="form-horizontal">
                                <div className="form-group">
                                             <label className="control-label col-sm-4">Active Class Voting</label>
                                            <div className="col-sm-8">
                                                <select type="text" name="post" className="form-control"  onChange={this.voteClassChange}  value={this.state.voteClass} >
                                                    <option value="STD01">Standard I</option>
                                                    <option value="STD02">Standard II</option>
                                                    <option value="STD03">Standard III</option>
                                                    <option value="STD04">Standard IV</option>
                                                    <option value="STD05">Standard V</option>
                                                    <option value="STD06">Standard VI</option>
                                                    <option value="STD07">Standard VII</option>
                                                    <option value="STD08">Standard VIII</option>
                                                    <option value="STD09">Standard IX</option>
                                                    <option value="STD10">Standard X</option>
                                                    <option value="STD11">Standard XI</option>
                                                    <option value="STD12">Standard XII</option>
                                                </select>
                                            </div>
                                        </div>
                                </form>
                                <input type="button" className={(this.state.isLocked)?"btn btn-danger pull-right":"btn  btn-primary pull-right"} value={(this.state.isLocked)?"Unlock Session Access":"Lock Session Access"} onClick={()=>(this.state.isLocked)?this.unLockSession():this.lockSession()}  style={{margin:"30px auto 50px",display:"block"}}/>
                                <h5 className="ac_head clearfix">Note <br/><big>when the clients are locked out, they cannot submit any votes</big></h5>
                            
                            </Col>
                        
                        ])
                       }

                       else{
                           currentView=("new session")
                       }
                       
                   
                    return(
                        
                        <div className="home sub">
                        <div className="fs" onClick={()=>(this.state.fullScreen)?this.cancelFullScreen(document):this.requestFullScreen(document.documentElement)}><i className={(this.state.fullScreen)?"glyphicon glyphicon-resize-small":"glyphicon glyphicon-resize-full"}></i></div>
                        
                        <header className="title-head sub">
                            <div>School Cabinet Election 2018</div>
                            <span>
                                Client Acess
                            </span>
                        </header>
                        <Row className="action sub" >
                        <div style={{minHeight:"30px"}}>
                            <Tile name="home" onClick={()=>this.navigateTo("/")}/>
                            <Tile name="Votting Console" onClick={()=>this.navigateTo("/vottingConsole")}/>
                            <Tile name="Candidates" onClick={()=>this.navigateTo("/candidate/entry")}/>
                            <Tile name="New Client Session" width="180px" onClick={()=>(this.newClientSession())}/>
                           
                        </div> 
                        
                        </Row>
                        <Row className="cont_box" style={{minHeight:"400px"}}>
                        
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


export default ClientAccess;