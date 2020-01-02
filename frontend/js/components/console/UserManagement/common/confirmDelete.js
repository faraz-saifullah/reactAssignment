import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';

function ConfirmDelete(props) {
  return (
    <Modal show={true} onHide={props.hideDelete} size="lg" centered>
      <Modal.Header closeButton>&nbsp;</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button
          size="sm"
          variant="link"
          className="btn cancel-btn text-uppercase"
          onClick={props.hideDelete}
        >
          {I18n.t('console.user_mngt.cancel')}
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={props.onDelete}
          className="text-uppercase"
        >
          {I18n.t('console.user_mngt.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmDelete.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  hideDelete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ConfirmDelete;
