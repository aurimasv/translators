{
	"translatorID": "eb7059a4-35ec-4961-a915-3cf58eb9784b",
	"label": "Endnote XML",
	"creator": "Sebastian Karcher",
	"target": "xml",
	"minVersion": "4.0",
	"maxVersion": "",
	"priority": 100,
	"configOptions": {
		"getCollections": "true"
	},
	"displayOptions": {
		"exportCharset": "UTF-8",
		"exportNotes": true,
		"exportFileData": false
	},
	"inRepository": true,
	"translatorType": 3,
	"browserSupport": "g",
	"lastUpdated": "2014-02-12 17:03:50"
}

function detectImport() {

	var doc = Zotero.getXML().documentElement;

	if (!doc) {
		return false;
	} else if (ZU.xpathText(doc, '//record/ref-type')) return true;
}

var fields = ["pages", "volume", "number", "issue", "num-vols", "orig-pub", "edition", "section",
	"electronic-resource-num", "pub-location", "publisher", "isbn", "accession-num", "call-num", "report-id",
	"abstract", "work-type", "meeting-place", "remote-database-name", "language", "access-date", "custom1",
	"custom2", "custom3", "custom4", "custom5", "custom6", "custom7", "misc1", "misc2", "misc3", "auth-address",
	"auth-affiliaton", "secondary-volume", "secondary-issue", "num-vols", "edition", "section",
	"reprint-edition", "reprint-status", "coden", "label", "image", "caption", "work-type", "reviewed-item",
	"availability", "remote-source", "work-location", "work-extent", "pack-method", "size", "repro-ratio",
	"remote-database-provider"
]

var titleFields = ["title", "short-title", "secondary-title", "tertiary-title", "alt-title",
	"translated-title"
]

var dateFields = ["year", "pub-dates"]
var periodicalFields = ["full-title", "abbr-1", "abbr-2", "abbr-3"]
var authorFields = ["authors", "secondary-authors", "tertiary-authors", "subsidiary-authors",
	"translated-authors"
]

var attachmentFields = ["pdf-urls", "text-urls", "related-urls", "image-urls"]

var processItemType = {
	Artwork: "artwork",
	"Audiovisual Material": "videoRecording",
	Bill: "bill",
	"Book Section": "bookSection",
	Book: "book",
	"Case": "case",
	Catalog: "book",
	"Computer Program": "computerProgram",
	"Conference Proceedings": "conferencePaper", //still not clear on paper vs. proceedings
	"Web Page": "webpage",
	"Generic": "document",
	"Hearing": "hearing",
	"Journal Article": "journalArticle",
	"Magazine Article": "magazineArticle",
	Map: "map",
	"Film or Broadcast": "film",
	"Newspaper Article": "newspaperArticle",
	Pamphlet: "manuscript",
	Patent: "patent",
	"Personal Communication": "letter",
	Report: "report",
	"Edited Book": "book",
	Statute: "statute",
	Thesis: "thesis",
	"Unpublished Work": "manuscript",
	Manuscript: "manuscript",
	Figure: "artwork", //mapping
	"Chart or Table": "artwork", //mapping?
	"Equation": "artwork", //mapping?
	"Electronic Article": "journalArticle",
	"Electronic Book": "book",
	"Online Database": "webpage",
	"Government Document": "bill",
	"Conference Paper": "presentation",
	"Online Multimedia": "webpage",
	"Classical Work": "book", //mapping once we have something comparable in Zotero
	"Legal Rule or Regulation": "report", //or bill? statute?
	"Ancient Text": "book", //mapping
	Dictionary: "dictionaryEntry",
	Encyclopedia: "encyclopediaArticle",
	Grant: "report",
	"Aggregated Database": "webpage", //mapping?
	"Blog": "blogPost",
	"Serial": "book", //should map to periodical once we have that
	Standard: "report", //map to standard once we have that
	Dataset: "report", //map to dataset once we have that
	"Electronic Book Section": "bookSection",
	Music: "audioRecording"
}

var processNumberType = {
	2: "artwork",
	3: "videoRecording",
	4: "bill",
	5: "bookSection",
	6: "book",
	7: "case",
	8: "book",
	9: "computerProgram",
	10: "conferencePaper",
	12: "webpage",
	13: "document",
	14: "hearing",
	17: "journalArticle",
	19: "magazineArticle",
	20: "map",
	21: "film",
	23: "newspaperArticle",
	24: "manuscript",
	25: "patent",
	26: "letter",
	27: "report",
	28: "book",
	31: "statute",
	32: "thesis",
	34: "manuscript",
	36: "manuscript",
	37: "artwork",
	38: "artwork",
	39: "artwork",
	43: "journalArticle",
	44: "book",
	45: "wepage",
	46: "bill",
	47: "conferencePaper",
	48: "webpage",
	49: "book",
	50: "report",
	51: "book",
	52: "dictionaryEntry",
	53: "encyclopediaArticle",
	54: "report",
	55: "webpage",
	56: "blogPost",
	57: "book",
	58: "report",
	59: "report",
	60: "bookSection",
	61: "audioRecording"
}

var exportItemType = {
	artwork: "Artwork",
	audioRecording: "Music",
	bill: "Bill",
	blogPost: "Blog",
	book: "Book",
	bookSection: "Book Section",
	"case" :"Case",
	computerProgram: "Computer Program",
	conferencePaper: "Conference Proceedings",
	dictionaryEntry: "Dictionary",
	document: "Generic",
	mail: "Personal Communication",
	encyclopediaArticle: "Encyclopedia",
	film: "Film or Broadcast",
	forumPost: "Web Page",
	hearing: "Hearing",
	instantMessage: "Personal Communication",
	interview: "Personal Communication",
	journalArticle: "Journal Article",
	letter: "Personal Communication",
	magazineArticle: "Magazine Article",
	manuscript: "Manuscript",
	map: "Map",
	newspaperArticle: "Newspaper Article",
	patent: "Patent",
	podcast: "Film or Broadcast",
	presentation: "Conference Paper",
	radioBroadcast: "Film or Broadcast",
	report: "Report",
	statute: "Statute",
	thesis: "Thesis",
	tvBroadcast: "Film or Broadcast",
	videoRecording: "Audiovisual Material",
	webpage: "Web Page"
}

var exportRefNumber = {
	artwork: "2",
	videoRecording: "3",
	bill: "4",
	blogPost: "56",
	book: "6",
	bookSection: "5",
	"case": "6",
	computerProgram: "9",
	presentation: "47",
	conferencePaper: "10",
	dictionaryEntry: "52",
	encyclopediaArticle: "53",
	film: "21",
	podcast: "21",
	radioBroadcast: "21",
	tvBroadcast: "21",
	document: "13",
	hearing: "14",
	journalArticle: "17",
	magazineArticle: "19",
	manuscript: "36",
	map: "20",
	audioRecording: "61",
	newspaperArticle: "23",
	patent: "25",
	email: "26",
	instantMessage: "26",
	interview: "26",
	letter: "26",
	report: "27",
	statute: "31",
	thesis: "32",
	forumPost: "12",
	webpage: "12"
}



var fieldMap = {
	//same for all itemTypes
	abstract: "abstractNote",
	"call-num": "callNumber",
	"electronic-resource-num": "DOI",
	"remote-database-name": "libraryCatalog",
	"abbr-1": "journalAbbreviation",
	"short-title": "shortTitle",
	"full-title": "publicationTitle",
	language: "language",
	"access-date": "accessDate",
	//These two are in the RIS - not sure what they'd be in Endnote XML
	//DB:"archive",
	//AN:"archiveLocation",



	//type specific
	//tag => field:itemTypes
	//if itemType not explicitly given, __default field is used
	//  unless itemType is excluded in __exclude
	"title": {
		"__default": "title",
		subject: ["email"],
		caseName: ["case"],
		nameOfAct: ["statute"]
	},
	"secondary-title": {
		code: ["bill", "statute"],
		bookTitle: ["bookSection"],
		blogTitle: ["blogPost"],
		conferenceName: ["conferencePaper"],
		dictionaryTitle: ["dictionaryEntry"],
		encyclopediaTitle: ["encyclopediaArticle"],
		committee: ["hearing"],
		forumTitle: ["forumPost"],
		websiteTitle: ["webpage"],
		programTitle: ["radioBroadcast", "tvBroadcast"],
		meetingName: ["presentation"],
		seriesTitle: ["computerProgram", "map", "report"],
		series: ["book"],
		reporter: ["case"],
		publicationTitle: ["journalArticle", "magazineArticle", "newspaperArticle"]
	},
	"tertiary-title": {
		legislativeBody: ["hearing", "bill"],
		series: ["bookSection", "conferencePaper"],
		seriesTitle: ["audioRecording"]
	},
	//NOT HANDLED: reviewedAuthor, scriptwriter, contributor, guest
	"authors": {
		"__default": "author",
		"artist": ["artwork"],
		"cartographer": ["map"],
		"composer": ["audioRecording"],
		"director": ["film", "radioBroadcast", "tvBroadcast", "videoRecording"],
		"interviewee": ["interview"],
		"inventor": ["patent"],
		"podcaster": ["podcast"],
		"programmer": ["computerProgram"]
	},
	"secondary-authors": {
		"sponsor": ["bill"],
		"performer": ["audioRecording"],
		"presenter": ["presentation"],
		"interviewer": ["interview"],
		"editor": ["journalArticle", "bookSection", "conferencePaper", "dictionaryEntry", "document",
			"encyclopediaArticle"
		],
		"seriesEditor": ["book", "report"],
		"recipient": ["email", "instantMessage", "letter"],
		issuingAuthority: ["patent"]
	},
	"tertiary-authors": {
		"cosponsor": ["bill"],
		"producer": ["film", "tvBroadcast", "videoRecording", "radioBroadcast"],
		"editor": ["book"],
		"seriesEditor": ["bookSection", "conferencePaper", "dictionaryEntry", "encyclopediaArticle", "map"]
	},
	"subsidiary-authors": {
		"__default": "translator",
		"counsel": ["case"],
		"castMember": ["radioBroadcast", "tvBroadcast", "videoRecording"],
		"contributor": ["conferencePaper", "film"] //translator does not fit these
	},
	"work-type": {
		"manuscriptType": ["manuscript"],
		"websiteType": ["webpage"],
		"genre": ["film"],
		"postType": ["forumPost"],
		"letterType": ["letter"],
		"mapType": ["map"],
		"presentationType": ["presentation"],
		"reportType": ["report"],
		"thesisType": ["thesis"]
	},
	custom1: {
		filingDate: ["patent"], //not in spec
		scale: ["map"],
		place: ["conferencePaper"]
	},
	custom2: {
		issueDate: ["patent"]
		//PMCID:["journalArticle"] //handled below since we don't actually have that variable (yet)
	},
	custom3: {
		artworkSize: ["artwork"],
		proceedingsTitle: ["conferencePaper"],
		runningTime: ["videoRecording"],
		country: ["patent"]
	},
	custom4: {
		//RIS has this, but I can't find any reason for that: "creators/wordsBy":["audioRecording"], 
		"creators/attorneyAgent":["patent"], //we're not using this for export
		genre: ["film"]
	},
	custom5: {
		references: ["patent"],
		audioRecordingFormat: ["audioRecording", "radioBroadcast"],
		videoRecordingFormat: ["film", "tvBroadcast", "videoRecording"]
	},
	custom6: {
		legalStatus: ["patent"],
	},

	"pub-location": {
		"__default": "place",
		"__exclude": ["conferencePaper"] //exported/imported as "custom1"
	},
	"pub-dates": { //also see year when editing
		"__default": "date",
		dateEnacted: ["statute"],
		dateDecided: ["case"],
		issueDate: ["patent"]
	},
	edition: {
		"__default": "edition",
		//		"__ignore":["journalArticle"], //EPubDate.
		session: ["bill", "hearing", "statute"],
		version: ["computerProgram"]
	},
	issue: {
		"__default": "issue",
		numberOfVolumes: ["bookSection"]
	},

	misc1: {
		seriesNumber: ["book"],
		billNumber: ["bill"],
		system: ["computerProgram"],
		documentNumber: ["hearing"],
		applicationNumber: ["patent"],
		publicLawNumber: ["statute"],
		episodeNumber: ["podcast", "radioBroadcast", "tvBroadcast"]
	},
	misc2: {
		manuscriptType: ["manuscript"],
		mapType: ["map"],
		reportType: ["report"],
		thesisType: ["thesis"],
		websiteType: ["blogPost", "webpage"],
		postType: ["forumPost"],
		letterType: ["letter"],
		interviewMedium: ["interview"],
		presentationType: ["presentation"],
		artworkMedium: ["artwork"],
		audioFileType: ["podcast"]
	},
	"num-vols": {
		"__default": "numberOfVolumes",
		"__exclude": ["bookSection"] //uses "issue" instead
	},
	"orig-pub": {
		history: ["hearing", "statute", "bill", "case"],
		priorityNumbers: ["patent"]
	},
	publisher: {
		"__default": "publisher",
		label: ["audioRecording"],
		court: ["case"],
		distributor: ["film"],
		assignee: ["patent"],
		institution: ["report"],
		university: ["thesis"],
		company: ["computerProgram"],
		studio: ["videoRecording"],
		network: ["radioBroadcast", "tvBroadcast"]
	},
	year: { //duplicate of pud-dates, but this will only output year
		"__default": "date",
		dateEnacted: ["statute"],
		dateDecided: ["case"],
		issueDate: ["patent"]
	},
	section: {
		"__default": "section", //though this can refer to pages, start page, etc. for some types. Zotero does not support any of those combinations, however.
		"__exclude": ["case"]
	},
	isbn: {
		"__default": "ISBN",
		ISSN: ["journalArticle", "magazineArticle", "newspaperArticle"],
		patentNumber: ["patent"],
		reportNumber: ["report"],
	},
	pages: {
		"__default": "pages",
		codePages: ["bill"], //bill
		numPages: ["book", "thesis", "manuscript"],
		firstPage: ["case"],
		runningTime: ["film"]
	},
	number: {
		seriesNumber: ["bookSection", "book"],
		docketNumber: ["case"],
		artworkSize: ["artwork"]
	},
	volume: {
		"__default": "volume",
		codeNumber: ["statute"],
		codeVolume: ["bill"],
		reporterVolume: ["case"],
		"__exclude": ["patent", "webpage"]
	}
};


function getField(field, type) {
	if (typeof (fieldMap[field]) == 'object') {
		var def, zfield, exclude = false;
		for (var f in fieldMap[field]) {
			//__ignore is not handled here. It's returned as a Zotero field so it
			//can be explicitly excluded from the note attachment
			if (f == "__default") {
				//store default mapping in case we can't find anything explicit
				def = fieldMap[field][f];
				continue;
			}

			if (f == "__exclude") {
				if (fieldMap[field][f].indexOf(type) != -1) {
					exclude = true; //don't break. Let explicit mapping override this
				}
				continue;
			}

			if (fieldMap[field][f].indexOf(type) != -1) {
				zfield = f;
				break;
			}
		}

		//assign default value if not excluded
		if (!zfield && def && !exclude) zfield = def;
	} else if (typeof (fieldMap[field]) == 'string') {
		zfield = fieldMap[field];
	}
	return zfield;
}

function doImport() {
	var xml = Zotero.getXML();

	var records = ZU.xpath(xml, "//record");
	//Z.debug(records.length)
	for (var i = 0, n = records.length; i < n; i++) {
		var record = records[i];
		newItem = new Zotero.Item();
		//we prefer the name of the ref-type as it e.g. works with Mendeley and probably other Endnote 7 exports
		newItem.itemType = processItemType[ZU.xpathText(record, './/ref-type/@name')];
		//fall back to ref-type number
		if (!newItem.itemType) newItem.itemType = processNumberType[ZU.xpathText(record, './/ref-type')];
		var notecache = [];
		//Z.debug(newItem.itemType)
		for (var j = 0; j < record.children.length; j++) {
			var node = record.children[j]
			var field = node.nodeName;
			var zfield;

			if (zfield = getField(field, newItem.itemType)) {
				if (zfield.indexOf("creators") != -1) {
					var authortype = zfield.replace(/creators\//, "");
					newItem.creators.push(ZU.cleanAuthor(node.textContent, authortype))
				} else if (ZU.fieldIsValidForType(zfield, newItem.itemType)) newItem[zfield] = processField(node);
				else notecache.push(field + ": " + processField(node))
			} else if (field == "titles" || field == "periodical" || field == "alt-periodical") {
				for (var k = 0; k < node.children.length; k++) {
					var subnode = node.children[k];
					var subfield = subnode.nodeName;
					if (zfield = getField(subfield, newItem.itemType)) {
						//Z.debug(zfield)
						if (ZU.fieldIsValidForType(zfield, newItem.itemType)) newItem[zfield] = processField(subnode);
						else notecache.push(field + ": " + processField(subnode))
					} else notecache.push(subfield + ": " + processField(subnode))
				}
			} else if (field == "contributors") {
				for (var k = 0; k < node.children.length; k++) {
					var subnode = node.children[k];
					var subfield = subnode.nodeName;
					if (getField(subfield, newItem.itemType)) {
						var authortype = getField(subfield, newItem.itemType);
						var creators = subnode.getElementsByTagName("author");
						for (var l = 0; l < creators.length; l++) {
							if (authortype) newItem.creators.push(ZU.cleanAuthor(creators[l].textContent, authortype, true))
							else notecache.push(subfield + ": " + processField(subnode))
						}
					} else notecache.push(subfield + ": " + processField(subnode))
				}
			} else if (field == "dates") {
				var date = node.getElementsByTagName("pub-dates");
				var year = node.getElementsByTagName("year");
				if (date.length > 0 && year.length > 0) {
					date = date[0].getElementsByTagName("date")[0].textContent.trim();
					year = year[0].textContent.trim();
					if (date.search(/\d{4}/) != -1) newItem.date = date;
					else newItem.date = date + " " + year;
				} else if (date.length > 0) {
					newItem.date = date[0].firstChild.textContent;
				} else if (year.length > 0) {
					newItem.date = year[0].textContent;
				} else if (node.textContent.trim().length > 0) {
					//there is only copyright note left;
					notecache.push("copyright-dates: " + node.textContent)
				}

			} else if (field == "notes" || field == "research-notes") {
				newItem.notes.push(node.textContent.trim());
			} else if (field == "keywords") {
				for (var k = 0; k < node.children.length; k++) {
					var subnode = node.children[k];
					newItem.tags.push(subnode.textContent.trim())
				}
			} else if (field == "urls") {

				for (var k = 0; k < node.children.length; k++) {
					var subnode = node.children[k];
					var attachmenttype = "";
					if (subnode.nodeName == "text-urls") attachmenttype = "text/html";
					else if (subnode.nodeName == "web-urls") attachmenttype = "url";
					else if (subnode.nodeName == "related-urls") attachmenttype = "link";
					else if (subnode.nodeName == "pdf-urls") attachmenttype = "application/pdf";

					for (var l = 0; l < subnode.children.length; l++) {
						if (subnode.children[l].nodeType == 3) continue;
						var filepath = subnode.children[l].textContent;
						if (!filepath) continue
						//support for EndNote's relative paths
						filepath = filepath.replace(/^internal-pdf:\/\//i, 'PDF/').trim();
						var filename = filepath.replace(/.+\//, "").replace(/\.[^\.]+$/, "");
						if (attachmenttype == "url") newItem.url = subnode.textContent;
						else if (attachmenttype == "link") newItem.attachments.push({
							title: filename,
							url: filepath,
							mimetype: "text/html"
						})
						else newItem.attachments.push({
							title: filename,
							url: filepath,
							mimetype: attachmenttype
						})
					}
				}
			} else if (field.search(/custom[2,3,7]/) != -1 && (newItem.itemType == "book" || newItem.itemType ==
				"bookSection" || newItem.itemType == "journalArticle")) {
				//it'd be nice if we could do PMIDs as well, but doesn't look like they're mapped and we can't test for them reliably
				if (node.textContent.search(/PMC\d+/) != -1) {
					newItem.extra = "PMCID: " + node.textContent.match(/PMC\d+/i)[0];
				}
			} else if (field == "database" || field == "source-app" || field == "rec-number" || field == "ref-type" ||
				field == "foreign-keys");
			else notecache.push(node.nodeName + ": " + processField(node))

		}
		if (notecache.length > 0) newItem.notes.push(
			"The following values have no corresponding Zotero field:<br/>" + notecache.join("<br/>"))
		newItem.complete();
	}
}

function doExport() {
	Zotero.setCharacterSet("utf-8");
	var parser = new DOMParser();
	var doc = parser.parseFromString('<records/>', 'application/xml');

	var item;
	while (item = Zotero.nextItem()) {
		// Don't export notes or standalone attachments
		if (item.itemType === "note" || item.itemType === "attachment") continue;
		var record = doc.createElement("record");
		mapProperty(record, "database", "MyLibrary", {
			"name": "MyLibrary"
		});
		mapProperty(record, "source-app", "Zotero", {
			"name": "Zotero"
		});

		var type = exportItemType[item.itemType];
		var typeNumber = exportRefNumber[item.itemType];
		mapProperty(record, "ref-type", typeNumber, {
			"name": type
		})


		//Title elements
		var titles = doc.createElement("titles");
		for (var i = 0; i < titleFields.length; i++) {
			var titleField = titleFields[i];
			var zfield = getField(titleField, item.itemType);
			if (item[zfield]) mapProperty(titles, titleField, item[zfield]);
		}
		record.appendChild(titles);

		//Creators
		if (item.creators.length > 0) {
			var contributors = doc.createElement("contributors");
			for (var i = 0; i < authorFields.length; i++) {
				var custom4 =[];
				var type = getField(authorFields[i], item.itemType);
				for (var j = 0; j < item.creators.length; j++) {
					if (item.creators[j].creatorType == type) {
						var name = item.creators[j].lastName;
						if (item.creators[j].firstName) name = name + ", " + item.creators[j].firstName;
						//The first time for a given creatortype create the parent node
						if (contributors.getElementsByTagName(authorFields[i]).length == 0) {
							var creatornode = doc.createElement(authorFields[i]);
							mapProperty(creatornode, "author", name);
							contributors.appendChild(creatornode);
						}
						//if we already have this type, just append. 
						else {
							var creatornode = contributors.getElementsByTagName(authorFields[i])[0];
							mapProperty(creatornode, "author", name);
						}
					}
					//deal with creators that are mapped to regular fields, currently only one
					else if(item.creators[j].creatorType=="attorneyAgent"){						
						var name = item.creators[j].lastName;
						if (item.creators[j].firstName) name = name + ", " + item.creators[j].firstName;
						custom4.push(name);
					}
				}
			}
			if (custom4){
				mapProperty(record, "custom4", custom4.join("; "));
			}
			record.appendChild(contributors);
		}

		//Dates
		var dates = doc.createElement("dates");
		var zfield = getField("pub-dates", item.itemType);
		if (item[zfield]) {
			var pubdates = doc.createElement("pub-dates");
			dates.appendChild(pubdates);
			mapProperty(pubdates, "date", item[zfield]);
			var dateobject = ZU.strToDate(item[zfield]);
			if (dateobject.year) mapProperty(dates, "year", dateobject.year);
		}
		record.appendChild(dates)


		//periodicals
		var periodical = doc.createElement("periodical");
		var zfield = getField("full-title", item.itemType);
		if (item[zfield]) {
			mapProperty(periodical, "full-title", item[zfield]);
		}
		var zfield = getField("abbr-1", item.itemType);
		if (item[zfield]) {
			mapProperty(periodical, "abbr-1", item[zfield]);
		}
		if (periodical.children.length > 0) record.appendChild(periodical);

		//tags
		if (item.tags.length > 0) {
			var keywords = doc.createElement("keywords");
			for (var i = 0; i < item.tags.length; i++) {
				mapProperty(keywords, "keyword", item.tags[i].tag);
			}
			record.appendChild(keywords);
		}

		if (item.notes && Zotero.getOption("exportNotes")) {
			for (var i = 0; i < item.notes.length; i++) {
				mapProperty(record, "research-notes", item.notes[i].note)
			}
		}

		if (item.attachments || item.url) {
			var urls = doc.createElement("urls");
			if (item.url) {
				var weburls = doc.createElement("web-urls");
				urls.appendChild(weburls);
				mapProperty(weburls, "url", item.url);
			}
			for (var i in item.attachments) {
				var attachment = item.attachments[i];
				if (Zotero.getOption("exportFileData") && attachment.saveFile) {
					attachment.saveFile(attachment.defaultPath, true);
					if (attachment.mimeType == "application/pdf") {
						if (urls.getElementsByTagName("pdf-urls").length == 0) {
							var pdfurls = doc.createElement("pdf-urls");
							urls.appendChild(pdfurls)
						}
						mapProperty(pdfurls, "url", attachment.defaultPath);
					} else {
						if (urls.getElementsByTagName("text-urls").length == 0) {
							var texturls = doc.createElement("text-urls");
							urls.appendChild(texturls)
						}
						mapProperty(texturls, "url", attachment.defaultPath);
					}
				} else if (attachment.localPath) {
					if (attachment.mimeType == "application/pdf") {
						if (urls.getElementsByTagName("pdf-urls").length == 0) {
							var pdfurls = doc.createElement("pdf-urls");
							urls.appendChild(pdfurls)
						}
						mapProperty(pdfurls, "url", attachment.localPath);
					} else {
						if (urls.getElementsByTagName("text-urls").length == 0) {
							var texturls = doc.createElement("text-urls");
							urls.appendChild(texturls)
						}
						mapProperty(texturls, "url", attachment.localPath);
					}

				}
			}


			record.appendChild(urls)
		}



		for (var i = 0; i < fields.length; i++) {
			var field = fields[i]
			var zfield = getField(field, item.itemType);
			Z.debug(field + ": " + zfield);
			if (item[zfield]) mapProperty(record, field, item[zfield]);
		}


		doc.documentElement.appendChild(record);
	}

	Zotero.write('<?xml version="1.0"?>' + "\n");
	var serializer = new XMLSerializer();
	Zotero.write(serializer.serializeToString(doc));
}


//******IMPORT Functions

/**
 * Convert XML style elements to Zotero HTML mark-up
 * Works with nested style nodes or with multiple styling descriptors in a single face attribute
 *
 * @param {node} a DOM element
 *
 * @return {String} String with HTML mark-up
 */
function htmlify(node) {
	var	htmlstr ="";
	var face = { italic: "i", bold: "b", superscript: "sup", subscript: "sub" };
	(function repl(node) {
		if (!node) {
			return;
		}
		if (node.attributes && node.attributes.face){
			//we take the inner HTML of a node, add html tags around it or replace an embedded node. 
			var tags = node.attributes.face.value.split(/\s+/).map(function(f) { return face[f] || null; }).filter(function(v) { return v; });
			var newstring = (tags.length ? '<' + tags.join('><') + '>' : '') + node.innerHTML + (tags.length ? '</' + tags.reverse().join('></') + '>' : '');
			if (htmlstr.indexOf(node.outerHTML) != -1) {
				htmlstr = htmlstr.replace(node.outerHTML, newstring);
			} else {
				htmlstr = newstring;
			}
		}
		for (var i = 0; i < node.children.length; i++) {
			repl(node.children[i], htmlstr);
		}
	})(node);
	return htmlstr;
}


/**
 * Convert Endnote XML style elements to text, if applicable including Zotero HTML mark-up
 * @param {node} a DOM element
 *
 * @return {String} The text content
 */
function processField(node) {
	if (!node.textContent) return;
	else {
		var element = node.childNodes;
		var content = "";
		for (var i = 0; i < element.length; i++) {
			//we want pure text nodes included so we can deal with mixed nodes
			if (element[i].textContent) {
				//for text notes just print the text
				if (element[i].nodeType == 3) content += element[i].textContent;
				//parse style nodes for style elements
				else content += htmlify(element[i]);
			}
		}
		//don't remove line breaks from abstracts
		if (node.nodeName == "abstract") return content;
		else return content.replace(/[\n\t]*/g, "");
	}
}


//**********EXPORT Functions
/**
 * Convert Zotero rich text markup to specified syntax`
 *
 * @param {String} str String to convert
 * @param {Object} map A list of tags (in upper case) to convert.
 *   e.g. {
 *     B: {
 *       open: '<style face="bold">',
 *       close: '</style>'
 *     },
 *     SPAN: function(tag, attrs) {
 *       if(tag == 'SPAN' && attrs.indexOf('style="font-variant:small-caps;"') != -1)
 *         return { open: '<sc>', close: '</sc>' };
 *     }
 *   }
 * @param {Function} [escapeStr] Function that is passed a string to escape special characters
 *
 * @return {String} String with Zotero markup converted
 */
 

/**
 * If property is defined, this function adds an appropriate XML element as a child of
 * parentElement. Also converts elements with html mark-up to EndnoteXML style mark-up.
 * @param {Element} parentElement The parent of the new element to be created.
 * @param {String} elementName The name of the new element to be created.
 * @param {Any} property The property to inspect. If this property is defined and not
 *     null, false, or empty, a new element is created whose textContent is its value.
 * @param {Object} [attributes] If defined, this object defines attributes to be added
 *     to the new element.
 */
function mapProperty(parentElement, elementName, property, attributes) {
	if (!property && property !== 0) return null;
	var doc = parentElement.ownerDocument,
		newElement = doc.createElement(elementName);
	if (attributes) {
		for (var i in attributes) {
			newElement.setAttribute(i, attributes[i]);
		}
	}
	//if we don't have relevant tags, replace all html tags we can't do small caps anyway in Endnote XML, so remove those
	//this will also catch all URIs, which don't have < and >
	if (property.search(/\<(i|b|sup|sup)\>/) == -1) {
		property = property.replace(/\<.+?\>/g, "")
		newElement.appendChild(doc.createTextNode(property));
	} else {
		//we convert the markup to style elements and 
		property = "<style face=\"normal\">" + convertZoteroMarkup(property, map, escapeStr) + "</style>";
		//and then use this little trick to turn it into a DOM element
		var tempdoc = doc.createElement('tempdoc');
		tempdoc.innerHTML = property;
		var xmlnode = tempdoc.firstChild;
		newElement.appendChild(xmlnode);
	}

	parentElement.appendChild(newElement);
	return newElement;
}
 
 
var convertZoteroMarkup = (function () {
	var str, map, escapeStr, stack;

	function closeOpenTags(closingTagOpenPos, closingTagStart) {
		for (var j = stack.length - 1; j >= closingTagOpenPos; j--) {
			var tag = stack.pop();
			//take care of everything one level up preceeding this tag
			var preStrFrom = (stack[j - 1].innerStrLastPos || stack[j - 1].pos + stack[j - 1].len - 1) + 1;
			preStr = stack[j - 1].innerStr || '';

			if (preStrFrom < tag.pos) {
				//there is more to escape
				preStr += escapeStr(str.substring(preStrFrom, tag.pos));
			}

			//take care of the inner string
			var innerStrFrom = (tag.innerStrLastPos || tag.pos + tag.len - 1) + 1;
			var innerStr = tag.innerStr || '';
			if (innerStrFrom < closingTagStart) {
				innerStr += escapeStr(str.substring(innerStrFrom, closingTagStart));
			}

			var toTag = map[tag.tag];
			if (typeof toTag == 'function') toTag = toTag(tag.tag, tag.m[3] || '');

			stack[j - 1].innerStr = preStr + toTag.open + innerStr + toTag.close;
			stack[j - 1].innerStrLastPos = closingTagStart - 1;
		}
	}

	return function () {
		//set up environment
		str = arguments[0];
		map = arguments[1];
		escapeStr = arguments[2] || function (s) {
			return s
		}; //noop by default

		var tagRe = new RegExp('<(/?)(' + Object.keys(map).join('|') + ')(\s[^>]*)?>', 'i');
		stack = [{
			pos: 0,
			len: 0
		}]; //push an outside wrapper

		var i = -1;
		while ((i = str.indexOf('<', i + 1)) != -1) {
			var m = ZU.XRegExp.exec(str, tagRe, i, true);
			if (!m) continue;

			if (!m[1]) {
				//opening tag
				stack.push({
					tag: m[2].toUpperCase(),
					pos: i,
					len: m[0].length,
					m: m
				});
			} else {
				//closing tag
				//find last matching opening tag
				var last = stack.length - 1;
				while (last > 0 && stack[last].tag != m[2].toUpperCase()) {
					last--;
				}

				if (last <= 0) continue; //tag was never opened, ignore

				//close up open tags
				closeOpenTags(last, i);
				stack[stack.length - 1].innerStrLastPos += m[0].length;
			}

			i += m[0].length - 1;
		}

		closeOpenTags(1, str.length);

		//process whatever is left at the top level
		var newStr = stack[0].innerStr || '';
		var lastStrPos = (stack[0].innerStrLastPos || -1) + 1;
		if (lastStrPos < str.length) {
			newStr += escapeStr(str.substring(lastStrPos));
		}

		return newStr;
	};
})();

//character map formapping Zotero mark-up
var map = {

	I: {
		open: '<style face="italic">',
		close: '</style>'
	},
	B: {
		open: '<style face="bold">',
		close: '</style>'
	},
	SUP: {
		open: '<style face="superscript">',
		close: '</style>'
	},
	SUB: {
		open: '<style face="subscript">',
		close: '</style>'
	},
	SC: {
		open: '',
		close: ''
	},
	SPAN: {
		open: '',
		close: ''
	}
};

var escapeStr = function (str) {
	return str.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
};/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "import",
		"input": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xml>\n  <records>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Report\">10</ref-type>\n      <contributors>\n        <authors>\n          <author>Ahlquist, John S</author>\n          <author>Breunig, Christian</author>\n        </authors>\n      </contributors>\n      <titles>\n        <title>Country Clustering in Comparative Political Economy</title>\n      </titles>\n      <periodical/>\n      <pages>32</pages>\n      <keywords/>\n      <dates>\n        <year>2009</year>\n      </dates>\n      <pub-location>Cologne</pub-location>\n      <urls>\n        <pdf-urls>\n          <url>internal-pdf://Ahlquist and Breunig _ 2009 _ Country Clustering in Comparative Political Econom.pdf</url>\n        </pdf-urls>\n      </urls>\n    </record>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Book\">1</ref-type>\n      <contributors>\n        <authors>\n          <author>Dunnett, Nigel</author>\n          <author>Kingsbury, Noël</author>\n        </authors>\n      </contributors>\n      <titles>\n        <title>Planting green roofs and living walls</title>\n      </titles>\n      <periodical/>\n      <edition>2</edition>\n      <keywords/>\n      <dates>\n        <year>2008</year>\n      </dates>\n      <pub-location>Portland, OR</pub-location>\n      <publisher>Timber Press</publisher>\n      <isbn>0881929115</isbn>\n      <urls/>\n      <abstract>The latest techniques for planting roofs and walls to enhance our buildings and benefit the environment. The green roof industry is booming and the technology changing fast as professionals respond to the unique challenges of each new planting. In this comprehensively updated, fully revised edition of their authoritative reference, Nigel Dunnett and Nol Kingsbury reveal the very latest techniques, materials, and plants, and showcase some spectacular new case studies for the non-professional. Green roofs and walls reduce pollution and runoff, help insulate and reduce the maintenance needs of buildings, contribute to biodiversity, and provide habitats for wildlife. In addition to all this, they are attractive to look at and enhance the quality of life of residents. In Planting Green Roofs and Living Walls, Revised and Updated Edition, the authors describe and illustrate the practical techniques required to design, implement, and maintain a green roof or wall to the highest standards. This informative, up-to-the-minute reference will encourage gardeners everywhere to consider the enormous benefits to be gained from planting on their roofs and walls.</abstract>\n    </record>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Journal Article\">0</ref-type>\n      <contributors>\n        <authors>\n          <author>Foderaro, Lisa W</author>\n        </authors>\n      </contributors>\n      <titles>\n        <title>Rooftop greenhouse will boost city farming</title>\n        <secondary-title>New York Times</secondary-title>\n      </titles>\n      <periodical>\n        <full-title>New York Times</full-title>\n      </periodical>\n      <pages>A20</pages>\n      <keywords/>\n      <dates>\n        <year>2012</year>\n      </dates>\n      <pub-location>New York</pub-location>\n      <urls/>\n    </record>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Book\">1</ref-type>\n      <contributors>\n        <secondary-authors>\n          <author>Hancké, Bob</author>\n          <author>Rhodes, Martin</author>\n          <author>Thatcher, Mark</author>\n        </secondary-authors>\n      </contributors>\n      <titles>\n        <title>Beyond varieties of capitalism : Conflict, contradiction, and complementarities in the European economy</title>\n        <short-title>Beyond varieties of capitalism</short-title>\n      </titles>\n      <periodical/>\n      <keywords/>\n      <dates>\n        <year>2007</year>\n      </dates>\n      <pub-location>Oxford and New York</pub-location>\n      <publisher>Oxford University Press</publisher>\n      <isbn>9780199206483</isbn>\n      <urls/>\n    </record>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Book\">1</ref-type>\n      <contributors>\n        <authors>\n          <author>Isaacson, Walter</author>\n        </authors>\n      </contributors>\n      <titles>\n        <title>Steve Jobs</title>\n      </titles>\n      <periodical/>\n      <keywords/>\n      <dates>\n        <year>2011</year>\n      </dates>\n      <pub-location>New York, {NY}</pub-location>\n      <publisher>Simon &amp; Schuster</publisher>\n      <isbn>9781451648539</isbn>\n      <urls/>\n    </record>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Book Section\">7</ref-type>\n      <contributors>\n        <authors>\n          <author>Mares, Isabela</author>\n        </authors>\n        <secondary-authors>\n          <author>Hall, Peter A</author>\n          <author>Soskice, David</author>\n        </secondary-authors>\n      </contributors>\n      <titles>\n        <title>Firms and the welfare state: When, why, and how does social policy matter to employers?</title>\n        <secondary-title>Varieties of capitalism. The institutional foundations of comparative advantage</secondary-title>\n      </titles>\n      <periodical>\n        <full-title>Varieties of capitalism. The institutional foundations of comparative advantage</full-title>\n      </periodical>\n      <pages>184-213</pages>\n      <keywords/>\n      <dates>\n        <year>2001</year>\n      </dates>\n      <pub-location>New York</pub-location>\n      <publisher>Oxford University Press</publisher>\n      <urls/>\n    </record>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Book\">1</ref-type>\n      <contributors>\n        <authors>\n          <author>McInnis, Maurie Dee</author>\n          <author>Nelson, Louis P</author>\n        </authors>\n      </contributors>\n      <titles>\n        <title>Shaping the body politic: Art and political formation in early america</title>\n      </titles>\n      <periodical/>\n      <keywords/>\n      <dates>\n        <year>2011</year>\n      </dates>\n      <pub-location>Charlottesville, VA</pub-location>\n      <publisher>University of Virginia Press</publisher>\n      <isbn>0813931029</isbn>\n      <urls/>\n      <abstract>Traditional narratives imply that art in early America was severely limited in scope. By contrast, these essays collectively argue that visual arts played a critical role in shaping an early American understanding of the body politic. American artists in the late colonial and early national periods enlisted the arts to explore and exploit their visions of the relationship of the American colonies to the mother country and, later, to give material shape to the ideals of modern republican nationhood. Taking a uniquely broad view of both politics and art, Shaping the Body Politic ranges in topic from national politics to the politics of national identity, and from presidential portraits to the architectures of the ordinary. The book covers subject matter from the 1760s to the 1820s, ranging from Patience Wright's embodiment of late colonial political tension to Thomas Jefferson's designs for the entry hall at Monticello as a museum. Paul Staiti, Maurie {McInnis}, and Roger Stein offer new readings of canonical presidential images and spaces: Jean-Antoine Houdon's George Washington, Gilbert Stuart's the Lansdowne portrait of Washington, and Thomas Jefferson's Monticello. In essays that engage print and painting, portraiture and landscape, Wendy Bellion, David Steinberg, and John Crowley explore the formation of national identity. The volume's concluding essays, by Susan Rather and Bernard Herman, examine the politics of the everyday. The accompanying eighty-five illustrations and color plates demonstrate the broad range of politically resonant visual material in early America. {ContributorsWendy} Bellion, University of Delaware * John E. Crowley, Dalhousie University * Bernard L. Herman, University of North Carolina, Chapel Hill * Maurie D. {McInnis}, University of Virginia * Louis P. Nelson, University of Virginia * Susan Rather, University of Texas, Austin * Paul Staiti, Mount Holyoke College * Roger B. Stein, emeritus, University of Virginia * David Steinberg, Independent Scholar Thomas Jefferson Foundation Distinguished Lecture Series</abstract>\n    </record>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Patent\">25</ref-type>\n      <contributors>\n        <authors>\n          <author>Van Dan Elzen, Hans</author>\n        </authors>\n      </contributors>\n      <titles>\n        <title>Yo-yo having a modifiable string gap</title>\n      </titles>\n      <periodical/>\n      <isbn>WO2011US30214</isbn>\n      <keywords/>\n      <dates>\n        <year>2011</year>\n      </dates>\n      <urls/>\n      <abstract>The invention is a yo-yo that includes unique features that enable a user to adjust the yo-yo's string gap. In the preferred embodiment, at least one of the yo-yo's side assemblies includes a screw engaged to a nut that has two thru-bores located in a side-by-side relation. The screw is located to one side of the yo-yo's axis of rotation and can be rotated by a user to adjust the position of the associated side assembly on the yo-yo's axle structure. By appropriate positioning of the side assembly, a user can adjust the yo-yo's performance characteristics.</abstract>\n    </record>\n    <record>\n      <database name=\"endnote.enl\" path=\"endnote.enl\">endnote.enl</database>\n      <ref-type name=\"Web Page\">16</ref-type>\n      <titles>\n        <title>CSL search by example</title>\n        <secondary-title>Citation Style Editor</secondary-title>\n      </titles>\n      <periodical>\n        <full-title>Citation Style Editor</full-title>\n      </periodical>\n      <keywords/>\n      <urls>\n        <web-urls>\n          <url>http://editor.citationstyles.org/searchByExample/</url>\n        </web-urls>\n      </urls>\n    </record>\n  </records>\n</xml>",
		"items": [
			{
				"itemType": "report",
				"creators": [
					{
						"firstName": "John S.",
						"lastName": "Ahlquist",
						"creatorType": "author"
					},
					{
						"firstName": "Christian",
						"lastName": "Breunig",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Ahlquist and Breunig _ 2009 _ Country Clustering in Comparative Political Econom",
						"url": "PDF/Ahlquist and Breunig _ 2009 _ Country Clustering in Comparative Political Econom.pdf",
						"mimetype": "application/pdf"
					}
				],
				"title": "Country Clustering in Comparative Political Economy",
				"pages": "32",
				"date": "2009",
				"place": "Cologne"
			},
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Nigel",
						"lastName": "Dunnett",
						"creatorType": "author"
					},
					{
						"firstName": "Noël",
						"lastName": "Kingsbury",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Planting green roofs and living walls",
				"edition": "2",
				"date": "2008",
				"place": "Portland, OR",
				"publisher": "Timber Press",
				"ISBN": "0881929115",
				"abstractNote": "The latest techniques for planting roofs and walls to enhance our buildings and benefit the environment. The green roof industry is booming and the technology changing fast as professionals respond to the unique challenges of each new planting. In this comprehensively updated, fully revised edition of their authoritative reference, Nigel Dunnett and Nol Kingsbury reveal the very latest techniques, materials, and plants, and showcase some spectacular new case studies for the non-professional. Green roofs and walls reduce pollution and runoff, help insulate and reduce the maintenance needs of buildings, contribute to biodiversity, and provide habitats for wildlife. In addition to all this, they are attractive to look at and enhance the quality of life of residents. In Planting Green Roofs and Living Walls, Revised and Updated Edition, the authors describe and illustrate the practical techniques required to design, implement, and maintain a green roof or wall to the highest standards. This informative, up-to-the-minute reference will encourage gardeners everywhere to consider the enormous benefits to be gained from planting on their roofs and walls."
			},
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "Lisa W.",
						"lastName": "Foderaro",
						"creatorType": "author"
					}
				],
				"notes": [
					"The following values have no corresponding Zotero field:<br/>pub-location: New York"
				],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Rooftop greenhouse will boost city farming",
				"publicationTitle": "New York Times",
				"pages": "A20",
				"date": "2012"
			},
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Bob",
						"lastName": "Hancké",
						"creatorType": "seriesEditor"
					},
					{
						"firstName": "Martin",
						"lastName": "Rhodes",
						"creatorType": "seriesEditor"
					},
					{
						"firstName": "Mark",
						"lastName": "Thatcher",
						"creatorType": "seriesEditor"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Beyond varieties of capitalism : Conflict, contradiction, and complementarities in the European economy",
				"shortTitle": "Beyond varieties of capitalism",
				"date": "2007",
				"place": "Oxford and New York",
				"publisher": "Oxford University Press",
				"ISBN": "9780199206483"
			},
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Walter",
						"lastName": "Isaacson",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Steve Jobs",
				"date": "2011",
				"place": "New York, {NY}",
				"publisher": "Simon & Schuster",
				"ISBN": "9781451648539"
			},
			{
				"itemType": "bookSection",
				"creators": [
					{
						"firstName": "Isabela",
						"lastName": "Mares",
						"creatorType": "author"
					},
					{
						"firstName": "Peter A.",
						"lastName": "Hall",
						"creatorType": "editor"
					},
					{
						"firstName": "David",
						"lastName": "Soskice",
						"creatorType": "editor"
					}
				],
				"notes": [
					"The following values have no corresponding Zotero field:<br/>periodical: Varieties of capitalism. The institutional foundations of comparative advantage"
				],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Firms and the welfare state: When, why, and how does social policy matter to employers?",
				"bookTitle": "Varieties of capitalism. The institutional foundations of comparative advantage",
				"pages": "184-213",
				"date": "2001",
				"place": "New York",
				"publisher": "Oxford University Press"
			},
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Maurie Dee",
						"lastName": "McInnis",
						"creatorType": "author"
					},
					{
						"firstName": "Louis P.",
						"lastName": "Nelson",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Shaping the body politic: Art and political formation in early america",
				"date": "2011",
				"place": "Charlottesville, VA",
				"publisher": "University of Virginia Press",
				"ISBN": "0813931029",
				"abstractNote": "Traditional narratives imply that art in early America was severely limited in scope. By contrast, these essays collectively argue that visual arts played a critical role in shaping an early American understanding of the body politic. American artists in the late colonial and early national periods enlisted the arts to explore and exploit their visions of the relationship of the American colonies to the mother country and, later, to give material shape to the ideals of modern republican nationhood. Taking a uniquely broad view of both politics and art, Shaping the Body Politic ranges in topic from national politics to the politics of national identity, and from presidential portraits to the architectures of the ordinary. The book covers subject matter from the 1760s to the 1820s, ranging from Patience Wright's embodiment of late colonial political tension to Thomas Jefferson's designs for the entry hall at Monticello as a museum. Paul Staiti, Maurie {McInnis}, and Roger Stein offer new readings of canonical presidential images and spaces: Jean-Antoine Houdon's George Washington, Gilbert Stuart's the Lansdowne portrait of Washington, and Thomas Jefferson's Monticello. In essays that engage print and painting, portraiture and landscape, Wendy Bellion, David Steinberg, and John Crowley explore the formation of national identity. The volume's concluding essays, by Susan Rather and Bernard Herman, examine the politics of the everyday. The accompanying eighty-five illustrations and color plates demonstrate the broad range of politically resonant visual material in early America. {ContributorsWendy} Bellion, University of Delaware * John E. Crowley, Dalhousie University * Bernard L. Herman, University of North Carolina, Chapel Hill * Maurie D. {McInnis}, University of Virginia * Louis P. Nelson, University of Virginia * Susan Rather, University of Texas, Austin * Paul Staiti, Mount Holyoke College * Roger B. Stein, emeritus, University of Virginia * David Steinberg, Independent Scholar Thomas Jefferson Foundation Distinguished Lecture Series"
			},
			{
				"itemType": "patent",
				"creators": [
					{
						"firstName": "Hans",
						"lastName": "Van Dan Elzen",
						"creatorType": "inventor"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Yo-yo having a modifiable string gap",
				"patentNumber": "WO2011US30214",
				"date": "2011",
				"abstractNote": "The invention is a yo-yo that includes unique features that enable a user to adjust the yo-yo's string gap. In the preferred embodiment, at least one of the yo-yo's side assemblies includes a screw engaged to a nut that has two thru-bores located in a side-by-side relation. The screw is located to one side of the yo-yo's axis of rotation and can be rotated by a user to adjust the position of the associated side assembly on the yo-yo's axle structure. By appropriate positioning of the side assembly, a user can adjust the yo-yo's performance characteristics."
			},
			{
				"itemType": "webpage",
				"creators": [],
				"notes": [
					"The following values have no corresponding Zotero field:<br/>periodical: Citation Style Editor"
				],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "CSL search by example",
				"websiteTitle": "Citation Style Editor",
				"url": "http://editor.citationstyles.org/searchByExample/"
			}
		]
	},
	{
		"type": "import",
		"input": "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<xml>\n  <records>\n    <record>\n      <database name=\"My EndNote Library.enl\" path=\"C:\\BACK_THIS_UP\\Desktop\\My EndNote Library.enl\">My EndNote Library.enl</database>\n      <source-app name=\"EndNote\" version=\"16.0\">EndNote</source-app>\n      <rec-number>1</rec-number>\n      <foreign-keys>\n    <key app=\"EN\" db-id=\"dstt999adpex2qeprz9xtt0fe2rrpwtarfwv\">1</key>\n      </foreign-keys>\n      <ref-type name=\"Journal Article\">17</ref-type>\n      <contributors>\n      </contributors>\n      <titles>\n\t<title>\n\t  <style face=\"normal\" font=\"default\" size=\"100%\">Plain </style>\n\t  <style face=\"bold\" font=\"default\" size=\"100%\">Bold</style>\n\t  <style face=\"italic\" font=\"default\" size=\"100%\"> Italics</style>\n\t  <style face=\"normal\" font=\"default\" size=\"100%\"> \n\t  </style>\n\t  <style face=\"underline\" font=\"default\" size=\"100%\">Underline</style>\n\t  <style face=\"normal\" font=\"default\" size=\"100%\"> \n\t  </style>\n\t  <style face=\"superscript\" font=\"default\" size=\"100%\">Superscript</style>\n\t  <style face=\"normal\" font=\"default\" size=\"100%\"> \n\t  </style>\n\t  <style face=\"subscript\" font=\"default\" size=\"100%\">Subscript</style>\n\t  <style face=\"normal\" font=\"default\" size=\"100%\"> \n\t  </style>\n\t  <style face=\"normal\" font=\"Symbol\" charset=\"2\" size=\"100%\">SymbolFont</style>\n\t  <style face=\"normal\" font=\"default\" size=\"100%\"> \n\t  </style>\n\t  <style face=\"normal\" font=\"Courier New\" size=\"100%\">CourierNew</style>\n\t  <style face=\"normal\" font=\"default\" size=\"100%\"> \n\t  </style>\n\t  <style face=\"normal\" font=\"default\" size=\"7\">SmallerSize</style>\n\t  <style face=\"normal\" font=\"default\" size=\"100%\"> \n\t  </style>\n\t  <style face=\"normal\" font=\"default\" size=\"12\">Size12 </style>\n\t  <style face=\"bold italic underline superscript\" font=\"Times New Roman\" size=\"100%\">TimesNewRoman-Bold-Italics-Underline-Superscript</style>\n\t</title>\n      </titles>\n      <dates>\n      </dates>\n      <urls>\n      </urls>\n    </record>\n  </records>\n</xml>",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"title": "Plain   <b>Bold</b>  <i> Italics</i>       Underline       <sup>Superscript</sup>       <sub>Subscript</sub>       SymbolFont       CourierNew       SmallerSize       Size12   <b><i><sup>TimesNewRoman-Bold-Italics-Underline-Superscript</sup></i></b>"
			}
		]
	}
]
/** END TEST CASES **/