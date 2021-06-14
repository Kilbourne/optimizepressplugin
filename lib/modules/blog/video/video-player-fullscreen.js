/**
 * Video Player Fullscreen
 * Youtube Api Player
 */

var op_yt_player = [];

function onYouTubeIframeAPIReady() {
   initVideoPlayerFullscreenYoutubeElements();
};

function initVideoPlayerFullscreenYoutubeElements() {
    opjq('.op-vpf-youtube').each(function(index) {
        var iframe_id = opjq(this).children('.op-vpf--frame').attr('id'),
            playBtn = opjq(this).children('.op-vpf--btn').children('.op-vpf--btn-element'),
            youtube_url = opjq(this).children('.op-vpf--frame').attr('data-youtube-url');

        op_yt_player[index] = {};
        op_yt_player[index]['iframe_id'] = iframe_id;
        op_yt_player[index]['youtube_player'] = new YT.Player(iframe_id, {
            height: '0',
            width: '0',
            videoId: getVideoId(youtube_url),
            events: {
                /*
                 * When Youtube API is loaded trigger onReady event
                 */
                'onReady': function() {
                    /*
                     * Pause video on fullscreen exit
                     */
                    document.addEventListener("fullscreenchange", function() {
                        if (!document.fullscreenElement) op_yt_player[index]['youtube_player'].pauseVideo();
                    }, false);

                    document.addEventListener("msfullscreenchange", function() {
                        if (!document.msFullscreenElement) op_yt_player[index]['youtube_player'].pauseVideo();
                    }, false);

                    document.addEventListener("mozfullscreenchange", function() {
                        if (!document.mozFullScreen) op_yt_player[index]['youtube_player'].pauseVideo();
                    }, false);

                    document.addEventListener("webkitfullscreenchange", function() {
                        if (!document.webkitIsFullScreen) op_yt_player[index]['youtube_player'].pauseVideo();
                    }, false);

                    /*
                     * Play video in fullscreen on button click
                     */
                    playBtn.on("click", function() {
                        var iframe = document.querySelector.bind(document)('#' + op_yt_player[index]['iframe_id']);
                        op_yt_player[index]['youtube_player'].playVideo();

                        var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
                        if (requestFullScreen) {
                            requestFullScreen.bind(iframe)();
                        }
                    });
                },
            }
        });
    });
}

function getVideoId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    }

    return "";
}

var op_url_player = [];

opjq(document).on('ready', function(){
    opjq('.op-vpf-url').each(function(index) {
        var iframe_id = opjq(this).children('.op-vpf--frame').attr('id'),
            playBtn = opjq(this).children('.op-vpf--btn').children('.op-vpf--btn-element'),
            mp4 = opjq(this).children('.op-vpf--frame').attr('data-mp4-url'),
            webm = opjq(this).children('.op-vpf--frame').attr('data-webm-url'),
            ogv =  opjq(this).children('.op-vpf--frame').attr('data-ogv-url'),
            auto_buffer =  opjq(this).children('.op-vpf--frame').attr('data-auto-buffer');

        op_url_player[index] = {};
        op_url_player[index]['url_player'] =  flowplayer('#' + iframe_id, {
            clip: {
              sources: [
                { 
                    type: "video/mp4",
                    src: mp4
                },
                { 
                    type: "video/webm",
                    src: webm
                },
                {
                    type: "video/ogv",
                    src: ogv
                }
              ]
            },
            autoBuffering: auto_buffer
            
          }).bind("fullscreen-exit", function(e, api) {
            op_url_player[index]['url_player'].pause();
          });

          playBtn.on("click", function(){
            op_url_player[index]['url_player'].fullscreen();
            op_url_player[index]['url_player'].resume();
          });
    });
});

