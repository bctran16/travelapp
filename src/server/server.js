// Setup empty JS object to act as endpoint for all routes
let projectData = [];

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express(); 

//NodeJS fetch 
const fetch = require('node-fetch');
//Weatherbit config
const weatherbitBase = 'http://api.weatherbit.io/v2.0/normals?';
const pixabayBase = "https://pixabay.com/api/?"

/* Middleware*/
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//dot-envy to safely access password
const dotenv = require('dotenv').config();

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Geocoder wrapper
const GeocoderGeonames = require('geocoder-geonames')
const geocoder = new GeocoderGeonames({
      username:      'bangwft',
    });

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server

const port = 8081; 
const server = app.listen(port, () => {console.log(`server running at port ${port}`)});

// Get Request Server Side
app.get('/getData', (req, res) => {
    console.log("---Get Request----")
    res.status(200).send(projectData.pop());
    
});


// Post Request Server Side

app.post('/addEntry', (req, res) => { 
    console.log(req.body.city, req.body.start, req.body.end);
    // Geocode API Call
    getLongLat(encodeURI(req.body.city)).then((result) => {
        // Weatherbit API call
        console.log("----during getLongLat----");
        console.log(result.geonames[0].lng,result.geonames[0].lat);
        return getTemp(result.geonames[0].lng,result.geonames[0].lat, req.body.start.substring(5,), req.body.end.substring(5,));
    }).then((temp) => {
        console.log("----during getTemp----");
        let d = new Date();
        let s = new Date(req.body.start);
        let e = new Date(req.body.end)
        let away = Math.floor((Date.UTC(s.getFullYear(), s.getMonth(), s.getDate()) - Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) ) /(1000 * 60 * 60 * 24))+1;
        let len = Math.floor((Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()) - Date.UTC(s.getFullYear(), s.getMonth(), s.getDate()) ) /(1000 * 60 * 60 * 24)) + 1 ;
        let newEntry = {
            city: req.body.city,
            start: req.body.start, 
            end: req.body.end, 
            away: away,
            min_temp: temp.data[0].min_temp,
            max_temp: temp.data[0].max_temp,
            length: len
        }
        projectData.push(newEntry);
    }).then(() => {
        return fetchImage(encodeURI(req.body.city));
    }).then((res) => {
        console.log(res.hits[0].largeImageURL);
        let newEntry = projectData.pop();
        newEntry.img = res.hits[0].largeImageURL; 
        console.log(newEntry);
        projectData.push(newEntry);
    }).then(()=>{
        res.send(projectData);
    }).catch(err => alert(err));
    
});

// Geoname API Request

const getLongLat = async (city) => {
    return await geocoder.get('search',{
        q: city,
        maxRows: 5
      })
}

//Weatherbit API request
const getTemp = async (long, lat, start, end) => { 
    let link = weatherbitBase + `lat=${lat}&lon=${long}&start_day=${start}&end_day=${end}&tp=monthly&key=${process.env.WEATHERBIT_KEY}`
    const res = await fetch(link);
    try {
        return await res.json(); 
    } catch (error) {
        console.log("error", error);
    }
}

//Pixabay API Request
const fetchImage = async(city) => {
    const link = pixabayBase + `key=${process.env.PIXABAY_KEY}&q=${city}&image_type=photo`
    console.log(link)
    const image = await fetch(link);
    try {
        return await image.json(); 
    } catch (error) {
        console.log("error", error);
    }
}

module.exports = { app, server };