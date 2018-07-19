import React from 'react'
import $ from 'jquery'
import {Redirect} from "react-router-dom"
import Col from "react-bootstrap/lib/Col"
import Row from "react-bootstrap/lib/Row"
import DonutChart from "react-donut-chart"
import { CSSTransitionGroup } from 'react-transition-group'
import LoadError from "./LoadError"
import PermissionError from "./PermissionError"
import "./css/vote.css"

class VottingConsole extends React.Component{
    static interval=null;
    static STDMapping={
        STD01:"Standard I",
        STD02:"Standard II",
        STD03:"Standard III",
        STD04:"Standard IV",
        STD05:"Standard V",
        STD06:"Standard VI",
        STD07:"Standard VII",
        STD08:"Standard VIII",
        STD09:"Standard IX",
        STD10:"Standard X",
        STD11:"Standard XI",
        STD12:"Standard XII"
    }
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
            listLoaded:false,
            loadError:false,
            loggedIn:false,
            displayData:[],
            chartData:[],
            listData:[],
            listDataSorted:[],
            listSortedLoaded:false,
            fullScreen:false,
            display:{
                currentPost:0,
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
            isHome:true,
            minialView:false,
            page:"",
            currentView:"home",
            autoPlayResult:false,
            data:null
            
        }
        this.navigateTo=this.navigateTo.bind(this);
        this.getChartData=this.getChartData.bind(this);
        this.getTopThree=this.getTopThree.bind(this);
        this.setCurrentPost=this.setCurrentPost.bind(this);
        this.setCurrentView=this.setCurrentView.bind(this);
        this.autoPlay=this.autoPlay.bind(this);
        this.requestFullScreen=this.requestFullScreen.bind(this);
        this.cancelFullScreen=this.cancelFullScreen.bind(this);
        this.toggleMinimalView=this.toggleMinimalView.bind(this);
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
            fetch(this.host+"/candidates/all/sorted",{method:"GET",credentials:"include"}).then(
                this.onListSortedJsonResult.bind(this),
                this.onJsonError.bind(this)
            )
        }

    }
    onListSortedJsonResult(result){
        if(result.ok){
            result.json().then(this.onListSortedJsonFetch.bind(this),this.onJsonError.bind(this))
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
           prevState.listLoaded=true;
            prevState.displayData=json.data;
            prevState.currentView="home";
            this.setState(prevState);
            this.getChartData();
            this.getTopThree();
        }
        else{
            prevState.loadError=true;
            this.setState(prevState);
        }

    }
    onListSortedJsonFetch(json){
        console.log(json);
        var prevState=this.state;
        if(json){
           prevState.listSortedLoaded=true;
            prevState.listDataSorted=json.data;
            this.setState(prevState);
        }
        else{
            prevState.loadError=true;
            this.setState(prevState);
        }

    }
    
    setCurrentView(view){
        var prevState=this.state;
        if(view!==null){
            prevState.currentView=view;
            this.setState(prevState);
        }
        
    }
    
    setCurrentPost(post){
        var prevState=this.state;
        if(post!==null){
            prevState.display.currentPost=post;
            this.setState(prevState);
        }
        this.getChartData();
        this.getTopThree();
        
    }
    navigateTo(url){
        var prevState=this.state;
        if(url!==null){
            prevState.isHome=false
            prevState.page=url;
            this.setState(prevState);
        }
        
    }
    getChartData(){
        if(this.state.listLoaded){
            var chartData=[];
            this.state.displayData.forEach(item => {
               if(item.candidate_post===this.state.display.data[this.state.display.currentPost].code){
                chartData.push({
                    label:item.candidate_name,
                    value:parseInt(item.votes,10)
                })
               }
                
            });
            chartData.sort(function(a, b){
                return b.value-a.value
            })
            var prevState=this.state;
            prevState.chartData=chartData;
            this.setState(prevState);
            console.log("votes:",chartData);
            
        }
    }
    getTopThree(){
        if(this.state.listLoaded){
            var clientData=[];
            this.state.displayData.forEach(item => {
               if(item.candidate_post===this.state.display.data[this.state.display.currentPost].code){
                clientData.push(item)
               }
            });
            clientData.sort(function(a, b){
                return b.votes-a.votes
            })
            var prevState=this.state;
            prevState.listData=clientData;
            this.setState(prevState);
            
        }
    }
    autoPlay(play){
        
        if(play){
            if(!VottingConsole.interval){
                clearInterval(VottingConsole.interval);
            }
            
            VottingConsole.interval=setInterval(()=>{
                var currentPost=this.state.display.currentPost;
                if(this.state.display.currentPost<this.state.display.data.length-1)
                    currentPost++;
                else
                    currentPost=0;
            this.setCurrentPost(currentPost);
            },7000);
           

        }
        else{
            if(VottingConsole.interval){
                clearInterval(VottingConsole.interval);
            } 
        }
        
        var prevState=this.state;
        prevState.autoPlayResult=play;
        this.setState(prevState)
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
    toggleMinimalView(){
        var prevState=this.state;
        prevState.minialView=!prevState.minialView;
        this.autoPlay(prevState.minialView);
        this.setState(prevState);
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
                       
                       if(this.state.currentView==="detailX"){
                       	const listDataSorted=this.state.listDataSorted
                        var resultViewList=[];
                        if(this.state.listSortedLoaded){
                            var lb=0,ub=6;
                            if(listDataSorted['STD01'][0].candidate_type==="SENIOR"){
				
				                lb=5
				                ub=12
                            }
                            for (var key in listDataSorted) {
                                if (listDataSorted.hasOwnProperty(key)) {

                                   
                                   resultViewList.push([
                                       <h4 style={{padding:"10px 30px"}} key={key+"_head"}>{VottingConsole.STDMapping[key]}</h4>,
                                       <div className="clearfix">
                                        {
                                            listDataSorted[key].map((item,i)=>(
                                                    (this.state.display.data[this.state.display.currentPost].code===item['candidate_post']) &&
                                                        
                                                        <UserCard key={item.candidate_id} hideRank votes={item.votes} name={item.candidate_name} thumb={"http://votehost.local/api/v1/thumb/"+item.candidate_id} small/>
                                                )
                                            )
                                        }
                                        </div>
                                   ])
                                   
                                }
                            } 
                        }
                        
                        currentView=(
                           
                            <div>
                                 
                                 <Col xs={12} md={12}>
                                    <h2 className="head_h">classwise votes for {this.state.display.data[this.state.display.currentPost].head}</h2>
                                     {
                                        
                                        resultViewList.slice(lb,ub) 
                                        
                                    }
                                         
                                     
                                 </Col>            
                            </div>
                         )  
                       }
                       else if(this.state.currentView==="detail"){
                       
                        
                        currentView=(
                           
                            <div>
                                 
                                 <Col xs={12} md={12}>
                                    <h2 className="head_h">{this.state.display.data[this.state.display.currentPost].head}</h2>
                                    <CSSTransitionGroup
                                    transitionName="chartLoad"
                                    transitionEnterTimeout={500}
                                    transitionLeaveTimeout={300}>      
                                    {
                                      this.state.listLoaded && this.state.listData.map((item,i)=>(
                                           <UserCard key={item.candidate_id} rank={i+1} votes={item.votes} name={item.candidate_name} thumb={"http://votehost.local/api/v1/thumb/"+item.candidate_id} small/>
                                       ))
                                    }
                                    </CSSTransitionGroup>
                                         
                                     
                                 </Col>            
                            </div>
                         )  
                       }
                       else{
                        currentView=(
                          
                          <div>
                              <h2 className="head_h">{this.state.display.data[this.state.display.currentPost].head}</h2>
                               <Col xs={12} md={8}>
                               <CSSTransitionGroup
                                    transitionName="chartLoad"
                                    transitionEnterTimeout={500}
                                    transitionLeaveTimeout={300}>
                                    <div
                                     
                                     key={this.state.display.currentPost}
                                    >
                                    <DonutChart
                                        data={this.state.chartData}
                                        
                                        className="chart_box"
                                    />
                                    </div>
                                </CSSTransitionGroup>
                               </Col>
                               <Col xs={12} md={4}>
                               <CSSTransitionGroup
                                    transitionName="chartLoad"
                                    transitionEnterTimeout={500}
                                    transitionLeaveTimeout={300}>
                                   {
                                      this.state.listLoaded && this.state.listData.slice(0,1).map((item,i)=>(
                                           <UserCard key={item.candidate_id} rank={i+1} votes={item.votes} name={item.candidate_name} thumb={"http://votehost.local/api/v1/thumb/"+item.candidate_id} fullSize/>
                                       ))
                                   }
                                </CSSTransitionGroup>
                               </Col>            
                          </div>
                       )
                      }
                       
                    return(
                        
                        <div className="home sub">
                        <div className="fs" onClick={()=>(this.state.fullScreen)?this.cancelFullScreen(document):this.requestFullScreen(document.documentElement)}><i className={(this.state.fullScreen)?"glyphicon glyphicon-resize-small":"glyphicon glyphicon-resize-full"}></i></div>
                        <div className="minimalView" style={(this.state.minialView)?{background:"#fff",color:"#000"}:{background:"#000",color:"#fff"}} onClick={this.toggleMinimalView}>M</div>
                        {this.state.minialView ||<header className="title-head sub">
                            <div>School Cabinet Election 2018</div>
                             <span>
                                Results
                            </span>
                            
                        </header>
                        }
                        
                        {this.state.minialView ||
                        <Row className="action sub" >
                        <div style={{minHeight:"30px"}}>
                            <Tile name="home" onClick={()=>this.navigateTo("/")}/>
                            <Tile name="Candidates" onClick={()=>this.navigateTo("/candidate/entry")}/>
                            <Tile name="Client Access" onClick={()=>this.navigateTo("/clientAccess")}/>
                            <Tile name={(this.state.autoPlayResult)?"Disable Autoplay":"Enable Autoplay"} width="180px" onClick={()=>{this.autoPlay(!this.state.autoPlayResult)}}/>
                            <Tile name={(this.state.currentView==="detailX")?"back":"Classwise Votes"} width="150px" onClick={()=>{this.setCurrentView((this.state.currentView==="detailX")?"home":"detailX")}}/>
                       
                            <Tile name={(this.state.currentView==="detail")?"back":"Detailed View"} width="180px" onClick={()=>{this.setCurrentView((this.state.currentView==="detail")?"home":"detail")}}/>
                        </div> 
                        
                        </Row>
                        }
                        <Row className="cont_box voteres">
                            {  this.state.minialView ||
                            <div className="head_box"  key="head_box">
                                <h3>Check Results</h3>
                                <button className="btn_main" onClick={()=>this.setCurrentPost(0)}>Head Boy</button>
                                <button className="btn_main" onClick={()=>this.setCurrentPost(1)}>Head Girl</button>
                                <button className="btn_main" onClick={()=>this.setCurrentPost(2)}>General Secretary</button>
                                <button className="btn_main" onClick={()=>this.setCurrentPost(3)}>General Captain</button>
                            </div>
                            }
                            
                            
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

const UserCard=(props)=>{
    
    return (
        <div className={props.fullSize?"u_card  big":"u_card  small"}>
            <div className="cont" style={{backgroundImage:"url('"+props.thumb+"')"}}></div>
            <div className="foot">
                <Col className="vt" md={4}>{props.votes}</Col>
                <Col md={8} className="nm">{props.name}</Col>
                
            </div>
            <span className="rank" style={props.hideRank&&{display:"none"}}>{props.rank}</span>

        </div>
    )
}
export default VottingConsole;
