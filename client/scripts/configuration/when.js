//log for popup displayed
Autience.lifecycle.display.push(function(widget) {
    //checking if the popup code is present and sending popup_displayed event
    var code = document.getElementById(widget.code).innerHTML
    if (code) {
        Autience.utils.sendEvent('popup_displayed');
    } else {
        Autience.utils.sendEvent('popup_empty');
    }
})

//Zopim related functionality
Autience.lifecycle.display.push(function(widget) {

    if (Autience.utils.nestedValue(widget, ['components', 'zopimChat']) && typeof $zopim !== 'undefined') {
        $zopim(function() {

            var yel_body_height = window.innerHeight
            var yel_body_width = window.innerWidth
            var yel_zopim_height = 400
            var yel_zopim_width = 310
            var yel_popup_offset = 76

            $zopim.livechat.window.show();
            var yel_loc = document.getElementById("yel-chat-wrapper").getBoundingClientRect();
            //console.log(yel_body_width)
            //console.log(yel_loc.left)
            //console.log(yel_loc.top)

            $zopim.livechat.window.setOffsetHorizontal(yel_body_width - yel_zopim_width - yel_loc.left - 5);
            $zopim.livechat.window.setOffsetVertical((yel_body_height - yel_zopim_height) - yel_popup_offset);

            if (yel_body_width < 767) {
                $zopim.livechat.window.setOffsetVertical((yel_body_height - yel_zopim_height) - yel_loc.top);
                $zopim.livechat.window.setOffsetHorizontal((yel_body_width - yel_zopim_width) / 2);
            }

        });
    }
})

//attach listener to display when the event occurs
Autience.lifecycle.onPageLoad.push(function(widget) {

    if (Autience.utils.nestedValue(widget, ['configuration', 'what', 'enable'])) {
        var when = widget.configuration.when

        var is_mobile = Autience.utils.isMobile()
            // console.log('is mobile- ' + is_mobile)
        var different_for_mobiles = when.smallDifferent
        var device = 'large',
            delay = 0


        if (is_mobile && different_for_mobiles) {
            device = 'small'
        }

        var trigger = when[device]
        var autience_event = trigger
        switch (trigger) {
            //handle these trigger cases differently
            case 'scroll':
                autience_event = 'scroll_' + when.scroll[device]
                break
            case 'delay':
                autience_event = 'load'
                delay = when.delay[device]
                break
            case 'link':
                var link_type = when.link[device]
                autience_event = 'link_' + link_type
                Autience['disable_link_' + link_type] = true
                break
        }

        displayPopup(autience_event, delay)
        widget.trigger = {
            trigger: trigger,
            autience_event: autience_event,
            delay: delay
        }

    } else {
        Autience.utils.sendEvent('client_widget_disabled')
        console.log('widget is disabled')
    }

    function displayPopup(autience_event, delay) {

        Autience.utils.listenAutienceEvent(autience_event, function(evt) {
            setTimeout(function() {
                Autience.utils.cycle(Autience.lifecycle.display, widget)
                    // console.log('Popup is triggered')
                Autience.utils.sendEvent('popup_triggered')
            }, delay * 1000)


        })
    }

})
