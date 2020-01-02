import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import ResendIcon from './../../../../../assets/images/icons/resend.svg';

class TableRow extends React.Component {
  render() {
    const { selected, email, date, index } = this.props;
    return (
      <tr className={selected ? 'active' : ''}>
        <td>
          <Form.Check
            type="checkbox"
            id={`defaultUnchecked${index}`}
            className="checkbox-style"
            checked={selected}
            onChange={() => this.props.selectRow(index)}
          />
        </td>
        <td>{email}</td>
        <td>{moment(date).format('DD.MM.YYYY')}</td>
        <td>
          <Button
            size="sm"
            variant="link"
            onClick={() => this.props.resend(index)}
          >
            <img src={ResendIcon} alt="resend" />
            &nbsp;
            {I18n.t('console.add_member.resend')}
          </Button>
        </td>
        <td>
          <Button
            size="sm"
            variant="outline-primary"
            className="text-uppercase light-gray-3-border revoke-btn"
            onClick={() => this.props.revoke(index)}
          >
            {I18n.t('console.add_member.revoke')}
          </Button>
        </td>
      </tr>
    );
  }
}

TableRow.propTypes = {
  date: PropTypes.number,
  email: PropTypes.string.isRequired,
  index: PropTypes.number,
  resend: PropTypes.func.isRequired,
  revoke: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  selectRow: PropTypes.func.isRequired,
};
export default TableRow;
