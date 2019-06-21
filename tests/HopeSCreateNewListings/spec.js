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
	let driver = null;
	let By = null;
	let until = null;
	
	before(async () => {
		harnessObj = await harness.init();
		await UofC.init(harnessObj, waitShort, waitLong);
		await UofC.startApp();
		await UofC.login();
		driver = harnessObj.driver;
		By = harnessObj.By;
		until = harnessObj.until;
	});
	
	after(async () => {
		await harnessObj.quit(this);
	});
	
	afterEach(async () => {
		await UofC.afterEachTest(this.ctx.currentTest);
	});
	
	/*
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
	*/
	
	//reading json data files and preparing the required variables for later usage
	const dataJsonFilePath = require('path').join(__dirname, '/data/data.json');
	const listingsValues = new HarnessJson(dataJsonFilePath).getJsonData().listingsToBeAdded;
	
	let timer;  //this is the timing randomizer for the posts creation - between 1 & 10 seconds
	for (let i = 0; i< listingsValues.length; i++) {
		timer = Math.floor((Math.random() * 10) + 1); //randomize the wait time between posts creation
		
		describe('# ' + (i + 1) + '. add a new post with the ' + listingsValues[i].postingTitle + ' title', () => {
			describe('creating the new post within the ' + listingsValues[i].postingRegionLocation + ' area', () => {
				UofC.validateDisplayedTextContains('.new_posting_thing', 'new posting in:');
				
				it('set the posting region to ' + listingsValues[i].postingRegionLocation, async () => {
					//dropdown values:
					/*
					vancouver, BC,
						BC,
						CA
					*/
					await UofC.setSelectFieldValueByCSS('form.new_posting_thing>select', listingsValues[i].postingRegionLocation);
				});
				
				it('click go button', async () => {
					await UofC.clickElementByCSS('button[value="go"]');
				});
				
				it('validate the correct page has loaded -> choose the location that fits best', async () => {
					await UofC.waitForObjectLoad('.picker>.selection-list', waitLong, 500, true);
					await UofC.waitForObjectLoad('.formnote:nth-child(1)>b', waitShort, 500, true);
				});
				
				UofC.validateDisplayedTextEquals('.formnote:nth-child(1)>b', 'choose the location that fits best:');
			});
			
			describe('chose the nearest area', () => {
				it('set the location that fits best as ' + listingsValues[i].locationThatFitsBest, async () => {
					await UofC.setButtonRadioFieldValueByCSS('.picker>.selection-list input', listingsValues[i].locationThatFitsBest); //'1'
				});
				
				/*
				it('click the continue button', async () => {
					console.log('wait - not needed here - automatically loads next page when radio tbn is selected');
					await UofC.clickElementByCSS('button[value=Continue]');
				});
				*/
				
				it('validate the correct page has loaded -> choose type of posting', async () => {
					await UofC.waitForObjectLoad('.picker>.selection-list', waitLong, 500, true);
					await UofC.waitForObjectLoad('.formnote>b', waitShort, 500, true);
				});
				
				UofC.validateDisplayedTextEquals('.formnote>b', 'what type of posting is this:');
			});
			
			describe('choose the type', () => {
				it('set the type of posting as ' + listingsValues[i].typeOfPosting, async () => {
					await UofC.setButtonRadioFieldValueByCSS('.picker>.selection-list input', listingsValues[i].typeOfPosting);    //'ho'
				});
				
				it('validate the correct page has loaded -> choose category', async () => {
					await UofC.waitForObjectLoad('.variant-radio', waitLong, 500, true);
					await UofC.waitForObjectLoad('.formnote>b', waitShort, 500, true);
				});
				
				UofC.validateDisplayedTextEquals('.formnote>b', 'please choose a category:');
			});
			
			describe('choose the category', () => {
				it('set the category as ' + listingsValues[i].postingCategory, async () => {
					//check the radio btn has the right label
					let categoryElement = await driver.findElement(By.css('.variant-radio input[value="' +
						listingsValues[i].postingCategory + '"]'));
					categoryElement = await categoryElement.findElement(By.xpath('..'));
					categoryElement = await categoryElement.findElement(By.css('span'));
					let categoryToSelectText = await categoryElement.getText();
					// console.log(categoryToSelectText);
					
					//temp solution --- might need to be updated
					let expectedValue;
					if (listingsValues[i].postingCategory === '1') {
						expectedValue = 'apts/housing for rent';
					}
					expect(categoryToSelectText.toLowerCase()).to.contain(expectedValue);
					
					//now select the radio btn
					await UofC.setButtonRadioFieldValueByCSS('.variant-radio input', listingsValues[i].postingCategory); //'1' = apts/housing for rent
				});
				
				it('validate the correct page has loaded -> create posting', async () => {
					await UofC.waitForObjectLoad('#postingForm', waitLong, 500, true);
					await UofC.waitForObjectLoad('input[name=PostingTitle]', waitShort, 500, true);
				});
				
				UofC.validateDisplayedTextEquals('.contact-info p', 'listings@hopestreet.ca');
			});
			
			describe('fill in the posting values', () => {
				//TO BE CONTINUED --------- fill in the form with fields
				//maybe verify selected value within the 'category' drop down is right...
				//select[name=CategoryID] should equal -> listingsValues[i].postingCategory [NOTE: not always visible]
				
				describe('set up the main post\'s values', () => {
					//Posting title
					it('type the posting title as ' + listingsValues[i].postingTitle, async () => {
						await UofC.setTextFieldValueByCSS('input[name=PostingTitle]', listingsValues[i].postingTitle);
					});
					
					//City or Neighborhood
					if (listingsValues[i].cityOrNeighborhood) {
						it('type the city or neighborhood as ' + listingsValues[i].cityOrNeighborhood, async () => {
							await UofC.setTextFieldValueByCSS('input[name=GeographicArea]', listingsValues[i].cityOrNeighborhood);
						});
					}
					
					//Posting postal code
					it('type the posting title as ' + listingsValues[i].postalCode, async () => {
						await UofC.setTextFieldValueByCSS('input[name=postal]', listingsValues[i].postalCode);
					});
					
					//Description
					it('type the description as ' + listingsValues[i].postingDescription, async () => {
						await UofC.setTextFieldValueByCSS('textarea[name=PostingBody]', listingsValues[i].postingDescription);
					});
				});
				
				// POSTING DETAILS section:
				describe('set up the posting details values', () => {
					//Rent
					it('type the rent as ' + listingsValues[i].postingDetails.rentPrice, async () => {
						await UofC.setTextFieldValueByCSS('input[name=price]', listingsValues[i].postingDetails.rentPrice);
					});
					
					
					//SQFT (maybe switch the order)
					if (listingsValues[i].postingDetails.sqft) {
						it('type the sqft as ' + listingsValues[i].postingDetails.sqft, async () => {
							await UofC.setTextFieldValueByCSS('input[name=Sqft]', listingsValues[i].postingDetails.sqft);
						});
					}
					
					//Housing Type (maybe switch the order)
					if (listingsValues[i].postingDetails.housingType) {
						it('select the housing type as ' + listingsValues[i].postingDetails.housingType, async () => {
							await driver.wait(until.elementLocated(By.css('label[class*=housing_type] span.ui-widget')), waitLong);
							let housingTypeDropDownElement = await driver.findElement(By.css('label[class*=housing_type] span.ui-widget'));
							await housingTypeDropDownElement.click();
							
							let housingTypeListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
							if (housingTypeListElements.length > 0) {
								let housingTypeListElementText;
								for (let j = 0; j < housingTypeListElements.length; j++) {
									housingTypeListElementText = await housingTypeListElements[j].getText();
									if (housingTypeListElementText === listingsValues[i].postingDetails.housingType) {
										await housingTypeListElements[j].click();
										j = housingTypeListElements.length;
									}
								}
							}
						});
					}
					
					//Laundry
					if (listingsValues[i].postingDetails.laundry) {
						it('select the laundry as ' + listingsValues[i].postingDetails.laundry, async () => {
							await driver.wait(until.elementLocated(By.css('label[class*=laundry] span.ui-widget')), waitLong);
							let laundryDropDownElement = await driver.findElement(By.css('label[class*=laundry] span.ui-widget'));
							await laundryDropDownElement.click();
							
							let laundryListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
							if (laundryListElements.length > 0) {
								let laundryListElementText;
								for (let j = 0; j < laundryListElements.length; j++) {
									laundryListElementText = await laundryListElements[j].getText();
									if (laundryListElementText === listingsValues[i].postingDetails.laundry) {
										await laundryListElements[j].click();
										j = laundryListElements.length;
									}
								}
							}
						});
					}
					
					//Parking
					if (listingsValues[i].postingDetails.parking) {
						it('select the parking as ' + listingsValues[i].postingDetails.parking, async () => {
							await driver.wait(until.elementLocated(By.css('label[class*=parking] span.ui-widget')), waitLong);
							let parkingDropDownElement = await driver.findElement(By.css('label[class*=parking] span.ui-widget'));
							await parkingDropDownElement.click();
							
							let parkingListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
							if (parkingListElements.length > 0) {
								let parkingListElementText;
								for (let j = 0; j < parkingListElements.length; j++) {
									parkingListElementText = await parkingListElements[j].getText();
									if (parkingListElementText === listingsValues[i].postingDetails.parking) {
										await parkingListElements[j].click();
										j = parkingListElements.length;
									}
								}
							}
						});
					}
					
					//Bedrooms
					if (listingsValues[i].postingDetails.bedrooms) {
						it('select the bedrooms as ' + listingsValues[i].postingDetails.bedrooms, async () => {
							await driver.wait(until.elementLocated(By.css('label[class*=Bedrooms] span.ui-widget')), waitLong);
							let bedroomsDropDownElement = await driver.findElement(By.css('label[class*=Bedrooms] span.ui-widget'));
							await bedroomsDropDownElement.click();
							
							let bedroomsListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
							if (bedroomsListElements.length > 0) {
								let bedroomsListElementText;
								for (let j = 0; j < bedroomsListElements.length; j++) {
									bedroomsListElementText = await bedroomsListElements[j].getText();
									if (bedroomsListElementText === listingsValues[i].postingDetails.bedrooms) {
										await bedroomsListElements[j].click();
										j = bedroomsListElements.length;
									}
								}
							}
						});
					}
					
					//Bathrooms
					if (listingsValues[i].postingDetails.bathrooms) {
						it('select the bathrooms as ' + listingsValues[i].postingDetails.bathrooms, async () => {
							await driver.wait(until.elementLocated(By.css('label[class*=bathrooms] span.ui-widget')), waitLong);
							let bathroomsDropDownElement = await driver.findElement(By.css('label[class*=bathrooms] span.ui-widget'));
							await bathroomsDropDownElement.click();
							
							let bathroomsListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
							if (bathroomsListElements.length > 0) {
								let bathroomsListElementText;
								for (let j = 0; j < bathroomsListElements.length; j++) {
									bathroomsListElementText = await bathroomsListElements[j].getText();
									if (bathroomsListElementText === listingsValues[i].postingDetails.bathrooms) {
										await bathroomsListElements[j].click();
										j = bathroomsListElements.length;
									}
								}
							}
						});
					}
					
					/////// CHECKBOXES
					//Cats ok
					if (listingsValues[i].postingDetails.catsOk) {
						it('set the cats ok checkbox as ' + listingsValues[i].postingDetails.catsOk, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=pets_cat]', listingsValues[i].postingDetails.catsOk);
						});
					}
					
					//Dogs ok
					if (listingsValues[i].postingDetails.dogsOk) {
						it('set the dogs ok checkbox as ' + listingsValues[i].postingDetails.dogsOk, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=pets_dog]', listingsValues[i].postingDetails.dogsOk);
						});
					}
					
					//Furnished
					if (listingsValues[i].postingDetails.furnished) {
						it('set the furnished checkbox as ' + listingsValues[i].postingDetails.furnished, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=is_furnished]', listingsValues[i].postingDetails.furnished);
						});
					}
					
					//No Smoking
					if (listingsValues[i].postingDetails.noSmoking) {
						it('set the furnished checkbox as ' + listingsValues[i].postingDetails.noSmoking, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=no_smoking]', listingsValues[i].postingDetails.noSmoking);
						});
					}
					
					//Wheelchair Accessible
					if (listingsValues[i].postingDetails.wheelchairAccessible) {
						it('set the furnished checkbox as ' + listingsValues[i].postingDetails.wheelchairAccessible, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=wheelchaccess]', listingsValues[i].postingDetails.wheelchairAccessible);
						});
					}
					
					//Available On & Open House Dates
					if (listingsValues[i].postingDetails.availableOn) {
						describe('set up the available on and open house values', () => {
							it('type the available on as ' + listingsValues[i].postingDetails.availableOn, async () => {
								await UofC.setTextFieldValueByCSS('input[class*=movein_date][class*=datepicker]', listingsValues[i].postingDetails.availableOn);
								let calendarElement = await driver.findElement(By.css('input[class*=movein_date][class*=datepicker]'));
								await calendarElement.sendKeys('\n');
								await driver.sleep(500);
							});
							
							if (listingsValues[i].postingDetails.openHouseDates1) {
								it('select the open house date #1 as ' + listingsValues[i].postingDetails.openHouseDates1, async () => {
									await driver.wait(until.elementLocated(By.css('label[class*=sale_date_1] span.ui-widget')), waitLong);
									let openHouseDropDownElementOne = await driver.findElement(By.css('label[class*=sale_date_1] span.ui-widget'));
									await openHouseDropDownElementOne.click();
									
									let openHouseListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
									if (openHouseListElements.length > 0) {
										let openHouseListElementText;
										for (let i = 0; i < openHouseListElements.length; i++) {
											openHouseListElementText = await openHouseListElements[i].getText();
											if (openHouseListElementText === listingsValues[i].postingDetails.openHouseDates1) {
												await openHouseListElements[i].click();
												i = openHouseListElements.length;
											}
										}
									}
								});
							}
							
							if (listingsValues[i].postingDetails.openHouseDates2) {
								it('select the open house date #2 as ' + listingsValues[i].postingDetails.openHouseDates2, async () => {
									await driver.wait(until.elementLocated(By.css('label[class*=sale_date_2] span.ui-widget')), waitLong);
									let openHouseDropDownElementTwo = await driver.findElement(By.css('label[class*=sale_date_2] span.ui-widget'));
									await openHouseDropDownElementTwo.click();
									
									let openHouseListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
									if (openHouseListElements.length > 0) {
										let openHouseListElementText;
										for (let i = 0; i < openHouseListElements.length; i++) {
											openHouseListElementText = await openHouseListElements[i].getText();
											if (openHouseListElementText === listingsValues[i].postingDetails.openHouseDates2) {
												await openHouseListElements[i].click();
												i = openHouseListElements.length;
											}
										}
									}
								});
							}
							
							if (listingsValues[i].postingDetails.openHouseDates3) {
								it('select the open house date #3 as ' + listingsValues[i].postingDetails.openHouseDates3, async () => {
									await driver.wait(until.elementLocated(By.css('label[class*=sale_date_3] span.ui-widget')), waitLong);
									let openHouseDropDownElementThree = await driver.findElement(By.css('label[class*=sale_date_3] span.ui-widget'));
									await openHouseDropDownElementThree.click();
									
									let openHouseListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
									if (openHouseListElements.length > 0) {
										let openHouseListElementText;
										for (let i = 0; i < openHouseListElements.length; i++) {
											openHouseListElementText = await openHouseListElements[i].getText();
											if (openHouseListElementText === listingsValues[i].postingDetails.openHouseDates3) {
												await openHouseListElements[i].click();
												i = openHouseListElements.length;
											}
										}
									}
								});
							}
						});
					}
				});
				
				/////// CONTACT INFO
				describe('set up the contact info values', () => {
					//email privacy options
					it('set the email privacy options radio button as ' + listingsValues[i].contactInfo.emailPrivacy, async () => {
						const radioButtonElements = await driver.findElements(By.css('div.email-privacy .radio-option input'));
						if (radioButtonElements.length > 0) {
							let radioButtonElement, radioButtonLabel, radioButtonText;
							for (let i = 0; i < radioButtonElements.length; i++) {
								radioButtonElement = await radioButtonElements[i].findElement(By.xpath('..'));
								radioButtonLabel = await radioButtonElement.findElement(By.css('span'));
								radioButtonText = await radioButtonLabel.getText();
								if (radioButtonText === listingsValues[i].contactInfo.emailPrivacy &&
									radioButtonText === 'CL mail relay (recommended)') {
									await radioButtonElements[0].click();
									i = radioButtonElements.length;
								}
								
								if (radioButtonText === listingsValues[i].contactInfo.emailPrivacy &&
									radioButtonText === 'show my real email address') {
									await radioButtonElements[1].click();
									i = radioButtonElements.length;
								}
								
								if (radioButtonText === listingsValues[i].contactInfo.emailPrivacy &&
									radioButtonText === 'no replies to this email') {
									await radioButtonElements[2].click();
									i = radioButtonElements.length;
								}
							}
						}
					});
					
					//show my phone
					if (listingsValues[i].contactInfo.showMyPhoneNumber) {
						it('set the show my phone number checkbox as ' + listingsValues[i].contactInfo.showMyPhoneNumber, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=show_phone_ok]', listingsValues[i].contactInfo.showMyPhoneNumber);
						});
						
						//phone calls ok
						if (listingsValues[i].contactInfo.phoneCallsOk) {
							it('set the phone calls OK checkbox as ' + listingsValues[i].contactInfo.phoneCallsOk, async () => {
								await UofC.setButtonCheckboxByCSS('input[name=contact_phone_ok]', listingsValues[i].contactInfo.phoneCallsOk);
							});
						}
						
						//text/sms ok
						if (listingsValues[i].contactInfo.textSmsOk) {
							it('set the text/sms OK checkbox as ' + listingsValues[i].contactInfo.textSmsOk, async () => {
								await UofC.setButtonCheckboxByCSS('input[name=contact_text_ok]', listingsValues[i].contactInfo.textSmsOk);
							});
						}
						
						//Phone Number
						it('type the phone number as ' + listingsValues[i].contactInfo.phoneNumber, async () => {
							await UofC.setTextFieldValueByCSS('input[name=contact_phone]', listingsValues[i].contactInfo.phoneNumber);
						});
						
						//Extension
						if (listingsValues[i].contactInfo.extension) {
							it('type the extension as ' + listingsValues[i].contactInfo.extension, async () => {
								await UofC.setTextFieldValueByCSS('input[name=contact_phone_extension]', listingsValues[i].contactInfo.extension);
							});
						}
						
						//Contact Name
						it('type the contact name as ' + listingsValues[i].contactInfo.contactName, async () => {
							await UofC.setTextFieldValueByCSS('input[name=contact_name]', listingsValues[i].contactInfo.contactName);
						});
					}
				});
				
				/////// LOCATION INFO
				if (listingsValues[i].locationInfo) {
					describe('fill in the main post\'s fields', () => {
						//show my address
						it('set the show my address checkbox as true', async () => {
							await UofC.setButtonCheckboxByCSS('input[name=show_address_ok]', true);
						});
						
						//Street
						it('type the street as ' + listingsValues[i].locationInfo.street, async () => {
							await UofC.setTextFieldValueByCSS('input[name=xstreet0]', listingsValues[i].locationInfo.street);
						});
						
						//Cross Street
						if (listingsValues[i].locationInfo.crossStreet) {
							it('type the cross street as ' + listingsValues[i].locationInfo.crossStreet, async () => {
								await UofC.setTextFieldValueByCSS('input[name=xstreet1]', listingsValues[i].locationInfo.crossStreet);
							});
						}
						
						//City
						it('type the cross street as ' + listingsValues[i].locationInfo.city, async () => {
							await UofC.setTextFieldValueByCSS('input[name=city]', listingsValues[i].locationInfo.city);
						});
						
						// OK for others to contact you about your services, products or commercial interests
						if (listingsValues[i].okForOthersToContactAboutOtherServices) {
							it('type the cross street as ' + listingsValues[i].okForOthersToContactAboutOtherServices, async () => {
								await UofC.setButtonCheckboxByCSS('input[name=contact_ok]', listingsValues[i].okForOthersToContactAboutOtherServices);
							});
						}
						
						// CLICK CONTINUE
						it('click the continue button', async () => {
							await UofC.clickElementByCSS('button[value=continue]');
						});
					});
				}
				
				//add map page displayed --- click Find or Continue ---- ADD ADDRESS (MAP) --- not sure how will do this
				describe('add the map', () => {
					it('wait for the add map page to load', async () => {
						await UofC.waitForObjectLoad('#map', waitLong, 500, true);
					});
					
					//maybe validate the correct values are displayed within the 'street', 'cross street', 'city' & 'postal code' fields - based on the inserted values
					
					///////////////////////////////////// NOTE: NOT NEEDED IF THE MAP ADDRESS IS CORRECT
					// ---- THIS IS NOT WORKING / TESTED YET
					/*
					it('mouse hover the pin image on the map', async () => {
						let pinImage = await driver.findElement(By.css('img.leaflet-marker-icon'));
						await UofC.mouseHover(pinImage);
						
						await driver.executeScript('window.scrollBy(0, 200);', pinImage);
					});
					*/
					
					
					
					///// LATEST - might be needed for robusteness//////
					/// type the street as:
					// #1 street:           listingsValues[i].locationInfo.street
					// #2 cross street:     listingsValues[i].locationInfo.crossStreet
					// #3 city:             listingsValues[i].locationInfo.city
					// #4 postal code:      listingsValues[i].postalCode
					/// click find ---> should find the address
					
					
					
					//click continue
					it('click the continue button', async () => {
						await UofC.clickElementByCSS('button[class*=continue]');    //<--- returns error if address is wrong/not found on the map
					});
				});
				
				///ADD IMAGES: --- TO DO ------------------------------------------------- BIG PIECE ---------------------------
				describe('add the images', () => {
					const attachmentImagesFolderPath = require('path').join(__dirname, '/attachments/' + listingsValues[i].postingTitle);
					
					//// COUNT NR OF FILES
					const fs = require('fs');
					let imageFiles, attachmentImageFilePath;
					
					/*
					fs.readdir(imagesAttachmentFolderPath, (err, files) => {
						console.log('\n\nnr of image files:' + files.length + '\n');   //WORKS - not available externally
					});
					
					fs.readdirSync(imagesAttachmentFolderPath).forEach(file => {
						console.log('file:' + file);    //WORKS - not available externally
					});
					*/
					
					///// BUILD THE ARRAY WITH THE RETURNED IMAGE NAMES / FULL PATHS
					imageFiles = fs.readdirSync(attachmentImagesFolderPath);
					
					//this FOR is not needed - TEMP
					for (let i = 0; i < imageFiles.length; i++) {
						//GET EACH NAME & ADD IT INTO THE imageFiles array
						attachmentImageFilePath = attachmentImagesFolderPath + '/' + imageFiles[i];
						console.log('attachmentImageFilePath: ' + attachmentImageFilePath);
					}
					// console.log('outside - imageFiles:' + imageFiles);
					
					it('wait for the add images page to load', async () => {
						await UofC.waitForObjectLoad('#plupload', waitLong, 500, true);
					});
					
					it('upload all images (' + imageFiles.length + ') of the ' + listingsValues[i].postingTitle + ' listing', async () => {
						//driver.findElement(By.id("input1")).sendKeys("path/to/first/file-001 \n path/to/first/file-002 \n path/to/first/file-003");
						
						//upload all of them one by one
						for (let i = 0; i < imageFiles.length; i++) {
							attachmentImageFilePath = attachmentImagesFolderPath + '/' + imageFiles[i];
							// NOTE: if below is not working then press the 'use classic uploader' and try again
							await UofC.setFileUploadByCSS('input[id*=html][type=file]', attachmentImageFilePath);
							
							//check the image upload block is displayed --- NOTE: can't always see it and fails here - to review later
							/*
							await UofC.waitForObjectLoad('.loading', waitLong * 2, 100, true);
							await UofC.waitForObjectLoad('.ui-progressbar', waitShort, 100, true);
							await UofC.waitForObjectLoad('.ui-progressbar-value', waitShort, 100, true);
							*/
							
							// WAIT UNTIL THE IMAGE IS UPLOADED (THE IMAGE UPLOAD BLOCK IS GONE)
							let imageUploaderProgressBar = await driver.findElements(By.css('.ui-progressbar-value'));
							if (imageUploaderProgressBar.length > 0) {
								let i = 0;
								while (i < 10 && imageUploaderProgressBar.length > 0) {// && elementSpinner) {
									// console.log('\n\n\nspinner found - waiting while it is there, i=' + i);
									await driver.sleep(waitLong * 2);
									
									//check again if the spinner is still there / exists
									imageUploaderProgressBar = await driver.findElements(By.css('.ui-progressbar-value'));
									
									if (imageUploaderProgressBar.length === 0) {
										i = 10;
									} else if (imageUploaderProgressBar > 0) {
										imageUploaderProgressBar = await driver.findElements(By.css('.ui-progressbar-value'));
										i++;
										if (i === 10 && imageUploaderProgressBar.length > 0) {
											console.warn('WARNING: image loading block is not gone yet, waited ' +
												(waitLong * 10) + ' seconds for it to disappear but it did not');
										}
									}
								}
							}
							await driver.sleep(1000);
						}
					});
					
					//click Done with Images -- when all uploaded
					it('click the done button', async () => {
						await UofC.clickElementByCSS('button.done');
					});
				});
				
				////VERIFY IF ALL ARE THERE NOW
				describe('verify the posting preview has the correct data --- NOT FULLY DONE', () => {
					it('wait for the posting preview page to load', async () => {
						await UofC.waitForObjectLoad('.draft_warning', waitLong, 500, true);
					});
					
					UofC.validateDisplayedTextContains('.draft_warning', 'this is an unpublished draft.');
					
					///TODO: validation after post created but not published
					//validate the title is correct
					
					//validate the description is correct
					
					//validate the price is correct
					
					//validate the sqft is correct
					
					//validate the address is correct
					
					//....etc - validate all possible values
					
				});
				
				describe('publish the posting and check it is displayed', () => {
					////click PUBLISH button (if not Published - goes to Draft)
					it('click publish button', async () => {
						await UofC.clickElementByCSS('button.button');
					});
					
					it('wait for the posting confirmation page to load', async () => {
						await UofC.waitForObjectLoad('.new-form h4', waitLong * 5, 500, true);
					});
					
					UofC.validateDisplayedTextEquals('.new-form h4', 'Thanks for posting! We really appreciate it!');
					//next one does not work as the app is changing the title too much and cannot match it with our title
					// AssertionError: expected 'vancouver.craigslist.org/van/apa/d/burnaby-3-bedroom-house-for-rent-in/6916127469.html'
					// to include
					// '3-bedroom-house-for-rent-in-burnaby' <--- here we have 35 chars but the order is different in the link so no match
					// UofC.validateDisplayedTextContains('.new-form ul>li:nth-child(1) a', ((listingsValues[i].postingTitle).replace(/ /g, '-')).substring(0, 35));
					
					it('sleep for ' + timer + ' seconds to randomize post\'s creation times', async () => {
						driver.sleep(timer * 1000); //sleep for up to 10 seconds --- so the posts are created with diff random times
					});
					
					it('navigate back to home page - click return to your account page link', async () => {
						await UofC.clickElementByCSS('.new-form ul>li:nth-child(3) a');
					});
					
					UofC.validateDisplayedTextEquals('.tabcontainer b', 'postings');
					UofC.validateDisplayedTextEquals('p.postinglist_title', 'showing most recent');
					
					it('validate the correct page has loaded -> account page + check posting is there - NOT FULLY DONE', async () => {
						await UofC.waitForObjectLoad('.tabcontainer b', waitLong * 3, 500, true);
						await UofC.waitForObjectLoad('p.postinglist_title', waitShort * 3, 500, true);
						console.log('wait - validate posting created');
					});
				});
			});
			
		});
	}
});