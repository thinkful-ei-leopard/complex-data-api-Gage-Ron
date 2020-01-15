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
/** This formats Query Parameters. params is an Object that will be turned
 * into a string that can then be appended to the rest of the URL.
 * (URL = path + "?" + queryString)
 */
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

/** Creates our HTML template and inputs the data from the JSON object */
function createHTML(responseJson) {
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    const physicalAddress = responseJson.data[i].addresses.find(addy => addy.type === 'Physical');
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <address>
        <p>${physicalAddress.line1}</p>
        <p>${physicalAddress.line2} ${physicalAddress.line3}</p>
        <p>${physicalAddress.city}, ${physicalAddress.stateCode} ${physicalAddress.postalCode}</p>
      </address>
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
