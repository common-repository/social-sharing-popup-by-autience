Autience.lifecycle.displayValidation.push(function(widget) {
    var isMobile = Autience.utils.isMobile()
    if (isMobile && Autience.setup && Autience.setup.package_id == 'default') {
        console.log('Popup is not shown on mobile in lite version')
        return false
    }
    return true
})

Autience.lifecycle.displayValidation.push(function(widget) {
    var where = widget.configuration.where
    var cat = null
    var where_categories = widget.configuration.where_categories
    var where_titles = widget.configuration.where_titles



    if (autience_is_home) {
        return where.home
    }

    if (window.autience_page_name == 'checkout') {
        return where.checkout
    }

    switch (where.other) {
        case 'all':
            return true
        case 'none':
            return false
        case 'specific':
            switch (where.specific.selector) {
                case 'pageType':
                    switch (window.autience_post_type) {
                        case 'post':
                            return where.pageTypes.posts
                        case 'product':
                            return where.pageTypes.products
                        case 'page':
                            return where.pageTypes.pages
                    }
                    break;
                case 'category':

                    for (var i = 0; i < window.autience_categories.length; i++) {
                        cat = autience_categories[i].cat_ID
                        if (where_categories.indexOf(cat) >= 0 || where_categories.indexOf(cat.toString()) >= 0) {

                            return true
                        }
                    }

                    console.log('returning false')
                    return false
                    break;
                case 'title':

                    var index = where_titles.indexOf(window.autience_post_id)

                    console.log('title at ' + index)
                    return (index >= 0)
                    break;
            }

    }

    return true
})

Autience.lifecycle.render.push(function(widget) {
    // console.log('inside back button code')
    // console.log(widget.trigger)
    if (widget.trigger && widget.trigger.trigger == 'back') {

        //window.location.hash = 'yeloni';//Autience.utils.randomString()
        if (!window.location.hash) {
            window.location = window.location + "#yeloni"
            setTimeout(function() {
                Autience.hash_set = true
            }, 10)
        }


    }

})