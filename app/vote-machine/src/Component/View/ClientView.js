import React from 'react'
import Col from "react-bootstrap/lib/Col"
import Row from "react-bootstrap/lib/Row"
import { Redirect } from 'react-router-dom';
import "../css/client.css"


class ClientView extends React.Component{
    constructor(props){
        super(props);
        this.state={
            login:(props.loginStatus)?props.loginStatus:false,
            isHome:true,
            isLocked:true,
            page:"",
            vote:{
                step:{
                    current:-1,
                    data:[
                        {
                            head:"Head Boy",
                            code:"HB"
                        },
                        {
                            head:"Head Girl",
                            code:"HG"
                        },
                        {
                            head:"General Secretary",
                            code:"GS"
                        },
                        {
                            head:"General Captain",
                            code:"GC"
                        }
                    ]
                },
                
            },
            fullScreen:false
            
        }
        fetch(this.host+"/candidates/all",{method:"GET",credentials:"include"}).then(
            this.onJsonResult.bind(this),
            this.onJsonError.bind(this)
        )
        this.navigateTo=this.navigateTo.bind(this);
        this.onJsonError=this.onJsonError.bind(this);
        this.onJsonFetch=this.onJsonFetch.bind(this);
        this.onJsonResult=this.onJsonResult.bind(this);
        this.onLockFetch=this.onLockFetch.bind(this);
        this.onLockResult=this.onLockResult.bind(this);
        this.cancelFullScreen=this.cancelFullScreen.bind(this);
        this.requestFullScreen=this.requestFullScreen.bind(this);
        this.checkLock=this.checkLock.bind(this);
        this.goNext=this.goNext.bind(this);
        this.host="http://votehost.local/api/v1";
        setInterval(this.checkLock,1000);
        this.checkLock();
            
    }
    checkLock(){
        fetch(this.host+"/lockstatus",{method:"GET",credentials:"include"}).then(
            this.onLockResult.bind(this),
            this.onJsonError.bind(this)
        )
        
    }   
    
        
    onJsonResult(result){
        if(result.ok){
            result.json().then(this.onJsonFetch.bind(this),this.onJsonError.bind(this))
        }

    }
    onLockResult(result){
        if(result.ok){
            result.json().then(this.onLockFetch.bind(this),this.onJsonError.bind(this))
        }

    }
        onJsonError(result){
            var prevState=this.state;
            console.error('could not load data')
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
        onLockFetch(json){
            //console.log(json);
            var prevState=this.state;
            if(json){
                prevState.isLocked=json.status;
                if(prevState.isLocked)
                    prevState.vote.step.current=-1;
                this.setState(prevState);
            }
            else{
                prevState.isLocked=true;
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
        goNext(){
            var prevState=this.state;
            if(prevState.vote.step.current<=prevState.vote.step.data.length)
                prevState.vote.step.current++;
            (prevState.vote.step.current===prevState.vote.step.data.length) && this.beep();
            this.setState(prevState);
        }
    logout(){
        fetch(this.host+"/logout",{method:"GET",credentials:"include"}).then(
            this.onJsonResult.bind(this),
            this.onJsonError.bind(this)
        )
        
    }
    beep() {
        console.log('playing beep sound')
        var snd = new Audio("/audio/beep.mp3");  
        snd.play();
        
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
            if(this.state.isLocked){
                return (
                    <div className="hidden-row" >
                        <div className="img">
                            <i className="glyphicon glyphicon-lock"/>
                        </div>
                        <h3 className="head_h"><span style={{padding:"20px",borderRadius:"8px"}}>you cannot vote now, please wait</span></h3>
                    </div>  
                );
            }
            var currentView={}
            if(this.state.vote.step.current===-1){
                currentView=(
                    <div>
                        <h1 style={{textAlign:"center",marginTop:"250px"}}>You can Start voting now</h1>
                        <input type="button" className="btn btn-success" value="Start" onClick={this.goNext}  style={{margin:"30px auto 50px",backgroundColor:"#007766",borderColor:"#00a699",display:"block"}}/>
                               
                    </div>
                )
            }
            else if(this.state.vote.step.current===this.state.vote.step.data.length){
                currentView=([
                    <div style={{margin:"auto",marginTop:"200px",fontSize:"9em",textAlign:"center",width:"200px",height:"100px"}}>
                        <i className="glyphicon glyphicon-thumbs-up"/>
                    </div>,
                    <h2 className="head_h" style={{textAlign:"center"}}><span style={{padding:"10px"}}>4 votes polled</span></h2>,
                    <h4 className="head_h" style={{textAlign:"center"}}>Voting finished</h4>,
                    
                ])
                
            }
            else{
                currentView=([
                    <h4 className="head" key="head">
                    <span>{this.state.vote.step.data[this.state.vote.step.current].head}</span>
                    <div style={{padding:"10px"}}>
                        <small>One vote will be added per click </small>    
                    </div>    
                    </h4>,
                    <div className="content" key="cont">
                    <VoteBox data={this.state.vote.step.data[this.state.vote.step.current]} key={this.state.vote.step.data[this.state.vote.step.current].code} onVoted={this.goNext}/>
        
                    </div>       
                ])
            }
            return(
                <Row className="home sub">
                            <div className="fs" onClick={()=>(this.state.fullScreen)?this.cancelFullScreen(document):this.requestFullScreen(document.documentElement)}><i className={(this.state.fullScreen)?"glyphicon glyphicon-resize-small":"glyphicon glyphicon-resize-full"}></i></div>

                            <header className="title-head" style={{display:"none"}}>
                                <span >
                                    <small>School Cabinet Election 2018</small>
                                </span>
                                
                            </header>
                            <Col className="cont_box client">
                                {currentView}
                            </Col>
                            
                </Row>
            )

           }
           else{
                return(
                    <Redirect to={this.state.page}/>
                )
           }
        }
        
    
}
const UserCard=(props)=>{
    return (
        <div className="ucard" onClick={props.onClick}>
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
class VoteBox extends React.Component{
    static timeout=null;
    constructor(props){

        super(props);
        this.host="http://votehost.local/api/v1"
        this.url= "/candidates/all"
        this.vote= "/voteup/"
        
        fetch(this.host+this.url,{method:"GET",credentials:"include"}).then(
            this.onJsonResult.bind(this),
            this.onJsonError.bind(this)
        )

        this.state={
            code:props.data.code,
            name:props.data.head,
            data:[]
        }
    }
    onJsonResult(result){
        if(result.ok){
            result.json().then(this.onJsonFetch.bind(this),this.onJsonError.bind(this))
        }
        

    }
    onVoteResult(result){
        if(result.ok){
            result.json().then(this.onVoteFetch.bind(this),this.onJsonError.bind(this))
        }
        

    }
    onJsonError(result){
        var prevState=this.state;
        console.log('could not load data')
        if(typeof this.props.onLoadError==='function')
            this.props.onLoadError()
        this.setState(prevState);
            
    }
    onJsonFetch(json){
        console.log(json);
        var prevState=this.state;
        if(json){
            prevState.data=json.data;
            this.setState(prevState);
        }
        else{
            this.setState(prevState);
        }

    }
    onVoteFetch(json){
        console.log(json);
        //var prevState=this.state;
        if(json && json.status){
            if(typeof this.props.onVoted==='function'){
                 this.props.onVoted();
            }
        }
        

    }
    voteUp(id){
        VoteBox.timeout && clearTimeout(VoteBox.timeout)
        VoteBox.timeout=setTimeout(()=>(
            fetch(this.host+this.vote+id,{method:"GET",credentials:"include"}).then(
                this.onVoteResult.bind(this),
                this.onJsonError.bind(this)
            )
        ),500)
        

    }
    render(){
        return(
            this.state.data.map(
                (item)=>(
                    (item.candidate_post===this.state.code) &&
                    <UserCard name={item.candidate_name} thumb={this.host+"/thumb/"+item.candidate_id} onClick={()=>this.voteUp(item.candidate_id)}/>
                )
            )
        
        )
    }
}
export default ClientView;