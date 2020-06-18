This is the alpha version of eLuminate Lumi interview assistant. As of this version,
the bot can currently listen in on interviews, detect silences, and on silence, send the
current chunk of recorded audio to backend. Backend will process this information by 
passing it to GCP's audio processing API, and will send back a transcription.

All this is saved to MongoDB *in real time* [audio as a binary object, transcription as text]

Note: this is a full-stack application, and includes the files for various services such
as NGINX reverse proxy, node static page hosting, a MongoDB graphic manager in EXPRESS. It 
also features the docker-compose/dockerfiles used to create the Docker containers.

This was also designed to run in a AWS EC2 instance.