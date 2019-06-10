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
const expect = require('chai').expect;

describe('appName: ' + harness.getCommandLineArgs().appName + ' (user: ' + harness.getCommandLineArgs().role +
 ') | env: ' + harness.getCommandLineArgs().env + ' | BrowserStack: ' + harness.getCommandLineArgs().browserStack, function () {
	
	let harnessObj = null;
	
	before(async () => {
		harnessObj = await harness.init();
		await UofC.init(harnessObj, waitShort, waitLong);
		await UofC.startApp();
		await UofC.login();
		driver = harnessObj.driver;
		By = harnessObj.By;
	});
	
	after(async () => {
		await harnessObj.quit(this);
	});
	
	afterEach(async () => {
		await UofC.afterEachTest(this.ctx.currentTest);
	});
	
	
	
	
	describe('wait', () => {
		it('wait', async () => {
			console.log('wait');
		});
	});
	
	describe('delete all active posts', () => {
		it('find all active posts', async () => {
			console.log('TO DO.......');
		});
		
		it('delete all of them one by one', async () => {
			console.log('TO DO.......');
		});
		
		it('verify no more active records exist', async () => {
			console.log('TO DO.......');
		});
	});
	
	
	
	//reading json data files and preparing the required variables for later usage
	const dataJsonFilePath = require('path').join(__dirname, '/data/data.json');
	const listingsValues = new HarnessJson(dataJsonFilePath).getJsonData().listingsToBeAdded;
	describe('add a new post to the vancouver, BC, BC, CA area', () => {
		it('set the posting in to Vancouver', async () => {
			//dropdown value:
			/*
			vancouver, BC,
				BC,
				CA
			*/
			// await UofC.setSelectDropDownValueByCSS('form.new_posting_thing>select', listingsValues.postingRegionLocation);
			await UofC.setSelectFieldValueByCSS('form.new_posting_thing>select', listingsValues.postingRegionLocation);
		});
		
		it('click go button', async () => {
			await UofC.clickElementByCSS('button[value="go"]');
		});
		
		it('validate the correct page has loaded - choose the location that fits best', async () => {
			await UofC.waitForObjectLoad('.picker>.selection-list', waitLong, 500, true);
			await UofC.waitForObjectLoad('.formnote:nth-child(1)>b', waitShort, 500, true);
			await UofC.validateDisplayedTextEquals('.formnote:nth-child(1)>b', 'choose the location that fits best:');
		});
		
		it('set the location that fits best as city of vancouver', async () => {
			await UofC.setButtonRadioFieldValueByCSS('.picker>.selection-list input', listingsValues.locationThatFitsBest); //'1'
		});
		
		/*
		it('click the continue button', async () => {
			console.log('wait - not needed here - automatically loads next page when radio tbn is selected');
			await UofC.clickElementByCSS('button[value=Continue]');
		});
		*/
		
		it('validate the correct page has loaded - choose type of posting', async () => {
			await UofC.waitForObjectLoad('.picker>.selection-list', waitLong, 500, true);
			await UofC.waitForObjectLoad('.formnote>b', waitShort, 500, true);
			await UofC.validateDisplayedTextEquals('.formnote>b', 'what type of posting is this:');
		});
		
		it('set the type of posting', async () => {
			await UofC.setButtonRadioFieldValueByCSS('.picker>.selection-list input', listingsValues.typeOfPosting);    //'ho'
		});
		
		it('validate the correct page has loaded - choose category', async () => {
			await UofC.waitForObjectLoad('.variant-radio', waitLong, 500, true);
			await UofC.waitForObjectLoad('.formnote>b', waitShort, 500, true);
			await UofC.validateDisplayedTextEquals('.formnote>b', 'please choose a category:');
		});
		
		it('set the category', async () => {
			//check the radio btn has the right label
			let categoryElement = await driver.findElement(By.css('.variant-radio input[value="' +
				listingsValues.postingCategory + '"]'));
			categoryElement = await categoryElement.findElement(By.xpath('..'));
			categoryElement = await categoryElement.findElement(By.css('span'));
			let categoryToSelectText = await categoryElement.getText();
			// console.log(categoryToSelectText);
			
			//temp solution --- might need to be updated
			let expectedValue;
			if (listingsValues.postingCategory === '1') {
				expectedValue = 'apts/housing for rent';
			}
			expect(categoryToSelectText.toLowerCase()).to.contain(expectedValue);
			
			//now select the radio btn
			await UofC.setButtonRadioFieldValueByCSS('.variant-radio input', listingsValues.postingCategory); //'1' = apts/housing for rent
		});
		
		it('validate the correct page has loaded - create posting', async () => {
			await UofC.waitForObjectLoad('#postingForm', waitLong, 500, true);
			await UofC.waitForObjectLoad('input[name=PostingTitle]', waitShort, 500, true);
			await UofC.validateDisplayedTextEquals('.contact-info p', 'listings@hopestreet.ca');
		});
		
		
		//TO BE CONTINUED --------- fill in the form with fields
	});
});