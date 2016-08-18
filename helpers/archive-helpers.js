var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(func) {
  fs.readFile(exports.paths.list, function(error, data) {
    var array = [];
    var stringData = '' + data;
    array = stringData.split('\n');
    func(array);
    return array;
  });
};

exports.isUrlInList = function(string, func) {
  fs.readFile(exports.paths.list, function(error, data) {
    var array = [];
    var stringData = '' + data;
    array = stringData.split('\n');
    if (array.indexOf(string) !== -1) {
      func(true);
    } else {
      func(false);
    }
  });
//   var array = exports.readListOfUrls(function() {});
//   console.log(array);
//   if (array.indexOf(string) !== -1) {
//     func(true);
//   } else {
//     func(false);
//   }
};

exports.addUrlToList = function(string, func) {
  fs.appendFile(exports.paths.list, string + '\n', function(error) {
    func();
  });
};

exports.isUrlArchived = function(string, func) {
  fs.exists(exports.paths.archivedSites + '/' + string, function(exists) {
    func(exists);
  });
};

exports.downloadUrls = function(array) {

  array.forEach(function(item) {

    http.get({
      host: item
    }, function(response) {
      var body = '';
      response.on('data', function(data) {
        body += data;

      });
      response.on('end', function() {

        console.log(new Date, ' Page saved to:', exports.paths.archivedSites + '/' + item);
        fs.writeFile(exports.paths.archivedSites + '/' + item, body, function(error) {});
      });
    });
  });
      


};
