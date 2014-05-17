/**
 * Module dependencies.
 */
var _ = require('lodash'),
  S = require('string'),
  path = require('path'),
  fs = require('graceful-fs'),
  mkdirp = require('mkdirp'),
  async = require('async');

// Process command line arguments
var argv = require('minimist')(process.argv.slice(2));

var ignore = [
  'time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world', 'life', 'hand',
  'part', 'child', 'eye', 'woman', 'place', 'work', 'week', 'case', 'point', 'government',
  'company', 'number', 'group', 'problem', 'fact',
  'be', 'have', 'do', 'say', 'get', 'make', 'go', 'known', 'take', 'see',
  'come', 'think', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work',
  'seem', 'feel', 'try', 'leave', 'call',
  'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old',
  'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important',
  'few', 'public', 'bad', 'same', 'able',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up',
  'about', 'into', 'over', 'after', 'beneath', 'under', 'above',
  'the', 'and', 'a', 'that', 'I', 'it', 'not', 'he', 'as', 'you',
  'this', 'but', 'his', 'they', 'her', 'she', 'or', 'an', 'will', 'my',
  'one', 'all', 'would', 'there', 'their' ];
  
var genreCounter = {
  "Action": 0,
  "Horror": 0,
  "Comedy": 0,
  "Drama": 0
};

var wordOccurences;

fs.readFile('/Users/markjackson/development/ai/Scripts/Drama/lord-of-war.txt', 'utf8', function (err, contents) {
  if (err) throw err;

  // Get object of word occurences
  wordOccurences = countWordOccurrences(ignore, contents);
  // Parse into pretty JSON
  // var json = JSON.stringify(wordOccurences, null, 2);
  // Save it
  // fs.writeFile('word_count.json', json, function (err) {
  //   if (err) console.log(err);
  //   else  console.log('JSON saved');
  });

  // Read in our dataset
fs.readFile('training_data/training_bayes_thresholds.json', 'utf8', function (err, data) {
    if (err) throw err;

    // Parse into JSON
    var json = JSON.parse(data);
    // Words json
    var words = json.words;
    for(var word in wordOccurences){
      if(words[word]){
        var highestGenre = 'Action';
        var genre = words[word];
        for(var count in genre){
          if(genre[count] > genre[highestGenre]){
            highestGenre = count;
          }
        }
        ++genreCounter[highestGenre];
      }
    }
    var picked = 'Action';
    for(var highest in genreCounter){
      if(genreCounter[highest] > genreCounter[picked]){
        picked = highest;
      }
    }
    console.log("Classified: " + picked);
    
});

// Take in a script, count word occurences
function countWordOccurrences (ignore, string) {
  var wordOccurences = {};

  // Tokenize string
  var tokens = string.match(/([A-Z])\w+/g);

  // Keep synchronous
  for (var i = 0; i < tokens.length; ++i) {
    var word = tokens[i];
    // Ignore words, using ugly _.filter to match case-insensitive
    if ((_.filter(ignore, function (token) { return token.toLowerCase() === word.toLowerCase(); })).length !== 0) continue;
    // Add word field if doesn't exist
    if(!wordOccurences[word]) wordOccurences[word] = 0;
    // Count
    wordOccurences[word] += 1;
  }

  return wordOccurences;
};
