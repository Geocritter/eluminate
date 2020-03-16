package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func homeLink(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello world!")
}

func main() {
	log.Println("live")
	r := mux.NewRouter()
	rru := r.PathPrefix("/api/user").Subrouter()
	rru.HandleFunc("/hello", login).Methods("GET")
	log.Fatal(http.ListenAndServe(":8091", rru))
}

func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	resp := map[string]string{"greeting": "hello"}
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Println("encode error or fail to send response")
		w.WriteHeader(500)
	}
}
