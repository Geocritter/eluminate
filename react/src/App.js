import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Components test
import Appbar from './components/Appbar/Appbar';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Home from './components/Home/Home';
import Apitest from './components/Apitest/Apitest';

function App() {
    return (
        <div>
            <Router>
                <Appbar />
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/about' component={About} />
                    <Route path='/contact' component={Contact} />
                    <Route path='/api' component={Apitest} />
                </Switch>
            </Router>
        </div>
    )
}

export default App;
