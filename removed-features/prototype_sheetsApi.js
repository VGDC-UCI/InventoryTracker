// // TODO(developer): Set to client ID and API key from the Developer Console
// const API_KEY = 'AIzaSyBPKlmo8xEo4FbWnToU9BR3OCRgEHSmdbs';

// // Discovery doc URL for APIs used by the quickstart
// const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// // Authorization scopes required by the API; multiple scopes can be
// // included, separated by spaces.
// const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

// const SPREADSHEET_ID = '1bkOsHBlgEeVSQQWGd9n0E9ywy_K419WTP0Cqv5hd-QI';
// const RANGE = 'A2:I1000000';

// var LIST_OF_ITEMS = [];
// var CHECKED_TAGS_SET = new Set();
// var TAGS_SET = new Set();
// var COUNTER = -1;

// /**
//  * Callback after api.js is loaded.
//  */
// function gapiLoaded() {
//     gapi.load('client', initializeGapiClient);
// }

// /**
//  * Modifies the list of tags that are checked
//  */
// function modifyCheckedTagList(modifiedTag) {
//     if (modifiedTag.target.checked) {
//         CHECKED_TAGS_SET.add(modifiedTag.target.name);
//     } else {
//         CHECKED_TAGS_SET.delete(modifiedTag.target.name);
//     }
//     search();
// }

// /**
//  * Checks to see if an item has all the tags currently checked
//  */
// function checkTagsOfItem(currentItemTags) {
//     if (currentItemTags.length < CHECKED_TAGS_SET.size) {
//         return false;
//     }

//     for (const checkedTag of CHECKED_TAGS_SET.values()) {
//         tagExists = false;
//         for (let i = 0; i < currentItemTags.length; i++) {
//             if (currentItemTags[i].textContent === checkedTag) {
//                 tagExists = true;
//                 break;
//             }
//         }

//         if (!tagExists) {
//             return false;
//         }
//     }
//     return true;
// }

// function getItemAsHtml(item) {
//     function wrapIfExists(text, start, end) {
//         if (text) {
//             return start + text + end;
//         } else {
//             return "";
//         }
//     }

//     const CONDITION_TEXT = {
//         1: "Poor Condition",
//         2: "Good Condition",
//         3: "Unopened",
//     };

//     const title = item.title;
//     const subtitle = wrapIfExists(item.subtitle, "<p>", "</p>");

//     const description = description;

//     const imgPathFull = item.imagePath;
//     const imgPathShort = item.imagePath;

//     const tagsHtml = (() => {
//         const o = [];
//         o.push(wrapIfExists(
//             CONDITION_TEXT[item.condition]
//         ));
//         o.push(
//             Array.from(item.tags.keys())
//                 .map(x => `<li>${x}</li>`)
//                 .sort()
//         );
//     })();

//     const count = item.count;

//     return `
// <article class="item">
//   <header class="item-header">
//     <h1>${title}</h1>
//     ${subtitle}
//   </header>

//   <div class="item-wrap">
//     <section class="item-description">
//       <p>${description}</p>
//     </section>

//     <section class="item-image">
//       <a href="${imgPathFull}" target="_blank">
//         <img src="${imgPathShort}" alt="${title}">
//       </a>
//     </section>

//     <div class="item-metadata">
//       <section class="item-tags">
//         <ul>${tagsHtml}</ul>
//       </section>

//       <section class="item-count">
//         <p>${count}</p>
//       </section>
//     </div>
//   </div>
// </article>
//     `.trim();
// }

// /**
//  * Adds a new card to html
//  */
// function loadData(list_of_items) {

//     // TODO [HIGH PRIORITY]: Rewrite this function to be modular. See Discord for details.

//     console.log("LOADING DATA");
//     COUNTER = 0;
//     var tags_list = [];
//     for (let i = 0; i < list_of_items.length; i++) {
//         /*
//         0:      Name                "Name"                          Note: Self-explanatory
//         1:      Photo               "Google Drive URL"              Note: Should find another way instead of using a link that may change
//         2:      Quantity            "0" or more                     Note: Should avoid negative count
//         3:      Location            "1 - Cubby"                     Note: Check Sheets for alternatives
//         4:      Tags                "Game, Multiplayer, Wii"        Note: Delimited by ','
//         5:      Subtitle            "PC/Desktop"                    Note: Empty fields possible
//         6:      Description         "Missing the Disc"              Note: Empty fields possible
//         7:      Condition           "1 - Poor"                      Note: At the moment, only 1, 2, 3 possible
//         8:      Officer Notes       "Find disc"                     Note: Notes
//          */

//         // TODO: Implement helper functions for clean and modular code
//         if (typeof (list_of_items[i][0]) !== "undefined" && list_of_items[i][0].length > 0) {
//             COUNTER++;

//             // To place items underneath <div id="database">
//             var database = document.getElementById("database");

//             // Make <article class ="item">
//             var article = document.createElement("article");
//             article.className = "item";

//             // Make <header class="item-header">
//             var header = document.createElement("header");
//             header.className = "item-header";

//             // Make <h1> item name </h1>
//             var name = document.createElement("h1");
//             var nameText = document.createTextNode(list_of_items[i][0]);
//             name.appendChild(nameText);

//             // Make <div class="item-wrap">
//             var itemWrap = document.createElement("div");
//             itemWrap.className = "item-wrap";

//             // Make <section class="item-description">
//             var itemDescription = document.createElement("section");
//             itemDescription.className = "item-description";

//             // Load item description
//             try {
//                 var itemDescriptionTextParagraph = document.createElement("p");
//                 var itemDescriptionText = document.createTextNode("");
//                 if (typeof list_of_items[i][6] !== "undefined") {
//                     itemDescriptionText = document.createTextNode(list_of_items[i][6]);
//                 }
//                 itemDescriptionTextParagraph.appendChild(itemDescriptionText);
//                 itemDescription.appendChild(itemDescriptionTextParagraph);
//             }
//             catch (err) {
//                 console.log("Missing item description");
//             }

//             // Make <section class="item-image">
//             var itemImage = document.createElement("section");
//             itemImage.className = "item-image";

//             // Load item-image full-res
//             var image = document.createElement("a");
//             image.href = list_of_items[i][1];
//             image.target = "_blank";

//             // Load item-image thumbnail
//             var imageThumbnail = document.createElement("img");
//             imageThumbnail.src = list_of_items[i][1];
//             imageThumbnail.alt = list_of_items[i][0];
//             image.appendChild(imageThumbnail);

//             // Make <div class="item-metadata">
//             var itemMetadata = document.createElement("div");
//             itemMetadata.className = "item-metadata";

//             // Make <section class="item-tags">
//             var itemTag = document.createElement("section");
//             itemTag.className = "item-tags";

//             // Load item-tags
//             var tagsUnorderedList = document.createElement("ul");

//             try {
//                 var conditionStatus = list_of_items[i][7].charAt(0);
//                 var conditionTag = document.createElement("li");
//                 if (conditionStatus == "1") {
//                     var currentConditionText = document.createTextNode("Poor Condition");
//                     conditionTag.appendChild(currentConditionText);
//                 } else if (conditionStatus == "2") {
//                     var currentConditionText = document.createTextNode("Good Condition");
//                     conditionTag.appendChild(currentConditionText);
//                 } else if (conditionStatus == "3") {
//                     var currentConditionText = document.createTextNode("Unopened");
//                     conditionTag.appendChild(currentConditionText);
//                 }
//                 tagsUnorderedList.appendChild(conditionTag);
//             }
//             catch (err) {
//                 console.log("Missing item condition");
//             }

//             // TODO: enums and other constants implementations
//             try {
//                 TAGS_SET.add("Poor Condition");
//                 TAGS_SET.add("Good Condition");
//                 TAGS_SET.add("Unopened");
//                 var listOfTags = new Set(list_of_items[i][4].split(", "));
//                 for (specificTag of listOfTags.values()) {
//                     tags_list.push(specificTag);
//                     var currentTag = document.createElement("li");
//                     var currentTagText = document.createTextNode(specificTag);
//                     currentTag.appendChild(currentTagText);
//                     tagsUnorderedList.appendChild(currentTag);
//                 }
//                 itemTag.appendChild(tagsUnorderedList);
//             }
//             catch (err) {
//                 console.log("Missing item tags");
//             }

//             // Make <section class="item-count">
//             try {
//                 var itemCount = document.createElement("section");
//                 itemCount.className = "item-count";
//                 var itemCountParagraph = document.createElement("p");
//                 var itemCountNumber = document.createTextNode(" Count Unknown");
//                 if (typeof list_of_items[i][2] !== "undefined") {
//                     itemCountNumber = document.createTextNode(list_of_items[i][2]);
//                 }
//                 itemCountParagraph.appendChild(itemCountNumber);
//                 itemCount.appendChild(itemCountParagraph);
//             }
//             catch (err) {
//                 console.log("Missing item count");
//             }

//             itemMetadata.appendChild(itemTag);
//             itemMetadata.appendChild(itemCount);
//             itemImage.appendChild(image);
//             itemWrap.appendChild(itemDescription);
//             itemWrap.appendChild(itemImage);
//             itemWrap.appendChild(itemMetadata);
//             header.appendChild(name);
//             article.appendChild(header);
//             article.appendChild(itemWrap);
//             database.appendChild(article);
//         }
//     }
//     // Load Tags To Search Bar
//     // To place items underneath <div id="database">
//     tags_list.sort();
//     tags_list.forEach(tagInList => TAGS_SET.add(tagInList));

//     var searchTagsLocation = document.getElementsByClassName("tag-filter-list")[0];
//     for (specificTag of TAGS_SET.values()) {
//         var currentTag = document.createElement("div");
//         currentTag.className = "tag";
//         var tagType = document.createElement("input");
//         tagType.type = "checkbox";
//         tagType.onchange = modifyCheckedTagList.bind(this);
//         tagType.name = specificTag;
//         tagType.id = "tag-" + specificTag;
//         currentTag.appendChild(tagType);

//         var tagLabel = document.createElement("label");
//         tagLabel.htmlFor = "tag-" + specificTag;
//         tagLabel.appendChild(document.createTextNode(specificTag));
//         currentTag.appendChild(tagLabel);
//         searchTagsLocation.appendChild(currentTag);
//     }
//     document.getElementsByClassName("total-count-number")[0].textContent = COUNTER;
// 	$(`#content-tooltip p`).text(`${COUNTER} result${COUNTER != 1 ? "s" : ""}`);
//     console.log("FINISHED LOADING DATA");
// }

// /**
//  * Callback after the API client is loaded. Loads the
//  * discovery doc to initialize the API.
//  */
// async function initializeGapiClient() {
//     console.log("initializing client");
//     await gapi.client.init({
//         apiKey: API_KEY,
//         discoveryDocs: [DISCOVERY_DOC],
//     });
//     console.log("initialized");
//     console.log("fetching data");
//     LIST_OF_ITEMS = await getData();
//     console.log(LIST_OF_ITEMS);
//     console.log("fetched data");
//     await loadData(LIST_OF_ITEMS);
// }



// /**
//  * Print the names and majors of students in a sample spreadsheet:
//  * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  */
// async function getData() {
//     let response;
//     try {
//         response = await gapi.client.sheets.spreadsheets.values.get({
//             spreadsheetId: SPREADSHEET_ID,
//             range: RANGE,
//         });
//     } catch (err) {
//         console.log(err.message);
//         return;
//     }

//     const range = response.result;
//     if (!range || !range.values || range.values.length == 0) {
//         console.log("no values found");
//         return;
//     }
//     // Sort the arrays ascending order; Ex) 0 to 9, then A to Z
//     range['values'].sort();

//     // Remove empty arrays or arrays with empty string for item name
//     let index = 0;
//     while (range['values'][index].length === 0 || range['values'][index][0] === '') {
//         index++;
//         // Implement a break if neither while condition is true
//     }

//     return range['values'].slice(index);
// }
