import { getElement } from "./utils.js";

let words1 = [];

let words2 = [];

let words3 = [];

// load json when window loads
window.onload = () => {loadBabble(babbleLoaded)};

// get random elements from the words arrays and concat. to
// generate and output technobabble
const generateTechno = (num) => {
    let babble = "";
    for (let i = 0; i < num; i++) {
        babble = `${babble}<p>${getElement(words1)} ${getElement(words2)} ${getElement(words3)}</p>`;
    }
    console.log(babble);
    document.querySelector("#output").innerHTML = babble;
}

// callback function that will parse the JSON file
const babbleLoaded = (e) => {
    console.log(`In onload - HTTP Status Code = ${e.target.status}`);
    const data = e.target.responseText;
    let json;
    // try to parse data from json file
    try {
        json = JSON.parse(data);
    }
    catch {
        document.querySelector("#output").innerHTML = "json parse failed";
    }
    // initialize the words arrays using data from JSON file
    words1 = json.words1;
    words2 = json.words2;
    words3 = json.words3;

    // initialize button click events and load startup babble
    generateTechno(1);
    document.querySelector("#btn-gen-1").onclick = () => { generateTechno(1) };
    document.querySelector("#btn-gen-5").onclick = () => { generateTechno(5) };

}

// initiate the download of the JSON file
const loadBabble = (callback) => {
    console.log("inside load babble");
    const url = "data/babble-data.json";
    const xhr = new XMLHttpRequest();
    xhr.onload = callback;
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();
}


