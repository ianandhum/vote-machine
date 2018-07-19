import React from "react"
import Col from "react-bootstrap/lib/Col"
import Row from "react-bootstrap/lib/Row"
import $ from 'jquery'
class LoadError extends React.Component{
    componentDidMount(){
        $("#preload").children().fadeOut("slow",function(){
            $("#preload").fadeOut("slow")
        })
    }
    reloadPage(){
        window.location.replace("/")
    }
    render(){
        $('body').css({background:"#f7f7f7"})
        const linkStyle={
            
                margin:"50px 0px",
                textAlign:"center",
                display:"block",
                width:"150px",
                padding:"5px 10px",
                backgroundColor:"#27a3a8",
                borderRadius:"0px",
                fontSize:"1.1em",
                fontFamily:"Lato,sans-serif",
                color:"#fff",
                cursor:"pointer"
        }
        var msg="ERR_NO_PERMISSION"
        if(this.props.msg!==undefined){
            msg=this.props.msg    
        }
        
        return (
            <Row>
                
                <Col xs={12} md={12} className="main_box_error" style={{marginTop:"12%"}}>
                    <h3 className="head" style={{fontSize:"3em",color:"#000"}}>403 </h3>
                    <p>
                        You are not allowed to perform this action <br/>
                        <b>{msg}</b><br/>
                        
                         
                    </p>
                    <span onClick={this.reloadPage} style={linkStyle}>home</span>
                    
                </Col>
                
            </Row>
        )   
    }
}
export default LoadError