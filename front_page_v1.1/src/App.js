import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Components
import Appbar from './components/Appbar/Appbar';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';

function App() {
    return (
        <div className="App-header">
            <Router>
                <Appbar />
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/about' component={About} />
                    <Route path='/contact' component={Contact} />
                </Switch>
                <Footer/>
            </Router>
        </div>
    )
}

export default App;
