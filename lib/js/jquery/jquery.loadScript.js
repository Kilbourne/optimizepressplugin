(function ($) {
  $.loadScript = function (url, arg1, arg2) {
    var cache = false, callback = null;
    //arg1 and arg2 can be interchangable
    if ($.isFunction(arg1)){
      callback = arg1;
      cache = arg2 || cache;
    } else {
      cache = arg1 || cache;
      callback = arg2 || callback;
    }

    var load = true;
    //check all existing script tags in the page for the url
    $('script[type="text/javascript"]')
      .each(function () {
        return load = (url != $(this).attr('src'));
      });
    if (load){
      //didn't find it in the page, so load it
      $.ajax({
        type: 'GET',
        url: url,
        success: callback,
        dataType: 'script',
        cache: cache
      });
    } else {
      //already loaded so just call the callback
      if ($.isFunction(callback)) {
        callback.call(this);
      };
    };
  };
}(opjq));