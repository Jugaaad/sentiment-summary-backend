var express = require('express');
var router = express.Router();
var Word = require("../models/Word").Word;
var scraper = require('../NiceScraper').Scrape;
var SummaryTool = require('node-summary');

/* GET users listing. */
router.post('/learn', function(req, res, next) {

    scraper(req.body.text, function (words) {
        words.forEach(function(entry) {
            Word.findOne({word: entry}, function (err, word) {
                if(word){
                    word.score = word.score + req.body.score;
                    word.save(function (err, newword) {
                        console.log(newword)
                    });
                }
                else{
                    var wordtosave = new Word({word: entry, score: req.body.score});
                    wordtosave.save(function (err, savedword) {
                        console.log(savedword)
                    });
                }
            })
        });
    });

/*    var words = req.body.text.toLowerCase().replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ").split(" ");*/

});

router.post('/sent', function (req, res, next) {
    var score = 0;
    var i = 0;
    var j = 0;
    scraper(req.body.text, function (words, og_text) {
        words.forEach(function(entry) {
            Word.findOne({word: entry}, function (err, word) {
                console.log(word);
                if(word) {
                    score = score + word.score;
                    j++;
                }
                i++;
                if(i==words.length){
                    SummaryTool.summarize(req.body.text + " and Pregnancy", og_text, function(err, summary) {
                        if(err) console.log("Something went wrong man!");
                        res.json({score: (score/j),
                            summary: summary})
                    });

                }
            });
        });
    });
/*    var words = req.body.text.toLowerCase().replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ").split(" ");*/

});

module.exports = router;