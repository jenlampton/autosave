(function ($) {

var showingRestoreCommand;

Backdrop.behaviors.autosave = {};
Backdrop.behaviors.autosave.attach = function (context, settings) {
  var autosaveSettings;

  if ($('#autosave-status').size() == 0) {
   // Add a div for us to put messages in.
    $('body').append('<div id="autosave-status"></div>');
  }

  autosaveSettings = settings.autosave;
  var $selector = $('input[name="form_id"][value="' + autosaveSettings.form_id + '"] ').parents('form').not('.autosave-processed');
  $selector.addClass('autosave-processed').autosave({
    // Autosave interval time in ms
    interval: autosaveSettings.period * 1000,
    url: autosaveSettings.url,
    setup: function (e, o) {
      // If there is a saved form for this user, let them know so it can be
      // reloaded if desired.
      if (autosaveSettings.savedTimestamp) {
        showingRestoreCommand = true;

        restoreCallback = function(html) {
          Backdrop.behaviors.autosave.displayMessage(html, {
            timeout: autosaveSettings.timeout * 1000,
          });
          $('#autosave-status .ignore-link').click(function(e) {
            showingRestoreCommand = false;
            Backdrop.behaviors.autosave.hideMessage();
            // Remove the autosaved form from the database if settings
            // are such.
            if (autosaveSettings.ignoreBehavior) {
              var path = Backdrop.settings.basePath + 'autosave/remove/' + autosaveSettings.form_id + '/' + autosaveSettings.savedTimestamp + '/' + autosaveSettings.form_token;
              $.post(path, autosaveSettings);
            }
            return false;
          });
          $('#autosave-status .restore-link').click(function(e) {
            showingRestoreCommand = false;
            Backdrop.behaviors.autosave.hideMessage();
          });
          Backdrop.attachBehaviors(document);
        };

        // Markup for the restore popup
        $.ajax({
          type: "POST",
          url: Backdrop.settings.basePath + 'autosave/popup/autosave_restore_popup',
          data: autosaveSettings,
          success: restoreCallback
        });
      }

      // Wire up CKEditor to autosave.
      if (typeof(CKEDITOR) !== 'undefined'){
        setInterval(function() {
          var id;
          for (id in CKEDITOR.instances) {
            var instance = CKEDITOR.instances[id];
            instance.updateElement();
          }
        }, autosaveSettings.period * 1000);
      }
    },

    save: function (e, o) {
      var savedCallback = function(html) {
        Backdrop.behaviors.autosave.displayMessage(html,
          { timeout: 3000 });
      };
      if (!autosaveSettings.hidden) {
        $.ajax({
          type: "POST",
          url: Backdrop.settings.basePath + 'autosave/popup/autosave_saved_popup',
          data: autosaveSettings,
          success: savedCallback
        });
      }
    },
    before: function () {
      // Do not autosave the form while the Ignore/Restore popup is shown.
      return !showingRestoreCommand;
    },
    dirty: function (e, o) {
      if (showingRestoreCommand) {
        Backdrop.behaviors.autosave.hideMessage();
      }
    }
  });
};

Backdrop.behaviors.autosave.hideMessage = function() {
  $('#autosave-status').fadeOut('slow');
  // We have hidden the Ignore/Restore popup so we start autosaving the form.
  showingRestoreCommand = false;
};

Backdrop.behaviors.autosave.displayMessage = function(message, settings) {
  settings = settings || {};
  var status = $('#autosave-status');
  status.empty().append('<span id="status">' + message + '</span>');
  status.empty().append(message);
  Backdrop.attachBehaviors(status);

  $('#autosave-status').slideDown();
  if (settings.timeout) {
    setTimeout(Backdrop.behaviors.autosave.hideMessage, settings.timeout);
  }
};

})(jQuery);
