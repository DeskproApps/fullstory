import ReactDOM from 'react-dom';
import { DeskproAppContainer } from '@deskproapps/deskproapps-sdk-react';
import App from './App';
import { apiKey } from '../../../secrets/fullstory';

export function runApp(app) {

  ReactDOM.render(
    <DeskproAppContainer app={app} name={'Fullstory'} mainComponent={App} apiKey={apiKey}/>,
    document.getElementById('deskpro-app')
  );
}
