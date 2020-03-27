import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';

//Components
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '../Paper/Paper';
import Background from './Pictures/yellow.png';
import Background2 from './Pictures/man_interview.jpg';
import Lumi from './Pictures/Lumi.png';
import Arrow from './Pictures/arrow_down.png';
import Pagedown from './Pictures/down-arrow_notext.png'

const imageurl = window.innerWidth >= 950 ? Background2 : Background;

var sectionStyle1 = {
    width: "100%",
    height: "100vh",
}
var sectionStyle2 = {
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${imageurl})`
}
var sectionStyle3 = {
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${Background})`
}

const styles = theme => ({
    root: {
        height: 60,
    },
    container: {
        display: 'flex',
    },
});

class Home extends React.Component {

    handleState = (item) => {
        this.setState({ items: item })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="container">
                <section style={sectionStyle3}>
                    <h1 className="title" > eLuminate </h1>
                    <h1 className="App-sub4"> Making interviews easy </h1>
                    <Grid container justify="center">
                        <Fade>
                            <img className="img2" src={Pagedown}></img>
                        </Fade>
                    </Grid>
                </section>
                <section style={sectionStyle1} className="child">
                    <h1 className="App-sub"> Meet Lumi, your personal interview assistant </h1>
                    <Grid container justify="center">
                        <img src={Lumi}></img>
                    </Grid>
                </section>

                <section style={sectionStyle1} className="child">
                    <div className="App-sub3">
                        <Fade top>
                            <h1>Lumi is a bot that...</h1>
                        </Fade>
                    </div>
                    <div className="App-body">
                        <Fade top>
                            <Grid container justify="center" className={classes.root}>
                                <Paper test={"Listens in to your interviews"} />
                            </Grid>
                            <img className="img" src={Arrow} />
                        </Fade>
                        <Fade top>
                            <Grid container justify="center" className={classes.root}>
                                <Paper test={"Finds follow-up questions to dig deeper"} />
                            </Grid>
                            <img className="img" src={Arrow} />
                        </Fade>
                        <Fade top>
                            <Grid container justify="center" className={classes.root}>
                                <Paper test={"Finds reliable facts and real stories"} />
                            </Grid>
                            <img className="img" src={Arrow} />
                        </Fade>
                        <Fade top>
                            <Grid container justify="center" className={classes.root}>
                                <Paper test={"Reduces bias and increase fairness between interviews"} />
                            </Grid>
                        </Fade>
                    </div>
                </section>

                <section style={sectionStyle2} className="child">
                    <h1 className="App-sub2"> Lumi also helps build  {"\n"} trust across all interviews</h1>

                </section>

                <section style={sectionStyle1} className="child">
                    <h1 className="App-sub"> Understand your clients </h1>
                    <p className="App-body">
                        Learn what matters to your customer without needing to be a research expert</p>
                    <Link to='/contact' style={{ textDecoration: 'none' }}>
                        <Grid container justify="center">
                            <Button style={{ background: '#e6e6e4' }}> Learn More </Button>
                        </Grid>
                    </Link>
                </section>



            </div >
        )
    }

}
Home.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Home);
