var fs = require('fs');
var _ = require('lodash');
var config = require('./config.json');
var xmlInteractionIds = [];
var path = require('path');
var async = require('async');
var tasks = [];

fs.readdir(config.xmlDirectoryPath,function(error,xmlFiles){
    if(error){
       console.log(error);
    }else{
        xmlFiles.forEach(function(name){
            if(name.match(/.xml/)){
                xmlInteractionIds.push(name.replace(/.xml/,''));
            }
        });

        fs.readdir(config.xHtmlDirectoryPath,function(err,xhtml){
            if(err){
                console.log(err);
            }
            else{
                xhtml.forEach(function(fileName){
                    if(fileName.match(/.xhtml/)) {
                        tasks.push(function(callback){
                            var htmlFilePath = path.join(config.xHtmlDirectoryPath, fileName);
                            fs.readFile(htmlFilePath,function(error,data){
                                if(error){
                                    console.log(error);
                                    callback(error,null);
                                }else{
                                    var text = data.toString();
                                    var ids = [];
                                    var re = /interactionid="(?:[A-Za-z0-9_]*)/igm;
                                    var found = text.match(re);
                                    var result;
                                    if(found){
                                        found.forEach(function(word){
                                            ids.push(word.replace(/interactionid="/,''));
                                        });
                                        result = _.difference(ids,xmlInteractionIds);
                                        if(result && result.length!=0){
                                            var log = 'File: '+fileName +' has missing interactionid lists' + result + '\n';
                                            console.log(log);
                                            fs.appendFile(config.log, log, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                        }
                                    }
                                    callback(null,'done');
                                }
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
    }
});

