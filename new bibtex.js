var bibtexIterator = function() { 
	this.BufferedReader = new BufferedReader(Zotero.read);
	this.strings = {};
	this.items = {};	//keeps track of processed items for cross-refs
	this.needCrossRef = {}; //items that are awaiting cross-referenced items
	this.checkCrossRef = [];	//item keys that we need to check crossrefs for
};

//don't bother processing these entry types
bibtexIterator.prototype.ignoreTypes = ['comment', 'preamble'];

//get the next bibtexItem in BibTeX format
//(i.e. fields are BibTeX fields and values are all converted to strings)
//This might not be in order that items appear in the BibTeX file due to cross-references
bibtexIterator.prototype.next = function() {
	//check if we can return some of the items that were waiting for a crossref
	if(this.checkCrossRef.length) {
		var key;
		while(key = this.checkCrossRef[0]) {
			var items = this.needCrossRef[key];
			if(!items || !items.length) {
				if(items) delete this.needCrossRef[key];	//remove the empty array. We should not need it any more anyway
				this.checkCrossRef.shift();
				continue;
			}
			
			var item = items.shift();
			this.supplementItem(item, this.items[key]);
			if(this.needCrossRef[item.fields._itemkey.toLowerCase()]) {
				this.checkCrossRef.push(item.fields._itemkey.toLowerCase());
			}
			return item;
		}
	}
	
	//read to the next @ character
	var CHUNK_SIZE = 4096;
	var text = this.BufferedReader.read(CHUNK_SIZE);
	var i;
	while(text && (i = text.indexOf('@')) != -1) {
		text = this.BufferedReader.read(CHUNK_SIZE);
	}
	if(!text) throw StopIteration;
	
	this.BufferedReader.push(text.substring(i+1));	//@ is gone
	
	var line = this.BufferedReader.readLine();
	if(line === false) throw StopIteration;
	
	var m = line.match(bibtexTypeKeyRE);
	if(!m || this.ignoreTypes.indexOf(m[1].toLowerCase()) != -1) {	//not something we can interpret
		this.BufferedReader.pushLine(line);
		return this.next();	//find next @ and try again
	} else if(this.items[m[3]] || this.needCrossRef.items[m[3]]) {	//already have item
		Zotero.debug("Already have item with key '" + m[3] + "'");
		this.BufferedReader.pushLine(line);
		return this.next();
	} else if(m[1].toLowerCase() == 'string' && m[2] == '=') {	//string definition
		this.BufferedReader.pushLine(line.substring(m[0].length));
		if(this.strings[m[3]] !== undefined) {	//ignore subsequent definitions of a string (is this right?)
			var value = this.readValue('_string', ['@', m[2]]);
			if(value !== false) {
				Zotero.debug("Found string definition for '" + m[3] + "'");
				this.strings[m[3]] = value;
			}
		} else {
			Zotero.debug("Already have a definition for string '" + m[3] + "'");
		}
		return this.next();
	} else if(m[2] != ',') {	//something else that's messed up
		Zotero.debug("Don't know what to do with '@" + m[0] + "'");
		this.BufferedReader.pushLine(line);
		return this.next();
	}
	
	this.BufferedReader.pushLine(line.substring(m[0].length));
	
	var item = {
		type: m[1].toLowerCase(),
		fields: {
			_itemkey: m[3]
		}
	};
	
	var terminatingChars = [ '@', m[2] ];
	var field;
	while(field = this.nextField(terminatingChars)) {
		if(item.fields[field.name] === undefined) {	//ignore subsequent fields that are the same
			item.fields[field.name] = field.value;
		} else {
			Zotero.debug("Field '" + field.name + "' already defined for item with key '" + item.fields._itemkey + "'");
		}
	}
	
	//if we need to crossref, do it now or wait if we have to
	if(item.fields.crossref) {
		if(this.items[item.fields.crossref]) {
			this.supplementItem(item, this.items[item.fields.crossref]);
		} else {
			if(!this.needCrossRef[item.fields.crossref]) {
				this.needCrossRef = [];
			}
			this.needCrossRef[item.fields.crossref].push(item);
			return this.next();
		}
	}
	
	//check if we can supplement some items that were waiting for crossrefs
	if(this.needCrossRef[item.fields._itemkey.toLowerCase()]) {
		//we'll return these items on next read
		this.checkCrossRef.push(item.fields._itemkey.toLowerCase());
	}
	
	//don't have to worry about removing the terminating char,
	//since we'll ignore everything until next @ on next read
	return item;
};

/*************************
 *** crossref handling ***
 *************************/

//fields to never map through crossref
//based on http://ctan.mirrors.hoobly.com/macros/latex/contrib/biblatex/doc/biblatex.pdf Appendix B
var crossrefSkipFields = ['crossref', 'xref', 'entryset', 'entrysubtype', 'execute', 'label',
	'options', 'presort', 'related', 'relatedoptions', 'relatedstring', 'relatedtype',
	'shorthand', 'shorthandintro', 'sortkey',
	'_itemkey'];	//used internally in Zotero

var crossrefMap = {
	mvbook: {
		book: {
			title: 'maintitle',
			subtitle: 'mainsubtitle',
			titleaddon: 'titleaddon',
			shorttitle: false,
			sorttitle: false,
			indextitle: false,
			indexsorttitle: false
		},
		inbook: true,
		bookinbook: true,
		suppbook: true
	},
	mvcollection: { /*same as above*/
		collection: true,
		reference: true,
		incollection: true,
		inreference: true,
		suppcollection: true
	},
	mvproceedings: { /*same as above*/
		proceedings: true,
		inproceedings: true
	},
	book: {
		inbook: {
			title: 'booktitle',
			subtitle: 'booksubtitle',
			titleaddon: 'booktitleaddon',
			shorttitle: false,
			sorttitle: false,
			indextitle: false,
			indexsorttitle: false
		},
		bookinbook: true,
		suppbook: true
	},
	collection: { /*same as above*/
		incollection: true,
		inreference: true,
		suppcollection: true
	},
	proceedings: { /*same as above*/
		inproceedings: true
	},
	periodical: {
		article: {
			title: 'journaltitle',
			subtitle: 'journalsubtitle',
			shorttitle: false,
			sorttitle: false,
			indextitle: false,
			indexsorttitle: false
		},
		suppperiodical: true
	}
};

//add some more mappings
(function() {
	var src = ['mvbook', 'mvcollection', 'mvproceedings'];
	for(var i=0, n=src.length; i<n; i++)  {
		for(var dst in crossrefMap[src[i]]) {
			if(src[i] == 'mvbook' && dst == 'book') continue;
			crossrefMap[src[i]][dst] = crossrefMap.mvbook.book;
		}
	}
	
	crossrefMap.mvreference = crossrefMap.mvcollection;
	
	src = ['book', 'collection', 'proceedings'];
	for(var i=0, n=src.length; i<n; i++)  {
		for(var dst in crossrefMap[src[i]]) {
			if(src[i] == 'book' && dst == 'inbook') continue;
			crossrefMap[src[i]][dst] = crossrefMap.book.inbook;
		}
	}
	
	crossrefMap.reference = crossrefMap.collection;
	
	src = ['inbook', 'bookinbook', 'suppbook'];
	for(var i=0, n=src.length; i<n; i++)  {
		crossrefMap.mvbook[src[i]].author = crossrefMap.book[src[i]].author = ['author', 'bookauthor'];
	}
	
	crossrefMap.periodical.suppperiodical = crossrefMap.periodical.article;
})();

//supplements item fields given an item that was crossref'ed
bibtexIterator.prototype.supplementItem = function(item, refItem) {
	Zotero.debug("Supplementing item[" + item.fields._itemkey + "] with fields from item[" + refItem.fields._itemkey + "]");
	for(var field in refItem.fields) {
		if(crossrefSkipFields.indexOf(field) != -1) continue;
		
		var destField;
		if(crossrefMap[refItem.type] && crossrefMap[refItem.type][item.type]) {
			destField = crossrefMap[refItem.type][item.type][field];
			
			if(destField === false) continue;
		}
		
		if(destField === undefined) destField = field;
		if(typeof(destField) == 'string') destField = [destField];
		
		for(var i=0, n=destField.length; i<n; i++) {
			if(item.fields[destField[i]] !== undefined) continue;
			
			Zotero.debug("Adding field '" + destField[i] + "' from field '" + field + "'");
			item.fields[destField[i]] = item.fields[field];
		}
	}
};

/********************
 *** END crossref ***
 ********************/
 
//read a value field and return a string
//takes into account macros and string concatenation
bibtexIterator.prototype.readValue = function(field, terminatingChars) {
	var moreText, text = '', value = false, concat = true;
	var i=0, c;
	while(moreText = this.BufferedReader.read(100)) {
		text += moreText;
		for(var n=text.length; i<n; i++) {	//omission of i declaration is intentional. Declared above
			c = text.charAt(i);
			if(terminatingChars.indexOf(c) != -1) {
				this.BufferedReader.push(text.substring(i));
				return value;
			}
			
			if(c.test(/\s/)) continue;
			
			if(c == '#') {
				concat = true;
				continue;
			}
			
			if(value !== false && !concat) {	//another string wihtout concat operator??
				this.BufferedReader.push(text.substring(i));
				return value;	//we might be a bit too generous here. We should probably return false
			}
			
			this.BufferedReader.push(text.substring(i));
			var v;
			if(c == '"' || c == '{') {
				v = this.readString(c, terminatingChars);
			} else {
				v = this.readMacro();
			}
			
			if(v === false) return value;
			
			if(value === false) value = v;
			else value += v;
			
			text = '';	//reset text and counter
			i=0;
			break;
		}
	}
	return false;
};

bibtexIterator.prototype.readMacro = function() {
	var moreText, text = '', value = '';
	var i=0, c;
	while(moreText = this.BufferedReader.read(100)) {
		text += moreText;
		for(var n=text.length; i<n; i++) {	//omission of i declaration is intentional. Declared above
			if(c.test(/\s/) && !value) continue;
			
			if(c.test(bibtexIterator.fieldNameRE)) {
				value += c;
			} else {
				this.BufferedReader.push(text.substring(i));
				if(!value) return false;
				
				var intValue = parseInt(value, 10);
				if(!isNaN(intValue) && intValue == value) {
					return '' + intValue;
				} else if(this.strings[value] !== undefined) {
					return this.strings[value];
				} else {
					return false;
				}
			}
		}
	}
	return false;
};

bibtexIterator.prototype.readString(openChar, terminatingChars) {
	var braceLevel = 0;
	var stopOn = terminatingChars.slice().push(openChar);
	
	var mathMode = false;
	
	var string = this.BufferedReader.readUntil('${\\', function(c, str){
		switch(c) {
			case '$':
			case '{':
			case '\\':
		}
	}, stopOn);
	
	//consume terminating char
	var c = this.BufferedReader.read(1);
	if(c && c != openChar) this.BufferedReader.push(c);
	
	return string;
};

//read the next item field from file and return it
bibtexIterator.fieldNameRE = /\w/;	//make this more strict? Allow dashes?
bibtexIterator.prototype.nextField = function(terminatingChars) {
	var moreText, text = '', fieldName = '', fnDone = false;
	var i=0, c;
	//keep reading until we run out of text
	while(moreText = this.BufferedReader.read(100)) {
		text += moreText;
		for(var n=text.length; i<n; i++) {	//omission of i declaration is intentional. Declared above
			c = text.charAt(i);
			
			if(terminatingChars.indexOf(c) != -1) {	//we're pretty strict below, so this shouldn't really matter, but we quit if we hit the end of a record
				this.BufferedReader.push(text.substring(i));
				return false;
			}
			
			if(c.test(/\s/)) {	//skip whitespace
				if(fieldName) fnDone = true;	//end of field name
				continue;
			}
			
			if(!fnDone && c.test(this.fieldNameRE)) {	//field name char
				fieldName += c;
			} else if(c == '=' && fieldName) {	//this is where value begins
				this.BufferedReader.push(text.substring(i+1));
				var value = this.readValue(fieldName, terminatingChars);
				if(value === false) return false;
				
				return {name: fieldName, value: value};
			} else {	//we hit something unexpected
				this.BufferedReader.push(text.substring(i));
				return false;
			}
		}
	}
	return false;
};

function doImport() {
	var bibtexIt = new bibtexIterator();
	var item;
	for(var bibtexItem in bibtexIt) {
		item = importMapper.mapItem(bibtexItem);
		item.complete();
	}
}