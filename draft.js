// ===============================
// DRAFT STATE
// ===============================

const roster = {
    QB: null,
    RB1: null,
    RB2: null,
    WR1: null,
    WR2: null,
    TE: null,
    FLEX: null,
    DEF: null,
    K: null
};


let selectedDraftPlayer = null;


const draftedPlayerNames = new Set();

let currentDraftTeam = null;

let isSpinning = false;

let respinAvailable = true;

// ===============================
// NFL TEAM COLORS
// ===============================

const nflTeamColors = {

    "Arizona Cardinals": {
        primary: "#97233F",
        secondary: "#000000"
    },

    "Atlanta Falcons": {
        primary: "#A71930",
        secondary: "#000000"
    },

    "Baltimore Ravens": {
        primary: "#241773",
        secondary: "#9E7C0C"
    },

    "Buffalo Bills": {
        primary: "#00338D",
        secondary: "#C60C30"
    },

    "Carolina Panthers": {
        primary: "#0085CA",
        secondary: "#101820"
    },

    "Chicago Bears": {
        primary: "#0B162A",
        secondary: "#C83803"
    },

    "Cincinnati Bengals": {
        primary: "#FB4F14",
        secondary: "#000000"
    },

    "Cleveland Browns": {
        primary: "#311D00",
        secondary: "#FF3C00"
    },

    "Dallas Cowboys": {
        primary: "#003594",
        secondary: "#869397"
    },

    "Denver Broncos": {
        primary: "#FB4F14",
        secondary: "#002244"
    },

    "Detroit Lions": {
        primary: "#0076B6",
        secondary: "#B0B7BC"
    },

    "Green Bay Packers": {
        primary: "#203731",
        secondary: "#FFB612"
    },

    "Houston Texans": {
        primary: "#03202F",
        secondary: "#A71930"
    },

    "Indianapolis Colts": {
        primary: "#002C5F",
        secondary: "#A2AAAD"
    },

    "Jacksonville Jaguars": {
        primary: "#006778",
        secondary: "#D7A22A"
    },

    "Kansas City Chiefs": {
        primary: "#E31837",
        secondary: "#FFB81C"
    },

    "Las Vegas Raiders": {
        primary: "#000000",
        secondary: "#A5ACAF"
    },

    "Los Angeles Chargers": {
        primary: "#0080C6",
        secondary: "#FFC20E"
    },

    "Los Angeles Rams": {
        primary: "#003594",
        secondary: "#FFA300"
    },

    "Miami Dolphins": {
        primary: "#008E97",
        secondary: "#FC4C02"
    },

    "Minnesota Vikings": {
        primary: "#4F2683",
        secondary: "#FFC62F"
    },

    "New England Patriots": {
        primary: "#002244",
        secondary: "#C60C30"
    },

    "New Orleans Saints": {
        primary: "#D3BC8D",
        secondary: "#101820"
    },

    "New York Giants": {
        primary: "#0B2265",
        secondary: "#A71930"
    },

    "New York Jets": {
        primary: "#125740",
        secondary: "#FFFFFF"
    },

    "Philadelphia Eagles": {
        primary: "#004C54",
        secondary: "#A5ACAF"
    },

    "Pittsburgh Steelers": {
        primary: "#FFB612",
        secondary: "#101820"
    },

    "San Francisco 49ers": {
        primary: "#AA0000",
        secondary: "#B3995D"
    },

    "Seattle Seahawks": {
        primary: "#002244",
        secondary: "#69BE28"
    },

    "Tampa Bay Buccaneers": {
        primary: "#D50A0A",
        secondary: "#FF7900"
    },

    "Tennessee Titans": {
        primary: "#0C2340",
        secondary: "#4B92DB"
    },

    "Washington Commanders": {
        primary: "#5A1414",
        secondary: "#FFB612"
    }
};

// ===============================
// APPLY NFL TEAM COLORS
// ===============================

function applyTeamColors(teamName) {

    const colors =
        nflTeamColors[teamName];

    if (!colors) {
        return;
    }

    const draftSection =
        document.getElementById(
            "draft-section"
        );

    draftSection.style.setProperty(
        "--team-primary",
        colors.primary
    );

    draftSection.style.setProperty(
        "--team-secondary",
        colors.secondary
    );
}

let userTeamRating = 0;


// ===============================
// PAGE ELEMENTS
// ===============================

const randomizeTeamButton =
    document.getElementById("randomize-team-button");
const respinTeamButton =
    document.getElementById("respin-team-button");

const randomTeamDisplay =
    document.getElementById("random-team-display");

const playerOptions =
    document.getElementById("player-options");


// ===============================
// CHECK IF PLAYER CAN STILL BE DRAFTED
// ===============================

function playerFitsRoster(player) {

    if (draftedPlayerNames.has(player.name)) {
        return false;
    }

    if (player.position === "QB") {
        return roster.QB === null;
    }

    if (player.position === "RB") {
        return (
            roster.RB1 === null ||
            roster.RB2 === null ||
            roster.FLEX === null
        );
    }

    if (player.position === "WR") {
        return (
            roster.WR1 === null ||
            roster.WR2 === null ||
            roster.FLEX === null
        );
    }

    if (player.position === "TE") {
        return (
            roster.TE === null ||
            roster.FLEX === null
        );
    }

    if (player.position === "DEF") {
        return roster.DEF === null;
    }

    if (player.position === "K") {
        return roster.K === null;
    }

    return false;
}


// ===============================
// GET ELIGIBLE PLAYERS FROM TEAM
// ===============================

function getEligiblePlayers(teamName) {

    const teamRoster = playerDatabase[teamName];

    if (!teamRoster) {
        return [];
    }

    return teamRoster.filter(function(player) {
        return playerFitsRoster(player);
    });
}


// ===============================
// DISPLAY RANDOM TEAM
// ===============================


// ===============================
// GET AVAILABLE ROSTER SPOTS
// ===============================

function getAvailableRosterSpots(player) {

    const availableSpots = [];

    if (player.position === "QB") {

        if (roster.QB === null) {
            availableSpots.push("QB");
        }
    }

    else if (player.position === "RB") {

        if (roster.RB1 === null) {
            availableSpots.push("RB1");
        }

        if (roster.RB2 === null) {
            availableSpots.push("RB2");
        }

        if (roster.FLEX === null) {
            availableSpots.push("FLEX");
        }
    }

    else if (player.position === "WR") {

        if (roster.WR1 === null) {
            availableSpots.push("WR1");
        }

        if (roster.WR2 === null) {
            availableSpots.push("WR2");
        }

        if (roster.FLEX === null) {
            availableSpots.push("FLEX");
        }
    }

    else if (player.position === "TE") {

        if (roster.TE === null) {
            availableSpots.push("TE");
        }

        if (roster.FLEX === null) {
            availableSpots.push("FLEX");
        }
    }

    else if (player.position === "DEF") {

        if (roster.DEF === null) {
            availableSpots.push("DEF");
        }
    }

    else if (player.position === "K") {

        if (roster.K === null) {
            availableSpots.push("K");
        }
    }

    return availableSpots;
}


// ===============================
// UPDATE ROSTER ON SCREEN
// ===============================

function updateRosterDisplay() {

    Object.keys(roster).forEach(function(rosterSpot) {

        const rosterBox =
            document.getElementById(`roster-${rosterSpot}`);

        const player = roster[rosterSpot];

        const playerText =
            rosterBox.querySelector("span");

        if (player) {

            playerText.textContent =
                `${player.name} — ${player.rating}`;

        } else {

            playerText.textContent = "Empty";
        }
    });
}


// ===============================
// CHECK IF DRAFT IS COMPLETE
// ===============================

function isDraftComplete() {

    return Object.values(roster).every(function(player) {
        return player !== null;
    });
}


// ===============================
// CALCULATE TEAM RATING
// ===============================

function calculateTeamRating() {

    const weights = {
        QB: 0.22,
        RB1: 0.12,
        RB2: 0.10,
        WR1: 0.12,
        WR2: 0.10,
        TE: 0.10,
        FLEX: 0.10,
        DEF: 0.08,
        K: 0.06
    };

    let rating = 0;

    Object.keys(roster).forEach(function(rosterSpot) {

        rating +=
            roster[rosterSpot].rating *
            weights[rosterSpot];
    });

    return Math.round(rating);
}


// ===============================
// DRAFT PLAYER
// ===============================

function draftPlayer(player) {

    const availableSpots =
        getAvailableRosterSpots(player);

    if (availableSpots.length === 0) {
        return;
    }

    // If there is only one possible spot,
    // put the player there automatically.
    if (availableSpots.length === 1) {

        placePlayerOnRoster(
            player,
            availableSpots[0]
        );

        return;
    }


    // If multiple spots are available,
    // let the user choose.
    randomTeamDisplay.innerHTML = `
        <h3>${player.name}</h3>
        <p>
            Choose which roster spot
            you want to use.
        </p>
    `;

    playerOptions.innerHTML = "";

    respinTeamButton.style.display = "none";


    availableSpots.forEach(function(rosterSpot) {

        const spotButton =
            document.createElement("button");

        let spotLabel = rosterSpot;

        if (rosterSpot === "RB1") {
            spotLabel = "RB 1";
        }

        else if (rosterSpot === "RB2") {
            spotLabel = "RB 2";
        }

        else if (rosterSpot === "WR1") {
            spotLabel = "WR 1";
        }

        else if (rosterSpot === "WR2") {
            spotLabel = "WR 2";
        }

        spotButton.textContent =
            `Place at ${spotLabel}`;

        spotButton.addEventListener(
            "click",
            function() {

                placePlayerOnRoster(
                    player,
                    rosterSpot
                );
            }
        );

        playerOptions.appendChild(
            spotButton
        );
    });
}


// ===============================
// PLACE PLAYER ON ROSTER
// ===============================

function placePlayerOnRoster(
    player,
    rosterSpot
) {

    roster[rosterSpot] = player;

    draftedPlayerNames.add(player.name);

    updateRosterDisplay();

    playerOptions.innerHTML = "";

    respinTeamButton.style.display = "none";


    if (isDraftComplete()) {

    userTeamRating =
        calculateTeamRating();

    randomizeTeamButton.disabled = true;
    randomizeTeamButton.style.display = "none";

    respinTeamButton.style.display = "none";

    randomTeamDisplay.classList.add(
    "draft-complete-mode"
);

randomTeamDisplay.innerHTML = `
    <div class="draft-complete-panel">

        <div class="draft-complete-label">
            ROSTER COMPLETE
        </div>

        <h3>Team Built.</h3>

        <div class="final-team-rating">
            ${userTeamRating}
        </div>

        <div class="final-rating-label">
            TEAM RATING
        </div>

        <p>
            Your roster is ready for the season.
        </p>

        <button id="start-season-button">
            Start Season
        </button>

    </div>
`;

    const startSeasonButton =
        document.getElementById(
            "start-season-button"
        );

    startSeasonButton.addEventListener(
        "click",
        function() {

            document.getElementById(
                "draft-section"
            ).style.display = "none";

            document.getElementById(
                "season-section"
            ).style.display = "block";

            document.getElementById(
                "team-rating-display"
            ).textContent =
                `Team Rating: ${userTeamRating}`;
            startNewSeason();
        }
    );

    } else {

        randomizeTeamButton.disabled = false;

        randomizeTeamButton.textContent =
            "Spin for Next Team";

        randomTeamDisplay.innerHTML = `
            <h3>${player.name} Drafted</h3>

            <p>
                Added to ${rosterSpot}.
                Spin for your next player.
            </p>
        `;
    }
}


function displayRandomTeam(teamName) {

    const eligiblePlayers =
        getEligiblePlayers(teamName);

        applyTeamColors(teamName);

    randomTeamDisplay.innerHTML = `
    <div class="draft-pick-label">
        DRAFT PICK
    </div>

    <h3>${teamName}</h3>

    <p>
        Choose one player from this team.
    </p>
`;

    playerOptions.innerHTML = "";

    if (eligiblePlayers.length === 0) {

        playerOptions.innerHTML = `
            <p>
                This team has no players that fit your
                remaining roster spots. Randomize again.
            </p>
        `;

        return;
    }

    eligiblePlayers.forEach(function(player) {

        const playerButton =
            document.createElement("button");

        playerButton.className = "player-option";

        playerButton.textContent =
    `${player.name} — ${player.position} — ${player.rating}`;

playerButton.addEventListener("click", function () {

    // FIRST CLICK
    if (selectedDraftPlayer !== player.name) {

        selectedDraftPlayer = player.name;

        document
            .querySelectorAll(".draft-player-selected")
            .forEach(function(card) {
                card.classList.remove("draft-player-selected");
            });

        playerButton.classList.add("draft-player-selected");

        return;
    }

    // SECOND CLICK
selectedDraftPlayer = null;

draftPlayer(player);

});

playerOptions.appendChild(playerButton);

});

}


// ===============================
// RANDOMIZE NFL TEAM
// ===============================

function randomizeDraftTeam(isRespin = false) {

    if (isSpinning) {
        return;
    }

    isSpinning = true;

    randomizeTeamButton.disabled = true;
    respinTeamButton.disabled = true;

    playerOptions.innerHTML = "";

    const teamNames =
        Object.keys(playerDatabase);

    // Flash through random NFL teams
    const spinInterval = setInterval(function() {

        const randomIndex =
            Math.floor(Math.random() * teamNames.length);

        const spinningTeam =
            teamNames[randomIndex];

            applyTeamColors(spinningTeam);

        randomTeamDisplay.innerHTML = `
            <h3>${spinningTeam}</h3>
            <p>Spinning...</p>
        `;

    }, 100);


    // Land on the final team after about 2 seconds
    setTimeout(function() {

        clearInterval(spinInterval);

        const finalIndex =
            Math.floor(Math.random() * teamNames.length);

        currentDraftTeam =
            teamNames[finalIndex];

        displayRandomTeam(currentDraftTeam);

        isSpinning = false;

        // Main spin is locked until a player is drafted
        randomizeTeamButton.disabled = true;

        if (respinAvailable && !isRespin) {
            respinTeamButton.style.display = "inline-block";
            respinTeamButton.disabled = false;
        }

        else {
            respinTeamButton.style.display = "none";
        }

    }, 2000);
}


// ===============================
// RANDOMIZE BUTTON
// ===============================

randomizeTeamButton.addEventListener(
    "click",
    function() {
        randomizeDraftTeam(false);
    }
);


respinTeamButton.addEventListener(
    "click",
    function() {

        if (!respinAvailable || isSpinning) {
            return;
        }

        respinAvailable = false;

        respinTeamButton.style.display = "none";

        randomizeDraftTeam(true);
    }
);


// ===============================
// FILLED ROSTER SLOT STYLING
// ===============================

function updateFilledRosterStyles() {

    const rosterSlots =
        document.querySelectorAll(
            "#roster-grid > div"
        );


    rosterSlots.forEach(
        function(slot) {

            const playerText =
                slot.querySelector("span");


            if (!playerText) {
                return;
            }


            const isFilled =
                playerText.textContent.trim() !==
                "Empty";


            slot.classList.toggle(
                "filled-roster-slot",
                isFilled
            );
        }
    );
}


// Watch the roster as players are drafted.

const rosterGrid =
    document.getElementById(
        "roster-grid"
    );


if (rosterGrid) {

    const rosterObserver =
        new MutationObserver(
            function() {

                updateFilledRosterStyles();
            }
        );


    rosterObserver.observe(
        rosterGrid,
        {
            childList: true,
            subtree: true,
            characterData: true
        }
    );


    updateFilledRosterStyles();
}