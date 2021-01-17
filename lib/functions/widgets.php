<?php
//Include each widget
//require_once OP_FUNC.'../widgets/op_TabbedBlogInfoWidget.php';
//require_once OP_FUNC.'../widgets/op_TabbedPostInfoWidget.php';

/*
 * The following lines will search through the widgets directory and include any widgets found
 */

//Find all files in the widgets directory
if ($handle = opendir(OP_FUNC.'../widgets/')){
    //Loop through each file
    while (false !== ($entry = readdir($handle))){
	//The . and .. directories are listed so we make sure we do not use those
        if ($entry != "." && $entry != ".." && $entry != 'index.php' && strpos($entry, '.') !== 0){
	    //Include the widget file
            require_once OP_FUNC.'../widgets/'.$entry;
        }
    }
    
    //Finally we close the directory to free up memory
    closedir($handle);
}
?>