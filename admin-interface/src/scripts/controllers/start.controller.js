angular.module('yetienceApp')
    .controller('StartController', ['$scope','$state', '$rootScope',function($scope,$state,$rootScope,CommService) {
    	
    	$scope.R = $rootScope
    	console.log('website saved inside start controller - '+yetience.website_saved)
    	if(yetience.website_saved){
    		$state.go('list')
    	}

    	$scope.premiumPartial= function(){
            return $rootScope.basePath + '/src/partials/gopremium.html'
    	}

        $scope.hideActions = true

    }])