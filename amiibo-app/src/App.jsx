import { useMemo, useEffect, useState } from 'react'
import { loadXHR } from './ajax';
import { readFromLocalStorage, writeToLocalStorage } from "./storage";
import './App.css'

// app "globals" and utils
const baseurl = "https://www.amiiboapi.com/api/amiibo/?name=";

const App = () => {
  const savedTerm = useMemo(() => readFromLocalStorage("term") || "", []);
  const [term, setTerm] = useState(savedTerm);
  const [results, setResults] = useState([]);

  useEffect(() => {
    writeToLocalStorage("term", term);
  }, [term]);

  const searchAmiibo = (name, callback) => {
    loadXHR(`${baseurl}${name}`, callback);
  };

  const parseAmiiboResult = xhr => {
    // get the `.responseText` string
    const response = xhr.responseText;

    // declare a json variable
    let json;

    // try to parse the string into a json object
    try {
      json = JSON.parse(response);
    }
    catch (e) {
      console.error(e);
      return;
    }

    // log out number of results (length of `json.amiibo`)
    console.log(`Number of results=${json.amiibo.length}`);

    // loop through `json.amiibo` and log out the character name
    setResults(json.amiibo);
  };

  console.log(results);
  return <>
    <header>
      <h1>Amiibo Finder</h1>
    </header>
    <hr />
    <main>
      <button onClick={(e) => { searchAmiibo(term, parseAmiiboResult) }}>Search</button>
      <label>
        <input value={term} onChange={(e) => { setTerm(e.target.value) }} />
      </label>
    </main>
    <hr />
    {results.map(amiibo => (
      <span key={amiibo.head + amiibo.tail} style={{ color: "green" }}>
        <h4>{amiibo.name}</h4>
        <img
          width="100"
          alt={amiibo.character}
          src={amiibo.image}
        />
      </span>
    ))}
    <footer>
      <p>&copy; 2023 Ace Coder</p>
    </footer>
  </>;
};

export default App
