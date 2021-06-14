/**
 * Google ReCaptcha stuff for the frontend
 */
(function ($) {
    var siteKey = OptimizePress.google_recaptcha_site_key;

    grecaptcha.ready(function() {
        grecaptcha.execute(siteKey, {action: 'op2optin'}).then(function(token){
            var $form = $.find('.op-optin-validation');

            if ($form.length > 0) {
                // append hidden field with google's token
                $('<input>').attr({
                    type: 'hidden',
                    name: 'grecaptcha-token',
                    value: token
                }).appendTo($form);

                // show Google badge as it is needed
                var badge = $('.grecaptcha-badge');
                badge.show();
                badge.css('visibility', 'visible');
            }
        });
    });


}(opjq));