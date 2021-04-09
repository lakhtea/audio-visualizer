import "./styles/index.scss";
// build canvas
let canvas = document.getElementById("canvas");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

//create audio element
let audioElement = document.getElementById("source");
let audioCtx = new AudioContext();
let analyser = audioCtx.createAnalyser();

//how big the data array is
analyser.fftSize = 2048;

let source = audioCtx.createMediaElementSource(audioElement);
source.connect(analyser);
source.connect(audioCtx.destination);

//creating data array as only positive numbers
let data = new Uint8Array(analyser.frequencyBinCount);

//creating random color generator
// const chars = "abcdef0123456789".split("");
const chars = "#FFFF00#FFFF33#F2EA02#E6FB04#FF0000#FD1C03#FF3300#FF6600#00FF00#00FF33#00FF66#33FF00#00FFFF#099FFF#0062FF#0033FF#FF00FF#FF00CC#FF0099#CC00FF#9D00FF#CC00FF#6E0DD0#9900FF".split(
    "#"
);
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const randomColorGenerator = () => {
    // return `#${sample(chars)}${sample(chars)}${sample(chars)}${sample(
    //     chars
    // )}${sample(chars)}${sample(chars)}`;
    return `#${sample(chars)}`;
};

//setting ctx line width
ctx.lineWidth = 1;

//creating the looping function for animation
function loopingFunction() {
    setTimeout(() => requestAnimationFrame(loopingFunction), 50);
    analyser.getByteFrequencyData(data);
    draw(data);
}

function draw(data) {
    data = [...data];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let space = canvas.width / data.length;
    data.forEach((value, i) => {
        ctx.strokeStyle = randomColorGenerator();
        ctx.beginPath();
        // ctx.arc(
        //     // Math.floor(Math.random() * canvas.width),
        //     space * i,
        //     // Math.floor(Math.random() * canvas.height),
        //     canvas.height - value * 2,
        //     value / 10,
        //     5,
        //     2 * Math.PI
        // );
        // ctx.fillStyle = randomColorGenerator();
        // ctx.fillRect(20, 20, 150, 100);

        // ctx.stroke();
        let rand = Math.floor(Math.random() * canvas.width);
        ctx.moveTo(space * i, canvas.height); //x,y
        ctx.lineTo(space * i, canvas.height - value); //x,y
        // ctx.font = "30px Comic Sans MS";
        // ctx.fillStyle = "white";
        // ctx.fillText(`${value}`, canvas.width - 100, 100);

        ctx.stroke();
    });
}

audioElement.onplay = () => {
    audioCtx.resume();
    loopingFunction();
};
