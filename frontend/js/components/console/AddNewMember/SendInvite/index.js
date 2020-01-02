import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import { Card, InputGroup, Button, Form } from 'react-bootstrap';
import CSVReader from 'react-csv-reader';
import _ from 'lodash';
import { validateEmail, getRandomNumber } from '../../../../utils';
import { send_invite_email, getInvitedUsers } from '../../../../actions/admin';

const csvReaderOptions = {
  dynamicTyping: true,
  skipEmptyLines: true,
};

class SendInvite extends React.Component {
  constructor() {
    super();
    this.state = {
      emailInput: '',
      emailList: [],
      emailValidationError: false,
      emailUploadError: false,
    };
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
    dispatch(getInvitedUsers(10, 0));
  }
  componentWillUnmount() {
    clearTimeout(this.turnOffRedTimeout);
  }

  addEmail = e => {
    e.preventDefault();
    const { emailInput, emailList } = this.state;
    const emails = emailInput.split(',');
    const validEmails = [];
    for (const eachEmail of emails) {
      const email = eachEmail.trim();
      if (!validateEmail(email)) {
        return this.setState({ emailValidationError: true });
      }
      validEmails.push(email);
    }
    return this.setState({
      emailList: _.union(emailList, validEmails),
      emailInput: '',
      emailValidationError: false,
    });
  };

  sendInvitation = () => {
    const { emailList } = this.state;
    const { dispatch } = this.props;
    const list = emailList.map(email => ({ email }));
    dispatch(send_invite_email(list));
    this.setState({ emailList: [] });
  };

  handleDataLoad = data => {
    this.setState({
      csvReaderKey: getRandomNumber(),
    });
    this.setState({ emailUploadError: false });
    const { emailList } = this.state;
    const validEmails = [];
    for (const eachEmail of data) {
      const email = eachEmail[0].trim();
      if (!validateEmail(email)) {
        this.setState({ emailUploadError: true });
        clearTimeout(this.turnOffRedTimeout);
        this.turnOffRedTimeout = setTimeout(() => {
          this.setState(() => ({ emailUploadError: false }));
        }, 5000);
        return;
      }
      validEmails.push(email);
    }
    this.setState({
      emailList: _.union(emailList, validEmails),
      emailUploadError: false,
    });
  };

  removeEmail = key => {
    const { emailList } = this.state;
    emailList.splice(key, 1);
    this.setState({ emailList });
  };

  handelOnChange = e => {
    this.setState({ emailInput: e.target.value, emailValidationError: false });
  };

  render() {
    const {
      emailInput,
      emailList = [],
      emailValidationError,
      emailUploadError,
      csvReaderKey,
    } = this.state;
    const {
      sentInvitations,
      failedInvitations,
      emptyInvites,
      show,
    } = this.props;
    return (
      <Card>
        <Card.Body>
          <Card.Title className="invite-title">
            {I18n.t('console.add_member.send_invite')}
            {!emptyInvites && (
              <Button
                className="pull-right text-uppercase light-gray-3-border font-12 font-weight-bold"
                variant="outline-primary"
                onClick={show}
              >
                {I18n.t('console.add_member.manage_invite')}
              </Button>
            )}
          </Card.Title>
          <Card.Text className="mt-4 invite-description">
            {I18n.t('console.add_member.add_email')}
          </Card.Text>
          <Form noValidate validated={false} onSubmit={this.addEmail}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="color-main">
                {' '}
                {I18n.t('console.add_member.email_address')}
              </Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="email"
                  className="light-gray-3-border"
                  value={emailInput}
                  isInvalid={emailValidationError}
                  required
                  onChange={this.handelOnChange}
                />
                <InputGroup.Append>
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="light-gray-3-border text-uppercase font-12"
                  >
                    {I18n.t('console.add_member.add')}
                  </Button>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">
                  {I18n.t('console.add_member.enter_valid')}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>
          {emailList && emailList.length > 0 ? (
            <div className="email-list color-main">
              <p>{I18n.t('console.add_member.email')}</p>
              {emailList.map((email, key) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={key}>
                  {email}
                  <label
                    className="close-label d-inline-block ml-2 pull-right"
                    onClick={() => this.removeEmail(key)}
                  >
                    &times;
                  </label>
                </p>
              ))}
            </div>
          ) : null}
          <Button
            variant="primary"
            className="text-uppercase mt-2 font-12 action-btn"
            onClick={this.sendInvitation}
            disabled={!emailList.length}
            block
          >
            {I18n.t('console.add_member.send_email')}
          </Button>
          <Button
            variant="outline-primary"
            className="text-uppercase react-csv-input font-12 action-btn"
            key={this.state.csvReaderKey || ''}
            block
          >
            <i className="fas fa-paperclip" /> &nbsp;
            {I18n.t('console.add_member.upload_email')}
            <CSVReader
              onFileLoaded={data => this.handleDataLoad(data)}
              parserOptions={csvReaderOptions}
            />
          </Button>
          {emailUploadError && (
            <label className="text-danger">
              {I18n.t('console.add_member.multi_invalid')}
            </label>
          )}
        </Card.Body>
      </Card>
    );
  }
}

SendInvite.propTypes = {
  dispatch: PropTypes.func.isRequired,
  emptyInvites: PropTypes.any,
  lang: PropTypes.any,
  show: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    sendInviteError: state.admin.sendInviteError,
    sentInvitations: state.admin.sentInvitations,
    failedInvitations: state.admin.failedInvitations,
    emptyInvites: state.admin.invitedUsers.empty,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendInvite);
