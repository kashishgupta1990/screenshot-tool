var fs = require('fs');
var config = require('./config.json');
var path = require('path');
var async = require('async');
var phantom = require('phantom');
var tasks = [];

fs.readdir(config.xHtmlDirectoryPath,function(err,xhtml){
    if(err){
        console.log(err);
    }
    else{
        xhtml.forEach(function(fileName){
            if(fileName.match(/.xhtml/)) {
                tasks.push(function(callback){
                    var htmlFilePath = path.join(config.xHtmlDirectoryPath, fileName);
                    var screenshotPath = path.join(config.screenShotDirectoryPath, fileName);

                    phantom.create(function (ph) {
                        ph.createPage(function (page) {
                            page.open(htmlFilePath, function (status) {
                                console.log("opened page? ", status);
                                page.evaluate(function () { return document.title; }, function (result) {
                                    console.log('Page title is: ' + result);
                                    page.render(screenshotPath + '.png');
                                    ph.exit();
                                    callback(null,'done');
                                });
                            });
                        });
                    });
                });
            }
        });
        if(tasks.length!=0){
            async.series(tasks,function(err,result){
                if(err){
                    console.log(err);
                }else{
                    console.log('Operation Completed.');
                }
            })
        }
    }
});

