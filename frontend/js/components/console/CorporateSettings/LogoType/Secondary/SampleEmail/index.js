import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import { Card, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

class SampleEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  render() {
    const { setting, file } = this.props;
    return (
      <Card className="border-0">
        <Row className="justify-content-md-center">
          <Col className="text-center">
            <Card.Img
              variant="top"
              className="sample-email-image"
              src={file ? file : setting.emailLogoURL}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12} className="sample-email-text">
            {I18n.t('console.corporate_settings.email_greeting')}
          </Col>
          <Col md={12} className="sample-email-text mt-2">
            {I18n.t('console.corporate_settings.email_description')}
          </Col>
          <Col md={12} className="sample-email-text text-center mt-5">
            <Button
              variant="primary"
              size="sm"
            >
              {I18n.t('console.corporate_settings.accept_invite')}
            </Button>
          </Col>
          <Col md={12} className="sample-email-text mt-5">
            {I18n.t('console.corporate_settings.email_link-instructions')}
          </Col>
          <Col md={12} className="sample-email-text mt-1">
            <a
              href={I18n.t('console.corporate_settings.sample_email_link')}
              className="sample-email-text"
              style={{ color: '#2d8dfc', padding: 0 }}
            >
              {I18n.t('console.corporate_settings.sample_email_link')}
            </a>
          </Col>
        </Row>
      </Card>
    );
  }
}

SampleEmail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  file: PropTypes.any,
  lang: PropTypes.string,
  setting: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    setting: state.users.setting,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleEmail);
