/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

function DownloadDropDown({
  showDownloadSelect,
  downloadType,
  changeDownloadType,
  toggleDownloadOptions,
}) {
  const pages = ['PDF', 'CSV'];
  return (
    <div className="dropdown-table-per-row">
      <div
        className="dropdown-table-item"
        onClick={() => toggleDownloadOptions()}
      >
        <span>{I18n.t('console.user_mngt.download')} </span>
        <span className="blue-color">{downloadType} </span>
        <i className="fas fa-chevron-down" />
        {showDownloadSelect ? (
          <div className="download-table-page-select">
            {pages.map(d => (
              // <div key={d}>
              <Button
                key={d}
                variant="link"
                className="dropwdown-table-page-row"
                block
                onClick={() => changeDownloadType(d)}
              >
                {d}
              </Button>
              // </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

DownloadDropDown.propTypes = {
  changeDownloadType: PropTypes.func.isRequired,
  downloadType: PropTypes.string.isRequired,
  showDownloadSelect: PropTypes.any.isRequired,
  toggleDownloadOptions: PropTypes.func.isRequired,
};

export default DownloadDropDown;
