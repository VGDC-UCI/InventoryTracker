import { loadGapi, fetchSpreadsheetData } from '/scripts/mvc-outline/sheetsApi.js'
import { getInventoryData } from '/scripts/mvc-outline/model.js'
import { renderItems, renderSearchTags } from '/scripts/mvc-outline/view.js'

let ALL_ITEMS = [];
let ALL_TAGS = [];

/**
 * Call this function when the google api script loads.
 */
export function onGapiLoaded() {
    loadGapi(async function() {
        let spreadsheetData = await fetchSpreadsheetData();
        let inventoryData = getInventoryData(spreadsheetData);
        ALL_ITEMS = inventoryData['items'];
        ALL_TAGS = inventoryData['tags'];
        renderSearchTags(ALL_TAGS);
        renderItems(ALL_ITEMS);
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

function search() {
	console.log("Searching...");
	var input = document.getElementById("searchbar");
	var filter = input.value.toLowerCase();
	var newList = [];

	// Case-insensitive searching
	for (let i = 0; i < ALL_ITEMS.length; ++i) {
		if (typeof (ALL_ITEMS[i].name) === "undefined" || typeof (document.getElementsByClassName('item-tags')[i]) === "undefined") {
			continue;
		}

		// TODO: Tags searching via search text box as well
		// TODO: checkTagsOfItem
		// if (ALL_ITEMS[i].name.toLowerCase().includes(filter) && checkTagsOfItem(document.getElementsByClassName('item-tags')[i].getElementsByTagName('li'))) {
		if (ALL_ITEMS[i].name.toLowerCase().includes(filter)) {
			document.getElementsByClassName('item')[i].style.display = 'unset';
		} else {
			document.getElementsByClassName('item')[i].style.display = 'none';
		}
	}
	let COUNTER = 0;
	// Get accurate Total Count currently shown on website
	for (let i = 0; i < ALL_ITEMS.length; ++i) {
		if (typeof (document.getElementsByClassName('item')[i]) === "undefined") {
			continue;
		}

		if (document.getElementsByClassName('item')[i].style.display != 'none') {
			COUNTER++;
		}
	}
	document.getElementsByClassName("total-count-number")[0].textContent = COUNTER;
	$(`#content-tooltip p`).text(`${COUNTER} result${COUNTER != 1 ? "s" : ""}`);
}

// Add an event listener to the search bar input element to handle the input event
const input = document.getElementById("searchbar");
input.addEventListener("input", search);

window.onkeyup = function (e) {
	if (e.key == "Escape") {
		window.scrollTo(0, 0);

		const activeFilters = $(`#controls input:checkbox:checked`);
		activeFilters.prop("checked", false)
		activeFilters.trigger("change");

		const searchbar = $(`#searchbar`);
		searchbar.val("");
		searchbar.focus();

		search();
	}
}