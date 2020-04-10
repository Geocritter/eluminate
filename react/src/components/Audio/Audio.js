import { ReactMic } from '../Reactmic';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Audio.css';
import { connect, sendMsg } from "./index";



class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: false,
            downloadLinkURL: null,
        }
        connect();
    }

    startRecording = () => {
        this.setState({ record: true });
    }

    stopRecording = () => {
        this.setState({ record: false });
    }

    onData(recordedBlob) {
        console.log('chunk of real-time data is: ', recordedBlob.data);
        //sendMsg(recordedBlob.data)
    }

    onStop = (recordedBlob) => {
        this.setState({ blobURL: recordedBlob.blobURL })
        console.log('recordedBlob is: ', recordedBlob);
        sendMsg(recordedBlob.blob)
    }

    onSave = (blobObject) => {
        this.setState({
            downloadLinkURL: blobObject.blobURL
        })
    }

    render() {
        const { blobURL, downloadLinkURL } = this.state
        return (
            <div className="test">
                <Grid container justify="center">
                    <ReactMic
                        record={this.state.record}
                        className="sound-wave"
                        onStop={this.onStop}
                        onData={this.onData}
                        onSave={this.onSave}
                        strokeColor="#e6e6e4"
                        backgroundColor="#171640" />
                    <button onClick={this.startRecording} type="button">Start</button>
                    <button onClick={this.stopRecording} type="button">Stop</button>
                </Grid>
                <div>
                    <Grid container justify="center">
                        <audio ref="audioSource" src={blobURL} controls play />
                    </Grid>
                </div>
                <a
                    href={downloadLinkURL}
                    download={`recording2`}
                >download</a>
            </div>
        );
    }
}

export default Example;