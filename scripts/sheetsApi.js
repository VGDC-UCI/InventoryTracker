"use strict"

// Restricted Public API Key from VGDC Inventory Tracker Project
// This key can only be used to access the Sheets API on this website.
const API_KEY = 'AIzaSyADvdZBViMHQeJjCVzYZWrCCTIQtlrYEfk';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

const SPREADSHEET_ID = '1XU4y5YP_gQC4xadFvq8Qj2gRa_G6OXOrEvs2i35oFX4';
const RANGE = 'A1:M100000';


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
    if (!range || !range.values || range.values.length == 0) {
        console.log("no values found");
        return;
    }

    // read column headers
    const headers = range['values'][0].map(header => header.toLowerCase());

    // Remove empty rows and return a list of Maps not including the header row
    let rows = range['values']
        .filter(row => row[0] !== '')
        .map((row, index) => createRowMap(row, headers).set("id", index + 1))
        .slice(1);

    console.log("headers: ");
    console.log(headers);
    console.log("rows: ");
    console.log(rows);

    return rows;
}


function createRowMap(row, headers) {
    return new Map(row.map((value, index) => [headers[index], value]));
}