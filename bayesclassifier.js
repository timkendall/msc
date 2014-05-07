/**
 * Module dependencies.
 */
var _ = require('lodash'),
  S = require('string'),
  path = require('path'),
  fs = require('graceful-fs'),
  mkdirp = require('mkdirp'),
  classifier = require('classifier'),
  async = require('async');

// Process command line arguments
var argv = require('minimist')(process.argv.slice(2));

var bayes = new classifier.Bayesian({
  thresholds: {
    'Action': 4,
    'Horror': 1,
    'Musical': 1,
    'Drama': 4,
    'Comedy': 6,
    'Sci-Fi': 3,
    'Mystery': 1
  }
});


/*
 * TEST
 */

// Read in our dataset
fs.readFile('training_data/training_bayes_fixed.json', 'utf8', function (err, data) {
    if (err) throw err;

    // Parse into JSON
    var json = JSON.parse(data);
    // Plug into classifier
    bayes.fromJSON(json);

    // Run a test script through classifier
    fs.readFile('/Users/Me/Desktop/Scripts/Drama/a-few-good-men.txt', 'utf8', function (err, data) {
      if (err) throw err;

      var genre = bayes.classify(data);
      console.log('Classified in: ' + genre)
    });
});

/*
 * TRAIN
 */

// Gather training data and train
/*
dive('/Users/Me/Desktop/Scripts/', '.txt', trainScript, function (functions) {
  console.log('hey');
  exportTrainingData(bayes);
});
*/
// Save our training data
function exportTrainingData (classifier) {
  var json = classifier.toJSON();
  var outputFilename = 'training_data/training_bayes_thresholds.json';

  fs.writeFile(outputFilename, JSON.stringify(json, null, 2), function (err) {
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
  bayes.train(script, genre);
  console.log('Added');
}
