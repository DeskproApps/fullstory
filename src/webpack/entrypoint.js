import { createApp, linkStyles } from '@deskpro/apps-sdk-react';
require('../main/sass/index.scss');
import '@deskpro/apps-components-style';


/**
 * Called when sdk-core has created the app
 *
 * @param {*} dpapp
 */
createApp(function(dpapp) {
  // DPAPP_MANIFEST is exported by webpack.
  dpapp.manifest = DPAPP_MANIFEST;

  // inject some styles.
  linkStyles();

  // Calls deskproapp() when it exists, which can be used for by apps written in plain
  // JS/jQuery, or else calls the runApp() function to launch the React code.
  if (window.deskproapp !== undefined) {
    return window.deskproapp(dpapp);
  }
  require('../main/javascript').runApp(dpapp);
});
