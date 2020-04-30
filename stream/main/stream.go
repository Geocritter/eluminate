package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	speech "cloud.google.com/go/speech/apiv1"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	speechpb "google.golang.org/genproto/googleapis/cloud/speech/v1"
)

var c1 = make(chan string)
var client *mongo.Client

type blobObj struct {
	Session  string `json:"session"`
	StopTime int64  `json:"stopTime"`
}

type saveObj struct {
	Session  string `json:"session" bson:"session"`
	StopTime int64  `json:"stopTime" bson:"stopTime"`
	Blob     []byte `bson:"blob"`
}

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
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	clientOptions := options.Client().ApplyURI("mongodb://dev:dev@mongo:27017")
	client, _ = mongo.Connect(ctx, clientOptions)
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
	//initialize structures
	var Obj blobObj
	var sObj saveObj
	for {
		//read websocket
		_, p, err1 := conn.ReadMessage()
		if err1 != nil {
			log.Println(err1)
			return
		}
		//unmarshal data from socket to json
		err2 := json.Unmarshal(p, &Obj)
		if err2 != nil {

			//save last-recieved metaobject
			sObj.Session = Obj.Session
			sObj.StopTime = Obj.StopTime
			sObj.Blob = p
			go saveToDb(sObj)
			//send to google
			go transcript(Obj, p)

		}

	}
}

func saveToDb(Obj saveObj) {
	collection := client.Database("Lumi").Collection("transcript")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	if _, err := collection.InsertOne(ctx, Obj); err != nil {
		log.Println(err)
	}
}

func transcript(Obj blobObj, p []byte) {
	ctx := context.Background()

	// Creates a client.
	gClient, err := speech.NewClient(ctx)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	// Detects speech in the audio file.
	resp, err := gClient.Recognize(ctx, &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding:        speechpb.RecognitionConfig_OGG_OPUS,
			SampleRateHertz: 48000,
			LanguageCode:    "en-CA",
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: p},
		},
	})
	if err != nil {
		log.Fatalf("failed to recognize: %v", err)
	}
	// Save the results.
	for _, result := range resp.Results {
		for _, alt := range result.Alternatives {
			fmt.Println(alt.Transcript)
			collection := client.Database("Lumi").Collection("transcript")
			ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
			filter := bson.D{{"session", Obj.Session}, {"stopTime", Obj.StopTime}}
			updateData := bson.D{
				{"$set", bson.D{{"gTranscript", alt.Transcript}}}}
			_ = collection.FindOneAndUpdate(ctx, filter, updateData)
		}
	}

}
