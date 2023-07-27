let mappoolTemplateGeneratorPage = document.getElementById("mappoolTemplateGeneratorPage");
let mappoolViewPage = document.getElementById("mappoolViewPage");
let sceneViewPage = document.getElementById("sceneViewPage");
sceneViewPage.style.display = "none";
let allBeatmaps = [];

let beatmapsLoadMappoolView;
let modsLoadMappoolView;

async function loadBeatmaps() { 
    let modOrderRequest = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET",`http://localhost:24050${window.location.pathname}data/modOrder.json`, false);
        xhr.onload = async function xhrLoad()  {
            if (this.status == 200) modsLoadMappoolView = JSON.parse(this.responseText)
            else if (this.status == 404) return
        }
        xhr.send();
        resolve(modsLoadMappoolView);
    })
    modOrderRequest.then((modsLoadMappoolView) => {
        var beatmapRequest = new XMLHttpRequest();
        beatmapRequest.open("GET",`http://localhost:24050${window.location.pathname}data/beatmaps.json`, false);
        beatmapRequest.onload = function() {
            if (this.status == 404) return;
            sceneViewPage.style.display = "block";
            mappoolTemplateGeneratorPage.style.display = "none";
            beatmapsLoadMappoolView = JSON.parse(this.responseText);
            loadBeatmapsIntoMods(beatmapsLoadMappoolView, modsLoadMappoolView);
        }
        beatmapRequest.send();
    })
    return;
}

loadBeatmaps();

function loadBeatmapsIntoMods(beatmaps, mods) {
    // get all maps 
    let filteredBeatmaps = [];
    for (var i = 0; i < beatmaps.length; i++) {
        if (beatmaps[i] && Object.keys(beatmaps[i]).length == 0 && Object.getPrototypeOf(beatmaps[i]) == Object.prototype) continue
        filteredBeatmaps.push(beatmaps[i]);
    }

    for (var i = 0; i < mods.length; i++) allBeatmaps[i] = filteredBeatmaps.filter(x => x.mod.toLowerCase() == mods[i].toLowerCase())
    
    // sort maps by order
    for (var i = 0; i < allBeatmaps.length; i++) allBeatmaps[i].sort((map1, map2) => map1.order - map2.order)

    let allBeatmapsDisplay = deepCopy(allBeatmaps);
    mappoolViewLoadAllMaps(allBeatmapsDisplay);
}

function mappoolViewLoadAllMaps(beatmaps) {
    for (var i = 0; i < beatmaps.length; i++) {
        if (beatmaps[i].length != 0) {
            /* The reason for this split, is that most mod pools have between 2-6 maps.
                Some will inevitably have 4 in them. In a normal display
                This would be displayed as 3 in one line and 1 in the next.
                The intended display is 2 on each line, so they are split when creating the design of the mappool */
            if (beatmaps[i].length == 4) {
                var beatmapsSplit = beatmaps[i].splice(2);
                mappoolViewLoadSection(beatmaps[i]);
                mappoolViewLoadSection(beatmapsSplit);
            } else { mappoolViewLoadSection(beatmaps[i]); }
            document.getElementById("mappoolTemplateGeneratorPage").style.display = "none";
        }
    }
}

function mappoolViewLoadSection(beatmaps) {
    let mappoolViewLineWrapper = document.createElement("div");
    mappoolViewLineWrapper.classList.add("mappoolViewLineWrapper");
    let mappoolViewPage = document.getElementById("mappoolViewPage");
    mappoolViewPage.appendChild(mappoolViewLineWrapper)

    for (var i = 0; i < beatmaps.length; i++) {
        /* Wrapper for Map */
        let mappoolViewMapWrapper = document.createElement("div");
        mappoolViewMapWrapper.classList.add("mappoolViewMapWrapper");
        mappoolViewMapWrapper.setAttribute("id",beatmaps[i].beatmapID)
        mappoolViewLineWrapper.appendChild(mappoolViewMapWrapper);

        /* Borders for Map - do not know how to handle that JUST yet */

        /* Image for Map */
        let mappoolViewMapImg = document.createElement("div");
        mappoolViewMapImg.classList.add("mappoolViewMapImg");
        mappoolViewMapImg.style.backgroundImage = "url("+beatmaps[i].imgURL+")";
        mappoolViewMapWrapper.appendChild(mappoolViewMapImg);

        let layer = document.createElement("div");
        layer.classList.add("layer");
        mappoolViewMapImg.appendChild(layer);        

        /* Title of Map */
        let mappoolViewMapTitleWrapper = document.createElement("div");
        mappoolViewMapTitleWrapper.classList.add("mappoolViewMapTitleWrapper");
        mappoolViewMapWrapper.appendChild(mappoolViewMapTitleWrapper);

        let mappoolViewMapTitle = document.createElement("div");
        mappoolViewMapTitle.classList.add("mappoolViewMapTitle");
        let mappoolViewMapTitleContent = "<strong>"+beatmaps[i].artist+" - "+beatmaps[i].songName+" ["+beatmaps[i].difficultyname+"]"+"</strong>";
        mappoolViewMapTitle.innerHTML = mappoolViewMapTitleContent;
        mappoolViewMapTitleWrapper.appendChild(mappoolViewMapTitle);
        if (mappoolViewMapTitle.getBoundingClientRect().width >= 440) {
            mappoolViewMapTitle.classList.add("mappoolViewMapTitleWrap");
        }

        /* Mapper of Map */
        let mappoolViewMapMapper = document.createElement("div");
        mappoolViewMapMapper.classList.add("mappoolViewMapMapper");
        let mappoolViewMapMapperContent = "mapped by <strong>"+beatmaps[i].mapper+"</strong>"
        mappoolViewMapMapper.innerHTML = mappoolViewMapMapperContent;
        mappoolViewMapWrapper.appendChild(mappoolViewMapMapper);

        /* Mod Icon */
        let mod = beatmaps[i].mod.toLowerCase();
        let modIcon = new XMLHttpRequest();
        modIcon.open("GET",`http://localhost:24050${window.location.pathname}mods/${mod}.png`, true);
        modIcon.onload = function() {
            if(this.status == 200) {
                let mappoolViewMapMod = document.createElement("img");
                mappoolViewMapMod.classList.add("mappoolViewMapMod");
                mappoolViewMapMod.setAttribute("src", `mods/${mod}.png`);
                mappoolViewMapWrapper.appendChild(mappoolViewMapMod);
            }
        }
        modIcon.send();
    }
}

function getAllMaps() { return allBeatmaps; }

// Sourced From https://medium.com/@ziyoshams/deep-copying-javascript-arrays-4d5fc45a6e3e
const deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
      if(Array.isArray(elem)){
        copy.push(deepCopy(elem))
      }else{
        if (typeof elem === 'object') {
          copy.push(deepCopyObject(elem))
      } else {
          copy.push(elem)
        }
      }
    })
    return copy;
  }
  // Helper function to deal with Objects
  const deepCopyObject = (obj) => {
    let tempObj = {};
    for (let [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        tempObj[key] = deepCopy(value);
      } else {
        if (typeof value === 'object') {
          tempObj[key] = deepCopyObject(value);
        } else {
          tempObj[key] = value
        }
      }
    }
    return tempObj;
  }