                                /* requiring node libraries */
const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");

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
    let moviename = req.query.moviename;
    // Save the movies in the array
    let movies = [];
    // Count how many movies is there
    let filmsNum = 0;
    let url = "http://www.omdbapi.com/?s=" + moviename + "&apikey=thewdb";
    // Send a request to the OMDb API to get data on movies with name (moviename)
    request(url, function(err, response, body){
        if(!err && response.statusCode == 200){
            let parsedData = JSON.parse(body);
            let films = parsedData["Search"];
            // If there's data
            if(parsedData["Response"] === "True"){
                // loop over the movies
                films.forEach(function(film){
                    // Count how many movies there is
                    filmsNum += 1;
                    let movieId = film["imdbID"];
                    let url2 = "http://www.omdbapi.com/?i=" + movieId + "&apikey=thewdb";
                    // Request more info using the ID of each movie
                    request(url2, function(error, respon, body2){
                        if(!error && respon.statusCode == 200){
                            let parsedData2 = JSON.parse(body2);
                            // Add the movies to the array
                            movies.push(parsedData2);
                        }
                        // When it finishs looping send a response
                        if(movies.length === filmsNum){
                            res.render("result", {films: movies});
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