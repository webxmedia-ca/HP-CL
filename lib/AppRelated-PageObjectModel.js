/**
 * Created by valeriu.jecov on 18/10/2018.
 */

/* jshint -W024 */
/* jshint -W014 */
/* jshint laxcomma:true */
/* jshint expr:true */

const expect = require('chai').expect;

const AppRelatedPageObjectModel = (() => {
	
	const PageObjectModel = require('./Common');
	
	let driver
	 // , webDriver
	 , By
	 , until
	 , waitShort
	 , waitLong
	 , initialized
	 , harnessObj
	 , username
	 , password
	 , baseUrl
	 , displayName
	 , env;
	
	PageObjectModel.init = (harnessObjIn, waitShortIn, waitLongIn) => {
		PageObjectModel.initBase(harnessObjIn, waitShortIn, waitLongIn);
		
		const attrs = PageObjectModel.getAttrs();
		driver = attrs.driver;
		By = attrs.By;
		until = attrs.until;
		waitShort = attrs.waitShort;
		waitLong = attrs.waitLong;
		initialized = attrs.initialized;
		harnessObj = attrs.harnessObj;
		username = attrs.username;
		password = attrs.password;
		baseUrl = attrs.baseUrl;
		displayName = attrs.displayName;
		env = attrs.env;
	};
	
	
	
	return PageObjectModel;
})();

module.exports = AppRelatedPageObjectModel;
