# Audio Visualizer
A fun audio-visual experience that you can watch along with any of your favorite songs! I built this project with the memories of being a kid and watching the audio-visualizer on the old windows music player while listening to my favorite songs.

## Technologies Used
- Vanilla JavaScript
- HTML5
- CSS3
- WebAudioApi
- HTML Canvas

All of the components of this app were written in HTML and manipulated using vanilla JavaScript and CSS. Using the built in WebAudioApi, I was able to analyze music data from audio files and turn it into a dataset that I could use to present images on the screen. The music data affects the colors, sizes, and movement speed of the shapes being shown on the screen. There are also interactive controls to further customize your experience.

## Technical Challenges
Canvas was a pretty tricky learn in general but incredibly fun once you get the hang of it. One of the hardest parts of the project to accomplish was actually the floating balls you see bubbling up in the background. Each of those balls needs their own location information so they can be redrawn in an appropriate location to give the illusion of movement.

<img src="/readme-screenshots/drawCircles.png" />

Before the project had even gotten kicked off, using and understanding the WebAudioApi was my first challenge, but I was able to consistently build a way to change any audio data into data I can use in HTML Canvas.
Using AudioContext, a class built into vanilla JavaScript, I was able to get access to many methods such as createMediaElementSource, createAnalyser, and connect, that allow me to connect my audio data and analyze the information to build an array of integer values I can use to dictate size, shape, and color in HTML Canvas.

<img src="/readme-screenshots/webaudio.png" />

## Features

This is one page app that contains the scrub bar, visualizer, upload functionality, and interactive controls. I built the scrub bar from scratch by using the currentTime and duration properties of whatever audio is playing and keeping track of the location of the scrub control. The interactive controls are directly linked to the visualizer and change properties in real time.

<img src="/readme-screenshots/revealedUI.png" />

The main attraction is the visualizer, though! So if you don't feel like looking at the scrub bar, or fiddling with the interactive controls, you can hide the UI ( with the exception of the reveal UI button, of course! ) to focus only on the music and the visuals!

<img src="/readme-screenshots/hiddenUI.png" />

## Future Direction

It would be interesting to discover more capabilities of HTML canvas with more user interactivity. I like the approach of keeping the app built in vanilla JavaScript, so I'm planning on introducing more event handlers to watch for mousemovements and clicks on the actual visualizer for added effects! Stay tuned!

### Original Proposal
Audio Visualizer Project
https://wireframe.cc/pro/pp/8f1ca2cd2429076

Overview:
* This audio visualizer will allow for a nice relaxing/exciting music listening experience. It will also have interactivity so every listen can give you something new!

MVPs:
* Allow user to upload their own music to visualize
* Have interactivity on the visualizer screen
* Allow for changing variables using sliders or dropdowns

Technology:
* Javascript
* Canvas/CSS Grid
* RequestAnimationFrame and AudioContext

Timeline:
* Monday - Use the basics of canvas or css grid to allow for different shapes/patterns to show up based on sound data
* Tuesday - Enhance shapes and patterns into something very pleasant to look at
* Wednesday - Work on creating interactive elements such as patterns changes onclick or onkeypress
* Thursday - Build up the interface to actually change certain variables such as speed and finish up interactivity
* Friday - Allow users to upload their own audio using input type=file & localstorage
