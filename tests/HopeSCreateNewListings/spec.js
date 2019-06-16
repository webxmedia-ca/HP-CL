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
	describe('add a new post to ' + listingsValues.postingRegionLocation + ' area', () => {
		describe('start creating a new post', () => {
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
			
			it('validate the correct page has loaded -> choose the location that fits best', async () => {
				await UofC.waitForObjectLoad('.picker>.selection-list', waitLong, 500, true);
				await UofC.waitForObjectLoad('.formnote:nth-child(1)>b', waitShort, 500, true);
				await UofC.validateDisplayedTextEquals('.formnote:nth-child(1)>b', 'choose the location that fits best:');
			});
		});
		
		describe('chose nearest area', () => {
			it('set the location that fits best as ' + listingsValues.locationThatFitsBest, async () => {
				await UofC.setButtonRadioFieldValueByCSS('.picker>.selection-list input', listingsValues.locationThatFitsBest); //'1'
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
				await UofC.validateDisplayedTextEquals('.formnote>b', 'what type of posting is this:');
			});
		});
		
		describe('choose type', () => {
			it('set the type of posting as ' + listingsValues.typeOfPosting, async () => {
				await UofC.setButtonRadioFieldValueByCSS('.picker>.selection-list input', listingsValues.typeOfPosting);    //'ho'
			});
			
			it('validate the correct page has loaded -> choose category', async () => {
				await UofC.waitForObjectLoad('.variant-radio', waitLong, 500, true);
				await UofC.waitForObjectLoad('.formnote>b', waitShort, 500, true);
				await UofC.validateDisplayedTextEquals('.formnote>b', 'please choose a category:');
			});
		});
		
		describe('choose category', () => {
			it('set the category as ' + listingsValues.postingCategory, async () => {
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
			
			it('validate the correct page has loaded -> create posting', async () => {
				await UofC.waitForObjectLoad('#postingForm', waitLong, 500, true);
				await UofC.waitForObjectLoad('input[name=PostingTitle]', waitShort, 500, true);
				await UofC.validateDisplayedTextEquals('.contact-info p', 'listings@hopestreet.ca');
			});
		});
		
		describe('create posting - fill in the posting values', () => {
			//TO BE CONTINUED --------- fill in the form with fields
			//maybe verify selected value within the 'category' drop down is right...
			//select[name=CategoryID] should equal -> listingsValues.postingCategory [NOTE: not always visible]
			
			describe('set up the main post\'s values', () => {
				//Posting title
				it('type the posting title as ' + listingsValues.postingTitle, async () => {
					await UofC.setTextFieldValueByCSS('input[name=PostingTitle]', listingsValues.postingTitle);
				});
				
				//City or Neighborhood
				if (listingsValues.cityOrNeighborhood) {
					it('type the city or neighborhood as ' + listingsValues.cityOrNeighborhood, async () => {
						await UofC.setTextFieldValueByCSS('input[name=GeographicArea]', listingsValues.cityOrNeighborhood);
					});
				}
				
				//Posting postal code
				it('type the posting title as ' + listingsValues.postalCode, async () => {
					await UofC.setTextFieldValueByCSS('input[name=postal]', listingsValues.postalCode);
				});
				
				//Description
				it('type the description as ' + listingsValues.postingDescription, async () => {
					await UofC.setTextFieldValueByCSS('textarea[name=PostingBody]', listingsValues.postingDescription);
				});
			});
			
			// POSTING DETAILS section:
			describe('set up the posting details values', () => {
				//Rent
				it('type the rent as ' + listingsValues.postingDetails.rentPrice, async () => {
					await UofC.setTextFieldValueByCSS('input[name=price]', listingsValues.postingDetails.rentPrice);
				});
				
				
				//SQFT (maybe switch the order)
				if (listingsValues.postingDetails.sqft) {
					it('type the sqft as ' + listingsValues.postingDetails.sqft, async () => {
						await UofC.setTextFieldValueByCSS('input[name=Sqft]', listingsValues.postingDetails.sqft);
					});
				}
				
				//Housing Type (maybe switch the order)
				if (listingsValues.postingDetails.housingType) {
					it('select the housing type as ' + listingsValues.postingDetails.housingType, async () => {
						await driver.wait(until.elementLocated(By.css('label[class*=housing_type] span.ui-widget')), waitLong);
						let housingTypeDropDownElement = await driver.findElement(By.css('label[class*=housing_type] span.ui-widget'));
						await housingTypeDropDownElement.click();
						
						let housingTypeListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
						if (housingTypeListElements.length > 0) {
							let housingTypeListElementText;
							for (let i = 0; i < housingTypeListElements.length; i++) {
								housingTypeListElementText = await housingTypeListElements[i].getText();
								if (housingTypeListElementText === listingsValues.postingDetails.housingType) {
									await housingTypeListElements[i].click();
									i = housingTypeListElements.length;
								}
							}
						}
					});
				}
				
				//Laundry
				if (listingsValues.postingDetails.laundry) {
					it('select the laundry as ' + listingsValues.postingDetails.laundry, async () => {
						await driver.wait(until.elementLocated(By.css('label[class*=laundry] span.ui-widget')), waitLong);
						let laundryDropDownElement = await driver.findElement(By.css('label[class*=laundry] span.ui-widget'));
						await laundryDropDownElement.click();
						
						let laundryListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
						if (laundryListElements.length > 0) {
							let laundryListElementText;
							for (let i = 0; i < laundryListElements.length; i++) {
								laundryListElementText = await laundryListElements[i].getText();
								if (laundryListElementText === listingsValues.postingDetails.laundry) {
									await laundryListElements[i].click();
									i = laundryListElements.length;
								}
							}
						}
					});
				}
				
				//Parking
				if (listingsValues.postingDetails.parking) {
					it('select the parking as ' + listingsValues.postingDetails.parking, async () => {
						await driver.wait(until.elementLocated(By.css('label[class*=parking] span.ui-widget')), waitLong);
						let parkingDropDownElement = await driver.findElement(By.css('label[class*=parking] span.ui-widget'));
						await parkingDropDownElement.click();
						
						let parkingListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
						if (parkingListElements.length > 0) {
							let parkingListElementText;
							for (let i = 0; i < parkingListElements.length; i++) {
								parkingListElementText = await parkingListElements[i].getText();
								if (parkingListElementText === listingsValues.postingDetails.parking) {
									await parkingListElements[i].click();
									i = parkingListElements.length;
								}
							}
						}
					});
				}
				
				//Bedrooms
				if (listingsValues.postingDetails.bedrooms) {
					it('select the bedrooms as ' + listingsValues.postingDetails.bedrooms, async () => {
						await driver.wait(until.elementLocated(By.css('label[class*=Bedrooms] span.ui-widget')), waitLong);
						let bedroomsDropDownElement = await driver.findElement(By.css('label[class*=Bedrooms] span.ui-widget'));
						await bedroomsDropDownElement.click();
						
						let bedroomsListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
						if (bedroomsListElements.length > 0) {
							let bedroomsListElementText;
							for (let i = 0; i < bedroomsListElements.length; i++) {
								bedroomsListElementText = await bedroomsListElements[i].getText();
								if (bedroomsListElementText === listingsValues.postingDetails.bedrooms) {
									await bedroomsListElements[i].click();
									i = bedroomsListElements.length;
								}
							}
						}
					});
				}
				
				//Bathrooms
				if (listingsValues.postingDetails.bathrooms) {
					it('select the bathrooms as ' + listingsValues.postingDetails.bathrooms, async () => {
						await driver.wait(until.elementLocated(By.css('label[class*=bathrooms] span.ui-widget')), waitLong);
						let bathroomsDropDownElement = await driver.findElement(By.css('label[class*=bathrooms] span.ui-widget'));
						await bathroomsDropDownElement.click();
						
						let bathroomsListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
						if (bathroomsListElements.length > 0) {
							let bathroomsListElementText;
							for (let i = 0; i < bathroomsListElements.length; i++) {
								bathroomsListElementText = await bathroomsListElements[i].getText();
								if (bathroomsListElementText === listingsValues.postingDetails.bathrooms) {
									await bathroomsListElements[i].click();
									i = bathroomsListElements.length;
								}
							}
						}
					});
				}
				
				/////// CHECKBOXES
				//Cats ok
				if (listingsValues.postingDetails.catsOk) {
					it('set the cats ok checkbox as ' + listingsValues.postingDetails.catsOk, async () => {
						await UofC.setButtonCheckboxByCSS('input[name=pets_cat]', listingsValues.postingDetails.catsOk);
					});
				}
				
				//Dogs ok
				if (listingsValues.postingDetails.dogsOk) {
					it('set the dogs ok checkbox as ' + listingsValues.postingDetails.dogsOk, async () => {
						await UofC.setButtonCheckboxByCSS('input[name=pets_dog]', listingsValues.postingDetails.dogsOk);
					});
				}
				
				//Furnished
				if (listingsValues.postingDetails.furnished) {
					it('set the furnished checkbox as ' + listingsValues.postingDetails.furnished, async () => {
						await UofC.setButtonCheckboxByCSS('input[name=is_furnished]', listingsValues.postingDetails.furnished);
					});
				}
				
				//No Smoking
				if (listingsValues.postingDetails.noSmoking) {
					it('set the furnished checkbox as ' + listingsValues.postingDetails.noSmoking, async () => {
						await UofC.setButtonCheckboxByCSS('input[name=no_smoking]', listingsValues.postingDetails.noSmoking);
					});
				}
				
				//Wheelchair Accessible
				if (listingsValues.postingDetails.wheelchairAccessible) {
					it('set the furnished checkbox as ' + listingsValues.postingDetails.wheelchairAccessible, async () => {
						await UofC.setButtonCheckboxByCSS('input[name=wheelchaccess]', listingsValues.postingDetails.wheelchairAccessible);
					});
				}
				
				//Available On & Open House Dates
				if (listingsValues.postingDetails.availableOn) {
					describe('set up the available on and open house values', () => {
						it('type the available on as ' + listingsValues.postingDetails.availableOn, async () => {
							await UofC.setTextFieldValueByCSS('input[class*=movein_date][class*=datepicker]', listingsValues.postingDetails.availableOn);
							let calendarElement = await driver.findElement(By.css('input[class*=movein_date][class*=datepicker]'));
							await calendarElement.sendKeys('\n');
							await driver.sleep(500);
						});
						
						if (listingsValues.postingDetails.openHouseDates1) {
							it('select the open house date #1 as ' + listingsValues.postingDetails.openHouseDates1, async () => {
								await driver.wait(until.elementLocated(By.css('label[class*=sale_date_1] span.ui-widget')), waitLong);
								let openHouseDropDownElementOne = await driver.findElement(By.css('label[class*=sale_date_1] span.ui-widget'));
								await openHouseDropDownElementOne.click();
								
								let openHouseListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
								if (openHouseListElements.length > 0) {
									let openHouseListElementText;
									for (let i = 0; i < openHouseListElements.length; i++) {
										openHouseListElementText = await openHouseListElements[i].getText();
										if (openHouseListElementText === listingsValues.postingDetails.openHouseDates1) {
											await openHouseListElements[i].click();
											i = openHouseListElements.length;
										}
									}
								}
							});
						}
						
						if (listingsValues.postingDetails.openHouseDates2) {
							it('select the open house date #2 as ' + listingsValues.postingDetails.openHouseDates2, async () => {
								await driver.wait(until.elementLocated(By.css('label[class*=sale_date_2] span.ui-widget')), waitLong);
								let openHouseDropDownElementTwo = await driver.findElement(By.css('label[class*=sale_date_2] span.ui-widget'));
								await openHouseDropDownElementTwo.click();
								
								let openHouseListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
								if (openHouseListElements.length > 0) {
									let openHouseListElementText;
									for (let i = 0; i < openHouseListElements.length; i++) {
										openHouseListElementText = await openHouseListElements[i].getText();
										if (openHouseListElementText === listingsValues.postingDetails.openHouseDates2) {
											await openHouseListElements[i].click();
											i = openHouseListElements.length;
										}
									}
								}
							});
						}
						
						if (listingsValues.postingDetails.openHouseDates3) {
							it('select the open house date #3 as ' + listingsValues.postingDetails.openHouseDates3, async () => {
								await driver.wait(until.elementLocated(By.css('label[class*=sale_date_3] span.ui-widget')), waitLong);
								let openHouseDropDownElementThree = await driver.findElement(By.css('label[class*=sale_date_3] span.ui-widget'));
								await openHouseDropDownElementThree.click();
								
								let openHouseListElements = await driver.findElements(By.css('div.ui-selectmenu-menu>ul[aria-hidden=false]>li'));
								if (openHouseListElements.length > 0) {
									let openHouseListElementText;
									for (let i = 0; i < openHouseListElements.length; i++) {
										openHouseListElementText = await openHouseListElements[i].getText();
										if (openHouseListElementText === listingsValues.postingDetails.openHouseDates3) {
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
				it('set the email privacy options radio button as ' + listingsValues.contactInfo.emailPrivacy, async () => {
					const radioButtonElements = await driver.findElements(By.css('div.email-privacy .radio-option input'));
					if (radioButtonElements.length > 0) {
						let radioButtonElement, radioButtonLabel, radioButtonText;
						for (let i = 0; i < radioButtonElements.length; i++) {
							radioButtonElement = await radioButtonElements[i].findElement(By.xpath('..'));
							radioButtonLabel = await radioButtonElement.findElement(By.css('span'));
							radioButtonText = await radioButtonLabel.getText();
							if (radioButtonText === listingsValues.contactInfo.emailPrivacy &&
								radioButtonText === 'CL mail relay (recommended)') {
								await radioButtonElements[0].click();
								i = radioButtonElements.length;
							}
							
							if (radioButtonText === listingsValues.contactInfo.emailPrivacy &&
								radioButtonText === 'show my real email address') {
								await radioButtonElements[1].click();
								i = radioButtonElements.length;
							}
							
							if (radioButtonText === listingsValues.contactInfo.emailPrivacy &&
								radioButtonText === 'no replies to this email') {
								await radioButtonElements[2].click();
								i = radioButtonElements.length;
							}
						}
					}
				});
				
				//show my phone
				if (listingsValues.contactInfo.showMyPhoneNumber) {
					it('set the show my phone number checkbox as ' + listingsValues.contactInfo.showMyPhoneNumber, async () => {
						await UofC.setButtonCheckboxByCSS('input[name=show_phone_ok]', listingsValues.contactInfo.showMyPhoneNumber);
					});
					
					//phone calls ok
					if (listingsValues.contactInfo.phoneCallsOk) {
						it('set the phone calls OK checkbox as ' + listingsValues.contactInfo.phoneCallsOk, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=contact_phone_ok]', listingsValues.contactInfo.phoneCallsOk);
						});
					}
					
					//text/sms ok
					if (listingsValues.contactInfo.textSmsOk) {
						it('set the text/sms OK checkbox as ' + listingsValues.contactInfo.textSmsOk, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=contact_text_ok]', listingsValues.contactInfo.textSmsOk);
						});
					}
					
					//Phone Number
					it('type the phone number as ' + listingsValues.contactInfo.phoneNumber, async () => {
						await UofC.setTextFieldValueByCSS('input[name=contact_phone]', listingsValues.contactInfo.phoneNumber);
					});
					
					//Extension
					if (listingsValues.contactInfo.extension) {
						it('type the extension as ' + listingsValues.contactInfo.extension, async () => {
							await UofC.setTextFieldValueByCSS('input[name=contact_phone_extension]', listingsValues.contactInfo.extension);
						});
					}
					
					//Contact Name
					it('type the contact name as ' + listingsValues.contactInfo.contactName, async () => {
						await UofC.setTextFieldValueByCSS('input[name=contact_name]', listingsValues.contactInfo.contactName);
					});
				}
			});
			
			/////// LOCATION INFO
			if (listingsValues.locationInfo) {
				describe('fill in the main post\'s fields', () => {
					//show my address
					it('set the show my address checkbox as true', async () => {
						await UofC.setButtonCheckboxByCSS('input[name=show_address_ok]', true);
					});
					
					//Street
					it('type the street as ' + listingsValues.locationInfo.street, async () => {
						await UofC.setTextFieldValueByCSS('input[name=xstreet0]', listingsValues.locationInfo.street);
					});
					
					//Cross Street
					if (listingsValues.locationInfo.crossStreet) {
						it('type the cross street as ' + listingsValues.locationInfo.crossStreet, async () => {
							await UofC.setTextFieldValueByCSS('input[name=xstreet1]', listingsValues.locationInfo.crossStreet);
						});
					}
					
					//City
					it('type the cross street as ' + listingsValues.locationInfo.city, async () => {
						await UofC.setTextFieldValueByCSS('input[name=city]', listingsValues.locationInfo.city);
					});
					
					// OK for others to contact you about your services, products or commercial interests
					if (listingsValues.okForOthersToContactAboutOtherServices) {
						it('type the cross street as ' + listingsValues.okForOthersToContactAboutOtherServices, async () => {
							await UofC.setButtonCheckboxByCSS('input[name=contact_ok]', listingsValues.okForOthersToContactAboutOtherServices);
						});
					}
					
					// CLICK CONTINUE
					it('click continue button', async () => {
						await UofC.clickElementByCSS('button[value=continue]');
					});
				});
			}
			
			//add map page displayed --- click Find or Continue ---- ADD ADDRESS (MAP) --- not sure how will do this
			describe('add the map', () => {
				it('wait for add map page to load', async () => {
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
				
				it('click continue button', async () => {
					await UofC.clickElementByCSS('button[class*=continue]');    //<--- returns error if address is wrong/not found on the map
				});
			});
			
			///ADD IMAGES: --- TO DO ------------------------------------------------- BIG PIECE ---------------------------
			describe('add the images', () => {
				const imagesAttachmentFilePath = require('path').join(__dirname, '/attachments/' + listingsValues.postingTitle);
				
				//// COUNT NR OF FILES
				const fs = require('fs');
				const dir = imagesAttachmentFilePath;
				
				fs.readdir(dir, (err, files) => {
					console.log('\n\nnr of image files:' + files.length + '\n\n\n');   //WORKS
				});
				
				//NOW build the ARRAY WITH IMAGE NAMES
				//GET EACH NAME & ADD IT TO THE imagesAttachmentFilePath
				
				it('wait for add images page to load', async () => {
					await UofC.waitForObjectLoad('#plupload', waitLong, 500, true);
				});
				
				
				/////// TODO NEXT:
				it('upload all images of the ' + listingsValues.postingTitle + ' listing', async () => {
					//count the nr of images
					let imagesCounter;
					let eachImageNameArray;
					
					//upload all of them one by one
					let imageAttachmentFilePath = imagesAttachmentFilePath + '/' + eachImageNameArray[i];
					await UofC.setFileUploadByCSS('input[id*=html][type=file]', imageAttachmentFilePath);
				});
				
				
				//click Done with Images -- when all uploaded
				
				
				////VERIFY IF ALL ARE THERE NOW
				
				
				////click PUBLISH button (if not Published - goes to Draft)
			});
		});
		
	});
});