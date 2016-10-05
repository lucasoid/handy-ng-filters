var myApp = angular.module('myApp', [
  'ngSanitize',
  'myFilters',
  'myControllers',
]);

var myControllers = angular.module('myControllers', []);

myControllers.controller('myCtrl', ['$scope', function($scope) {
	
  $scope.records = [
    {id:1, name:'Kind of Blue', artist:'Miles Davis', awesome:'true', description: 'This seminal album by <a href="http://example.com">Miles Davis</a> is an <strong>instantly</strong> recognizable classic for generations of jazz fans.', tags:['modal', 'classic', 'blue']},
	{id:2, name:'I Robot', artist:'The Alan Parsons Project', awesome:0, description:null, tags:['prog', 'experimental', 'synth']}
  ];
  
  $scope.jsonString = JSON.stringify($scope.records[0]);
  $scope.selectedKeys = ['name', 'artist'];
}]);

var myFilters = angular.module('myFilters', []);

myFilters.filter('detailLink', ['$sce', function($sce) {
  return function(input, item, pattern, target) {
    input = input == undefined || input.trim() == '' ? '&lt;&gt;' : input;
    target = target == undefined ? '_self' : target;
    var path = pattern.split('/');
    var properties = [];
    angular.forEach(path, function(value, key) {
      var index = value.indexOf(':');
      if(-1 != value.indexOf(':')) {
        var replace = value.substring(value.indexOf(':') + 1);
        if(angular.isDefined(item) && angular.isDefined(item[replace])) {
          pattern = pattern.replace(':' + replace, item[replace]);
        }
        else {
          pattern = '';
        }
      }
    });
    return pattern != '' ? $sce.trustAsHtml('<a href="#/' + pattern + '" target="' + target + '">' + input  + '</a>') : input;
  }
}]);

myFilters.filter('truncateToPlainText', ['$sce', function($sce) {
  return function(input, length, offset) {
    var plain = angular.element('<div>' + input + '</div>').text();
    var ellipsis = '';
    if(offset == undefined) offset = 0;
    if(length == undefined) {
      end = plain.length;
    }
    else {
      end = offset + length;
    }
    if(length < plain.length) ellipsis = '...';
    return plain.substring(offset, end) + ellipsis;
  }
}]);

myFilters.filter('booleanToSymbol', ['$sce', function($sce) {
  return function(input) {
    return input == 1 || input == '1' || input == true || input == 'true' ? $sce.trustAsHtml('<i class="fa fa-check"></i>') : '<i class="fa fa-times"></i>';
  }
}]);

myFilters.filter('arrayToString', ['$sce', function($sce) {
  return function(input, separator) {
    if(Array.isArray(input)) {
      var result = [];
      for(var i = 0; i < input.length; i++) {
        var item = input[i];
        if(angular.isString(item)) {
          result.push(item);
        }
        else {
          result.push(JSON.stringify(item));
        }
      }
      return input.length ? $sce.trustAsHtml(result.join(separator)) : '';
    }
    else {
      return '';
    }
    
  }
}]);

myFilters.filter('printJson', ['$sce', function($sce) {
  return function(input, keys) {
    _keys = keys || [];
    if(typeof input == 'string') {
      try {
        var obj = JSON.parse(input);
        var string = objectToList(obj, _keys);
        return string;
      }
      catch(e) {
        //console.log(e.message);
      }
    }
    
    function objectToList(object, keys) {
      keys = keys || [];
      var string ='<ul>';
      for(var key in object) {
        if(object.hasOwnProperty(key) && (keys.length == 0 || -1 != keys.indexOf(key))) {
          string += '<li>' + key + ': ' + getStringValue(object[key]) + '</li>';
        }
      }
      string += '</ul>';
      return string;
    }
    
    function getStringValue(val) {
      if(typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean') {
        return val;
      }
      else if(typeof val == 'object' && val != null) {
        return objectToList(val);
      }
      else {
        return '';  
      }    
    }
    return input;
  }
}]);