import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
  Table,
  Form,
} from 'react-bootstrap';
import { I18n, setLocale } from 'react-redux-i18n';
import TableRow from './tableRow';
import {
  resendInvite,
  deleteInvite,
  getInvitedUsers,
} from '../../../../actions/admin';
import DropdownPage from './DropDown';
import ConfirmDeleteModal from '../common/confirmDelete';
import { toast } from 'react-toastify';

class ManageInvite extends React.Component {
  constructor() {
    super();
    this.state = {
      searchString: '',
      selectedRows: [],
      revokeInvites: [],
      showPageSelect: false,
      sorting: '',
      isDelete: false,
    };
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
    dispatch(getInvitedUsers(10, 0));
  }

  onChangeCustom = e => {
    this.setState({ searchString: e.target.value });
    const { sorting } = this.state;
    const { dispatch, pageSize } = this.props;
    if (e.target.value.trim().length > 0) {
      dispatch(getInvitedUsers(pageSize, 0, sorting, e.target.value));
    } else {
      dispatch(getInvitedUsers(pageSize, 0, sorting));
    }
    this.setState({ selectedRows: [], revokeInvites: [], isDelete: false });
  };

  goToPage = number => {
    const { sorting, searchString } = this.state;
    const { dispatch, totalPages, pageSize } = this.props;
    if (number > -1 && totalPages > number) {
      dispatch(getInvitedUsers(pageSize, number, sorting, searchString));
      this.setState({ selectedRows: [], revokeInvites: [], isDelete: false });
    }
  };

  selectRow = key => {
    const { selectedRows } = this.state;
    const index = selectedRows.indexOf(key);
    if (index > -1) {
      selectedRows.splice(index, 1);
    } else {
      selectedRows.push(key);
    }
    this.setState({ selectedRows });
  };

  selectAll = () => {
    let { selectedRows } = this.state;
    const { invitedUsers } = this.props;
    if (selectedRows.length < invitedUsers.content.length) {
      selectedRows = [];
      invitedUsers.content.forEach(d => {
        selectedRows.push(d.id);
      });
    } else {
      selectedRows = [];
    }
    this.setState({ selectedRows });
  };

  revokeSelected = () => {
    const { revokeInvites, sorting, searchString } = this.state;
    const { invitedUsers, dispatch, number, pageSize } = this.props;
    const newInvites = invitedUsers.content.filter(row =>
      revokeInvites.includes(row.id)
    );
    dispatch(
      deleteInvite(
        { users: newInvites },
        pageSize,
        number,
        sorting,
        searchString
      )
    );
    this.setState({ selectedRows: [], isDelete: false, revokeInvites: [] });
  };

  resendOne = key => {
    const { invitedUsers, dispatch } = this.props;
    const resendInvites = invitedUsers.content.filter(row => row.id === key);
    resendInvites.map(invite => {
      invite.resentEmail = true;
      return invite;
    });
    dispatch(resendInvite({ users: resendInvites }));
    toast.info(I18n.t('console.add_member.sent_invite'));
  };

  resendSelected = () => {
    const { selectedRows } = this.state;
    const { invitedUsers, dispatch } = this.props;
    const resendInvites = invitedUsers.content.filter(row =>
      selectedRows.includes(row.id)
    );
    resendInvites.map(invite => {
      invite.resentEmail = true;
      return invite;
    });
    dispatch(resendInvite({ users: resendInvites }));
    toast.info(I18n.t('console.add_member.sent_invite'));
  };

  changeSorting = () => {
    let { sorting } = this.state;
    const { pageSize } = this.props;
    sorting =
      sorting !== 'submittedAt,desc' ? 'submittedAt,desc' : 'submittedAt,asc';
    this.setState({
      sorting,
      selectedRows: [],
      revokeInvites: [],
      isDelete: false,
    });
    const { dispatch } = this.props;
    dispatch(getInvitedUsers(pageSize, 0, sorting));
  };

  changePageSize = amount => {
    const { sorting, searchString } = this.state;
    let { pageSize } = this.props;
    if (amount === pageSize) {
      return;
    }
    pageSize = amount;
    this.setState({ selectedRows: [], revokeInvites: [], isDelete: false });
    const { dispatch } = this.props;
    dispatch(getInvitedUsers(pageSize, 0, sorting, searchString));
  };

  showDeleteOne = key => {
    this.setState({ revokeInvites: [key], isDelete: true });
  };

  showDeleteSelected = revokeInvites => {
    if (revokeInvites.length) {
      this.setState({ isDelete: true, revokeInvites });
    }
  };

  hideDelete = () => {
    this.setState({ revokeInvites: [], isDelete: false });
  };

  togglePageSelected = () => {
    this.setState({ showPageSelect: !this.state.showPageSelect });
  };

  render() {
    const {
      totalPages,
      number,
      invitedUsers,
      isFetching,
      totalElements,
      pageSize,
    } = this.props;
    const {
      searchString,
      selectedRows,
      showPageSelect,
      sorting,
      isDelete,
    } = this.state;

    return (
      <Row className="justify-content-md-top">
        <Col md={12}>
          <div className="invite-back-header pt-3 pb-3">
            <Button
              variant="link-dark"
              className="font-12 color-main action-btn"
              onClick={this.props.hide}
            >
              <i className="fas fa-chevron-left" /> &nbsp;
              {I18n.t('ideas.modal.back')}
            </Button>
          </div>
        </Col>
        <Col md={12}>
          <Card border="light">
            <Card.Body>
              <h3>{I18n.t('console.add_member.manage_pending')}</h3>
              <Container className="manage-invitation-list">
                <Row className="filter-component">
                  <Col md={3}>
                    {totalElements} {I18n.t('console.add_member.total_invite')}
                  </Col>
                  <Col md={3}>
                    <DropdownPage
                      showPageSelect={showPageSelect}
                      pageSize={pageSize}
                      changePageSize={this.changePageSize}
                      togglePageSelected={this.togglePageSelected}
                    />
                  </Col>
                  <Col className="pull-right" md={{ span: 4, offset: 2 }}>
                    <InputGroup className="search-box">
                      <InputGroup.Prepend>
                        <InputGroup.Text className="search-icon-button">
                          <i className="fas fa-search" />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        value={searchString}
                        onChange={this.onChangeCustom}
                        placeholder={I18n.t('console.add_member.search_email')}
                        aria-label={I18n.t('console.add_member.search_email')}
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col className="custom-table">
                    <Table>
                      <thead>
                        <tr>
                          <th>
                            <Form.Check
                              type="checkbox"
                              id="defaultUnchecked1-1"
                              className="checkbox-style"
                              checked={
                                selectedRows.length &&
                                selectedRows.length ===
                                  invitedUsers.content.length
                              }
                              onChange={this.selectAll}
                            />
                          </th>
                          <th> {I18n.t('console.add_member.email1')}</th>
                          <th>
                            <div
                              className="sorting-field"
                              onClick={this.changeSorting}
                            >
                              <i
                                className={
                                  sorting === 'submittedAt,asc'
                                    ? 'fas fa-chevron-up marked'
                                    : 'fas fa-chevron-up'
                                }
                              />
                              <i
                                className={
                                  sorting === 'submittedAt,desc'
                                    ? 'fas fa-chevron-down marked'
                                    : 'fas fa-chevron-down'
                                }
                              />
                              {I18n.t('console.add_member.invite_date')}
                            </div>
                          </th>
                          <th>{I18n.t('console.add_member.resend_invite')}</th>
                          <th>&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invitedUsers.content.map((invite, key) => (
                          <TableRow
                            email={invite.email}
                            date={invite.submittedAt}
                            selected={
                              !!(
                                selectedRows.length &&
                                selectedRows.includes(invite.id)
                              )
                            }
                            key={invite.id}
                            index={invite.id}
                            selectRow={this.selectRow}
                            resend={this.resendOne}
                            revoke={this.showDeleteOne}
                          />
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                {totalPages > 0 ? (
                  <div>
                    <Row className="justify-content-md-end p-0 mt-2 ">
                      <Col lg={3} md={4} sm={6}>
                        <Button
                          variant="outline-primary"
                          disabled={!selectedRows.length}
                          className="action-btn text-uppercase font-12 pull-right"
                          onClick={() => this.resendSelected(selectedRows)}
                        >
                          {I18n.t('console.add_member.resend_selected')}
                        </Button>
                      </Col>
                      <Col lg={3} md={4} sm={6}>
                        <Button
                          variant="outline-primary"
                          disabled={!selectedRows.length}
                          className="action-btn text-uppercase font-12 pull-right"
                          onClick={() => this.showDeleteSelected(selectedRows)}
                        >
                          {I18n.t('console.add_member.revoke_selected')}
                        </Button>
                      </Col>
                    </Row>
                    <Row className="justify-content-md-center p-0 mt-2 pagination-footer">
                      <Col className="text-center">
                        <Button
                          variant="link"
                          disabled={!number}
                          onClick={() => this.goToPage(0)}
                        >
                          &lt;&lt;
                        </Button>
                        <Button
                          variant="link"
                          disabled={!number}
                          onClick={() => this.goToPage(number - 1)}
                        >
                          &lt;
                        </Button>
                        <Button
                          variant="link"
                          disabled={true}
                          className="page-numbers"
                        >
                          {number + 1} of {totalPages === 0 ? 1 : totalPages}
                        </Button>
                        <Button
                          variant="link"
                          disabled={number === totalPages - 1}
                          onClick={() => this.goToPage(number + 1)}
                        >
                          >
                        </Button>
                        <Button
                          variant="link"
                          disabled={number === totalPages - 1}
                          onClick={() => this.goToPage(totalPages - 1)}
                        >
                          >>
                        </Button>
                      </Col>
                      <Row />
                    </Row>{' '}
                  </div>
                ) : (
                  <Row />
                )}
              </Container>
            </Card.Body>
          </Card>
        </Col>
        {isDelete && (
          <ConfirmDeleteModal
            hideDelete={this.hideDelete}
            onDelete={this.revokeSelected}
          >
            <p>{I18n.t('console.add_member.revoke_invitation')}</p>
          </ConfirmDeleteModal>
        )}
      </Row>
    );
  }
}

ManageInvite.propTypes = {
  dispatch: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
  invitedUsers: PropTypes.object,
  isFetching: PropTypes.bool,
  lang: PropTypes.string,
  number: PropTypes.number,
  pageSize: PropTypes.number,
  totalElements: PropTypes.number,
  totalPages: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    totalPages: state.admin.invitedUsers.totalPages,
    number: state.admin.invitedUsers.number,
    invitedUsers: state.admin.invitedUsers,
    totalElements: state.admin.invitedUsers.totalElements,
    pageSize: state.admin.invitedUsers.pageSize,
    isFetching: state.admin.invitedUsers.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageInvite);
