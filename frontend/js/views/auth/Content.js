/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Col, Row, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';
import { validateEmail } from './../../utils';
import {
  loginUser,
  registerUser,
  resendVerifyEmail,
  clearLoginErrors
} from '../../actions/auth';
import './auth.scss';

class Content extends Component {
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
    dispatch(clearLoginErrors());
  }

  getDefaultError = () => ({
    message: '',
    details: {
      password: '',
      email: '',
      confirmPassword: '',
      fullName: '',
    },
  })

  loginButtonClickHandler = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    const { loginPassword, email } = e.target.elements;

    const data = {
      email: email.value.trim(),
      password: loginPassword.value.trim(),
    };

    const error = this.getDefaultError();
    if (!data.email.length) {
      error.details.email = I18n.t('auth.error.missingEmail');
    } else if (!validateEmail(data.email)) {
      error.details.email = I18n.t('auth.error.invalidEmail');
    }

    if (!data.password.length) {
      error.details.password = I18n.t('auth.error.passwordNotLong');
    }
    this.setState({ errorMessage: error });
    if (!_.isEqual(this.getDefaultError(), error)) {
      return;
    }
    dispatch(loginUser(data));
  };

  registerButtonClickHandler = e => {
    const { dispatch } = this.props;
    const { inviteString } = this.props;
    e.preventDefault();
    const {
      email,
      fullName,
      password,
      cPassword,
    } = e.target.elements;
    const data = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
      confirmPassword: cPassword.value.trim(),
    };
    if (inviteString) {
      data.inviteString = inviteString;
    }
    const error = this.getDefaultError();

    if (data.fullName.length < 1 || data.fullName.length > 50) {
      error.details.fullName = I18n.t('auth.error.missingName');
    }

    if (!validateEmail(data.email)) {
      error.details.email = I18n.t('auth.error.invalidEmail');
    } else if (data.email.length < 1) {
      error.details.email += I18n.t('auth.error.missingEmail');
    }

    if (data.password.length < 8 || data.password.length > 100) {
      error.details.password = I18n.t('auth.error.passwordNotLong');
    }

    if (data.confirmPassword.length < 8 || data.confirmPassword.length > 100) {
      error.details.confirmPassword = I18n.t('auth.error.passwordNotLong');
    }

    if (data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword &&
      !error.details.confirmPassword &&
      !error.details.password) {
      error.message = I18n.t('ideas.modal.passwordNotMatch');
    }
    this.setState({ errorMessage: error });
    if (!_.isEqual(this.getDefaultError(), error)) {
      return;
    }
    dispatch(registerUser(data));
  };

  toggleShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  toggleShowConfirmPassword = () => {
    this.setState({
      showConfirmPassword: !this.state.showConfirmPassword,
    });
  }

  resendEmail = () => {
    const { dispatch } = this.props;
    dispatch(resendVerifyEmail());
  }

  getLoginForm = () => {
    const { showPassword, errorMessage } = this.state;
    const { loginErrorMessage, accountNotVerified } = this.props;
    return (
      <div className="auth-body">
        <div className="center-box">
          <Row>
            <Col md={12} className="text-center">
              {I18n.t('auth.enter')}
            </Col>
          </Row>
          <Form onSubmit={this.loginButtonClickHandler}>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>{I18n.t('auth.email')}</Form.Label>
                  <Form.Control
                    isInvalid={!!errorMessage.details.email}
                    type="email"
                    name="email"
                    placeholder={I18n.t('auth.email')}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage.details.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>
                    {I18n.t('auth.password')}
                    <div
                      onKeyPress={this.toggleShowPassword}
                      role="button"
                      tabIndex="0"
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
                    isInvalid={!!errorMessage.details.password}
                    type={showPassword ? 'text' : 'password'}
                    name="loginPassword"
                    placeholder="*********"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage.details.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12} className="text-center">
                {errorMessage.message.length > 0 && (
                  <small className="form-text text-danger">
                    {errorMessage.message}
                  </small>
                )}
                {loginErrorMessage !== '' ? (
                  <small className="form-text text-danger">
                    {I18n.t('auth.error.loginError')}
                  </small>
                ) : null}
                {accountNotVerified ? (
                  <div className="form-text text-danger not-verified-msg">
                    {I18n.t('auth.accountNotVerifiedBeforeLine1')} <br />
                    {I18n.t('auth.accountNotVerifiedBeforeLine2')}
                    <a href="#" onClick={this.resendEmail}>
                      {I18n.t('auth.accountNotVerifiedLink')}
                    </a>
                    {I18n.t('auth.accountNotVerifiedAfter')}
                  </div>
                ) : null}
              </Col>
              <Col md={12} className="text-center mt-3">
                <Button
                  variant="primary"
                  className="text-uppercase font-12 action-btn"
                  type="submit"
                >
                  {I18n.t('auth.login')}
                </Button>
              </Col>
              <Col md={12} className="mt-3 light-link">
                <Link to="/login/reset">{I18n.t('auth.forgot')}</Link>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  getSignupForm = () => {
    const {
      registerErrorMessage,
      email,
    } = this.props;
    const {
      errorMessage,
      showPassword,
      showConfirmPassword,
    } = this.state;
    return (
      <div className="auth-body">
        <div className="center-box">
          <Row>
            <Col md={12} className="text-center">
              {I18n.t('auth.createDesc')}
            </Col>
          </Row>
          <Form onSubmit={this.registerButtonClickHandler}>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formBasicName">
                  <Form.Label>{I18n.t('auth.profiles.fullName')}</Form.Label>
                  <Form.Control
                    isInvalid={!!errorMessage.details.fullName}
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage.details.fullName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>{I18n.t('auth.email')}</Form.Label>
                  <Form.Control
                    isInvalid={!!errorMessage.details.email}
                    type="email"
                    defaultValue={email}
                    name="email"
                    placeholder="johndoe@mail.com"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage.details.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>
                    {I18n.t('auth.password')}
                    <div
                      role="button"
                      tabIndex="0"
                      onKeyPress={this.toggleShowPassword}
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
                    isInvalid={!!errorMessage.details.password}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder={I18n.t('auth.passwordHint')}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage.details.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="formBasicCPassword">
                  <Form.Label>
                    {I18n.t('auth.confirmPass')}
                    <div
                      role="button"
                      tabIndex="0"
                      onKeyPress={this.toggleShowConfirmPassword}
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
                    isInvalid={!!errorMessage.details.confirmPassword}
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="cPassword"
                    placeholder={I18n.t('auth.confirmHint')}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage.details.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12} className="text-center">
                {errorMessage.message.length > 0 && (
                  <small className="form-text text-danger">
                    {errorMessage.message}
                  </small>
                )}
                {registerErrorMessage !== '' && (
                  <small className="form-text text-danger">
                    {registerErrorMessage}
                  </small>
                )}
              </Col>
              <Col md={12} className="text-center mt-3">
                <Button
                  variant="primary"
                  className="text-uppercase font-12 action-btn"
                  type="submit"
                >
                  {I18n.t('auth.create')}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  render() {
    const {
      activeTab: { name },
      tabData,
    } = this.props;

    return (
      <div className="auth-wrapper">
        {name === tabData[1].name && this.getLoginForm()}
        {name === tabData[0].name && this.getSignupForm()}
      </div>
    );
  }
}

Content.propTypes = {
  accountNotVerified: PropTypes.bool,
  activeTab: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  email: PropTypes.string,
  inviteString: PropTypes.string,
  loginErrorMessage: PropTypes.string,
  params: PropTypes.object,
  registerErrorMessage: PropTypes.string,
  tabData: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const { register, auth } = state;
  const { isAuthenticated, loginErrorMessage } = auth;
  const { registerErrorMessage } = register;

  return {
    isAuthenticated,
    loginErrorMessage,
    registerErrorMessage,
    accountNotVerified: state.auth.accountNotVerified,
    lang: state.i18n.locale,
    resentEmail: state.auth.resentEmail,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
