//console.log('injecting email.js')
if (Autience) {

    email_json = {}
    Autience.lifecycle.postRender.push(function(widget) {

        var name = null,
            email = null,
            name_field_id = 'autience-emailform-name-' + widget.code,
            email_field_id = 'autience-emailform-email-' + widget.code,
            email_error_id = 'autience-emailform-email-error-' + widget.code,
            name_error_id = 'autience-emailform-name-error-' + widget.code,
            submit_field_id = 'autience-emailform-submit-' + widget.code

        var values = Autience.utils.nestedValue(widget, ['components', 'emailSubscription', 'values'])
        if (!values) {
            return
        }
        // console.log(widget)
        if (widget.components.emailSubscription) {

            Autience.utils.idListen(submit_field_id, 'click', function() {
                //console.log("submit clicked")
                var previous_submit_text = document.getElementById(submit_field_id).innerHTML
                document.getElementById(submit_field_id).innerHTML = "Hold on.."

                name = document.getElementById(name_field_id).value
                if (!validateName(name)) {
                    //console.log("Invalid name"+name_error_id)
                    document.getElementById(name_error_id).innerHTML = 'Invalid Name'
                    document.getElementById(name_error_id).style.display = 'block'
                    document.getElementById(submit_field_id).innerHTML = previous_submit_text
                    return;
                } else {
                    document.getElementById(name_error_id).style.display = 'none'
                }


                email = document.getElementById(email_field_id).value
                if (!validateEmail(email)) {
                    //console.log("Invalid email")
                    document.getElementById(email_error_id).innerHTML = 'Invalid Email'
                    document.getElementById(email_error_id).style.display = 'block'
                    document.getElementById(submit_field_id).innerHTML = previous_submit_text
                    return;
                } else {
                    document.getElementById(email_error_id).style.display = 'none'
                }


                var provider = widget.components.emailSubscription.values.provider
                var list = widget.components.emailSubscription.values.list

                
                //creating a variable
                var autience_user_details = {
                    "email": email,
                    "name": name,
                    "website_id": Autience.setup.id,
                    "provider": provider,
                    "list": list
                }
                Autience.utils.sendEvent('new_email_subscribed',autience_user_details);
                var autience_subscription_url = yetience.server + '/api/EmailSubscriptions/new_subscription';

                //function(url, method, data, success, failure)
                window.yetience.ajax(autience_subscription_url, 'POST', autience_user_details,
                    function(status_response) {
                        //success
                        console.log('email response')
                        console.log(status_response)
                        var status = JSON.parse(status_response).status;

                        if(status == "CREATED_SUBSCRIPTION"){
                            Autience.utils.sendEvent('provider_email_saved',autience_user_details); 
                            window.location="http://yeloni.com/emails/subscription-thankyou.html"
                            return
                        }

                        document.getElementById(submit_field_id).innerHTML = previous_submit_text

                        if (status == "ALREADY_SUBSCRIBED") {
                            document.getElementById(email_error_id).innerHTML = 'Email is already subscribed'
                            document.getElementById(email_error_id).style.display = 'block'                            
                        }

                        
                    },
                    function() {
                        //error
                        console.log("something went wrong")
                    });


            })

        }


        function validateEmail(email) {
            if (!email || email.length < 2) {
                return false
            }
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }

        function validateName(name) {
            if (!widget.components.emailSubscription.values.askName) {
                return true
            }
            if (!name || name.length < 2) {
                return false
            }

            var r_name = new RegExp(/^[a-zA-Z. ]+$/);
            var ret_reg = r_name.test(name)

            return ret_reg
        }

    })



}