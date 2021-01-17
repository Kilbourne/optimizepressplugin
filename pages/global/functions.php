<?php
if(!function_exists('op_page_comment')){
function op_page_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
	switch ( $comment->comment_type ) :
		case 'pingback' :
		case 'trackback' :
	?>
	<li id="comment-<?php comment_ID(); ?>" <?php comment_class(); ?>>
		<span class="author"><?php comment_author_link(); ?></span> - 
		<span class="date"><?php echo get_comment_date(get_option( 'date_format' )) ?></span>
		<span class="pingcontent"><?php comment_text() ?></span>
	<?php
			break;
		default :
	?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
    	<div id="comment-<?php comment_ID(); ?>">
			<?php echo get_avatar( $comment, 75 ); ?>
            <div class="comment-meta cf">
                <p><?php comment_author_link() ?></p>
                <?php comment_reply_link( array_merge( $args, array( 'reply_text' => sprintf(__( '%1$s Reply', 'optimizepress'), '<img src="'.op_page_img('reply-icon.png',true,'global').'" alt="'.__('Reply', 'optimizepress').'" width="13" height="9" />'), 'depth' => $depth, 'max_depth' => $args['max_depth'], 'respond_id' => 'leave-reply' ) ) ); ?>
                <span><?php comment_date() ?></span>
            </div>
            <div class="comment-content">
                <?php comment_text() ?>
                <?php edit_comment_link( __( 'Edit', 'optimizepress'), '<span class="edit-link">', '</span>' ); ?>
            </div>
            <?php if ( $comment->comment_approved == '0' ) : ?>
            <em class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.', 'optimizepress'); ?></em>
            <?php endif; ?>
        </div>
	<?php
			break;
	endswitch;
}
}