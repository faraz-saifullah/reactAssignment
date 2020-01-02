import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'react-bootstrap';
import { getMemberCount } from '../../../../actions/admin';
import memberImage from '../../../../../assets/images/icons/member.svg';

class TotalMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
    dispatch(getMemberCount());
  }

  render() {
    const { totalMembers } = this.props;
    return (
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body className="p-2">
              <Row>
                <Col md={2}>
                  <div className="user-image-bg">
                    <img src={memberImage} alt="users" />
                  </div>
                </Col>
                <Col md="auto">
                  <div className="d-inline-block total-members">
                    {totalMembers || ''}
                  </div>
                  <div className="d-inline-block total-members-text ml-2">
                    {I18n.t('console.user_mngt.com_member')}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
}

TotalMembers.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
  totalMembers: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    totalMembers: state.admin.totalMembers,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalMembers);
