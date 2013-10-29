function WrapperCtrl($scope) {	

	$scope.wrapData = {
		personName: "alex",
		personAge: "32"
	};

	var asi1 = new ASIWrapper($scope, $scope.wrapData, document.getElementById("ko_1"));
	var asi2 = new ASIWrapper($scope, $scope.wrapData, document.getElementById("ko_2"));

	$scope.ngDo = function(){
		$scope.wrapData.personName('Bob').personAge(41);
	};

	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;

		if (phase === '$apply' || phase === '$digest') {
			if (fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};
}


function ASIWrapper(scope, sharedModel, el) {

	$.each(sharedModel, function(key, value) {
		sharedModel[key] = (typeof value !== "function") ? ko.observable(value) : value;
	});

	var ASI = function(sharedModel) {
		this.asiData = sharedModel;
		
		this.asiDoSomething = function() {
			this.asiData.personName('Mary').personAge(25);
		};
	}

	ko.applyBindings(new ASI(sharedModel), el);

	sharedModel.personName.subscribe(function(newValue) {
		scope.safeApply();
	});

	sharedModel.personAge.subscribe(function(newValue) {
		scope.safeApply();
	});
}