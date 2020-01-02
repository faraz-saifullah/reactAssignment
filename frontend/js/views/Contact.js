import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Button, Form, Row, Col, Container } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';
import Footer from '../components/Footer';
import { Author } from '../components/Author';
import { TrialDuration } from '../components/TrialDuration';
import {
  contactUs,
  contactUsFailure,
  resetContactUs
} from '../actions/contact';

class Contact extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(resetContactUs());
  }

  hideSuccess = e => {
    const { dispatch } = this.props;
    e.preventDefault();

    dispatch(resetContactUs());

    this.setState({ text: '' });
  };

  onChange = e => {
    const { dispatch } = this.props;
    if (e.target.value.trim().length === 0) {
      const errorMessage = {
        message: '',
        details: {},
      };
      errorMessage.details.text = I18n.t('contactError');

      dispatch(contactUsFailure(errorMessage));
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    const { dispatch } = this.props;

    e.preventDefault();

    const errorMessage = Contact.validateTextField(this.state.text);
    if (
      Object.keys(errorMessage.details).length > 0 ||
      errorMessage.message.length > 0
    ) {
      dispatch(contactUsFailure(errorMessage));
      return;
    }
    dispatch(contactUs(this.state.text));
  };

  static validateTextField(text) {
    const errorMessage = {
      message: '',
      details: {},
    };

    if (text.length < 1 || text.length > 3000) {
      errorMessage.details.text = I18n.t('contactError');
    }

    return errorMessage;
  }

  render() {
    const { showSuccess, errorMessage } = this.props;


    return (
      <div>
        <Row className="mb-4">
          <Col md={12} className="page-header pl-5 mb-2">
            <h3>&nbsp;</h3>
          </Col>
          <Col md={12} className="swap inner-main-component">
            <Row className="justify-content-center">
              <Col md={10} xs={12}>
                {showSuccess ? (
                  <Card>
                    <Card.Body className="text-center">
                      <h1>{I18n.t('auth.resets.thanks')}</h1>
                      <hr />
                      <p>{I18n.t('getback')}</p>
                      <Button
                        variant="link"
                        className="font-12 action-btn"
                        onClick={this.hideSuccess}
                      >
                        {I18n.t('leave')}
                      </Button>
                    </Card.Body>
                  </Card>
                ) :
                  (
                    <Card>
                      <Card.Body className="text-center">
                        <h1>{I18n.t('contact')}</h1>
                        <hr />
                        <p>{I18n.t('howhelp')}</p>
                        <Form onSubmit={this.onSubmit}>
                          <Form.Control
                            className="textarea"
                            as="textarea"
                            name="text"
                            rows="5"
                            placeholder={I18n.t('helpplaceholder')}
                            value={this.state.text}
                            onChange={this.onChange}
                          />
                          {errorMessage.details.text && (
                            <small className="form-text text-danger">
                              {errorMessage.details.text}
                            </small>
                          )}
                          {errorMessage.message.length > 0 &&
                            Object.keys(errorMessage.details).length === 0 &&
                            (
                              <small className="form-text text-danger">
                                {errorMessage.message}
                              </small>
                            )}

                          <Col md={12} className="mt-4 text-center">
                            <Button
                              type="submit"
                              variant="primary"
                              className="text-uppercase font-weight-bold font-12"
                            >
                              {I18n.t('send')}
                            </Button>
                          </Col>
                        </Form>
                      </Card.Body>
                    </Card>
                  )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

Contact.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errorMessage: PropTypes.object.isRequired,
  showSuccess: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    showSuccess: state.contact.sent,
    errorMessage: state.contact.sendErrorMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
