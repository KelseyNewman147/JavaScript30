// get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// build our functions
function togglePLay() {
    const method = video.paused ? 'play' : 'pause';//paused is  property that lives on the video
    video[method]();
}
    
function updateButton() {//listen to video for whenever it is paused
    const icon = this.paused ? '►' : '❚ ❚';//we can use "this" because it's bound to the video itself
    toggle.textContent = icon;
}
function skip() {
    console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip);//parseFloat converts string(this.dataset.skip) into a true number
}
function handleRangeUpdate() {
    video[this.name] = this.value;
}
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}
// hook up event listeners
video.addEventListener('click', togglePLay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);//listen for the video to emit an event called "timeupdate" and then run handleProgress
    //timeupdate will trigger when the video is updating its time code. won't unnecessarily run the function when video is paused

toggle.addEventListener('click', togglePLay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));//checks mousedown variable and runs scrub if true. won't run if false
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mousedown', () => mouseup = false);

// TODO - add full screen button to controls and make video go to full screen
