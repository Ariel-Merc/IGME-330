const loadXHR = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => callback(xhr);
    xhr.onerror = (e) => console.error(e);
    // set up the connection
    xhr.open("GET", url);
    xhr.send();
    // when the data loads, invoke the callback function and pass it the `xhr` object
};

export { loadXHR };