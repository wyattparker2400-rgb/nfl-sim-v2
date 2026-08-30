// ===============================
// SEASON STATE
// ===============================

let seasonTeams = [];
let seasonSchedule = [];

let currentWeek = 1;

let hiddenReplacedNFLTeam = null;

let userSeasonStats = {};


// ===============================
// SHUFFLE ARRAY
// ===============================

function shuffleArray(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        const temp = shuffled[i];

        shuffled[i] =
            shuffled[randomIndex];

        shuffled[randomIndex] =
            temp;
    }

    return shuffled;
}


// ===============================
// CREATE 32-TEAM LEAGUE
// ===============================

function createSeasonTeams() {

    const replacementIndex =
        Math.floor(Math.random() * nflTeams.length);

    hiddenReplacedNFLTeam =
        nflTeams[replacementIndex].name;

    const cpuTeams =
        nflTeams.filter(function(team, index) {
            return index !== replacementIndex;
        });

    seasonTeams = [
        {
            name: "Your Team",
            rating: userTeamRating,
            wins: 0,
            losses: 0,
            pointsFor: 0,
            pointsAgainst: 0
        },

        ...cpuTeams.map(function(team) {

            return {
                name: team.name,
                rating: team.rating,
                wins: 0,
                losses: 0,
                pointsFor: 0,
                pointsAgainst: 0
            };
        })
    ];

    console.log(
        "NFL team replaced by Your Team:",
        hiddenReplacedNFLTeam
    );

    console.log(
        "Season teams:",
        seasonTeams
    );
}


// ===============================
// MATCHUP KEY
// ===============================
//
// Makes sure:
//
// Bills vs Chiefs
//
// is considered the same matchup as:
//
// Chiefs vs Bills
//
// This prevents duplicate opponents.

function getMatchupKey(teamA, teamB) {

    return [teamA, teamB]
        .sort()
        .join(" vs ");
}


// ===============================
// CREATE BYE WEEKS
// ===============================

function createByeSchedule() {

    const byeSchedule = {};

    for (let week = 1; week <= 18; week++) {
        byeSchedule[week] = [];
    }

    const shuffledTeams =
        shuffleArray(
            seasonTeams.map(function(team) {
                return team.name;
            })
        );

    const shuffledWeeks =
        shuffleArray([
            1, 2, 3, 4, 5, 6,
            7, 8, 9, 10, 11, 12,
            13, 14, 15, 16, 17, 18
        ]);

    // 32 teams need exactly one bye.
    //
    // 16 weeks will have 2 teams on bye.
    // 2 weeks will have no teams on bye.

    const byeWeeks =
        shuffledWeeks.slice(0, 16);

    let teamIndex = 0;

    byeWeeks.forEach(function(week) {

        byeSchedule[week].push(
            shuffledTeams[teamIndex]
        );

        byeSchedule[week].push(
            shuffledTeams[teamIndex + 1]
        );

        teamIndex += 2;
    });

    return byeSchedule;
}


// ===============================
// BUILD ONE WEEK'S MATCHUPS
// ===============================

function buildWeekMatchups(
    activeTeamNames,
    usedMatchups
) {

    const matchups = [];


    function backtrack(remainingTeams) {

        if (remainingTeams.length === 0) {
            return true;
        }

        const firstTeam =
            remainingTeams[0];

        const possibleOpponents =
            shuffleArray(
                remainingTeams.slice(1)
            );

        for (
            let i = 0;
            i < possibleOpponents.length;
            i++
        ) {

            const opponent =
                possibleOpponents[i];

            const matchupKey =
                getMatchupKey(
                    firstTeam,
                    opponent
                );

            if (usedMatchups.has(matchupKey)) {
                continue;
            }


            // Random home / away assignment

            let awayTeam;
            let homeTeam;

            if (Math.random() < 0.5) {

                awayTeam = firstTeam;
                homeTeam = opponent;

            } else {

                awayTeam = opponent;
                homeTeam = firstTeam;
            }


            usedMatchups.add(matchupKey);

            matchups.push({
                away: awayTeam,
                home: homeTeam
            });


            const nextTeams =
                remainingTeams.filter(
                    function(teamName) {

                        return (
                            teamName !== firstTeam &&
                            teamName !== opponent
                        );
                    }
                );


            if (backtrack(nextTeams)) {
                return true;
            }


            // Undo this matchup if it caused
            // a dead end.

            matchups.pop();

            usedMatchups.delete(
                matchupKey
            );
        }

        return false;
    }


    const shuffledActiveTeams =
        shuffleArray(activeTeamNames);

    const success =
        backtrack(shuffledActiveTeams);


    if (success) {
        return matchups;
    }

    return null;
}


// ===============================
// GENERATE FULL 18-WEEK SCHEDULE
// ===============================

function generateSeasonSchedule() {

    // Retry with a fresh random setup if
    // we ever hit a scheduling dead end.

    for (
        let attempt = 1;
        attempt <= 100;
        attempt++
    ) {

        const byeSchedule =
            createByeSchedule();

        const usedMatchups =
            new Set();

        const schedule = [];

        let scheduleWorked = true;


        for (
            let week = 1;
            week <= 18;
            week++
        ) {

            const byeTeams =
                byeSchedule[week];

            const activeTeams =
                seasonTeams
                    .map(function(team) {
                        return team.name;
                    })
                    .filter(function(teamName) {

                        return !byeTeams.includes(
                            teamName
                        );
                    });


            const games =
                buildWeekMatchups(
                    activeTeams,
                    usedMatchups
                );


            if (!games) {

                scheduleWorked = false;

                break;
            }


            schedule[week] = {
                week: week,
                byeTeams: byeTeams,
                games: games
            };
        }


        if (scheduleWorked) {

            console.log(
                "Schedule generated on attempt:",
                attempt
            );

            return schedule;
        }
    }


    console.error(
        "Unable to generate season schedule."
    );

    return [];
}


// ===============================
// VALIDATE SCHEDULE
// ===============================

function validateSeasonSchedule() {

    const teamData = {};

    seasonTeams.forEach(function(team) {

        teamData[team.name] = {
            games: 0,
            byes: 0,
            opponents: new Set()
        };
    });


    for (
        let week = 1;
        week <= 18;
        week++
    ) {

        const weekData =
            seasonSchedule[week];


        weekData.byeTeams.forEach(
            function(teamName) {

                teamData[teamName].byes++;
            }
        );


        weekData.games.forEach(
            function(game) {

                teamData[game.away].games++;

                teamData[game.home].games++;


                teamData[game.away]
                    .opponents
                    .add(game.home);

                teamData[game.home]
                    .opponents
                    .add(game.away);
            }
        );
    }


    const invalidTeams =
        Object.keys(teamData).filter(
            function(teamName) {

                const data =
                    teamData[teamName];

                return (
                    data.games !== 17 ||
                    data.byes !== 1 ||
                    data.opponents.size !== 17
                );
            }
        );


    console.log(
        "Schedule validation:",
        teamData
    );

    console.log(
        "Teams with schedule problems:",
        invalidTeams
    );
}


// ===============================
// FIND YOUR GAME
// ===============================

function getUserGameForWeek(weekNumber) {

    const weekData =
        seasonSchedule[weekNumber];

    if (!weekData) {
        return null;
    }


    const isBye =
        weekData.byeTeams.includes(
            "Your Team"
        );


    if (isBye) {

        return {
            isBye: true
        };
    }


    const game =
        weekData.games.find(
            function(game) {

                return (
                    game.away === "Your Team" ||
                    game.home === "Your Team"
                );
            }
        );


    if (!game) {
        return null;
    }


    return {
        isBye: false,
        away: game.away,
        home: game.home
    };
}


// ===============================
// DISPLAY UPCOMING MATCHUP
// ===============================

function displayUpcomingMatchup() {

    const weekResults =
        document.getElementById(
            "week-results"
        );

    const userGame =
        getUserGameForWeek(currentWeek);


    if (!userGame) {
        return;
    }


    if (userGame.isBye) {

        weekResults.innerHTML = `
            <h3>Week ${currentWeek}</h3>
            <p>Your Team has a BYE this week.</p>
        `;

        return;
    }


    weekResults.innerHTML = `
        <h3>Week ${currentWeek} Matchup</h3>

        <p>
            ${userGame.away}
            vs
            ${userGame.home}
        </p>
    `;
}


// ===============================
// START NEW SEASON
// ===============================

function startNewSeason() {

    currentWeek = 1;

    userSeasonStats = {};

    createSeasonTeams();

    seasonSchedule =
        generateSeasonSchedule();


    if (seasonSchedule.length === 0) {
        return;
    }


    validateSeasonSchedule();

    document.getElementById(
        "current-week-title"
    ).textContent = "Week 1";


    document.getElementById(
        "team-record-display"
    ).textContent = "Record: 0-0";


    displayUpcomingMatchup();
    displayStandings();
}


// ===============================
// GET TEAM OBJECT
// ===============================

function getSeasonTeam(teamName) {

    return seasonTeams.find(function(team) {
        return team.name === teamName;
    });
}


// ===============================
// RANDOM NUMBER
// ===============================

function randomBetween(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// ===============================
// SIMULATE CPU TEAM SCORE
// ===============================

function simulateTeamScore(team) {

    // Rating affects expected scoring,
    // but randomness still matters a lot.

    const ratingBoost =
        (team.rating - 80) * 0.45;

    let score =
        Math.round(
            20 +
            ratingBoost +
            randomBetween(-10, 10)
        );

    // Keep scores in a reasonable range.
    score = Math.max(6, score);

    return score;
}


// ===============================
// UPDATE TEAM RECORDS
// ===============================

function updateGameStandings(
    awayTeam,
    homeTeam,
    awayScore,
    homeScore
) {

    awayTeam.pointsFor += awayScore;
    awayTeam.pointsAgainst += homeScore;

    homeTeam.pointsFor += homeScore;
    homeTeam.pointsAgainst += awayScore;


    if (awayScore > homeScore) {

        awayTeam.wins++;
        homeTeam.losses++;

    } else {

        homeTeam.wins++;
        awayTeam.losses++;
    }
}


// ===============================
// SIMULATE ONE GAME
// ===============================

function simulateGame(game) {

    const awayTeam =
        getSeasonTeam(game.away);

    const homeTeam =
        getSeasonTeam(game.home);


    let awayScore =
        simulateTeamScore(awayTeam);

    let homeScore =
        simulateTeamScore(homeTeam);


    // Small home-field advantage.
    homeScore += 2;


    // No ties.
    if (awayScore === homeScore) {

        if (Math.random() < 0.5) {
            awayScore += 3;
        } else {
            homeScore += 3;
        }
    }


    updateGameStandings(
        awayTeam,
        homeTeam,
        awayScore,
        homeScore
    );


    return {
        away: game.away,
        home: game.home,
        awayScore: awayScore,
        homeScore: homeScore
    };
}


// ===============================
// DISPLAY LEAGUE STANDINGS
// ===============================

function displayStandings() {

    const standingsDisplay =
        document.getElementById(
            "standings-display"
        );


    const sortedTeams =
        [...seasonTeams].sort(
            function(teamA, teamB) {

                if (teamB.wins !== teamA.wins) {
                    return teamB.wins - teamA.wins;
                }

                const differentialA =
                    teamA.pointsFor -
                    teamA.pointsAgainst;

                const differentialB =
                    teamB.pointsFor -
                    teamB.pointsAgainst;

                return (
                    differentialB -
                    differentialA
                );
            }
        );


    let standingsHTML = `
        <table>

            <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>W</th>
                <th>L</th>
                <th>PF</th>
                <th>PA</th>
                <th>Diff</th>
            </tr>
    `;


    sortedTeams.forEach(
        function(team, index) {

            const differential =
                team.pointsFor -
                team.pointsAgainst;

            standingsHTML += `
                <tr class="${team.name === "Your Team" ? "user-team-row" : ""}">
                    <td>${index + 1}</td>

                    <td>${team.name}</td>

                    <td>${team.wins}</td>

                    <td>${team.losses}</td>

                    <td>${team.pointsFor}</td>

                    <td>${team.pointsAgainst}</td>

                    <td>
                        ${
                            differential > 0
                                ? "+"
                                : ""
                        }${differential}
                    </td>
                </tr>
            `;
        }
    );


    standingsHTML += `</table>`;

    standingsDisplay.innerHTML =
        standingsHTML;
}


// ===============================
// CHOOSE RECEIVER
// ===============================

function chooseReceiverSlot(receiverSlots) {

    let totalWeight = 0;

    receiverSlots.forEach(function(rosterSpot) {

        const player = roster[rosterSpot];

        let multiplier = 1;

        if (player.position === "WR") {
            multiplier = 1.3;
        }

        else if (player.position === "TE") {
            multiplier = 1.0;
        }

        else if (player.position === "RB") {
            multiplier = 0.75;
        }

        totalWeight +=
            player.rating * multiplier;
    });


    let randomValue =
        Math.random() * totalWeight;


    for (const rosterSpot of receiverSlots) {

        const player = roster[rosterSpot];

        let multiplier = 1;

        if (player.position === "WR") {
            multiplier = 1.3;
        }

        else if (player.position === "RB") {
            multiplier = 0.75;
        }

        randomValue -=
            player.rating * multiplier;

        if (randomValue <= 0) {
            return rosterSpot;
        }
    }


    return receiverSlots[0];
}


// ===============================
// SIMULATE YOUR WEEKLY PLAYER STATS
// ===============================

function simulateUserWeeklyStats() {

    const weeklyStats = {};


    // -------------------------------
    // CREATE BASE STATS
    // -------------------------------

    Object.keys(roster).forEach(function(rosterSpot) {

        const player = roster[rosterSpot];

        if (player.position === "QB") {

            const attempts =
                randomBetween(28, 40);

            let completionPercentage =
                0.60 +
                ((player.rating - 75) * 0.0035) +
                ((Math.random() - 0.5) * 0.06);

            completionPercentage =
                Math.max(
                    0.54,
                    Math.min(0.76, completionPercentage)
                );

            const completions =
                Math.round(
                    attempts * completionPercentage
                );

            const yardsPerCompletion =
                10 +
                Math.random() * 3 +
                ((player.rating - 85) * 0.04);

            const passingYards =
                Math.round(
                    completions * yardsPerCompletion
                );


            let passingTDs =
                randomBetween(0, 2);

            if (
                player.rating >= 90 &&
                Math.random() < 0.5
            ) {
                passingTDs++;
            }

            if (
                player.rating >= 96 &&
                Math.random() < 0.25
            ) {
                passingTDs++;
            }


            let interceptions = 0;

            const interceptionChance =
                Math.max(
                    0.12,
                    0.35 -
                    ((player.rating - 75) * 0.008)
                );

            if (
                Math.random() <
                interceptionChance
            ) {
                interceptions++;
            }

            if (Math.random() < 0.07) {
                interceptions++;
            }


            weeklyStats[rosterSpot] = {
                position: "QB",

                completions: completions,
                attempts: attempts,

                passingYards: passingYards,
                passingTDs: passingTDs,
                interceptions: interceptions,

                rushingYards:
                    randomBetween(0, 35),

                rushingTDs:
                    Math.random() < 0.10 ? 1 : 0
            };
        }


        else if (player.position === "RB") {

            let carries;

            if (rosterSpot === "RB1") {
                carries = randomBetween(13, 22);
            }

            else if (rosterSpot === "RB2") {
                carries = randomBetween(8, 16);
            }

            else {
                carries = randomBetween(5, 12);
            }


            let yardsPerCarry =
                3.4 +
                ((player.rating - 75) * 0.045) +
                ((Math.random() - 0.5) * 1.2);

            yardsPerCarry =
                Math.max(
                    2.8,
                    Math.min(6.5, yardsPerCarry)
                );


            let rushingTDs = 0;

            const touchdownChance =
                0.20 +
                ((player.rating - 75) * 0.01);

            if (
                Math.random() <
                touchdownChance
            ) {
                rushingTDs++;
            }

            if (
                player.rating >= 94 &&
                Math.random() < 0.12
            ) {
                rushingTDs++;
            }


            weeklyStats[rosterSpot] = {
                position: "RB",

                carries: carries,

                rushingYards:
                    Math.round(
                        carries * yardsPerCarry
                    ),

                rushingTDs: rushingTDs,

                targets: 0,
                receptions: 0,
                receivingYards: 0,
                receivingTDs: 0
            };
        }


        else if (
            player.position === "WR" ||
            player.position === "TE"
        ) {

            weeklyStats[rosterSpot] = {
                position: player.position,

                targets: 0,
                receptions: 0,
                receivingYards: 0,
                receivingTDs: 0
            };
        }


        else if (player.position === "DEF") {

            const ratingBoost =
                Math.max(
                    0,
                    Math.floor(
                        (player.rating - 80) / 8
                    )
                );

            weeklyStats[rosterSpot] = {
                position: "DEF",

                sacks:
                    randomBetween(1, 4) +
                    ratingBoost,

                interceptions:
                    randomBetween(0, 2),

                fumbleRecoveries:
                    randomBetween(0, 2)
            };
        }


        else if (player.position === "K") {

            weeklyStats[rosterSpot] = {
                position: "K",

                fieldGoalsMade:
                    randomBetween(0, 3),

                extraPointsMade: 0
            };
        }
    });


    // -------------------------------
    // SYNCHRONIZE QB + RECEIVERS
    // -------------------------------

    const qbSpot =
        Object.keys(roster).find(
            function(rosterSpot) {

                return (
                    roster[rosterSpot].position
                    === "QB"
                );
            }
        );


    const receiverSlots =
        Object.keys(roster).filter(
            function(rosterSpot) {

                const position =
                    roster[rosterSpot].position;

                return (
                    position === "RB" ||
                    position === "WR" ||
                    position === "TE"
                );
            }
        );


    const qbStats =
        weeklyStats[qbSpot];


    // Distribute completions.

    for (
        let i = 0;
        i < qbStats.completions;
        i++
    ) {

        const receiverSpot =
            chooseReceiverSlot(
                receiverSlots
            );

        weeklyStats[receiverSpot]
            .receptions++;

        weeklyStats[receiverSpot]
            .targets++;
    }


    // Distribute incompletions.

    const incompletions =
        qbStats.attempts -
        qbStats.completions;


    for (
        let i = 0;
        i < incompletions;
        i++
    ) {

        const receiverSpot =
            chooseReceiverSlot(
                receiverSlots
            );

        weeklyStats[receiverSpot]
            .targets++;
    }


    // Distribute passing yards.

    const catchers =
        receiverSlots.filter(
            function(rosterSpot) {

                return (
                    weeklyStats[rosterSpot]
                        .receptions > 0
                );
            }
        );


    const yardWeights = {};

    let totalYardWeight = 0;


    catchers.forEach(function(rosterSpot) {

        const player =
            roster[rosterSpot];

        let yardMultiplier = 10;

        if (player.position === "WR") {
            yardMultiplier = 13;
        }

        else if (player.position === "TE") {
            yardMultiplier = 10;
        }

        else if (player.position === "RB") {
            yardMultiplier = 7;
        }


        yardWeights[rosterSpot] =
            weeklyStats[rosterSpot]
                .receptions *
            yardMultiplier *
            (0.85 + Math.random() * 0.30);


        totalYardWeight +=
            yardWeights[rosterSpot];
    });


    let yardsAssigned = 0;


    catchers.forEach(
        function(rosterSpot, index) {

            let receivingYards;


            if (
                index ===
                catchers.length - 1
            ) {

                receivingYards =
                    qbStats.passingYards -
                    yardsAssigned;

            } else {

                receivingYards =
                    Math.floor(
                        qbStats.passingYards *
                        (
                            yardWeights[rosterSpot] /
                            totalYardWeight
                        )
                    );

                yardsAssigned +=
                    receivingYards;
            }


            weeklyStats[rosterSpot]
                .receivingYards =
                    receivingYards;
        }
    );


    // Distribute passing touchdowns.

    for (
        let i = 0;
        i < qbStats.passingTDs;
        i++
    ) {

        const possibleScorers =
            catchers.length > 0
                ? catchers
                : receiverSlots;


        const receiverSpot =
            possibleScorers[
                Math.floor(
                    Math.random() *
                    possibleScorers.length
                )
            ];


        weeklyStats[receiverSpot]
            .receivingTDs++;
    }


    // -------------------------------
    // KICKER EXTRA POINTS
    // -------------------------------

    let offensiveTouchdowns =
        qbStats.passingTDs +
        qbStats.rushingTDs;


    Object.keys(roster).forEach(
        function(rosterSpot) {

            if (
                roster[rosterSpot].position
                === "RB"
            ) {

                offensiveTouchdowns +=
                    weeklyStats[rosterSpot]
                        .rushingTDs;
            }
        }
    );


    const kickerSpot =
        Object.keys(roster).find(
            function(rosterSpot) {

                return (
                    roster[rosterSpot].position
                    === "K"
                );
            }
        );


    const kicker =
        roster[kickerSpot];


    let extraPointsMade = 0;


    for (
        let i = 0;
        i < offensiveTouchdowns;
        i++
    ) {

        const extraPointChance =
            Math.min(
                0.99,
                0.94 +
                ((kicker.rating - 75) * 0.002)
            );


        if (
            Math.random() <
            extraPointChance
        ) {
            extraPointsMade++;
        }
    }


    weeklyStats[kickerSpot]
        .extraPointsMade =
            extraPointsMade;


    return weeklyStats;
}


// ===============================
// CALCULATE YOUR TEAM SCORE
// ===============================

function calculateUserScore(weeklyStats) {

    let touchdowns = 0;
    let fieldGoals = 0;
    let extraPoints = 0;


    Object.keys(weeklyStats).forEach(
        function(rosterSpot) {

            const stats =
                weeklyStats[rosterSpot];


            if (stats.position === "QB") {

                touchdowns +=
                    stats.passingTDs;

                touchdowns +=
                    stats.rushingTDs;
            }


            else if (
                stats.position === "RB"
            ) {

                touchdowns +=
                    stats.rushingTDs;
            }


            else if (
                stats.position === "K"
            ) {

                fieldGoals +=
                    stats.fieldGoalsMade;

                extraPoints +=
                    stats.extraPointsMade;
            }
        }
    );


    return (
        touchdowns * 6 +
        fieldGoals * 3 +
        extraPoints
    );
}


// ===============================
// ADD WEEK TO SEASON TOTALS
// ===============================

function addWeeklyStatsToSeason(
    weeklyStats
) {

    Object.keys(weeklyStats).forEach(
        function(rosterSpot) {

            const player =
                roster[rosterSpot];

            const stats =
                weeklyStats[rosterSpot];


            if (!userSeasonStats[rosterSpot]) {

                userSeasonStats[rosterSpot] = {
                    name: player.name,
                    position: player.position,
                    rating: player.rating,
                    gamesPlayed: 0
                };
            }


            const seasonStats =
                userSeasonStats[rosterSpot];


            seasonStats.gamesPlayed++;


            Object.keys(stats).forEach(
                function(statName) {

                    const value =
                        stats[statName];

                    if (
                        typeof value === "number"
                    ) {

                        if (
                            !seasonStats[statName]
                        ) {
                            seasonStats[statName] = 0;
                        }

                        seasonStats[statName] +=
                            value;
                    }
                }
            );
        }
    );
}


// ===============================
// WEEKLY PLAYER STATS HTML
// ===============================

function getWeeklyPlayerStatsHTML(
    weeklyStats
) {

    let html = `
    <h3 class="weekly-stats-title">
        Your Player Stats
    </h3>

    <div class="weekly-stats-grid">
`;


    Object.keys(roster).forEach(
        function(rosterSpot) {

            const player =
                roster[rosterSpot];

            const stats =
                weeklyStats[rosterSpot];


            html += `
    <div class="weekly-stat-card">

        <div class="weekly-player-header">

            <span class="weekly-player-position">
                ${rosterSpot}
            </span>

            <span class="weekly-player-name">
                ${player.name}
            </span>

        </div>
`;


            if (stats.position === "QB") {

                html += `
                    <p>
                        ${stats.completions}/${stats.attempts},
                        ${stats.passingYards} pass yds,
                        ${stats.passingTDs} pass TD,
                        ${stats.interceptions} INT,
                        ${stats.rushingYards} rush yds,
                        ${stats.rushingTDs} rush TD
                    </p>
                `;
            }


            else if (stats.position === "RB") {

                html += `
                    <p>
                        ${stats.carries} carries,
                        ${stats.rushingYards} rush yds,
                        ${stats.rushingTDs} rush TD
                        <br>
                        ${stats.receptions} receptions,
                        ${stats.receivingYards} rec yds,
                        ${stats.receivingTDs} rec TD,
                        ${stats.targets} targets
                    </p>
                `;
            }


            else if (
                stats.position === "WR" ||
                stats.position === "TE"
            ) {

                html += `
                    <p>
                        ${stats.receptions} receptions,
                        ${stats.receivingYards} rec yds,
                        ${stats.receivingTDs} rec TD,
                        ${stats.targets} targets
                    </p>
                `;
            }


            else if (stats.position === "K") {

                html += `
                    <p>
                        ${stats.fieldGoalsMade} FG made,
                        ${stats.extraPointsMade} XP made
                    </p>
                `;
            }


            else if (stats.position === "DEF") {

                html += `
                    <p>
                        ${stats.sacks} sacks,
                        ${stats.interceptions} INT,
                        ${stats.fumbleRecoveries}
                        fumble recoveries
                    </p>
                `;
            }


            html += `</div>`;
        }
    );


    html += `
    </div>
`;


    return html;
}


// ===============================
// ROSTER SPOT LABEL
// ===============================

function getRosterSpotLabel(rosterSpot) {

    const labels = {
        QB: "QB",
        RB1: "RB 1",
        RB2: "RB 2",
        WR1: "WR 1",
        WR2: "WR 2",
        TE: "TE",
        FLEX: "FLEX",
        DEF: "Defense",
        K: "Kicker"
    };

    return labels[rosterSpot] || rosterSpot;
}


// ===============================
// GET FINAL SEED
// ===============================

function getFinalSeed() {

    const sortedTeams =
        [...seasonTeams].sort(
            function(teamA, teamB) {

                if (teamB.wins !== teamA.wins) {
                    return teamB.wins - teamA.wins;
                }

                const differentialA =
                    teamA.pointsFor -
                    teamA.pointsAgainst;

                const differentialB =
                    teamB.pointsFor -
                    teamB.pointsAgainst;

                return (
                    differentialB -
                    differentialA
                );
            }
        );

    const userIndex =
        sortedTeams.findIndex(
            function(team) {
                return team.name === "Your Team";
            }
        );

    return userIndex + 1;
}


// ===============================
// DISPLAY FINAL SEASON STATS
// ===============================

function displayFinalSeasonStats() {

    const statsDisplay =
        document.getElementById(
            "season-stats-display"
        );

    let statsHTML = `
    <div class="season-stats-grid">
`;


    Object.keys(roster).forEach(
        function(rosterSpot) {

            const player =
                roster[rosterSpot];

            const stats =
                userSeasonStats[rosterSpot];

            if (!stats) {
                return;
            }


            statsHTML += `
    <div class="season-stat-card">

        <div class="season-player-header">

            <span class="season-player-position">
                ${getRosterSpotLabel(rosterSpot)}
            </span>

            <span class="season-player-name">
                ${player.name}
            </span>

        </div>

        <div class="season-games-played">
            ${stats.gamesPlayed} GAMES
        </div>
`;


            if (stats.position === "QB") {

                statsHTML += `
                    <p>
                        ${stats.completions || 0}/
                        ${stats.attempts || 0} passing,
                        ${stats.passingYards || 0} pass yds,
                        ${stats.passingTDs || 0} pass TD,
                        ${stats.interceptions || 0} INT
                        <br>
                        ${stats.rushingYards || 0} rush yds,
                        ${stats.rushingTDs || 0} rush TD
                    </p>
                `;
            }


            else if (stats.position === "RB") {

                statsHTML += `
                    <p>
                        ${stats.carries || 0} carries,
                        ${stats.rushingYards || 0} rush yds,
                        ${stats.rushingTDs || 0} rush TD
                        <br>
                        ${stats.receptions || 0} receptions,
                        ${stats.receivingYards || 0} rec yds,
                        ${stats.receivingTDs || 0} rec TD,
                        ${stats.targets || 0} targets
                    </p>
                `;
            }


            else if (
                stats.position === "WR" ||
                stats.position === "TE"
            ) {

                statsHTML += `
                    <p>
                        ${stats.receptions || 0} receptions,
                        ${stats.receivingYards || 0} rec yds,
                        ${stats.receivingTDs || 0} rec TD,
                        ${stats.targets || 0} targets
                    </p>
                `;
            }


            else if (stats.position === "K") {

                statsHTML += `
                    <p>
                        ${stats.fieldGoalsMade || 0} FG made,
                        ${stats.extraPointsMade || 0} XP made
                    </p>
                `;
            }


            else if (stats.position === "DEF") {

                statsHTML += `
                    <p>
                        ${stats.sacks || 0} sacks,
                        ${stats.interceptions || 0} INT,
                        ${stats.fumbleRecoveries || 0}
                        fumble recoveries
                    </p>
                `;
            }


            statsHTML += `</div>`;
        }
    );


    statsHTML += `
    </div>
`;


    statsDisplay.innerHTML =
        statsHTML;
}


// ===============================
// DISPLAY FINAL SEASON SUMMARY
// ===============================

function displayFinalSeasonSummary() {

    const yourTeam =
        getSeasonTeam("Your Team");

    const finalSeed =
        getFinalSeed();


    


    document.getElementById(
    "final-season-summary"
).innerHTML = `

    <div class="season-recap-intro">
        <div class="season-recap-label">
            17-GAME REGULAR SEASON
        </div>

        <p>
            Your regular season is complete.
            Here's how your team finished.
        </p>
    </div>


    <div class="season-recap-metrics">

        <div class="recap-metric-card">

            <span class="recap-metric-label">
                FINAL RECORD
            </span>

            <strong>
                ${yourTeam.wins}-${yourTeam.losses}
            </strong>

        </div>


        <div class="recap-metric-card">

            <span class="recap-metric-label">
                FINAL SEED
            </span>

            <strong>
                #${finalSeed}
            </strong>

        </div>


        <div class="recap-metric-card">

            <span class="recap-metric-label">
                TEAM RATING
            </span>

            <strong>
                ${userTeamRating}
            </strong>

        </div>

    </div>
`;


    displayFinalSeasonStats();
}


// ===============================
// USER WIN CHANCE
// ===============================

function calculateUserWinChance(
    opponent,
    game
) {

    // Start slightly above 50/50.
    let winChance = 0.52;

    // Every rating point matters.
    const ratingDifference =
        userTeamRating -
        opponent.rating;

    winChance +=
        ratingDifference * 0.025;


    // Small home-field advantage.
    if (game.home === "Your Team") {

        winChance += 0.03;

    } else {

        winChance -= 0.03;
    }


    // Even the best team can lose.
    // Even a bad team can pull an upset.
    winChance =
        Math.max(
            0.18,
            Math.min(0.88, winChance)
        );


    return winChance;
}


function simulateCurrentWeek() {

    if (currentWeek > 18) {
        return;
    }


    const weekData =
        seasonSchedule[currentWeek];

    const weekResults =
        document.getElementById(
            "week-results"
        );


    let resultsHTML = `
        <h3>Week ${currentWeek} Results</h3>
    `;


    let userResult = null;


    weekData.games.forEach(function(game) {

        const isUserGame =
            game.away === "Your Team" ||
            game.home === "Your Team";


        if (isUserGame) {

            const weeklyStats =
                simulateUserWeeklyStats();


            let userScore =
                calculateUserScore(
                    weeklyStats
                );


            const opponentName =
                game.away === "Your Team"
                    ? game.home
                    : game.away;


            const opponent =
                getSeasonTeam(
                    opponentName
                );


            const userWinChance =
    calculateUserWinChance(
        opponent,
        game
    );


    let userWins =
    Math.random() <
    userWinChance;


// If your offense completely collapses,
// don't force an impossible win.
if (userScore <= 6) {
    userWins = false;
}


let opponentScore =
    simulateTeamScore(
        opponent
    );


// If the rating-based result says
// Your Team won, make the opponent
// finish below your stat-generated score.

if (
    userWins &&
    opponentScore >= userScore
) {

    opponentScore =
        Math.max(
            6,
            userScore -
            randomBetween(1, 10)
        );
}


// If the rating-based result says
// Your Team lost, make the opponent
// finish above your score.

else if (
    !userWins &&
    opponentScore <= userScore
) {

    opponentScore =
        userScore +
        randomBetween(1, 10);
}



            const awayScore =
                game.away === "Your Team"
                    ? userScore
                    : opponentScore;


            const homeScore =
                game.home === "Your Team"
                    ? userScore
                    : opponentScore;


            updateGameStandings(
                getSeasonTeam(game.away),
                getSeasonTeam(game.home),
                awayScore,
                homeScore
            );


            addWeeklyStatsToSeason(
                weeklyStats
            );


            userResult = {
                away: game.away,
                home: game.home,

                awayScore: awayScore,
                homeScore: homeScore,

                weeklyStats: weeklyStats
            };

        } else {

            simulateGame(game);
        }
    });


    // ===============================
    // YOUR WEEK
    // ===============================

    if (
        weekData.byeTeams.includes(
            "Your Team"
        )
    ) {

        resultsHTML += `
            <h3>Your Team — BYE</h3>
        `;

    } else if (userResult) {


        const userIsAway =
    userResult.away === "Your Team";

const userScore =
    userIsAway
        ? userResult.awayScore
        : userResult.homeScore;

const opponentScore =
    userIsAway
        ? userResult.homeScore
        : userResult.awayScore;

const opponentName =
    userIsAway
        ? userResult.home
        : userResult.away;

const userWon =
    userScore > opponentScore;

const resultText =
    userWon ? "WIN" : "LOSS";

const resultClass =
    userWon ? "win" : "loss";

        resultsHTML += `
    <div class="game-scoreboard ${resultClass}">

        <div class="scoreboard-header">

            <span class="final-label">
                FINAL
            </span>

            <span class="game-result-badge ${resultClass}">
                ${resultText}
            </span>

        </div>


        <div class="scoreboard-teams">

            <div class="score-team">

                <div class="score-team-label">
                    OPPONENT
                </div>

                <h3>
                    ${opponentName}
                </h3>

                <div class="score-number">
                    ${opponentScore}
                </div>

            </div>


            <div class="score-divider">
                -
            </div>


            <div class="score-team user-score-team">

                <div class="score-team-label">
                    YOUR TEAM
                </div>

                <h3>
                    Your Team
                </h3>

                <div class="score-number">
                    ${userScore}
                </div>

            </div>

        </div>

    </div>
`;


        resultsHTML +=
            getWeeklyPlayerStatsHTML(
                userResult.weeklyStats
            );
    }


    weekResults.innerHTML =
        resultsHTML;


    const yourTeam =
        getSeasonTeam("Your Team");


    document.getElementById(
        "team-record-display"
    ).textContent =
        `Record: ${yourTeam.wins}-${yourTeam.losses}`;


    displayStandings();


    currentWeek++;


    if (currentWeek <= 18) {

        document.getElementById(
            "current-week-title"
        ).textContent =
            `Week ${currentWeek}`;

    } else {

        document.getElementById(
            "current-week-title"
        ).textContent =
            "Regular Season Complete";


        document.getElementById(
            "simulate-week-button"
        ).disabled = true;
        document.getElementById(
    "end-season-controls"
).style.display = "block";
    }
}


// ===============================
// SIMULATE WEEK BUTTON
// ===============================

document.getElementById(
    "simulate-week-button"
).addEventListener(
    "click",
    simulateCurrentWeek
);


// ===============================
// PLAYOFF STATE
// ===============================

let playoffTeams = [];

let currentPlayoffRound = 0;

let currentPlayoffMatchups = [];

let savedRoundOneMatchups = [];
let savedRoundOneResults = [];

let savedQuarterfinalMatchups = [];
let savedQuarterfinalResults = [];

let savedSemifinalMatchups = [];
let savedSemifinalResults = [];

let savedChampionshipResult = null;

let playoffChampion = null;


// ===============================
// GET FINAL LEAGUE RANKINGS
// ===============================

function getFinalLeagueRankings() {

    return [...seasonTeams].sort(
        function(teamA, teamB) {

            // First tiebreaker: wins
            if (teamB.wins !== teamA.wins) {
                return teamB.wins - teamA.wins;
            }


            // Second tiebreaker:
            // point differential
            const differentialA =
                teamA.pointsFor -
                teamA.pointsAgainst;

            const differentialB =
                teamB.pointsFor -
                teamB.pointsAgainst;


            if (
                differentialB !==
                differentialA
            ) {

                return (
                    differentialB -
                    differentialA
                );
            }


            // Third tiebreaker:
            // points scored
            return (
                teamB.pointsFor -
                teamA.pointsFor
            );
        }
    );
}


// ===============================
// CREATE PLAYOFF FIELD
// ===============================

function initializePlayoffs() {

    const finalRankings =
        getFinalLeagueRankings();


    // Top 14 teams make playoffs
    playoffTeams =
        finalRankings
            .slice(0, 14)
            .map(
                function(team, index) {

                    return {
                        seed: index + 1,

                        name: team.name,

                        rating: team.rating,

                        wins: team.wins,

                        losses: team.losses
                    };
                }
            );


    currentPlayoffRound = 1;

    playoffChampion = null;


    createRoundOneMatchups();

    displayRoundOneBracket();


    document.getElementById(
        "simulate-playoff-button"
    ).textContent =
        "Simulate Round 1";
}


// ===============================
// CREATE ROUND 1 MATCHUPS
// ===============================

function createRoundOneMatchups() {

    currentPlayoffMatchups = [];


    // Seeds 1 and 2 receive byes.
    //
    // Round 1:
    //
    // 3 vs 14
    // 4 vs 13
    // 5 vs 12
    // 6 vs 11
    // 7 vs 10
    // 8 vs 9

    for (
        let highSeed = 3;
        highSeed <= 8;
        highSeed++
    ) {

        const lowSeed =
            17 - highSeed;


        const highTeam =
            playoffTeams.find(
                function(team) {

                    return (
                        team.seed ===
                        highSeed
                    );
                }
            );


        const lowTeam =
            playoffTeams.find(
                function(team) {

                    return (
                        team.seed ===
                        lowSeed
                    );
                }
            );


        currentPlayoffMatchups.push({
            teamA: highTeam,
            teamB: lowTeam
        });
    }
}


// ===============================
// DISPLAY ROUND 1 BRACKET
// ===============================

function displayRoundOneBracket() {

    const playoffBracket =
        document.getElementById(
            "playoff-bracket"
        );


    const userPlayoffTeam =
        playoffTeams.find(
            function(team) {
                return (
                    team.name ===
                    "Your Team"
                );
            }
        );


    const seedOne =
        playoffTeams.find(
            function(team) {
                return team.seed === 1;
            }
        );


    const seedTwo =
        playoffTeams.find(
            function(team) {
                return team.seed === 2;
            }
        );


    const userMatchup =
        currentPlayoffMatchups.find(
            function(matchup) {

                return (
                    matchup.teamA.name ===
                    "Your Team" ||

                    matchup.teamB.name ===
                    "Your Team"
                );
            }
        );


    let bracketHTML = "";


    // ===============================
    // PLAYOFF SUMMARY
    // ===============================

    if (userPlayoffTeam) {

        bracketHTML += `
            <div class="playoff-summary-card">

                <div>
                    <span class="playoff-summary-label">
                        YOUR TEAM
                    </span>

                    <strong>
                        #${userPlayoffTeam.seed} Seed
                    </strong>
                </div>


                <div>
                    <span class="playoff-summary-label">
                        REGULAR SEASON
                    </span>

                    <strong>
                        ${userPlayoffTeam.wins}-${userPlayoffTeam.losses}
                    </strong>
                </div>

            </div>
        `;

    } else {

        bracketHTML += `
            <div class="playoff-summary-card missed-playoffs">

                <div>
                    <span class="playoff-summary-label">
                        YOUR TEAM
                    </span>

                    <strong>
                        Missed Playoffs
                    </strong>
                </div>


                <p>
                    The postseason can still be
                    simulated to determine the champion.
                </p>

            </div>
        `;
    }


    // ===============================
    // BRACKET
    // ===============================

    bracketHTML += `
        <div class="playoff-bracket-shell">

            <div class="playoff-bracket-heading">
                NFL PLAYOFF BRACKET
            </div>

            <div class="playoff-bracket-grid">


                <!-- ROUND 1 -->

                <div class="bracket-round">

                    <div class="bracket-round-title">
                        ROUND 1
                    </div>


                    <div class="
                        bracket-bye-card
                        ${
                            seedOne.name ===
                            "Your Team"
                                ? "user-bracket-card"
                                : ""
                        }
                    ">

                        <div class="bracket-team-info">

                            <span class="bracket-seed">
                                #1
                            </span>

                            <strong>
                                ${seedOne.name}
                            </strong>

                        </div>

                        <span class="bye-label">
                            BYE
                        </span>

                    </div>


                    <div class="
                        bracket-bye-card
                        ${
                            seedTwo.name ===
                            "Your Team"
                                ? "user-bracket-card"
                                : ""
                        }
                    ">

                        <div class="bracket-team-info">

                            <span class="bracket-seed">
                                #2
                            </span>

                            <strong>
                                ${seedTwo.name}
                            </strong>

                        </div>

                        <span class="bye-label">
                            BYE
                        </span>

                    </div>
    `;


    currentPlayoffMatchups.forEach(
        function(matchup) {

            const userInMatchup =
                matchup.teamA.name ===
                "Your Team" ||

                matchup.teamB.name ===
                "Your Team";


            bracketHTML += `
                <div class="
                    bracket-matchup-card
                    ${
                        userInMatchup
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="
                        bracket-team-row
                        ${
                            matchup.teamA.name ===
                            "Your Team"
                                ? "user-bracket-team"
                                : ""
                        }
                    ">

                        <span class="bracket-seed">
                            #${matchup.teamA.seed}
                        </span>

                        <strong>
                            ${matchup.teamA.name}
                        </strong>

                    </div>


                    <div class="bracket-vs">
                        VS
                    </div>


                    <div class="
                        bracket-team-row
                        ${
                            matchup.teamB.name ===
                            "Your Team"
                                ? "user-bracket-team"
                                : ""
                        }
                    ">

                        <span class="bracket-seed">
                            #${matchup.teamB.seed}
                        </span>

                        <strong>
                            ${matchup.teamB.name}
                        </strong>

                    </div>

                </div>
            `;
        }
    );


    bracketHTML += `

                </div>


                <!-- QUARTERFINALS -->

                <div class="bracket-round quarterfinal-round">

                    <div class="bracket-round-title">
                        QUARTERFINALS
                    </div>

                    <div class="future-bracket-slot">
                        TBD
                    </div>

                    <div class="future-bracket-slot">
                        TBD
                    </div>

                    <div class="future-bracket-slot">
                        TBD
                    </div>

                    <div class="future-bracket-slot">
                        TBD
                    </div>

                </div>


                <!-- SEMIFINALS -->

                <div class="bracket-round semifinal-round">

                    <div class="bracket-round-title">
                        SEMIFINALS
                    </div>

                    <div class="future-bracket-slot">
                        TBD
                    </div>

                    <div class="future-bracket-slot">
                        TBD
                    </div>

                </div>


                <!-- CHAMPIONSHIP -->

                <div class="bracket-round championship-round">

                    <div class="bracket-round-title">
                        CHAMPIONSHIP
                    </div>

                    <div class="future-bracket-slot championship-slot">
                        TBD
                    </div>

                </div>


            </div>

        </div>
    `;


    // ===============================
    // YOUR NEXT GAME
    // ===============================

    if (userPlayoffTeam) {

        if (
            userPlayoffTeam.seed === 1 ||
            userPlayoffTeam.seed === 2
        ) {

            bracketHTML += `
                <div class="next-playoff-game">

                    <div class="next-playoff-label">
                        YOUR NEXT GAME
                    </div>

                    <h2>
                        First-Round Bye
                    </h2>

                    <p>
                        Your team automatically
                        advances to the quarterfinals.
                    </p>

                </div>
            `;

        } else if (userMatchup) {

            const opponent =
                userMatchup.teamA.name ===
                "Your Team"

                    ? userMatchup.teamB

                    : userMatchup.teamA;


            bracketHTML += `
                <div class="next-playoff-game">

                    <div class="next-playoff-label">
                        YOUR NEXT GAME
                    </div>


                    <div class="next-game-matchup">

                        <div class="next-game-team your-next-team">

                            <span>
                                #${userPlayoffTeam.seed}
                            </span>

                            <strong>
                                YOUR TEAM
                            </strong>

                        </div>


                        <div class="next-game-vs">
                            VS
                        </div>


                        <div class="next-game-team">

                            <span>
                                #${opponent.seed}
                            </span>

                            <strong>
                                ${opponent.name}
                            </strong>

                        </div>

                    </div>

                </div>
            `;
        }
    }


    playoffBracket.innerHTML =
        bracketHTML;


    document.getElementById(
        "playoff-results"
    ).innerHTML = "";
}


// ===============================
// CONTINUE TO PLAYOFFS BUTTON
// ===============================

document.getElementById(
    "continue-playoffs-button"
).addEventListener(
    "click",
    function() {

        // Hide regular season
        document.getElementById(
            "season-section"
        ).style.display = "none";


        // Show clean season recap screen
        document.getElementById(
            "season-recap-section"
        ).style.display = "block";


        // Move back to top of page
        window.scrollTo(0, 0);


        // Fill recap with record,
        // seed, and season stats
        displayFinalSeasonSummary();
    }
);


// ===============================
// ENTER PLAYOFFS FROM SEASON RECAP
// ===============================

document.getElementById(
    "enter-playoffs-button"
).addEventListener(
    "click",
    function() {

        // Hide season recap
        document.getElementById(
            "season-recap-section"
        ).style.display = "none";


        // Show clean playoff screen
        document.getElementById(
            "playoffs-section"
        ).style.display = "block";


        // Return to top
        window.scrollTo(0, 0);


        // Create playoff field
        initializePlayoffs();
    }
);


// ===============================
// SIMULATE CPU PLAYOFF GAME
// ===============================

function simulateCPUPlayoffGame(matchup) {

    const teamA = matchup.teamA;
    const teamB = matchup.teamB;

    let teamAScore =
        simulateTeamScore(teamA);

    let teamBScore =
        simulateTeamScore(teamB);


    // Higher seed is the home team.
    teamAScore += 2;


    // No playoff ties.
    if (teamAScore === teamBScore) {

        if (Math.random() < 0.5) {
            teamAScore += 3;
        } else {
            teamBScore += 3;
        }
    }


    const winner =
        teamAScore > teamBScore
            ? teamA
            : teamB;


    return {
        teamA: teamA,
        teamB: teamB,

        teamAScore: teamAScore,
        teamBScore: teamBScore,

        winner: winner
    };
}


// ===============================
// SIMULATE YOUR PLAYOFF GAME
// ===============================

function simulateUserPlayoffGame(matchup) {

    const userIsTeamA =
        matchup.teamA.name === "Your Team";

    const userTeam =
        userIsTeamA
            ? matchup.teamA
            : matchup.teamB;

    const opponent =
        userIsTeamA
            ? matchup.teamB
            : matchup.teamA;


    // Generate your drafted players'
    // stats for this playoff game.
    const weeklyStats =
        simulateUserWeeklyStats();


    let userScore =
        calculateUserScore(
            weeklyStats
        );


    let opponentScore =
        simulateTeamScore(
            opponent
        );


    // The higher seed is teamA
    // and receives home-field advantage.
    const playoffGame = {
        home: matchup.teamA.name
    };


    const userWinChance =
        calculateUserWinChance(
            opponent,
            playoffGame
        );


    let userWins =
        Math.random() <
        userWinChance;


    if (userScore <= 6) {
        userWins = false;
    }


    // CPU opponent gets scoring
    // home-field boost if applicable.
    if (
        matchup.teamA.name ===
        opponent.name
    ) {

        opponentScore += 2;
    }


    // Make score agree with
    // the rating-based winner.
    if (
        userWins &&
        opponentScore >= userScore
    ) {

        opponentScore =
            Math.max(
                6,
                userScore -
                randomBetween(1, 10)
            );
    }


    else if (
        !userWins &&
        opponentScore <= userScore
    ) {

        opponentScore =
            userScore +
            randomBetween(1, 10);
    }


    const teamAScore =
        userIsTeamA
            ? userScore
            : opponentScore;

    const teamBScore =
        userIsTeamA
            ? opponentScore
            : userScore;


    return {
        teamA: matchup.teamA,
        teamB: matchup.teamB,

        teamAScore: teamAScore,
        teamBScore: teamBScore,

        winner:
            userWins
                ? userTeam
                : opponent,

        weeklyStats: weeklyStats,

        isUserGame: true
    };
}


// ===============================
// SIMULATE PLAYOFF MATCHUP
// ===============================

function simulatePlayoffMatchup(matchup) {

    if (
        matchup.teamA.name === "Your Team" ||
        matchup.teamB.name === "Your Team"
    ) {

        return simulateUserPlayoffGame(
            matchup
        );
    }


    const result =
        simulateCPUPlayoffGame(
            matchup
        );

    result.isUserGame = false;

    return result;
}


// ===============================
// CREATE NEXT PLAYOFF ROUND
// ===============================

function createNextPlayoffMatchups(
    remainingTeams
) {

    const sortedTeams =
        [...remainingTeams].sort(
            function(teamA, teamB) {
                return teamA.seed - teamB.seed;
            }
        );


    currentPlayoffMatchups = [];


    let highIndex = 0;
    let lowIndex =
        sortedTeams.length - 1;


    while (highIndex < lowIndex) {

        currentPlayoffMatchups.push({
            teamA: sortedTeams[highIndex],
            teamB: sortedTeams[lowIndex]
        });

        highIndex++;
        lowIndex--;
    }
}


// ===============================
// DISPLAY QUARTERFINAL BRACKET
// ===============================

function displayQuarterfinalBracket() {

    const playoffBracket =
        document.getElementById(
            "playoff-bracket"
        );


    let bracketHTML = `

        <div class="playoff-bracket-shell">

            <div class="playoff-bracket-heading">
                NFL PLAYOFF BRACKET
            </div>


            <div class="playoff-bracket-grid">


                <!-- ROUND 1 -->

                <div class="bracket-round">

                    <div class="bracket-round-title">
                        ROUND 1
                    </div>
    `;


    // Seed 1 and Seed 2 byes

    const seedOne =
        playoffTeams.find(
            function(team) {
                return team.seed === 1;
            }
        );

    const seedTwo =
        playoffTeams.find(
            function(team) {
                return team.seed === 2;
            }
        );


    [seedOne, seedTwo].forEach(
        function(team) {

            bracketHTML += `
                <div class="
                    bracket-bye-card
                    completed-bracket-card
                    ${
                        team.name === "Your Team"
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="bracket-team-info">

                        <span class="bracket-seed">
                            #${team.seed}
                        </span>

                        <strong>
                            ${team.name}
                        </strong>

                    </div>

                    <span class="bye-label">
                        BYE • ADVANCED
                    </span>

                </div>
            `;
        }
    );


    // Completed Round 1 games

    savedRoundOneResults.forEach(
        function(result) {

            const teamAWon =
                result.winner.name ===
                result.teamA.name;

            const teamBWon =
                result.winner.name ===
                result.teamB.name;

            const userGame =
                result.teamA.name === "Your Team" ||
                result.teamB.name === "Your Team";


            bracketHTML += `
                <div class="
                    bracket-matchup-card
                    completed-bracket-card
                    ${
                        userGame
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="
                        bracket-team-row
                        ${teamAWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamA.seed}
                        </span>

                        <strong>
                            ${result.teamA.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamAScore}
                        </span>

                    </div>


                    <div class="
                        bracket-team-row
                        ${teamBWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamB.seed}
                        </span>

                        <strong>
                            ${result.teamB.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamBScore}
                        </span>

                    </div>

                </div>
            `;
        }
    );


    bracketHTML += `

                </div>


                <!-- QUARTERFINALS -->

                <div class="
                    bracket-round
                    quarterfinal-round
                ">

                    <div class="bracket-round-title">
                        QUARTERFINALS
                    </div>
    `;


    currentPlayoffMatchups.forEach(
        function(matchup) {

            const userInMatchup =
                matchup.teamA.name ===
                "Your Team" ||

                matchup.teamB.name ===
                "Your Team";


            bracketHTML += `
                <div class="
                    bracket-matchup-card
                    active-bracket-card
                    ${
                        userInMatchup
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="
                        bracket-team-row
                        ${
                            matchup.teamA.name ===
                            "Your Team"
                                ? "user-bracket-team"
                                : ""
                        }
                    ">

                        <span class="bracket-seed">
                            #${matchup.teamA.seed}
                        </span>

                        <strong>
                            ${matchup.teamA.name}
                        </strong>

                    </div>


                    <div class="bracket-vs">
                        VS
                    </div>


                    <div class="
                        bracket-team-row
                        ${
                            matchup.teamB.name ===
                            "Your Team"
                                ? "user-bracket-team"
                                : ""
                        }
                    ">

                        <span class="bracket-seed">
                            #${matchup.teamB.seed}
                        </span>

                        <strong>
                            ${matchup.teamB.name}
                        </strong>

                    </div>

                </div>
            `;
        }
    );


    bracketHTML += `

                </div>


                <!-- SEMIFINALS -->

                <div class="
                    bracket-round
                    semifinal-round
                ">

                    <div class="bracket-round-title">
                        SEMIFINALS
                    </div>

                    <div class="future-bracket-slot">
                        TBD
                    </div>

                    <div class="future-bracket-slot">
                        TBD
                    </div>

                </div>


                <!-- CHAMPIONSHIP -->

                <div class="
                    bracket-round
                    championship-round
                ">

                    <div class="bracket-round-title">
                        CHAMPIONSHIP
                    </div>

                    <div class="
                        future-bracket-slot
                        championship-slot
                    ">
                        TBD
                    </div>

                </div>


            </div>

        </div>
    `;


    playoffBracket.innerHTML =
        bracketHTML;
}


// ===============================
// UPCOMING USER PLAYOFF MATCHUP
// ===============================

function displayUpcomingUserPlayoffMatchup() {

    const playoffResults =
        document.getElementById(
            "playoff-results"
        );

    const userMatchup =
        currentPlayoffMatchups.find(
            function(matchup) {
                return (
                    matchup.teamA.name === "Your Team" ||
                    matchup.teamB.name === "Your Team"
                );
            }
        );


    // Your Team is no longer in the playoffs
    if (!userMatchup) {
        return;
    }


    const userIsTeamA =
        userMatchup.teamA.name === "Your Team";

    const userTeam =
        userIsTeamA
            ? userMatchup.teamA
            : userMatchup.teamB;

    const opponent =
        userIsTeamA
            ? userMatchup.teamB
            : userMatchup.teamA;


    const existingNextGame =
    playoffResults.querySelector(
        ".playoff-next-game"
    );

if (existingNextGame) {
    existingNextGame.remove();
}


const upcomingGameHTML = `
    <div class="playoff-next-game">

        <div class="playoff-next-game-label">
            YOUR NEXT GAME
        </div>

        <div class="playoff-next-game-matchup">

            <div class="playoff-next-team">

                <span>
                    #${opponent.seed} OPPONENT
                </span>

                <strong>
                    ${opponent.name}
                </strong>

            </div>


            <div class="playoff-next-vs">
                VS
            </div>


            <div class="playoff-next-team user-next-team">

                <span>
                    #${userTeam.seed} YOUR TEAM
                </span>

                <strong>
                    Your Team
                </strong>

            </div>

        </div>

    </div>
`;


playoffResults.insertAdjacentHTML(
    "afterbegin",
    upcomingGameHTML
);
}


// ===============================
// PLAYOFF USER GAME RESULT
// ===============================

function getPlayoffUserGameResultHTML(result) {

    const userIsTeamA =
        result.teamA.name === "Your Team";

    const userTeam =
        userIsTeamA
            ? result.teamA
            : result.teamB;

    const opponent =
        userIsTeamA
            ? result.teamB
            : result.teamA;

    const userScore =
        userIsTeamA
            ? result.teamAScore
            : result.teamBScore;

    const opponentScore =
        userIsTeamA
            ? result.teamBScore
            : result.teamAScore;

    const userWon =
        result.winner.name === "Your Team";


    return `
        <div class="
            playoff-user-result
            ${userWon ? "playoff-result-win" : "playoff-result-loss"}
        ">

            <div class="playoff-result-top">

                <span class="playoff-result-final">
                    FINAL
                </span>

                <span class="playoff-result-badge">
                    ${userWon ? "WIN" : "LOSS"}
                </span>

            </div>


            <div class="playoff-result-scoreboard">

                <div class="playoff-result-team">

                    <span class="playoff-result-seed">
                        #${opponent.seed} OPPONENT
                    </span>

                    <strong>
                        ${opponent.name}
                    </strong>

                    <span class="playoff-result-score">
                        ${opponentScore}
                    </span>

                </div>


                <div class="playoff-result-divider">
                    -
                </div>


                <div class="playoff-result-team user-playoff-result-team">

                    <span class="playoff-result-seed">
                        #${userTeam.seed} YOUR TEAM
                    </span>

                    <strong>
                        Your Team
                    </strong>

                    <span class="playoff-result-score">
                        ${userScore}
                    </span>

                </div>

            </div>

        </div>
    `;
}


// ===============================
// SIMULATE ROUND 1
// ===============================

function simulateRoundOne() {

    savedRoundOneMatchups =
    currentPlayoffMatchups.slice();

    const roundResults = [];

    const advancingTeams = [];


    // Seeds 1 and 2 automatically advance.

    const seedOne =
        playoffTeams.find(
            function(team) {
                return team.seed === 1;
            }
        );


    const seedTwo =
        playoffTeams.find(
            function(team) {
                return team.seed === 2;
            }
        );


    advancingTeams.push(seedOne);
    advancingTeams.push(seedTwo);


    // Simulate the six Round 1 games.

    currentPlayoffMatchups.forEach(
        function(matchup) {

            const result =
    simulatePlayoffMatchup(
        matchup
    );


            roundResults.push(result);

            advancingTeams.push(
                result.winner
            );
        }
    );


    savedRoundOneResults =
    roundResults.slice();


    // ===============================
    // DISPLAY ROUND 1 RESULTS
    // ===============================

    let resultsHTML = "";


    roundResults.forEach(
    function(result) {

        if (result.isUserGame) {

            resultsHTML +=
                getPlayoffUserGameResultHTML(
                    result
                );

            resultsHTML +=
                getWeeklyPlayerStatsHTML(
                    result.weeklyStats
                );
        }

    }
);


    document.getElementById(
        "playoff-results"
    ).innerHTML =
        resultsHTML;


    // ===============================
    // BUILD QUARTERFINALS
    // ===============================

    currentPlayoffRound = 2;


    createNextPlayoffMatchups(
        advancingTeams
    );


    displayQuarterfinalBracket();


    displayUpcomingUserPlayoffMatchup();


    document.getElementById(
        "simulate-playoff-button"
    ).textContent =
        "Simulate Quarterfinals";
}


document.getElementById(
    "simulate-playoff-button"
).addEventListener(
    "click",
    function() {

        if (currentPlayoffRound === 1) {

            simulateRoundOne();

        } else if (
            currentPlayoffRound === 2
        ) {

            simulateQuarterfinals();

        } else if (
            currentPlayoffRound === 3
        ) {

            simulateSemifinals();

        } else if (
            currentPlayoffRound === 4
        ) {

            simulateChampionship();
        }
    }
);


// ===============================
// DISPLAY SEMIFINAL BRACKET
// ===============================

function displaySemifinalBracket() {

    const playoffBracket =
        document.getElementById(
            "playoff-bracket"
        );


    const seedOne =
        playoffTeams.find(
            function(team) {
                return team.seed === 1;
            }
        );

    const seedTwo =
        playoffTeams.find(
            function(team) {
                return team.seed === 2;
            }
        );


    let bracketHTML = `

        <div class="playoff-bracket-shell">

            <div class="playoff-bracket-heading">
                NFL PLAYOFF BRACKET
            </div>


            <div class="playoff-bracket-grid">


                <!-- ROUND 1 -->

                <div class="bracket-round">

                    <div class="bracket-round-title">
                        ROUND 1
                    </div>
    `;


    // ===============================
    // ROUND 1 BYES
    // ===============================

    [seedOne, seedTwo].forEach(
        function(team) {

            bracketHTML += `
                <div class="
                    bracket-bye-card
                    completed-bracket-card
                    ${
                        team.name === "Your Team"
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="bracket-team-info">

                        <span class="bracket-seed">
                            #${team.seed}
                        </span>

                        <strong>
                            ${team.name}
                        </strong>

                    </div>

                    <span class="bye-label">
                        BYE • ADVANCED
                    </span>

                </div>
            `;
        }
    );


    // ===============================
    // ROUND 1 COMPLETED GAMES
    // ===============================

    savedRoundOneResults.forEach(
        function(result) {

            const teamAWon =
                result.winner.name ===
                result.teamA.name;

            const teamBWon =
                result.winner.name ===
                result.teamB.name;

            const userGame =
                result.teamA.name === "Your Team" ||
                result.teamB.name === "Your Team";


            bracketHTML += `
                <div class="
                    bracket-matchup-card
                    completed-bracket-card
                    ${
                        userGame
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="
                        bracket-team-row
                        ${teamAWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamA.seed}
                        </span>

                        <strong>
                            ${result.teamA.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamAScore}
                        </span>

                    </div>


                    <div class="
                        bracket-team-row
                        ${teamBWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamB.seed}
                        </span>

                        <strong>
                            ${result.teamB.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamBScore}
                        </span>

                    </div>

                </div>
            `;
        }
    );


    bracketHTML += `

                </div>


                <!-- QUARTERFINALS -->

                <div class="
                    bracket-round
                    quarterfinal-round
                ">

                    <div class="bracket-round-title">
                        QUARTERFINALS
                    </div>
    `;


    // ===============================
    // COMPLETED QUARTERFINALS
    // ===============================

    savedQuarterfinalResults.forEach(
        function(result) {

            const teamAWon =
                result.winner.name ===
                result.teamA.name;

            const teamBWon =
                result.winner.name ===
                result.teamB.name;

            const userGame =
                result.teamA.name === "Your Team" ||
                result.teamB.name === "Your Team";


            bracketHTML += `
                <div class="
                    bracket-matchup-card
                    completed-bracket-card
                    ${
                        userGame
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="
                        bracket-team-row
                        ${teamAWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamA.seed}
                        </span>

                        <strong>
                            ${result.teamA.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamAScore}
                        </span>

                    </div>


                    <div class="
                        bracket-team-row
                        ${teamBWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamB.seed}
                        </span>

                        <strong>
                            ${result.teamB.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamBScore}
                        </span>

                    </div>

                </div>
            `;
        }
    );


    bracketHTML += `

                </div>


                <!-- SEMIFINALS -->

                <div class="
                    bracket-round
                    semifinal-round
                ">

                    <div class="bracket-round-title">
                        SEMIFINALS
                    </div>
    `;


    // ===============================
    // ACTIVE SEMIFINAL MATCHUPS
    // ===============================

    currentPlayoffMatchups.forEach(
        function(matchup) {

            const userInMatchup =
                matchup.teamA.name === "Your Team" ||
                matchup.teamB.name === "Your Team";


            bracketHTML += `
                <div class="
                    bracket-matchup-card
                    active-bracket-card
                    ${
                        userInMatchup
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="
                        bracket-team-row
                        ${
                            matchup.teamA.name === "Your Team"
                                ? "user-bracket-team"
                                : ""
                        }
                    ">

                        <span class="bracket-seed">
                            #${matchup.teamA.seed}
                        </span>

                        <strong>
                            ${matchup.teamA.name}
                        </strong>

                    </div>


                    <div class="bracket-vs">
                        VS
                    </div>


                    <div class="
                        bracket-team-row
                        ${
                            matchup.teamB.name === "Your Team"
                                ? "user-bracket-team"
                                : ""
                        }
                    ">

                        <span class="bracket-seed">
                            #${matchup.teamB.seed}
                        </span>

                        <strong>
                            ${matchup.teamB.name}
                        </strong>

                    </div>

                </div>
            `;
        }
    );


    bracketHTML += `

                </div>


                <!-- CHAMPIONSHIP -->

                <div class="
                    bracket-round
                    championship-round
                ">

                    <div class="bracket-round-title">
                        CHAMPIONSHIP
                    </div>

                    <div class="
                        future-bracket-slot
                        championship-slot
                    ">
                        TBD
                    </div>

                </div>


            </div>

        </div>
    `;


    playoffBracket.innerHTML =
        bracketHTML;
}


// ===============================
// SIMULATE QUARTERFINALS
// ===============================

function simulateQuarterfinals() {


    savedQuarterfinalMatchups =
    currentPlayoffMatchups.slice();

    const roundResults = [];

    const advancingTeams = [];


    currentPlayoffMatchups.forEach(
        function(matchup) {

            const result =
                simulatePlayoffMatchup(
                    matchup
                );

            roundResults.push(result);

            advancingTeams.push(
                result.winner
            );
        }
    );


    savedQuarterfinalResults =
    roundResults.slice();


    // ===============================
    // DISPLAY QUARTERFINAL RESULTS
    // ===============================

    let resultsHTML = "";

const userResult =
    roundResults.find(
        function(result) {
            return result.isUserGame;
        }
    );

if (userResult) {

    resultsHTML +=
        getPlayoffUserGameResultHTML(
            userResult
        );

    resultsHTML +=
        getWeeklyPlayerStatsHTML(
            userResult.weeklyStats
        );
}

document.getElementById(
    "playoff-results"
).innerHTML =
    resultsHTML;


    // ===============================
    // BUILD SEMIFINALS
    // ===============================

    currentPlayoffRound = 3;


    createNextPlayoffMatchups(
        advancingTeams
    );


    displaySemifinalBracket();


    displayUpcomingUserPlayoffMatchup();


    document.getElementById(
        "simulate-playoff-button"
    ).textContent =
        "Simulate Semifinals";
}


// ===============================
// DISPLAY CHAMPIONSHIP
// ===============================

function displayChampionshipBracket() {

    const playoffBracket =
        document.getElementById(
            "playoff-bracket"
        );


    const seedOne =
        playoffTeams.find(
            function(team) {
                return team.seed === 1;
            }
        );

    const seedTwo =
        playoffTeams.find(
            function(team) {
                return team.seed === 2;
            }
        );


        const championshipMatchup =
    currentPlayoffMatchups[0];


    let championshipCardHTML = "";

if (savedChampionshipResult) {

    const result = savedChampionshipResult;

    const teamAWon =
        result.winner.name === result.teamA.name;

    const teamBWon =
        result.winner.name === result.teamB.name;

    const userGame =
        result.teamA.name === "Your Team" ||
        result.teamB.name === "Your Team";

    championshipCardHTML = `
        <div class="
            bracket-matchup-card
            completed-bracket-card
            ${userGame ? "user-bracket-card" : ""}
        ">

            <div class="
                bracket-team-row
                ${teamAWon ? "bracket-winner" : "bracket-loser"}
            ">
                <span class="bracket-seed">
                    #${result.teamA.seed}
                </span>

                <strong>
                    ${result.teamA.name}
                </strong>

                <span class="bracket-score">
                    ${result.teamAScore}
                </span>
            </div>

            <div class="
                bracket-team-row
                ${teamBWon ? "bracket-winner" : "bracket-loser"}
            ">
                <span class="bracket-seed">
                    #${result.teamB.seed}
                </span>

                <strong>
                    ${result.teamB.name}
                </strong>

                <span class="bracket-score">
                    ${result.teamBScore}
                </span>
            </div>

        </div>
    `;

} else {

    const userInChampionship =
        championshipMatchup.teamA.name === "Your Team" ||
        championshipMatchup.teamB.name === "Your Team";

    championshipCardHTML = `
        <div class="
            bracket-matchup-card
            active-bracket-card
            ${userInChampionship ? "user-bracket-card" : ""}
        ">

            <div class="
                bracket-team-row
                ${
                    championshipMatchup.teamA.name === "Your Team"
                        ? "user-bracket-team"
                        : ""
                }
            ">
                <span class="bracket-seed">
                    #${championshipMatchup.teamA.seed}
                </span>

                <strong>
                    ${championshipMatchup.teamA.name}
                </strong>
            </div>

            <div class="bracket-vs">
                VS
            </div>

            <div class="
                bracket-team-row
                ${
                    championshipMatchup.teamB.name === "Your Team"
                        ? "user-bracket-team"
                        : ""
                }
            ">
                <span class="bracket-seed">
                    #${championshipMatchup.teamB.seed}
                </span>

                <strong>
                    ${championshipMatchup.teamB.name}
                </strong>
            </div>

        </div>
    `;
}


    let bracketHTML = `

        <div class="playoff-bracket-shell">

            <div class="playoff-bracket-heading">
                NFL PLAYOFF BRACKET
            </div>


            <div class="playoff-bracket-grid">


                <!-- ROUND 1 -->

                <div class="bracket-round">

                    <div class="bracket-round-title">
                        ROUND 1
                    </div>
    `;


    // ===============================
    // ROUND 1 BYES
    // ===============================

    [seedOne, seedTwo].forEach(
        function(team) {

            bracketHTML += `
                <div class="
                    bracket-bye-card
                    completed-bracket-card
                    ${
                        team.name === "Your Team"
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="bracket-team-info">

                        <span class="bracket-seed">
                            #${team.seed}
                        </span>

                        <strong>
                            ${team.name}
                        </strong>

                    </div>

                    <span class="bye-label">
                        BYE • ADVANCED
                    </span>

                </div>
            `;
        }
    );


    // ===============================
    // ROUND 1 COMPLETED GAMES
    // ===============================

    savedRoundOneResults.forEach(
        function(result) {

            const teamAWon =
                result.winner.name ===
                result.teamA.name;

            const teamBWon =
                result.winner.name ===
                result.teamB.name;

            const userGame =
                result.teamA.name === "Your Team" ||
                result.teamB.name === "Your Team";


            bracketHTML += `
                <div class="
                    bracket-matchup-card
                    completed-bracket-card
                    ${
                        userGame
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="
                        bracket-team-row
                        ${teamAWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamA.seed}
                        </span>

                        <strong>
                            ${result.teamA.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamAScore}
                        </span>

                    </div>


                    <div class="
                        bracket-team-row
                        ${teamBWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamB.seed}
                        </span>

                        <strong>
                            ${result.teamB.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamBScore}
                        </span>

                    </div>

                </div>
            `;
        }
    );


    bracketHTML += `

                </div>


                <!-- QUARTERFINALS -->

                <div class="
                    bracket-round
                    quarterfinal-round
                ">

                    <div class="bracket-round-title">
                        QUARTERFINALS
                    </div>
    `;


    // ===============================
    // COMPLETED QUARTERFINALS
    // ===============================

    savedQuarterfinalResults.forEach(
        function(result) {

            const teamAWon =
                result.winner.name ===
                result.teamA.name;

            const teamBWon =
                result.winner.name ===
                result.teamB.name;

            const userGame =
                result.teamA.name === "Your Team" ||
                result.teamB.name === "Your Team";


            bracketHTML += `
                <div class="
                    bracket-matchup-card
                    completed-bracket-card
                    ${
                        userGame
                            ? "user-bracket-card"
                            : ""
                    }
                ">

                    <div class="
                        bracket-team-row
                        ${teamAWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamA.seed}
                        </span>

                        <strong>
                            ${result.teamA.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamAScore}
                        </span>

                    </div>


                    <div class="
                        bracket-team-row
                        ${teamBWon ? "bracket-winner" : "bracket-loser"}
                    ">

                        <span class="bracket-seed">
                            #${result.teamB.seed}
                        </span>

                        <strong>
                            ${result.teamB.name}
                        </strong>

                        <span class="bracket-score">
                            ${result.teamBScore}
                        </span>

                    </div>

                </div>
            `;
        }
    );


    bracketHTML += `

                </div>


                <!-- SEMIFINALS -->

                <div class="
                    bracket-round
                    semifinal-round
                ">

                    <div class="bracket-round-title">
                        SEMIFINALS
                    </div>
    `;


    // ===============================
    // COMPLETED SEMIFINALS
    // ===============================

    savedSemifinalResults.forEach(
    function(result) {

        const teamAWon =
            result.winner.name ===
            result.teamA.name;

        const teamBWon =
            result.winner.name ===
            result.teamB.name;

        const userGame =
            result.teamA.name === "Your Team" ||
            result.teamB.name === "Your Team";

        bracketHTML += `
            <div class="
                bracket-matchup-card
                completed-bracket-card
                ${
                    userGame
                        ? "user-bracket-card"
                        : ""
                }
            ">

                <div class="
                    bracket-team-row
                    ${teamAWon ? "bracket-winner" : "bracket-loser"}
                ">

                    <span class="bracket-seed">
                        #${result.teamA.seed}
                    </span>

                    <strong>
                        ${result.teamA.name}
                    </strong>

                    <span class="bracket-score">
                        ${result.teamAScore}
                    </span>

                </div>

                <div class="
                    bracket-team-row
                    ${teamBWon ? "bracket-winner" : "bracket-loser"}
                ">

                    <span class="bracket-seed">
                        #${result.teamB.seed}
                    </span>

                    <strong>
                        ${result.teamB.name}
                    </strong>

                    <span class="bracket-score">
                        ${result.teamBScore}
                    </span>

                </div>

            </div>
        `;
    }
);


    bracketHTML += `

                </div>


                <!-- CHAMPIONSHIP -->

                <div class="
                    bracket-round
                    championship-round
                ">

                    <div class="bracket-round-title">
                        CHAMPIONSHIP
                    </div>

                    ${championshipCardHTML}

        </div>
    `;


    playoffBracket.innerHTML =
        bracketHTML;
}


// ===============================
// SIMULATE SEMIFINALS
// ===============================

function simulateSemifinals() {

    const roundResults = [];

    const advancingTeams = [];


    currentPlayoffMatchups.forEach(
        function(matchup) {

            const result =
                simulatePlayoffMatchup(
                    matchup
                );

            roundResults.push(result);

            advancingTeams.push(
                result.winner
            );
        }
    );


    savedSemifinalResults =
    roundResults.slice();


    // ===============================
    // DISPLAY SEMIFINAL RESULTS
    // ===============================

    let resultsHTML = "";

roundResults.forEach(
    function(result) {

        if (result.isUserGame) {

            resultsHTML +=
                getPlayoffUserGameResultHTML(
                    result
                );

            resultsHTML +=
                getWeeklyPlayerStatsHTML(
                    result.weeklyStats
                );
        }

    }
);

document.getElementById(
    "playoff-results"
).innerHTML =
    resultsHTML;


    // ===============================
    // BUILD CHAMPIONSHIP
    // ===============================

    currentPlayoffRound = 4;


    createNextPlayoffMatchups(
        advancingTeams
    );


    displayChampionshipBracket();

displayUpcomingUserPlayoffMatchup();

document.getElementById(
        "simulate-playoff-button"
    ).textContent =
        "Simulate Championship";
}


// ===============================
// SIMULATE CHAMPIONSHIP
// ===============================

function simulateChampionship() {

    const matchup =
        currentPlayoffMatchups[0];


    const result =
        simulatePlayoffMatchup(
            matchup
        );


    savedChampionshipResult = result;


    playoffChampion =
        result.winner;


    const teamAWon =
    result.winner.name === result.teamA.name;

const teamBWon =
    result.winner.name === result.teamB.name;

let resultsHTML = `
    <div class="championship-result-title">
        <span>CHAMPIONSHIP GAME</span>
        <h2>Final Score</h2>
    </div>

    <div class="championship-final-scoreboard">

        <div class="
            championship-final-team
            ${teamAWon ? "championship-final-winner" : ""}
        ">
            <div class="championship-final-seed">
                #${result.teamA.seed}
            </div>

            <div class="championship-final-name">
                ${result.teamA.name}
            </div>

            <div class="championship-final-score">
                ${result.teamAScore}
            </div>
        </div>

        <div class="championship-final-center">
            <span>FINAL</span>
        </div>

        <div class="
            championship-final-team
            ${teamBWon ? "championship-final-winner" : ""}
        ">
            <div class="championship-final-seed">
                #${result.teamB.seed}
            </div>

            <div class="championship-final-name">
                ${result.teamB.name}
            </div>

            <div class="championship-final-score">
                ${result.teamBScore}
            </div>
        </div>

    </div>
`;


    if (result.isUserGame) {

        resultsHTML +=
            getWeeklyPlayerStatsHTML(
                result.weeklyStats
            );
    }


    document.getElementById(
        "playoff-results"
    ).innerHTML =
        resultsHTML;


    const userMadeChampionship =
    result.teamA.name === "Your Team" ||
    result.teamB.name === "Your Team";

const userWonChampionship =
    playoffChampion.name === "Your Team";

let championshipHeroClass = "";
let championshipLabel = "";
let championshipTitle = "";
let championshipMessage = "";

if (userWonChampionship) {

    championshipHeroClass = "championship-hero-win";

    championshipLabel = "NFL CHAMPIONS";

    championshipTitle = "CHAMPIONSHIP WINNER";

championshipMessage =
    "Your Team wins the championship!";

} else if (userMadeChampionship) {

    championshipHeroClass = "championship-hero-loss";

    championshipLabel = "SEASON COMPLETE";

    championshipTitle =
        "CHAMPIONSHIP RUNNER-UP";

    championshipMessage =
        `${playoffChampion.name} wins the championship.`;

} else {

    championshipHeroClass =
        "championship-hero-eliminated";

    championshipLabel = "SEASON COMPLETE";

    championshipTitle =
        "PLAYOFF RUN ENDED";

    championshipMessage =
        `${playoffChampion.name} wins the championship.`;
}

document.getElementById(
    "playoff-bracket"
).innerHTML = `
    <div class="
        championship-hero
        ${championshipHeroClass}
    ">

        <div class="championship-hero-label">
            ${championshipLabel}
        </div>

        <h1>
            ${championshipTitle}
        </h1>

        <p>
            ${championshipMessage}
        </p>

    </div>
`;


    document.getElementById(
        "simulate-playoff-button"
    ).style.display = "none";


    currentPlayoffRound = 5;


    const homeButton = document.createElement("button");

homeButton.id = "return-home-button";
homeButton.textContent = "Back to Home";

homeButton.addEventListener("click", function () {
    window.location.reload();
});

document.getElementById(
    "playoff-results"
).appendChild(homeButton);
}