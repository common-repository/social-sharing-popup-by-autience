angular.module('yetienceApp')
    .directive('componentForm', ['$rootScope', function($rootScope) {
        // Runs during compile
        return {
            controller: ['$scope', '$element', 'CommService', function($scope, $element, CommService) {
                $scope.cust = {
                    fields: [],
                    values: {}
                }
                $scope.oneAtATime = false
                $scope.R = $rootScope
                $scope.isOpen = {}

                var initial_values = null

                $scope.current = {}
                $scope.highlightedTag = null
                $scope.expandedTag = null
                $scope.hoveredOn = function(tag) {
                    $scope.highlightedTag = tag
                    $rootScope.$emit('highlightComponent', tag)
                }

                $scope.hoveredOut = function(tag) {
                    $scope.highlightedTag = null
                    $rootScope.$emit('unHighlightComponent', tag)
                }

                $rootScope.$on('highlight_component', function(evt, tag) {     
                    $scope.highlightedTag = tag

                    $scope.$apply()
                })

                $rootScope.$on('expand_component', function(evt, tag) {  

                    console.log('expand event received') 
                    if($scope.isOpen[tag]){
                        //collapse if already open
                        $scope.isOpen[tag] = false
                    }else{
                        expandTag(tag)
                    } 
                    

                    $scope.$apply()
                })

                $scope.clickedOn = function(tag) {
                    CommService.createNewEvent("component_clicked", { 'clicked_on': tag });
                    if(tag == "emailSubscription")
                        CommService.createNewEvent("clicked_email_component");
                }

                $scope.copy = function(src, dest, component) {
                    angular.copy(src, dest)

                    if (component.type == 'email-subscription') {
                        //for email-subcription component, provider values to the options field
                        angular.copy($rootScope.emailProviders, dest[0].templateOptions.options)

                    }
                }
                function expandTag(tag){
                    for(var i in $scope.isOpen){
                        $scope.isOpen[i] = false
                    }
                    $scope.isOpen[tag] = true
                }



            }],
            restrict: 'E',
            //template: '<formly-form model="cust.values" fields="cust.fields"></formly><br>{{cust.values}}'
            templateUrl: $rootScope.basePath + '/src/partials/component.form.directive.html'
        }
    }])