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

function normalizeSeason(season){

    return String(season || "")
        .replace(/\s+/g,"")
        .replace(/-/g,"/")
        .trim();

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

function countAppearancesUntilMatch(
    player,
    matchId
){

    let appearances = 0;

    allMatches.forEach(match => {

        if(
            Number(match.ID) > matchId
        ){
            return;
        }

        for(let i=1;i<=11;i++){

            if(
                match[`Player name ${i}`] === player
            ){

                appearances++;
                break;

            }

        }
        
        for(let i=1;i<=12;i++){

    if(
        match[`Substitution IN Player ${i}`]
        === player
    ){

        appearances++;
        break;

    }

}

    });

    return appearances;

}

function buildAppearanceRanking(
    matchId
){

    const stats = {};

    allMatches.forEach(match => {

        if(
            Number(match.ID) > matchId
        ){
            return;
        }

        for(let i=1;i<=11;i++){

            const player =
                match[`Player name ${i}`];

            if(!player){
                continue;
            }

            stats[player] =
                (stats[player] || 0) + 1;

        }

    });

    return Object.entries(stats)

        .map(([name,apps]) => ({
            name,
            appearances:apps
        }))

        .sort(
            (a,b) =>
                b.appearances -
                a.appearances
        );

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
    
const starters = new Set();

for(let i=1;i<=11;i++){

    const player =
        lastMatch[`Player name ${i}`];

    if(player){
        starters.add(player);
    }

}

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

let goalsInLastMatch = 0;

let previousClasicoGoals = 0;

    // First El Clásico goal

    if(
        String(lastMatch["Opp. Team"])
            .toLowerCase()
            .includes("real madrid")
    ){

        allMatches.forEach(match => {

            if(
                Number(match.ID) >=
                Number(lastMatch.ID)
            ){
                return;
            }

            if(
                !String(match["Opp. Team"])
                    .toLowerCase()
                    .includes("real madrid")
            ){
                return;
            }

            for(let j=1;j<=12;j++){

                if(
                    match[`Goal Player ${j}`] === scorer
                ){

                    previousClasicoGoals++;

                }

            }

        });

        if(previousClasicoGoals === 0){

            insights.push({

                priority:180,

                text:
                    `⚔️ ${scorer} scored his first El Clásico goal.`

            });

        }

    }
    
if(
    String(lastMatch["Opp. Team"])
        .toLowerCase()
        .includes("real madrid")
){

    const clasicoGoals =
        previousClasicoGoals +
        goalsInLastMatch;

    if(
        [5,10,15,20,25]
        .includes(clasicoGoals)
    ){

        insights.push({

            priority:170,

            text:
                `⚔️ ${scorer} reached ${clasicoGoals} El Clásico goals.`

        });

    }

}


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
    
let seasonGoals = 0;

allMatches.forEach(match => {

    if(
        normalizeSeason(match.Season) !==
        normalizeSeason(lastMatch.Season)
    ){
        return;
    }

    if(
        Number(match.ID) >=
        Number(lastMatch.ID)
    ){
        return;
    }

    for(let j=1;j<=12;j++){

        if(
            match[`Goal Player ${j}`] === scorer
        ){
            seasonGoals++;
        }

    }

});

if(seasonGoals === 0){

    insights.push({

        priority:115,

        text:
            `⚽ ${scorer} scored his first goal of the ${lastMatch.Season} season.`

    });

}

let matchesWithoutGoal = 0;

const previousMatches = allMatches

    .filter(match =>
        Number(match.ID) <
        Number(lastMatch.ID)
    )

    .sort(
        (a,b) =>
        Number(b.ID) - Number(a.ID)
    );

for(const match of previousMatches){

    let scored = false;

    for(let j=1;j<=12;j++){

        if(
            match[`Goal Player ${j}`] === scorer
        ){
            scored = true;
            break;
        }

    }

    if(scored){
        break;
    }

    matchesWithoutGoal++;

}

if(matchesWithoutGoal >= 10){

    insights.push({

        priority:125,

        text:
            `⚽ ${scorer} ended a ${matchesWithoutGoal}-match scoring drought.`

    });

}
    
// Multi-goal milestone

if(
    goalsInLastMatch >= 2 &&
    String(lastMatch["Opp. Team"])
        .toLowerCase()
        .includes("real madrid")
){

    let previousClasicoBrace = false;

    allMatches.forEach(match => {

        if(
            Number(match.ID) >=
            Number(lastMatch.ID)
        ){
            return;
        }

        if(
            !String(match["Opp. Team"])
                .toLowerCase()
                .includes("real madrid")
        ){
            return;
        }

        let goals = 0;

        for(let j=1;j<=12;j++){

            if(
                match[`Goal Player ${j}`] === scorer
            ){
                goals++;
            }

        }

        if(goals >= 2){

            previousClasicoBrace = true;

        }

    });

    if(!previousClasicoBrace){

        insights.push({

            priority:185,

            text:
                `⚔️ ${scorer} recorded his first multi-goal El Clásico performance.`

        });

    }

}

if(
    goalsInLastMatch >= 3 &&
    String(lastMatch["Opp. Team"])
        .toLowerCase()
        .includes("real madrid")
){

    insights.push({

        priority:190,

        text:
            `🎩 ${scorer} scored a hat-trick in El Clásico.`

    });

}

let clasicosWithoutGoal = 0;

const clasicos = allMatches

    .filter(match =>
        String(match["Opp. Team"])
            .toLowerCase()
            .includes("real madrid")
    )

    .sort(
        (a,b) =>
        Number(b.ID) - Number(a.ID)
    );

for(const match of clasicos){

    if(
        Number(match.ID) >=
        Number(lastMatch.ID)
    ){
        continue;
    }

    let scored = false;

    for(let j=1;j<=12;j++){

        if(
            match[`Goal Player ${j}`] === scorer
        ){

            scored = true;
            break;

        }

    }

    if(scored){
        break;
    }

    clasicosWithoutGoal++;

}

if(clasicosWithoutGoal >= 5){

    insights.push({

        priority:175,

        text:
            `⚔️ ${scorer} ended a ${clasicosWithoutGoal}-match El Clásico scoring drought.`

    });

}

for(let i=1;i<=12;i++){

    if(
        lastMatch[`Goal Player ${i}`] === scorer
    ){
        goalsInLastMatch++;
    }

}

if(goalsInLastMatch >= 2){

    let previousDate = null;

    const previousMatches = allMatches

        .filter(match =>

            Number(match.ID) <
            Number(lastMatch.ID) &&

            normalizeSeason(match.Season) ===
            normalizeSeason(lastMatch.Season)

        )

        .sort(
            (a,b) =>
            Number(b.ID) - Number(a.ID)
        );

    for(const match of previousMatches){

        let goalsInMatch = 0;

        for(let j=1;j<=12;j++){

            if(
                match[`Goal Player ${j}`] === scorer
            ){
                goalsInMatch++;
            }

        }

        if(
            goalsInMatch >=
            goalsInLastMatch
        ){

            previousDate =
                match.Date;

            break;

        }

    }

    // Brace

    if(goalsInLastMatch === 2){

        insights.push({

            priority:110,

            text:
                previousDate
                ? `⚽ ${scorer} scored a brace. His previous brace or better this season came on ${previousDate}.`
                : `⚽ ${scorer} recorded his first brace of the season.`

        });

    }

    // Hat-trick

    else if(goalsInLastMatch === 3){

        insights.push({

            priority:130,

            text:
                previousDate
                ? `🎩 ${scorer} scored a hat-trick. His previous hat-trick or better this season came on ${previousDate}.`
                : `🎩 ${scorer} scored his first hat-trick of the season.`

        });

    }

    // Poker

    else if(goalsInLastMatch === 4){

        insights.push({

            priority:150,

            text:
                previousDate
                ? `🔥 ${scorer} scored four goals. The last time he scored four or more goals this season was on ${previousDate}.`
                : `🔥 ${scorer} scored four goals in a match for the first time this season.`

        });

    }

    // 5+

    else{

        insights.push({

            priority:200,

            text:
                previousDate
                ? `🚀 ${scorer} scored ${goalsInLastMatch} goals in a single match. His previous game with at least ${goalsInLastMatch} goals this season was on ${previousDate}.`
                : `🚀 ${scorer} scored ${goalsInLastMatch} goals in one match for the first time this season.`

        });

    }

}

});

starters.forEach(player => {

    const appearances =
        countAppearancesUntilMatch(
            player,
            Number(lastMatch.ID)
        );

    if(
        [50,100,150,200,250,300]
        .includes(appearances)
    ){

        insights.push({

            priority:120,

            text:
                `🎉 ${player} reached ${appearances} appearances for FC Barcelona.`

        });

    }

});

const rankingBefore =
    buildAppearanceRanking(
        Number(lastMatch.ID) - 1
    );

const rankingAfter =
    buildAppearanceRanking(
        Number(lastMatch.ID)
    );

starters.forEach(player => {

    const beforePos =
        rankingBefore.findIndex(
            p => p.name === player
        );

    const afterPos =
        rankingAfter.findIndex(
            p => p.name === player
        );

    if(
        beforePos > -1 &&
        afterPos > -1 &&
        afterPos < beforePos
    ){

        const overtaken =
            rankingBefore[beforePos - 1];

        if(overtaken){

            insights.push({

                priority:130,

                text:
                    `📈 ${player} overtook ${overtaken.name} in Barcelona appearances.`

            });

        }

    }

});

const uniqueInsights = [];
const seen = new Set();

insights.forEach(item => {

    if(seen.has(item.text)){
        return;
    }

    seen.add(item.text);

    uniqueInsights.push(item);

});

return uniqueInsights;

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