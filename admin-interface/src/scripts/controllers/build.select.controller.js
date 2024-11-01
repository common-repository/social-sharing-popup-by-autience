angular.module('yetienceApp')
    .controller('buildSelectController', ['$scope', 'SettingsService', '$state', '$rootScope', 'CommService', 'UtilsService', 'WidgetUpdate', '$modal', 'UpgradeService', function($scope, SettingsService, $state, $rootScope, CommService, UtilsService, WidgetUpdate, $modal, UpgradeService) {

        $scope.rowLimit = 3
        $scope.C = CommService
        $rootScope.widget = {}
        var seenAllThemes = false
        var sentEvent = false;

        $scope.selectTheme = function(label, theme) {
            console.log('selected theme - ')
            console.log(theme)

            CommService.createNewEvent("theme_selected", {
                'selected_theme': label
            });
            var email = 'email'

            $rootScope.widget = SettingsService.createWidget(label)

            console.log($rootScope.widget)
            //Do this when email theme is selected
            if (theme.categories[0] == 'subscription') {

                console.log('email_theme_selected')
                CommService.createNewEvent("email_theme_selected", {
                    'selected_theme': label
                });
                
                emailConnect()

            } else {
                WidgetUpdate.goToNextState()
            }


        }

        //show modal for connecting with provider
        function emailConnect() {

            var modalInstance = $modal.open({
                size: 'md',
                templateUrl: yetience.adminPath + '/src/partials/email.connect.html',
                controller: ['$scope', 'SettingsService', function($scope, SettingsService) {
                    console.log($rootScope.components)
                    $scope.emailFields = $rootScope.components['email-subscriber'].fields

                    $scope.S = SettingsService
                    $scope.R = $rootScope
                    $scope.C = CommService
                    $scope.U = UpgradeService
                    $scope.oneAtATime = true
                    CommService.createNewEvent('seen_email_connect_modal')

                    $scope.$watch('widget.components.emailSubscription.values.list',function(new_value){
                        if(new_value){
                            console.log('list selected- '+new_value)
                            //list is selected, now close
                            modalInstance.close()
                            WidgetUpdate.goToNextState()
                        }
                    })
                }]
            })
        }

        $scope.isVisible = function() {
            if (sentEvent == false) {
                seenAllThemes = true
                CommService.createNewEvent("seen_all_themes");
                sentEvent = true;
            }

        }
    }])