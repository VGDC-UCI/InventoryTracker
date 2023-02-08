function search() {
	console.log("Searching...");
	var input = document.getElementById("searchbar");
	var filter = input.value.toLowerCase();
	var newList = [];

	// Case-insensitive searching
	for (let i = 0; i < LIST_OF_ITEMS.length; ++i) {
		if (typeof (LIST_OF_ITEMS[i][0]) === "undefined" || typeof (document.getElementsByClassName('item-tags')[i]) === "undefined") {
			continue;
		}

		if (LIST_OF_ITEMS[i][0].toLowerCase().includes(filter) && checkTagsOfItem(document.getElementsByClassName('item-tags')[i].getElementsByTagName('li'))) {
			document.getElementsByClassName('item')[i].style.display = 'unset';
		} else {
			document.getElementsByClassName('item')[i].style.display = 'none';
		}
	}
	COUNTER = 0;
	// Get accurate Total Count currently shown on website
	for (let i = 0; i < LIST_OF_ITEMS.length; ++i) {
		if (typeof (document.getElementsByClassName('item')[i]) === "undefined") {
			continue;
		}

		if (document.getElementsByClassName('item')[i].style.display != 'none') {
			COUNTER++;
		}
	}
	document.getElementsByClassName("total-count-number")[0].textContent = COUNTER;
}
