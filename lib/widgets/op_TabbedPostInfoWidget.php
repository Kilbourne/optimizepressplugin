<?php
/* TABBED POST INFO WIDGET */
class OP_TabbedPostInfoWidget extends WP_Widget {
    //Constructor
    function __construct()
    {
        parent::__construct(false, __('OptimizePress: Recent Post Tabs', 'optimizepress'), array('description' => __('Displays tabbed lists of popular posts, recent posts, comments and tags from your blog', 'optimizepress')));
    }

    //Options form for admin section
    function form($instance){
        //Get options for widget
    $popularPosts = (isset($instance['popular']) ? $instance['popular'] : 0);
        $recentPosts = (isset($instance['recent']) ? $instance['recent'] : 0);
        $postComments = (isset($instance['comments']) ? $instance['comments'] : 0);
    $postTags = (isset($instance['tags']) ? $instance['tags'] : 0);
        ?>

    <p>
            <label for="<?php echo $this->get_field_id('popular')?>">
                <?php _e('Show Popular Posts:', 'optimizepress'); ?> <input id="<?php echo $this->get_field_id('popular')?>" name="<?php echo $this->get_field_name('popular')?>" type="checkbox" value="1"<?php echo ($popularPosts==1 ? ' checked' : '')?> />
            </label>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('recent')?>">
                <?php _e('Show Recent Posts:', 'optimizepress'); ?> <input id="<?php echo $this->get_field_id('recent')?>" name="<?php echo $this->get_field_name('recent')?>" type="checkbox" value="1"<?php echo ($recentPosts==1 ? ' checked' : '')?> />
            </label>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('comments')?>">
                <?php _e('Show Post Comments:', 'optimizepress'); ?> <input id="<?php echo $this->get_field_id('comments')?>" name="<?php echo $this->get_field_name('comments')?>" type="checkbox" value="1"<?php echo ($postComments==1 ? ' checked' : '')?> />
            </label>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('tags')?>">
                <?php _e('Show Post Tags:', 'optimizepress'); ?> <input id="<?php echo $this->get_field_id('tags')?>" name="<?php echo $this->get_field_name('tags')?>" type="checkbox" value="1"<?php echo ($postTags==1 ? ' checked' : '')?> />
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
        $popularTab = (isset($instance['popular']) && $instance['popular']==1 ? array('popular' => array(__('Popular', 'optimizepress'),'theme'.$theme.'_popular_posts',array(array('ulclass'=>'tab-popular miniposts article-list')))) : array());
        $recentTab = (isset($instance['recent']) && $instance['recent']==1 ? array('recent' => array(__('Recent', 'optimizepress'),'theme'.$theme.'_recent_posts',array(array('ulclass'=>'tab-recent miniposts article-list')))) : array());
        $commentsTab = (isset($instance['comments']) && $instance['comments']==1 ? array('comments' => array(__('Comments', 'optimizepress'),'theme'.$theme.'_recent_comments',array(array('ulclass'=>'tab-comments miniposts article-list')))) : array());
        $tagsTab = (isset($instance['tags']) && $instance['tags']==1 ? array('tags' => array(__('Tags', 'optimizepress'),'theme'.$theme.'_list_tags',array(array('ulclass'=>'tab-tags miniposts article-list')))) : array());

        //Merge tab arrays into one array
        $tabs = array_merge((array)$popularTab, (array)$recentTab, (array)$commentsTab, (array)$tagsTab);

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
        $counter = 1;
        foreach($tabs as $name => $tab){
        //Check if this tab has a callable function (first array element)
        if(isset($tab[1]) && is_callable($tab[1])){
        $args = array();

        //The second element of the tab array is the
        if(isset($tab[2])) $args = $tab[2];

        //Get the content from the callable function that is the first array elemnent
        $content = stripslashes(call_user_func_array($tab[1], $args));

        //If tab content is empty then put dummy content out there
        if(!empty($content)){
            $tab_html .= '<li'.$class.'><a href="#'.$name.'">'.$tab[0].'</a></li>';
            $out .= ($counter==1 ? str_replace('article-list"', 'article-list" style="display: block;"', stripslashes($content)) : stripslashes($content));
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
register_widget('OP_TabbedPostInfoWidget');
?>