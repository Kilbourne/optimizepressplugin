<?php include('style.inc.php'); ?>

<div id="<?php echo $id; ?>" class="calendar-date calendar-date-style-1">
    <div class="calendar-date-box">
        <p class="month"><?php echo $month; ?></p>
        <p class="day"><?php echo $day; ?></p>
    </div>

    <div class="calendar-time-box">
        <ul>
            <?php if (!empty($full_date)){ ?><li class="date"><span><?php echo $full_date; ?></span></li><?php } ?>
            <?php if (!empty($time_1)){ ?><li class="time"><span><?php echo $time_1; ?><?php echo (!empty($timezone_1) ? ' <strong>'.$timezone_1.'</strong>' : ''); ?></span></li><?php } ?>
            <?php if (!empty($time_2)){ ?><li class="time"><span><?php echo $time_2; ?><?php echo (!empty($timezone_2) ? ' <strong>'.$timezone_2.'</strong>' : ''); ?></span></li><?php } ?>
            <?php if (!empty($time_3)){ ?><li class="time"><span><?php echo $time_3; ?><?php echo (!empty($timezone_3) ? ' <strong>'.$timezone_3.'</strong>' : ''); ?></span></li><?php } ?>
        </ul>
    </div>
</div>