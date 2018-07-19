import React from 'react'
import $ from 'jquery'
import {Redirect} from "react-router-dom"
import LoadError from "./LoadError"
import AdminView from "./View/AdminView"
import ClientView from "./View/ClientView"
import "./css/home.css"
class Home extends React.Component{
    
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
            loggedIn:false
        }
        
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
  
    render(){

        if(this.state.loaded){
            
            if(this.state.loggedIn){
                $("#preload").children().fadeOut("slow",function(){
                    $("#preload").fadeOut("slow")
                })
                if(this.state.data.admin){
                    return(
                        
                            <AdminView loginStatus={{...this.state.data}}/>
                        
                    )
                }
                else {
                    return (
                        <ClientView loginStatus={{...this.state.data}}/>
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

export default Home;