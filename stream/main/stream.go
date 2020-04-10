package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	speech "cloud.google.com/go/speech/apiv1"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	speechpb "google.golang.org/genproto/googleapis/cloud/speech/v1"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func main() {
	log.Println("live")
	r := mux.NewRouter()
	rru := r.PathPrefix("/api/stream").Subrouter()
	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{`*`}),
		//handlers.AllowedHeaders([]string{"content-type", "X-Csrf-Token", "withcredentials", "credentials"}),
		handlers.AllowedHeaders([]string{"content-type"}),
		handlers.AllowCredentials(),
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS", "HEAD"}),
	)
	rru.HandleFunc("/hello", sendTest).Methods("GET")
	log.Fatal(http.ListenAndServe(":8092", cors(rru)))
}

func sendTest(w http.ResponseWriter, r *http.Request) {
	log.Println("recieved request")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("unable to establish websocket")
		log.Print(err)
		w.WriteHeader(400)
		return
	}

	reader(conn)
}

func reader(conn *websocket.Conn) {
	for {
		/*for {
			// read in a message
			messageType, p, err := conn.ReadMessage()
			if err != nil {
				log.Println(err)
				return
			}
			// print out that message for clarity

			fmt.Printf("%T, %#v\n", p, p)

			if err := conn.WriteMessage(messageType, p); err != nil {
				log.Println(err)
				return
			}

		}*/
		// read in a message

		ctx := context.Background()
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		if err := ioutil.WriteFile("/config/test.ogg", p, 0644); err != nil {
			log.Fatal(err)
		}
		// Creates a client.
		client, err := speech.NewClient(ctx)
		if err != nil {
			log.Fatalf("Failed to create client: %v", err)
		}
		log.Println("client created")

		// Sets the name of the audio file to transcribe.
		//audio := "/config/recording.ogg"
		// Reads the audio file into memory.

		data, err := ioutil.ReadFile("/config/test.ogg")
		if err != nil {
			log.Fatalf("Failed to read file: %v", err)
		}
		// Detects speech in the audio file.
		resp, err := client.Recognize(ctx, &speechpb.RecognizeRequest{
			Config: &speechpb.RecognitionConfig{
				Encoding:        speechpb.RecognitionConfig_OGG_OPUS,
				SampleRateHertz: 48000,
				LanguageCode:    "zh",
			},
			Audio: &speechpb.RecognitionAudio{
				AudioSource: &speechpb.RecognitionAudio_Content{Content: data},
			},
		})
		log.Println(resp.Results)
		if err != nil {
			log.Fatalf("failed to recognize: %v", err)
		}

		// Prints the results.
		for _, result := range resp.Results {
			for _, alt := range result.Alternatives {
				fmt.Printf("\"%v\" (confidence=%3f)\n", alt.Transcript, alt.Confidence)
			}
		}
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}
