angular.module('yetienceApp')
    .service('CommService', ['$http', '$q', '$rootScope', 'md5', function($http, $q, $rootScope, md5) {
        var api_server = yetience.server

        this.updateStatsEmails = function(emails_array) {
            return putAndResolve('/api/Websites/' + $rootScope.SETUP.id, {
                statsEmails: emails_array
            })
        }

        this.getEmailLists = function(provider, website_id) {
            return getAndResolve('/api/EmailSubscriptions/lists?provider=' +
                provider + '&website_id=' + website_id)
        }

        this.getGoals = function() {
            return getAndResolve('/api/Goals', arrayToObject('label'))
        }

        this.markSaved = function(website_id) {
            return putAndResolve('/api/Websites/' + website_id, {
                saved: true
            })
        }
        this.createNewEvent = createNewEvent

        function createNewEvent(event, data) {
            yetience.sendEvent(event, $rootScope.SETUP.id, data);

        }


        this.getWebsite = function(id) {
            console.log('getting website')
            return getAndResolve('/api/Websites/' + id)
        }

        this.createWebsiteId = function() {

            return postAndResolve('/api/Websites', {
                platform: yetience.platform,
                initial_domain: window.location.host,
                product_id: yetience.product,
                createdVersion: yetience.version
            })

        }

        this.getNetworks = function() {
            return getAndResolve('/api/Networks')
        }

        this.getAllDetails = function(product_id) {
            console.log('inside getAllDetails')
            return getAndResolve('/api/Products/all_details?product=' + product_id)
        }

        this.getProductDetails = function(product_id) {
            return getAndResolve('/api/Products/' + product_id)
        }

        this.getThemes = function() {
            return getAndResolve('/api/Themes', arrayToObject('label'))
        }

        this.getCategories = function() {
            return getAndResolve('/api/Categories', arrayToObject('label'))
        }

        this.getComponents = function() {
            return getAndResolve('/api/Components', arrayToObject('label'))
        }

        this.getEmailProviders = function() {
            return getAndResolve('/api/EmailProviders', arrayToObject('label'))
        }


        this.getThemeTemplate = function(theme_id) {
            return getAndResolve('/themes/' + theme_id + '/' + theme_id + '-template.html', null, $rootScope.staticPath)
        }

        this.getPackages = function() {
            return getAndResolve('/subscription/api/Packages', arrayToObject('label'))
        }

        this.getFeatures = function() {
            return getAndResolve('/subscription/api/Features', arrayToObject('label'))
        }

        this.getCustomizations = getCustomizations

        function getCustomizations(component_id) {
            return getAndResolve('/api/components/' + component_id + '/api/' + component_id + '-customization.json', null, $rootScope.staticPath)
        }

        this.getThemeDetails = function(theme_id) {

        }

        this.getNetwork = function(network_id) {

        }


        this.createWidget = function(website_id, widget, customer) {
            console.log('creating new widget')
            widget.website_id = website_id
            widget.product_id = yetience.product

            if (customer && customer.password) {
                customer.password = md5.createHash(customer.password)
            }
            return postAndResolve('/api/Widgets/create_new', {
                widget: widget,
                customer: customer
            })
        }

        this.createWidgetOnServer = function(website_id, widget) {
            console.log('creating new widget')
            widget.website_id = website_id
            widget.product_id = yetience.product
            if (widget.widget_id) {
                return putAndResolve('/api/Widgets', widget)
            } else {
                return postAndResolve('/api/Widgets', widget)
            }

        }

        this.updateWidget = function(widget) {
            return putAndResolve('/api/Widgets/' + widget.widget_id, widget)
        }

        this.uploadSetup = function(website_id, setup) {

        }

        this.getStyleContent = function(id) {
            var el = document.getElementById(id)
            var url = el.getAttribute("href")
            return getAndResolve(url, null, '')
        }

        function postAndResolve(url, data, transform, base) {
            return comm(url, 'post', transform, data, base)
        }

        function putAndResolve(url, data, transform, base) {
            return comm(url, 'put', transform, data, base)
        }

        function getAndResolve(url, transform, base) {
            return comm(url, 'get', transform, null, base)
        }

        function comm(url, method, transform, data, base) {
            if (!base && base != '') {
                base = api_server
            }
            var D = $q.defer()
            console.log('making ' + method + ' call to ' + url)
            $http[method](base + url, data)
                .then(function(res) {
                    if (transform) {
                        D.resolve(transform(res.data))
                    } else {
                        D.resolve(res.data)
                    }
                }, function(err) {
                    alert('Unable to connect to server. Please refresh the page and try again')
                    console.log("HTTP ERROR")
                    console.log(err)
                    var error_to_send = err
                    if (err.data) {
                        error_to_send = err.data
                        if (err.data.error) {
                            error_to_send = err.data.error
                        }
                    }
                    createNewEvent('http_error', error_to_send)
                    D.reject()
                })
            return D.promise
        }

        function arrayToObject(keyAttribute) {
            return function(data) {
                var obj = {}
                data.forEach(function(a) {
                    obj[a[keyAttribute]] = a
                })

                return obj
            }
        }
    }])