import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';

function SampleEmailModal(props) {
  return (
    <Modal size="lg" show onHide={props.hideModal} className="">
      <Modal.Header closeButton>
        <h4>{I18n.t('console.corporate_settings.invitation_email_title')}</h4>
      </Modal.Header>
      <Modal.Body className="sample-email-bg">
        <div className="sample-email-preview-modal">
          <div className="p-4">
            {props.children}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

SampleEmailModal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default SampleEmailModal;
