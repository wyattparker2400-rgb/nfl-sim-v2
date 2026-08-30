const playerDatabase = {

    "Arizona Cardinals": [
        { name: "Jacoby Brissett", position: "QB", rating: 82 },
        { name: "Carson Beck", position: "QB", rating: 68 },

        { name: "Jeremiyah Love", position: "RB", rating: 83 },
        { name: "Tyler Allgeier", position: "RB", rating: 81 },
        { name: "James Conner", position: "RB", rating: 80 },
        { name: "Trey Benson", position: "RB", rating: 77 },

        { name: "Michael Wilson", position: "WR", rating: 85 },
        { name: "Marvin Harrison Jr.", position: "WR", rating: 84 },
        { name: "Kendrick Bourne", position: "WR", rating: 77 },

        { name: "Trey McBride", position: "TE", rating: 97 },
        { name: "Elijah Higgins", position: "TE", rating: 68 },

        { name: "Chad Ryland", position: "K", rating: 75 },

        { name: "Arizona Cardinals Defense", position: "DEF", rating: 77 }
    ],

    "Atlanta Falcons": [
        { name: "Michael Penix Jr.", position: "QB", rating: 81 },
        { name: "Tua Tagovashit", position: "QB", rating: 67 },

        { name: "Bijan Robinson", position: "RB", rating: 99 },
        { name: "Brian Robinson Jr.", position: "RB", rating: 80 },

        { name: "Drake London", position: "WR", rating: 92 },
        { name: "Olamide Zaccheaus", position: "WR", rating: 76 },
        { name: "Zachariah Branch", position: "WR", rating: 75 },

        { name: "Kyle Pitts", position: "TE", rating: 87 },
        { name: "Charlie Woerner", position: "TE", rating: 65 },

        { name: "Nick Folk", position: "K", rating: 85 },

        { name: "Atlanta Falcons Defense", position: "DEF", rating: 81 }
    ],

    "Baltimore Ravens": [
        { name: "Lamar Jackson", position: "QB", rating: 96 },
        { name: "Tyler Huntley", position: "QB", rating: 70 },

        { name: "Derrick Henry", position: "RB", rating: 95 },
        { name: "Justice Hill", position: "RB", rating: 77 },
        { name: "Adam Randall", position: "RB", rating: 72 },

        { name: "Zay Flowers", position: "WR", rating: 88 },
        { name: "Rashod Bateman", position: "WR", rating: 81 },
        { name: "DeAndre Hopkins", position: "WR", rating: 80 },

        { name: "Mark Andrews", position: "TE", rating: 90 },

        { name: "Tyler Loop", position: "K", rating: 80 },

        { name: "Baltimore Ravens Defense", position: "DEF", rating: 87 }
    ],

    "Buffalo Bills": [
        { name: "Josh Allen", position: "QB", rating: 99 },

        { name: "James Cook III", position: "RB", rating: 94 },
        { name: "Ray Davis", position: "RB", rating: 75 },
        { name: "Ty Johnson", position: "RB", rating: 75 },

        { name: "DJ Moore", position: "WR", rating: 87 },
        { name: "Khalil Shakir", position: "WR", rating: 85 },
        { name: "Josh Palmer", position: "WR", rating: 75 },
        { name: "Keon Coleman", position: "WR", rating: 75 },
        { name: "Mecole Hardman", position: "WR", rating: 73 },

        { name: "Dalton Kincaid", position: "TE", rating: 85 },
        { name: "Dawson Knox", position: "TE", rating: 76 },

        { name: "Tyler Bass", position: "K", rating: 78 },

        { name: "Buffalo Bills Defense", position: "DEF", rating: 83 }
    ],

    "Carolina Panthers": [
        { name: "Bryce Young", position: "QB", rating: 85 },
        { name: "Kenny Pickett", position: "QB", rating: 67 },

        { name: "Chuba Hubbard", position: "RB", rating: 84 },
        { name: "Jonathon Brooks", position: "RB", rating: 76 },
        { name: "Trevor Etienne", position: "RB", rating: 71 },

        { name: "Tetairoa McMillan", position: "WR", rating: 87 },
        { name: "Jalen Coker", position: "WR", rating: 76 },
        { name: "Xavier Legette", position: "WR", rating: 73 },
        { name: "Jimmy Horn Jr.", position: "WR", rating: 72 },

        { name: "Tommy Tremble", position: "TE", rating: 72 },
        { name: "Ja'Tavion Sanders", position: "TE", rating: 70 },
        { name: "Mitchell Evans", position: "TE", rating: 69 },

        { name: "Ryan Fitzgerald", position: "K", rating: 76 },

        { name: "Carolina Panthers Defense", position: "DEF", rating: 82 }
    ],

    "Chicago Bears": [
        { name: "Caleb Williams", position: "QB", rating: 90 },

        { name: "D'Andre Swift", position: "RB", rating: 88 },
        { name: "Kyle Monangai", position: "RB", rating: 78 },
        { name: "Roschon Johnson", position: "RB", rating: 71 },

        { name: "Rome Odunze", position: "WR", rating: 87 },
        { name: "Luther Burden III", position: "WR", rating: 86 },
        { name: "Kalif Raymond", position: "WR", rating: 75 },
        { name: "Zavion Thomas", position: "WR", rating: 72 },

        { name: "Colston Loveland", position: "TE", rating: 86 },
        { name: "Cole Kmet", position: "TE", rating: 78 },

        { name: "Cairo Santos", position: "K", rating: 80 },

        { name: "Chicago Bears Defense", position: "DEF", rating: 85 }
    ],

    "Cincinnati Bengals": [
        { name: "Joe Burrow", position: "QB", rating: 97 },
        { name: "Joe Flacco", position: "QB", rating: 73 },

        { name: "Chase Brown", position: "RB", rating: 87 },
        { name: "Samaje Perine", position: "RB", rating: 75 },

        { name: "Ja'Marr Chase", position: "WR", rating: 99 },
        { name: "Tee Higgins", position: "WR", rating: 88 },
        { name: "Andrei Iosivas", position: "WR", rating: 73 },
        { name: "Charlie Jones", position: "WR", rating: 70 },

        { name: "Mike Gesicki", position: "TE", rating: 81 },
        { name: "Drew Sample", position: "TE", rating: 68 },

        { name: "Evan McPherson", position: "K", rating: 81 },

        { name: "Cincinnati Bengals Defense", position: "DEF", rating: 77 }
    ],

    "Cleveland Browns": [
        { name: "Shedeur Sanders", position: "QB", rating: 72 },
        { name: "Deshaun Watson", position: "QB", rating: 69 },
        { name: "Dillon Gabriel", position: "QB", rating: 67 },
        { name: "Taylen Green", position: "QB", rating: 65 },

        { name: "Quinshon Judkins", position: "RB", rating: 86 },
        { name: "Dylan Sampson", position: "RB", rating: 75 },
        { name: "Raheim Sanders", position: "RB", rating: 69 },

        { name: "Jerry Jeudy", position: "WR", rating: 84 },
        { name: "KC Concepcion", position: "WR", rating: 78 },
        { name: "Cedric Tillman", position: "WR", rating: 74 },
        { name: "Denzel Boston", position: "WR", rating: 74 },
        { name: "Isaiah Bond", position: "WR", rating: 69 },

        { name: "Harold Fannin Jr.", position: "TE", rating: 85 },
        { name: "Joe Royer", position: "TE", rating: 66 },

        { name: "Andre Szmyt", position: "K", rating: 71 },

        { name: "Cleveland Browns Defense", position: "DEF", rating: 82 }
    ],

    "Dallas Cowboys": [
        { name: "Dak Prescott", position: "QB", rating: 95 },

        { name: "Javonte Williams", position: "RB", rating: 86 },
        { name: "Jaydon Blue", position: "RB", rating: 73 },

        { name: "CeeDee Lamb", position: "WR", rating: 93 },
        { name: "George Pickens", position: "WR", rating: 89 },
        { name: "KaVontae Turpin", position: "WR", rating: 76 },
        { name: "Ryan Flournoy", position: "WR", rating: 76 },

        { name: "Jake Ferguson", position: "TE", rating: 87 },
        { name: "Luke Schoonmaker", position: "TE", rating: 70 },

        { name: "Brandon Aubrey", position: "K", rating: 99 },

        { name: "Dallas Cowboys Defense", position: "DEF", rating: 86 }
    ],

    "Denver Broncos": [
        { name: "Bo Nix", position: "QB", rating: 90 },

        { name: "J.K. Dobbins", position: "RB", rating: 82 },
        { name: "RJ Harvey", position: "RB", rating: 80 },
        { name: "Jonah Coleman", position: "RB", rating: 73 },

        { name: "Courtland Sutton", position: "WR", rating: 87 },
        { name: "Jaylen Waddle", position: "WR", rating: 86 },
        { name: "Troy Franklin", position: "WR", rating: 79 },
        { name: "Marvin Mims Jr.", position: "WR", rating: 78 },
        { name: "Pat Bryant", position: "WR", rating: 74 },

        { name: "Evan Engram", position: "TE", rating: 78 },
        { name: "Adam Trautman", position: "TE", rating: 69 },

        { name: "Wil Lutz", position: "K", rating: 78 },

        { name: "Denver Broncos Defense", position: "DEF", rating: 87 }
    ],

    "Detroit Lions": [
        { name: "Jared Goff", position: "QB", rating: 96 },

        { name: "Jahmyr Gibbs", position: "RB", rating: 98 },
        { name: "Isiah Pacheco", position: "RB", rating: 76 },

        { name: "Amon-Ra St. Brown", position: "WR", rating: 95 },
        { name: "Jameson Williams", position: "WR", rating: 85 },
        { name: "Isaac TeSlaa", position: "WR", rating: 73 },

        { name: "Sam LaPorta", position: "TE", rating: 88 },
        { name: "Tyler Conklin", position: "TE", rating: 72 },

        { name: "Jake Bates", position: "K", rating: 76 },

        { name: "Detroit Lions Defense", position: "DEF", rating: 83 }
    ],

    "Green Bay Packers": [
        { name: "Jordan Love", position: "QB", rating: 86 },
        { name: "Tyrod Taylor", position: "QB", rating: 69 },

        { name: "Josh Jacobs", position: "RB", rating: 91 },
        { name: "MarShawn Lloyd", position: "RB", rating: 72 },
        { name: "Damien Martinez", position: "RB", rating: 70 },

        { name: "Jayden Reed", position: "WR", rating: 84 },
        { name: "Christian Watson", position: "WR", rating: 82 },
        { name: "Matthew Golden", position: "WR", rating: 80 },
        { name: "Dontayvion Wicks", position: "WR", rating: 75 },
        { name: "Savion Williams", position: "WR", rating: 70 },

        { name: "Tucker Kraft", position: "TE", rating: 88 },
        { name: "Luke Musgrave", position: "TE", rating: 70 },

        { name: "Trey Smack", position: "K", rating: 75 },

        { name: "Green Bay Packers Defense", position: "DEF", rating: 87 }
    ],

    "Houston Texans": [
        { name: "C.J. Stroud", position: "QB", rating: 85 },

        { name: "David Montgomery", position: "RB", rating: 85 },
        { name: "Woody Marks", position: "RB", rating: 80 },

        { name: "Nico Collins", position: "WR", rating: 90 },
        { name: "Tank Dell", position: "WR", rating: 79 },
        { name: "Jayden Higgins", position: "WR", rating: 76 },
        { name: "Jaylin Noel", position: "WR", rating: 74 },

        { name: "Dalton Schultz", position: "TE", rating: 84 },
        { name: "Cade Stover", position: "TE", rating: 70 },

        { name: "Ka'imi Fairbairn", position: "K", rating: 81 },

        { name: "Houston Texans Defense", position: "DEF", rating: 91 }
    ],

    "Indianapolis Colts": [
        { name: "Daniel Jones", position: "QB", rating: 85 },
        { name: "Anthony Richardson", position: "QB", rating: 70 },

        { name: "Jonathan Taylor", position: "RB", rating: 96 },
        { name: "DJ Giddens", position: "RB", rating: 70 },

        { name: "Alec Pierce", position: "WR", rating: 84 },
        { name: "Josh Downs", position: "WR", rating: 80 },
        { name: "Anthony Gould", position: "WR", rating: 68 },

        { name: "Tyler Warren", position: "TE", rating: 83 },

        { name: "Spencer Shrader", position: "K", rating: 72 },

        { name: "Indianapolis Colts Defense", position: "DEF", rating: 79 }
    ],

    "Jacksonville Jaguars": [
        { name: "Trevor Lawrence", position: "QB", rating: 84 },

        { name: "Bhayshul Tuten", position: "RB", rating: 81 },

        { name: "Jakobi Meyers", position: "WR", rating: 84 },
        { name: "Brian Thomas Jr.", position: "WR", rating: 83 },
        { name: "Parker Washington", position: "WR", rating: 83 },
        { name: "Travis Hunter", position: "WR", rating: 83 },
        { name: "Dyami Brown", position: "WR", rating: 74 },

        { name: "Brenton Strange", position: "TE", rating: 77 },

        { name: "Cam Little", position: "K", rating: 85 },

        { name: "Jacksonville Jaguars Defense", position: "DEF", rating: 84 }
    ],

    "Kansas City Chiefs": [
        { name: "Patrick Mahomes", position: "QB", rating: 98 },

        { name: "Kenneth Walker III", position: "RB", rating: 90 },
        { name: "Brashard Smith", position: "RB", rating: 73 },

        { name: "Rashee Rice", position: "WR", rating: 88 },
        { name: "Xavier Worthy", position: "WR", rating: 83 },
        { name: "Tyquan Thornton", position: "WR", rating: 75 },
        { name: "Jalen Royals", position: "WR", rating: 71 },

        { name: "Travis Kelce", position: "TE", rating: 91 },
        { name: "Noah Gray", position: "TE", rating: 73 },

        { name: "Harrison Butker", position: "K", rating: 81 },

        { name: "Kansas City Chiefs Defense", position: "DEF", rating: 83 }
    ],

    "Las Vegas Raiders": [
        { name: "Fernando Mendoza", position: "QB", rating: 74 },
        { name: "Kirk Cousins", position: "QB", rating: 73 },

        { name: "Ashton Jeanty", position: "RB", rating: 85 },
        { name: "Raheem Mostert", position: "RB", rating: 74 },

        { name: "Tre Tucker", position: "WR", rating: 78 },
        { name: "Jalen Nailor", position: "WR", rating: 77 },
        { name: "Jack Bech", position: "WR", rating: 72 },

        { name: "Brock Bowers", position: "TE", rating: 93 },
        { name: "Michael Mayer", position: "TE", rating: 72 },

        { name: "Matt Gay", position: "K", rating: 75 },

        { name: "Las Vegas Raiders Defense", position: "DEF", rating: 77 }
    ],

    "Los Angeles Chargers": [
        { name: "Justin Herbert", position: "QB", rating: 90 },

        { name: "Omarion Hampton", position: "RB", rating: 87 },
        { name: "Kimani Vidal", position: "RB", rating: 77 },
        { name: "Keaton Mitchell", position: "RB", rating: 75 },

        { name: "Ladd McConkey", position: "WR", rating: 83 },
        { name: "Quentin Johnston", position: "WR", rating: 80 },
        { name: "Tre Harris", position: "WR", rating: 73 },

        { name: "David Njoku", position: "TE", rating: 80 },
        { name: "Oronde Gadsden II", position: "TE", rating: 74 },

        { name: "Cameron Dicker", position: "K", rating: 84 },

        { name: "Los Angeles Chargers Defense", position: "DEF", rating: 81 }
    ],

    "Los Angeles Rams": [
        { name: "Matthew Stafford", position: "QB", rating: 99 },

        { name: "Kyren Williams", position: "RB", rating: 89 },
        { name: "Blake Corum", position: "RB", rating: 78 },

        { name: "Puka Nacua", position: "WR", rating: 98 },
        { name: "Davante Adams", position: "WR", rating: 90 },
        { name: "Jordan Whittington", position: "WR", rating: 72 },

        { name: "Tyler Higbee", position: "TE", rating: 74 },
        { name: "Colby Parkinson", position: "TE", rating: 72 },

        { name: "Harrison Mevis", position: "K", rating: 76 },

        { name: "Los Angeles Rams Defense", position: "DEF", rating: 88 }
    ],

    "Miami Dolphins": [
        { name: "Malik Willis", position: "QB", rating: 80 },
        { name: "Quinn Ewers", position: "QB", rating: 63 },

        { name: "De'Von Achane", position: "RB", rating: 97 },
        { name: "Ollie Gordon II", position: "RB", rating: 73 },

        { name: "Tutu Atwell", position: "WR", rating: 75 },
        { name: "Jalen Tolbert", position: "WR", rating: 74 },
        { name: "Caleb Douglas", position: "WR", rating: 71 },

        { name: "Greg Dulcich", position: "TE", rating: 70 },
        { name: "Will Kacmarek", position: "TE", rating: 65 },

        { name: "Zane Gonzalez", position: "K", rating: 74 },

        { name: "Miami Dolphins Defense", position: "DEF", rating: 72 }
    ],

    "Minnesota Vikings": [
        { name: "Kyler Murray", position: "QB", rating: 81 },
        { name: "J.J. McCarthy", position: "QB", rating: 71 },

        { name: "Jordan Mason", position: "RB", rating: 81 },
        { name: "Aaron Jones", position: "RB", rating: 80 },
        { name: "Zavier Scott", position: "RB", rating: 70 },

        { name: "Justin Jefferson", position: "WR", rating: 98 },
        { name: "Jordan Addison", position: "WR", rating: 84 },
        { name: "Jauan Jennings", position: "WR", rating: 81 },
        { name: "Tai Felton", position: "WR", rating: 71 },

        { name: "T.J. Hockenson", position: "TE", rating: 83 },
        { name: "Josh Oliver", position: "TE", rating: 73 },

        { name: "Will Reichard", position: "K", rating: 82 },

        { name: "Minnesota Vikings Defense", position: "DEF", rating: 79 }
    ],

    "New England Patriots": [
        { name: "Drake Maye", position: "QB", rating: 92 },

        { name: "TreVeyon Henderson", position: "RB", rating: 85 },
        { name: "Rhamondre Stevenson", position: "RB", rating: 76 },

        { name: "A.J. Brown", position: "WR", rating: 89 },
        { name: "Kayshon Boutte", position: "WR", rating: 80 },
        { name: "Romeo Doubs", position: "WR", rating: 79 },
        { name: "Demario Douglas", position: "WR", rating: 74 },
        { name: "Kyle Williams", position: "WR", rating: 72 },

        { name: "Hunter Henry", position: "TE", rating: 86 },

        { name: "Andres Borregales", position: "K", rating: 72 },

        { name: "New England Patriots Defense", position: "DEF", rating: 86 }
    ],

    "New Orleans Saints": [
        { name: "Tyler Shough", position: "QB", rating: 77 },
        { name: "Spencer Rattler", position: "QB", rating: 71 },

        { name: "Travis Etienne Jr.", position: "RB", rating: 87 },
        { name: "Alvin Kamara", position: "RB", rating: 79 },
        { name: "Kendre Miller", position: "RB", rating: 76 },
        { name: "Devin Neal", position: "RB", rating: 72 },

        { name: "Chris Olave", position: "WR", rating: 91 },
        { name: "Jordyn Tyson", position: "WR", rating: 76 },
        { name: "Devaughn Vele", position: "WR", rating: 74 },
        { name: "Ja'Lynn Polk", position: "WR", rating: 73 },
        { name: "Trey Palmer", position: "WR", rating: 71 },

        { name: "Juwan Johnson", position: "TE", rating: 79 },
        { name: "Noah Fant", position: "TE", rating: 73 },

        { name: "Charlie Smyth", position: "K", rating: 77 },

        { name: "New Orleans Saints Defense", position: "DEF", rating: 75 }
    ],

    "New York Giants": [
        { name: "Jaxson Dart", position: "QB", rating: 82 },
        { name: "Russell Wilson", position: "QB", rating: 74 },

        { name: "Cam Skattebo", position: "RB", rating: 81 },
        { name: "Tyrone Tracy Jr.", position: "RB", rating: 79 },

        { name: "Malik Nabers", position: "WR", rating: 88 },
        { name: "Darius Slayton", position: "WR", rating: 78 },
        { name: "Malachi Fields", position: "WR", rating: 71 },

        { name: "Isaiah Likely", position: "TE", rating: 82 },
        { name: "Theo Johnson", position: "TE", rating: 74 },
        { name: "Daniel Bellinger", position: "TE", rating: 71 },

        { name: "Graham Gano", position: "K", rating: 75 },

        { name: "New York Giants Defense", position: "DEF", rating: 79 }
    ],

    "New York Jets": [
        { name: "Geno Smith", position: "QB", rating: 76 },

        { name: "Breece Hall", position: "RB", rating: 87 },
        { name: "Braelon Allen", position: "RB", rating: 73 },
        { name: "Isaiah Davis", position: "RB", rating: 70 },

        { name: "Garrett Wilson", position: "WR", rating: 86 },
        { name: "Tim Patrick", position: "WR", rating: 76 },
        { name: "Adonai Mitchell", position: "WR", rating: 75 },
        { name: "Omar Cooper Jr.", position: "WR", rating: 75 },

        { name: "Kenyon Sadiq", position: "TE", rating: 74 },
        { name: "Mason Taylor", position: "TE", rating: 74 },

        { name: "Jason Sanders", position: "K", rating: 77 },

        { name: "New York Jets Defense", position: "DEF", rating: 79 }
    ],

    "Philadelphia Eagles": [
        { name: "Jalen Hurts", position: "QB", rating: 82 },

        { name: "Saquon Barkley", position: "RB", rating: 92 },
        { name: "Tank Bigsby", position: "RB", rating: 77 },
        { name: "Will Shipley", position: "RB", rating: 72 },

        { name: "DeVonta Smith", position: "WR", rating: 92 },
        { name: "Marquise Brown", position: "WR", rating: 78 },
        { name: "Jahan Dotson", position: "WR", rating: 74 },

        { name: "Dallas Goedert", position: "TE", rating: 89 },
        { name: "Grant Calcaterra", position: "TE", rating: 70 },

        { name: "Jake Elliott", position: "K", rating: 79 },

        { name: "Philadelphia Eagles Defense", position: "DEF", rating: 87 }
    ],

    "Pittsburgh Steelers": [
        { name: "Aaron Rodgers", position: "QB", rating: 76 },
        { name: "Mason Rudolph", position: "QB", rating: 68 },

        { name: "Rico Dowdle", position: "RB", rating: 84 },
        { name: "Jaylen Warren", position: "RB", rating: 83 },
        { name: "Caleb Johnson", position: "RB", rating: 70 },

        { name: "D.K. Metcalf", position: "WR", rating: 85 },
        { name: "Michael Pittman Jr.", position: "WR", rating: 83 },
        { name: "Calvin Austin III", position: "WR", rating: 73 },

        { name: "Pat Freiermuth", position: "TE", rating: 83 },
        { name: "Jonnu Smith", position: "TE", rating: 78 },
        { name: "Darnell Washington", position: "TE", rating: 75 },

        { name: "Chris Boswell", position: "K", rating: 86 },

        { name: "Pittsburgh Steelers Defense", position: "DEF", rating: 86 }
    ],

    "San Francisco 49ers": [
        { name: "Brock Purdy", position: "QB", rating: 85 },

        { name: "Christian McCaffrey", position: "RB", rating: 97 },
        { name: "Isaac Guerendo", position: "RB", rating: 74 },

        { name: "Mike Evans", position: "WR", rating: 91 },
        { name: "Ricky Pearsall", position: "WR", rating: 80 },
        { name: "Christian Kirk", position: "WR", rating: 78 },
        { name: "Brandon Aiyuk", position: "WR", rating: 77 },
        { name: "Demarcus Robinson", position: "WR", rating: 76 },

        { name: "George Kittle", position: "TE", rating: 96 },
        { name: "Jake Tonges", position: "TE", rating: 69 },

        { name: "Eddy Pineiro", position: "K", rating: 77 },

        { name: "San Francisco 49ers Defense", position: "DEF", rating: 85 }
    ],

    "Seattle Seahawks": [
        { name: "Sam Darnold", position: "QB", rating: 88 },

        { name: "Zach Charbonnet", position: "RB", rating: 83 },

        { name: "Jaxon Smith-Njigba", position: "WR", rating: 99 },
        { name: "Cooper Kupp", position: "WR", rating: 83 },
        { name: "Rashid Shaheed", position: "WR", rating: 79 },
        { name: "Jake Bobo", position: "WR", rating: 70 },

        { name: "AJ Barner", position: "TE", rating: 74 },

        { name: "Jason Myers", position: "K", rating: 84 },

        { name: "Seattle Seahawks Defense", position: "DEF", rating: 89 }
    ],

    "Tampa Bay Buccaneers": [
        { name: "Baker Mayfield", position: "QB", rating: 89 },

        { name: "Bucky Irving", position: "RB", rating: 86 },
        { name: "Kenneth Gainwell", position: "RB", rating: 79 },

        { name: "Chris Godwin", position: "WR", rating: 87 },
        { name: "Emeka Egbuka", position: "WR", rating: 85 },
        { name: "Jalen McMillan", position: "WR", rating: 75 },

        { name: "Cade Otton", position: "TE", rating: 80 },
        { name: "Payne Durham", position: "TE", rating: 68 },

        { name: "Chase McLaughlin", position: "K", rating: 78 },

        { name: "Tampa Bay Buccaneers Defense", position: "DEF", rating: 79 }
    ],

    "Tennessee Titans": [
        { name: "Cam Ward", position: "QB", rating: 79 },

        { name: "Tony Pollard", position: "RB", rating: 83 },
        { name: "Tyjae Spears", position: "RB", rating: 77 },

        { name: "Wan'Dale Robinson", position: "WR", rating: 84 },
        { name: "Calvin Ridley", position: "WR", rating: 78 },
        { name: "Carnell Tate", position: "WR", rating: 77 },
        { name: "Elic Ayomanor", position: "WR", rating: 77 },

        { name: "Gunnar Helm", position: "TE", rating: 70 },

        { name: "Joey Slye", position: "K", rating: 76 },

        { name: "Tennessee Titans Defense", position: "DEF", rating: 79 }
    ],

    "Washington Commanders": [
        { name: "Jayden Daniels", position: "QB", rating: 86 },
        { name: "Marcus Mariota", position: "QB", rating: 72 },

        { name: "Jacory Croskey-Merritt", position: "RB", rating: 79 },
        { name: "Rachaad White", position: "RB", rating: 78 },
        { name: "Jerome Ford", position: "RB", rating: 74 },
        { name: "Kaytron Allen", position: "RB", rating: 71 },

        { name: "Terry McLaurin", position: "WR", rating: 91 },
        { name: "Jaylin Lane", position: "WR", rating: 75 },
        { name: "Dyami Brown", position: "WR", rating: 74 },
        { name: "Antonio Williams", position: "WR", rating: 73 },
        { name: "Luke McCaffrey", position: "WR", rating: 72 },

        { name: "Chigoziem Okonkwo", position: "TE", rating: 76 },
        { name: "Ben Sinnott", position: "TE", rating: 69 },

        { name: "Jake Moody", position: "K", rating: 68 },

        { name: "Washington Commanders Defense", position: "DEF", rating: 77 }
    ]

};