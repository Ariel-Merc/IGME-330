// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx:AudioContext;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element:HTMLAudioElement, 
sourceNode: MediaElementAudioSourceNode, 
analyserNode: AnalyserNode, 
gainNode: GainNode;

// 3 - here we are faking an enumeration
import { AudioDefaults } from './enums/audio-defaults.enum';

// declare filters
let biquadFilter: BiquadFilterNode, lowBiquadFilter: BiquadFilterNode;

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebAudio = (filePath: string) => {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio(); // doc.querySelector("audio")

    // 3 - have it point at a sound file
    loadSoundFile(filePath);

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // setup biquad filter
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "highshelf";

    lowBiquadFilter = audioCtx.createBiquadFilter();
    lowBiquadFilter.type = "lowshelf";

    // 5 - create an analyser node
    // note the UK spelling of "Analyser"
    analyserNode = audioCtx.createAnalyser();


    // 6 fft stands for Fast Fourier Transform
    analyserNode.fftSize = AudioDefaults.NumSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = AudioDefaults.Gain;

    // 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(biquadFilter); // hooking biquad in between source and analyser
    biquadFilter.connect(lowBiquadFilter);
    lowBiquadFilter.connect(analyserNode);

    // hook up the analyser
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

const loadSoundFile = (filePath: string) => {
    element.src = filePath;
}
const playCurrentSound = () => {
    element.play();
}
const pauseCurrentSound = () => {
    element.pause();
}
const setVolume = (value: string | number) => {
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

const toggleHighshelf = (highshelf: boolean) => {
    // toggle trebble on when checked off
    console.log("Highshelf toggle:", highshelf);
    if (highshelf) {
        biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
    } else {
        biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

const toggleLowshelf = (lowshelf: boolean) => {
    // toggle base on when checked off
    console.log("Lowshelf toggle:", lowshelf);
    if (lowshelf) {
        lowBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
        lowBiquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
    } else {
        lowBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

export {
    audioCtx, setupWebAudio, playCurrentSound, pauseCurrentSound,
    loadSoundFile, setVolume, toggleHighshelf, toggleLowshelf, analyserNode
};