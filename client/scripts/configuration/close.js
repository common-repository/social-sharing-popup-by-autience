//attach close functionality to the close button
//close button has an id called autience-close-widget_id
Autience.lifecycle.postRender.push(function(widget) {

    Autience.utils.classListen('autience-close-' + widget.code, 'click', function(el) {
        Autience.utils.closeWidget(widget)
    })
})

Autience.lifecycle.postRender.push(function(widget) {

    Autience.utils.idListen('autience-close-' + widget.code, 'click', function(el) {
        //if the user clicks the close button on a link trigger, check if we need to redirect

        if (Autience.utils.nestedValue(widget, ['trigger', 'trigger']) == 'link' && Autience.utils.nestedValue(widget, ['configuration', 'when', 'link', 'close'])) {
            Autience.utils.redirect(Autience.current_link, Autience.current_target)
        }
    })
})


//for close clicking outside
Autience.lifecycle.postRender.push(function(widget) {
        if (Autience.utils.nestedValue(widget, ['configuration', 'close', 'outside'])) {
            console.log('close on clicking outside')

            Autience.utils.classListen('yel-popup-main-wrapper', 'click', function() {
                console.log('clicked outside')
                Autience.utils.closeWidget(widget)
            })
            Autience.utils.classListen('yel-popup-template', 'click', function(e) {
                e.stopPropagation();
            })
        }
    })
    //close lifecycle

Autience.lifecycle.close.push(function(widget) {
    document.getElementById(widget.code).style.visibility = 'hidden'
    if (widget.default_display) {
        document.getElementById(widget.code).style.display = widget.default_display
    }
})


//close the zopim window if needed
Autience.lifecycle.close.push(function(widget) {
    if (typeof $zopim != 'undefined') {
        $zopim.livechat.window.hide();
    }
})

Autience.lifecycle.postRender.push(function(widget) {
    //Show an alertbox before the browser window closes
    console.log('before close')
    console.log(widget)
    if (Autience.utils.nestedValue(widget, ['configuration', 'close', 'alert'])) {
        window.onbeforeunload = function(e) {
            return Autience.utils.nestedValue(widget,['configuration', 'close', 'message'])
        };
    }
})