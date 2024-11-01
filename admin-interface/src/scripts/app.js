console.log('Yetience APP loading')

//Initialize the app and route configuration here

angular.module('yetienceApp', ['ui.router', 'formly', 'formlyBootstrap', 'jsonFormatter', 'ui.bootstrap', 'angular-md5', 'ngCookies','LocalStorageModule'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    if (yetience.website_saved) {
        $urlRouterProvider.otherwise('/list')
    } else {
        $urlRouterProvider.otherwise('/start')
    }


    $stateProvider
        .state('start', {
            url: '/start',
            templateUrl: yetience.adminPath + '/src/partials/start.html',
            controller: 'StartController'
        })
        .state('list', {
            url: '/list',
            templateUrl: yetience.adminPath + '/src/partials/list.html',
            controller: 'ListController'
        })
        .state('faq', {
            url: '/faq',
            templateUrl: yetience.adminPath + '/src/partials/faq.html',
            controller: 'FaqController'
        })
        .state('premium', {
            url: '/premium',
            templateUrl: yetience.adminPath + '/src/partials/gopremium.html',
            controller: 'GoPremiumController'
        })
        .state('build', {
            url: '/:mode/build',
            templateUrl: yetience.adminPath + '/src/partials/build.html',
            controller: 'buildController'
        })
        .state('build.select', {
            url: '/select',
            templateUrl: yetience.adminPath + '/src/partials/build.select.html',
            controller: 'buildSelectController'
        })
        .state('build.design', {
            url: '/design',
            templateUrl: yetience.adminPath + '/src/partials/build.design.html',
            controller: 'buildDesignController'
        })
        /*
        .state('build.configure', {
            url: '/configure',
            templateUrl: yetience.adminPath + '/src/partials/build.configure.html',
            controller: 'buildConfigureController'
        })
        .state('build.activate', {
            url: '/activate',
            templateUrl: yetience.adminPath + '/src/partials/build.activate.html',
            controller: 'buildActivateController'
        })
        .state('build.launch', {
            url: '/launch',
            template:'<div ui-view></div>',
            controller: 'buildLaunchController'
        })
        .state('build.launch.statistics', {
            url: '/statistics',
            templateUrl: yetience.adminPath + '/src/partials/build.launch.statistics.html',
            controller: 'buildLaunchStatisticsController'
        })
        .state('build.launch.package', {
            url: '/package',
            templateUrl: yetience.adminPath + '/src/partials/build.launch.package.html',
            controller: 'buildLaunchPackageController'
        })
        .state('goals', {
            url: '/goals',
            templateUrl: yetience.adminPath + '/src/partials/goals.html',
            controller: 'GoalsController'
        })
        */
}])