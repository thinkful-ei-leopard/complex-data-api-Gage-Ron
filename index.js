const searchURL =  'https://developer.nps.gov/api/v1/parks';
const apiKey = 'Qk2tjWXECgHdoIMbemJObeaaMAWYbyXyjA1Xane9';

// User must be able to search for parks in one or more states
// User must be able to set MAX NUMBER OF RESULTS with a default of 10
// the search must trigger a call to NPS's API
// The parks in the given state must be displayed on the page
//          Include at least:
//           full name
//           description
//           website URL
//           OPTIONAL: parks address
// We need to learn results ie .empty() or .val('')

// INPUT WITH SUBMIT, . Required input
// INPUT with MAX RESULTs
// handle submit


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

/** Extract  data from responseJson and make it into usable string for inserting into HTML */
function extractData() {};

/** create HTML template */

function createHTML(responseJson) {
  $('#results-list').empty();
  // iterate through the data array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each video object in the data 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].addresses}</p>
      <p><a href='${responseJson.data[i].url}>Click for More Info</a></p>
      </li>`
    )};
  //display the results section  
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
