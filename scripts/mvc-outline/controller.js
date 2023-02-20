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

export function applySearch() {
    let filteredItems = [];
    console.log("Searching...");
    let searchText = getSearchText();

    for (let currentItem of ALL_ITEMS) {
        if (matchesSearchbar(currentItem, searchText) && matchesCheckedTags(currentItem, getCheckedTags())) {
            filteredItems.push(currentItem);
        }
    }

    renderItems(filteredItems);
}


/**
 * Checks whether the item matches the given search text
 * @param {Item} item
 * @param {string} searchText
 * @return {boolean}
 */
function matchesSearchbar(item, searchText) {
    if (searchText.length === 0) {
        return true;
    } else {
        if (typeof (item.name) === "undefined") {
			return false;
		}

        if (item.name.toLowerCase().includes(searchText)) {
            return true;
		} else {
            return false;
		}
    }
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

    let tempSet = new Set([...item.tags]);

    try {
        var conditionStatus = item.condition[0];
        if (conditionStatus == "1") {
            tempSet.add("Poor");
        } else if (conditionStatus == "2") {
            tempSet.add("Good");
        } else if (conditionStatus == "3") {
            tempSet.add("Unopened");
        }
    }
    catch (err) {
        return false;
    }

    if (checkedTags.every(x => tempSet.has(x))) {
        return true;
    } else {
        return false;
    }
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
            // console.log(`${checkboxes[i].name} is checked.`);
            checkedTags.push(checkboxes[i].name);
        } 
    }
    return checkedTags;
}

// Add an event listener to the search bar input element to handle the input event
const input = document.getElementById("searchbar");
input.addEventListener("input", applySearch);

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
