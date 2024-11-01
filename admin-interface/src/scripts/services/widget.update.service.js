angular.module('yetienceApp')
    .service('WidgetUpdate', ['CommService', '$state', '$timeout', 'SettingsService', function(CommService, $state, $timeout, SettingsService) {

        var current = {
            state: null,
            working: false
        }
        this.current = current


        var states = {
            select: {
                show: false,
                tabTitle: 'Select',
                create: true,
                edit: false
            },
            design: {
                show: true,
                //next: 'launch',
                title: 'Save my Design',
                operation: 'saveTemplate',
                tabTitle: 'Design',
                create: true,
                edit: true
            }/*,
            launch: {
                show: true,
                operation: 'launchPopup',
                tabTitle: 'Launch',
                create: true,
                edit: true
            }
            */
        }
        this.states = states

        this.goToNextState = goToNextState

        function goToNextState() {
            var next_state = nextStates['build.' + current.state]
            if (next_state) {
                $state.go(next_state)
            }
        }

        var nextStates = {
            "build.select": "build.design"
            //"build.design": "build.launch.statistics"
                //"build.configure": "build.activate"
        }

        this.nextFunction = function(widget, customer) {
            var operation = states[current.state].operation
            if (operation) {
                //set working as true
                current.working = true
                operations[operation](widget, customer, function() {
                    $timeout(function() {
                        current.working = false
                    }, 50)

                    goToNextState()
                })
            }
        }

        var operations = {
            saveTemplate: function(widget, customer, cb) {
                var html = document.getElementById('widget-design').innerHTML

                widget.rendered = window.btoa(encodeURIComponent(html))

                CommService.getStyleContent("autience-theme-style")
                    .then(function(content) {
                        theme_styles = content
                            //console.log("theme_styles")
                            //console.log(theme_styles)
                        return CommService.getStyleContent("autience-common-style")
                    })
                    .then(function(content) {
                        common_styles = content
                            //console.log("common_styles")
                            //console.log(common_styles)

                        var merged_styles = theme_styles + '\n' + common_styles

                        widget.styles = window.btoa(encodeURIComponent(merged_styles))

                        SettingsService.SaveCurrentPopup()

                        cb()
                    })
            },
            updateWidget: function(widget, customer, cb) {
                if (widget.widget_id) {
                    //existing widget, update before proceeding
                    CommService.updateWidget(widget)
                        .then(function(widget) {
                            SettingsService.saveSetup('Your Widget has been Updated', 'Click here to Save Changes')

                            CommService.createNewEvent("popup_updated");
                            cb()
                        })
                } else {
                    //new widget. proceed
                    cb()
                }

            },
            createWidget: function(widget, customer, cb) {

                //Take the widget on scope and create a new widget on the server
                CommService.createWidget(SettingsService.setup().id, widget, customer)
                    .then(function(created_widget) {

                        CommService.createNewEvent("design_saved");

                        widget.widget_id = created_widget.widget.widget_id
                        if (widget.configuration.what.domain) {
                            SettingsService.setup().domain = widget.configuration.what.domain
                        }
                        SettingsService.saveSetup('Your Widget has been Created', 'Click here to Save Changes')
                    })
            }
        }

    }])