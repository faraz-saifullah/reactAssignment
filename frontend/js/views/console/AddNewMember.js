import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Col } from 'react-bootstrap';
import LinkInvite from '../../components/console/AddNewMember/LinkInvite/index';
import SendInvite from '../../components/console/AddNewMember/SendInvite/index';
import CorporateDomain from '../../components/console/AddNewMember/CorporateDomain';
import history from '../../history';
import '../../components/console/AddNewMember/index.scss';

function AddNewMember() {

  const toggleManageInvite = () => {
    history.push('/manage-invites');
  };

  return (
    <Row className="mb-4">
      <Col md={12} className="page-header pl-5 mb-2">
        <h3>{I18n.t('console.sidebar.add_member')}</h3>
      </Col>
      <Col md={12} className="swap inner-main-component">
        <Row>
          <Col md={4} className="mt-2">
            <LinkInvite />
          </Col>
          <Col md={4} className="mt-2">
            <SendInvite show={toggleManageInvite} />
          </Col>
          <Col md={4} className="mt-2">
            <CorporateDomain />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default AddNewMember;
