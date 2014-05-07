/**
 * Module dependencies.
 */
var _ = require('lodash'),
  S = require('string'),
  path = require('path'),
  fs = require('graceful-fs'),
  mkdirp = require('mkdirp'),
  async = require('async'),
  classifier = require('movie-script-classifier');

// Process command line arguments
var argv = require('minimist')(process.argv.slice(2));

// Train on movie scripts
classifier.trainBatch('Scripts/Action', 'Action');
classifier.trainBatch('Scripts/Comedy', 'Comedy');
classifier.trainBatch('Scripts/Drama', 'Drama');
classifier.trainBatch('Scripts/Horror', 'Horror');
classifier.trainBatch('Scripts/Musical', 'Musical');

// Classify a script
console.log('Classified as: ' + classifier.classify('tests/300.txt')); // Outputs 'Calssified as: Action [45% Action, 30% Drama, 22% Romance]'