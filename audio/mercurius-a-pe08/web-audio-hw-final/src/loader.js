import * as main from "./main.js";
window.onload = () => {
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
	function loadJson() {
		const url = "data/av-data.json";
		const xhr = new XMLHttpRequest();
		xhr.onload = (e) => {
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

			// populate header
			let header = document.querySelector("h1");
			header.innerHTML = json.title;

			// populate track selection
			let trackSelect = document.querySelector("#select-track");
			for (let track of json.audioFiles) {
				let option = document.createElement("option");
				option.value = track.fileName;
				option.innerHTML = track.trackName;
				trackSelect.appendChild(option);
			}

			// populate ui selections
			for (let param in json.uiState) {
				main.drawParams[param] = json.uiState[param];
			}
		}

		xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
		xhr.open("GET", url);
		xhr.send();
	}
	// 2 - start up app
	loadJson();
	main.init();
}