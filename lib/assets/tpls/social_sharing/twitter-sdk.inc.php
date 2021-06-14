<!-- Twitter -->
<script type="text/javascript">!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
<script>
    /* We want to reload the button after liveeditor element gets edited */
    if (typeof twttr === "object"
        && typeof twttr.widgets === "object"
        && typeof twttr.widgets.load === "function") {
        try {
            twttr.widgets.load();
        } catch (e) {}
    }
</script>