Autience.lifecycle.display.push(function(widget) {
    //core function which shows the popup
    document.getElementById(widget.code).style.visibility = 'visible'
    widget.default_display = document.getElementById(widget.code).style.display
    document.getElementById(widget.code).style.display = 'block'
})

//function to add widget rendered into a wrapper div
Autience.lifecycle.render.push(function(widget) {

    //create a new widget with a wrapper if it does not already exist
    if (!document.getElementById(widget.code)) {
        var widgetDiv = document.createElement('div')

        widgetDiv.style.visibility = 'hidden'
        widgetDiv.id = widget.code
        widgetDiv.className = "yel-popup-main-wrapper"

        var base64_decoded = Autience.utils.decode(widget.rendered)
        if(!base64_decoded ||base64_decoded.length == 0){
            Autience.utils.sendEvent('client_template_empty')
        }
        var inner_html = Autience.utils.stripAndExecuteScript(decodeURIComponent(base64_decoded))
        widgetDiv.innerHTML = inner_html
        //console.log('inner_html')
        //console.log(inner_html)
        widgetDiv.style.background = "url('" + window.yetience.path + "/common/images/opaque-bg.png') top left repeat"


        //console.log(widgetDiv.innerHTML)
        document.body.appendChild(widgetDiv)
    } else {
        console.log('widget with code ' + widget.code + ' already exists')
    }

})


Autience.lifecycle.render.push(function(widget) {
    var styles_to_add = decodeURIComponent(Autience.utils.decode(widget.styles))

    //addStyle(styles_to_add)

    
    var head = document.head || document.getElementsByTagName('head')[0]
    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = styles_to_add;
    } else {
        style.appendChild(document.createTextNode(styles_to_add));
    }

    head.appendChild(style);
})