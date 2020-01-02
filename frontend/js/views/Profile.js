import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { logoutUser } from '../actions/auth';
import {
  editProfile,
  fetchAccountProfile,
  showChangePasswordModal,
  updateProfile,
  uploadProfilePicture
} from '../actions/profile';
import CardView from '../components/IdeaCards/CardView';
import ChangePasswordModal from '../components/ChangePasswordModal/ChangePasswordModal';
import IdeaViewModal from '../components/IdeaViewModal/IdeaViewModal';
import EditIdeaModal from '../components/EditIdeaModal/EditIdeaModal';
import { selectIdeaForView } from '../actions/ideas';
import { validateEmail } from './../utils';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: this.getDefaultError(),
      isSelected: -1,
      selectedIdea: {},
      showAvatarOverlay: false,
    };
  }

  componentWillMount() {
    const { dispatch, accountInfoLoaded } = this.props;
    if (!accountInfoLoaded) {
      dispatch(fetchAccountProfile());
    }
    dispatch(editProfile(false));
  }

  getDefaultError = () => ({
    message: '',
    details: {
      email: '',
      fullName: '',
    },
  });

  fileInput = null;

  setFileInputRef = element => {
    this.fileInput = element;
  };

  openFileDialog = () => {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };

  onFileSelected = e => {
    const { dispatch } = this.props;

    const fd = new FormData();
    fd.append('file', e.target.files[0]);

    dispatch(uploadProfilePicture(fd));
  };

  handleLogout = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    dispatch(logoutUser());
  };

  onEditProfileClick = e => {
    const { dispatch } = this.props;
    e.preventDefault();

    dispatch(editProfile(true));
  };

  onChangePasswordClick = e => {
    const { dispatch } = this.props;
    e.preventDefault();

    dispatch(showChangePasswordModal(true));
    dispatch(editProfile(false));
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  selectIdea = (idea, key) => {
    const { dispatch } = this.props;
    dispatch(selectIdeaForView(idea));
    this.setState({ selectedIdea: idea, isSelected: key });
  };

  hideEdit = () => {
    const { dispatch } = this.props;
    dispatch(fetchAccountProfile());
    this.setState({
      selectedIdea: {},
      isEdit: false,
    });
  };

  hideIdeaView = () => {
    const { dispatch } = this.props;
    dispatch(fetchAccountProfile());
    this.setState({
      selectedIdea: {},
      isSelected: -1,
    });
  };

  showEdit = (idea) => {
    this.setState({
      isEdit: true,
      isSelected: -1,
    });
  };

  changeLanguage = e => {
    const language = e.currentTarget.value;
    Cookie.set('lang', language, { sameSite: 'none' }, { secure: true });
    const { dispatch, userAccountInfo } = this.props;
    userAccountInfo.lang = language;
    dispatch(setLocale(language));
    document.title = I18n.t('pagetitle');
  };

  onSubmit = e => {
    const { dispatch, userAccountInfo } = this.props;
    e.preventDefault();
    const { fullName, email } = e.target.elements;
    const data = {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
    };
    const error = this.getDefaultError();
    if (data.fullName.length < 1 || data.fullName.length > 50) {
      error.details.fullName = I18n.t('auth.error.missingName');
    }

    if (!validateEmail(data.email)) {
      error.details.email = I18n.t('auth.error.invalidEmail');
    } else if (data.email.length < 1) {
      error.details.email += I18n.t('auth.error.missingEmail');
    }
    this.setState({ errorMessage: error });
    if (!_.isEqual(this.getDefaultError(), error)) {
      return;
    }

    if (
      userAccountInfo.fullName !== this.state.fullName ||
      userAccountInfo.email !== this.state.email
    ) {
      dispatch(updateProfile(data, userAccountInfo.email !== data.email));
    } else {
      dispatch(editProfile(false));
    }
  };

  toggleAvatarText = showAvatarOverlay => {
    this.setState({ showAvatarOverlay });
  };

  getProfileContent = () => {
    const {
      userAccountInfo,
      accountInfoLoaded,
      editingProfile,
      showChangePasswordModalVal,
      lang,
    } = this.props;

    const { showAvatarOverlay, errorMessage } = this.state;
    if (!accountInfoLoaded) {
      return (<div />);
    }

    return (
      <Card>
        <Card.Body>
          <Row className="justify-content-center">
            <Col
              md={12}
              className="text-center"
            >
              <div
                tabIndex="0"
                role="button"
                onKeyPress={this.openFileDialog}
                className="user-avatar"
                onMouseEnter={() => this.toggleAvatarText(true)}
                onMouseLeave={() => this.toggleAvatarText(false)}
                onClick={this.openFileDialog}
              >
                <img
                  src={userAccountInfo.profilePictureURL}
                  alt="profile"
                  className="rounded-circle border"
                />
                {(!showChangePasswordModalVal &&
                  !editingProfile &&
                  errorMessage.message.length > 0) &&
                  (
                    <small className="form-text text-danger"> {errorMessage.message} </small>
                  )}
                {showAvatarOverlay && (
                  <div className="avatar-overlay">
                    {I18n.t('auth.profiles.changeAvatar')}
                  </div>
                )}
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={this.setFileInputRef}
                  accept="image/*"
                  onChange={this.onFileSelected}
                />
              </div>
            </Col>
            <Col md={12} className="user-details">
              {editingProfile ? (
                <Form onSubmit={this.onSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group controlId="formBasicName">
                        <Form.Label>{I18n.t('auth.profiles.fullName')}</Form.Label>
                        <Form.Control
                          isInvalid={!!errorMessage.details.fullName}
                          type="text"
                          defaultValue={userAccountInfo.fullName}
                          name="fullName"
                          placeholder="John Doe"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errorMessage.details.fullName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>{I18n.t('auth.email')}</Form.Label>
                        <Form.Control
                          isInvalid={!!errorMessage.details.email}
                          type="email"
                          defaultValue={userAccountInfo.email}
                          name="email"
                          placeholder="johndoe@mail.com"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {errorMessage.details.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12} className="text-center">
                      {editingProfile &&
                        errorMessage.message.length > 0 &&
                        Object.keys(errorMessage.details).length === 0 &&
                        (
                          <small className="form-text text-danger">
                            {errorMessage.message}
                          </small>
                        )}
                    </Col>
                    <Col md={12} className="text-center mt-3">
                      <Button
                        variant="primary"
                        className="text-uppercase font-12 action-btn"
                        type="submit"
                      >
                        {I18n.t('ideas.my.saveChange')}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ) :
                (
                  <Row className="align-items-center">
                    <Col md={8} xs={8} className="label">{I18n.t('auth.profiles.fullName')}</Col>
                    <Col md={4} xs={4} className="label">
                      <Button
                        variant="link"
                        onClick={this.onEditProfileClick}
                        className="pull-right font-12 action-btn"
                      >
                        {I18n.t('auth.profiles.editProfile')}
                      </Button>
                    </Col>
                    <Col md={12} className="clearfix" />
                    <Col md={12}>{userAccountInfo.fullName}</Col>
                    <Col md={12} className="label mt-2">{I18n.t('auth.profiles.email')}</Col>
                    <Col md={12}>{userAccountInfo.email}</Col>
                  </Row>
                )}
            </Col>
            <Col md={12}><hr /></Col>
            <Col md={12}>
              <span className="label">
                <Button
                  variant="link"
                  className="font-12 action-btn pl-0"
                  onClick={this.onChangePasswordClick}
                >
                  {I18n.t('auth.profiles.changePass')}
                </Button>
              </span>
            </Col>
            <Col md={12}><hr /></Col>
            <Col md={12}>
              <span className="label">
                <Button
                  variant="link"
                  className="font-12 action-btn pl-0"
                >
                  {I18n.t('selLang')}
                </Button>
                <select className="default-language" onChange={this.changeLanguage} value={lang}>
                  <option value="en">English</option>
                  <option value="zh_CN">简体中文</option>
                  <option value="zh_TW">繁體中文</option>
                </select>
              </span>
            </Col>
            <Col md={12}><hr /></Col>
            <Col md={12}>
              <span className="label">
                <Button
                  variant="link"
                  className="font-12 action-btn pl-0"
                  onClick={this.handleLogout}
                >
                  {I18n.t('auth.profiles.logout')}
                </Button>
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }

  getIdeaContent = () => {
    const {
      likedIdeasArr,
      accountInfoLoaded,
    } = this.props;
    if (!accountInfoLoaded) {
      return <div />;
    }
    return (
      <Row>
        <Col md={12}>
          <h5>{I18n.t('auth.profiles.recentLike')}</h5>
        </Col>
        <Col md={12}>
          <Row className="mt-3">
            {likedIdeasArr.map((idea, key) => (
              <Col md={6} sm={12} key={idea.id}>
                <CardView
                  idea={idea}
                  showIdea={() => this.selectIdea(idea, key)}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    );
  }

  render() {
    const { showChangePasswordModalVal } = this.props;

    return (
      <Row className="mb-4">
        <Col md={12} className="page-header pl-5 mb-2">
          <h3>{I18n.t('auth.profile')}</h3>
        </Col>
        <Col md={12} className="swap inner-main-component">
          {this.state.isSelected > -1 ? (
            <IdeaViewModal
              idea={this.state.selectedIdea}
              onHideIdea={this.hideIdeaView}
              showEdit={this.showEdit}
            />
          ) :
            (
              <Row>
                <Col md={5} className="user-profile mt-3">
                  {this.getProfileContent()}
                </Col>
                <Col md={7} className="mt-3">
                  {this.getIdeaContent()}
                </Col>
              </Row>
            )}
        </Col>
        <ChangePasswordModal show={showChangePasswordModalVal} />
        {this.state.isEdit && (
          <EditIdeaModal show={true} handleClose={this.hideEdit} />
        )}
      </Row>
    );
  }
}

Profile.propTypes = {
  accountInfoLoaded: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  editingProfile: PropTypes.bool.isRequired,
  errorMessage: PropTypes.object.isRequired,
  lang: PropTypes.string,
  likedIdeasArr: PropTypes.array.isRequired,
  showChangePasswordModalVal: PropTypes.bool.isRequired,
  userAccountInfo: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    likedIdeasArr: state.profile.likedIdeasArr,
    userAccountInfo: state.profile.userAccountInfo,
    accountInfoLoaded: state.profile.accountInfoLoaded,
    editingProfile: state.profile.editingProfile,
    errorMessage: state.profile.profileErrors,
    showChangePasswordModalVal: state.profile.showChangePasswordModal,
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
