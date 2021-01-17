<?php
/* SIDEBAR ADVERTISING WIDGET */
class OP_SidebarAdvertisingWidget extends WP_Widget {
    //Constructor
    function __construct()
    {
       parent::__construct(false, __('OptimizePress: Sidebar Advertising Block', 'optimizepress'), array('description' => sprintf(__('Displays ad blocks in the sidebar. Can be enabled and customized from the <a href="%s">Blog Settings > Modules > Sidebar Advertising</a> section.', 'optimizepress'), admin_url('admin.php?page=optimizepress-theme-settings#modules'))));
    }

    //Options form for admin section
    function form($instance){
    ?>
    <p><?php printf(__('To use this widget you must enable the Sidebar Advertising Module from the <a href="%s">Blog Settings > Modules</a> section of OptimizePress', 'optimizepress'), admin_url('admin.php?page=optimizepress-theme-settings#modules')); ?></p>
    <?php
    }

    //Widget options get processed and saved here
    function update($new_instance, $old_instance){
        return $new_instance;
    }

    //Content of widget gets output here
    function widget($args, $instance){
    @session_start();
    $theme = (isset($_SESSION['theme']) ? $_SESSION['theme'] : 1);
    $grid = op_mod('advertising')->display(array('advertising', 'sidebar', 'grid'),true);
    $rectangular = op_mod('advertising')->display(array('advertising', 'sidebar', 'rectangular'),true);
    if($grid != '' || $rectangular != ''): ?>
        <div class="sidebar-section">
            <?php echo $grid.$rectangular ?>
        </div>
    <?php
    endif;
    op_mod('advertising')->display(array('advertising', 'sidebar', 'large_ad1'));
    call_user_func('theme'.$theme.'_generate_sidebar_tabs');
    op_mod('advertising')->display(array('advertising', 'sidebar', 'large_ad2'));
    call_user_func('theme'.$theme.'_generate_sidebar_tabs', 2);
    }
}

//Register widgets
register_widget('OP_SidebarAdvertisingWidget');
?>