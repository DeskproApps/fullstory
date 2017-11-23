import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { Container, Heading, Loader, ListElement, List, Icon, Scrollbar } from '@deskpro/react-components';

const DEBUG = true;

export const selectPersonEmailFromTabData = ({ person : {emails} }) => {

  if (! emails) {
    return null;
  }

  let candidates;
  if (! emails instanceof Array) {
    candidates = [ emails ];
  } else {
    candidates = emails;
  }

  const emailAddress = candidates.map(({ email }) => email).filter(email => !!email);
  if (emailAddress.length) {
    return emailAddress.pop();
  }

  return null;
};


export const orderSessionsByCreatedTime = (reverse, a, b) => {
  let result;
  if (a.CreatedTime < b.CreatedTime) {
    result = -1;
  } else if (a.CreatedTime == b.CreatedTime) {
    result = 0;
  } else {
    result = 1;
  }

  return reverse ? -1 * result : result;
};

const fetchSessionList = (dpapp, email, apiKey) => {
  const { restApi } = dpapp;

  const fetchParams = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json' ,
      'Accept': 'application/json' ,
      'Authorization':  `Basic ${apiKey}`
    }
  };

  const url = `https://www.fullstory.com/api/v1/sessions?email=${email}`;

  return restApi.fetchCORS(url, fetchParams)
    .then(response => {
      DEBUG && console.log('received a good response ', response);
      return response.body;
    })
    .catch(err => {
      DEBUG && console.log('fetch error ', err);
      return [];
    })
};

export class App extends React.Component
{
  static propTypes = {
    dpapp: PropTypes.object.isRequired,

    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.initState();
  }

  initState = () => {
    this.state = { sessions: null };
  };

  componentDidMount() {

    const { dpapp } = this.props;
    const state = this.props.store.getState();

    let email;
    try {
      email = selectPersonEmailFromTabData(state.sdk.tabData);
    } catch (e) {
      console.error(e);
    }

    dpapp.storage.getAppStorage('apikey')
      .then(apiKey => fetchSessionList(dpapp, email, apiKey))
      .then(sessions => {
        DEBUG && console.log ('got sessions', sessions);
        this.setState({ sessions });
      })
      .catch((err) => {
        this.setState({ sessions: null });
        DEBUG && console.log('error retrieving sessions data', err);
      })
    ;
  }

  render() {

    const { sessions } = this.state;

    if (! sessions) {
      return (<Loader/>);
    }

    if (sessions.length === 0) {
      return (<Container>No recorded sessions found</Container>);
    }

    try {
      const orderedSessions = sessions.concat([]).sort(orderSessionsByCreatedTime.bind(null, true));
      return (
        <Container className={"dp-fullstory"}>
          <List className={"dp-fullstory__list"}> {
            orderedSessions.map(this.renderSession)
          } </List>
        </Container>
    );
    } catch (e) {
      return (<span> Error displaying data </span>);
    }
  }

  renderSession = ({ CreatedTime, FsUrl, SessionId }) =>
  {
    return (
      <ListElement>
        <Heading size={3}>
          <span>
            <span>Session </span>
            <a className={"dp-fullstory__sessionid"} href={FsUrl} target="_blank" rel="noopener noreferrer" title={`${SessionId}`} >
              {SessionId}
            </a>
            <a href={FsUrl} target="_blank" rel="noopener noreferrer" title="Click to open in Fullstory">
                <Icon name="external-link-square" />
            </a>
            <span> - <Moment unix fromNow>{CreatedTime}</Moment></span>
          </span>
        </Heading>
      </ListElement>
    );
  };

}
