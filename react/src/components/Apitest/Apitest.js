import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            items: [],
        }
    }

    componentDidMount() {
        const url = "http://" + window.location.host + "/api/user/hello"
        console.log(url)
        fetch(url)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json,
                })
            })
    }

    handleClick() {
        var jsonItems = this.state.items;
        console.log(jsonItems)
        this.props.jsonList(jsonItems);
    }

    render() {
        return (
            <div className="style">
                <Button style={{ background: '#FF0000' }} onClick={this.handleClick.bind(this)} >
                    Test </Button>
            </div>
        )
    }
}
