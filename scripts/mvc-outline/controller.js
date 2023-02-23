let ALL_ITEMS = [];
let ALL_TAGS = [];
let ALL_LOCATIONS = [];

/**
 * Call this function when the google api script loads.
 */
function onGapiLoaded() {
    loadGapi(async function() {
        let locationSpreadsheetData = await fetchSpreadsheetData('Locations');
        let itemSpreadsheetData = await fetchSpreadsheetData();
        ALL_LOCATIONS = getLocationData(locationSpreadsheetData);
        let inventoryData = getInventoryData(itemSpreadsheetData, ALL_LOCATIONS);

        console.log(ALL_LOCATIONS);
        ALL_ITEMS = inventoryData.items;
        ALL_TAGS = inventoryData.tags;
        renderSearchTags(ALL_TAGS);
        addSearchEventListeners();
        renderItems(ALL_ITEMS);
    })
}

function applySearch() {
    let filteredItems = [];
    console.log("Searching...");
    let searchText = getSearchText();
    let checkedTags = getCheckedTags();

    for (let currentItem of ALL_ITEMS) {
        if (matchesSearchbar(currentItem, searchText) && matchesCheckedTags(currentItem, checkedTags)) {
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

    const itemTags = new Set(item.tags).add(item.condition.name);
    return checkedTags.every(x => itemTags.has(x));
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
