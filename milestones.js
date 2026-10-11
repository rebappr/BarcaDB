const MILESTONE_RULES = {

    appearances: [
        50,100,150,200,250,300,
        350,400,450,500,550,600,
        650,700,750,800
    ],

    goals: [
        25,50,75,100,125,150,
        175,200,250,300,350,
        400,450,500,550,600
    ],

    managerMatches: [
        50,100,150,200,250,
        300,400,500
    ],

    clasicoAppearances: [
        10,20,30,40,50
    ],

    clasicoGoals: [
        5,10,15,20,25
    ]

};

function isValidMatch(match){

    return (
        match &&
        match.Result &&
        match.Result !== "-:-"
    );

}

function isValidPerson(name){

    return (
        typeof name === "string" &&
        name.trim().length > 1 &&
        name !== "-"
    );

}

function generateMilestones(){

    const milestones = [];
    const seen = new Set();

    const players = {};
    const managers = {};

    allMatches.forEach(match => {

        if(!isValidMatch(match)){
            return;
        }

        processPlayerAppearances(
            match,
            players
        );

        processPlayerGoals(
            match,
            players
        );

        processManagers(
            match,
            managers
        );

    });

    generateAppearanceMilestones(
        players,
        milestones,
        seen
    );

    generateGoalMilestones(
        players,
        milestones,
        seen
    );

    generateManagerMilestones(
        managers,
        milestones,
        seen
    );

    generateTopAppearanceRanking(
        players,
        milestones,
        seen
    );

    return milestones;

}

function processPlayerAppearances(
    match,
    players
){

    for(let i=1;i<=11;i++){

        const player =
            match[`Player name ${i}`];

        if(!isValidPerson(player)){
            continue;
        }

        if(!players[player]){

            players[player] = {

                appearances:0,
                goals:0

            };

        }

        players[player].appearances++;

    }

}

function processPlayerGoals(
    match,
    players
){

    for(let i=1;i<=12;i++){

        const scorer =
            match[`Goal Player ${i}`];

        if(
            !isValidPerson(scorer) ||
            scorer.includes("(OG)")
        ){
            continue;
        }

        if(!players[scorer]){

            players[scorer] = {

                appearances:0,
                goals:0

            };

        }

        players[scorer].goals++;

    }

}

function processManagers(
    match,
    managers
){

    const manager =
        match.Manager;

    if(!isValidPerson(manager)){
        return;
    }

    managers[manager] =
        (managers[manager] || 0) + 1;

}

function generateAppearanceMilestones(
    players,
    milestones,
    seen
){

    Object.entries(players)
    .forEach(([name,stats]) => {

        if(
            !MILESTONE_RULES
            .appearances
            .includes(stats.appearances)
        ){
            return;
        }

        const key =
            `apps-${name}-${stats.appearances}`;

        if(seen.has(key)){
            return;
        }

        seen.add(key);

        milestones.push({

            priority:80,

            text:
                `🎉 ${name} reached ${stats.appearances} appearances for FC Barcelona.`

        });

    });

}

function generateGoalMilestones(
    players,
    milestones,
    seen
){

    Object.entries(players)
    .forEach(([name,stats]) => {

        if(
            !MILESTONE_RULES
            .goals
            .includes(stats.goals)
        ){
            return;
        }

        const key =
            `goals-${name}-${stats.goals}`;

        if(seen.has(key)){
            return;
        }

        seen.add(key);

        milestones.push({

            priority:80,

            text:
                `⚽ ${name} scored his ${stats.goals}th goal for FC Barcelona.`

        });

    });

}

function generateManagerMilestones(
    managers,
    milestones,
    seen
){

    Object.entries(managers)
    .forEach(([name,matches]) => {

        if(
            !MILESTONE_RULES
            .managerMatches
            .includes(matches)
        ){
            return;
        }

        const key =
            `manager-${name}-${matches}`;

        if(seen.has(key)){
            return;
        }

        seen.add(key);

        milestones.push({

            priority:70,

            text:
                `🧠 ${name} managed FC Barcelona in ${matches} official matches.`

        });

    });

}

function generateTopAppearanceRanking(
    players,
    milestones,
    seen
){

    const ranking =
        Object.entries(players)
        .sort(
            (a,b) =>
                b[1].appearances -
                a[1].appearances
        )
        .slice(0,5);

    ranking.forEach(
        ([name,stats],index) => {

        const key =
            `top-apps-${name}`;

        if(seen.has(key)){
            return;
        }

        seen.add(key);

        milestones.push({

            priority:90,

            text:
                `📈 ${name} ranks #${index + 1} in Barcelona appearances with ${stats.appearances} matches.`

        });

    });

}

function generateClasicoMilestones(){

    if(typeof getClasicos !== "function"){
        return [];
    }

    const milestones = [];
    const seen = new Set();

    const appearances = {};
    const goals = {};

    getClasicos().forEach(match => {

        for(let i=1;i<=11;i++){

            const player =
                match[`Player name ${i}`];

            if(isValidPerson(player)){

                appearances[player] =
                    (appearances[player] || 0) + 1;

            }

            const oppPlayer =
                match[`Opp. Player name ${i}`];

            if(isValidPerson(oppPlayer)){

                appearances[oppPlayer] =
                    (appearances[oppPlayer] || 0) + 1;

            }

        }

        for(let i=1;i<=12;i++){

            const scorer =
                match[`Goal Player ${i}`];

            if(
                isValidPerson(scorer) &&
                !scorer.includes("(OG)")
            ){

                goals[scorer] =
                    (goals[scorer] || 0) + 1;

            }

            const oppScorer =
                match[`Opp. Goal Player ${i}`];

            if(
                isValidPerson(oppScorer) &&
                !oppScorer.includes("(OG)")
            ){

                goals[oppScorer] =
                    (goals[oppScorer] || 0) + 1;

            }

        }

    });

    Object.entries(appearances)
    .forEach(([name,apps]) => {

        if(
            !MILESTONE_RULES
            .clasicoAppearances
            .includes(apps)
        ){
            return;
        }

        const key =
            `clasico-apps-${name}-${apps}`;

        if(seen.has(key)){
            return;
        }

        seen.add(key);

        milestones.push({

            priority:90,

            text:
                `⚔️ ${name} made ${apps} El Clásico appearances.`

        });

    });

    Object.entries(goals)
    .forEach(([name,goalCount]) => {

        if(
            !MILESTONE_RULES
            .clasicoGoals
            .includes(goalCount)
        ){
            return;
        }

        const key =
            `clasico-goals-${name}-${goalCount}`;

        if(seen.has(key)){
            return;
        }

        seen.add(key);

        milestones.push({

            priority:95,

            text:
                `⚽ ${name} scored ${goalCount} goals in El Clásico.`

        });

    });

    return milestones;

}

function getLastPlayedMatch(){

    return allMatches
        .filter(
            match =>
                match.Result &&
                match.Result !== "-:-"
        )
        .sort(
            (a,b) =>
                Number(b.ID) - Number(a.ID)
        )[0];

}

function getLastMatchInsights(){

    const insights = [];

    const lastMatch =
        getLastPlayedMatch();

    if(!lastMatch){
        return [];
    }

    insights.push({

        priority:100,

        text:
            `📅 Latest result: FC Barcelona ${lastMatch.Result} against ${lastMatch["Opp. Team"]} in ${lastMatch.Competition}.`

    });

    // Goalscorers in latest match

    const scorers = new Set();

for(let i=1;i<=12;i++){

    const scorer =
        lastMatch[`Goal Player ${i}`];

    if(
        !scorer ||
        scorer.includes("(OG)")
    ){
        continue;
    }

    scorers.add(scorer);

}

scorers.forEach(scorer => {

    let previousGoals = 0;

    allMatches.forEach(match => {

        if(
            Number(match.ID) >=
            Number(lastMatch.ID)
        ){
            return;
        }

        for(let j=1;j<=12;j++){

            if(
                match[`Goal Player ${j}`] ===
                scorer
            ){
                previousGoals++;
            }

        }

    });

    // First goal for Barcelona

    if(previousGoals === 0){

        insights.push({

            priority:120,

            text:
                `🎉 ${scorer} scored his first goal for FC Barcelona.`

        });

    }

});

    return insights;

}

function getLatestMilestones(limit = 10){

    return getLastMatchInsights()

        .sort(
            (a,b) =>
                b.priority - a.priority
        )

        .slice(0,limit);

}

function renderMilestones(){

    const container =
        document.getElementById(
            "milestones"
        );

    if(!container){
        return;
    }

    const milestones =
        getLatestMilestones();

    container.innerHTML =

        milestones.map(item => `

            <div class="milestone-item">

                ${item.text}

            </div>

        `).join("");

}