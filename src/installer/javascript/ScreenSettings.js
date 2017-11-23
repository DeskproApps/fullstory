import React from 'react';
import PropTypes from 'prop-types';

export class ScreenSettings extends React.Component
{
  static propTypes = {
    finishInstall: PropTypes.func.isRequired,
    installType: PropTypes.string.isRequired,
    settings: PropTypes.array.isRequired,
    values: PropTypes.array.isRequired,
    settingsForm: PropTypes.func.isRequired
  };

  onSettings = (settings) =>
  {
    const { finishInstall } = this.props;
    finishInstall(settings).then(({ onStatus }) => onStatus());
  };

  render()
  {
    const { settings, values, finishInstall, settingsForm: SettingsForm } = this.props;

    if (settings.length) {
      let formRef;
      return (
        <div className={'settings'}>
          <SettingsForm settings={settings} values={values} ref={ref => formRef = ref} onSubmit={this.onSettings} />
          <button className={'btn-action'} onClick={() => formRef.submit()}>Update Settings</button>
        </div>
      );
    }

    finishInstall(null).then(({ onStatus }) => onStatus());
    return null;
  }
}