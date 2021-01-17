<?php
/* SIDEBAR SEARCH WIDGET */
class OP_SidebarSearchWidget extends WP_Widget {
    //Constructor
    function __construct()
    {
       parent::__construct(false, __('OptimizePress: Sidebar Search', 'optimizepress'), array('description' => __('Displays a search box', 'optimizepress')));
    }

    //Options form for admin section
    function form($instance){

    }

    //Widget options get processed and saved here
    function update($new_instance, $old_instance){
        return $new_instance;
    }

    //Content of widget gets output here
    function widget($args, $instance){
    ?>
    <div class="sidebar-section search">
        <form class="cf searchform" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
        <div>
            <label class="assistive-text" for="s"><?php _e('Search for:', 'optimizepress') ?></label>
            <div class="search-text-input"><input type="text" value="<?php the_search_query() ?>" name="s" id="s" /></div>
            <input type="submit" id="searchsubmit" value="<?php esc_attr_e('Search', 'optimizepress') ?>" />
        </div>
        </form>
    </div>
    <?php
    }
}

//Register widgets
register_widget('OP_SidebarSearchWidget');
?>