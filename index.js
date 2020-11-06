// Run from local machine or GCP machine without permissions:
// get JSON key for a service acocunt that has recpatcha create permissions from GCP IAM
// Then run as GOOGLE_APPLICATION_CREDENTIALS="../<keyname>.json" node index.js

var axios = require("axios");
var os = require("os");

var express = require("express");
var bodyParser = require("body-parser");

let projectNumber = '<GCP PROJECT NUMBER>'; // get from https://console.cloud.google.com/security/recaptcha
let recaptchaSiteKey = '<RECAPTCHA SITE KEY>'; // get from your GCP project home page

// Create the reCAPTCHA client library.
const {
  RecaptchaEnterpriseServiceClient,
} = require('@google-cloud/recaptcha-enterprise');
const client = new RecaptchaEnterpriseServiceClient();


const expressApp = express().use(bodyParser.json());


expressApp.get("/test", async (request, response) => {
  console.log("Test");

  // format the path to the project (it should be prefaced with projects/).
  const formattedParent = client.projectPath(projectNumber);

  // assessment should contain event with RESPONSE_TOKEN and RECAPTCHA_SITE_KEY:
  const assessment = {'event': {'token': request.query.token, 'siteKey': recaptchaSiteKey}};

  const captchaRequest = {
    parent: formattedParent,
    assessment: assessment,
  };

  // Get the response back about if the user is a bot or not. 
  let captchaResponse = await client.createAssessment(captchaRequest);
  console.log(captchaResponse[0].tokenProperties);
  console.log(captchaResponse[0].riskAnalysis);
  
  // TODO: IF captchaResponse[0].riskAnalysis < 0.50, then:
  // Let the user know it failed
  // OR 
  // Display a checkbox popup (using a checkbox key) to re-test the user

  response.send(captchaResponse);
});


expressApp.get("/", async (request, response) => {
let page = `
<html>
<head>
</head>
<body>
<h1>Recaptcha Demo</h1>
<!--
<form action="?" method="POST">
      <div class="g-recaptcha" data-sitekey="${recaptchaSiteKey}"
           data-action="homepage"></div>
      <br/>
      <input type="submit" value="Submit">
</form>
!-->
<div id="results"></div>
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}"></script>
<script>
$("#results").text("...");
grecaptcha.enterprise.ready(function() {
  try {
    grecaptcha.enterprise.execute("${recaptchaSiteKey}", {action: 'homepage'}).then(function(token) {
        $.get("/test?token="+token)
        .done (
          function(data) {
        
            // Success! Do stuff with data.
            console.log(data);
            $("#results").append("<div>" + JSON.stringify(data) + "</div>");
          }
        )
        .fail(function( jqXHR, textStatus, errorThrown ) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown );
          //$("#results").text(textStatus + " " + errorThrown)
          $("#results").append("<div>" + textStatus + " " + errorThrown + "</div>");
        });
    });
  }
  catch (err){
    $("#results").text(err);
    console.log(err);
  }    
});
</script>
</body>
</html>

`;
response.send(page);

});

expressApp.listen(8080);
console.log(`express server listening on port 8080...`);
