// return a random element of an array
const getElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}
export {getElement};