// Socket Events
// Credits: VictimCrasher - https://github.com/VictimCrasher/static/tree/master/WaveTournament
let socket = new ReconnectingWebSocket("ws://" + location.host + "/ws");
socket.onopen = () => { console.log("Successfully Connected"); };
socket.onclose = event => { console.log("Socket Closed Connection: ", event); socket.send("Client Closed!"); };
socket.onerror = error => { console.log("Socket Error: ", error); };

// Colours
let leftColour = "rgb(232,107,88)";
let rightColour = "rgb(103,196,255)";
let protectColor = "rgb(252,245,149)";

// Team Names
let teamRedName = document.getElementById("teamRedName");
let teamBlueName = document.getElementById("teamBlueName");
let currentTeamRedName;
let currentTeamBlueName;

// UserIDs with player avatars
let teamRedIcon = document.getElementById("teamRedIcon");
let teamBlueIcon = document.getElementById("teamBlueIcon");
let currentUserID0
let currentUserID1;

// Stars
let teamRedStars = document.getElementById("teamRedStars");
let teamBlueStars = document.getElementById("teamBlueStars");
let currentStarVisibility;
let currentBestOf;
let currentStarRed;
let currentStarBlue;

// Map Details
let mapModIdentifier = document.getElementById("mapModIdentifier")
let mapInformationDetails = document.getElementById("mapInformationDetails")
let mapInformationTitle = document.getElementById("mapInformationTitle")
let mapInformationDifficultyAndMapper = document.getElementById("mapInformationDifficultyAndMapper")
let mapInformationDifficulty = document.getElementById("mapInformationDifficulty")
let mapInformationMapper = document.getElementById("mapInformationMapper")
// Map Info
let mapStatsCS = document.getElementById("mapStatsCS");
let mapStatsAR = document.getElementById("mapStatsAR");
let mapStatsOD = document.getElementById("mapStatsOD");
let mapStatsLen = document.getElementById("mapStatsLen");
let mapStatsBPM = document.getElementById("mapStatsBPM");
let mapStatsSR = document.getElementById("mapStatsSR");
let currentMapID;

// Map Selection
let isCurrentlyMappoolPage = false;
let isAutoPickedMap = false;
let isPickedMap = false;

// Score Info
let currentScoreVisibility;
let movingScoreBars = document.getElementById("movingScoreBars");
let movingScoreBarRed = document.getElementById("movingScoreBarRed");
let movingScoreBarBlue = document.getElementById("movingScoreBarBlue");
let playScores = document.getElementById("playScores");
let playScoreRed = document.getElementById("playScoreRed");
let playScoreBlue = document.getElementById("playScoreBlue");
let currentScoreRed;
let currentScoreBlue;
let animation = {
    playScoreRed:  new CountUp('playScoreRed', 0, 0, 0, .2, {useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
    playScoreBlue:  new CountUp('playScoreBlue', 0, 0, 0, .2, {useEasing: true, useGrouping: true, separator: ",", decimal: "." }),
}

// Chat
let chatDisplay = document.getElementById("chatDisplay");
let danceShake = document.getElementById("danceShake")
let chatLen = 0;
let chatColour;

// Mappool Reactions
let mappoolViewMapWrapper = document.getElementsByClassName("mappoolViewMapWrapper");
let loadedMaps = false;
let clearedInterval = false;
let mappoolInteractionCreate = setInterval(() => {
    if (!loadedMaps) {
        for (var i = 0; i < mappoolViewMapWrapper.length; i++) {
            mappoolViewMapWrapper[i].addEventListener("click", mapClickEvent);
            console.log("Map Added"); 
        }
        loadedMaps = true;
    }
}, 1000)
let redProtect = document.getElementById("redProtect");
let blueProtect = document.getElementById("blueProtect");
let redBan = document.getElementById("redBan");
let blueBan = document.getElementById("blueBan");
let redPick = document.getElementById("redPick");
let bluePick = document.getElementById("bluePick");
let removeSelection = document.getElementById("removeSelection");
let protectCount = 0;

let mapStatsIndiv = document.getElementsByClassName("mapStatsIndiv");

// Map Display
let mapDisplay = document.getElementById("mapDisplay");
let mapChooserTeam = document.getElementById("mapChooserTeam");
let mapDisplayMapContainer = document.getElementById("mapDisplayMapContainer");
let mapDisplayMapImage = document.getElementById("mapDisplayMapImage");
let mapDisplayMapTitle = document.getElementById("mapDisplayMapTitle");
let mapDisplayMapDifficultyName = document.getElementById("mapDisplayMapDifficultyName");
let mapDisplayMapMapperName = document.getElementById("mapDisplayMapMapperName");
let mapDisplayMapMod = document.getElementById("mapDisplayMapMod");

// IPC State and Automation
let ipcState;

socket.onmessage = event => {
    let data = JSON.parse(event.data);
    console.log(data);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Clearing Intervals ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (!clearedInterval) {
        if (loadedMaps) { clearInterval(mappoolInteractionCreate); }
        clearedInterval = true;
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Team Names ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (currentTeamRedName !== data.tourney.manager.teamName.left) {
        currentTeamRedName = data.tourney.manager.teamName.left;
        teamRedName.innerText = currentTeamRedName;
    }
    if (currentTeamBlueName !== data.tourney.manager.teamName.right) {
        currentTeamBlueName = data.tourney.manager.teamName.right;
        teamBlueName.innerText = currentTeamBlueName;
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Team Icons ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (currentUserID0 !== data.tourney.ipcClients[0].spectating.userID) {
        currentUserID0 = data.tourney.ipcClients[0].spectating.userID;
        teamRedIcon.setAttribute("src",`https://a.ppy.sh/${currentUserID0}`);
        if (currentUserID0 == 0) {
            teamRedIcon.style.display = "none";
            teamRedName.style.left = "65px";
            teamRedStars.style.left = "2px";
        } else {
            teamRedIcon.style.display = "block";
            teamRedName.style.left = "165px";
            teamRedStars.style.left = "102px";
        }
    }
    if (currentUserID1 !== data.tourney.ipcClients[1].spectating.userID) {
        currentUserID1 = data.tourney.ipcClients[1].spectating.userID;
        teamBlueIcon.setAttribute("src",`https://a.ppy.sh/${currentUserID1}`);
        if (currentUserID1 == 0) {
            teamBlueIcon.style.display = "none";
            teamBlueName.style.right = "65px";
            teamBlueStars.style.right = "2px";
        } else {
            teamBlueIcon.style.display = "block";
            teamBlueName.style.right = "165px";
            teamBlueStars.style.right = "102px";
        }
    }
    
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Generate Stars ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function generateStar(starNo,starSide,starStatus) {
        let starCreate = document.createElement("div");
        starCreate.classList.add("star");
        if (starStatus == "fill") starCreate.classList.add("starFill")
        starCreate.style.transition = "500ms ease-in-out";
        (starSide == "left") ? starCreate.style.left = `${67 + (i * 40 / 2)}px` : starCreate.style.right = `${67 + (i * 40 / 2)}px`;
        starCreate.style.top = (starNo % 2 == 1) ? "118px" : "103px";
        return starCreate;
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Stars Visibility ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (currentStarVisibility !== data.tourney.manager.bools.starsVisible) {
        currentStarVisibility = data.tourney.manager.bools.starsVisible;
        if (currentStarVisibility) {
            teamRedStars.style.opacity = 1;
            teamBlueStars.style.opacity = 1;
        } else {
            teamRedStars.style.opacity = 0;
            teamBlueStars.style.opacity = 0;
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Setting Star Count ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (currentBestOf !== Math.ceil(data.tourney.manager.bestOF / 2) ||
    currentStarRed !== data.tourney.manager.stars.left ||
    currentStarBlue !== data.tourney.manager.stars.right) {
        // Best Of
        currentBestOf = Math.ceil(data.tourney.manager.bestOF / 2)
        
        // Left Stars
        currentStarRed = data.tourney.manager.stars.left;
        teamRedStars.innerHTML = '';
        for (var i = 0; i < currentStarRed; i++) teamRedStars.appendChild(generateStar(i,"left","fill"));
        for (i; i < currentBestOf; i++) teamRedStars.appendChild(generateStar(i,"left","nofill"))

        // Right Stars
        currentStarBlue = data.tourney.manager.stars.right;
        teamBlueStars.innerHTML = '';
        for (var i = 0; i < currentStarBlue; i++) teamBlueStars.appendChild(generateStar(i,"right","fill"))
        for (i; i < currentBestOf; i++) teamBlueStars.appendChild(generateStar(i,"right","nofill"))
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Map Info ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (currentMapID !== data.menu.bm.id) {
        currentMapID = data.menu.bm.id;
        // Reset map mod identifier
        mapModIdentifier.innerText = "NP"
        mapModIdentifier.style.backgroundColor = "darkgray";
        mapModIdentifier.style.color = "rgb(70,70,70)";
        // Map Background
        mapInformationDetails.style.backgroundImage = `url("https://assets.ppy.sh/beatmaps/${data.menu.bm.set}/covers/cover.jpg")`
        // Map Title
        mapInformationTitle.innerText = `${data.menu.bm.metadata.artist.toUpperCase()} - ${data.menu.bm.metadata.title.toUpperCase()}`
        if (mapInformationTitle.getBoundingClientRect().width > 444) mapInformationTitle.classList.add("mapInformationDetailTextWrap")
        else mapInformationTitle.classList.remove("mapInformationDetailTextWrap")
        // Map Difficulty and Mapper
        mapInformationDifficulty.innerText = `[${data.menu.bm.metadata.difficulty.toUpperCase()}]`
        mapInformationMapper.innerText = data.menu.bm.metadata.mapper.toUpperCase()
        if (mapInformationDifficultyAndMapper.getBoundingClientRect().width > 444) mapInformationDifficultyAndMapper.classList.add("mapInformationDetailTextWrap")
        else mapInformationDifficultyAndMapper.classList.remove("mapInformationDetailTextWrap")
        
        let getMaps = new Promise((resolve, reject) => {
            let mapsArray = getAllMaps();
            resolve(mapsArray);  
        })

        getMaps.then((mapsArray) => {
            let foundMapFromMappool = false;
            let currentMap;

            for (var i = 0; i < mapsArray.length; i++) {
                for (var j = 0; j < mapsArray[i].length; j++) {
                    if (mapsArray[i][j].beatmapID == data.menu.bm.id) {
                        // Map Stats
                        currentMap = mapsArray[i][j];
                        foundMapFromMappool = true;
                            
                        mapStatsCS.innerText = parseFloat(mapsArray[i][j].cs).toFixed(1);
                        mapStatsAR.innerText = parseFloat(mapsArray[i][j].cs).toFixed(1);
                        mapStatsOD.innerText = parseFloat(mapsArray[i][j].cs).toFixed(1);

                        mapStatsLen.innerText = `${("0" + Math.floor(parseInt(mapsArray[i][j].songLength) / 60)).slice(-2)}:${("0" + Math.floor(parseInt(mapsArray[i][j].songLength) % 60)).slice(-2)}`;
                        mapStatsBPM.innerText = Math.round((parseFloat(mapsArray[i][j].bpm) + Number.EPSILON) * 100) / 100;
                        mapStatsSR.innerText = parseFloat(mapsArray[i][j].difficultyrating).toFixed(2);

                        if (isCurrentlyMappoolPage && !isAutoPickedMap && !isPickedMap) {
                            document.getElementById(currentMap.beatmapID).click();
                            isAutoPickedMap = true;
                        }
                    }
                    if (foundMapFromMappool) break;
                }
                if (foundMapFromMappool) break;
            }

            if (!foundMapFromMappool) {
                // CS / AR / OD / SR
                mapStatsCS.innerText = data.menu.bm.stats.CS.toFixed(1);
                mapStatsAR.innerText = data.menu.bm.stats.AR.toFixed(1);
                mapStatsOD.innerText = data.menu.bm.stats.OD.toFixed(1);
                mapStatsSR.innerText = data.menu.bm.stats.SR.toFixed(2); 
                // BPM
                if (data.menu.bm.stats.BPM.max - data.menu.bm.stats.BPM.min > 0) { 
                    mapStatsBPM.innerText = `${data.menu.bm.stats.BPM.min} - ${data.menu.bm.stats.BPM.max }`; 
                }   else { mapStatsBPM.innerText = data.menu.bm.stats.BPM.min; }
                // LEN
                let currentLengthSeconds = Math.round(data.menu.bm.time.full / 1000)
                mapStatsLen.innerText = `${("0" + Math.floor(parseInt(currentLengthSeconds) / 60)).slice(-2)}:${("0" + Math.floor(parseInt(currentLengthSeconds) % 60)).slice(-2)}`;
            }
        })
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~ Score And Chat Information ~~~~~~~~~~~~~~~~~~~~~~~~~
    if (currentScoreVisibility !== data.tourney.manager.bools.scoreVisible) {
        currentScoreVisibility = data.tourney.manager.bools.scoreVisible;
        if (currentScoreVisibility) {
            chatDisplay.style.bottom = "-80px";
            chatDisplay.style.opacity = 0;
            danceShake.style.right = "40px"
            if (ipcState != 4) {
                movingScoreBars.style.opacity = 1;
                playScores.style.opacity = 1;
            } else {
                movingScoreBars.style.opacity = 0;
                playScores.style.opacity = 0;
            }
        } else {
            chatDisplay.style.bottom = 0;
            chatDisplay.style.opacity = 1;
            danceShake.style.right = "630px"
            movingScoreBars.style.opacity = 0;
            playScores.style.opacity = 0;
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Scores ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (currentScoreVisibility) {
        currentScoreRed = data.tourney.manager.gameplay.score.left;
        currentScoreBlue = data.tourney.manager.gameplay.score.right;

        animation.playScoreRed.update(currentScoreRed);
        animation.playScoreBlue.update(currentScoreBlue);

        if (currentScoreRed > currentScoreBlue) {
            // Fonts
            playScoreRed.style.fontSize = "40px"
            playScoreRed.style.fontFamily = "FuturistBold"
            playScoreBlue.style.fontSize = "28px"
            playScoreBlue.style.fontFamily = "Futurist"

            // Colours
            playScoreRed.style.color = "var(--red)"
            playScoreBlue.style.color = "white"

            // Line Heights
            playScoreRed.style.lineHeight = "43px"
            playScoreBlue.style.lineHeight = "none"

            // Moving Score Bars
            movingScoreBarRed.style.width = ((currentScoreRed - currentScoreBlue) / 900000 * 960) + "px";
            movingScoreBarBlue.style.width = 0;
        } else if (currentScoreRed == currentScoreBlue) {
            // Fonts
            playScoreRed.style.fontSize = "28px"
            playScoreRed.style.fontFamily = "Futurist"
            playScoreBlue.style.fontSize = "28px"
            playScoreBlue.style.fontFamily = "Futurist"

            // Colours
            playScoreRed.style.color = "white"
            playScoreBlue.style.color = "white"

            // Line Heights
            playScoreRed.style.lineHeight = "none"
            playScoreBlue.style.lineHeight = "none"

            // Moving Score Bars
            movingScoreBarRed.style.width = 0
            movingScoreBarBlue.style.width = 0;
        } else {
            // Fonts
            playScoreRed.style.fontSize = "28px"
            playScoreRed.style.fontFamily = "Futurist"
            playScoreBlue.style.fontSize = "40px"
            playScoreBlue.style.fontFamily = "FuturistBold"

            // Colours
            playScoreRed.style.color = "white"
            playScoreBlue.style.color = "var(--blue)"

            // Line Heights
            playScoreRed.style.lineHeight = "none"
            playScoreBlue.style.lineHeight = "43px"
            
            // Moving Score Bars
            movingScoreBarRed.style.width = 0;
            movingScoreBarBlue.style.width = ((currentScoreBlue - currentScoreRed) / 900000 * 960) + "px";
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Chat ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // This is also mostly taken from Victim Crasher: https://github.com/VictimCrasher/static/tree/master/WaveTournament
    if (!currentScoreVisibility) {
        // Only happens if there are no new chats messages, or the chat length is the same
        if (chatLen !== data.tourney.manager.chat.length) {
            if (chatLen == 0 || (chatLen > 0 && chatLen > data.tourney.manager.chat.length)) {
                // Reset everything for a new chat.
				chatDisplay.innerHTML = "";
				chatLen = 0;
            }
            
            for (var i = chatLen; i < data.tourney.manager.chat.length; i++) {
                chatColour = data.tourney.manager.chat[i].team;

                let messageWrapper = document.createElement("div");
                messageWrapper.setAttribute('class', 'messageWrapper');

				let messageTime = document.createElement('div');
				messageTime.setAttribute('class', 'messageTime');
                messageTime.innerText = data.tourney.manager.chat[i].time;

                let wholeMessage = document.createElement("div");
                wholeMessage.setAttribute('class', 'wholeMessage');

				let messageUser = document.createElement('div');
				messageUser.setAttribute('class', 'messageUser');
                messageUser.innerText = data.tourney.manager.chat[i].name + ":\xa0";

                let messageText = document.createElement('div');
				messageText.setAttribute('class', 'messageText');
                messageText.innerText = data.tourney.manager.chat[i].messageBody;

                messageUser.classList.add(chatColour);

                messageWrapper.append(messageTime);
                messageWrapper.append(wholeMessage);
                wholeMessage.append(messageUser);
                wholeMessage.append(messageText);
                chatDisplay.append(messageWrapper);
            }
			chatLen = data.tourney.manager.chat.length;
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~ IPC states and Automation ~~~~~~~~~~~~~~~~~~~~~~~~ */
    if (ipcState !== data.tourney.manager.ipcState) {
        ipcState = data.tourney.manager.ipcState
        if (ipcState == 3) {
            isCurrentlyMappoolPage = false;
            isAutoPickedMap = false;
            isPickedMap = false;
        } else if (ipcState == 4) {
            setTimeout(() => {
                if (currentStarVisibility == true && 
                    !(currentStarRed == currentBestOf || currentStarBlue == currentBestOf)) {
                    toMappoolView();
                    isCurrentlyMappoolPage = true;
                }
            }, 20000)
        }
    }
}

function mapClickEvent() {
    this.style.outline = "4px solid";
    if (redBan.selected || redPick.selected) this.style.outlineColor = leftColour
    else if (bluePick.selected || blueBan.selected) this.style.outlineColor = rightColour
    else this.style.outlineColor = "rgba(0,0,0,0)"

    for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].classList.contains("mapText")) this.removeChild(this.childNodes[i])
    }

    // Changing the display of the mapText based on what was selected and by who
    // Moving the selection onto the opposing team
    let mapText = document.createElement("div");
    mapText.classList.add("mapText");
    if (redBan.selected) {  mapText.innerText = `Banned by ${currentTeamRedName}`; this.appendChild(mapText); }
    else if (blueBan.selected) { mapText.innerText = `Banned by ${currentTeamBlueName}`; this.appendChild(mapText); }
    else if (redProtect.selected) { this.appendChild(mapText); mapText.style.backgroundColor = "rgba(0,0,0,0)"; this.style.outline = `4px dashed ${leftColour}`; }
    else if (blueProtect.selected) { this.appendChild(mapText); mapText.style.backgroundColor = "rgba(0,0,0,0)"; this.style.outline = `4px dashed ${rightColour}`; }
    else if (redPick.selected) { 
        mapText.innerText = `Picked by ${currentTeamRedName}`;
        for (var i = 0; i < mapStatsIndiv.length; i++) { mapStatsIndiv[i].style.color = leftColour; }
        isPickedMap = true;
        this.appendChild(mapText);
    }
    else if (bluePick.selected) { 
        mapText.innerText = `Picked by ${currentTeamBlueName}`; 
        for (var i = 0; i < mapStatsIndiv.length; i++) mapStatsIndiv[i].style.color = rightColour
        isPickedMap = true;
        this.appendChild(mapText);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Map Display ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (mapDisplayMapContainer.classList.contains("mapDisplayMapContainerPulseRed")) { mapDisplayMapContainer.classList.remove("mapDisplayMapContainerPulseRed"); }
    if (mapDisplayMapContainer.classList.contains("mapDisplayMapContainerPulseBlue")) { mapDisplayMapContainer.classList.remove("mapDisplayMapContainerPulseBlue"); }

    if (!removeSelection.selected) {
        let getMaps = new Promise((resolve, reject) => {
            let mapsArray = getAllMaps();
            resolve(mapsArray);  
        })
        getMaps.then((mapsArray) => {
            for (var i = 0; i < mapsArray.length; i++) {
                for (var j = 0; j < mapsArray[i].length; j++) {
                    if (mapsArray[i][j].beatmapID == this.id) {
                        foundMapFromMappool = true;
                        // Displaying Map Display Yext
                        let mapChooserTeamText = "";
                        if (redBan.selected || blueBan.selected) mapChooserTeamText = "Banned By "
                        else if (redPick.selected || bluePick.selected) mapChooserTeamText = "Picked By "
                        else if (redProtect.selected || blueProtect.selected) mapChooserTeamText = "Protected By "
    
                        if (redBan.selected || redPick.selected || redProtect.selected) {
                            mapDisplayMapContainer.classList.add("mapDisplayMapContainerPulseRed");
                            mapDisplayMapContainer.style.borderColor = leftColour;
                            mapText.style.color = leftColour;
                            mapChooserTeamText += currentTeamRedName;
                            mapChooserTeam.style.color = leftColour;
                            if (blueProtect.selected) mapDisplayMapContainer.style.borderStyle = "dashed"
                            else mapDisplayMapContainer.style.borderStyle = "solid"
                        } else if (blueBan.selected || bluePick.selected || blueProtect.selected) {
                            mapDisplayMapContainer.classList.add("mapDisplayMapContainerPulseBlue"); 
                            mapDisplayMapContainer.style.borderColor = rightColour;
                            mapText.style.color = rightColour;
                            mapChooserTeamText += currentTeamBlueName;
                            mapChooserTeam.style.color = rightColour;
                            if (blueProtect.selected) mapDisplayMapContainer.style.borderStyle = "dashed"
                            else mapDisplayMapContainer.style.borderStyle = "solid"
                        }
                        mapChooserTeam.innerText = mapChooserTeamText;
    
                        // Map Display Container
                        mapDisplayMapImage.style.backgroundImage = `url("${mapsArray[i][j].imgURL}")`;
                        mapDisplayMapTitle.innerText = `${mapsArray[i][j].artist} - ${mapsArray[i][j].songName}`;
                        mapDisplayMapDifficultyName.innerText = mapsArray[i][j].difficultyname;
                        mapDisplayMapMapperName.innerText = mapsArray[i][j].mapper;
    
                        mapDisplayMapMod.setAttribute("src",`mods/${mapsArray[i][j].mod}.png`);
                        mapDisplayMapOn();
                        setTimeout(() => {
                            mapDisplay.style.opacity = "0";
                            setTimeout(() => mapDisplay.style.display = "none" , 500)
                            if (redPick.selected || bluePick.selected)toSpectatorView()
                        }, 5000);

                        if (mapDisplayMapTitle.getBoundingClientRect().width >= 1000) mapDisplayMapTitle.classList.add("mapDisplayMapTitleWrap");
                        else mapDisplayMapTitle.classList.remove("mapDisplayMapTitleWrap");
                        if (mapDisplayMapDifficultyName.getBoundingClientRect().width >= 340) mapDisplayMapDifficultyName.classList.add("mapDisplayMapDifficultyWrap");
                        else mapDisplayMapDifficultyName.classList.remove("mapDisplayMapDifficultyWrap");
                        if (mapDisplayMapMapperName.getBoundingClientRect().width >= 340) mapDisplayMapMapperName.classList.add("mapDisplayMapMapperWrap")
                        else mapDisplayMapMapperName.classList.remove("mapDisplayMapMapperWrap")
                    
                        if (redBan.selected) blueBan.selected = true
                        else if (blueBan.selected) redBan.selected = true
                        else if (redPick.selected) bluePick.selected = true
                        else if (bluePick.selected) redPick.selected = true

                        if (redProtect.selected && protectCount >= 2) { blueBan.selected = true;}
                        else if (redProtect.selected) { blueProtect.selected = true; }
                        else if (blueProtect.selected && protectCount >= 2) { redBan.selected = true; }
                        else if (blueProtect.selected) { redProtect.selected = true; }
                    }
                }
            }
        })
    }
}

// Reset Picks/Bans
function resetPicksBansQuestion() {
    // Create Question
    let resetPicksBansConfirmQuestion = document.createElement("p");
    resetPicksBansConfirmQuestion.setAttribute("onclick","resetPicksBansConfirm()");
    resetPicksBansConfirmQuestion.innerText = "Hello! Please confirm if you want to reset all of the picks and bans."
    resetPicksBansConfirmQuestion.style.color = "white";
    resetPicksBansConfirmQuestion.style.textAlign = "center";
    let resetPicksBans = document.getElementById("resetPicksBans")
    resetPicksBans.appendChild(resetPicksBansConfirmQuestion);

    resetPicksBansYesButton = document.createElement("button");
    resetPicksBansYesButton.setAttribute("onclick","resetPicksBansConfirm()");
    resetPicksBansYesButton.classList.add("navButton");
    resetPicksBansYesButton.innerText = "Yes";
    resetPicksBansNoButton = document.createElement("button");
    resetPicksBansNoButton.classList.add("navButton");
    resetPicksBansNoButton.innerText = "No";
    resetPicksBansNoButton.setAttribute("onclick","removeLastElementNavBarPicksBans()")

    resetPicksBans.appendChild(resetPicksBansConfirmQuestion);
    resetPicksBans.appendChild(resetPicksBansYesButton);
    resetPicksBans.appendChild(resetPicksBansNoButton);
}
function resetPicksBansConfirm() {
    removeLastElementNavBarPicksBans();
    let mappoolViewMapWrappers = document.getElementsByClassName("mappoolViewMapWrapper");
    for (var i = 0; i < mappoolViewMapWrappers.length; i++) {
        mappoolViewMapWrappers[i].style.outline = "rgba(0,0,0,0) solid 0px";

        for (var j = 0; j < mappoolViewMapWrappers[i].childNodes.length; j++) {
            if (mappoolViewMapWrappers[i].childNodes[j].classList.contains("mapText")) mappoolViewMapWrappers[i].removeChild(mappoolViewMapWrappers[i].childNodes[j])
        }
    }
    protectCount = 0;
}
function removeLastElementNavBarPicksBans() {
    let resetPicksBans = document.getElementById("resetPicksBans");
    for (var i = 0; i < 3; i++) resetPicksBans.removeChild(resetPicksBans.lastChild);
    isAutoPickedMap = false;
    isPickedMap = false;
}

// Map Display Switch
function mapDisplayMapOn() {
    mapDisplay.style.display = "block";
    setTimeout(() => mapDisplay.style.opacity = "1",100)
}
function mapDisplayMapOff() {
    mapDisplay.style.display = "none";
    setTimeout(() => mapDisplay.style.opacity = "0",500)
}

function toMappoolView() {
    document.getElementById("spectatorViewPage").style.transitionDelay = "0ms"
    document.getElementById("mappoolViewPage").style.transitionDelay = "500ms"
    movingScoreBars.style.opacity = 0;
    playScores.style.opacity = 0;

    isCurrentlyMappoolPage = true;
    document.getElementById("mappoolTemplateGeneratorPage").style.display = "none";
    document.getElementById("mappoolViewPage").style.opacity = 1
    document.getElementById("spectatorViewPage").style.left = "-1920px"
}
function toSpectatorView() {
    document.getElementById("spectatorViewPage").style.transitionDelay = "500ms"
    document.getElementById("mappoolViewPage").style.transitionDelay = "0ms"

    isCurrentlyMappoolPage = false;
    document.getElementById("mappoolTemplateGeneratorPage").style.display = "none";
    document.getElementById("mappoolViewPage").style.opacity = 0
    document.getElementById("spectatorViewPage").style.left = 0;
}