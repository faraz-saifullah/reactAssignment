import React from 'react';
import PropTypes from 'prop-types';

class PrintRow extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { email, name, role } = this.props;
    return (
      <tr>
        <td>{name}</td>
        <td>{email}</td>
        <td>{role}</td>
      </tr>
    );
  }
}

PrintRow.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string,
  role: PropTypes.string.isRequired,
};
export default PrintRow;
