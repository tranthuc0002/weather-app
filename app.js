const asyncRequest = require('async-request');

const getPosition = async (location) => {
    const access_token = "pk.eyJ1IjoiYW5pa2liYWthIiwiYSI6ImNreDRpNzJ2YTE2bWUyd3BoODl4bTdtZnEifQ.l1CC7HuFRYBqfT7gNvgyMg"
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/&query=${location}.json?access_token=${access_token}`;
    try{
        const res = await asyncRequest(url);
        const data = JSON.parse(res.body);
        const position = {
            isSuccess : true,
            country : data.features[0].place_name,
            longitude : data.features[0].center[0],
            latitude : data.features[0].center[1],
        }
        console.log(position);
        return position;
    }catch(err){
        console.log(err);
        return {
            isSuccess : false,
            err,
        }
    }    
};

const express = require('express');
const app = express();
const path = require('path');

const pathPublic = path.join(__dirname, "./public");
app.use(express.static(pathPublic));

app.get("/", async (req, res) => {
    const params = req.query;
    const location = params.address;
    const position = await getPosition(location);
    if(location){
        res.render("position", {
            status: true,
            country : position.country,
            longitude : position.longitude,
            latitude : position.latitude,
        });
    }else{
        res.render("position", {
            status: false,
        });
    }
});

app.set("view engine", "hbs");

const port = 4000;
app.listen(port, () =>{
    console.log(`app run on http://localhost:${port}`);
});