import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Logo from './logo.png';
import "./Appbar.css";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = {
    root: {
        flexGrow: 1,
        background: 'transparent', 
        boxShadow: 'none'
    },
    show: {
        transform: 'translateY(0)',
        transition: 'transform 1s',
    },
    hide: {
        transform: 'translateY(-110%)',
        transition: 'transform 0.5s',
    },
};

class NavBar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            shouldShow: null,
        };

        this.lastScroll = null;

        this.handleScroll = this.handleScroll.bind(this);
        // Alternatively, you can throttle scroll events to avoid
        // updating the state too often. Here using lodash.
        // this.handleScroll = _.throttle(this.handleScroll.bind(this), 100);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(evt) {
        const lastScroll = window.scrollY;

        if (lastScroll === this.lastScroll) {
            return;
        }

        const shouldShow = (this.lastScroll !== null) ? (lastScroll < this.lastScroll) : null;

        if (shouldShow !== this.state.shouldShow) {
            this.setState((prevState, props) => ({
                ...prevState,
                shouldShow,
            }));
        }

        this.lastScroll = lastScroll;
    }

    render() {
        const { classes } = this.props;
        return (
            <AppBar
                position="fixed"
                color="default"
                className={
                    `${classes.root} ${
                    this.state.shouldShow === null ? '' : (
                        this.state.shouldShow ? classes.show : classes.hide
                    )
                    }`
                }
            >
                <Toolbar>
                    <Link to='/'>
                        <img className="nav-picture"
                            style={{ cursor: 'pointer' }}
                            src={Logo} alt="logo" height="40px" width="160px" />
                    </Link>

                </Toolbar>
            </AppBar>
        );
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);