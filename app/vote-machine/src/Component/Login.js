import React from "react"
import {Redirect} from "react-router-dom"
import Col from "react-bootstrap/lib/Col"
import Row from "react-bootstrap/lib/Row"
import LoadError from "./LoadError"
import $ from 'jquery'
import "./css/login.css"
class Login extends React.Component{
    
    constructor(props){

        super(props);
        this.host="http://votehost.local/api/v1"
        this.urlStatus= "/login/status"
        this.url= "/login"
        this.urlToClone= "/cloneSession"
        
        
        fetch(this.host+this.urlStatus,{method:"GET",credentials:"include"}).then(
            this.onJsonResult.bind(this),
            this.onJsonError.bind(this)
        )
        
        this.state={
            loaded:false,
            loadError:false,
            loggedIn:false,
            formData:{
                uname:"",
                upass:"",
                clone:{
                    uname:"",
                    upass:""
                }
            }
        }
        this.onUnameChange=this.onUnameChange.bind(this)
        this.onUpassChange=this.onUpassChange.bind(this)
        this.formSubmit=this.formSubmit.bind(this)
        this.onCloneUnameChange=this.onCloneUnameChange.bind(this)
        this.onCloneUpassChange=this.onCloneUpassChange.bind(this)
        this.formSubmitOnClone=this.formSubmitOnClone.bind(this)
        console.log(this.host+this.url)
        
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
    onUnameChange(e){
        var prevState=this.state;
        prevState.formData.uname=e.target.value;
        this.setState(prevState);

    }
    onUpassChange(e){
        var prevState=this.state;
        prevState.formData.upass=e.target.value;
        this.setState(prevState);

    }
    onCloneUnameChange(e){
        var prevState=this.state;
        prevState.formData.clone.uname=e.target.value;
        this.setState(prevState);

    }
    onCloneUpassChange(e){
        var prevState=this.state;
        prevState.formData.clone.upass=e.target.value;
        this.setState(prevState);

    }
    formSubmitOnClone(e){
        e.preventDefault();
        var data = new FormData();
        data.append("uname",this.state.formData.clone.uname);
        data.append("upass",this.state.formData.clone.upass);
       
        fetch(this.host+this.urlToClone,{method:"POST",body:data,credentials:"include"}).then(
            this.onJsonResult.bind(this),
            this.onJsonError.bind(this)
        )

    }
    formSubmit(e){
        e.preventDefault();
        var data = new FormData();
        data.append("uname",this.state.formData.uname);
        data.append("upass",this.state.formData.upass);
       
        fetch(this.host+this.url,{method:"POST",body:data,credentials:"include"}).then(
            this.onJsonResult.bind(this),
            this.onJsonError.bind(this)
        )

    }
  
    componentDidMount(){
        $("#preload").children().fadeOut("slow",function(){
            $("#preload").fadeOut("slow")
            $('body').css({"overflow-y":"scroll"})
        })
    }
    render(){
        if(this.state.loaded){
            
            if(this.state.loggedIn){
                return (
                    <Redirect to="/"/>
                )
            }
            else{
                $("#preload").children().fadeOut("slow",function(){
                    $("#preload").fadeOut("slow")
                })
                return (
                    <Row className="loginPage">
                        <Col xs={12} md={4} className="lg_content main">
                        <h4 className="h">Login</h4>
                            <form className="form-horizontal lg_form" onSubmit={this.formSubmit}>
                           
                                <div className="form-group">
                                     <label className="control-label col-sm-4" >User name</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" onChange={this.onUnameChange} value={this.state.formData.uname} placeholder="Enter user name"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                     <label className="control-label col-sm-4">Password</label>
                                    <div className="col-sm-8">
                                        <input type="password" className="form-control" onChange={this.onUpassChange} value={this.state.formData.upass} placeholder="Enter password"/>
                                    </div>
                                </div>
                                <Row>
                                    <input type="submit" className="btn btn-primary pull-right" value="Login" style={{width:"100px",margin:"15px"}}></input>
                                </Row>

                                



                            </form>
                        </Col>
                        <Col xs={12} md={3} className="lg_content sub">
                        <h4 className="h">Clone Session</h4>
                            <form className="form-horizontal lg_form" onSubmit={this.formSubmitOnClone}>
                           
                                <div className="form-group">
                                     <label className="control-label col-sm-4" for="email">User name</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" onChange={this.onCloneUnameChange} value={this.state.formData.clone.uname} placeholder="Enter user name"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                     <label className="control-label col-sm-4" for="email">Token</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" onChange={this.onCloneUpassChange} value={this.state.formData.clone.upass} placeholder="Enter Token"/>
                                    </div>
                                </div>
                                <Row>
                                    <input type="submit" className="btn btn-primary pull-right" value="Clone Session" style={{width:"150px",margin:"15px"}}></input>
                                </Row>

                                



                            </form>
                        </Col>

                    </Row>
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
export default Login
