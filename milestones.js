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
    
// Multi-goal milestone

let goalsInLastMatch = 0;

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