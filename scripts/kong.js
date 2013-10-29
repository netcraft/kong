var myApp = angular.module('MyApp',[]);

// ***********************************************
// *** Global data, etc
// ***********************************************
var data = {
	name: "Alex",
	age: "24"
};

// ***********************************************
// *** Angular, demo infra
// ***********************************************
function PersonCtrl($scope){

	$scope.person = data;

	$scope.changePerson = function() {
		$scope.person.name = "Serge";
		$scope.person.age = "30";
	};
}

// ***********************************************
// *** Kong custom binding
// ***********************************************
myApp.directive('kongNg', function($controller, $timeout){
	return {
		restrict: "EA",
		scope: {
			controller: "@",
			data: "@"
		},
		transclude: true,

		controller: function($scope, $element, $attrs) {

			// NG controller is responsible for connecting
			// the NG directive with the KO directive

			this.getScope = function() {
				return $scope;
			};
		},

		template:
			'<div ng-transclude></div>',

		link: function($scope, $element, $attrs) {

			// NG link is responsible for connecting the
			// NG directive with the controller
			var ctrlScope = $scope.$$nextSibling;

			var ctrl = $controller($attrs.controller, {$scope: ctrlScope});


			// ********UTILS SERVICE********************
			var getHashCode = function(theString){
				// @see http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
				var hash = 0, i, char;
				if (theString.length == 0) return hash;
				for (i = 0, l = theString.length; i < l; i++) {
					char  = theString.charCodeAt(i);
					hash  = ((hash<<5)-hash)+char;
					hash |= 0; // Convert to 32bit integer
				}
				return hash;
			};

			var x = {
				theList: {},
				getKey: function(data) {
					return getHashCode(JSON.stringify(data));
				},
				getValue: function(key) {
					return this.theList[key];
				},
				list: function(data) {
					return this.theList[this.getKey(data)] = data;
				},
				unlist: function(data) {
					delete this.theList[this.getKey(data)];
				},
				isInList: function(data) {
					return typeof this.theList[this.getKey(data)] !== "undefined";
				},
				testList: function(data) {
					console.log("TEST***************");
					console.log("listing data");
					x.list(data);
					console.log("data is in list=%o", x.isInList(data));
					console.log("key is=%o", x.getKey(data));
					console.log("value is=%o", x.getValue(x.getKey(data)));
					console.log("list is=%o", x.theList);
					// console.log("unlisting data");
					// x.unlist(data);
					// console.log("data is in list=%o", x.isInList(data));
					// console.log("list is=%o", x.theList);
					console.log("END TEST***************");
				}
			};
			// ********UTILS SERVICE********************

			x.testList(ctrlScope[$attrs.data]);
			x.testList({foo: 5});

			/*ctrlScope.$watch(
				function() {
					return ctrlScope[$attrs.data];
				},
				function() {
					$scope.$broadcast("ngChange", x.list(ctrlScope[$attrs.data]));
				},
				true
			);

			$scope.$on("koChange", function(data) {
				console.log("something happened in kongKo=%o", data);

				if (x.isInList(data) === false) {
					ctrlScope[$attrs.data] = data;
					x.unlist(data);
				}
			});*/
		}
	};
});

myApp.directive('kongKo', function($controller, $timeout, $parse){
	return {
		restrict: "EA",
		scope: {
			viewModel: "@"
		},
		transclude: true,
		require: "^kongNg",

		controller: function($scope, $element, $attrs) {
		},
		template:
			'<div ng-transclude></div>',

		link: function($scope, $element, $attrs, kongNgCtrl) {

			// Here we listen to NG changes
			var kongNgScope = kongNgCtrl.getScope();

			// Evaluate the VM function in current context
			var viewModel = $parse($attrs.viewModel)(this);

			kongNgScope.$on("ngChange", function(e, data) {
				console.log("ngChange data=%o", data);

				if (data.isIn(x) === false) {
					// API
					provide(data);
					data.unregister();
				}
			});

			ko.bindingHandlers.kongKo = {
				init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
					console.log("we know that kongKo has init=%o", viewModel.person());
				},
				update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
					console.log("we know that kongKo has changed=%o", viewModel.person());

					kongNgScope.$emit("koChange", viewModel.person());
				}
			}

			$element.attr("data-bind", $element.attr("data-bind") + ", kongKo: null");

			// API
			createVM($element.get(0));
		}
	};
});

var asi1;
function createVM(el) {
	asi1 = new asiPersonVM({});
	ko.applyBindings(asi1, el);
}

function provide(data) {
	asi1.person(data);
}

function getDataName() {
	return "person";
}

// ***********************************************
// *** Meanwhile in ASI land
// ***********************************************
function asiPersonVM(data) {
	// $.each(data, function(key, value) {
	// 	data[key] = (typeof value !== "function") ? ko.observable(value) : value;
	// });
	this.person = ko.observable(data);
	this.changePerson = function() {
		this.person({
			name: "Moshe",
			age: "44"
		});
	}
}

ko.bindingHandlers.asiPerson = {};