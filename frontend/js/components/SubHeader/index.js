import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Author } from '../../components/Author';
import { TrialDuration } from '../../components/TrialDuration';

function SubHeader({ toggleSidebar }) {
  return (
    <Row className="align-items-center pt-3 pb-3 sub-header">
      <Col md={{ span: 1, order: 1 }} xs={{ span: 2, order: 1 }}>
        <Button variant="link" className="mr-1" onClick={toggleSidebar}>
          <i className="fas fa-align-justify" />
        </Button>
      </Col>
      <Col md={{ span: 3, order: 2 }} xs={{ span: 12, order: 3 }}>
        <TrialDuration />
      </Col>
      <Col md={{ span: 4, offset: 4, order: 3 }} xs={{ span: 10, order: 2 }}>
        <Author />
      </Col>
    </Row>
  );
}

SubHeader.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default SubHeader;
