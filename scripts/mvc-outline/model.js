/**
 * Defines the properties of an Item object
 * @typedef     {Object}    Item
 * @property    {string}    name
 * @property    {?string}   subtitle
 * @property    {string}    description
 * @property    {number}    count
 * @property    {Object}    location Reference to location object describing object location
 * @property    {Set}       tags set of tags for item (does not include condition)
 * @property    {string}    imageThumbnail
 * @property    {string}    imageFull
 * @property    {Set}       keywords
 * @property    {string}    condition
 */
function Item() {
    // Initial Blank Default Item
    this.name           = null;
    this.subtitle       = null;
    this.description    = null;
    this.count          = 0;
    this.location       = null;
    this.tags           = new Set();
    this.imageThumbnail = "";
    this.imageFull      = "";
    this.keywords       = new Set();
    this.condition      = "";
}

/**
 * Defines the properties of an InventoryData object
 * @typedef     {Object}    InventoryData
 * @property    {Item[]}    items
 * @property    {string[]}  tags sorted list of tags with condition tags appearing first and all other tags sorted alphabetically
 */

/**
 * @param   {string[][]}    spreadsheetData
 * @returns {InventoryData}
 */
export function getInventoryData(spreadsheetData) {
    /*
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

    // console.log("Getting Inventory Data")
    let items = [];
    let conditionTags = new Set();
    let itemTags = new Set();

    for (let i = 0; i < spreadsheetData.length; i++) {
        let currentItem = convertToItem(spreadsheetData[i]);
        items.push(currentItem);
        conditionTags.add(currentItem.condition.substring(4));
        currentItem.tags.forEach(currentTag => itemTags.add(currentTag));
    }

    conditionTags = Array.from(conditionTags).sort();
    itemTags = Array.from(itemTags).sort();

    const InventoryDataObject = {
        items: items,
        tags: conditionTags.concat(itemTags)
    };

    return InventoryDataObject;
}

/**
 * @param   {string[]} spreadsheetRow A spreadsheet row
 * @return  {Item} An item object
 */
function convertToItem(spreadsheetRow) {
    const currentItem = new Item();

    currentItem.name            = spreadsheetRow[0];
    currentItem.subtitle        = spreadsheetRow[5];
    currentItem.description     = spreadsheetRow[6];
    currentItem.count           = spreadsheetRow[2];
    currentItem.location        = spreadsheetRow[3];
    currentItem.tags            = new Set(spreadsheetRow[4].split(", "));
    currentItem.imageThumbnail  = convertGoogleDriveLink(spreadsheetRow[1]);
    currentItem.imageFull       = convertGoogleDriveLink(spreadsheetRow[1]);
    currentItem.keywords        = spreadsheetRow[0]; // TODO:Implement or remove keywords
    currentItem.condition       = spreadsheetRow[7];

    return currentItem;
}

function convertGoogleDriveLink(link) {
    // if (!link.includes("https://drive.google.com/")) {
    //     return `The Link: ${link} is in WRONG URL FORMAT: MUST BEGIN WITH https://drive.google.com/`;
    // }

    var resultLink = "";
    if (link.includes("https://drive.google.com/file/d/")) {
        var fileID = link.match(/\/d\/(.+?)\/(?:view|edit|export)?/)[1];
        resultLink = "https://drive.google.com/uc?export=view&id=" + fileID;
    } else {
        resultLink = link;
    }
    return resultLink;
}
