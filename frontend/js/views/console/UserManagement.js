import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Col } from 'react-bootstrap';
import ManageUsers from '../../components/console/UserManagement/ManageUsers';
import TotalMembers from '../../components/console/UserManagement/TotalMembers';
import '../../components/console/UserManagement/index.scss';

function UserManagement() {
  return (
    <div>
      <Row className="mb-4">
        <Col md={12} className="page-header pl-5 mb-2">
          <h3>{I18n.t('console.sidebar.member_mngt')}</h3>
        </Col>
      </Row>
      <Row className="inner-main-component">
        <Col md={12} className="swap mb-4">
          <TotalMembers />
        </Col>
        <Col md={12} className=" ">
          <ManageUsers />
        </Col>
      </Row>
    </div>
  );
}

export default UserManagement;
