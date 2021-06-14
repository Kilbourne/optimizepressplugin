var op_yt_player = [];
/**
 * Video Player Fullscreen
 * Youtube Api Player
 */

function initVideoPlayerFullscreenYoutubeElements() {
    opjq('.op-vpf-youtube').each(function(index) {
        var element = opjq(this),
            iframe_id = element.children('.op-vpf--frame').attr('id'),
            playBtn = element.children('.op-vpf--btn').children('.op-vpf--btn-element'),
            youtube_url = element.children('.op-vpf--frame').attr('data-youtube-url'),
            closeBtn = element.children('.op-vpf--frame-close'),
            rowZindex = element.closest('.row').css('zIndex');

        op_yt_player[index] = {};
        op_yt_player[index]['iframe_id'] = iframe_id;
        op_yt_player[index]['rowZindex'] = rowZindex;
        op_yt_player[index]['youtube_player'] = new YT.Player(iframe_id, {
            height: '0',
            width: '0',
            videoId: getVideoId(youtube_url),
            events: {
                'onReady': function() {
                     /*
                     * Play button click event listener
                     */
                    playBtn.on("click", function() {
                        var iframe = document.querySelector.bind(document)('#' + op_yt_player[index]['iframe_id']),
                            element = opjq(this);
                        op_yt_player[index]['youtube_player'].playVideo();
                        opjq("#content_area").css({ zIndex: '10000' });
                        element.parent().next().next().removeClass('op-vpf--frame-close-hidden');
                        element.parent().next().addClass('op-vpf--playing').animate({ opacity: '1' }, 400);
                        element.closest('.row').css({zIndex: '10000'});
                    });

                    /*
                     * Close icon click event listener
                     */
                    closeBtn.on("click", function() {
                        var element = opjq(this);
                        op_yt_player[index]['youtube_player'].pauseVideo();
                        element.addClass('op-vpf--frame-close-hidden');
                        opjq("#content_area").css({ zIndex: '20' });
                        element.closest('.row').css({zIndex: rowZindex});
                        element.prev().animate({ opacity: '0' }, 400, function() {opjq(this).removeClass('op-vpf--playing');});

                    });

                    /*
                     * Esc keypress event listener
                     */
                    opjq(document).keydown(function(e) {
                        if (e.keyCode == 27 && opjq('.op-vpf-youtube').children('.op-vpf--frame').hasClass('op-vpf--playing')) {

                            var frames = opjq('.op-vpf--frame');

                            frames.each(function(index) {
                                opjq(this).removeClass('op-vpf--playing');
                                opjq(this).next().addClass('op-vpf--frame-close-hidden');
                                opjq(this).closest('.row').css({zIndex: rowZindex});
                            });

                            for (var i = 0; i < op_yt_player.length; i++) {
                                op_yt_player[i]['youtube_player'].pauseVideo();
                            }

                            opjq("#content_area").css({ zIndex: '20' });
                            
                        }
                    });
                }
            }
        });
    });
}

/**
 * Get youtube video url from string input
 */
function getVideoId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    }

    return "";
}

var op_url_player = [];

opjq(document).on('ready', function() {
    opjq('.op-vpf-url').each(function(index) {
        var iframe_id = opjq(this).children('.op-vpf--frame').attr('id'),
            playBtn = opjq(this).children('.op-vpf--btn').children('.op-vpf--btn-element'),
            mp4 = opjq(this).children('.op-vpf--frame').attr('data-mp4-url'),
            webm = opjq(this).children('.op-vpf--frame').attr('data-webm-url'),
            ogv = opjq(this).children('.op-vpf--frame').attr('data-ogv-url'),
            auto_buffer = opjq(this).children('.op-vpf--frame').attr('data-auto-buffer'),
            closeBtn = opjq(this).children('.op-vpf--frame-close'),
            rowZindex = opjq(this).closest('.row').css('zIndex');

        op_url_player[index] = {};
        op_url_player[index]['rowZindex'] = rowZindex;
        op_url_player[index]['url_player'] = flowplayer('#' + iframe_id, {
            clip: {
                sources: [{
                    type: "video/mp4",
                    src: mp4
                }, {
                    type: "video/webm",
                    src: webm
                }, {
                    type: "video/ogv",
                    src: ogv
                }]
            },
            autoBuffering: auto_buffer

        });
        /*
         * Play button click event listener
         */
        playBtn.on("click", function() {
            var element = opjq(this);
            op_url_player[index]['url_player'].resume();
            element.parent().next().next().removeClass('op-vpf--frame-close-hidden');
            element.parent().next().addClass('op-vpf--playing').animate({ opacity: '1' }, 400);
            opjq("#content_area").css({ zIndex: '10000' });
            element.closest('.row').css({zIndex: '10000'});
        });

        /*
         * Close button click event listener
         */
        closeBtn.on("click", function() {
            var element = opjq(this);
            element.addClass('op-vpf--frame-close-hidden');
            op_url_player[index]['url_player'].pause();
            element.prev().animate({ opacity: '0' }, 400, function() {
                opjq(this).removeClass('op-vpf--playing');
            });
            opjq("#content_area").css({ zIndex: '20' });
            element.closest('.row').css({zIndex: rowZindex});
        });

        /*
         * Esc keypress event listener
         */
        opjq(document).keydown(function(e) {
            if (e.keyCode == 27 && opjq('.op-vpf-url').children('.op-vpf--frame').hasClass('op-vpf--playing')) {

                var frames = opjq('.op-vpf-url');

                frames.each(function(index) {
                    opjq(this).children('.flowplayer').removeClass('op-vpf--playing');
                    opjq(this).children('.op-vpf--frame-close').addClass('op-vpf--frame-close-hidden');
                    opjq(this).closest('.row').css({zIndex: rowZindex});
                });

                for (var i = 0; i < op_url_player.length; i++) {
                    op_url_player[i]['url_player'].pause();
                }

                opjq("#content_area").css({ zIndex: '20' });
            }
        });
    });
});
