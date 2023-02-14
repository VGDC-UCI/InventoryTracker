/**
 * Defines the properties of an Item object
 * @typedef {Object} Item
 * @property {string} name
 * @property {?string} subtitle
 * @property {string} description
 * @property {number} count
 * @property {Object} location Reference to location object describing object location
 * @property {Set} tags set of tags for item (does not include condition)
 * @property {string} imageThumbnail
 * @property {string} imageFull
 * @property {Set} keywords
 * @property {string} condition
 */


/**
 * Defines the properties of an InventoryData object
 * @typedef {Object} InventoryData
 * @property {Item[]} items
 * @property {string[]} tags sorted list of tags with condition tags appearing first and all other tags sorted alphabetically
 */


/**
 * @param {string[][]} spreadsheetData
 * @returns {InventoryData}
 */
function getInventoryData(spreadsheetData) {
    let items = [];
    let conditionTags = [];
    let itemTags = new Set();
    // loop through all rows
    //      convert spreadsheet row to Item
    //      add item to list
    //      add item.tags to itemTags
    // append sorted itemTags to conditionTags
    // return InventoryData object
}


/**
 * @param {string[]} spreadsheetRow A spreadsheet row
 * @return {Item} An item object
 */
function convertToItem(spreadsheetRow) {

}