function WrapperCtrl($scope) {


        $rootScope.register(this);

        $scope.wrapData = {
                personName: "alex",
                personAge: "32"
        };

        var asi1 = new BastaMan($scope, $scope.wrapData, document.getElementById("ko_1"));
        var asi2 = new BastaMan($scope, $scope.wrapData, document.getElementById("ko_2"));

        $scope.ngDo = function(){
                $scope.wrapData.personName = 'Bob'
                $scope.wrapData.personAge = 41;
                $scope.broadcast("ngChange", $scope.wrapData);
        };

        $scope.on("koChange", function (prop, value) {
                $scope.wrapData[prop] = value;
        });

        this.getMyScope = function () {
                return $scope;
        }

        this.getMyData = function () {
                return $scope.wrapData;
        }
}


function BastaMan(scope, sharedModel, el) {

        sharedModel = $.extend(true, {}, sharedModel);

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
                scope.broadcast("koChange", newValue);
        });

        sharedModel.personAge.subscribe(function(newValue) {
                scope.broadcast("koChange", newValue);
        });

        scope.on("ngChange", function (data) {
                // tell KO
        });
}


function CustomBinding (ngControllerName) {

        // magic
        var scope = window.allNgControllers[ngControllerName].getMyScope();

        var data = scope.getMyData();

        // similar to BastaMan

        ko.allBindings.BastaMan = {
                init: function () {},
                update: function (model) {
                        scope.broadcast("koChange", newValue);
                }
        }


        scope.on("ngChange", function (data) {
                // tell KO
        });

}



var ASI = function() {

        var data = $.get(url);

        this.asiData = sharedModel;

        this.asiDoSomething = function() {
                this.asiData.personName('Mary').personAge(25);
        };
}


<div data-bind= "asiDatepicker: ...,
                "BastaMan: WrapperCtrl"