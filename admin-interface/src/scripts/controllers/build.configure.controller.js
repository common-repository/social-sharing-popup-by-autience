angular.module('yetienceApp')
    .controller('buildConfigureController', ['$scope', 'configurationFields', 'SettingsService', 'CommService', 'UtilsService', '$rootScope', '$state', function($scope, configurationFields, SettingsService, CommService, UtilsService, $rootScope, $state) {
        $scope.R = $rootScope
        $scope.C = CommService

        if (!UtilsService.checkNested($rootScope, ['widget', 'rendered'])) {
            console.log('rootScope does not have widget.rendered')
            $state.go('build.select')
        }

        $scope.configFields = angular.copy(configurationFields)

        $scope.description = function() {
            return $rootScope.basePath + '/src/partials/configuration.description.html'
        }

        console.log($scope.configFields)
            //attach categories as options where key is where_categories
        $scope.configFields.where.forEach(function(where_field) {

            if (where_field.key == 'where_categories') {

                //console.log('Assigned categories')
                where_field.templateOptions.options = yetience.categories
            }

            if (where_field.key == 'where_titles') {
                where_field.templateOptions.options = yetience.pageList
            }
        })

        $scope.sections = {
            whom: 'How often should the popup show up?',
            when: 'When should the popup show up?',
            where: 'On which pages should the popup show up? (Premium)',     
            close: 'How should the popup close?'
        }

        $scope.now = {
            editing: 'whom'
        }

        $scope.saving = false

        console.log('SettingsService.setup().features')
        console.log(SettingsService.setup().features)


        $scope.clickedSection = function(section) {
            CommService.createNewEvent('configuration_section_clicked', { section: section })
        }

        var modes = ['when', 'where', 'whom', 'how', 'close']
            //if user does not have advancedConfiguration, but selects it, then go to premium screen
        $scope.$watchGroup(['widget.configuration.when.mode', 'widget.configuration.where.mode', 'widget.configuration.whom.mode', 'widget.configuration.how.mode', 'widget.configuration.close.mode'], function(newModes) {

            for (var i in newModes) {
                if (newModes[i] == 'advanced' && !SettingsService.hasFeature('advancedConfiguration')) {

                    CommService.createNewEvent("advanced_setting_clicked", { section: modes[i] });
                    UtilsService.premiumMessage('Advanced configuration options are available on a premium plan. Please Upgrade.')
                        //reset configuration to default
                    for (var section in $scope.sections) {
                        $scope.widget.configuration[section].mode = 'default'
                    }
                    break
                }
            }

        })

    }])