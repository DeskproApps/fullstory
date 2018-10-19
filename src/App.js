import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { ListItem, List, Icon } from '@deskpro/apps-components';

const DEBUG = true;

export const orderSessionsByCreatedTime = (reverse, a, b) => {
  let result;
  if (a.CreatedTime < b.CreatedTime) {
    result = -1;
  } else if (a.CreatedTime === b.CreatedTime) {
    result = 0;
  } else {
    result = 1;
  }

  return reverse ? -1 * result : result;
};

const fetchSessionList = (dpapp, email) => {
  const { restApi } = dpapp;

  const fetchParams = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json' ,
      'Accept': 'application/json' ,
      'Authorization':  `Basic {{apikey}}`
    }
  };

  const url = `https://www.fullstory.com/api/v1/sessions?email=${email}`;

  return restApi.fetchProxy(url, fetchParams)
    .then(response => {
      DEBUG && console.log('received a good response ', response);
      return response.body;
    })
    .catch(err => {
      DEBUG && console.log('fetch error ', err);
      return [];
    })
};

export default class App extends React.Component
{
  static propTypes = {
    dpapp: PropTypes.object.isRequired
  };

  state = {
    sessions: null,
    error: null
  };

  componentDidMount() {

    const { dpapp } = this.props;

    dpapp.context.get('ticket').get('data.person_email')
      .then(email => fetchSessionList(dpapp, email))
      .then(sessions => {
        DEBUG && console.log ('got sessions', sessions);
        this.setState({ sessions });
      })
      .catch((err) => {
        this.setState({ error: err });
        DEBUG && console.log('error retrieving sessions data', err);
      });
  }

  render() {

    const { sessions, error } = this.state;
    if (!!error) {
      return (<p> Error displaying data </p>);
    }

    if (! sessions) {
      return (<p>Loading....</p>);
    }

    if (sessions.length === 0) {
      return (<p>No recorded sessions found</p>);
    }

    this.props.dpapp.ui.badgeCount = sessions.length;
    this.props.dpapp.ui.showBadgeCount();

    try {
      const orderedSessions = sessions.concat([]).sort(orderSessionsByCreatedTime.bind(null, true));
      return (
        <List>
          { orderedSessions.map(this.renderSession) }
        </List>
      );
    } catch (e) {
      console.error(e);
      return (<p> Error displaying data </p>);
    }
  }

  renderSession = ({ CreatedTime, FsUrl, SessionId }) =>
  {
    return (
      <ListItem key={SessionId}>
        <p>
          <span>Session </span>
          <a className={"dp-fullstory__sessionid"} href={FsUrl} target="_blank" rel="noopener noreferrer" title={`${SessionId}`} >
            {SessionId}
          </a>

          <a href={FsUrl} target="_blank" rel="noopener noreferrer" title="Click to open in Fullstory">
            <Icon name="external-link-square" />
          </a>

          <span> - <Moment unix fromNow>{CreatedTime}</Moment></span>
        </p>

      </ListItem>
    );
  };
}
