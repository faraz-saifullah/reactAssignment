import React from 'react';
import PropTypes from 'prop-types';

function Svg({ hexNumber }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM7 14L2 9.19231L3.4 7.84615L7 11.3077L14.6 4L16 5.34615L7 14Z"
        fill={`#${hexNumber || '000'}`}
      />
    </svg>
  );
}

Svg.propTypes = {
  hexNumber: PropTypes.string,
};

export default Svg;
