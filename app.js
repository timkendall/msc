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

// Modify trainign data to include total words in each genre
fs.readFile('training_data/training_bayes_thresholds.json', function (err, contents) {
  if (err) throw err;

  // Parse training object
  var training = JSON.parse(contents);
  training.totals = {};

  var genres = [
      'Action', 'Comedy', 'Drama', 'Horror', 'Musical'
  ];

  // Add up words for each genre
  for (var genre in training.cats) {
     var total = 0;
     // Loop through words
     for (var word in training.words) {
        total += training.words[word][genre] || 0;
        // console.log('Word: ' +training.words[word][genre] );
     }
     // Add total of this genre to our training object
     training.totals[genre] = total;
  };

  var json = JSON.stringify(training, null, 2);
  fs.writeFile('./training_data/training.json', json, function (err) {
    if (err) console.log(err);
    else  console.log('JSON saved');
  });

  // console.log(training);

  var uniqueWordCount = 0;
  for(var key in training.words){
    ++uniqueWordCount;
  }

  console.log(uniqueWordCount);

  var logProb = {
    'Action': {},
    'Horror': {},
    'Musical': {},
    'Drama': {},
    'Comedy': {}
  };

  for(var word in training.words){
    for(var genre in training.words[word]){
      var numerator = training.words[word][genre] + 1;
      var denominator = training.totals[genre] + uniqueWordCount;
      var prob = Math.log(numerator/denominator);
      logProb[genre][word] = -1*prob;
    }
  }

  // console.log(logProb);

  // Count word occurences in a script
  fs.readFile('/Users/markjackson/development/ai/Scripts/Drama/high-fidelity.txt', 'utf8', function (err, contents) {
    if (err) throw err;

    // Get object of word occurences
    var wordOccurences = countWordOccurrences(ignore, contents);

    var finalGenreProb = {
      'Action': 0,
      'Horror': 0,
      'Musical': 0,
      'Drama': 0,
      'Comedy': 0
    };

    for(var word in wordOccurences){
      var wordCount = wordOccurences[word];
      if(training.words[word]){
        for(var genre in training.words[word]){
          finalGenreProb[genre] += logProb[genre][word];
        }
      }else{
        for(var key in finalGenreProb){
          ++finalGenreProb[key];
        }
      }
    }

    for(var prob in finalGenreProb){
      finalGenreProb[prob] *= 0.5;
    }

    var highest = finalGenreProb['Action'];
    var classifiedGenre = 'Action';
    for(var prob in finalGenreProb){
      if(finalGenreProb[prob] > highest){
        highest = finalGenreProb[prob];
        classifiedGenre = prob;
      }
    }

    console.log(finalGenreProb);
    console.log('Classified: ' + classifiedGenre);


  });
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


