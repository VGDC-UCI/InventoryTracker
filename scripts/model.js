"use strict"

/**
 * Defines the properties of an Item object
 * @typedef     {Object}    Item
 * @property    {string}    name
 * @property    {?string}   subtitle
 * @property    {string}    description
 * @property    {number}    count
 * @property    {Object}    location Reference to location object describing object location
 * @property    {Set}       tags set of tags for item (does not include condition)
 * @property    {string}    imageThumbnail
 * @property    {string}    imageFull
 * @property    {Condition} condition Reference to condition object describing condition
 */
function Item() {
    // Initial Blank Default Item
    this.name           = null;
    this.subtitle       = null;
    this.description    = null;
    this.count          = 0;
    this.location       = null;
    this.tags           = new Set();
    this.imageThumbnail = "";
    this.imageFull      = "";
    this.condition      = null;
}


/**
 * Defines the properties of a Condition object
 * @typedef {Object} Condition
 * @property {int} id
 * @property {string} name
 */
function Condition() {
    // Initial Blank Default Condition
    this.id = null;
    this.name = null;
}


/**
 * Defines the properties of a Location object
 * @typedef {Object} Location
 * @property {int} id
 * @property {string} name
 * @property {string} photo
 * @property {string} description
 */
function Location() {
    this.id = null;
    this.name = null;
    this.displayName = null;
    this.photo = null;
    this.description = null;
}


/**
 * Defines the properties of an InventoryData object
 * @typedef     {Object}    InventoryData
 * @property    {Item[]}    items
 * @property    {string[]}  tags sorted list of tags with condition tags appearing first and all other tags sorted alphabetically
 */

/**
 * @param   {Map<string, string>[]}    spreadsheetData
 * @returns {InventoryData}
 */
function getInventoryData(spreadsheetData, locations) {
    /*
    //         0:      Name                "Name"                          Note: Self-explanatory
    //         1:      Photo               "Google Drive URL"              Note: Should find another way instead of using a link that may change
    //         2:      Quantity            "0" or more                     Note: Should avoid negative count
    //         3:      Location            "1 - Cubby"                     Note: Check Sheets for alternatives
    //         4:      Tags                "Game, Multiplayer, Wii"        Note: Delimited by ','
    //         5:      Subtitle            "PC/Desktop"                    Note: Empty fields possible
    //         6:      Description         "Missing the Disc"              Note: Empty fields possible
    //         7:      Condition           "1 - Poor"                      Note: At the moment, only 1, 2, 3 possible
    //         8:      Officer Notes       "Find disc"                     Note: Notes
    //          */

    // console.log("Getting Inventory Data")
    let items = [];
    let conditionTags = new Map();
    let itemTags = new Set();

    for (let i = 0; i < spreadsheetData.length; i++) {
        if (isVisible(spreadsheetData[i])) {
            let currentItem = convertToItem(spreadsheetData[i], locations);
            items.push(currentItem);
            currentItem.tags.forEach(function(tag) {
                if (tag !== '') {
                    itemTags.add(tag)
                }
            });
        }
    }

    // // Sort condition tags by id number and return only the name of the tag
    // conditionTags = Array.from(
    //     [...conditionTags.entries()]
    //     .sort(function (e1, e2) { return e1[0] - e2[0]; })
    //     .map(function (e) { return e[1]; })
    // );

    // sort item tags alphabetically
    itemTags = Array.from(itemTags)
        .sort(function (t1, t2) { return t1.toLowerCase().localeCompare(t2.toLowerCase()); });

    // sort items alphabetically by name
    items.sort((item1, item2) => item1.name.localeCompare(item2.name));

    const InventoryDataObject = {
        items: items,
        tags: itemTags
    };
    console.log(InventoryDataObject);
    return InventoryDataObject;
}


/**
 * @param {Map<string, string>[]} spreadsheetData
 * @return {Location[]}
 */
function getLocationData(spreadsheetData) {
    let locations = [];

    for (let i = 0; i < spreadsheetData.length; i++) {
        let location = convertToLocation(spreadsheetData[i]);
        locations.push(location);
    }

    return locations;
}

/**
 * @param   {Map<string, string>} spreadsheetRow A spreadsheet row
 * @return  {Item} An item object
 */
function convertToItem(spreadsheetRow, locations) {
    const currentItem = new Item();
    currentItem.name            = spreadsheetRow.get('name');
    currentItem.subtitle        = spreadsheetRow.get('subtitle');
    currentItem.description     = spreadsheetRow.get('description');
    currentItem.count           = spreadsheetRow.get('count');
    currentItem.location        = locations.find(l => l.name === spreadsheetRow.get('location'));
    currentItem.tags            = new Set(spreadsheetRow.get('tags').split(", "));
    currentItem.imageThumbnail  = convertGoogleDriveLink(spreadsheetRow.get('photo'));
    currentItem.imageFull       = convertGoogleDriveLink(spreadsheetRow.get('photo'));
    currentItem.condition       = spreadsheetRow.get('condition');
    return currentItem;
}


/**
 * @param {Map<string, string>} spreadsheetRow
 * @return {Location}
 */
function convertToLocation(spreadsheetRow) {
    const location = new Location();
    location.id = spreadsheetRow.get("id");
    location.name = spreadsheetRow.get("location name");
    location.displayName = spreadsheetRow.get("display name");
    location.photo = convertGoogleDriveLink(spreadsheetRow.get("photo link"));
    location.description = spreadsheetRow.get("location description");
    return location;
}


// /**
//  * @param {string} conditionStr The full condtion str from the spreadsheet
//  * @return {Condition} A Condition object, or null if object could not be created successfully
//  */
// function getItemCondition(conditionStr) {
//     const conditionArray = conditionStr.split(" - ");
//     if (conditionArray.length != 2) {
//         return null;
//     }

//     const id = parseInt(conditionArray[0].trim());
//     const name = conditionArray[1].trim();

//     if (isNaN(id) || name === "") {
//         return null;
//     }

//     const condition = new Condition();
//     condition.id = id;
//     condition.name = name;
//     return condition;
// }

function convertGoogleDriveLink(link) {
    // if (!link.includes("https://drive.google.com/")) {
    //     return `The Link: ${link} is in WRONG URL FORMAT: MUST BEGIN WITH https://drive.google.com/`;
    // }

    let resultLink = "";
    if (link.includes("https://drive.google.com/file/d/")) {
        const fileID = link.match(/\/d\/(.+?)\/(?:view|edit|)?/)[1];
        resultLink = "https://drive.google.com/uc?=view&id=" + fileID;
    } else {
        resultLink = link;
    }
    return resultLink;
}


function isVisible(itemSpreadsheetRow) {
    return itemSpreadsheetRow.get('[visible]') === 'TRUE';
}