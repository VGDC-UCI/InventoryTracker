"use strict"

let ALL_ITEMS = [];
let ALL_TAGS = [];
let ALL_LOCATIONS = [];
const ALL_CONDITIONS = [
    {id: 1, name: "❗❗ Poor"},
    {id: 2, name: "👍 Good"},
    {id: 3, name: "✨ Unopened"}
];

const LOCATION_FILTER_ID = "#location-filter";
const CONDITION_FILTER_ID = "#condition-filter";

/**
 * Call this function when the google api script loads.
 */
function onGapiLoaded() {
    loadGapi(async function() {
        let locationSpreadsheetData = await fetchSpreadsheetData('Locations');
        let itemSpreadsheetData = await fetchSpreadsheetData();

        ALL_LOCATIONS = getLocationData(locationSpreadsheetData);
        let inventoryData = getInventoryData(itemSpreadsheetData, ALL_LOCATIONS);
        ALL_ITEMS = inventoryData.items;
        ALL_TAGS = inventoryData.tags;

        sortFilterById(ALL_LOCATIONS);
        sortFilterById(ALL_CONDITIONS);

        renderSearchTags(ALL_TAGS);
        renderSearchFilter(LOCATION_FILTER_ID, ALL_LOCATIONS);
        renderSearchFilter(CONDITION_FILTER_ID, ALL_CONDITIONS);
        addSearchEventListeners();
        renderItems(ALL_ITEMS);
    })
}


function applySearch() {
    let filteredItems = [];
    console.log("Searching...");
    let searchText = getSearchText();
    let checkedTags = getCheckedTags();
    let conditionValue = $(CONDITION_FILTER_ID).val();
    let locationValue = $(LOCATION_FILTER_ID).val();

    for (let item of ALL_ITEMS) {
        if (matchesSearchConditions(item, searchText, checkedTags, conditionValue, locationValue)) {
            filteredItems.push(item);
        }
    }

    renderItems(filteredItems);
}


function matchesSearchConditions(item, searchText, checkedTags, condition, location) {
    return matchesSearchText(item, searchText) && matchesCheckedTags(item, checkedTags) && matchesFilterValue(item.condition, condition) && (item.location !== undefined && matchesFilterValue(item.location.name, location));
}

/**
 * Checks whether the item's title, description, or tag matches the given search text
 * @param {Item} item
 * @param {string} searchText
 * @return {boolean}
 */
function matchesSearchText(item, searchText) {
    if (searchText.length === 0) {
        return true;
    }
    
    if (typeof (item.name) === "undefined") {
        return false;
    }

    const searchWords = searchText.split(" ");

    let allWordsFound = true;

    searchWords.some(function(word) {
        if (!matchesTitle(item, word) && !matchesDescription(item, word) && !matchesTag(item, word)) {
            allWordsFound = false;
            return false;
        }
    });
    
    return allWordsFound;
}
 

/**
 * Checks whether the item matches the given search text
 * @param {Item} item
 * @param {string} searchText
 * @return {boolean}
 */
function matchesTitle(item, searchText) {
    if (item.name.toLowerCase().includes(searchText)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks whether the item description matches the given search text
 * @param {Item} item
 * @param {string} searchText
 * @return {boolean}
 */
function matchesDescription(item, searchText) {
    if (item.description.toLowerCase().includes(searchText)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks whether the item tag matches the given search text
 * @param {Item} item
 * @param {string} searchText
 * @return {boolean}
 */
function matchesTag(item, searchText) {
    for (const tag of item.tags) {
        const tagText = tag.toLowerCase().split(" ");
        if (tagText.includes(searchText)) {
            return true;
        }
    }
    return false;
}

/**
 * Checks whether the item matches with the given list of checked tags
 * @param {Item} item
 * @param {string[]} checkedTags
 * @return {boolean}
 */
function matchesCheckedTags(item, checkedTags) {
    if (checkedTags.length === 0) {
        return true;
    }

    return checkedTags.every(x => item.tags.has(x));
}


function matchesFilterValue(value, filterValue) {
    return filterValue === "any" || value === filterValue;
}


function getSearchText() {
    let input = document.getElementById("searchbar");
	let lowercasedInput = input.value.toLowerCase();

    return lowercasedInput;
}


function getCheckedTags() {
    let checkedTags = [];
    const checkboxes = document.querySelectorAll("div.tag input[type='checkbox']");

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkedTags.push(checkboxes[i].name);
        } 
    }
    return checkedTags;
}


function addSearchEventListeners() {
    const searchBar = $("#searchbar");
    searchBar.on("input", function() { applySearch(); });

    const searchTags = $("div.tag");
    searchTags.on("click", function() {
        const tag = $(this);
        const checkbox = tag.find("input[type='checkbox']");

        // Toggle checkbox state and selected class state then apply search filter
        checkbox.prop("checked", !checkbox.prop("checked"));
        tag.toggleClass('selected');
        applySearch();
    });

    const conditionFilter = $(CONDITION_FILTER_ID);
    conditionFilter.on("change", function() { applySearch(); });

    const locationFilter = $(LOCATION_FILTER_ID);
    locationFilter.on("change", function() { applySearch(); });
}


/**
 * Sorts a list of filter objects by id. Each filter object has a name and and id field.
 * @param {Object[]} filter
 */
function sortFilterById(filter) {
    filter.sort((f1, f2) => f1.id - f2.id);
}


// Clears search filters on Escape key pressed
window.onkeyup = function (e) {
	if (e.key == "Escape") {
		window.scrollTo(0, 0);

		const activeFilters = $(`#controls input:checkbox:checked`);
		activeFilters.prop("checked", false)
		activeFilters.trigger("change");

		const searchbar = $(`#searchbar`);
		searchbar.val("");
		searchbar.focus();

		applySearch();
	}
}
