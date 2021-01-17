                <?php
                    wp_enqueue_script(OP_SN.'-comments', OP_PAGES_URL.'global/js/comments'.OP_SCRIPT_DEBUG.'.js', array(OP_SCRIPT_BASE), OP_VERSION);
                ?>
                <div id="comments">
                <?php if ( have_comments() && post_password_required() ) : ?>
                    <p class="nopassword"><?php _e( 'This post is password protected. Enter the password to view any comments.', 'optimizepress'); ?></p>
                </div><!-- #comments -->
                <?php
                        return;
                    endif;
                    if(have_comments()):
                ?>
                    <div class="comments-container">
                        <h4>
                            <?php printf( _n('1 Comment','%1$s Comments',get_comments_number(),'optimizepress'),number_format_i18n( get_comments_number() )) ?>
                        </h4>

                        <?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : ?>
                        <div id="comment-navigation-above">
                            <h1 class="assistive-text"><?php _e( 'Comment navigation', 'optimizepress'); ?></h1>
                            <div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'optimizepress') ); ?></div>
                            <div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'optimizepress') ); ?></div>
                        </div>
                        <?php endif ?>
                        <ul class="tabs">
                            <li class="selected"><a href="#comments"><?php _e('Comments', 'optimizepress') ?></a></li>
                            <li><a href="#trackbacks"><?php _e('Trackbacks', 'optimizepress') ?></a></li>
                        </ul>
                        <div class="clear"></div>

                        <div class="comments-panel tab-content">
                            <ul>
                            <?php wp_list_comments(array('type' => 'comment', 'callback' => 'op_page_comment')); ?>
                            </ul>
                        </div>

                        <div class="trackbacks-panel tab-content" style="display: none;">
                            <ul>
                            <?php wp_list_comments(array('type' => 'pings', 'callback' => 'op_page_comment')); ?>
                            </ul>
                        </div>

                        <?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
                        <div id="comment-navigation-below">
                            <h1 class="assistive-text"><?php _e( 'Comment navigation', 'optimizepress'); ?></h1>
                            <div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'optimizepress') ); ?></div>
                            <div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'optimizepress') ); ?></div>
                        </div>
                        <?php endif; // check for comment navigation ?>
                    </div>
                    <?php elseif ( ! comments_open() && ! is_page() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
                        <p class="nocomments"><?php _e( 'Comments are closed.', 'optimizepress'); ?></p>
                    <?php endif; ?>

                    <?php
                    $post_id = $post->ID;
                    $commenter = wp_get_current_commenter();
                    $req = get_option('require_name_email');
                    $fields = array(
                        'author' => '<label class="cf"><div class="comment-inputtext"><input type="text" id="author" name="author" value="'.esc_attr($commenter['comment_author']).'" /></div><span>'.__('Name', 'optimizepress').($req?'*':'').'</span></label>',
                        'email' => '<label class="cf"><div class="comment-inputtext"><input type="text" id="email" name="email" value="'.esc_attr($commenter['comment_author_email']).'" /></div><span>'.__('Email', 'optimizepress').($req?'*':'').'</span></label>',
                        'url' => '<label class="cf"><div class="comment-inputtext"><input type="text" id="url" name="url" value="'.esc_attr($commenter['comment_author_url']).'" /></div><span>'.__('Website', 'optimizepress').'</span></label>'
                    );
                    $defaults = array(
                        'fields'               => apply_filters( 'comment_form_default_fields', $fields ),
                        'comment_field'        => '<div class="comment-text"><textarea id="comment" name="comment" cols="45" rows="8"></textarea></div>',
                        'must_log_in'          => '<p class="must-log-in">' .  sprintf( __( 'You must be <a href="%s">logged in</a> to post a comment.','optimizepress' ), wp_login_url( apply_filters( 'the_permalink', get_permalink( $post_id ) ) ) ) . '</p>',
                        'logged_in_as'         => '<p class="logged-in-as">' . sprintf( __( 'Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" title="Log out of this account">Log out?</a>','optimizepress' ), admin_url( 'profile.php' ), $user_identity, wp_logout_url( apply_filters( 'the_permalink', get_permalink( $post_id ) ) ) ) . '</p>',
                    );

                    $args = wp_parse_args( array(), apply_filters( 'comment_form_defaults', $defaults ) );
                    if ( comments_open() ) :
                    ?>
                    <div id="leave-reply">
                        <?php /*<h4><?php comment_form_title( __('Leave A Response', 'optimizepress'), __('Leave A Response To %s', 'optimizepress') ); ?> <small><?php cancel_comment_reply_link( __('Cancel reply', 'optimizepress') ); ?></small></h4>*/ ?>
                        <?php cancel_comment_reply_link( __('Cancel reply', 'optimizepress') ); ?>
                        <?php if ( get_option( 'comment_registration' ) && !is_user_logged_in() ) : ?>
                            <?php echo $args['must_log_in']; ?>
                        <?php else : ?>
                            <form action="<?php echo site_url( '/wp-comments-post.php' ); ?>" method="post" id="commentform">
                                <?php do_action( 'comment_form_top' ); ?>
                                <?php if ( is_user_logged_in() ) : ?>
                                    <?php echo apply_filters( 'comment_form_logged_in', $args['logged_in_as'], $commenter, $user_identity ); ?>
                                    <?php do_action( 'comment_form_logged_in_after', $commenter, $user_identity ); ?>
                                <?php else : ?>
                                    <?php
                                    do_action( 'comment_form_before_fields' );
                                    foreach ( (array) $args['fields'] as $name => $field ) {
                                        echo apply_filters( "comment_form_field_{$name}", $field ) . "\n";
                                    }
                                    do_action( 'comment_form_after_fields' );
                                    ?>
                                <?php endif; ?>
                                <div class="clear"></div>
                                <?php echo apply_filters( 'comment_form_field_comment', $args['comment_field'] ); ?>
                                <?php echo apply_filters( 'comment_form_submit_field', '' ); ?>
                                <div class="form-submit">
                                    <input name="submit" type="submit" id="submit" value="<?php _e('Submit Comment', 'optimizepress') ?>" class="silver-button" /> <p>* <?php _e('Denotes Required Field', 'optimizepress'); ?></p>
                                    <?php comment_id_fields( $post_id ); ?>
                                </div>
                                <?php do_action( 'comment_form', $post_id ); ?>
                            </form>
                        <?php endif; ?>
                    </div>
                    <?php else : ?>
                        <?php do_action( 'comment_form_comments_closed' ); ?>
                    <?php endif; ?>
                </div> <!-- end #comments-panel -->