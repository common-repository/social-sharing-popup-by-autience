angular.module('yetienceApp')
    .controller('buildController', ['$scope', 'SettingsService', '$state', '$rootScope', '$stateParams', '$location', 'WidgetUpdate', 'localStorageService', function($scope, SettingsService, $state, $rootScope, $stateParams, $location, WidgetUpdate, localStorageService) {
        console.log('INSIDE BUIlD CONTROLLER')


        $scope.S = $state
        $scope.R = $rootScope
        $scope.mode = $stateParams.mode
        $scope.W = WidgetUpdate
        $scope.SS = SettingsService.setup()

        if (!yetience.website_saved) {
            $state.go('start')
        }

        var index = $location.search().index
        if ($scope.mode != 'edit' && $scope.mode != 'create') {
            $state.go('list')
        }
        
        if ($scope.mode == 'edit') {
            $rootScope.widget = SettingsService.getWidget(index)
            if (!$rootScope.widget) {
                $state.go('list')
            }
        } else {
            //check if there is a widget on the local storage
            $rootScope.widget = localStorageService.get('widget')
        }
        //Watch for changes in widget and save them to local storage
        $rootScope.$watch('widget', function(newWidget, oldWidget) {
            if (newWidget) {
                //console.log('noticed a change in widget, saving it')
                localStorageService.set('widget', newWidget)
            }
        }, true)


        $scope.customer = {}

        $scope.controls = {
            create: ['select', 'design', 'configure', 'activate'],
            edit: ['design', 'configure']

        }
        $scope.titles = {
            select: 'Select',
            design: 'Design',
            configure: 'Configure',
            activate: 'Activate'
        }

        $scope.currentState = function() {
            console.log($state.get('build'))
        }

    }])