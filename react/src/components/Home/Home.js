import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

//Components
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Api from '../Apitest/Apitest';

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
            <div className="background">
                <h1 className="App-sub"> Understand your clients </h1>
                <p className="App-body">
                    Learn what matters to your customer without needing to be a research expert</p>
                <Link to='/contact' style={{ textDecoration: 'none' }}>
                    <Grid container justify="center">
                        <Button style={{ background: '#e6e6e4' }}> Learn More </Button>
                    </Grid>
                </Link>
                <h1>{"\n"}</h1>

                <Grid container justify="center">
                    <Api
                        jsonList={this.handleState.bind(this)} />
                </Grid>
                <Grid container justify="center">
                    <ul className="li">
                        <li key={items.greeting}>
                            {items.greeting}
                        </li>
                    </ul>
                </Grid>


                <p className="App-foot" />
            </div>
        )
    }

}

export default Home;
