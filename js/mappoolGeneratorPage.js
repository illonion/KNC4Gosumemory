var modAbbArray;
var modNameArray;
var modNumArray;
let beatmaps = [];
var downloadedMaps = false;

function mappoolGeneratorPageDisplay(modAbb, modName, modNum) {
    modAbbArray = modAbb;
    modNameArray = modName;
    modNumArray = modNum;

    let mappoolGeneratorPage = document.getElementById("mappoolGeneratorPage");
    mappoolGeneratorPage.innerHTML = "";
    let mappoolTemplateGeneratorPage = document.getElementById("mappoolTemplateGeneratorPage");

    // For Each Mod and #, add the map ID in.
    for (var i = 0; i < modAbbArray.length; i++) {
        let wrapper = document.createElement("div");
        wrapper.setAttribute("class","mappoolGeneratorPageWrapper");

        let modHeader = document.createElement("h1");
        modHeader.innerText = `${modNameArray[i].value.trim()} Maps`; 
        modHeader.setAttribute("class","mappoolGeneratorPageModHeader");
        wrapper.append(modHeader);

        let modNumWrapper = document.createElement("section");
        modNumWrapper.setAttribute("class","modNumWrapper");
        for (var j = 0; j < modNumArray[i].valueAsNumber; j++) {
            let inputID = document.createElement("input")
            inputID.setAttribute("type","number");
            inputID.setAttribute("class",`${modAbbArray[i].value}poolGenerator poolGenerator`);
            inputID.setAttribute("placeholder", `${modAbbArray[i].value} ${j+1} Map ID`);
            modNumWrapper.append(inputID);
        }
 
        wrapper.append(modNumWrapper);
        mappoolGeneratorPage.append(wrapper);
    }

    // Show template to add the number, removing the one to add the mod.
    mappoolGeneratorPage.style.display = "block";
    mappoolTemplateGeneratorPage.style.display = "none";

    // Make a div for the buttons below
    let indivInputsDiv = document.createElement("div");
    indivInputsDiv.classList.add("mappoolGeneratorPageButtonDiv")

    // Next Page Button
    let nextPageButton = generateNextPageButton("validateMappoolGenerator()")

    indivInputsDiv.append(nextPageButton);
    mappoolGeneratorPage.append(indivInputsDiv);

    // Text Area to put answers into
    let textAreaDiv = document.createElement("div");
    let textAreaText = document.createElement("p");
    textAreaText.innerText = "Or alternatively, you can copy/paste in the IDs into the area below. Please ensure that they are numbers only, and separated by line. You can drag the box out to be as large or small as you want :)"
    let textAreaBox = document.createElement("textarea");
    textAreaBox.setAttribute("class","templateContentPosition");
    textAreaBox.setAttribute("id","textAreaBox");
    textAreaBox.style.marginBottom = "10px";
    textAreaDiv.append(textAreaText);
    textAreaDiv.append(textAreaBox);
    mappoolGeneratorPage.append(textAreaDiv);

    // Previous Page Button
    
    let previousPageButton = generatePreviousPageButton("backToMappoolModGeneratorPage()");
    previousPageButton.style.marginRight = "10px";

    // Next Page Button 2
    let nextPageButton2 = generateNextPageButton("validateTextAreaMappoolGenerator()");
    nextPageButton2.style.marginLeft = "10px";

    // Make a div for the buttons below
    let bulkInputsDiv = document.createElement("div");
    bulkInputsDiv.classList.add("mappoolGeneratorPageButtonDiv")    

    bulkInputsDiv.append(previousPageButton);
    bulkInputsDiv.append(nextPageButton2);
    mappoolGeneratorPage.append(bulkInputsDiv);
}

function generatePreviousPageButton(onclickString) {
    let previousPageButton = document.createElement("button");   
    previousPageButton.setAttribute("class","templateGeneratorButtons nextPageButton")
    previousPageButton.setAttribute("onclick",onclickString);
    previousPageButton.innerText = "Previous Page";   
    return previousPageButton;
}

function generateNextPageButton(onclickString) {
    let nextPageButton = document.createElement("button");
    nextPageButton.setAttribute("class","templateGeneratorButtons nextPageButton")
    nextPageButton.setAttribute("onclick",onclickString);
    nextPageButton.innerText = "Next Page";
    return nextPageButton;
}

function backToMappoolModGeneratorPage() {
    let mappoolGeneratorPage = document.getElementById("mappoolGeneratorPage");
    let mappoolTemplateGeneratorPage = document.getElementById("mappoolTemplateGeneratorPage");

    mappoolTemplateGeneratorPage.style.display = "block";
    mappoolGeneratorPage.style.display = "none";
}

function backToMappoolGeneratorPage() {
    let mappoolGeneratorPage = document.getElementById("mappoolGeneratorPage");
    let mappoolDownloadPage = document.getElementById("mappoolDownloadPage");

    mappoolGeneratorPage.style.display = "block";
    mappoolDownloadPage.style.display = "none";

    document.getElementById("mappoolDownloadPageLinks").parentNode.removeChild(document.getElementById("mappoolDownloadPageLinks"));
    document.getElementById("mappoolDownloadPagePreviousPageButton").parentNode.removeChild(document.getElementById("mappoolDownloadPagePreviousPageButton"))
    downloadedMaps = false; 
    beatmaps = [];
}

function validateMappoolGenerator() {
    // Separate into mod pools? Using double array?
    let mappoolArray = new Array();
    for (var i = 0; i < modAbbArray.length; i++) {
        let modArray = new Array();
        let modPoolArray = document.getElementsByClassName(`${modAbbArray[i].value}poolGenerator`);
        for (var j = 0; j < modPoolArray.length; j++) modArray.push(modPoolArray[j].valueAsNumber)
        mappoolArray.push(modArray);
    }

    let apiKey = getAPIKey();

    // error handling
    let missingNo = 0;
    let errMsg = "";
    let totalNoOfMaps = document.getElementsByClassName("poolGenerator").length;

    for (var i = 0; i < mappoolArray.length; i++) {
        for (var j = 0; j < mappoolArray[i].length; j++) {
            if (isNaN(mappoolArray[i][j])) missingNo++
        }
    }

    if (missingNo != 0) errMsg += missingNo+" spots are still missing inputs.\n"
    if (apiKey == "") errMsg += "API Key is missing."
    if (errMsg != "") return alert(errMsg) 

    requestAndDownload(mappoolArray,apiKey,totalNoOfMaps);
}

function validateTextAreaMappoolGenerator() {
    let textAreaBox = document.getElementById("textAreaBox");

    // error handling
    if (textAreaBox.value.trim() == "") return alert("You have not placed anything inside the text area! If you are using the individual input form, plase click the button above.")
    
    let textAreaBoxSplit = textAreaBox.value.split("\n");
    let notANum = 0;
    let arrayOfMapIDs = new Array();
    for (var i = 0; i < textAreaBoxSplit.length; i++) {
        if (textAreaBoxSplit[i].trim() == "") { continue; } 
        if (isNaN(parseInt(textAreaBoxSplit[i].trim()))) { notANum++; }
        else {
            arrayOfMapIDs.push(parseInt(textAreaBoxSplit[i].trim()));
        }
    }

    if (notANum != 0) return alert(`There are ${notANum} value(s) that are not a number.`)


    // mods collection
    let k = 0;
    let totalNoOfMaps = 0;
    let mappoolArray = new Array();
    for (var i = 0; i < modNumArray.length; i++) {
        let modArray = new Array();
        for (var j = 0; j < modNumArray[i].valueAsNumber; j++) {
            modArray.push(arrayOfMapIDs[k]);
            k++
        }
        totalNoOfMaps += modNumArray[i].valueAsNumber;
        mappoolArray.push(modArray);
    }

    // one more error checking
    if (arrayOfMapIDs.length != totalNoOfMaps) { return alert(`The number of maps you chose in the mods does not equal the number of maps entered!`)}

    let apiKey = getAPIKey();
    if (apiKey == "") {return alert("API Key is missing.");}

    requestAndDownload(mappoolArray,apiKey,totalNoOfMaps);
}

function requestAndDownload(mappoolArray, apiKey,totalNoOfMaps) {
    for (var i = 0; i < mappoolArray.length; i++) {
        let order;
        if (mappoolArray[i].length != 0) {
            for (var j = 0; j < mappoolArray[i].length; j++) {
                order = j+1;
                requestMapData(mappoolArray[i][j], apiKey, modAbbArray[i].value, order);
            }
        }
    }

    // make the download page.
    setInterval(() => {
        if (beatmaps.length == totalNoOfMaps && !downloadedMaps) {
            downloadedMaps = true;
            downloadJSON(beatmaps);
        }
    }, 400);
}

function requestMapData(mapID, apiKey, mod, order) {
    let request = new XMLHttpRequest();
    let mapMod = mod.toLowerCase();
    if (mapMod == "hardrock" || mapMod == "hr") {
        request.open(
            "GET",
            `https://osu.ppy.sh/api/get_beatmaps?k=${apiKey}&b=${mapID}&mods=16`,
            true
        );
    } else if (mapMod == "doubletime" || mapMod == "dt") {
        request.open(
            "GET",
            `https://osu.ppy.sh/api/get_beatmaps?k=${apiKey}&b=${mapID}&mods=64`,
            true
        );
    } else if (mapMod == "easy" || mapMod == "ez") {
        request.open(
            "GET",
            `https://osu.ppy.sh/api/get_beatmaps?k=${apiKey}&b=${mapID}&mods=2`,
            true
        );
    } else {
        request.open(
            "GET",
            `https://osu.ppy.sh/api/get_beatmaps?k=${apiKey}&b=${mapID}`,
            true
        );
    }

    request.onload = function() {
        let mapData = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            singleMap = {};
            mapData.forEach(map => {
                singleMap.imgURL = "https://assets.ppy.sh/beatmaps/"+map.beatmapset_id+"/covers/cover.jpg";
                singleMap.artist = map.artist;
                singleMap.songName = map.title;
                singleMap.difficultyname = map.version;
                singleMap.mapper = map.creator;
                singleMap.songLength = map.total_length;
                singleMap.beatmapID = mapID;
                singleMap.difficultyrating = map.difficultyrating;
                if (mapMod == "hardrock" || mapMod == "hr") {
                    singleMap.bpm = map.bpm;
                    singleMap.cs = map.diff_size * 1.3;
                    singleMap.ar = map.diff_approach * 1.4; 
                    if (singleMap.ar > 10) {singleMap.ar = 10;}
                    singleMap.od = map.diff_overall * 1.4;
                    if (singleMap.od > 10) {singleMap.od = 10;}
                }
                else if (mapMod == "doubletime" || mapMod == "dt") {
                    singleMap.bpm = map.bpm * 1.5;
                    singleMap.cs = map.diff_size;
                    if (map.diff_approach <= 5) {singleMap.ar = (1800-((1800 - map.diff_approach)*2/3))/120;}
                    else {singleMap.ar = ((1200-((1200-(map.diff_approach-5)*150)*2/3))/150)+5;}
                    if (map.diff_overall <= 5) {singleMap.od = (1800-((1800 - map.diff_overall)*2/3))/120;}
                    else {singleMap.od = ((1200-((1200-(map.diff_overall-5)*150)*2/3))/150)+5;}
                }
                else if (mapMod == "easy" || mapMod == "ez") {
                    singleMap.bpm = map.bpm;
                    singleMap.cs = map.diff_size / 0.5;
                    singleMap.ar = map.diff_approach / 0.5;
                    singleMap.od = map.diff_overall / 0.5;
                } else {
                    singleMap.bpm = map.bpm;
                    singleMap.cs = map.diff_size;
                    singleMap.ar = map.diff_approach; 
                    singleMap.od = map.diff_overall;
                }
                singleMap.mod = mapMod;
                singleMap.order = order;
            })
            beatmaps.push(singleMap);
        }
    }
    request.send();
}

function downloadJSON(beatmaps) {
    const mappoolStr = "data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(beatmaps));
    let mappoolAnchorElem = document.createElement("a");
    mappoolAnchorElem.setAttribute("id", "downloadMappool");
    mappoolAnchorElem.setAttribute("href", mappoolStr);
    mappoolAnchorElem.setAttribute("download", "beatmaps.json");

    let modAbbs = [];
    for (var i = 0; i < modAbbArray.length; i++) {
        modAbbs.push(modAbbArray[i].value)
    }
    const modStr = "data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(modAbbs));
    let modOrderAnchorElem = document.createElement("a")
    modOrderAnchorElem.setAttribute("id","downloadModOrder");
    modOrderAnchorElem.setAttribute("href", modStr);
    modOrderAnchorElem.setAttribute("download","modOrder.json");
    
    let mappoolDownloadPage = document.getElementById("mappoolDownloadPage");
    let mappoolGeneratorPage = document.getElementById("mappoolGeneratorPage");

    // Previous Page Button
    let previousPageButton = generatePreviousPageButton("backToMappoolGeneratorPage()");  
    previousPageButton.classList.add("templateContentPosition");
    previousPageButton.setAttribute("id","mappoolDownloadPagePreviousPageButton");

    // make a new paragraph to append everything into
    let mappoolDownloadPageLinks = document.createElement("p");
    mappoolDownloadPageLinks.setAttribute("id","mappoolDownloadPageLinks")
    mappoolDownloadPageLinks.style.marginBottom = "0";

    let mappoolDownloadPageLinksBr = document.createElement("br");
    mappoolDownloadPageLinks.append(mappoolAnchorElem);
    mappoolDownloadPageLinks.append(mappoolDownloadPageLinksBr);
    mappoolDownloadPageLinks.append(modOrderAnchorElem);

    mappoolGeneratorPage.style.display = "none";
    mappoolDownloadPage.style.display = "block";

    mappoolAnchorElem.innerText = "Download Mappool";
    mappoolAnchorElem.click();
    modOrderAnchorElem.innerText = "Download Mod Order";
    modOrderAnchorElem.click();

    mappoolDownloadPage.append(previousPageButton);
    mappoolDownloadPage.append(mappoolDownloadPageLinks);
}