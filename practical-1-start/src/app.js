//TODO: Import the function(s) from dataFetcher.js
import {fetchData} from "./dataFetcher.js";
// TODO: Import the function(s) from uiHandler.js
import {renderList,populateDropdown} from "./uiHandler.js";

populateDropdown();

document.querySelector('#build-button').addEventListener('click', () => {
    const selectedCategory = document.querySelector('#category-select').value;
    
    const list = document.querySelector("#data-list").innerh;
    list = fetchData("data/parodyData.json", "songs", renderList);
    // TODO: Call fetchData to retrieve data from 'data/parodyData.json' 
    // for the selectedCategory. Then, in the callback function, use renderList 
    // to display the data in #data-list div.  See example usage in practical 
    // instructions.

});
