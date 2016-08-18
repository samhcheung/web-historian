// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

// Write a script in workers/htmlfetcher.js that uses the code in helpers/archive-helpers.js to download files when it runs (and then exit)

var archive = require('../helpers/archive-helpers');
var fs = require('fs');

var sitesToBeArchived = [];

archive.readListOfUrls( function (array) {
  sitesToBeArchived = array.slice();
  // fs.writeFile('../archives/sites.txt', '', function (err) {
  //   if (err) {
  //     console.log('Error writing to file:', err);
  //   }
  // });
  if (sitesToBeArchived[sitesToBeArchived.length - 1] === '') {
    sitesToBeArchived = sitesToBeArchived.slice(0, -1);
  }
  console.log(sitesToBeArchived);
  archive.downloadUrls(sitesToBeArchived);

  // for ( var i = 0; i < sitesToBeArchived.length; i++) {
  //   if (sitesToBeArchived[i].length > 0) {
  //     archive.isUrlArchived(sitesToBeArchived[i], function(exists) {
  //       if(!exists) {
  //         archive.downloadUrls()
  //       }
  //     });

  //   });
  // }
});
