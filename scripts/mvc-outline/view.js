/**
 * @param {Item[]} items A list of items to display in the database section of the website
 */
export function renderItems(items) {
    const database = document.getElementById("database");
    database.innerHTML = "";
    for (let item of items) {
        database.innerHTML += getItemHTML(item);
    }
    // set display of count to items.length
}

/**
 * @param {string[]} tags A list of search tags to display render in the search bar header
 */
export function renderSearchTags(tags) {

}

/**
 * @param {Item}
 * @return {string} The HTML that displays an item in the database
 */
function getItemHTML(item) {

}


/**
 * @param {Item}
 * @return {string} The HTML that displays an item in the database for a list view
 */
function getListItemHTML(item) {

}


/**
 * @param {string} tag The name of the tag to display
 * @return {string} The HTML of the tag to display
 */
function getSearchTagHTML(tag) {

}