package main

import (
	"fmt"
	"html/template"
	"log"
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

	audioFiles, err := getAudioFiles("./audio/", "/audio/")

	if err != nil {
		fmt.Printf("Error getting audio files %v\n", err)
		log.Fatalf("Server setup failed: %v", err)
	}

	http.HandleFunc("/api/sound", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()

		path := query.Get("path")

		tmpl := template.Must(template.ParseFiles("./templates/audio-player.html"))

		var matchedFile AudioFile

		for _, file := range audioFiles {
			if file.Path == path {
				matchedFile = file
				break
			}
		}

		if matchedFile.Path == "" {
			http.Error(w, "Could not find audio file", http.StatusNotFound)
		} else {
			err := tmpl.ExecuteTemplate(w, "audio-player.html", matchedFile)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
		}

	})

	http.HandleFunc("/api/sounds", func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.ParseFiles("./templates/audio-list.html"))

		values := r.URL.Query()

		var filteredAudio []AudioFile

		if values.Get("search") != "" {
			searchTerm := strings.ToLower(values.Get("search"))
			for _, file := range audioFiles {
				lowerPath := strings.ToLower(file.Path)

				if strings.Contains(lowerPath, searchTerm) {
					filteredAudio = append(filteredAudio, file)
				}
			}
		} else {
			filteredAudio = audioFiles
		}

		err := tmpl.ExecuteTemplate(w, "audio-list.html", filteredAudio)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

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
