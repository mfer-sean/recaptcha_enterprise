# recaptcha-test

## Initial setup

npm install

## Run index.js

index.js is a simple Express web server that runs reCAPTCHA Enterprise Java script on the frontend and sends reCAPTCHA token to its own backend API endpoint for verification with Google.

1. Enable reCAPTCHA Enterprise at https://console.cloud.google.com/security/recaptcha if not already enabled.
2. Once enabled, create a reCAPTCHA Enterprise site key for your site. https://cloud.google.com/recaptcha-enterprise/docs/create-key
3. Create a service account in your GCP that has role “reCAPTCHA Enterprise Agent”： https://cloud.google.com/recaptcha-enterprise/docs/iam#roles
4. Create a service account .json key for that service account, and save it where you want to run this code: https://cloud.google.com/iam/docs/creating-managing-service-account-keys
5. In index.js, set projectNumber and recaptchaSiteKey to match your values.
   Run index.js as follows:

```sh
   GOOGLE_APPLICATION_CREDENTIALS="../<service-account-keyname>.json" node index.js
```

## Run scraper.js

scraper.js is a scraper tool that uses nick.js to scrape data from the webserver running on index.js.

1. Install google chrome on the server you will use for this test.
2. In scraper.js, change the url_root variable to point to the website you wish to scrape.
3. Run one of the following commands to execute the scraper.js (and also point nickjs to the correct Chrome path):

LINUX:

```sh
   CHROME_PATH=/usr/bin/google-chrome node scrape.js
```

OSX:

```sh
   CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node scrape.js
```
