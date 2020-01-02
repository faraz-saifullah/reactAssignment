import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import ConfirmDeleteModal from '../common/confirmDelete';
import { getDomains, addDomain, deleteDomain } from '../../../../actions/admin';
import { checkIsValidDomain } from '../../../../utils';

class CorporateDomain extends React.Component {
  constructor() {
    super();
    this.state = {
      domainInput: '',
      domainStringError: '',
      isAnotherInput: false,
      isEdit: -1,
    };
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
    dispatch(getDomains());
  }

  onAddEditDomain = (e) => {
    e.preventDefault();
    const { domain } = e.target.elements;
    const value = domain.value.trim();
    const { dispatch, domains } = this.props;
    const { isEdit } = this.state;
    const isDomainExists = domains.find(d => d.name === value);
    if (isDomainExists) {
      return this.setState({
        isAnotherInput: false,
        domainInput: '',
        domainStringError: false,
        isEdit: -1,
      });
    }
    if (value.length && value.length < 100 && checkIsValidDomain(value)) {
      dispatch(addDomain(value));
      if (isEdit >= 0) {
        dispatch(deleteDomain(domains[isEdit]));
      }
      return this.setState({
        isAnotherInput: false,
        domainInput: '',
        domainStringError: false,
        isEdit: -1,
      });
    }
    return this.setState({
      domainStringError: I18n.t('console.add_member.domain_error'),
    });
  };

  showDelete = key => {
    this.setState({ selectedDomain: key, isDelete: true });
  };

  hideDelete = () => {
    this.setState({ isDelete: false });
  };

  onDelete = () => {
    const { selectedDomain } = this.state;
    const { dispatch, domains } = this.props;
    dispatch(deleteDomain(domains[selectedDomain]));
    this.setState({ selectedDomain: -1, isDelete: false });
  };

  addAnotherInput = () => {
    this.setState({ isAnotherInput: true });
  };

  editInput = key => {
    const { domains } = this.props;
    this.setState({
      isEdit: key,
      domainInput: domains[key].name,
      isAnotherInput: true,
      domainStringError: false,
    });
  };

  render() {
    const {
      domainInput,
      domainStringError,
      isAnotherInput,
      isDelete,
      isEdit,
    } = this.state;
    // eslint-disable-next-line no-unused-vars
    const { domains = [], getDomainError } = this.props;
    return (
      <Card>
        <Card.Body>
          <Card.Title className="invite-title">
            {I18n.t('console.add_member.corporate_domain')}
          </Card.Title>
          <Card.Text className="mt-4 invite-description">
            {I18n.t('console.add_member.anyone_can_sign')}
          </Card.Text>
          {(isAnotherInput || !domains.length) ?
            (
              <Form
                noValidate
                validated={false}
                onSubmit={this.onAddEditDomain}
              >
                <Form.Group controlId="formBasicDomain">
                  <Form.Label> {I18n.t('console.add_member.domain_address')}</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      name="domain"
                      className="light-gray-3-border hideTick "
                      defaultValue={domainInput}
                      isInvalid={domainStringError}
                    />
                    <InputGroup.Append>
                      <Button
                        type="submit"
                        variant="outline-primary"
                        className="light-gray-3-border font-12"
                      >
                        {I18n.t('console.add_member.save')}
                      </Button>
                    </InputGroup.Append>
                    <Form.Control.Feedback type="invalid">
                      {I18n.t('console.add_member.domain_error')}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Form>
            ) : null
          }
          {(domains.length === 1 && isEdit === -1) || domains.length > 1 ? (
            <div className="email-list">
              <p>{I18n.t('console.add_member.active_domain')}</p>
              {domains.map((domain, key) => (
                isEdit !== key ? (
                  // eslint-disable-next-line react/no-array-index-key
                  <p key={key}>
                    {domain.name}
                    <label
                      className="close-label d-inline-block ml-2 pull-right"
                      onClick={() => this.showDelete(key)}
                    >
                      &times;
                    </label>
                    <label
                      className="close-label d-inline-block ml-2 pull-right"
                      onClick={() => this.editInput(key)}
                    >
                      <i className="fas fa-pencil-alt" />
                    </label>
                  </p>
                ) :
                  null
              ))}
            </div>
          ) : null}
          <Button
            variant="primary"
            className="text-uppercase mt-3 font-12 action-btn"
            onClick={this.addAnotherInput}
            block
          >
            {domains.length
              ? I18n.t('console.add_member.add_another')
              : I18n.t('console.add_member.add_domain')}
          </Button>
        </Card.Body>
        {
          isDelete && (
            <ConfirmDeleteModal
              hideDelete={this.hideDelete}
              onDelete={this.onDelete}
            >
              {I18n.t('console.add_member.delete_domain')}
            </ConfirmDeleteModal>
          )
        }
      </Card>
    );
  }
}

CorporateDomain.propTypes = {
  dispatch: PropTypes.func.isRequired,
  domains: PropTypes.array.isRequired,
  getDomainError: PropTypes.string,
  lang: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    domains: state.admin.domains,
    getDomainError: state.admin.getDomainError,
    addDomainError: state.admin.addDomainError,
    deleteDomainError: state.admin.deleteDomainError,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(CorporateDomain);
