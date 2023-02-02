// TODO(developer): Set to client ID and API key from the Developer Console
const API_KEY = 'AIzaSyBPKlmo8xEo4FbWnToU9BR3OCRgEHSmdbs';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

const SPREADSHEET_ID = '1bkOsHBlgEeVSQQWGd9n0E9ywy_K419WTP0Cqv5hd-QI'
const RANGE = 'A2:I50';


/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    console.log("initializing client");
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    console.log("initialized");
    console.log("fetching data");
    await getData();
    console.log("fetched");
}



/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function getData() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });
    } catch (err) {
        console.log(err.message);
        return;
    }

    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        console.log("no values found");
        return;
    }

    console.log(range);
    return;
}