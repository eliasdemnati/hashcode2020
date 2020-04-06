const fs = require('fs');
const file = fs.readFileSync('input/c_incunabula.txt', 'utf-8');
const lines = file.split('\n');

// Properties /////
const gameProperties = lines[0].split(' ');

const nbBooks = gameProperties[0];
const nbLibrairies = gameProperties[1];
const daysToScan = gameProperties[2];

const bookScoresData = lines[1].split(' ').map(i => Number(i));

const bookScores = bookScoresData.map((i) => {
  return { score: i, seen: false, };
});

const librairies = [];
let savedBooks = [];

const librairiesSorted = [];

// Librairies /////
console.log('=> Parsing library data');
for (let i = 2; i < lines.length - 2; i += 2) {
  const libraryData = lines[i].split(' ');
  const libraryBooks = lines[i + 1].split(' ').map(i => Number(i)).sort((a, b) => bookScores[b].score - bookScores[a].score);
  const score = libraryBooks.reduce((acc, value) => acc + bookScores[value], 0);
  librairies.push({
    id: (i / 2 - 1),
    nbBooks: libraryData[0],
    signUpProcess: Number(libraryData[1]),
    bookPerDays: Number(libraryData[2]),
    libraryBooks,
    score,
    elo: score / (Math.round(libraryBooks.length / Number(libraryData[2])) + Number(libraryData[1])),
  });
}

console.log('=> Sorting library by score');
librairies.sort((a, b) => b.elo - a.elo);

console.log('=> Taking first library');
librairiesSorted.push(librairies.pop(0));
librairiesSorted[0].libraryBooks.forEach((book) => {
  bookScores[book].seen = true;
});

console.log('=> Sort librairies');
let currentLibrary = {};

while (librairies.length > 0 || savedBooks.length >= nbBooks) {
  librairies.map(lib => {
    lib.libraryBooks = lib.libraryBooks.filter((book) => !bookScores[book].seen);
    lib.score = lib.libraryBooks.reduce((acc, value) => acc + bookScores[value].score, 0);
    lib.elo = lib.score / (Math.round(lib.libraryBooks.length / lib.bookPerDays) + lib.signUpProcess);
  });
  librairies.sort((librairyA, librairyB) => librairyB.elo - librairyA.elo);
  currentLibrary = librairies.pop(0);
  currentLibrary.libraryBooks.forEach((book) => {
    bookScores[book].seen = true;
  });
  librairiesSorted.push(currentLibrary);
  console.log(`${librairies.length / nbLibrairies * 100}%`);
}

console.log('=> Done sorting, writing data');

// Write file /////
let output = "";

output += `${librairiesSorted.length}\n`;

for (let lib of librairiesSorted) {
  output += `${lib.id} ${lib.libraryBooks.length}\n`;
  output += `${lib.libraryBooks.join(' ')}\n`;
}

fs.writeFileSync('./output.txt', output, 'utf-8');

console.log('=> Done !');
