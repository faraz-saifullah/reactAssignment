import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Main from './Main/index';
import Secondary from './Secondary/index';

class LogoType extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title className="corporate-setting-title">
            <h5>{I18n.t('console.corporate_settings.logotype')}</h5>
          </Card.Title>
          <Card.Text className="corporate-setting-description">
            {I18n.t('console.corporate_settings.upload_instructions')}
          </Card.Text>
          <Main />
          <Secondary />
        </Card.Body>
      </Card>
    );
  }
}

LogoType.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoType);
