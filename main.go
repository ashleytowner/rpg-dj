package main

import (
	"fmt"
	"html/template"
	// "log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type AudioFile struct {
	Name string `json:"name"`
	Path string `json:"path"`
}

func main() {
	audioFS := http.FileServer(http.Dir("./audio"))
	http.Handle("/audio/", http.StripPrefix("/audio/", audioFS))
	publicFS := http.FileServer(http.Dir("./public"))
	http.Handle("/", http.StripPrefix("/", publicFS))

	http.HandleFunc("/api/sound", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()

		path := query.Get("path")

		tmpl := template.Must(template.ParseFiles("./templates/audio-player.html"))

		data := struct {
			Name string
			Path string
		}{
			Name: "Foo",
			Path: path,
		}

		err := tmpl.ExecuteTemplate(w, "audio-player.html", data)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	// audioFiles, err := getAudioFiles("./audio/", "/audio/")

	// if err != nil {
	// 	fmt.Printf("Error getting audio files %v\n", err)
	// 	log.Fatalf("Server setup failed: %v", err)
	// }

	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	tmpl := template.Must(template.ParseGlob("./templates/*.html"))
	// 	data := struct {
	// 		Title string
	// 	}{
	// 		Title: "Hello",
	// 	}
	// 	err := tmpl.ExecuteTemplate(w, "index.html", data)
	//
	// 	if err != nil {
	// 		http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	}
	// })

	// http.HandleFunc("/api/play", func(w http.ResponseWriter, r *http.Request) {
	// 	tmpl := template.Must(template.ParseGlob("./templates/*.html"))
	// 	query := r.URL.Query()
	//
	// 	var matchedAudio AudioFile
	//
	// 	var path = query.Get("path")
	//
	// 	if path != "" {
	// 		for _, file := range audioFiles {
	// 			if file.Path == path {
	// 				matchedAudio = file
	// 			}
	// 		}
	// 	}
	//
	// 	if matchedAudio.Path != "" {
	// 		fmt.Println(matchedAudio)
	// 		err := tmpl.ExecuteTemplate(w, "audioplayerTemplate", matchedAudio)
	//
	// 		if err != nil {
	// 			http.Error(w, err.Error(), http.StatusInternalServerError)
	// 		}
	// 	} else {
	// 		http.Error(w, "Couldn't find audio", http.StatusNotFound)
	// 	}
	// })

	// http.HandleFunc("/api/audio", func(w http.ResponseWriter, r *http.Request) {
	// 	tmpl := template.Must(template.ParseGlob("./templates/*.html"))
	//
	// 	values := r.URL.Query()
	//
	// 	var filteredAudio []AudioFile
	//
	// 	if values.Get("s") != "" {
	// 		searchTerm := strings.ToLower(values.Get("s"))
	// 		for _, file := range audioFiles {
	// 			lowerPath := strings.ToLower(file.Path)
	//
	// 			if strings.Contains(lowerPath, searchTerm) {
	// 				filteredAudio = append(filteredAudio, file)
	// 			}
	// 		}
	// 	} else {
	// 		filteredAudio = audioFiles
	// 	}
	//
	// 	err := tmpl.ExecuteTemplate(w, "audiocardTemplate", filteredAudio)
	//
	// 	if err != nil {
	// 		http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	}
	// })

	fmt.Println("Listening on http://localhost:3000")
	http.ListenAndServe(":3000", nil)
}

func getAudioFiles(dirPath string, urlPrefix string) ([]AudioFile, error) {
	entries, err := os.ReadDir(dirPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read directory %s: %w", dirPath, err)
	}

	var audioFiles []AudioFile
	for _, entry := range entries {
		if !entry.IsDir() {
			fileName := entry.Name()
			ext := strings.ToLower(filepath.Ext(fileName))

			switch ext {
			case ".mp3", ".ogg", ".wav", ".flac", ".m4a":
				urlPath := filepath.Join(urlPrefix, fileName)
				urlPath = strings.ReplaceAll(urlPath, "\\", "/")

				audioFiles = append(audioFiles, AudioFile{
					Name: fileName,
					Path: urlPath,
				})
			}
		}
	}

	return audioFiles, nil
}
