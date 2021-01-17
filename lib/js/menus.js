// this file is loaded only on front end!
(function ($) {

    $(document).ready(function(){
        //Loop through all menu items
        // $('body .container .navigation > ul > li > a').each(function(){
        //      var parentLi = $(this).parent('li');
        //      var parentMenu = $(this).parent().parent().parent().parent().parent().parent();
        //      if (!parentMenu.hasClass('op-page-header') && !parentMenu.hasClass('banner')) parentMenu = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent();
        //      var bg = parentMenu.css('background-image');

        //      if (bg!='none') parentLi.addClass('no-transparency');
        // });
        // fade in for elements only on frontend!

        $("[data-fade]").each(function(){
            var $el = $(this);
            var style;

            // Popup children are triggered separately
            if (!$el.attr('data-popup-child') && $el.attr('data-popup-child') !== 'true') {
                setTimeout(function () {
                    style = $el.attr('style');
                    style = style || '';
                    style = style.replace(/display:\s?none;?/gi, '');
                    $el.attr('style', style);
                    $el.css({ opacity: 0 });
                    $el.animate({ opacity: 1 });
                }, parseInt($el.attr('data-fade'), 10) * 1000);
            }
        });
    });

}(opjq));