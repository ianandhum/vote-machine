import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter , Route  , Switch} from 'react-router-dom';
import './index.css';
import NotFound from "./Component/NotFound";
import Home from "./Component/Home";
import Login from "./Component/Login";
import CandidateEntry from './Component/CandidateEntry';
import VottingConsole from './Component/VottingConsole';
import ClientAccess from './Component/ClientAccess';
class App extends React.Component{

    render(){
        return(
             <BrowserRouter>
                 <Switch>
                     <Route path="/" exact component={Home} />
                     <Route path="/login" exact component={Login}/>
                     <Route path="/candidate/entry" exact component={CandidateEntry}/>
                     <Route path="/vottingConsole" exact component={VottingConsole}/>
                     <Route path="/clientAccess" exact component={ClientAccess}/>
                     <Route path="*" component={NotFound}/>
                     
                 </Switch>
             </BrowserRouter>
         );
    }     
 }
ReactDOM.render(<App />, document.getElementById('root'));