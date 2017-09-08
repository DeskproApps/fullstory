import ReactDOM from 'react-dom';
import { DeskproAppContainer } from '@deskproapps/deskproapps-sdk-react';
import App from './App';

export function runApp(app) {

  //<DeskproAppContainer app={app} name={'Fullstory'} mainComponent={App} apiKey={apiKey}/>
  ReactDOM.render(
    <DeskproAppContainer app={app} name={'Fullstory'} mainComponent={App} />,
    document.getElementById('deskpro-app')
  );
}
