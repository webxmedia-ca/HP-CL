/**
 * Created by valeriu.jecov on 10/06/2019.
 * email: valeriu.jecov@webxmedia.ca
 * NOTE: THIS TEST IS DONE
 */

const waitShort = 2000;
const waitLong = 5000;
const harness = require('../../lib/harness');
const HarnessJson = require('../../lib/harness-json');
const UofC = require('../../lib/UofCApps');

describe('appName: ' + harness.getCommandLineArgs().appName + ' (user: ' + harness.getCommandLineArgs().role +
 ') | env: ' + harness.getCommandLineArgs().env + ' | BrowserStack: ' + harness.getCommandLineArgs().browserStack, function () {
	
	let harnessObj = null;
	
	before(async () => {
		harnessObj = await harness.init();
		await UofC.init(harnessObj, waitShort, waitLong);
		await UofC.startApp();
		await UofC.login();
	});
	
	after(async () => {
		await harnessObj.quit(this);
	});
	
	afterEach(async () => {
		await UofC.afterEachTest(this.ctx.currentTest);
	});
	
	//reading json data files and preparing the required variables for later usage
	const dataJsonFilePath = require('path').join(__dirname, '/data/data.json');
	const newPageValues = new HarnessJson(dataJsonFilePath).getJsonData().createBasicPage;
	// UofC.createBasicPage(newPageValues);
	
	describe('wait', () => {
		it('wait', async () => {
			console.log('wait');
		});
	});
});