function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v2/name/${name}?fields=name,capital,currencies,population,languages,flags`,
  ).then(response => {
    return response.json();
  });
}

export default { fetchCountries };
