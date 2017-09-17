                                /* requiring node libraries */
var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use("/", bodyParser());
app.use(express.static('public'));

                                /* Search Route */
app.get("/", function(req, res){
    res.render("search");
});

                                /* Result Route */
app.get('/result', function(req, res){
    // get what the user is searching for from the query string
    var moviename = req.query.moviename;
    // Save the movies in the array
    var wholeFilms = [];
    // Count how many movies is there
    var filmsNum = 0;
    var url = "http://www.omdbapi.com/?s=" + moviename + "&apikey=thewdb";
    // Send a request to the OMDb API to get data on movies with name (moviename)
    request(url, function(err, response, body){
        if(!err && response.statusCode == 200){
            var parsedData = JSON.parse(body);
            var films = parsedData["Search"];
            // If there's data
            if(parsedData["Response"] === "True"){
                // loop over the movies
                films.forEach(function(film){
                    // Count how many movies there is
                    filmsNum += 1;
                    var movieId = film["imdbID"];
                    var url2 = "http://www.omdbapi.com/?i=" + movieId + "&apikey=thewdb";
                    // Request more info using the ID of each movie
                    request(url2, function(error, respon, body2){
                        if(!error && respon.statusCode == 200){
                            var parsedData2 = JSON.parse(body2);
                            // Add the movies to the array
                            wholeFilms.push(parsedData2);
                        }
                        // When it finishs looping send a response
                        if(wholeFilms.length === filmsNum){
                            res.render("result", {films: wholeFilms});
                        }
                    });
                });
            }
            else {
                res.render("result", {films: null});
            }
        }
    });
});

                                /* The server */
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Movie App has started!!");
})