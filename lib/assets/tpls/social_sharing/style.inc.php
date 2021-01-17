<?php
    //Init style string
    $style_str = '';

    //Init array of styles that need special treatment
    $special_styles = array(
        'style-17',
        'style-19'
    );

    //Add alignment styles
    $style_str .= ($alignment=='center' ? '
        text-align: center;
        '.(!in_array($style, $special_styles) ? '
           /*margin-left: auto;*/
            /*margin-right: auto;*/
        ' : '').'
    ' : '
        float: '.$alignment.';
    ');
?>

<style>
    <?php
        echo ($style=='style-17' || $style=='style-19' ? '
            #'.$id.'{
                width: 780px;
            }
        ' : '' );
    ?>

    <?php
        switch($style){
            case 'style-21':
                echo '
                    #'.$id.'{
                        '.$style_str.'
                    }
                ';
                break;
            default:
                echo '
                    #'.$id.' li{
                        '.$style_str.'
                    }
                ';
        }
    ?>
</style>