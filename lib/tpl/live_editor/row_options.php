<div id="op-le-row-options">
    <h1><?php _e('Row options', 'optimizepress') ?></h1>
    <div class="op-lightbox-content">

        <!-- Full Width Row-->
        <div class="op-le-row-options-column">
            <label><?php _e('Is it a full width row?', 'optimizepress');?></label>
            <p class="op-micro-copy"><?php _e('If you are using full width rows with background colours this will prevent white bars between your rows.', 'optimizepress');?></p>
            <input type="checkbox" name="op_full_width_row" />
        </div>

        <!-- Fixed Row Position-->
        <div class="op-le-row-options-column">
            <label><?php _e('Fixed row postion when scrolling?', 'optimizepress');?></label>
            <p class="op-micro-copy"><?php _e('When scrolling to bottom of page, row will be fixed depending on chosen value. Effect is not visible in live editor. ( <a href="http://www.optimizelink.com/tutorials/row-position" target="_blank">?</a> )', 'optimizepress');?></p>
            <select class="op-scroll-fixed-position select" id="op_scroll_fixed_position" name="op_scroll_fixed_position">
                <option value="none">None</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
			</select>
			
		   <label>Disable fixed row for mobile devices</label>
		   <input type="checkbox" id="op_scroll_fixed_mobile" name="op_scroll_fixed_mobile"> 
        </div>

        <!-- Code Before Row -->
        <label><?php _e('Code before row', 'optimizepress');?></label>
        <p class="op-micro-copy"><?php _e('Enter shortcode or similar which will be rendered before the row', 'optimizepress');?></p>
        <textarea name="op_row_before" id="op_row_before"></textarea>

        <!-- Code After Row -->
        <label><?php _e('Code after row', 'optimizepress');?></label>
        <p class="op-micro-copy"><?php _e('Enter shortcode or similar which will be rendered after the row', 'optimizepress');?></p>
        <textarea name="op_row_after" id="op_row_after"></textarea>

        <!-- Row CSS Class -->
        <label><?php _e('Row CSS class', 'optimizepress');?></label>
        <input type="text" name="op_row_css_class" id="op_row_css_class" />

        <!-- Row Background Color Start -->
        <div class="op-le-row-options-column">
            <label><?php _e('Row background color start', 'optimizepress');?></label>
            <div class="font-chooser cf">
            <?php op_color_picker('someField[color]', '','op_section_row_options_bgcolor_start'); ?>
            <a href="#reset" class="reset-link">Reset</a>
            </div>
        </div>

        <!-- Row Background Color End -->
        <div class="op-le-row-options-column">
            <label><?php _e('Row background color end', 'optimizepress');?></label>
            <div class="font-chooser cf">
            <?php op_color_picker('someField[color]', '','op_section_row_options_bgcolor_end'); ?>
            <a href="#reset" class="reset-link">Reset</a>
            </div>
        </div>

        <!-- Section Separator -->
        <div class="op-row-section-separator-form">
            <label class="op-section-separator-subtitle"><?php _e('Section Separator', 'optimizepress'); ?></label>
            <p class="op-micro-copy"><?php _e('Section separator will be visible when <strong>Row background color start</strong> or both of <strong>Row background colors</strong> are set. ( <a href="http://www.optimizelink.com/tutorials/row-sectionseparator" target="_blank">?</a> )', 'optimizepress');?></p>
            <select class="op-section-separator-type" id="op_row_section_separator_option" name="op[row][addon][section_separator_select_type]">
                <option value="none">None</option>
                <option value="wide_triangle">Triangle (Wide)</option>
                <option value="thin_triangle">Triangle (Thin)</option>
            </select>
        </div>

        <!-- Top Padding --> 
        <div class="op-le-row-options-column">
            <label><?php _e('Top padding (number of pixels)', 'optimizepress');?></label>
            <input type="text" name="op_row_top_padding" id="op_row_top_padding" />
        </div>

        <!-- Bottom Padding -->
        <div class="op-le-row-options-column">
            <label><?php _e('Bottom padding (number of pixels)', 'optimizepress');?></label>
            <input type="text" name="op_row_bottom_padding" id="op_row_bottom_padding" />
        </div>

        <!-- this is hidden, since we introduced row top border and row bottom border in v2.1.2 -->
        <div class="op-le-row-options-column op-hidden">
            <label><?php _e('Row border width<br /> (number of pixels, top and bottom border)', 'optimizepress');?></label>
            <input type="text" name="op_row_border_width" id="op_row_border_width" />
        </div>

        <!-- this is hidden, since we introduced row top border and row bottom border in v2.1.2 -->
        <div class="op-le-row-options-column op-hidden">
            <label><?php _e('Row border color<br /> (top and bottom border)', 'optimizepress');?></label>
            <div class="font-chooser cf">
            <?php op_color_picker('someField[borderColor]', '','op_section_row_options_borderColor'); ?>
            <a href="#reset" class="reset-link">Reset</a>
            </div>
        </div>

        <!-- Row Border Top Width -->
        <div class="op-le-row-options-column">
            <label><?php _e('Row border top width (px)', 'optimizepress');?></label>
            <input type="text" name="op_row_border_top_width" id="op_row_border_top_width" />
        </div>

        <!-- Row Border Top Color -->
        <div class="op-le-row-options-column">
            <label><?php _e('Row border top color', 'optimizepress');?></label>
            <div class="font-chooser cf">
            <?php op_color_picker('someField[borderTopColor]', '','op_section_row_options_borderTopColor'); ?>
            <a href="#reset" class="reset-link">Reset</a>
            </div>
        </div>

        <!-- Row Border Bottom Width -->
        <div class="op-le-row-options-column">
            <label><?php _e('Row border bottom width (px)', 'optimizepress');?></label>
            <input type="text" name="op_row_border_bottom_width" id="op_row_border_bottom_width" />
        </div>

        <!-- Row Border Bottom Color-->
        <div class="op-le-row-options-column">
            <label><?php _e('Row border bottom color', 'optimizepress');?></label>
            <div class="font-chooser cf">
                <?php op_color_picker('someField[borderBottomColor]', '','op_section_row_options_borderBottomColor'); ?>
                <a href="#reset" class="reset-link">Reset</a>
            </div>
        </div>

        <!-- Background Image -->
        <div class="op-row-background-options">
            <h3>Background image</h3>
            <div class="op-le-row-options-column">
                <label><?php _e('Row background image', 'optimizepress');?></label>
                <p class="op-micro-copy"><?php _e('Choose an image to use as the row background', 'optimizepress');?></p>
            </div>
            <div class="op-le-row-options-column">
                <label><?php _e('Enable Parallax background image effect ( <a href="http://www.optimizelink.com/tutorials/row-parallax" target="_blank">?</a> )', 'optimizepress');?></label>
                <input type="checkbox" id="op_paralax_background_image" name="op_paralax_background_image"  data-name="backgroundParalax"/>
            </div>
            <?php op_upload_field('op_row_background'); ?>
            <br />
            <p class="op-micro-copy"><?php _e('Choose how you would like the background image displayed', 'optimizepress');?></p>
            <select class="op_row_bg_options" id="op_row_bg_options" name="op_bg_options">
                <option value="center"><?php _e('Center (center your background image)', 'optimizepress'); ?></option>
                <option value="cover"><?php _e('Cover/Stretch (stretch your background image to fit)', 'optimizepress'); ?></option>
                <option value="tile_horizontal"><?php _e('Tile Horizontal (tile the background image horizontally)', 'optimizepress'); ?></option>
                <option value="tile"><?php _e('Tile (tile the background image horizontally and vertically)', 'optimizepress'); ?></option>
            </select>

            <div class="op-le-row-options-column">
                <label><?php _e('Background image overlay color', 'optimizepress');?></label>
                <div class="font-chooser cf">
                <?php op_color_picker('someField[backgroundImageColor]', '','op_row_options_backgroundImageColor'); ?>
                <a href="#reset" class="reset-link">Reset</a>
                </div>
            </div>

            <div class="op-le-row-options-column">
                <div class="field-slider" id="op-overlay-color-opacity-slider">
                    <label><?php _e('Overlay colour opacity', 'optimizepress'); ?></label>
                    <?php op_slider_picker('op[row][core][overlayColorOpacity]', 0, 'op_section_row_options_backgroundImageOpacity', 0, 100, '%'); ?>
                </div>
            </div>
            <div class="op-le-row-options-column">

            </div>
        </div>

        <!-- Delay Row -->
        <div class="op-row-animated-row-form">
            <h3>Delay Row</h3>
            <p class="op-micro-copy"><?php _e('Set this row to appear after a timed delay (from the point of page load). Select an animation effect for the row when it appears on your page after the delay. ( <a href="http://www.optimizelink.com/tutorials/row-delay" target="_blank">?</a> )') ?></p>
            <div class="op-animated-row-form-row">
                <div class="op-animated-row-form-column">
                    <label>Row Appear Animation Effect</label>
                    <select name="op_animate_row_effect" class="op_row_advanced_options_extras"
                            data-name="animationEffect" id="op_animate_row_effect">
                        <option value="">None</option>
                        <option value="fadeIn">Fade In</option>
                        <option value="fadeInDown">Fade In Down</option>
                        <option value="fadeInDownBig">Fade In Down Big</option>
                        <option value="fadeInLeft">Fade In Left</option>
                        <option value="fadeInLeftBig">Fade In Left Big</option>
                        <option value="fadeInRight">Fade In Right</option>
                        <option value="fadeInRightBig">Fade In Right Big</option>
                        <option value="fadeInUp">Fade In Up</option>
                        <option value="fadeInUpBig">Fade In Up Big</option>
                    </select>
                </div>
                <div class="op-animated-row-form-column">
                    <label>Row Delay Timer</label>
                    <input type="number" class="op_row_advanced_options_extras" placeholder=""
                           name="op_animate_row_delay" data-name="animationDelay" id="op_animate_row_delay" min="0"/>
                </div>
            </div>
<!--            <div class="op-animated-row-form-row">-->
<!--                <div class="op-animated-row-form-column">-->
<!--                    <label>Animation Trigger Direction</label>-->
<!--                    <select name="op_animate_row_direction" class="op_row_advanced_options_extras"-->
<!--                            data-name="animationDirection" id="op_animate_row_direction">-->
<!--                        <option value="">None</option>-->
<!--                        <option value="down">Scrolling Down</option>-->
<!--                        <option value="up">Scrolling Up</option>-->
<!--                    </select>-->
<!--                </div>-->
<!--            </div>-->
        </div>

        <!-- Color Changing Rows -->
         <div class="op-color-changing-rows-form">
            <h3><?php _e('Changing Background Colour', 'optimizepress'); ?></h3>
            <div class="op-le-row-options-columns">
                <div class="op-le-row-options-column">

                    <label class="op-changing-background-color-subtitle"><?php _e('Background Colour Start', 'optimizepress'); ?></label>
                    <div class="font-chooser cf">
                        <?php op_color_picker('op_section_row_background_changing_color_start', '','op_section_row_background_changing_color_start'); ?>
                        <a href="#reset" class="reset-link">Reset</a>
                    </div>
                </div>

                <div class="op-le-row-options-column">
                    <label class="op-changing-background-color-subtitle"><?php _e('Background Colour End', 'optimizepress'); ?></label>
                    <div class="font-chooser cf">
                        <?php op_color_picker('op_section_row_background_changing_color_end', '','op_section_row_background_changing_color_end'); ?>
                        <a href="#reset" class="reset-link">Reset</a>
                    </div>
                </div>

                <div class="op-le-row-options-column">
                    <label class="op-changing-background-color-subtitle"><?php _e('Background Changing Speed', 'optimizepress'); ?></label>
                    <input type="number" class="op_row_addon_background_changing_color_speed" placeholder=""
                           name="op_section_row_background_changing_color_end" data-name="colorChaingingSpeed" id="op_section_row_background_changing_color_speed" min="0"/>
                </div>
            </div>
        </div>

        <?php do_action('op_le_after_row_options'); ?>
    </div>

    <!-- Update Button -->
    <div class="op-insert-button cf">
            <button type="button" id="op-le-row-options-update" class="editor-button"><?php _e('Update', 'optimizepress') ?></button>
    </div>
</div>
