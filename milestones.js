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

    return milestones
        .sort(
            (a,b) => b.priority - a.priority
        );

}

function isValidMatch(match){

    return (
        match &&
        match["Result"] &&
        match["Result"] !== "-:-"
    );

}

function processPlayerAppearances(
    match,
    players
){

    for(let i = 1; i <= 11; i++){

        const player =
            match[`Player name ${i}`];

        if(!player){
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

    for(let i = 1; i <= 12; i++){

        const scorer =
            match[`Goal Player ${i}`];

        if(
            !scorer ||
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

    const manager = match.Manager;

    if(!manager){
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
    .forEach(([name, stats]) => {

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

            type:"appearance",

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
    .forEach(([name, stats]) => {

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

            type:"goal",

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
    .forEach(([name, matches]) => {

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

            type:"manager",

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
        );

    ranking.forEach(

        ([name], index) => {

            const rank =
                index + 1;

            if(
                ![
                    10,
                    20,
                    50,
                    100
                ].includes(rank)
            ){
                return;
            }

            const key =
                `rank-${name}-${rank}`;

            if(seen.has(key)){
                return;
            }

            seen.add(key);

            milestones.push({

                priority:90,

                type:"ranking",

                text:
                    `📈 ${name} ranks ${rank}th on Barcelona's all-time appearances list.`

            });

        }

    );

}

function generateClasicoMilestones(){

    const milestones = [];

    const seen = new Set();

    const appearances = {};
    const goals = {};

    getClasicos().forEach(match => {

        for(let i = 1; i <= 11; i++){

            const player =
                match[`Player name ${i}`];

            if(player){

                appearances[player] =
                    (appearances[player] || 0) + 1;

            }

        }

        for(let i = 1; i <= 12; i++){

            const scorer =
                match[`Goal Player ${i}`];

            if(
                scorer &&
                !scorer.includes("(OG)")
            ){

                goals[scorer] =
                    (goals[scorer] || 0) + 1;

            }

        }

    });

    Object.entries(appearances)
    .forEach(([name, apps]) => {

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

            type:"clasico",

            text:
                `⚔️ ${name} made ${apps} El Clásico appearances.`

        });

    });

    Object.entries(goals)
    .forEach(([name, goalCount]) => {

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

            type:"clasico-goal",

            text:
                `⚽ ${name} scored ${goalCount} goals in El Clásico.`

        });

    });

    return milestones;

}

function getLatestMilestones(limit = 10){

    return [

        ...generateMilestones(),

        ...generateClasicoMilestones()

    ]

    .sort(
        (a,b) => b.priority - a.priority
    )

    .slice(0, limit);

}

function renderMilestones(){

    const milestones =
        getLatestMilestones();

    const container =
        document.getElementById(
            "milestones"
        );

    if(!container){
        return;
    }

    container.innerHTML =

        milestones.map(item => `

            <div class="milestone-item">

                ${item.text}

            </div>

        `).join("");

}
