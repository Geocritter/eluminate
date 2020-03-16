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

function Contact() {
    const classes = useStyles();

    return (
        <div className="contact">
            <h1>Stay in the loop!</h1>
            
            <TextField className={classes.root}id="FirstNameOutlined" label="First Name*" />
            <TextField className={classes.root}id="FirstNameOutlined" label="Last Name*" />
            <p>{"\n"}</p>
            <TextField style={{width: "30%"}} className={classes.root}id="FirstNameOutlined" label="Email Address*" />
            <p>{"\n"}</p>
            <TextField style={{width: "40%"}}className={classes.root}id="FirstNameOutlined" label="How did you hear about us?" />
            <p>{"\n"}</p>
            <Button style={ { background: '#e6e6e4'} }>Submit</Button>
        </div>
    )
}

export default Contact;
