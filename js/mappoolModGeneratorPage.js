const addMappoolModTemplateButton = document.getElementById("addMappoolModTemplate");
addMappoolModTemplateButton.onclick = addNewMappoolModTemplate;

function addNewMappoolModTemplate(mod) {
    // make mappool mod abbreviation
    let mappoolModAbbreivationCreate = document.createElement("input");
    mappoolModAbbreivationCreate.setAttribute("type","text");
    mappoolModAbbreivationCreate.setAttribute("class","mappoolModAbbreviation");
    mappoolModAbbreivationCreate.setAttribute("placeholder","Abbreviation");
    // make mappool mod name
    let mappoolModNameCreate = document.createElement("input");
    mappoolModNameCreate.setAttribute("type","text");
    mappoolModNameCreate.setAttribute("class","mappoolModName");
    mappoolModNameCreate.setAttribute("placeholder","Mod Name");
    // make mappool mod number
    let mappoolModNumberCreate = document.createElement("input");
    mappoolModNumberCreate.setAttribute("type","number");
    mappoolModNumberCreate.setAttribute("class","mappoolModNumber");
    mappoolModNumberCreate.setAttribute("placeholder","Number of Maps");
    // make delete button
    let mappoolModDeleteModCreate = document.createElement("button");
    mappoolModDeleteModCreate.setAttribute("onclick","this.parentNode.parentNode.removeChild(this.parentNode);")
    mappoolModDeleteModCreate.classList.add("mappoolRemoveMod")
    mappoolModDeleteModCreate.classList.add("templateGeneratorButtons")
    mappoolModDeleteModCreate.innerText = "Remove Mod"
    // make surrouding container
    let mappoolModTemplateGeneratorCreate = document.createElement("div")
    mappoolModTemplateGeneratorCreate.setAttribute("class","mappoolModTemplateGenerator");

    // Add values for mods
    mappoolModAbbreivationCreate.setAttribute("value", mod);
    switch(mod) {
        case "NM": mappoolModNameCreate.setAttribute("value", "NoMod"); break;
        case "HD": mappoolModNameCreate.setAttribute("value", "Hidden"); break;
        case "HR": mappoolModNameCreate.setAttribute("value", "Hard Rock"); break;
        case "DT": mappoolModNameCreate.setAttribute("value", "Double Time"); break;
        case "EZ": mappoolModNameCreate.setAttribute("value", "Easy"); break;
        case "FL": mappoolModNameCreate.setAttribute("value", "Flashlight"); break;
        case "FM": mappoolModNameCreate.setAttribute("value", "Freemod"); break;
        case "TB": mappoolModNameCreate.setAttribute("value", "Tiebreaker"); break;
        case "RC": mappoolModNameCreate.setAttribute("value", "Rice"); break;
        case "HB": mappoolModNameCreate.setAttribute("value", "Hybrid"); break;
        case "LN": mappoolModNameCreate.setAttribute("value", "Long Notes"); break;
        case "SV": mappoolModNameCreate.setAttribute("value", "Speed Velocity"); break;
    }

    // bind everything together
    mappoolModTemplateGeneratorCreate.appendChild(mappoolModAbbreivationCreate);
    mappoolModTemplateGeneratorCreate.appendChild(mappoolModNameCreate);
    mappoolModTemplateGeneratorCreate.appendChild(mappoolModNumberCreate);
    mappoolModTemplateGeneratorCreate.appendChild(mappoolModDeleteModCreate);
    
    // insert before the button.
    addMappoolModTemplate.parentNode.parentNode.insertBefore(mappoolModTemplateGeneratorCreate,addMappoolModTemplate.parentNode);
}

const removeMappoolModTemplateButton = document.getElementById("removeMappoolModTemplate");
removeMappoolModTemplateButton.onclick = removeLastMappoolModTemplate;

function removeLastMappoolModTemplate() {
    let mappoolModTemplateGenerator = document.getElementsByClassName("mappoolModTemplateGenerator");
    if (mappoolModTemplateGenerator.length > 0) mappoolModTemplateGenerator[mappoolModTemplateGenerator.length - 1].remove()
}

const removeAllMappoolModTemplateButton = document.getElementById("removeAllMappoolModTemplate");
removeAllMappoolModTemplateButton.onclick = removeAllMappoolModTemplate;
function removeAllMappoolModTemplate() {
    let mappoolModTemplateGenerator = document.getElementsByClassName("mappoolModTemplateGenerator");
    if (mappoolModTemplateGenerator.length > 0) {
        for (var i = 0; mappoolModTemplateGenerator.length; i++) mappoolModTemplateGenerator[0].remove()
    } 
}

function validateMappolModGenerator() {
    let mappoolModTemplateGenerator = document.getElementsByClassName("mappoolModTemplateGenerator");
    let errMsg = "";

    if (mappoolModTemplateGenerator.length > 0) {

        var mappoolModAbbreviation = document.getElementsByClassName("mappoolModAbbreviation");
        var mappoolModName = document.getElementsByClassName("mappoolModName");
        var mappoolModNumber = document.getElementsByClassName("mappoolModNumber");
        for (var i = 0; i < mappoolModTemplateGenerator.length; i++) {
            // check mod abbreviation for blank, and then more than 5 characters
            let modAbb = mappoolModAbbreviation[i].value.trim();
            if (modAbb == "") errMsg += `Entry ${i + 1} has no abbreviation\n`
            else if (modAbb.split(" ").length > 1) errMsg += `Entry ${i + 1}'s abbreivation has a space in it. Please remove the space.\n`
            else if (modAbb.length > 10) errMsg += `Entry ${i + 1}'s abbreivation is too long\n`

            // check Mod Names
            let modName = mappoolModName[i].value.trim();
            if (modName == "") errMsg += `Entry ${i + 1} has no mod name\n`
            else if (modName.length < modAbb.length) errMsg += `Are you sure your mod name on entry ${i + 1} is supposed to be shorter than the abbreivation?`

            // check number of maps. 
            let modNum = mappoolModNumber[i].value;
            if (modNum == "") errMsg += `Entry ${i + 1} has no number of maps!\n`
            else if (modNum <= 0) errMsg += `You cannot have 0 or less number of maps! (Entry ${i + 1})\n`
            else if (modNum > 15) errMsg += `Woah... that is a lot of maps on entry ${i + 1}...\n`
        }
    } else {
        errMsg += "Please add some mods!";
    }

    if (errMsg != "") {
        alert(errMsg);
    } else {
        document.getElementById("mappoolTemplateGeneratorPage").style.display = "none";
        mappoolGeneratorPageDisplay(mappoolModAbbreviation, mappoolModName, mappoolModNumber)
    }
}   