<?php
/**
 * @file
 * Popup markup for restore form message.
 */
?>

<span id="status">
  <?php print t('This form was autosaved on ' . $autosave['savedDate']); ?>
</span>
<span id="operations">
  <?php print $ignore_link . $restore_link; ?>
</span>
