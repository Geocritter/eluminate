import React from 'react';
import './Contact.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
}));

const InputField = (props) => {
    const classes = useStyles();
    return (
        <div>
            <TextField style={props.style} className={classes.root} id="FirstNameOutlined" label={props.name}
                onChange={props.handleChange} />
        </div>
    )
}

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Fname: 'he1',
            Lname: 'he2',
            Email: '',
            Reason: ''
        };
        this.FhandleChange = this.FhandleChange.bind(this);
        this.LhandleChange = this.LhandleChange.bind(this);
        this.EhandleChange = this.EhandleChange.bind(this);
        this.RhandleChange = this.RhandleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    FhandleChange() {
        this.setState({
            Fname: event.target.value,
        });
    }
    LhandleChange() {
        this.setState({
            Lname: event.target.value,
        });
    }
    EhandleChange() {
        this.setState({
            Email: event.target.value,
        });
    }
    RhandleChange() {
        this.setState({
            Reason: event.target.value
        });
    }

    handleClick() {
        const url = "http://" + window.location.host + "/api/user/register"
        alert("Thanks for your submission!")
        
        console.log(this.state.Fname)
        console.log(this.state.Lname)
        console.log(this.state.Email)
        console.log(this.state.Reason)
        console.log(url)
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state)
        })
    }

    render() {
        return (
            <div className="contact">
                <h1>Stay in the loop!</h1>
                <InputField style={{ width: "20%" }} name={"First Name"} handleChange={this.FhandleChange} />
                <InputField style={{ width: "20%" }} name={"Last Name"} handleChange={this.LhandleChange} />
                <InputField style={{ width: "30%" }} name={"Email"} handleChange={this.EhandleChange} />
                <InputField style={{ width: "40%" }} name={"Where did you hear about us?"} handleChange={this.RhandleChange} />
                <p>{"\n"}</p>
                <Button style={{ background: '#e6e6e4' }} onClick={this.handleClick}>
                    Submit</Button>
            </div>
        )
    }
}

export default Contact;