import './css/styles.css';
import API from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function searchCountry(e) {
  const inputName = e.target.value;
  if (inputName.length < 1) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

  API.fetchCountries(inputName.trim())
    .then(countries => {
      if (countries.status === 404) {
        throw new Error(countries.status);
      }
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';

      if (countries.length >= 2 && countries.length <= 10) {
        renderList(countries);
      }

      if (countries.length === 1) {
        renderCountry(countries);
      }
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      }
    })
    .catch(er => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderList(countries) {
  const markupList = countries
    .map(country => `<li><img class="flag" src="${country.flags.svg}"> ${country.name}</li>`)
    .join('');
  refs.countryList.insertAdjacentHTML('afterbegin', markupList);
}

function renderCountry(countries) {
  const markupCountry = countries.map(country => {
    const countryLangString = country.languages.map(language => language.name).join(', ');
    return `<h1><img class="flag_title" src="${country.flags.svg}">${country.name}</h1>
    <p class="atrib">Capital: <span class="text">${country.capital}</span></p>
    <p class="atrib">Population: <span class="text">${country.population}</span></p>
    <p class="atrib">Languages: <span class="text">${countryLangString}</span></p>`;
  });
  refs.countryInfo.insertAdjacentHTML('afterbegin', markupCountry);
}

refs.input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
