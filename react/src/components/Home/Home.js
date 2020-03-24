import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

//Components
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Api from '../Apitest/Apitest';
import Footer from '../Footer/Footer';

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
        };
    }
    handleState = (item) => {
        this.setState({ items: item })
    }

    render() {
        var items = this.state.items;
        return (
            <div>
                <h1 className="App-sub"> Understand your clients </h1>
                <p className="App-body">
                    Learn what matters to your customer without needing to be a research expert</p>
                <Link to='/contact' style={{ textDecoration: 'none' }}>
                    <Grid container justify="center">
                        <Button style={{ background: '#e6e6e4' }}> Learn More </Button>
                    </Grid>
                </Link>
                <Grid container justify="center">
                    <Footer />
                </Grid>
            </div >
        )
    }

}

export default Home;
