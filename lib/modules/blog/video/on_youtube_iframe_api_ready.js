/*
 * We only can have one onYoutubeIframeAPIReady() function
 */
function onYouTubeIframeAPIReady() {

	/*
	 * Video Background (PlusPack)
	 */
	 if (typeof initVideoBackgroundYoutubeElements === 'function') {
	 	initVideoBackgroundYoutubeElements();
	 }

	/*
     * Video Player ViewPort Fullscreen
     */
    if (typeof initVideoPlayerFullscreenYoutubeElements === 'function') {
    	initVideoPlayerFullscreenYoutubeElements();
    }

}