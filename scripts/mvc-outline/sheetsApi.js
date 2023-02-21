// TODO(developer): Set to client ID and API key from the Developer Console
const API_KEY = 'AIzaSyBPKlmo8xEo4FbWnToU9BR3OCRgEHSmdbs';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

const SPREADSHEET_ID = '1bkOsHBlgEeVSQQWGd9n0E9ywy_K419WTP0Cqv5hd-QI';
const RANGE = 'A2:I1000000';


/**
 * Callback after api.js is loaded.
 * @param {function} afterInit Callback function to perform after the gapi client is initialized.
 */
function loadGapi(afterInit) {
    // console.log("Load Gapi")
    gapi.load('client', function() {initializeGapiClient(afterInit)});
}


/**
 * Callback after the API client is loaded. Loads the discovery doc to initialize the API.
 * @param {function} afterInit Callback function to perform after client is initialized.
 */
async function initializeGapiClient(afterInit) {
    // console.log("Initializing Gapi Client");
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    // console.log("Initialized Gapi Client");
    afterInit();
}


/**
 * Fetches spreadsheet data from the VGDC Inventory spreadsheet. Adapted from Google Sheets API quickstart
 * @return {string[][]} spreadsheet data in a 2D array of strings.
 */
async function fetchSpreadsheetData(sheetName = "Main") {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: sheetName + "!" + RANGE,
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
    // Sort the arrays ascending order; Ex) 0 to 9, then A to Z
    range['values'].sort();

    // TODO: This logic stops processing rows after an empty one is found.
    //       This would result in filled rows below an empty row not being included on the website
    // Remove empty arrays or arrays with empty string for item name
    let index = 0;
    while (range['values'][index].length === 0 || range['values'][index][0] === '') {
        index++;
        // Implement a break if neither while condition is true
    }

    console.log(range['values'].slice(index));
    return range['values'].slice(index);
}