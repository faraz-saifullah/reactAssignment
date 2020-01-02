import React from 'react';
import PropTypes from 'prop-types';

const Tag = ({ text }) => (
  <button className="btn btn-default hoverbtn btn-sm">
    {this.props.dollar}
    {text}
  </button>
);

export default Tag;

Tag.propTypes = {
  text: PropTypes.string,
};
