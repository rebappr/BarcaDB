const fs = require("fs");

const CLUB_MAP = {
"FC Barcelona":"FC Barcelona",
"Real Madrid CF":"Real Madrid",
"Club Atlético de Madrid":"Atlético Madrid",
"Athletic Club":"Athletic Club",
"Real Betis Balompié":"Real Betis",
"Real Sociedad de Fútbol":"Real Sociedad",
"Villarreal CF":"Villarreal",
"Valencia CF":"Valencia",
"Sevilla FC":"Sevilla",
"Getafe CF":"Getafe",
"Rayo Vallecano de Madrid":"Rayo Vallecano",
"CA Osasuna":"Osasuna",
"RC Celta de Vigo":"Celta de Vigo",
"RCD Espanyol de Barcelona":"Espanyol",
"Deportivo Alavés":"Deportivo Alavés",
"Levante UD":"Levante",
"Elche CF":"Elche",
"RC Deportivo La Coruña":"Deportivo La Coruña",
"Málaga CF":"Málaga",
"Real Racing Club de Santander":"Racing Santander",
"Girona FC":"Girona",
"CD Leganés":"Leganés",
"RCD Mallorca":"Mallorca",
"UD Las Palmas":"Las Palmas",
"Real Valladolid CF":"Valladolid",
"Real Oviedo":"Real Oviedo",
"Real Zaragoza":"Real Zaragoza",
"Feyenoord Rotterdam":"Feyenoord Rotterdam",
"Galatasaray SK":"Galatasaray",
"Paris Saint-Germain FC":"PSG",
"Aston Villa FC":"Aston Villa",
"Sabah FK":"Sabah",
"Manchester City FC":"Manchester City",
"Sporting Clube de Portugal":"Sporting CP",
"Como 1907":"Como 1907"
};

const COMPETITION_MAP = {
"Primera Division":"La Liga",
"UEFA Champions League":"UEFA Champions League",
"Copa del Rey":"Copa del Rey",
"Super Cup":"Supercopa de España",
"FIFA Club World Cup":"Club World Cup"
};

function formatDate(dateStr){
const d = new Date(dateStr);
return d.getDate() + "." + (d.getMonth()+1) + "." + d.getFullYear();
}

async function run(){

const response = await fetch(
"https://api.football-data.org/v4/teams/81/matches?limit=200",
{
headers:{
"X-Auth-Token":process.env.API_KEY
}
}
);

if(!response.ok){
throw new Error("API returned " + response.status);
}

const data = await response.json();

const currentSeason =
new Date().getMonth() >= 6
? new Date().getFullYear() + "/" + String(new Date().getFullYear()+1).slice(2)
: (new Date().getFullYear()-1) + "/" + String(new Date().getFullYear()).slice(2);

const matches = data.matches
.filter(match => {
const startYear = new Date(match.season.startDate).getFullYear();
const endYear = new Date(match.season.endDate).getFullYear();
return startYear + "/" + String(endYear).slice(2) === currentSeason;
})
.map(match => {

const home = CLUB_MAP[match.homeTeam.name] || match.homeTeam.name;
const away = CLUB_MAP[match.awayTeam.name] || match.awayTeam.name;
      const isHome = home === "FC Barcelona";
      const isHome = home === "FC Barcelona";
const opponent = isHome ? away : home;

let result = "-:-";

if(
match.status === "FINISHED" &&
match.score &&
match.score.fullTime
){
result =
match.score.fullTime.home +
":" +
match.score.fullTime.away;
}

return {
ApiId: String(match.id),
Date: formatDate(match.utcDate),
Competition:
COMPETITION_MAP[match.competition.name] ||
match.competition.name,
"Opp. Team": opponent,
"Home/Away": isHome ? "Home" : "Away",
Result: result
};
});

fs.writeFileSync(
"current-season.json",
JSON.stringify(matches,null,2)
);

console.log(
"Saved " +
matches.length +
" matches for " +
currentSeason
);

}

run().catch(err => {
console.error(err);
process.exit(1);
});
