<style>
    <?php
        $style = '';

        if ($data['main_title_font']) {
            $style .= '
                #' . $data['id'] . ' > .title > p {
                    ' . $data['main_title_font'] . ';
                }
            ';
        }

        if ($data['posts_title_font']) {
            $style .= '
                #' . $data['id'] . ' .title,
                #' . $data['id'] . ' .post-title {
                    ' . $data['posts_title_font'] . ';
                }
            ';
        }

        if ($data['posts_description_font']) {
            $style .= '
                #' . $data['id'] . ' .description,
                #' . $data['id'] . ' .post-description {
                    ' . $data['posts_description_font'] . ';
                }
            ';
        }

        echo $style;
    ?>
</style>