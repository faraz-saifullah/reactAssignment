import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import PrintRow from './PrintRow';

class PrintComponent extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div style={{ margin: '20px' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, key) => (
              <PrintRow
                key={user.email}
                name={user.fullName}
                email={user.email}
                role={user.authorities ? user.authorities[0] : ''}
              />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

PrintComponent.propTypes = {
  data: PropTypes.any.isRequired,
};

export default PrintComponent;
