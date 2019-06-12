import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute'
import {Helmet} from 'react-helmet'
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import {checkAuthenticated} from './remote'
import Planner from './components/Planner';

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            isAuthenticated: false,
        }
        this.checkLogin()
    }

    checkLogin() {
        checkAuthenticated().then((res) => {
            if (res.status === 403) {
                this.setState({
                    isAuthenticated: false
                })
            } else {
                this.setState({
                    isAuthenticated: true
                })
            }
        })
    }

    login() {
        this.setState({
            isAuthenticated: true
        })
    }

    logout() {
        this.setState({
            isAuthenticated: false
        })
    }

    render() {
        return (
            <div className="App">
                <Helmet>
                    <meta name="viewport" content="width=device-width, maximum-scale=1, user-scalable=no"/>
                    <title>Planner</title>
                </Helmet>
                <Router basename="/planner">
                    <PrivateRoute path="/" exact 
                        component={Planner}
                        logout={this.logout.bind(this)}
                        isAuthenticated={this.state.isAuthenticated}
                        />
                    <Route path="/login" 
                        render={
                            (props) =>
                                <Login
                                    isAuthenticated={this.state.isAuthenticated}
                                    login={this.login.bind(this)}
                                    {...props}/>
                            }
                        />
                </Router>
                {/* <Planner/> */}
                {/* <Login/> */}
            </div>
        );
    }
}

export default App;
