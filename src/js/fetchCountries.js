export default function fetchCountries(name){
    // https://restcountries.com/v2/name/{name}
    const url = `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`;
    return fetch(url)
    .then(response => response.json());
}


