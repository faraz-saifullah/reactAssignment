import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n, setLocale } from 'react-redux-i18n';
import Countdown from 'react-countdown-now';
import './TrialDuration.scss';
import { fetchAccountProfile } from '../../actions/profile';

class TrialDuration extends React.Component {
  componentDidMount() {
    const { dispatch, accountInfoLoaded } = this.props;
    if (!accountInfoLoaded) {
      dispatch(fetchAccountProfile());
    }
  }

  getDurationLeft = () => {
    const { setting } = this.props;
    if (setting && setting.trial) {
      const { trialStartMs, trialDuration } = setting;
      const trialExpireAt = moment(trialStartMs).add(trialDuration, 'days');
      const now = moment(new Date());
      const duration = moment.duration(trialExpireAt.diff(now));
      const daysLeft = duration.asDays();
      return daysLeft * 86400000;
    }
    return 0;
  };

  render() {
    const { accountInfoLoaded, setting } = this.props;
    const { trial } = setting;
    const renderer = ({ days, hours }) => {
      return (
        <span>
          {I18n.t('ideas.view.timer', {
            days: `${days}`,
            hours: `${hours}`,
          })}
        </span>
      );
    };
    return accountInfoLoaded && trial ? (
      <div className="timer">
        <Countdown
          date={Date.now() + this.getDurationLeft()}
          renderer={renderer}
        />
      </div>
    ) : (
      <div />
    );
  }
}

TrialDuration.propTypes = {
  accountInfoLoaded: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
  setting: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    accountInfoLoaded: state.profile.accountInfoLoaded,
    setting: state.users.setting,
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const trialDuration = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrialDuration);
export { trialDuration as TrialDuration };
