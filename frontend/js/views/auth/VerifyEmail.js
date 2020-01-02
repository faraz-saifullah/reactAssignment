import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Row, Col } from 'react-bootstrap';
import { fetchAccountProfile } from '../../actions/profile';
import { resendVerifyEmail } from '../../actions/auth';

function VerifyEmail(props) {
  const resendEmail = () => {
    const { dispatch } = props;
    dispatch(resendVerifyEmail());
  };

  const checkVerification = () => {
    const { dispatch } = props;
    dispatch(fetchAccountProfile());
  };

  return (
    <div>
      <div className="auth-header" />
      <Row className="justify-content-center pl-4 pr-4">
        <Col md={6} className="main-box">
          <Row className="link-heading">
            <Col md={12}>
              <Button
                variant="link-dark"
                className="color-main action-btn"
                onClick={checkVerification}
              >
                <i className="fas fa-chevron-left" />
                &nbsp;
                {I18n.t('auth.login')}
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md={12} className="mt-5 text-center" >
              <h4>{I18n.t('auth.resets.thanks')}</h4>
            </Col>
            <Col md={12} className="mt-5 text-center" >
              <p>{I18n.t('auth.register.emailSent')}</p>
            </Col>
            <Col md={12} className="text-center mt-3">
              <Button
                variant="primary"
                className="text-uppercase font-12 action-btn"
                onClick={resendEmail}
              >
                {I18n.t('auth.register.resendEmail')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

VerifyEmail.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(null, mapDispatchToProps)(VerifyEmail);
