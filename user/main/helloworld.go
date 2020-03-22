package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func main() {
	log.Println("live")
	r := mux.NewRouter()
	rru := r.PathPrefix("/api/user").Subrouter()
	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{`*`}),
		//handlers.AllowedHeaders([]string{"content-type", "X-Csrf-Token", "withcredentials", "credentials",}),
		handlers.AllowedHeaders([]string{"content-type"}),
		handlers.AllowCredentials(),
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS", "HEAD"}),
	)
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	clientOptions := options.Client().ApplyURI("mongodb://dev:dev@mongo:27017")
	client, _ = mongo.Connect(ctx, clientOptions)
	rru.HandleFunc("/hello", sendTest).Methods("GET")
	rru.HandleFunc("/register", register).Methods("POST")
	log.Fatal(http.ListenAndServe(":8091", cors(rru)))
}

func sendTest(w http.ResponseWriter, r *http.Request) {
	log.Println("recieved request")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	resp := map[string]string{"greeting": "hello"}
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Println("encode error or fail to send response")
		w.WriteHeader(500)
	}
}
func register(w http.ResponseWriter, r *http.Request) {
	log.Println("recieved post request")
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	var query map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&query); err != nil {
		log.Println("invalid query parameters")
		w.WriteHeader(400)
		return
	}
	log.Println(query)
	collection := client.Database("usercollector").Collection("user")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	result, _ := collection.InsertOne(ctx, query)
	log.Println(result)
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(result)

}
