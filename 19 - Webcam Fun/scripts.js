const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
    })
    .catch(err => {
        console.error(`OH NO!`, err);//catch error if user doesn't allow access to webcam
    });
}

//take frame from video and paint it on actual screen
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    //canvas has to be same width and height as video
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {//return setInterval, so if you ever need to stop painting you can have access to that interval and call clearInterval on it
     ctx.drawImage(video, 0, 0, width, height);//pass it an image (or video element), start at top left hand corner of canavs and paint width and height
     //take pixels out
     let pixels = ctx.getImageData(0, 0, width, height);
     //mess with them
     //pixels = redEffect(pixels);
     //pixels = rgbSplit(pixels);
     //ctx.globalAlpha = 0.8;//put transparency of 10% of current image on top
     pixels = greenScreen(pixels);

     //put them back
     ctx.putImageData(pixels, 0, 0);
    }, 16);//take frame every 16 ms
}

function takePhoto() {
    //played the sound
    snap.currentTime = 0;
    snap.play();
    //take data out of the canvas
    const data = canvas.toDataURL('image/jpeg');//create a link
    const link = document.createElement('a');//create an anchor link
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome WOman"/>`
    strip.insertBefore(link, strip.firstChild);//strip is where we dump our links
}

//filter -> get pixels out of canvas and change RGB values and put the values back in
function redEffect(pixels) {
    for(let i=0; i < pixels.data.length; i+=4){//increment by 4 to get to next red pixel (pixels are red, green, blue and alpha)
        pixels.data[i + 0] = pixels.data[i + 0] + 200;//RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50;//GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;//BLUE
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i=0; i < pixels.data.length; i+=4){//increment by 4 to get to next red pixel (pixels are red, green, blue and alpha)
        pixels.data[i - 150] = pixels.data[i + 0];//take pixel that is 150 pixels back and make it the current pixel
        pixels.data[i + 500] = pixels.data[i + 1];//take green and take pixel 100 forward and set it to current pixel
        pixels.data[i - 550] = pixels.data[i + 2];//do same thing with blue 
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};//level object holds minimum and maximum green 
    //green screen works by taking all pixels between this RGB value and takes them out
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
    
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;//fourth pixel is the alpha, and if you set it to 0 it will be transparent
      }
    }
  
    return pixels;
  }
getVideo();

video.addEventListener('canplay', paintToCanvas);//once video is played, it will emit an event called "canplay" and paintToCanvas will run as well
