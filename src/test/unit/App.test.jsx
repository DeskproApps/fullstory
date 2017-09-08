import React from 'react';
import { createAppFromProps } from '@deskproapps/deskproapps-sdk-core';
import renderer from 'react-test-renderer';

import { default as App, orderSessionsByCreatedTime } from '../../main/javascript/App';

test('successfully render the application in initial state', done => {

  const contextProps = {
    // context
    type: 'ticket',
    entityId: '1',
    locationId: 'ticket-sidebar',
    tabId: 'tab-id',
    tabUrl: 'http://127.0.0.1'
  };

  const instanceProps = {
    appId: '1',
    appTitle: 'My First App',
    appPackageName: '@deskproapps/fullstory',
    instanceId: '1'
  };

  const dpapp = createAppFromProps({ contextProps, instanceProps });
  const component = renderer.create(<App dpapp={dpapp} />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  done();
});

test ('order sessions by created time', done =>{
  "use strict";

  const dummySessions = [
    { UserId:123, SessionId: 456, CreatedTime: 1476470464, FsUrl: "https://www.fullstory.com..." },
    { UserId:124, SessionId: 457, CreatedTime: 1476500464, FsUrl: "https://www.fullstory.com..." },
    { UserId:125, SessionId: 458, CreatedTime: 1476900464, FsUrl: "https://www.fullstory.com..." }
  ];

  const orderedSessions = dummySessions.concat([]).sort(orderSessionsByCreatedTime.bind(null, true));
  expect(orderedSessions).toEqual(dummySessions.reverse());
  done();
});