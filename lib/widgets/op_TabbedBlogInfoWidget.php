<?php
/* TABBED BLOG INFO WIDGET */
class OP_TabbedBlogInfoWidget extends WP_Widget {
    //Constructor
    function __construct()
    {
        parent::__construct(false, __('OptimizePress: Page Links & Categories Tabs', 'optimizepress'), array('description' => __('Displays tabbed lists of pages, categories and archives from your blog', 'optimizepress')));
    }

    //Options form for admin section
    function form($instance){
        //Get options for widget
    $categories = (isset($instance['categories']) ? $instance['categories'] : 0);
        $archives = (isset($instance['archives']) ? $instance['archives'] : 0);
        $pages = (isset($instance['pages']) ? $instance['pages'] : 0);
        ?>

    <p>
            <label for="<?php echo $this->get_field_id('categories')?>">
                <?php _e('Show Categories:', 'optimizepress'); ?> <input id="<?php echo $this->get_field_id('categories')?>" name="<?php echo $this->get_field_name('categories')?>" type="checkbox" value="1"<?php echo ($categories==1 ? ' checked' : '')?> />
            </label>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('archives')?>">
                <?php _e('Show Archives:', 'optimizepress'); ?> <input id="<?php echo $this->get_field_id('archives')?>" name="<?php echo $this->get_field_name('archives')?>" type="checkbox" value="1"<?php echo ($archives==1 ? ' checked' : '')?> />
            </label>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('pages')?>">
                <?php _e('Show Pages:', 'optimizepress'); ?> <input id="<?php echo $this->get_field_id('pages')?>" name="<?php echo $this->get_field_name('pages')?>" type="checkbox" value="1"<?php echo ($pages==1 ? ' checked' : '')?> />
            </label>
        </p>
        <?php
    }

    //Widget options get processed and saved here
    function update($new_instance, $old_instance){
        return $new_instance;
    }

    //Content of widget gets output here
    function widget($args, $instance){
        @session_start();

        //Get the current theme number
        $theme = (isset($_SESSION['theme']) ? $_SESSION['theme'] : 1);

        //Set tabs to show
        $categoriesTab = (isset($instance['categories']) && $instance['categories']==1 ? array('categories' => array(__('Categories', 'optimizepress'),'theme'.$theme.'_category_panel',array(array('ulclass'=>'tab-categories miniposts page-list')))) : array());
        $archivesTab = (isset($instance['archives']) && $instance['archives']==1 ? array('archives' => array(__('Archives', 'optimizepress'),'theme'.$theme.'_archives_panel',array(array('ulclass'=>'tab-archives miniposts page-list')))) : array());
        $pagesTab = (isset($instance['pages']) && $instance['pages']==1 ? array('pages' => array(__('Pages', 'optimizepress'),'theme'.$theme.'_pages_panel',array(array('ulclass'=>'tab-pages miniposts page-list')))) : array());

        //Merge tab arrays into one array
        $tabs = array_merge((array)$categoriesTab, (array)$archivesTab, (array)$pagesTab);

        //Initialize variables
        $out = '';
        $tab_html = '';
        $class = ' class="selected"';

        // Widget in sub-footer should have a different class
        if ($args['id'] === 'sub-footer-sidebar') {
            $sidebarSectionClasses = ' col widget';
        } else {
            $sidebarSectionClasses = '';
        }

        //Loop through tabs to be created
        foreach($tabs as $name => $tab){
        //Check if this tab has a callable function (first array element)
        if(isset($tab[1]) && is_callable($tab[1])){
        $args = array();

        //The second element of the tab array is the
        if(isset($tab[2])) $args = $tab[2];

        //Get the content from the callable function that is the first array elemnent
        $content = call_user_func_array($tab[1], $args);

        //If tab content is empty then put dummy content out there
        if(!empty($content)){
            $tab_html .= '<li'.$class.'><a href="#'.$name.'">'.$tab[0].'</a></li>';
            $out .= ($counter==1 ? str_replace('article-list"', 'article-list" style="display: block;"', $content) : $content);
            $class = '';
            $counter++;
        }
        }
        }

        //If tab content is empty then put dummy content out there
        if(!empty($tab_html)): ?>
        <div class="sidebar-section<?php echo $sidebarSectionClasses; ?>">
        <div class="minipost-area">
        <ul class="tabs cf"><?php echo $tab_html ?></ul>
        <div class="minipost-area-content"><?php echo $out ?></div>
        </div>
        </div>
        <?php
        endif;
    }
}

//Register widgets
register_widget('OP_TabbedBlogInfoWidget');
?>