import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Logo from './logo.png';
import "./Appbar.css";

function NavBar() {
    return (
        <div>
            <AppBar className="nav"
                style={{ background: '#e6e6e4' }}>
                <Toolbar>
                    <Link to='/'>
                        <img className="nav-picture"
                            style={{ cursor: 'pointer' }}
                            src={Logo} alt="logo" height="40px" width="160px" />
                    </Link>
                   
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar;