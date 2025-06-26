class AudioPlayer extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    const playSVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
    const pauseSVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>';
    const loopSVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z"/></svg>';
    const trashSVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>';
    const volumeSVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>';

    const templateHtml = `
      <div class="audio-player">
        <style>
          button {
            background: none;
            border: none;
          }
          button svg {
            height: 1rem;
          }
          #loop {
            display: none;
          }
          #loop + label svg {
            fill: #ddd;
          }
          #loop:checked + label svg {
            fill: hsl(280, 50%, 50%);
          }
          #play-pause svg {
            height: 2rem;
          }
          input[type="range"] {
            accent-color: hsl(280, 50%, 50%);
          }
          label svg {
            height: 1rem;
          }
          .audio-player {
            gap: 1rem;
            justify-content: space-evenly;
            background: var(--bg);
            color: var(--text);
            fill: var(--text);
            padding: 1rem;
            border-radius: 8px;
            border: 2px solid var(--border);
          }
          .audio-player,
          .volume-container,
          .main,
          .actions {
            display: flex;
          }
          .main {
            flex-direction: column;
            justify-content: space-between;
          }
          .progress {
            flex-direction: column;
            text-align: right;
            padding: 4px;
          }
          .main .info {
            display: flex;
            flex-direction: column;
          }
          .main .info #name {
            font-weight: bold;
            font-size: 1.5rem;
          }
          .main .info #path {
            font-style: italic;
            color: hsl(0, 0%, 80%);
            word-break: break-all;
          }
          .progress input {
            width: 100%;
          }
          .volume-container {
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }
          .actions {
            flex-direction: column;
            justify-content: space-between;
          }
          .actions svg {
            height: 1.2rem;
          }
        </style>
        <div class="volume-container">
          <input
            orient="vertical"
            type="range"
            id="volume"
            value="100"
            min="0"
            max="100"
          />
          <label for="volume">${volumeSVG}</label>
        </div>
        <div class="main">
          <div class="info">
            <span id="name"></span>
            <span id="path"></span>
          </div>
          <button id="play-pause">${playSVG}</button>
          <div class="progress">
            <input type="range" id="scrubber" value="0" min="0" />
            <div id="progress">
              <span id="currentTime">0:00</span> /
              <span id="duration">0:00</span>
            </div>
          </div>
        </div>
        <div class="actions">
          <button id="delete">${trashSVG}</button>
          <input type="checkbox" id="loop" />
          <label for="loop">${loopSVG}</label>
        </div>
        <audio id="audio" src="" autoplay></audio>
      </div>
    `;

    const template = document.createElement("template");
    template.innerHTML = templateHtml;

    shadowRoot.appendChild(template.content.cloneNode(true));

    this.audio = shadowRoot.getElementById("audio");
    this.playPauseButton = shadowRoot.getElementById("play-pause");

    this.playPauseButton.addEventListener(
      "click",
      this.togglePlaying.bind(this),
    );

    this.loop = shadowRoot.getElementById("loop");
    this.loop.addEventListener("change", this.toggleLooping.bind(this));

    this.audio.addEventListener("play", () => {
      this.playPauseButton.innerHTML = pauseSVG;
    });

    this.audio.addEventListener("pause", () => {
      this.playPauseButton.innerHTML = playSVG;
    });

    this.audio.addEventListener("ended", () => {
      this.playPauseButton.innerHTML = playSVG;
    });

    this.scrubber = shadowRoot.getElementById("scrubber");

    this.audio.addEventListener("durationchange", () => {
      this.scrubber.max = this.audio.duration;
    });

    this.scrubber.addEventListener("input", (e) => {
      this.audio.currentTime = e.target.value;
    });

    this.volume = shadowRoot.getElementById("volume");

    this.volume.addEventListener("input", (e) => {
      this.audio.volume = e.target.value / 100;
    });

    this.audio.addEventListener("volumechange", (e) => {
      this.volume.value = e.target.volume * 100;
    });

    this.audio.addEventListener("timeupdate", (e) => {
      this.scrubber.value = e.target.currentTime;
    });

    this.audio.addEventListener("timeupdate", this.updateProgress.bind(this));
    this.audio.addEventListener(
      "durationchange",
      this.updateProgress.bind(this),
    );

    this.progress = shadowRoot.getElementById("progress");

    shadowRoot.getElementById("delete").addEventListener("click", () => {
      this.parentNode.removeChild(this);
    });

    this.path = shadowRoot.getElementById("path");

    this.name = shadowRoot.getElementById("name");
  }

  static get observedAttributes() {
    return ["src", "label"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "src" && newValue) {
      this.audio.src = newValue;
      this.path.innerText = newValue;
      this.audio.load();
    }
    if (name === "label" && newValue) {
      this.name.innerText = newValue;
    }
  }

  togglePlaying() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  updateProgress(e) {
    const spans = this.progress.getElementsByTagName("span");
    const currentSpan = spans[0];
    const durationSpan = spans[1];

    const { currentTime, duration } = e.target;

    currentSpan.innerText = this.secondsToTimestamp(currentTime);
    durationSpan.innerText = this.secondsToTimestamp(duration);
  }

  secondsToTimestamp(time) {
    const roundedTime = Math.round(time);
    const minutes = Math.floor(roundedTime / 60);
    const seconds = Math.ceil(roundedTime % 60);
    return `${minutes}:${seconds > 9 ? seconds : `0${seconds}`}`;
  }

  toggleLooping() {
    this.audio.loop = this.loop.checked;
  }

  connectedCallback() {
    if (this.hasAttribute("src")) {
      this.audio.src = this.getAttribute("src");
      this.path.innerText = this.getAttribute("src");
    }
    if (this.hasAttribute("label")) {
      this.name.innerText = this.getAttribute("label");
    }
  }
}

customElements.define("audio-player", AudioPlayer);
