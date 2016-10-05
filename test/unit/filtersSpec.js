describe('myFilters.detailLink', function() {
  beforeEach(module('myApp'));
  
  var $filter;
  var $sce;
  var detailLink;
  
  beforeEach(inject(function(_$sce_, _$filter_) {
    $sce = _$sce_;
    $filter = _$filter_;
	detailLink = $filter('detailLink');
  }));
  
  it('returns brackets when input is empty', function() {
    var item = {id:'24', name:''};
    var input = item.name;
    var result = detailLink(input, item, 'test/:id');
    expect($sce.getTrustedHtml(result)).toEqual('<a href="#/test/24" target="_self">&lt;&gt;</a>');
  });
  
  it('returns the original input when the pattern is undefined', function() {
    var item = {name:'Jane Smith'};
    var input = item.name;
    var result = detailLink(input, item, '');
    expect($sce.getTrustedHtml(result)).toEqual('Jane Smith');
  });
  
  it('returns the detail link when input and pattern are present', function() {
    var item = {id:'24', name:'Jane Smith'};
    var input = item.name;
    var result = detailLink(input, item, 'test/:id');
    expect($sce.getTrustedHtml(result)).toEqual('<a href="#/test/24" target="_self">Jane Smith</a>');
  });
  it('returns target="_self" when the target value is absent', function() {
    var item = {id:'24', name:'Jane Smith'};
    var input = item.name;
    var result = detailLink(input, item, 'test/:id');
    expect($sce.getTrustedHtml(result)).toEqual('<a href="#/test/24" target="_self">Jane Smith</a>');
  });
  it('changes the target when the target value is present', function() {
    var item = {id:'24', name:'Jane Smith'};
    var input = item.name;
    var result = detailLink(input, item, 'test/:id', '_blank');
    expect($sce.getTrustedHtml(result)).toEqual('<a href="#/test/24" target="_blank">Jane Smith</a>');
  });
});

describe('myFilters.truncateToPlainText', function() {
  beforeEach(module('myApp'));
  
  var $filter;
  var truncateToPlainText;
  
  beforeEach(inject(function(_$filter_) {
    $filter = _$filter_;
	truncateToPlainText = $filter('truncateToPlainText');
  }));
  it('returns a plain text substring from an HTML snippet', function() {
    var input = '<h1>A Tale of Two Cities</h1>';
    var length = 100;
    var offset = 10;
    var result = truncateToPlainText(input, length, offset);
    expect(result).toEqual('Two Cities');
  });
  it('adds an ellipsis if the end of the HTML snippet is truncated', function() {
    var input = '<h1>A Tale of Two Cities</h1><p>It was the <i>best of times, it was the worst of times.</i></p>';
    var length = 10;
    var offset = 10;
    var result = truncateToPlainText(input, length, offset);
    expect(result).toEqual('Two Cities...');
  });
  
});

describe('myFilters.booleanToSymbol', function() {
  beforeEach(module('myApp'));
  
  var $filter;
  var $sce;
  var booleanToSymbol;
  var trueText;
  var falseText;
  
  beforeEach(inject(function(_$sce_, _$filter_) {
    $sce = _$sce_;
    $filter = _$filter_;
	booleanToSymbol = $filter('booleanToSymbol');
	trueText = '<i class="fa fa-check"></i>';
	falseText = '<i class="fa fa-times"></i>';
  }));
  
  it('returns a font-awesome checkmark if value is truthy', function() {
    var input = true;
    expect($sce.getTrustedHtml(booleanToSymbol(input))).toEqual(trueText);
    
    var input = 'true';
    expect($sce.getTrustedHtml(booleanToSymbol(input))).toEqual(trueText);
    
    var input = '1';
    expect($sce.getTrustedHtml(booleanToSymbol(input))).toEqual(trueText);
    
    var input = 1;
    expect($sce.getTrustedHtml(booleanToSymbol(input))).toEqual(trueText);
  });
  
  it('returns an empty string if value is falsy', function() {
    var input = false;
    expect($sce.getTrustedHtml(booleanToSymbol(input))).toEqual(falseText);
    
    var input = 'false';
    expect($sce.getTrustedHtml(booleanToSymbol(input))).toEqual(falseText);
    
    var input = 0;
    expect($sce.getTrustedHtml(booleanToSymbol(input))).toEqual(falseText);
    
    var input = {someVal:'x'};
    expect($sce.getTrustedHtml(booleanToSymbol(input))).toEqual(falseText);
  });
});

describe('myFilters.arrayToString', function() {
  beforeEach(module('myApp'));
  
  var $filter;
  var $sce;
  var arrayToString;
  
  beforeEach(inject(function(_$sce_, _$filter_) {
    $sce = _$sce_;
    $filter = _$filter_;
	arrayToString = $filter('arrayToString');
  }));
  it('returns an empty string if the input is not an array with length', function() {
    var input = '';
    var result = arrayToString(input, '<br/>');
    expect(result).toEqual('');
    
    input = [];
    result = arrayToString(input, '<br/>');
    expect(result).toEqual('');
    
    input = 33;
    result = arrayToString(input, '<br/>');
    expect(result).toEqual('');
    
    var input = 'tuna sandwiches';
    var result = arrayToString(input, '<br/>');
    expect($sce.getTrustedHtml(result)).toEqual('');
  });
  
  it('returns a string of items with line breaks if the input has length', function() {
    var input = ['tuna', 'sandwiches', 'pickles'];
    var result = arrayToString(input, '<br/>');
    expect($sce.getTrustedHtml(result)).toEqual('tuna<br/>sandwiches<br/>pickles');
  });
  
  it('returns a JSON string if the input is not a simple array', function() {
    input = [{some:'thing', more:'complicated'}];
    var result = arrayToString(input, '<br/>');
    expect($sce.getTrustedHtml(result)).toEqual('{"some":"thing","more":"complicated"}');
  });
});

describe('myFilters.printJson', function() {
  beforeEach(module('myApp'));
  
  var $filter, printJson;
  
  beforeEach(inject(function(_$filter_) {
    $filter = _$filter_;
    printJson = $filter('printJson');
  }));
  it('returns the raw input if the input is not a string', function() {
    var input = ['I', 'am', 'an', 'array'];
    var result = printJson(input);
    expect(result).toEqual(input);
    
    input = {here:'is', an:['object']};
    result = printJson(input);
    expect(result).toEqual(input);
  });
  
  it('returns the raw input if the input is not parseable JSON', function() {
    var input = '"this":"looks like json":"but it isnt"';
    var result = printJson(input);
    expect(result).toEqual(input);
    
    input = "this is just a plain text string";
    result = printJson(input);
    expect(result).toEqual(input);
  });
  
  it('returns a one-dimensional unordered list if the input is a one-dimensional JSON string', function() {
    var input = JSON.stringify({id:1, name:'Breakdancing videos'});
    var result = printJson(input);
    var expected = '<ul><li>id: 1</li><li>name: Breakdancing videos</li></ul>';
    expect(result).toEqual(expected);
  });
  
  it('returns a multi-dimensional unordered list if the input is a multi-dimensional JSON string', function() {
    var input = JSON.stringify({id:1, name:'Breakdancing videos', meta:{tags:'hippity, hoppity'}});
    var result = printJson(input);
    var expected = '<ul><li>id: 1</li><li>name: Breakdancing videos</li><li>meta: <ul><li>tags: hippity, hoppity</li></ul></li></ul>';
    expect(result).toEqual(expected);
  });
  
  it('returns an arbitrarily deep unordered list corresponding to the depth of the multi-dimensional JSON string', function() {
    var input = JSON.stringify({level:1, next:{level:2, next:{level:3, next:{level:4, next:{level:5}}}}});
    var result = printJson(input);
    var expected = '<ul><li>level: 1</li><li>next: <ul><li>level: 2</li><li>next: <ul><li>level: 3</li><li>next: <ul><li>level: 4</li><li>next: <ul><li>level: 5</li></ul></li></ul></li></ul></li></ul></li></ul>';
    expect(result).toEqual(expected);
  });
  
  it('skips printing if the value is null', function() {
    var input = JSON.stringify({id:1, tags:null});
    var result = printJson(input);
    var expected = '<ul><li>id: 1</li><li>tags: </li></ul>';
    expect(result).toEqual(expected);
    
    input = JSON.stringify({id:1, meta:{tags:null}});
    result = printJson(input);
    expected = '<ul><li>id: 1</li><li>meta: <ul><li>tags: </li></ul></li></ul>';
    expect(result).toEqual(expected);
    
  });
  
  it('traverses arrays using indexes as the named keys', function() {
    var input = JSON.stringify({id:1, name:'Breakdancing videos', meta:{tags:['hippity', 'hoppity']}});
    var result = printJson(input);
    var expected = '<ul><li>id: 1</li><li>name: Breakdancing videos</li><li>meta: <ul><li>tags: <ul><li>0: hippity</li><li>1: hoppity</li></ul></li></ul></li></ul>';
    expect(result).toEqual(expected);
  });
  
  it('prints values only for the specified keys, if provided', function() {
    var input = JSON.stringify({id:1, name:'Breakdancing videos'});
    var result = printJson(input);
    var expected = '<ul><li>id: 1</li><li>name: Breakdancing videos</li></ul>';
    expect(result).toEqual(expected);
    
    result = printJson(input, ['name']);
    expected = '<ul><li>name: Breakdancing videos</li></ul>';
    expect(result).toEqual(expected);
    
    input = JSON.stringify({id:1, name:{other:'labels', at:'this depth', are:'printed'}});
    result = printJson(input, ['name']);
    expected = '<ul><li>name: <ul><li>other: labels</li><li>at: this depth</li><li>are: printed</li></ul></li></ul>';
    expect(result).toEqual(expected);
  });
});