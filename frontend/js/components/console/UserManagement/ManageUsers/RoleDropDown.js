import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { updateRole } from '../../../../actions/admin';

class RoleDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      role: '',
    };
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  changeRoleModal = async () => {
    const { dispatch, id, pageSize, number } = this.props;
    const { role } = this.state;
    const user_object = {
      accounts: [
        {
          authorities: [`${role}`],
          id,
        },
      ],
    };
    await dispatch(updateRole(user_object, pageSize, number));
    this.setState({
      show: !this.state.show,
    });
  };

  showModal = role => {
    this.setState({
      role,
      show: !this.state.show,
    });
  };

  render() {
    const roles = [
      {
        label: I18n.t('console.user_mngt.member'),
        value: 'ROLE_USER',
      },
      {
        label: I18n.t('console.user_mngt.admin'),
        value: 'ROLE_ADMIN',
      },
      {
        label: I18n.t('console.user_mngt.super_admin'),
        value: 'ROLE_SUPER_ADMIN',
      },
    ];
    const {
      showRoleSelect,
      toggleRoleSelected,
      id,
      name,
      accountRole,
    } = this.props;
    return accountRole === 'ROLE_SUPER_ADMIN' ? (
      <div className="dropdown-table-per-row">
        <div
          className="dropdown-table-item"
          onClick={() => toggleRoleSelected()}
        >
          {this.props.children}
          <Button
            size="sm"
            className="font-12 text-center edit-role-btn"
            variant="outline-primary"
          >
            {I18n.t('console.user_mngt.edit')}
            <i className="fas fa-chevron-down" />
          </Button>
          {showRoleSelect && (
            <div className="role-table-page-select">
              {roles.map(role => (
                <div key={role.label}>
                  <Button
                    variant="link"
                    className="role-table-page-row text-left"
                    onClick={() => this.showModal(role.value)}
                  >
                    {role.label}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Modal
            size="lg"
            centered
            show={this.state.show}
            onHide={this.showModal}
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <p>
                {I18n.t('console.user_mngt.change_name_before')} {name}
                {I18n.t('console.user_mngt.change_name_after')}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="link"
                className="text-uppercase"
                onClick={this.showModal}
              >
                {I18n.t('console.user_mngt.cancel')}
              </Button>
              <Button
                variant="primary"
                className="text-uppercase"
                onClick={() => this.changeRoleModal()}
              >
                {I18n.t('console.user_mngt.confirm')}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    ) : (
      <div>{this.props.children}</div>
    );
  }
}

RoleDropDown.propTypes = {
  accountRole: PropTypes.string,
  children: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  lang: PropTypes.string,
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  showRoleSelect: PropTypes.any.isRequired,
  toggleRoleSelected: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleDropDown);
