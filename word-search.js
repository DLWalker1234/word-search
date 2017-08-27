const { createReadStream } = require('fs');
const { Writable } = require('stream');
const { map, split } = require('event-stream');
const limitToTen = require('./limit-ten')();
// const limitToTen = LimitToTenFactory();


const userInput = process.argv[2] ? process.argv[2].toLowerCase() : null;
const writeStream = Writable();
const wordListStream = createReadStream("/laksjdf;lksajf;laskjdf");

writeStream._write = (word, _, next) => {
    const output = word || "No Matching Words Sir"
    process.stdout.write(output);
    next();
};

if (!userInput) {
    console.log('usage: ./word-search [search term]');
    process.exit();
};

wordListStream
    .pipe(split())
    .pipe(map((word, done) => {
        word.toString().toLowrCase().includes(userInput) ? done(null, word + "\n") : done()
    }))

.pipe(limitToTen)
    .pipe(writeStream);

wordListStream.on('end', function() {
    console.log("finished reading that honkin' doc");
});