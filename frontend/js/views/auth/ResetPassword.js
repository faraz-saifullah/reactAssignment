/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Col, Row, Button, Form } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';
import { forgotPassword, resetPassword, resetPasswordReset } from '../../actions/auth';
import { validateEmail } from './../../utils';
import history from './../../history';
import './auth.scss';

export class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      showConfirmPassword: false,
      errorMessage: this.getDefaultError(),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(resetPasswordReset());
  }

  getDefaultError = () => ({
    message: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  })

  handleSendCodeClick = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { email } = e.target.elements;
    if (!email.value.trim()) {
      return;
    }
    const forgotPasswordData = { email: email.value.trim() };
    if (!validateEmail(forgotPasswordData.email)) {
      this.setState({
        errorMessage: {
          ...this.getDefaultError(),
          message: I18n.t('auth.error.invalidEmail'),
        },
      });
    } else {
      this.setState({ errorMessage: this.getDefaultError() });
      dispatch(forgotPassword(forgotPasswordData));
    }
  }

  handleConfirmClick = (e) => {
    e.preventDefault();
    const { dispatch, match } = this.props;
    const { codeString } = match.params;
    if (!codeString) {
      return this.setState({
        errorRegisterMessage: {
          ...this.state.errorRegisterMessage,
          message: I18n.t('auth.error.notValidLink'),
        },
      });
    }
    const { loginPassword, cPassword } = e.target.elements;

    const password = loginPassword.value.trim();
    const confirmPassword = cPassword.value.trim();

    if (!(password.length >= 8 && password.length <= 100)) {
      return this.setState({
        errorMessage: {
          password: I18n.t('auth.error.notValidPassword'),
        },
      });
    }

    if (!(confirmPassword.length >= 8 && confirmPassword.length <= 100)) {
      return this.setState({
        errorMessage: {
          confirmPassword: I18n.t('auth.error.notValidPassword'),
        },
      });
    }

    if (password !== confirmPassword) {
      return this.setState({
        errorMessage: {
          message: I18n.t('auth.error.passwordsDontMatch'),
        },
      });
    }

    this.setState({ errorMessage: this.getDefaultError() });

    const confirmPasswordData = {
      password,
      confirmPassword,
      resetString: codeString,
      showPassword: false,
    };

    return dispatch(resetPassword(confirmPasswordData));
  }

  toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  toggleShowConfirmPassword = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  };

  goBack = () => {
    history.push('/');
  }

  renderRequestCodeForm() {
    const { errorMessage } = this.state;
    const { apiErrorMessage } = this.props;
    return (
      <div>
        <Row>
          <Col className="link-heading">
            <Button
              variant="link-dark"
              className="color-main action-btn"
              onClick={this.goBack}
            >
              <i className="fas fa-chevron-left" />
              &nbsp;
              {I18n.t('auth.login')}
            </Button>
          </Col>
        </Row>
        <Form onSubmit={this.handleSendCodeClick}>
          <Row className="center-box mt-5 justify-content-md--center">
            <Col md={12} className="text-center">
              <div className="title-heading">{I18n.t('auth.reset')}</div>
            </Col>
            <Col md={12} className="text-center mt-2">
              {I18n.t('auth.resets.email')}
            </Col>
            <Col md={12} className="mt-5">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>{I18n.t('auth.email')}</Form.Label>
                <Form.Control
                  isInvalid={!!errorMessage.message}
                  type="email"
                  name="email"
                  placeholder={I18n.t('auth.email')}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <small className="form-text text-danger">
                {apiErrorMessage}
              </small>
            </Col>
            <Col md={12} className="text-center mt-3">
              <Button
                variant="primary"
                className="text-uppercase font-12 action-btn"
                type="submit"
              >
                {I18n.t('auth.resets.resetLink')}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  renderConfirmationForm() {
    const { showPassword, showConfirmPassword, errorMessage } = this.state;
    const { apiErrorMessage } = this.props;
    return (
      <div>
        <Row className="link-heading">
          <Col md={12}>
            <Button
              variant="link-dark"
              className="color-main action-btn"
              onClick={this.goBack}
            >
              <i className="fas fa-chevron-left" />
              &nbsp;
              {I18n.t('auth.login')}
            </Button>
          </Col>

        </Row>
        <Form onSubmit={this.handleConfirmClick}>
          <Row className="center-box mt-5 justify-content-md-center">
            <Col md={12} className="link-heading text-center">
              {I18n.t('auth.resets.newPass')}
            </Col>
            <Col md={12} className="mt-2">
              <Form.Group controlId="formBasicPassword">
                <Form.Label>
                  {I18n.t('auth.resets.newPass')}
                  <div
                    className="show-password"
                    onClick={this.toggleShowPassword}
                  >
                    {showPassword ?
                      <span> {I18n.t('auth.hide')} <i className="fas fa-eye-slash" /></span> :
                      <span> {I18n.t('auth.show')} <i className="fas fa-eye" /></span>
                    }
                  </div>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errorMessage.password}
                  type={showPassword ? 'text' : 'password'}
                  name="loginPassword"
                  placeholder={I18n.t('auth.resets.newPass')}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12} >
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>
                  {I18n.t('auth.resets.confirmPass')}
                  <div
                    className="show-password"
                    onClick={this.toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ?
                      <span> {I18n.t('auth.hide')} <i className="fas fa-eye-slash" /></span> :
                      <span> {I18n.t('auth.show')} <i className="fas fa-eye" /></span>
                    }
                  </div>
                </Form.Label>
                <Form.Control
                  isInvalid={!!errorMessage.confirmPassword}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="cPassword"
                  placeholder={I18n.t('auth.resets.confirmPass')}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12} className="text-center">
              {(errorMessage &&
                errorMessage.message) &&
                (
                  <small className="form-text text-danger">
                    {errorMessage.message}
                  </small>
                )}
            </Col>
            <Col md={12} className="text-center">
              <small className="form-text text-danger">
                {apiErrorMessage}
              </small>
            </Col>
            <Col md={12} className="text-center mt-3">
              <Button
                variant="primary"
                className="text-uppercase font-12 action-btn"
                type="submit"
              >
                {I18n.t('auth.resets.changePass')}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  renderSentSuccessMessage() {
    const { email } = this.props;
    return (
      <div>
        <Row>
          <Col className="link-heading">
            <Button
              variant="link-dark"
              className="color-main action-btn"
              onClick={this.goBack}
            >
              <i className="fas fa-chevron-left" />
              &nbsp;
              {I18n.t('auth.login')}
            </Button>
          </Col>
        </Row>
        <Row className="center-box mt-5">
          <Col md={12} className="text-center">
            <h4>{I18n.t('auth.resets.thanks')}</h4>
          </Col>
          <Col md={12} className="text-center">
            <p>
              {I18n.t('auth.resets.emailSent')} {email}
            </p>
          </Col>
          <Col md={12} className="text-center">
            <Link to="/">{I18n.t('auth.resets.codeBack')}</Link>
          </Col>
        </Row>
      </div>
    );
  }

  renderSuccessMessage() {
    return (
      <div>
        <Row>
          <Col className="link-heading">
            <Button
              variant="link-dark"
              className="color-main action-btn"
              onClick={this.goBack}
            >
              <i className="fas fa-chevron-left" />
              &nbsp;
              {I18n.t('auth.login')}
            </Button>
          </Col>
        </Row>
        <Row className="center-box mt-5">
          <Col md={12} className="text-center">
            <p>
              {I18n.t('auth.resets.passwordReset')}
            </p>
          </Col>
          <Col md={12} className="text-center">
            <Link to="/">{I18n.t('auth.resets.resetBack')}</Link>
          </Col>
        </Row>
      </div>
    );
  }

  getComponent() {
    const { codeSent, confirmed, match } = this.props;
    const { codeString } = match.params || {};
    if (codeString) {
      if (!confirmed) {
        return this.renderConfirmationForm();
      }
      return this.renderSuccessMessage();
    }
    if (!codeSent) {
      return this.renderRequestCodeForm();
    }
    return this.renderSentSuccessMessage();
  }

  render() {
    return (
      <div>
        <div className="auth-header" />
        <Row className="justify-content-center pl-4 pr-4">
          <Col md={6} className="main-box">
            <div className="ResetPassword">
              {this.getComponent()}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  apiErrorMessage: PropTypes.string,
  codeSent: PropTypes.bool,
  confirmed: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  email: PropTypes.string,
  isConfirming: PropTypes.bool,
  isSendingCode: PropTypes.bool,
  match: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    codeSent: state.auth.resetPassword.codeSent,
    confirmed: state.auth.resetPassword.confirmed,
    isConfirming: state.auth.resetPassword.isConfirming,
    isSendingCode: state.auth.resetPassword.isSendingCode,
    apiErrorMessage: state.auth.resetPassword.errorMessage,
    resetString: state.auth.resetPassword.resetString,
    email: state.auth.resetPassword.email,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
