package main

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type AudioFile struct {
	Id string `json:"string"`
	Name string `json:"name"`
	Path string `json:"path"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Could not load .env file %v", err)
	}
	audioFS := http.FileServer(http.Dir("./audio"))
	http.Handle("/audio/", http.StripPrefix("/audio/", audioFS))
	publicFS := http.FileServer(http.Dir("./public"))
	http.Handle("/", http.StripPrefix("/", publicFS))

	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		log.Fatal("DB_URL was undefined")
	}

	db, err := sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatalf("Error opening database %v", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatalf("Error connecting to the database %v", err)
	}

	fmt.Println("Successfully connected to database")

	shouldIndex := false

	if shouldIndex {
		fmt.Println("Indexing audio files...")

		audioFiles, err := getAudioFiles("./audio/", "/audio/")

		if err != nil {
			fmt.Printf("Error getting audio files %v\n", err)
			log.Fatalf("Server setup failed: %v", err)
		}

		for _, file := range audioFiles {
			stmt, err := db.Prepare("insert into sounds (name, path) values ($1, $2)")
			if err != nil {
				log.Fatalf("Error preparing statement %v", err)
			}
			defer stmt.Close()
			_, err = stmt.Exec(file.Name, file.Path)
			if err != nil {
				fmt.Printf("Error executing statement %v", err)
			}
		}
	}

	tmpl := template.Must(template.ParseGlob("./templates/*.html"))

	http.HandleFunc("/api/sound/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")

		stmt, err := db.Prepare("select Id, Name, Path from sounds where id = $1")

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		var audiofile AudioFile
		err = stmt.QueryRow(id).Scan(&audiofile.Id, &audiofile.Name, &audiofile.Path)

		if err != nil {
			if err == sql.ErrNoRows {
				http.NotFound(w, r)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = tmpl.ExecuteTemplate(w, "audio-player.html", audiofile)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

	})

	http.HandleFunc("/api/sounds", func(w http.ResponseWriter, r *http.Request) {

		values := r.URL.Query()

		var rows *sql.Rows

		if values.Get("search") != "" {
			searchTerm := values.Get("search")
			stmt, err := db.Prepare("select Id, Name, Path from sounds where path ilike $1")
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer stmt.Close()

			rows, err = stmt.Query("%" + searchTerm + "%")
		} else {
			stmt, err := db.Prepare("select Id, Name, Path from sounds")
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer stmt.Close()

			rows, err = stmt.Query()
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var sounds []AudioFile
		for rows.Next() {
			var sound AudioFile
			err := rows.Scan(&sound.Id, &sound.Name, &sound.Path)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			sounds = append(sounds, sound)
		}

		err := tmpl.ExecuteTemplate(w, "audio-list.html", sounds)

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
		} else {
			subDirURLPrefix := filepath.Join(urlPrefix, entry.Name())
			subDirURLPrefix = strings.ReplaceAll(subDirURLPrefix, "\\", "/")

			subAudioFiles, err := getAudioFiles(filepath.Join(dirPath, entry.Name()), subDirURLPrefix)

			if err != nil {
				return nil, err
			}
			audioFiles = append(audioFiles, subAudioFiles...)
		}
	}

	return audioFiles, nil
}
