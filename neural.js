/**
 * Module dependencies.
 */
var _ = require('lodash'),
  S = require('string'),
  path = require('path'),
  fs = require('graceful-fs'),
  mkdirp = require('mkdirp'),
  async = require('async'),
  brain = require('brain');

// Process command line arguments
var argv = require('minimist')(process.argv.slice(2));

// Setup neural net
var net = new brain.NeuralNetwork();

/*
 * TEST
 */


/*
fs.readFile('training_bayes_fixed.json', 'utf8', function (err, data) {
    if (err) throw err;

    // Parse into JSON
    var json = JSON.parse(data);
    // Plug into classifier
    bayes.fromJSON(json);

    // Run a test script through classifier
    fs.readFile('/Users/Me/Desktop/Scripts/Sci-Fi/abyss.txt', 'utf8', function (err, data) {
      if (err) throw err;

      var genre = bayes.classify(data);
      console.log('Classified in: ' + genre)
    });
});*/

// Gather training data and train
dive('/Users/Me/Desktop/Scripts/Musical', '.txt', trainScript, function (functions) {
  console.log('hey');
  exportTrainingData(classifier);
});

// Save our training data
function exportTrainingData (classifier) {
  var raw = net.toJSON();
  var outputFilename = 'training_neural.json';

  fs.writeFile(outputFilename, raw, function (err) {
    if (err) console.log(err);
    else  console.log("JSON saved to " + outputFilename);
  });
}

// Preform action on each file in a directory
function dive (directory, extension, action, callback) {

  // Make sure
  if (typeof action !== 'function') {
    action = function (error, file) {};
  }

  fs.readdir(directory, function (err, contents) {
    if (err) return;

    // Preform action on file
    async.each(contents, function (file, cb) {

      var filePath  = directory + '/' + file;
      var fileExtension = path.extname(file);

      fs.stat(filePath, function (err, stat) {
        // If the file is a directory
        if (stat && stat.isDirectory()) {
          // Dive into the directory
          dive(filePath, extension, action, callback);
        }
        else {
          // Do the action
          if (fileExtension === extension) action(null, filePath);

          // Tell async this function is done
          cb();
        }
      });

    }, function (err) {
        if (err) throw err;
        console.log('calling callback');
        callback();
    });
  });
}

function trainScript (error, file) {
  console.log('opening file');
  if (error) console.log(error);
  // Read file
  /*
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) return console.log('Error reading script: ' + error);

    // Use parent folder as genere
    var genre = path.basename(path.join(file, '../'));
    // Add script to training data
    bayes.train(data, genre);

    callback();
  });*/
  var genre = path.basename(path.join(file, '../'));
  var script = fs.readFileSync(file).toString();

  net.train([{input: script, output: genre}])
  console.log('Added');
}
