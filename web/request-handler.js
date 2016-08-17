var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var headers = httpHelpers.headers;
var fs = require('fs');
var mime = require('mime');

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri (str) {
  var o = parseUri.options,
    m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
    uri = {},
    i   = 14;

  while (i--) uri[o.key[i]] = m[i] || '';

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: ['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'],
  q:   {
    name:   'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

// require more modules/folders here!

// var actions = {
//   'OPTIONS': function() {
    // res.writeHead(200, headers);
    // res.end();
//   },
//   'GET': function() {
    
//   },
//   'POST': function() {
    
//   },
// };

exports.handleRequest = function (req, res) {
  // res.end(archive.paths.list);
  var currentPath = req.url;
  var fullPath = '127.0.0.1:8080' + req.url;
  var parsedUri = parseUri(fullPath);
  // console.log(parsedUri.path);
  // console.log(req.headers.referer);
  if ( req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else if ( req.method === 'GET') {

    if (req.url === '/' || req.url === '/index.html' || req.headers.referer === 'http://127.0.0.1:8080/' ) {
      if (req.url === '/' || req.url === '/index.html') {
        currentPath = '/index.html';
      }
      var mimetype = mime.lookup(currentPath);
      fs.exists(archive.paths.siteAssets + currentPath, function(exists) {
        if (exists) {
          fs.readFile(archive.paths.siteAssets + currentPath, function(error, data) {
            headers['Content-Type'] = mimetype;
            res.writeHead(200, headers);
            res.end(data);
          });
        } else {
          res.writeHead(404, headers);
          res.end('404 not found');
        }
      });
    } else if (parsedUri.path !== '/') {
      fs.exists(archive.paths.archivedSites + parsedUri.path, function(exists) {
        if (exists) {
          fs.readFile(archive.paths.archivedSites + parsedUri.path, function(error, data) {
            headers['Content-Type'] = 'html/text';
            res.writeHead(200, headers);
            res.end('' + data);
          }); 
        } else {
          res.writeHead(404, headers);
          res.end('404 not found');
        }
      }); //fs.exists
    }

  } else if ( req.method === 'POST') {
    var requestBody = '';
    req.on('data', function(data) {
      requestBody += data;
      requestBody = requestBody.slice(4);
      console.log(requestBody);
    });

    // fs.appendFile('sites.txt', 'data to append', function(err) {});

  } else {

  }
};
