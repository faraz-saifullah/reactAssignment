import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';
import RoleDropDown from './RoleDropDown';

class TableRow extends React.Component {
  constructor() {
    super();
    this.state = {
      showRoleSelect: false,
    };
  }

  getRole(role_name) {
    const roles = {
      ROLE_USER: {
        roleName: I18n.t('console.user_mngt.member'),
        className: 'role-btn member-btn',
      },
      ROLE_ADMIN: {
        roleName: I18n.t('console.user_mngt.admin'),
        className: 'role-btn admin-btn',
      },
      ROLE_SUPER_ADMIN: {
        roleName: I18n.t('console.user_mngt.super_admin'),
        className: 'role-btn super-admin-btn',
      },
    };
    return roles[`${role_name}`] || {};
  }
  toggleRoleSelected = () => {
    this.setState({ showRoleSelect: !this.state.showRoleSelect });
  };

  render() {
    const {
      selected,
      email,
      index,
      name,
      role,
      number,
      pageSize,
      accountRole,
    } = this.props;
    const { className, roleName } = this.getRole(role);
    return (
      <tr className={selected ? 'active' : ''}>
        <td>
          <Form.Check
            type="checkbox"
            id={`defaultUnchecked${index}`}
            className="checkbox-style"
            checked={selected}
            onChange={() => this.props.selectRow(index)}
          />
        </td>
        <td>{name}</td>
        <td>{email}</td>
        <td>
          <Row className="ml-0">
            <RoleDropDown
              showRoleSelect={this.state.showRoleSelect}
              toggleRoleSelected={this.toggleRoleSelected}
              id={index}
              name={name}
              number={number}
              pageSize={pageSize}
              accountRole={accountRole || ''}
            >
              {accountRole === 'ROLE_SUPER_ADMIN' ? (
                <Button
                  size="sm"
                  className={`font-12 ${className}`}
                  variant="outline-primary"
                >
                  {roleName}
                </Button>
              ) : (
                <Button
                  size="sm"
                  className={`font-12 ${className} border-enabled`}
                  variant="outline-primary"
                >
                  {roleName}
                </Button>
              )}
            </RoleDropDown>
          </Row>
        </td>
        <td>
          {accountRole === 'ROLE_SUPER_ADMIN' ? (
            <Button
              size="sm"
              variant="outline-primary"
              className="text-uppercase action-btn font-12"
              onClick={() => this.props.delete(index, name)}
            >
              {I18n.t('console.user_mngt.delete')}
            </Button>
          ) : (
            <div />
          )}
        </td>
      </tr>
    );
  }
}

TableRow.propTypes = {
  accountRole: PropTypes.string,
  delete: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  index: PropTypes.number,
  name: PropTypes.string,
  number: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  selectRow: PropTypes.func.isRequired,
};
export default TableRow;
