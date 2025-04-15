import * as main from "./main";
window.onload = () => {
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
	const loadJson = () => {
		const url = "data/av-data.json";
		const xhr = new XMLHttpRequest();
		xhr.onload = (e) => {
			const target = e.target as XMLHttpRequest;
			console.log(`In onload - HTTP Status Code = ${target.status}`);
			const data = target.responseText;

			let json: any;
			// try to parse data from json file
			try {
				json = JSON.parse(data);
			}
			catch {
				document.querySelector("#output").innerHTML = "json parse failed";
				return;
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

			Object.assign(main.drawParams, json.uiState);
		}

		xhr.onerror = e => {
			const target = e.target as XMLHttpRequest;
			console.log(`In onerror - HTTP Status Code = ${target.status}`);
		};
		xhr.open("GET", url);
		xhr.send();
	}
	// 2 - start up app
	loadJson();
	main.init();
}