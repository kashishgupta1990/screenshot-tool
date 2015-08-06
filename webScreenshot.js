var phantom = require('phantom');

phantom.create(function (ph) {
    ph.createPage(function (page) {
        page.open("http://blog.arisetyo.com/", function (status) {
            console.log("opened page? ", status);
            page.evaluate(function () { return document.title; }, function (result) {
                console.log('Page title is: ' + result);
                page.render('screenshot.png');
                ph.exit();
            });
        });
    });
});