/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function DropdownPage({
  showPageSelect, pageSize, changePageSize, togglePageSelected,
}) {
  const pages = [10, 20, 50, 100];
  return (
    <div className="invite-table-per-row">
      <div
        role="button"
        tabIndex="0"
        className="invite-table-item"
        onClick={togglePageSelected}
      >
        <span>{I18n.t('console.add_member.show')} </span>
        <span className="blue-color">{pageSize} </span>
        <span>{I18n.t('console.add_member.entry')}</span>
        <i className="fas fa-chevron-down" />
        {showPageSelect ? (
          <div className="invite-table-page-select">
            {pages.map(d => (
              <div key={d} >
                <Button
                  variant="link"
                  className="invite-table-page-row"
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
  changePageSize: PropTypes.func,
  pageSize: PropTypes.number,
  showPageSelect: PropTypes.bool,
  togglePageSelected: PropTypes.func,
};

export default DropdownPage;
