import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'react-moment';
import { apiKey as fullstoryApiKey } from '../../../secrets/fullstory';

const DEBUG = false;

export const selectPersonEmailFromTabData = ({api_data: {person : {emails}}}) => {
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

export const mapSessionToMarkup = ({ CreatedTime, FsUrl }) =>
{
  return (
    <li>
      <a href={FsUrl} target="_blank">Play session</a> - <span><Moment unix fromNow>{CreatedTime}</Moment></span>
    </li>
  );
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

export default class App extends React.Component
{
  // should receive apiKey via props when custom props will be allowed via DeskproAppsContainer
  // static propTypes = {
  //   dpapp: React.PropTypes.object.isRequired,
  //   apiKey: React.PropTypes.string.isRequired
  // };
  static propTypes = {
    dpapp: React.PropTypes.object.isRequired
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

    dpapp.context.getTabData()
      .then(tabData => {
        let email;
        try {
          email = selectPersonEmailFromTabData(tabData);
        } catch (e) {
          email = null;
        }
        return { email };
      })
      .then(({ email }) => {
        if (! email) { return []; }
        return fetchSessionList(dpapp, email, fullstoryApiKey);
      })
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

  // shouldComponentUpdate() { return false; }

  render() {

    const { sessions } = this.state;

    if (! sessions) {
      return (<span>Reading sessions...</span>);
    }

    if (sessions.length === 0) {
      return (<span>No recorded sessions found</span>);
    }

    try {
      const orderedSessions = sessions.concat([]).sort(orderSessionsByCreatedTime.bind(null, true));
      const markup = orderedSessions.map(mapSessionToMarkup);
      return (<ul> {markup} </ul>);
    } catch (e) {
      return (<span> Error displaying data </span>);
    }

  }
}
