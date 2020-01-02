import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { I18n, setLocale } from 'react-redux-i18n';
import Cookie from 'js-cookie';
import { Col, Row } from 'react-bootstrap';
import Tabs from './Tabs';
import Content from './Content';
import { setActiveTab } from '../../actions/auth';
import './auth.scss';

class Auth extends Component {
  constructor() {
    super();
    this.state = {
      tabData: [
        { name: 'Sign up', isActive: false, label: I18n.t('auth.signup') },
        { name: 'Login', isActive: true, label: I18n.t('auth.login') },
      ],
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { inviteString } = match.params;
    const param = new URLSearchParams(this.props.location.search);
    const email = param.get('e');
    if (inviteString) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ inviteString, email });
      dispatch(setActiveTab(this.state.tabData[0]));
    } else {
      dispatch(setActiveTab(this.state.tabData[1]));
    }
  }

  handleClick = tab => {
    const { dispatch } = this.props;
    dispatch(setActiveTab(tab));
  };

  changeLanguage = e => {
    const language = e.currentTarget.value;
    Cookie.set('lang', language);
    const { dispatch } = this.props;
    dispatch(setLocale(language));
    document.title = I18n.t('pagetitle');
  };

  render() {
    const { activeTab, lang } = this.props;
    const { tabData, inviteString, email } = this.state;
    tabData[0].label = I18n.t('auth.signup');
    tabData[1].label = I18n.t('auth.login');
    return (
      <div>
        <div className="auth-header">
          <select className="lang-select" onChange={this.changeLanguage} value={lang}>
            <option value="en">English</option>
            <option value="zh_CN">简体中文</option>
            <option value="zh_TW">繁體中文</option>
          </select>
        </div>
        <Row className="justify-content-center pl-4 pr-4">
          <Col md={6} className="main-box">
            <Tabs
              activeTab={activeTab}
              changeTab={this.handleClick}
              tabData={tabData}
            />
            <Content
              activeTab={activeTab}
              inviteString={inviteString}
              email={email}
              tabData={tabData}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

Auth.propTypes = {
  activeTab: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
  location: PropTypes.object,
  match: PropTypes.object,
};

function mapStateToProps(state) {
  return { activeTab: state.auth.activeTab, lang: state.i18n.locale };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
