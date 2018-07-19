import React from "react"
import Col from "react-bootstrap/lib/Col"
import Row from "react-bootstrap/lib/Row"
import $ from 'jquery'
import "./css/override.css"
class NotFound extends React.Component{
    componentDidMount(){
        $("#preload").children().fadeOut("slow",function(){
            $("#preload").fadeOut("slow")
        })
    }
    render(){
        const linkStyle={
            
            margin:"50px 0px",
            textAlign:"center",
            display:"block",
            width:"150px",
            padding:"5px 10px",
            backgroundColor:"#27a3a8",
            borderRadius:"0px",
            fontSize:"1.1em",
            fontFamily:"Lato,sans-serif"
        }
        return (
        <Row>
                
            <Col xs={12} md={12} className="main_box_error" style={{marginTop:"12%"}}>
                <h4  style={{fontSize:"3em",fontFamily:"Lato"}}>404</h4>
                <h3 className="head" style={{fontSize:"2em",marginTop:0,color:"#fff"}}>Page not found</h3>
                <p style={{color:"#ddd"}}>
                    The page you're looking for does not exist <br/>  
                </p>
                <a href="/" style={linkStyle}>homepage</a>
                
            </Col>
            
        </Row>
        )   
    }
}
export default NotFound