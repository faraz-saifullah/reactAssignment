/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { I18n, setLocale } from 'react-redux-i18n';

import './ChangePasswordModal.scss';
import {
  changePassword,
  changePasswordFailure,
  showChangePasswordModal,
} from '../../actions/profile';

class ChangePasswordModal extends React.Component {
  constructor() {
    super();
    this.state = {
      password: '',
      confirmPassword: '',
      oldPassword: '',
      showOldPassword: false,
      showPassword: false,
      showConfirmPassword: false,
    };
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
  }

  toggleShowOldPassword = () => {
    this.setState({ showOldPassword: !this.state.showOldPassword });
  };

  toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  toggleShowConfirmPassword = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();

    const errorMessage = ChangePasswordModal.validatePasswordFields(this.state);
    if (
      Object.keys(errorMessage.details).length > 0 ||
      errorMessage.message.length > 0
    ) {
      dispatch(changePasswordFailure(errorMessage));
      return;
    }

    dispatch(changePassword(this.state));
  };

  onClose = () => {
    const { dispatch } = this.props;
    dispatch(showChangePasswordModal(false));
  };

  onShow = () => {
    this.setState({ password: '', confirmPassword: '', oldPassword: '' });
  };

  static validatePasswordFields(fields) {
    let errorMessage = {
      message: '',
      details: {},
    };

    if (fields.oldPassword.length < 4 || fields.oldPassword.length > 100) {
      errorMessage.details.oldPassword = I18n.t('auth.error.passwordNotLong');
    }

    if (fields.password.length < 8 || fields.password.length > 100) {
      errorMessage.details.password = I18n.t('auth.error.passwordNotLong');
    }

    if (
      fields.confirmPassword.length < 8 ||
      fields.confirmPassword.length > 100
    ) {
      errorMessage.details.confirmPassword = I18n.t(
        'auth.error.passwordNotLong'
      );
    }

    if (fields.password !== fields.confirmPassword) {
      errorMessage.message = I18n.t('ideas.modal.passwordNotMatch');
    }

    return errorMessage;
  }

  showOldPassword = () => {
    if (!this.state.showOldPassword) {
      return (
        <div className="show-password" onClick={this.toggleShowOldPassword}>
          {I18n.t('auth.show')}
          <i className="fas fa-eye" />
        </div>
      );
    }
    return (
      <div className="show-password" onClick={this.toggleShowOldPassword}>
        {I18n.t('auth.hide')}
        <i className="fas fa-eye-slash" />
      </div>
    );
  };

  showPassword = () => {
    if (!this.state.showPassword) {
      return (
        <div className="show-password" onClick={this.toggleShowPassword}>
          {I18n.t('auth.show')}
          <i className="fas fa-eye" />
        </div>
      );
    }
    return (
      <div className="show-password" onClick={this.toggleShowPassword}>
        {I18n.t('auth.hide')}
        <i className="fas fa-eye-slash" />
      </div>
    );
  };

  showConfirmPassword = () => {
    if (!this.state.showConfirmPassword) {
      return (
        <div className="show-password" onClick={this.toggleShowConfirmPassword}>
          {I18n.t('auth.show')}
          <i className="fas fa-eye" />
        </div>
      );
    }
    return (
      <div className="show-password" onClick={this.toggleShowConfirmPassword}>
        {I18n.t('auth.hide')}
        <i className="fas fa-eye-slash" />
      </div>
    );
  };

  checkPasswordErrors = key => {
    const { errorMessage } = this.props;
    return (
      errorMessage.details.hasOwnProperty(key) && (
        <small className="form-text text-danger">
          {errorMessage.details[`${key}`]}
        </small>
      )
    );
  };

  render() {
    const { show, errorMessage } = this.props;
    const { showPassword, showConfirmPassword, showOldPassword } = this.state;

    return (
      <Modal
        show={show}
        onHide={this.onClose}
        onShow={this.onShow}
        id="ideaModal"
      >
        <Modal.Header>
          <Modal.Title>{I18n.t('auth.resets.newPass')}</Modal.Title>
          <Button variant="link" className="close pt-4" onClick={this.onClose}>
            {I18n.t('ideas.modal.close')} &times;
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="center-box padding-vertical">
            <Form onSubmit={this.onSubmit}>
              <div className="form-group password-field">
                <Form.Label htmlFor="inputPassword">
                  {I18n.t('auth.resets.oldPass')}
                </Form.Label>
                <Form.Control
                  type={showOldPassword ? 'text' : 'password'}
                  className="form-control"
                  id="inputOldPassword"
                  name="oldPassword"
                  placeholder="******"
                  value={this.state.oldPassword}
                  onChange={this.onChange}
                />
                {this.showOldPassword()}
                {this.checkPasswordErrors('oldPassword')}
              </div>
              <div className="form-group password-field">
                <Form.Label htmlFor="inputPassword">
                  {I18n.t('auth.resets.newPass')}
                </Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="inputPassword"
                  name="password"
                  placeholder="******"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                {this.showPassword()}
                {this.checkPasswordErrors('password')}
              </div>
              <div className="form-group password-field">
                <Form.Label htmlFor="inputConfirmPassword" className="label">
                  {I18n.t('auth.resets.confirmPass')}
                </Form.Label>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  id="inputConfirmPassword"
                  name="confirmPassword"
                  placeholder="******"
                  value={this.state.confirmPassword}
                  onChange={this.onChange}
                />
                {this.showConfirmPassword()}
                {this.checkPasswordErrors('confirmPassword')}
              </div>
              <div style={{ textAlign: 'center' }}>
                {errorMessage.message.length > 0 &&
                  Object.keys(errorMessage.details).length === 0 && (
                    <small className="form-text text-danger">
                      {errorMessage.message}
                    </small>
                  )}

                <Button
                  type="submit"
                  variant="primary"
                  className="mt-2 text-uppercase custom-btn"
                >
                  {I18n.t('auth.resets.changePass')}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

ChangePasswordModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errorMessage: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    errorMessage: state.profile.profileErrors,
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordModal);
