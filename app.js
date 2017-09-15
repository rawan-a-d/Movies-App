var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");

app.use("/", bodyParser());
app.use(express.static('public'))
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("films");
});

app.get('/result', function(req, res){
    var moviename = req.query.moviename;
    console.log(moviename);
    var wholeFilms = []
    var url = "http://www.omdbapi.com/?s=" + moviename + "&apikey=thewdb"
    request(url, function(err, response, body){
        if(!err && response.statusCode == 200){
            var parsedData = JSON.parse(body);
            var films = parsedData["Search"];
            if(parsedData["Response"] === "True"){
                films.forEach(function(film){
                    var movieId = film["imdbID"]
                    var url2 = "http://www.omdbapi.com/?i=" + movieId + "&apikey=thewdb"
                    request(url2, function(error, respon, body2){
                        if(!error && respon.statusCode == 200){
                            var parsedData2 = JSON.parse(body2);
                            wholeFilms.push(parsedData2)
                            console.log(parsedData2)
                        }
                        if( wholeFilms.length === 10){
                            res.render("result", {films: wholeFilms});                
                        }
                    })
                })
            }
            else {
                res.render("result", {films: null})
            }
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!!");
})