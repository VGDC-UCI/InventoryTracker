// TODO(developer): Set to client ID and API key from the Developer Console
const API_KEY = 'AIzaSyBPKlmo8xEo4FbWnToU9BR3OCRgEHSmdbs';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

const SPREADSHEET_ID = '1bkOsHBlgEeVSQQWGd9n0E9ywy_K419WTP0Cqv5hd-QI';
const RANGE = 'A1:K100';


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
 * @return {Map<string, string>[]} A list of spreadsheet rows mapping column name to column value
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
    console.log("response: " + range)
    if (!range || !range.values || range.values.length == 0) {
        console.log("no values found");
        return;
    }

    // read column headers
    const headers = range['values'][0].map(header => header.toLowerCase());
    const visibleCol = headers.findIndex(e => e === '[visible]');

    // Remove empty/non-visible rows and return a list of Maps sorted by name
    let rows = range['values']
        .filter(row => isVisible(row, visibleCol))
        .map(row => createRowMap(row, headers))
        .sort((rowMap1, rowMap2) => rowMap1.get('name').localeCompare(rowMap2.get('name')));

    console.log("headers: ");
    console.log(headers);
    console.log("rows: ");
    console.log(rows);

    return rows;
}


function createRowMap(row, headers) {
    return new Map(row.map((value, index) => [headers[index], value]));
}

function isVisible(row, visibleCol) {
    return visibleCol > 0 && visibleCol < row.length && row[visibleCol] === 'TRUE';
}