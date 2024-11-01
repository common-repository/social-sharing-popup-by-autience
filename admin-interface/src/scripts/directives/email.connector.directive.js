angular.module('yetienceApp')
    .directive('emailConnector', ['$rootScope', function($rootScope) {
        // Runs during compile
        return {
            controller: ['$rootScope', '$element', '$scope', 'SettingsService', 'CommService', function($rootScope, $element, $scope, SettingsService, CommService) {
                var provider_list = $rootScope.emailProviders


                $scope.openPopup = function() {
                    window.open(generate_auth_url[$scope.provider](), "Mailchimp",
                        "width=640,height=480,left=350,top=350,location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1")
                    CommService.createNewEvent("clicked_connect_with_provider",{'provider':$scope.provider})
                    pollForLists()
                }

                var generate_auth_url = {
                    Mailchimp: function() {
                        var URI = encodeURIComponent(yetience.server + '/api/Mailchimps/from_mailchimp?website_id=' + SettingsService.setup().id);
                        // console.log('client_id- ' + provider_list[$scope.provider].client_id)
                        var auth_uri = ('https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=' + provider_list[$scope.provider].client_id + '&redirect_uri=' + URI);

                        // console.log(auth_uri)
                        return auth_uri
                    }
                }

                $scope.$watch('provider', function(new_val, old_val) {
                    if (new_val) {
                        // console.log('provider selected- ' + new_val)

                        fetchAndAssignLists()
                    }
                })

                $scope.fetched_lists = false

                function pollForLists() {
                    fetchAndAssignLists()
                    setTimeout(function() {
                        if (!$scope.fetched_lists) {
                            pollForLists()
                        }
                    }, 3000)
                }

                function fetchAndAssignLists() {
                    CommService.getEmailLists($scope.provider, SettingsService.setup().id)
                        .then(function(lists) {
                            if($scope.provider == 'Yeloni'){
                                lists.lists = 'New List'
                            }
                            // console.log('lists')
                            // console.log(lists)
                            // console.log(lists.lists)
                            // console.log(typeof lists.lists)
                            if (lists.lists != null) {
                                $scope.fetched_lists = true
                                if ($scope.emailConfig) {
                                    $scope.emailConfig.lists = lists.lists
                                }

                                if ($scope.emailFields && $scope.emailFields.length > 1) {
                                    $scope.emailFields[1].templateOptions.options = lists.lists
                                } else {
                                    console.log('emailFields does not have two elements')
                                    console.log($scope.emailFields)
                                }
                            }


                        })
                }


            }],
            restrict: 'A',
            template: "<button ng-hide='fetched_lists' type='button' class='btn btn-primary'  ng-click='openPopup()'>Connect with {{provider}} </button>",
            scope: {
                provider: '@',
                emailConfig: '=',
                emailFields: '='
            }

        }
    }])
