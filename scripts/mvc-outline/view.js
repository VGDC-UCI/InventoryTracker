import { applySearch } from './controller.js';

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
export function renderItems(items) {
    const database = document.getElementById("database");
    database.innerHTML = "";
    for (let item of items) {
        database.innerHTML += getItemHTML(item);
    }
    // set display of count to items.length
    document.getElementsByClassName("total-count-number")[0].textContent = items.length;
    $(`#content-tooltip p`).text(`${items.length} result${items.length != 1 ? "s" : ""}`);
}

/**
 * @param {string[]} tags A list of already sorted search tags to display render in the search bar header
 */
export function renderSearchTags(tags) {
    // Load Tags To Search Bar
    // To place items underneath <div id="database">
    // Attach event listener to the checkbox container

    const searchTagsLocation = document.getElementsByClassName("tag-filter-list")[0];
    for (let specificTag of tags) {
        var currentTag = document.createElement("div");
        currentTag.className = "tag";
        var tagType = document.createElement("input");
        tagType.type = "checkbox";
        tagType.name = specificTag;
        tagType.id = "tag-" + specificTag;
        currentTag.appendChild(tagType);

        var tagLabel = document.createElement("label");
        tagLabel.htmlFor = "tag-" + specificTag;
        tagLabel.appendChild(document.createTextNode(specificTag));
        currentTag.appendChild(tagLabel);
        searchTagsLocation.appendChild(currentTag);
    }

    searchTagsLocation.addEventListener("change", (event) => {
        if (event.target.type === "checkbox") {
            // Call the function defined in controller.js
            applySearch();
        }
    });
}

/**
 * @param {Item}
 * @return {string} The HTML that displays an item in the database
 */
function getItemHTML(item) {
    // console.log(item);
    let itemHTML = "";

    // Make <article class ="item">
    var article = document.createElement("article");
    article.className = "item";

    // Make <header class="item-header">
    var header = document.createElement("header");
    header.className = "item-header";

    // Make <h1> item name </h1>
    var name = document.createElement("h1");
    var nameText = document.createTextNode(item.name);
    name.appendChild(nameText);

    // Make <div class="item-wrap">
    var itemWrap = document.createElement("div");
    itemWrap.className = "item-wrap";

    // Make <section class="item-description">
    var itemDescription = document.createElement("section");
    itemDescription.className = "item-description";

    // Load item description
    try {
        var itemDescriptionTextParagraph = document.createElement("p");
        var itemDescriptionText = document.createTextNode("");
        if (typeof item.description !== "undefined") {
            itemDescriptionText = document.createTextNode(item.description);
        }
        itemDescriptionTextParagraph.appendChild(itemDescriptionText);
        itemDescription.appendChild(itemDescriptionTextParagraph);
    }
    catch (err) {
        console.log("Missing item description");
    }

    // Make <section class="item-image">
    var itemImage = document.createElement("section");
    itemImage.className = "item-image";

    // Load item-image full-res
    var image = document.createElement("a");
    image.href = item.imageFull;
    image.target = "_blank";

    // Load item-image thumbnail
    var imageThumbnail = document.createElement("img");
    imageThumbnail.src = item.imageFull;
    imageThumbnail.alt = item.imageThumbnail;
    image.appendChild(imageThumbnail);

    // Make <div class="item-metadata">
    var itemMetadata = document.createElement("div");
    itemMetadata.className = "item-metadata";

    // Make <section class="item-tags">
    var itemTag = document.createElement("section");
    itemTag.className = "item-tags";

    // Load item-tags
    var tagsUnorderedList = document.createElement("ul");

    try {
        var conditionStatus = item.condition[0];
        var conditionTag = document.createElement("li");
        if (conditionStatus == "1") {
            var currentConditionText = document.createTextNode("Poor Condition");
            conditionTag.appendChild(currentConditionText);
        } else if (conditionStatus == "2") {
            var currentConditionText = document.createTextNode("Good Condition");
            conditionTag.appendChild(currentConditionText);
        } else if (conditionStatus == "3") {
            var currentConditionText = document.createTextNode("Unopened");
            conditionTag.appendChild(currentConditionText);
        }
        tagsUnorderedList.appendChild(conditionTag);
    }
    catch (err) {
        console.log("Missing item condition");
    }

    try {
        let sortedTags = Array.from(item.tags).sort()
        for (let specificTag of sortedTags) {
            var currentTag = document.createElement("li");
            var currentTagText = document.createTextNode(specificTag);
            currentTag.appendChild(currentTagText);
            tagsUnorderedList.appendChild(currentTag);
        }
        itemTag.appendChild(tagsUnorderedList);
    }
    catch (err) {
        console.log("Missing item tags");
    }

    // Make <section class="item-count">
    try {
        var itemCount = document.createElement("section");
        itemCount.className = "item-count";
        var itemCountParagraph = document.createElement("p");
        var itemCountNumber = document.createTextNode(" Count Unknown");
        if (typeof item.count !== "undefined") {
            itemCountNumber = document.createTextNode(item.count);
        }
        itemCountParagraph.appendChild(itemCountNumber);
        itemCount.appendChild(itemCountParagraph);
    }
    catch (err) {
        console.log("Missing item count");
    }

    itemMetadata.appendChild(itemTag);
    itemMetadata.appendChild(itemCount);
    itemImage.appendChild(image);
    itemWrap.appendChild(itemDescription);
    itemWrap.appendChild(itemImage);
    itemWrap.appendChild(itemMetadata);
    header.appendChild(name);
    article.appendChild(header);
    article.appendChild(itemWrap);

    return article.outerHTML;
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
