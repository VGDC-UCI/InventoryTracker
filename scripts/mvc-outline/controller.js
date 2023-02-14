import { loadGapi, fetchSpreadsheetData } from 'sheetsApi.js'
import { getInventoryData } from 'model.js'
import { renderItems, renderSearchTags } from 'view.js'

let ALL_ITEMS = [];
let ALL_TAGS = [];

/**
 * Call this function when the google api script loads.
 */
function onGapiLoaded() {
    loadGapi(function() {
        let spreadsheetData = await fetchSpreadsheetData();
        let inventoryData = getInventoryData(spreadsheetData);
        ALL_ITEMS = inventoryData['items'];
        ALL_TAGS = inventoryData['tags'];
        renderSearchTags(ALL_TAGS);
        renderItems(ITEMS_LIST);
    })
}

function applySearch() {
    // getSearchText, getCheckedTags
    // filteredItems = new array
    // for each item in ALL_ITEMS
    //      add to filteredItems if matchesSearchbar(item, searchTExt) and matchesCheckedTags(item, checkedTags)
    // renderItems(filteredItems)
}


/**
 * Checks whether the item matches the given search text
 * @param {Item} item
 * @param {string} searchText
 * @return {boolean}
 */
function matchesSearchbar(item, searchText) {

}


/**
 * Checks whether the item matches with the given list of checked tags
 * @param {Item} item
 * @param {string[]} checkedTags
 * @return {boolean}
 */
function matchesCheckedTags(item, checkedTags) {

}


function getSearchText() {

}


function getCheckedTags() {

}