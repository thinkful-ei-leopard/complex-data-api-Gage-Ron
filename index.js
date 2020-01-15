const searchURL =  'https://developer.nps.gov/api/v1/parks';
const apiKey = 'Qk2tjWXECgHdoIMbemJObeaaMAWYbyXyjA1Xane9';

/** fetch the parks with our API key */
function getParks(query, resultsNum) {
  const addresses = 'addresses';
  const params = {
    api_key: apiKey,
    stateCode: query,
    limit: resultsNum,
    fields: addresses
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => createHTML(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function createHTML(responseJson) {
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].addresses}</p>
      <p><a href='${responseJson.data[i].url}'>Click for More Info</a></p>
      </li>`
    )};
  $('#results').removeClass('hidden');
};

/** event listener */
function handleSubmit() {
  $('form').submit( event => {
    event.preventDefault();
    const searchTerm = $('#state-input').val();
    const maxResults = $('#max-results-input').val();
    getParks(searchTerm, maxResults);
  });
};

function main() {
  handleSubmit();
};

$(main);
