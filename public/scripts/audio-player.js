/**
 * Get the parent `.audio-player`
 * @param {HTMLElement} el
 */
function getParentAudioPlayer(el) {
  return el.closest(".audio-player");
}

/**
 * Get the `audio` element within the parent `.audio-player`
 * @param {HTMLElement} el
 */
function getRelatedAudio(el) {
  return getParentAudioPlayer(el).querySelector("audio");
}

/**
 * Convert seconds like 123 to a timestamp like 2:03
 * @param {number} seconds
 */
function secondsToTimestamp(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.round(seconds) % 60).padStart(2, "0")}`;
}

/**
 * Remove an `.audio-player` from the DOM
 * @param {HTMLElement} el
 */
function playerRemove(el) {
  getParentAudioPlayer(el).remove();
}

/**
 * Toggle whether the `.audio-player` is playing
 * @param {HTMLElement} el
 */
function playerTogglePlaying(el) {
  const audio = getRelatedAudio(el);
  audio.paused ? audio.play() : audio.pause();
}

/**
 * Set the play/pause button to have the "Play" icon
 * @param {HTMLElement} el
 */
function playerSetPlayButton(el) {
  getParentAudioPlayer(el).querySelector(".play-pause").innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
}

/**
 * Set the play/pause button to have the "Pause" icon
 * @param {HTMLElement} el
 */
function playerSetPauseButton(el) {
  getParentAudioPlayer(el).querySelector(".play-pause").innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>`;
}

/**
 * Handle the time updating on the audio element
 * @param {Event} ev
 */
function handleTimeUpdate(ev) {
	const player = getParentAudioPlayer(ev.target);
	const timestamp = secondsToTimestamp(ev.target.currentTime);
	player.querySelector('.current-time').innerText = timestamp;
	player.querySelector('.scrubber').value = ev.target.currentTime;
}

/**
 * Handle the duration updating on the audio element
 * @param {Event} ev
 */
function handleDurationChange(ev) {
	const player = getParentAudioPlayer(ev.target);
	const timestamp = secondsToTimestamp(ev.target.duration);
	player.querySelector('.duration').innerText = timestamp;
	player.querySelector('.scrubber').max = ev.target.duration;
}

/**
 * Handle the scrubber being moved
 * @param {Event} ev
 */
function handleScrubbing(ev) {
	const audio = getRelatedAudio(ev.target);
	audio.currentTime = ev.target.value;
}

/**
	* Handle the changing of volume
	* @param {Event} ev
	*/
function handleVolumeChange(ev) {
	const audio = getRelatedAudio(ev.target);
	audio.volume = ev.target.value;
}

/**
	* Handle loop mode being toggled
	* @param {Event} ev
	*/
function handleLoopToggle(ev) {
	const audio = getRelatedAudio(ev.target);
	audio.loop = ev.target.checked;
}
