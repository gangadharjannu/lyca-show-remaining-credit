const puppeteer = require('puppeteer');
const CREDS = require('./creds');
const CONSTANTS = require('./constants');
// const cookieStore = require('./cookiestore');
//Create cookie manager object. Cookies will be saved in file called liveCookies.txt
let cookiesManager = require('./cookiestore').create("liveCookies.txt");

async function run() {
	try {
		const browser = await puppeteer.launch({
			headless: false
		});
		const page = await browser.newPage();


		if (cookiesManager.cookieFileExists()) {
			console.log('VISITED');
			cookiesManager.readCookies(); //Read cookies from cookie file
			let cookies = cookiesManager.phantomCookies; //Set phantom cookies
			console.log(cookies);
			for (let cookie of cookies) {
				await page.setCookie(cookie);
			}
			await page.goto(CONSTANTS.PAGE.CALL_HISTORY, {
				waitUntil: 'networkidle2'
			});
		} else {
			console.log('FRESH');
			await page.goto(CONSTANTS.PAGE.LOGIN, {
				waitUntil: 'networkidle2'
			});

			// await page.goto(SELECTORS.LOGIN_PAGE);

			// await page.setViewport({
			// 	width: 1366,
			// 	height: 768
			// });

			await page.click(CONSTANTS.SELECTOR.GDPR_NOTICE_REMOVE);

			await page.click(CONSTANTS.SELECTOR.USERNAME);
			await page.keyboard.type(CREDS.username, {
				delay: 250
			});

			await page.click(CONSTANTS.SELECTOR.PASSWORD);
			await page.keyboard.type(CREDS.password, {
				delay: 250
			});

			// cookies
			let cookies = await page.cookies();
			// console.log(cookies);
			cookiesManager.loadCookies(cookies);
			await cookiesManager.saveCookies();

			// await page.waitForNavigation();
			// await page.waitFor(2000);

			await page.click(CONSTANTS.SELECTOR.LOGIN_BUTTON);

			// browser.close();
			// await page.waitForNavigation();
			await page.waitForNavigation({
				waitUntil: 'networkidle2'
			});
		}


		// page 2


	} catch (error) {
		console.log(error);
	}

}

run();