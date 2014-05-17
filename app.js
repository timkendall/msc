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

fs.readFile('/Users/Me/Desktop/Scripts/Drama/a-few-good-men.txt', 'utf8', function (err, contents) {
  if (err) throw err;

  // Get object of word occurences
  var wordOccurences = countWordOccurrences(ignore, contents);
  // Parse into pretty JSON
  var json = JSON.stringify(wordOccurences, null, 2);
  // Save it
  fs.writeFile('word_count.json', json, function (err) {
    if (err) console.log(err);
    else  console.log('JSON saved');
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
    // Ignore words
    if ((_.filter(ignore, function (token) { return token.toLowerCase() === word.toLowerCase(); })).length !== 0) continue;
    // Add count
    if(!wordOccurences[word]) wordOccurences[word] = 0;
    wordOccurences[word] += 1;
  }

  return wordOccurences;
};
