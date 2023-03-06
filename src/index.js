import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from "./js/fetchCountries";
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const cardRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

function onInput(e){
    listRef.innerHTML = '';
    cardRef.innerHTML = '';
    
    if (inputRef.value === '') {
        return;
    }
    fetchCountries(inputRef.value.trim())
    .then(data => {
        if(data.status === 404){
            throw new Error();
        }
        if (data.length > 10) {
            onOverLoad();
        }
        if (data.length >= 2 && data.length <= 10) {
            listBuilder(data);
        }
        if (data.length === 1) {
            cardBuilder(data);
        }
        return data;
    }).catch(onNotFound);
}

function listBuilder(list){
    const markup = [];
    for (const {name, flags} of list) {
        markup.push(`<li class="country-list__item">
        <img src="${flags.svg}" class="flag-ico" alt="${name}'s flag">
        <p>${name}</p>
      </li>`)
    }
    listRef.innerHTML = [...markup].join('');
}

function cardBuilder(country){
    const {name, flags, capital, population, languages} = country[0];
    const markup = `
    <div class="country-box"><img src="${flags.svg}" class="flag-ico" alt="${name}'s flag"><p class="title">${name}</p></div>
    <p><span class="bold">Capital: </span>${capital}</p>
    <p><span class="bold">Population: </span>${population}</p>
    <p><span class="bold">Languages: </span>${languages.map(language => language.name).join(", ")}</p>
    `;
    cardRef.innerHTML = [...markup].join('');
}

function onOverLoad(){
    Notiflix.Notify.info(
        "Too many matches found. Please enter a more specific name",
        {
          timeout: 2000,
        },
      )
}

function onNotFound(){
    Notiflix.Notify.failure(
        'Oops, there is no country with that name',
        {
          timeout: 2000,
        },
      )
}
