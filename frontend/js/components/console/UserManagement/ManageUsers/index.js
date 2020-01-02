import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
  Table,
  Form
} from 'react-bootstrap';
import { I18n, setLocale } from 'react-redux-i18n';
import CopyToClipboard from 'react-copy-to-clipboard';
import jsPDF from 'jspdf';
import ReactToPrint from 'react-to-print';
import { CSVLink } from 'react-csv';
import 'jspdf-autotable';
import TableRow from './tableRow';
import {
  getUsers,
  deleteUsers,
  getMemberCount
} from '../../../../actions/admin';
import DropdownPage from './DropDown';
import ConfirmDeleteModal from '../common/confirmDelete';
import PrintComponent from './PrintComponent';
import downloadImage from '../../../../../assets/images/icons/download.svg';
import copyImage from '../../../../../assets/images/icons/copy.svg';
import printImage from '../../../../../assets/images/icons/print.svg';
import DownloadDropDown from './DownloadDropDown';
import { fetchAccountProfile } from '../../../../actions/profile';
import { toast } from 'react-toastify';

class ManageUsers extends React.Component {
  constructor() {
    super();
    this.state = {
      searchString: '',
      selectedRows: [],
      deleteMembers: [],
      showPageSelect: false,
      downloadType: 'PDF',
      showDownloadSelect: false,
      pageSize: 10,
      isDelete: false,
      data: [],
      headers: [],
      nameToDelete: '',
    };
  }
  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(fetchAccountProfile());
    dispatch(setLocale(lang));
    dispatch(getUsers(10, 0));
    dispatch(getMemberCount());
  }

  onChangeCustom = e => {
    this.setState({ searchString: e.target.value });
    const { pageSize } = this.state;
    const { dispatch } = this.props;
    if (e.target.value.trim().length > 0) {
      dispatch(getUsers(pageSize, 0, e.target.value));
    } else {
      dispatch(getUsers(pageSize, 0));
    }
    this.setState({
      selectedRows: [],
      isDelete: false,
      deleteMembers: [],
    });
  };

  goToPage = number => {
    const { pageSize, searchString } = this.state;
    const { dispatch, totalPages } = this.props;
    if (number > -1 && totalPages > number) {
      dispatch(getUsers(pageSize, number, searchString));
      this.setState({
        selectedRows: [],
        isDelete: false,
        deleteMembers: [],
      });
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
    const { users } = this.props;
    if (selectedRows.length < users.content.length) {
      selectedRows = [];
      users.content.forEach(d => {
        selectedRows.push(d.id);
      });
    } else {
      selectedRows = [];
    }
    this.setState({ selectedRows });
  };

  copySelected = () => {
    const { selectedRows } = this.state;
    const { users } = this.props;
    let newUsers = users.content.filter(row => selectedRows.includes(row.id));
    if (!newUsers.length) {
      newUsers = users.content;
    }
    let copiedData = '';
    newUsers.map(row => {
      const { fullName, email, authorities } = row;
      copiedData += `Name: ${fullName}, Email: ${email}, Role: ${authorities[0]}\n`;
      return {
        Name: fullName,
        Email: email,
        Role: authorities[0],
      };
    });
    return copiedData;
  };

  copyClicked = () => {
    toast.info(I18n.t('console.user_mngt.copied'));
  };

  deleteSelected = () => {
    const { deleteMembers, pageSize } = this.state;
    const { users, dispatch, number } = this.props;
    const newUsers = users.content.filter(row =>
      deleteMembers.includes(row.id));
    newUsers.map(newUser => {
      newUser.enabled = false;
      return newUser;
    });
    dispatch(deleteUsers({ accounts: newUsers }, pageSize, number));
    this.setState({ selectedRows: [], isDelete: false, deleteMembers: [] });
  };

  printSelected = () => {
    const { selectedRows } = this.state;
    const { users } = this.props;
    let newUsers = users.content.filter(row => selectedRows.includes(row.id));
    if (!newUsers.length) {
      newUsers = users.content;
    }
    return newUsers;
  };

  csvSelected = () => {
    const { selectedRows } = this.state;
    let { headers, data } = this.state;
    const { users } = this.props;
    let newUsers = users.content.filter(row => selectedRows.includes(row.id));
    if (!newUsers.length) {
      newUsers = users.content;
    }
    data = newUsers;
    headers = [
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Role', key: 'role' },
    ];
    const csvData = data.map(row => {
      const { fullName, email, authorities } = row;
      return {
        name: fullName,
        email,
        role: authorities[0],
      };
    });
    this.setState({ headers, data: csvData });
  };

  pdfSelected = () => {
    const { selectedRows } = this.state;
    const { users } = this.props;
    let newUsers = users.content.filter(row => selectedRows.includes(row.id));
    if (!newUsers.length) {
      newUsers = users.content;
    }
    const doc = new jsPDF();
    const pdfData = [];
    newUsers.map(row => {
      const { fullName, email, authorities } = row;
      return pdfData.push([fullName, email, authorities[0]]);
    });
    doc.autoTable({
      head: [['Name', 'Email', 'Role']],
      body: pdfData,
    });

    doc.save('users.pdf');
  };

  changePageSize = amount => {
    let { pageSize, searchString } = this.state;
    if (amount === pageSize) {
      return;
    }
    pageSize = amount;
    this.setState({
      pageSize,
      selectedRows: [],
      isDelete: false,
      deleteMembers: [],
    });
    const { dispatch } = this.props;
    dispatch(getUsers(pageSize, 0, searchString));
  };

  showDeleteOne = (key, name) => {
    this.setState({
      deleteMembers: [key],
      isDelete: true,
      nameToDelete: name,
    });
  };

  showDeleteSelected = deleteMembers => {
    if (deleteMembers.length) {
      this.setState({ isDelete: true, deleteMembers });
    }
  };

  hideDelete = () => {
    this.setState({ deleteMembers: [], isDelete: false, nameToDelete: '' });
  };

  togglePageSelected = () => {
    this.setState({ showPageSelect: !this.state.showPageSelect });
  };

  toggleDownloadOptions = () => {
    this.setState({ showDownloadSelect: !this.state.showDownloadSelect });
  };

  changeDownloadType = type => {
    this.setState({ downloadType: type });
  };

  render() {
    const {
      totalPages, number, users, content, userAccountInfo,
    } = this.props;
    const {
      searchString,
      selectedRows,
      showPageSelect,
      pageSize,
      isDelete,
      downloadType,
      showDownloadSelect,
      nameToDelete,
    } = this.state;
    const accountRole =
      userAccountInfo && userAccountInfo.authorities
        ? userAccountInfo.authorities[0]
        : '';
    return (
      <div>
        <Row className="justify-content-md-top filter-component">
          <Col md={3}>
            <DropdownPage
              showPageSelect={showPageSelect}
              pageSize={pageSize}
              changePageSize={this.changePageSize}
              togglePageSelected={this.togglePageSelected}
            />
          </Col>
          <Col md={5} className="bg-white br-3">
            <span className="action-bar ">
              <CopyToClipboard text={this.copySelected()}>
                <Button
                  variant="link"
                  onClick={this.copyClicked}
                  disabled={!users.content.length}
                >
                  <img src={copyImage} alt="copy" />
                </Button>
              </CopyToClipboard>
              <ReactToPrint
                trigger={() => (
                  <Button disabled={!users.content.length} variant="link">
                    <img src={printImage} alt="print" />
                  </Button>
                )}
                content={() => this.componentRef}
              />
              <div style={{ display: 'none' }}>
                <PrintComponent
                  data={this.printSelected()}
                  ref={el => (this.componentRef = el)}
                  bodyClass="print-table"
                />
              </div>
              {downloadType === 'CSV' ? (
                <CSVLink
                  onClick={this.csvSelected}
                  headers={this.state.headers}
                  data={this.state.data}
                  filename="users.csv"
                  target="_blank"
                >
                  <Button disabled={!users.content.length} variant="link">
                    <img src={downloadImage} alt="download" />
                  </Button>
                </CSVLink>
              ) : (
                  <Button
                    disabled={!users.content.length}
                    variant="link"
                    onClick={this.pdfSelected}
                  >
                    <img src={downloadImage} alt="download" />
                  </Button>
                )}
              <div>
                <DownloadDropDown
                  showDownloadSelect={showDownloadSelect}
                  downloadType={downloadType}
                  changeDownloadType={this.changeDownloadType}
                  toggleDownloadOptions={this.toggleDownloadOptions}
                />
              </div>
            </span>
          </Col>
          <Col className="pull-right" md={4}>
            <InputGroup className="search-box">
              <InputGroup.Prepend>
                <InputGroup.Text className="search-icon-button">
                  <i className="fas fa-search" />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={searchString}
                onChange={this.onChangeCustom}
                placeholder={I18n.t('console.user_mngt.search_placeholder')}
                aria-label={I18n.t('console.user_mngt.search_placeholder')}
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
                        selectedRows.length === users.content.length &&
                        users.content.length
                      }
                      onChange={this.selectAll}
                    />
                  </th>
                  <th> {I18n.t('console.user_mngt.name')}</th>
                  <th> {I18n.t('console.user_mngt.email')}</th>
                  <th>{I18n.t('console.user_mngt.role')}</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {content.map((user, key) => (
                  <TableRow
                    name={user.fullName}
                    email={user.email}
                    role={user.authorities ? user.authorities[0] : ''}
                    selected={
                      !!(selectedRows.length && selectedRows.includes(user.id))
                    }
                    key={user.id}
                    index={user.id}
                    selectRow={this.selectRow}
                    delete={this.showDeleteOne}
                    number={this.props.number}
                    pageSize={this.state.pageSize}
                    accountRole={accountRole || ''}
                  />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        {totalPages > 0 ?
          (
            <div>
              <Row
                className={
                  selectedRows.length ? 'visible mt-4' : 'invisible mt-4'
                }
              >
                <Col className="p-0">
                  {accountRole === 'ROLE_SUPER_ADMIN' ? (
                    <Button
                      variant="outline-primary"
                      className="text-uppercase pull-right action-btn font-12"
                      onClick={() => this.showDeleteSelected(selectedRows)}
                    >
                      {I18n.t('console.user_mngt.delete_sel')}
                    </Button>
                  ) :
                    (
                      <div />
                    )}
                </Col>
              </Row>
              <Row className="justify-content-md-center p-0 mt-4 pagination-footer">
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
                  <Button variant="link" disabled={true} className="page-numbers">
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
              </Row>
            </div>
          ) : (
            <div />
          )}
        {isDelete &&
          (
            <ConfirmDeleteModal
              hideDelete={this.hideDelete}
              onDelete={this.deleteSelected}
            >
              {nameToDelete ? (
                <p>
                  {I18n.t('console.user_mngt.sure_delete', {
                    name: `${nameToDelete}`,
                  })}
                </p>
              ) :
                (
                  <p>{I18n.t('console.user_mngt.sure_delete_all')}</p>
                )}
            </ConfirmDeleteModal>
          )}
      </div>
    );
  }
}

ManageUsers.propTypes = {
  content: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
  number: PropTypes.number,
  roles: PropTypes.array,
  totalElements: PropTypes.number,
  totalPages: PropTypes.number,
  userAccountInfo: PropTypes.object,
  users: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    content: state.admin.users.content,
    lang: state.i18n.locale,
    totalPages: state.admin.users.totalPages,
    number: state.admin.users.number,
    users: state.admin.users,
    totalElements: state.admin.users.totalElements,
    pageSize: state.admin.users.pageSize,
    userAccountInfo: state.profile.userAccountInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
