/**
 * @file
 * Attaches behaviors for the content type settings of autosave module.
 */
(function ($) {

  "use strict";

  Backdrop.behaviors.autosaveFieldsetSummaries = {
    attach: function (context) {
      $('#edit-autosave', context).backdropSetSummary(function (context) {
        var vals = [];
        if ($(context).find('input[name="autosave_enabled"]:checked').length) {
          vals.push(Backdrop.t('Autosave enabled'));
        }
        else {
          vals.push(Backdrop.t('Autosave disabled'));
        }
        return vals.join(', ');
      });
    }
  };

})(jQuery);
