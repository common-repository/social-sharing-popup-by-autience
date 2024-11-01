angular.module('yetienceApp')
    .service('SettingsService', ['CommService', '$rootScope', 'configurationFields', '$cookies', '$q', 'UtilsService', '$stateParams', '$location', function(CommService, $rootScope, configurationFields, $cookies, $q, UtilsService, $stateParams, $location) {


        var setup = null
        var encode = function(x) {
            return window.btoa(encodeURIComponent(x))
        }

        var decode = function() {

            return decodeURIComponent(window.atob)
        }
        this.encode = encode

        this.decode = decode

        this.setup = function() {
            return setup
        }

        function getWebsiteAndAttach(website_id, check_saved) {
            //get the latest website instance corresponding to the id

            return CommService.getWebsite(website_id)
                .then(function(website) {
                    console.log('check_saved- ' + check_saved + ' website.saved- ' + website.saved)
                    if (website.saved == check_saved) {
                        var package_upgraded = false
                        if (setup.package_id != website.package_id) {
                            package_upgraded = true

                        }
                        angular.extend(setup, website)

                        addAdvancedConfigurationOnSetup(setup, website)

                        if (check_saved == false) {
                            saveSetup('', 'Got it. Thanks!')
                        } else {
                            if (package_upgraded) {
                                saveSetup("Congratulations!. Your are now subscribed to the Premium Version", 'Got it. Thanks')
                            }
                        }


                        return $q.resolve(website)
                    } else {
                        return $q.reject()
                    }
                })
        }

        function createWebsiteAndAttach() {
            return CommService.createWebsiteId()
                .then(function(website) {

                    $cookies.put("autience-website-id", website.id)
                    angular.extend(setup, website)
                    saveSetup('', 'Got it. Thanks!')

                    //CommService.createNewEvent("website_created");
                    return $q.resolve(website)
                })
        }

        this.initialize = function(cb) {
            //when the page loads, read the setup and upload it to the server
            var setup_on_platform = yetience.readFromPlatform()
            if (setup_on_platform) {
                setup = setup_on_platform
                $rootScope.SETUP = setup
            }

            if (!setup.id) {
                console.log('NO WEBSITE ON SETUP')
                    //website id is not saved on wordpress
                    //check if there is a website_id on intermediate cookie
                if ($cookies.get("autience-website-id")) {
                    //attach website from cookie if, if website.saved is false
                    console.log('trying with website_id fro cookie- ' + $cookies.get("autience-website-id"))
                    getWebsiteAndAttach($cookies.get("autience-website-id"), false)
                        .then(function() {
                            console.log("Attached website id from cookie")
                            cb()
                        }, function() {
                            console.log("Cannot attach website id of cookie. Creating a new one")
                            createWebsiteAndAttach().then(cb)
                        })
                } else {
                    console.log("there is no website id on cookie")
                    createWebsiteAndAttach().then(cb)
                }


            } else {
                console.log('WEBSITE ID found on setup')

                getWebsiteAndAttach(setup.id, true).then(function() {
                    cb()
                }, function() {
                    console.log('website is not yet marked as saved.. marking')
                    CommService.markSaved(setup.id).then(function() {
                        console.log("marked as saved")
                        CommService.createNewEvent("website_saved")
                        cb()
                    })
                })
            }

        }



        function addAdvancedConfigurationOnSetup(setup, website) {
            if (setup.widgets && website.features && website.features.indexOf("advancedConfiguration") >= 0) {
                for (var i = 0; i < setup.widgets.length; i++) {
                    setup.widgets[i].configuration.advancedConfiguration = true
                }
            }
        }

        this.saveSetup = saveSetup

        function saveSetup(message, label) {
            console.log('setup before saving')
            console.log(setup)
            yetience.saveToPlatform(setup, message, label)
                //console.log('reading after saving')
                //console.log(yetience.readFromPlatform())
            $rootScope.readyToSave = true
        }

        this.addNewWidget = function(theme_id, widget) {
            //pushing will be done at the end
            //setup.widgets.push(widget)

            widget.theme = theme_id
            var theme = $rootScope.themes[theme_id]
            var categories = theme.categories

            var components = {},
                component_type = null

            //create components object for the widget
            for (var tag in theme.components) {
                component_type = theme.components[tag].component

                components[tag] = {
                    tag: tag,
                    type: component_type,
                    title: theme.components[tag].title
                }

                //components[tag].fields = $rootScope.components[component_type].customizations
                if ($rootScope.components[component_type]) {
                    components[tag].fields = $rootScope.components[component_type].fields
                } else {
                    console.log('ERROR: component ' + component_type + ' is not defined for tag ' + tag)
                }

                components[tag].values = {}
            }

            widget.components = components

            /*
            //configuration is used from the default configuration of the category
            
            widget.configuration = $rootScope.categories[theme.categories[0]].default
            console.log($rootScope.categories[theme.categories[0]].default)
            */
            //Starting from default configuration defined in configuration.constant
            widget.configuration = configurationFields.default

            //Check if there is already a domain for this setup. If domain exists,mark it on configuration.what

            widget.configuration.what.existing_domain = setup.domain
            widget.configuration.what.existing_account = setup.account_id

            //set premium user as true if it is a premium user
            //widget.configuration.premiumUser = true
            if (setup.features && setup.features.indexOf("advancedConfiguration") >= 0) {

                widget.configuration.advancedConfiguration = true

            }

            CommService.getThemeTemplate(theme_id)
                .then(function(template) {
                    //console.log(template)
                    widget.raw = encode(template)
                    widget.rendered = encode(template)
                })
        }

        this.hasFeature = function(feature) {
            if (setup) {
                if (setup.features && setup.features.indexOf(feature) >= 0) {
                    return true
                }
            }

            return false
        }

        this.isPremium = function() {
            if (setup.package_id && setup.package_id != 'default') {
                return true
            }
        }

        this.createWidget = function(theme) {
            return { code: UtilsService.getRandomCode(), initialization: {}, theme: theme }
        }

        this.getWidget = function(index) {
            return setup.widgets[index]
        }

        this.pushWidget = pushWidget

        function pushWidget(widget) {
            setup.widgets.push(widget)
        }

        this.setWidget = setWidget

        function setWidget(widget, index) {
            setup.widgets[index] = widget
        }


        this.SaveCurrentPopup = function() {
            console.log('Calling Save Popup')

            if (!$rootScope.widget.configuration.what.name) {
                $rootScope.widget.configuration.what.name = "My First Popup"
            }
            //if create mode, then add to SettingsService.setup
            //otherwise update based on index
            var mode = $stateParams.mode
            var index = $location.search().index
            console.log('mode - ' + mode + ' index- ' + index)
            if (mode == 'create') {
                console.log('pushing widget')
                CommService.createNewEvent('design_saved')
                //checking if there are no widgets created earlier and only then creating first_widget_time
                if (!setup.first_widget_time) 
                {
                    console.log('adding first_widget_time')
                    setup.first_widget_time = Math.round(new Date().getTime() / 1000);
                }
                pushWidget($rootScope.widget)
                saveSetup('This Popup will show up on all pages of your website when a Visitor <b>moves their mouse towards the Close Button of the Browser.</b><div class="yel-instructions"><ul><li>Click the button below to Save your Popup</li><li>Open any page on your website</li><li>Wait till the page fully loads</li><li>Move your mouse towards the close button</li><li>The Popup should show up</li><li>After saving, you can configure the Popup behaviour</li></ul></div><br>If something does not work as expected, please contact our Support Team using the Live Chat below', 'Click here to Save')
            } else {
                CommService.createNewEvent('popup_updated')
                setWidget($rootScope.widget, index)
                saveSetup('<center>This Widget has been Updated</center>', 'Save')
            }


        }
    }])
