import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    root: {
        width: 750
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: "#285b8d",
        background: "#e6e6e4"
    },
}));

export default function AutoGrid(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid item xs>
                <Paper className={classes.paper}>{props.test}</Paper>
            </Grid>
        </div>
    );
}