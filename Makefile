.DEFAULT: ttrpg-audio-player

.PHONY: templates clean

ttrpg-audio-player: main.go templates
	go build .

templates:
	go tool templ generate

clean:
	-rm *_templ.go
	-rm ttrpg-audio-player
