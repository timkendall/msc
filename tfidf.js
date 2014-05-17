/**
 * Module dependencies.
 */
var _ = require('lodash'),
  S = require('string'),
  path = require('path'),
  fs = require('graceful-fs'),
  mkdirp = require('mkdirp'),
  async = require('async'),
  natural = require('natural');

// Process command line arguments
var argv = require('minimist')(process.argv.slice(2));

var TfIdf = natural.TfIdf,
  tfidf = new TfIdf();


/*
 * TEST
 */

// Read in our dataset
/*
fs.readFile('training_logistic.json', 'utf8', function (err, data) {
    if (err) throw err;

    var restoredClassifier = natural.LogisticRegressionClassifier.restore(JSON.parse(data));

    fs.readFile('/Users/Me/Desktop/Scripts/Musical/les-miserables.txt', 'utf8', function (err, data) {
      if (err) throw err;

      console.log(restoredClassifier.classify(data));
    });

});*/

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
});
*/

// Gather training data and train


dive('/Users/Me/Desktop/Scripts/Musical', '.txt', trainScript, function (functions) {
  console.log('hey');

  // See how important some terms are in the Musical genre
  tfidf.tfidfs('hotel fishnets', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
  });

  // List terms by importance for first document
  var count = 0;
  tfidf.listTerms(2).forEach(function (item) {
    if (count < 20)
      console.log(item.term + ': ' + item.tfidf);

    ++count;
  });

});


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
  // Add to tfidf
  tfidf.addFileSync(file);
  console.log('Added');
}
