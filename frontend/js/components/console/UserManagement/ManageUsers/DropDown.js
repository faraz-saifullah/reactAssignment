/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

function DropdownPage({
  showPageSelect,
  pageSize,
  changePageSize,
  togglePageSelected,
}) {
  const pages = [10, 20, 50, 100];
  return (
    <div className="dropdown-table-per-row">
      <div className="dropdown-table-item" onClick={() => togglePageSelected()}>
        <span>{I18n.t('console.add_member.show')} </span>
        <span className="blue-color">{pageSize} </span>
        <span>{I18n.t('console.add_member.entry')}</span>
        <i className="fas fa-chevron-down" />
        {showPageSelect ? (
          <div className="dropdown-table-page-select">
            {pages.map(d => (
              <div key={d}>
                <Button
                  variant="link"
                  className="dropdown-table-page-row text-left"
                  onClick={() => changePageSize(d)}
                >
                  {d} {I18n.t('console.add_member.entry')}
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

DropdownPage.propTypes = {
  changePageSize: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  showPageSelect: PropTypes.any.isRequired,
  togglePageSelected: PropTypes.func.isRequired,
};

export default DropdownPage;
