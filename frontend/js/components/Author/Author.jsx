import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Row, Col } from 'react-bootstrap';

import './Author.scss';

import { fetchAccountProfile } from '../../actions/profile';

class Author extends React.Component {
  componentDidMount() {
    const { dispatch, accountInfoLoaded } = this.props;

    if (!accountInfoLoaded) {
      dispatch(fetchAccountProfile());
    }
  }

  render() {
    const { userAccountInfo, accountInfoLoaded } = this.props;
    if (accountInfoLoaded) {
      return (
        <Row className="author-wrapper justify-content-right">
          <Col className="usertext d-inline-block">
            <h5 className="text-right">{userAccountInfo.fullName}</h5>
            <p className="text-right">
              {userAccountInfo.authorities &&
              userAccountInfo.authorities[0] === 'ROLE_USER'
                ? I18n.t('ideas.view.user')
                : I18n.t('ideas.view.admin')}
            </p>
          </Col>
          <Col>
            <img
              className="d-inline-block userimg rounded-circle border"
              src={userAccountInfo.profilePictureURL}
              alt="profile-picture"
            />
          </Col>
        </Row>
      );
    }

    return <div className="author-wrapper" />;
  }
}

Author.propTypes = {
  accountInfoLoaded: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  userAccountInfo: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    userAccountInfo: state.profile.userAccountInfo,
    accountInfoLoaded: state.profile.accountInfoLoaded,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const connectedAuthor = connect(mapStateToProps, mapDispatchToProps)(Author);
export { connectedAuthor as Author };
