/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';

function Tab(props) {
  const { isActive, handleClick, data } = props;
  return (
    <li
      onClick={handleClick}
      className={isActive ? 'active' : null}
    >
      <div className="auth-label" >{data.label}</div>
    </li>
  );
}

Tab.propTypes = {
  data: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

export default Tab;
