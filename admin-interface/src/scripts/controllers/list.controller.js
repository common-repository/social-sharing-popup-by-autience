angular.module('yetienceApp')
    .controller('ListController', ['$scope', 'SettingsService', '$state', '$rootScope', 'UtilsService', 'CommService', 'UpgradeService', '$location', 'localStorageService', '$modal', function($scope, SettingsService, $state, $rootScope, UtilsService, CommService, UpgradeService, $location, localStorageService, $modal) {

        localStorageService.remove('widget')

        if (!yetience.website_saved) {
            $state.go('start')
        }
        $scope.R = $rootScope
        $scope.C = CommService
        $scope.U = UpgradeService
        $scope.S = SettingsService

        $scope.list = {}
        $rootScope.$on('setup_initialized', function() {


            if (SettingsService.setup().widgets && SettingsService.setup().widgets.length == 0) {
                //there are no widgets
                $location.path('/create/build/select')
            } else {
                $scope.list.widgets = SettingsService.setup().widgets

                CommService.createNewEvent('popup_created')
            }
        })

        if (SettingsService.setup()) {
            $scope.list.widgets = SettingsService.setup().widgets

            if ($scope.list.widgets.length == 0) {
                $location.path('/create/build/select')
            }
        }

        $scope.addNewWidget = function() {
            CommService.createNewEvent('add_another_widget')
            if (SettingsService.hasFeature('multiplePopups')) {
                //website has multiple Popups feature                
                $location.path('/create/build/select')
            } else {
                //alert('To Create more Widgets, Please Upgrade to a Premium Plan')
                UtilsService.premiumMessage('The lite plan allows for on widget. To create more, please upgrade..')
            }
        }

        $scope.changeEnable = function(state, name) {
            var message = name + ' will be Disabled'
            var label = 'Disable'
            if (state) {
                message = name + ' will be Enabled'
                label = 'Enable'
            }

            console.log(message)
            SettingsService.saveSetup(message, label)
        }

        $scope.removeWidget = function(index) {
            var widgets = SettingsService.setup().widgets
            var name = widgets[index].configuration.what.name

            console.log('name- ' + name)
            widgets.splice(index, 1)
            SettingsService.saveSetup('<center>This Popup will be Deleted</center>', 'Delete')
        }


        $scope.configure = function(index) {
            //if (SettingsService.hasFeature('advancedConfiguration')) {
            $rootScope.widget = SettingsService.setup().widgets[index]
            var modalInstance = $modal.open({
                size: 'md',
                templateUrl: yetience.adminPath + '/src/partials/modal.configure.html',
                controller: ['$scope', 'SettingsService', function($scope, SettingsService) {
                    $scope.S = SettingsService
                    $scope.R = $rootScope
                    $scope.C = CommService
                    $scope.U = UpgradeService
                    $scope.oneAtATime = true
                    $scope.configureReturnPath = function() {
                        return yetience.adminPath + '/src/partials/build.configure.html'
                    }

                    $scope.save = function() {
                        modalInstance.close()
                        console.log($rootScope.widget)
                        SettingsService.saveSetup('<center>Your Widget will be Updated</center>', 'Save Changes')

                    }

                    //$scope.sections = ['whom','when','where','']
                }]
            })

            /*
            }else{
                UtilsService.premiumMessage('Configuration Options are available on Premium Version. Please upgrade..')
            }
            */

        }

    }])
