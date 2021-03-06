/**
 * Created by Karishnu Poddar on 11/02/2017.
 */
var cheerio = require('cheerio');
var unirest = require('unirest');

function scrape(element, callback) {
    unirest.get("http://www.webmd.com/search/2/results?query=pregnancy%20and%20" + element)
        .end(onResponse);

    function onResponse(data) {
        var $ = cheerio.load(data.body, {ignoreWhitespace: true});
        var results = $('p[class=search-results-doc-title]');

        var size = results.length;
        var i;
        var words_link;
        var words;
        var link;
        for(i = 0; i<=size-1; i++){
            words_link = results[i].children[1].attribs.href.split('/');
            words = words_link[words_link.length-1].split(/[\-_\s]/);
            if(isInArray(words, 'pregnancy')&&isInArray(words, element)&&isInArray(words, 'and')){
                link = results[i].children[1].attribs.href;
                break;
            }
        }
        if(link==null){
            for(i = 0; i<=size-1; i++){
                words_link = results[i].children[1].attribs.href.split('/');
                words = words_link[words_link.length-1].split('-');
                if(isInArray(words, 'pregnancy')&&isInArray(words, element)){
                    link = results[i].children[1].attribs.href;
                    break;
                }
            }
        }

        if(link!=null){
            console.log(link);
            unirest.get(link)
                .end(onLinkResponse)
        }
    }

    function onLinkResponse(data) {
        var $ = cheerio.load(data.body);
        var data2 = $('div[class=article-body]').text().toString();
        console.log(data2);
        var data3 = data2.split(' ');
        /*    data3.forEach(function (word) {
         console.log(word.trim());
         });*/

        var data4 = [];
        data3.forEach(function (word) {
            var word2 =  word.replace(/[^\w\s]|_/g, "").replace(/[\r\n]/g, "").toLowerCase();
            if(word2!=''){
                data4.push(word2);
            }
        });
        callback(data4, data2);
    }

    function isInArray(days, day) {
        return days.indexOf(day.toLowerCase()) > -1;
    }
}

module.exports = {Scrape: scrape};