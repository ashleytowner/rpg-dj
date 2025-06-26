# RPG DJ

> [!IMPORTANT]
> This is still in really early development. There may be bugs, and it lacks features
> Check the upcoming features section to learn about how this project will change.

RPG DJ is an audio-player which allows you to layer multiple sounds at once,
control the individual volume of sounds, toggle looping, etc. It is in the same
vein as [Kenku.FM](https://www.kenku.fm/) or [dScryb's Opus](https://dscryb.com/about-opus/) 
with a few key changes, to fix issues I've had with other TTRPG audio software.

- **You use your own audio files**
- It will automatically parse your audio files, without you having to manually import them
- It is fully searchable, so you can find the right sound at the right moment
- There's no subscription, you can just run it locally

![image](https://github.com/user-attachments/assets/08b610ab-b589-4155-9128-0aab19992c4d)


## How to Use

### Sharing the audio

As of now, there's no in-built way to share the audio, however I'll be adding
some in the future. In the meantime, if you're playing online you can share
your screen via discord, or if you're playing in-person you can connect to a
bluetooth speaker

### Where do I actually get audio?

That's largely up to you. I created this project because I was sick of paying
subscriptions or using tools which had super limited audio. The audio I use is
from Michael Ghelfi Studios, mostly the audio from their bandcamp.

## Installation

1. Ensure `go` is installed
2. Put all the audio files you want to use into the `audio/` directory
3. Run `go run .`

## Upcoming Features

- Pagination and/or infinite scrolling, so that you don't have all of the audio files listed on the page at once
- A database, so that we don't have to hold all audio files in memory at once
- Better searching
- Audio sharing, so you can send a link to your players and allow them to listen along
- A docker image for easier setup
- Saved states, so you can reload without losing all your audio
- Audio tagging

## License

As of yet, I've not picked a license. This current version is free for personal
use by you, and you can use it during your TTRPG games to manage the audio you
share with your players.

I'll add a real license soon.
