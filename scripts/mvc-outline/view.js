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
 * @param {Item[]} items A list of items to display in the database section of the website
 */
function renderItems(items) {
    const database = $("#database");
    database.empty();
    for (let item of items) {
        database.append(getItemHTML(item));
    }
    updateItemCount(items.length);
}

/**
 * @param {string[]} tags A list of already sorted search tags to display in the search bar header
 */
function renderSearchTags(tags) {
    const searchTagsLocation = $(".tag-filter-list");
    searchTagsLocation.empty()
    for (let tag of tags) {
        searchTagsLocation.append(getSearchTagHTML(tag));
    }
}

/**
 * @param {Item}
 * @return {string} The HTML that displays an item in the database
 */
function getItemHTML(item) {
    const title = item.name;
    const subtitle = item.subtitle;
    const description = item.description;
    const imgPathFull = item.imageFull;
    const imgPathShort = item.imageThumbnail;
    const count = item.count;
    const tagsList = [item.condition.name].concat(Array.from(item.tags).sort());

    let tagsHtml = "";
    tagsList.forEach(tagName => {tagsHtml += `<li>${tagName}</li>`;});

    return `
        <article class="item">
            <header class="item-header">
                <h1>${title}</h1>
                <p>${subtitle}</p>
            </header>

            <div class="item-wrap">
                <section class="item-description">
                    <p>${description}</p>
                </section>

                <section class="item-image">
                    <a href="${imgPathFull}" target="_blank">
                        <img src="${imgPathShort}" alt="${title}">
                    </a>
                </section>

                <div class="item-metadata">
                    <section class="item-tags">
                        <ul>${tagsHtml}</ul>
                    </section>
                    <section class="item-count">
                        <p>${count}</p>
                    </section>
                </div>
            </div>
        </article>`;
}


/**
 * @param {Item}
 * @return {string} The HTML that displays an item in the database for a list view
 */
function getListItemHTML(item) {

}


/**
 * @param {string} tagName The name of the tag to display
 * @return {string} The HTML of the tag to display
 */
function getSearchTagHTML(tagName) {
    const tagId = "tag-" + tagName
    return `
        <div class="tag">
            <input hidden type="checkbox" name="${tagName}" id="${tagId}"/>
            <p>${tagName}</p>
        </div>`;
}


/** 
 * Updates the item count display to the given number
 * @param {int} numItems the number of items that are currently displayed in the database
 */
function updateItemCount(numItems) {
    document.getElementsByClassName("total-count-number")[0].textContent = numItems;
    $(`#content-tooltip p`).text(`${numItems} result${numItems != 1 ? "s" : ""}`);
}
