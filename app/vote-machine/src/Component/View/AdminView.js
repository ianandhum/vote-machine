import React from 'react'
import Col from "react-bootstrap/lib/Col"
import Row from "react-bootstrap/lib/Row"
import { Redirect } from 'react-router-dom';


class AdminView extends React.Component{
    constructor(props){
        super(props);
        this.state={
            login:(props.loginStatus)?props.loginStatus:false,
            isHome:true,
            page:"",
            loggedOut:false,
            fullScreen:false
            
        }
        this.navigateTo=this.navigateTo.bind(this);
        this.requestFullScreen=this.requestFullScreen.bind(this);
        this.cancelFullScreen=this.cancelFullScreen.bind(this);
        this.host="http://votehost.local/api/v1"
            
    }
        
    
        
        onJsonResult(result){
            if(result.ok){
                result.json().then(this.onJsonFetch.bind(this),this.onJsonError.bind(this))
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
                prevState.loggedOut=json.status;
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
    logout(){
        fetch(this.host+"/logout",{method:"GET",credentials:"include"}).then(
            this.onJsonResult.bind(this),
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
           if(this.state.isHome){
            
            if(this.state.loggedOut){
                return(
                    <Redirect to="/login"/>
                );
            }
            return(
                <div className="home">
                            <div className="fs" onClick={()=>(this.state.fullScreen)?this.cancelFullScreen(document):this.requestFullScreen(document.documentElement)}><i className={(this.state.fullScreen)?"glyphicon glyphicon-resize-small":"glyphicon glyphicon-resize-full"}></i></div>

                            <header className="title-head">
                                <div>viswadeepthi CMI public school adimali</div>
                                <span>
                                    School Cabinet Election 2018
                                </span>
                            </header>
                            <Row className="action" >
                            <Tile name="candidates" icon="user" onClick={()=>this.navigateTo("candidate/entry")}/>
                            <Tile name="Votting console" icon="map-marker"  onClick={()=>this.navigateTo("/vottingConsole")}/>
                            <Tile  name="Client access" icon="lock" onClick={()=>this.navigateTo("/clientAccess")}/>
                            <Tile name="Logout" icon="log-out" onClick={()=>this.logout()} />
                                
                            </Row>
            
                </div>
            )

           }
           else{
                return(
                    <Redirect to={this.state.page}/>
                )
           }
        }
        
    
}
const Tile=(props)=>{
    return (
        <Col className="tile" onClick={props.onClick}>
           <div className="ic"><i className={"glyphicon glyphicon-"+props.icon}/></div>
           <div className="name">{props.name}</div>
        </Col>
    )
}
export default AdminView;