import AudioContext from './AudioContext'

let analyser
let audioCtx
let mediaRecorder
let chunks = []
let name = "Tony"
let session = name + Date.now() + Math.floor(Math.random() * 100)
let startTime
let stream
let mediaOptions
let onStartCallback
let onStopCallback
let onSaveCallback
let onDataCallback
let constraints

navigator.getUserMedia = (navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia)

export class MicrophoneRecorder {
    constructor(onStart, onStop, onSave, onData, options, soundOptions) {
        const {
            echoCancellation,
            autoGainControl,
            noiseSuppression,
            channelCount
        } = soundOptions

        onStartCallback = onStart
        onStopCallback = onStop
        onSaveCallback = onSave
        onDataCallback = onData
        mediaOptions = options

        constraints = {
            audio: {
                echoCancellation,
                autoGainControl,
                noiseSuppression,
                channelCount
            },
            video: false
        }
    }

    startRecording = () => {
        startTime = Date.now()

        if (mediaRecorder) {
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume()
            }

            if (mediaRecorder && mediaRecorder.state === 'paused') {
                mediaRecorder.resume()
                return
            }

            if (audioCtx && mediaRecorder && mediaRecorder.state === 'inactive') {
                mediaRecorder.start()
                const source = audioCtx.createMediaStreamSource(stream)
                source.connect(analyser)
                if (onStartCallback) { onStartCallback() }
            }
        } else if (navigator.mediaDevices) {
            console.log('getUserMedia supported.')

            navigator.mediaDevices.getUserMedia(constraints)
                .then((str) => {
                    stream = str

                    if (MediaRecorder.isTypeSupported(mediaOptions.mimeType)) {
                        mediaRecorder = new MediaRecorder(str, mediaOptions)
                    } else {
                        mediaRecorder = new MediaRecorder(str)
                    }
                    if (onStartCallback) { onStartCallback() }
                    mediaRecorder.onstop = this.onStop

                    this.detectSilence(stream, this.onSilence, this.onSpeak)

                })
        } else {
            alert('Your browser does not support audio recording')
        }
    }

    onSilence() {
        console.log("silence")
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop()
            
        }
    }
    onSpeak() {
        console.log("speaking")
        mediaRecorder.ondataavailable = (event) => {
            var data = event.data
            console.log(data)
            chunks.push(data)
        }
    }

    pulse() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop()
        }
    }

    stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop()

            stream.getAudioTracks().forEach((track) => {
                track.stop()
            })
            mediaRecorder = null
            AudioContext.resetAnalyser()
        }
    }

    onStop() {
        const blob = new Blob(chunks, { type: mediaOptions.mimeType })
        chunks = []

        const blobObject = {
            "metadata": {
                "session": session,
                "stopTime": Date.now(),
            },
            "blob": blob,
        }

        if (onStopCallback) { onStopCallback(blobObject) }
        if (onSaveCallback) { onSaveCallback(blobObject) }
    }

    detectSilence(
        stream,
        onSoundEnd = _ => { },
        onSoundStart = _ => { },
        silence_delay = 100,
        min_decibels = -50
    ) {
        console.log(mediaRecorder.state)
        const ctx = AudioContext.getAudioContext()
        const analyser = AudioContext.getAnalyser()
        mediaRecorder.start()
        const streamNode = ctx.createMediaStreamSource(stream);
        streamNode.connect(analyser);
        analyser.minDecibels = min_decibels;

        const data = new Uint8Array(analyser.frequencyBinCount); // will hold our data
        let silence_start = performance.now();
        let triggered = true; // trigger only once per silence event
        console.log("starting silence detection")
        function loop(time) {
            requestAnimationFrame(loop); // we'll loop every 60th of a second to check
            analyser.getByteFrequencyData(data); // get current data
            if (ctx && mediaRecorder && mediaRecorder.state === 'inactive') {
                console.log("restarting...")
                mediaRecorder.start()
                const streamNode = ctx.createMediaStreamSource(stream)
                streamNode.connect(analyser)
                if (onStartCallback) { onStartCallback() }}
            if (data.some(v => v)) { // if there is data above the given db limit
                if (triggered) {
                    triggered = false;
                    onSoundStart();
                }
                silence_start = time; // set it to now
            }
            if (!triggered && time - silence_start > silence_delay) {
                onSoundEnd();
                triggered = true;
            }
        }
        loop();
    }


}
