import React from 'react';
import { default as App, orderSessionsByCreatedTime } from '../../main/javascript/App';

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