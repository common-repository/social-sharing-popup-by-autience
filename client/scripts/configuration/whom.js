if (Autience) {
    Autience.lifecycle.display.push(function(widget) {
        //create cookies as required
        Autience.utils.createCookie("autience-displayed-visitor-" + widget.code, true, true)
        Autience.utils.createCookie("autience-displayed-session-" + widget.code, true)

    })


    Autience.lifecycle.displayValidation.push(function(widget) {
        if (Autience.utils.nestedValue(widget, ['configuration', 'whom', 'once'])) {
            // console.log('once is ' + widget.configuration.whom.once)
            switch (widget.configuration.whom.once) {
                case 'visitor':
                    if (Autience.utils.readCookie("autience-displayed-visitor-" + widget.code)) {
                        console.log('visitor cookie exists')
                        return false
                    }
                    break
                case 'session':
                    if (Autience.utils.readCookie("autience-displayed-session-" + widget.code)) {
                        console.log('session cookie exists')
                        return false
                    }
                    break

                case 'always':
                    return true
                    break
            }
        }

        return true
    })
}