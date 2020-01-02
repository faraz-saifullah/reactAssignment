import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Col } from 'react-bootstrap';
import ColorSettings from '../../components/console/CorporateSettings/ColorSettings/index';
import LogoType from '../../components/console/CorporateSettings/LogoType/index';
import Title from '../../components/console/CorporateSettings/Title/index';
import Favicon from '../../components/console/CorporateSettings/Favicon/index';
import '../../components/console/CorporateSettings/index.scss';

function CorporateSettings() {
  return (
    <Row className="mb-4">
      <Col md={12} className="page-header pl-5 mb-2">
        <h3>{I18n.t('console.sidebar.corporate_setting')}</h3>
      </Col>
      <Col md={12} className="swap inner-main-component">
        <Row>
          <Col md={6} className="mt-3">
            <LogoType />
            <Favicon />
          </Col>
          <Col md={6} className="mt-3">
            <ColorSettings />
            <Title />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default CorporateSettings;
