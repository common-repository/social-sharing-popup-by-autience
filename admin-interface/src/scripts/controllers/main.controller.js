angular.module('yetienceApp')
    .controller('MainController', ['$scope', '$rootScope', 'SettingsService', 'CommService', '$location', function($scope, $rootScope, SettingsService, CommService, $location) {

        $scope.R = $rootScope
        $scope.R.readyToSave = false
        $scope.R.Y = yetience

        $rootScope.basePath = yetience.adminPath
        console.log('Inside MainController')

        $scope.onStartPage = function() {
            return ($location.path() == '/start')
        }

        $scope.activeTab = function(paths) {
            //check if paths exist in the current location
            var current_path = $location.path()
            for (var i in paths) {
                if (current_path.indexOf(paths[i]) >= 0) {
                    return 'active yel-activeitem'
                }
            }
            return ''
        }

        $scope.packageTitle = function() {

            for (var i in $rootScope.packages) {
                if ($rootScope.packages[i].label == SettingsService.setup().package_id) {
                    return $rootScope.packages[i].name
                }
            }
            return ''
        }

        $scope.canBeUpgraded = function() {
                return (SettingsService.setup().package_id == 'default')
            }
            //initialize settings service
            //SettingsService.initialize()

        //define path for static files to be received from the server
        $rootScope.staticPath = yetience.static
        $rootScope.pluginPath = yetience.path

        //Fetch other objects
        //1. Fetch product details
        //2. Fetch themes

        $rootScope.setup_initialized = false
        SettingsService.initialize(function() {

            $scope.S = SettingsService.setup()

            console.log('calling all details')
            CommService.getAllDetails(yetience.product)
                .then(function(all_details) {
                    console.log('All details')
                    console.log(all_details)
                    angular.extend($rootScope, all_details.details)

                    for (var cat in $rootScope.categories) {
                        for (var key in $rootScope.themes) {

                            var theme = $rootScope.themes[key]

                            if (theme.categories.indexOf(cat) >= 0) {
                                if (!$rootScope.categories[cat].themes) {
                                    $rootScope.categories[cat].themes = []
                                }
                                $rootScope.categories[cat].themes.push(theme)
                            }
                        }
                    }

                    postInitialization()
                }, function(err) {
                    console.log('error while getting all details')
                    console.log(err)
                })

            function postInitialization() {

                SettingsService.setup().networks = $rootScope.networks

                console.log('added Networks')
                console.log(SettingsService.setup())
                $rootScope.setup_initialized = true
                $rootScope.$emit('setup_initialized')

                if (document.getElementById('yetience-content')) {
                    document.getElementById('yetience-content').style.display = "block"
                }

                if (document.getElementById('yetience-loader')) {
                    document.getElementById('yetience-loader').style.display = "none"
                }

                console.log('Fetched data in ' + (Date.now() - autience_initiated_at) + ' milliseconds')
            }

        })

    }])