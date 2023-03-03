"use strict"

//  Column Name Constants
const ROW_ID = "id";
const ITEM_STATUS = "status";
const ITEM_BORROWED = "[bor.]";
const ITEM_VALID = "[v]";
const ITEM_VISIBLE = "[visible]";
const ITEM_NAME = "name";
const ITEM_PHOTO = "photo";
const ITEM_COUNT = "count";
const ITEM_LOCATION = "location";
const ITEM_TAGS = "tags";
const ITEM_SUBTITLE = "subtitle";
const ITEM_DESCRIPTION = "description";
const ITEM_CONDITION = "condition";
const ITEM_CHECKED_OUT = "[checked-out]";
const LOCATION_NAME = "location name";
const LOCATION_DISPLAY = "display name";
const LOCATION_PHOTO = "photo link";
const LOCATION_DESCRIPTION = "location description";

// Unspecified Location Object
const UNSPECIFIED_LOCATION = {
    id: 1000,
    name: "❓ Unspecified",
    displayName: "Unspecified",
    photo: null,
    description: "Ask an officer where this item can be found!"
}

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
    let items = [];
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
    let locations = [UNSPECIFIED_LOCATION];

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
    currentItem.name            = spreadsheetRow.get(ITEM_NAME);
    currentItem.subtitle        = spreadsheetRow.get(ITEM_SUBTITLE);
    currentItem.description     = spreadsheetRow.get(ITEM_DESCRIPTION);
    currentItem.count           = spreadsheetRow.get(ITEM_COUNT);
    currentItem.location        = getLocationWithDefault(spreadsheetRow, locations, UNSPECIFIED_LOCATION);
    currentItem.tags            = new Set(spreadsheetRow.get(ITEM_TAGS).split(", "));
    currentItem.imageThumbnail  = convertGoogleDriveLink(spreadsheetRow.get(ITEM_PHOTO));
    currentItem.imageFull       = convertGoogleDriveLink(spreadsheetRow.get(ITEM_PHOTO));
    currentItem.condition       = spreadsheetRow.get(ITEM_CONDITION);
    return currentItem;
}


/**
 * @param {Map<string, string>} spreadsheetRow
 * @return {Location}
 */
function convertToLocation(spreadsheetRow) {
    const location = new Location();
    location.id = spreadsheetRow.get(ROW_ID);
    location.name = spreadsheetRow.get(LOCATION_NAME);
    location.displayName = spreadsheetRow.get(LOCATION_DISPLAY);
    location.photo = convertGoogleDriveLink(spreadsheetRow.get(LOCATION_PHOTO));
    location.description = spreadsheetRow.get(LOCATION_DESCRIPTION);
    return location;
}


/**
 * Converts a google drive link to an image link. 
 * If the given link is not a google drive link, the same link is returned
 * @param {string} link
 * @return {string}
 */
function convertGoogleDriveLink(link) {
    let resultLink = "";
    if (link.includes("https://drive.google.com/file/d/")) {
        const fileID = link.match(/\/d\/(.+?)\/(?:view|edit|)?/)[1];
        resultLink = "https://drive.google.com/uc?=view&id=" + fileID;
    } else {
        resultLink = link;
    }
    return resultLink;
}


/**
 * Tries to match the location string of an item to a location name in the list of location objects
 * If no match is found, return the default location object
 * @param {Map<string, string>} itemSpreadsheetRow
 * @param {Location[]} locations
 * @param {Location} defaultLocation
 * @return {Locaation}
 */
function getLocationWithDefault(itemSpreadsheetRow, locations, defaultLocation) {
    const location = locations.find(l => l.name === itemSpreadsheetRow.get('location'))
    return location === undefined ? defaultLocation : location;
}


/**
 * Returns Whether or not the item should be included to be displayed in the database
 * @param {Map<string, string>} itemSpreadsheetRow
 * @return {boolean}
 */
function isVisible(itemSpreadsheetRow) {
    return itemSpreadsheetRow.get('[visible]') === 'TRUE' && itemSpreadsheetRow.get("[v]") === '-';
}



