const express = require('express');
const https = require('https');
const path = require('path');
const request = require('request');

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post('/', (req, res) => {
    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address : email,
                status : "subscribed", 
                merge_fields : {
                    FNAME : firstname,
                    LNAME : lastname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us2.api.mailchimp.com/3.0/lists/f96bac6914";
    const options = {
        method : "POST", 
        auth: "anystring:f4ffec24b7136c9c7660f0d3dd8507d9-us2"
    }
    const request = https.request(url, options, (response) => {
        if(response.statusCode === 200) {
            res.sendFile(path.join(__dirname, "/public", "success.html"));
        } else {
            res.sendFile(path.join(__dirname, "/public", "failure.html"));
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
 
});
app.post('/failure', (req, res) => {
    res.redirect('/');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at PORT ${PORT} ... `));


// apiKey = f4ffec24b7136c9c7660f0d3dd8507d9-us2
//Audience id or list id : f96bac6914