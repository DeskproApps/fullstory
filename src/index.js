/*
 * This is the main entry point for the browser. It's pre-configured
 * to boot the Deskpro Apps system and render your App. You usually
 * don't need to modify this unless you want to add some special
 * bootup behaviour.
 */

import { AppFrame } from '@deskpro/apps-components';
import { createApp } from '@deskpro/apps-sdk';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import AppPlaceholder from './AppPlaceholder';

createApp(dpapp => props =>
  ReactDOM.render(
    dpapp.getProperty('isPreRender') ? <AppFrame {...props}><AppPlaceholder/></AppFrame> : <AppFrame {...props}><App dpapp={dpapp} /></AppFrame>,
    document.getElementById('root')
  )
);
