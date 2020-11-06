// to run need chrome installed:
// LINUX: CHROME_PATH=/usr/bin/google-chrome node scrape.js
// OSX: CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node scrape.js


const Nick = require("nickjs")
const nick = new Nick()

// let root_url = "http://localhost:8080"
let root_url = "https://recaptcha.enseante.com"
let waitUntilBlock = "#results div"


;(async () => {

	const tab = await nick.newTab()
	await tab.open(root_url)

	await tab.untilVisible(waitUntilBlock) // Make sure we have loaded the page

	await tab.inject("http://code.jquery.com/jquery-3.2.1.min.js") // We're going to use jQuery to scrape
	const h1s = await tab.evaluate((arg, callback) => {
		// Here we're in the page context. It's like being in your browser's inspector tool
		const data = []
		$("#results div").each((index, element) => {
			data.push({
				result: JSON.parse($(element).text()),				
			})
		})
		callback(null, data)
	})

	console.log(JSON.stringify(h1s, null, 2))

})()
.then(() => {
	console.log("Job done!")
	nick.exit()
})
.catch((err) => {
	console.log(`Something went wrong: ${err}`)
	nick.exit(1)
})