
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public")); // to use css files
app.use(bodyParser.urlencoded({extended: true}));  // for using form and inputting values and passing it to node/backend

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
//JSON format data to send to  mailchimp
  const data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  //JSON data into sting
  const jsonData = JSON.stringify(data);

// api link to connect to mailchimp
  const url = "https://us14.api.mailchimp.com/3.0/lists/0bb137c96d";
//posting data to mailchip with an apiKey
  const options = {
    method: "POST",
    auth : "ahsan1:461874ce663e9eb8fd9c5469c2c779cd-us14"
  }
//https request
  const request = https.request(url, options, function (response){

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html")
    }else{
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});

// My mailchimp api apiKey
// 461874ce663e9eb8fd9c5469c2c779cd-us14

// LIST //
// 0bb137c96d
