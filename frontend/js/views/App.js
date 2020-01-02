import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import mobile, { isMobile } from 'is-mobile';
import { setLocale } from 'react-redux-i18n';
import { Container } from 'react-bootstrap';
import { setRoleFromJwt } from '../actions/auth';
import SidebarLeft from '../components/SidebarLeft/SidebarLeft';
import SubHeader from '../components/SubHeader';
import Footer from '../components/Footer';
import history from '../history';

Modal.setAppElement('#root');

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentRoute: '/',
      sidebarOpen: !mobile(),
    };
  }

  componentWillMount() {
    const { lang, dispatch } = this.props;
    dispatch(setLocale(lang));
    history.listen((location, action) => {
      if (isMobile()) {
        this.setState({ sidebarOpen: false });
      }
      this.setState({ currentRoute: location.pathname });
    });
  }

  setTheme(colorPalette) {
    let cssKey = `--button-background-color`;
    let cssValue = `#${colorPalette.color1}`;
    document.body.style.setProperty(cssKey, cssValue);
    cssKey = `--sidebar-background-color`;
    cssValue = `#${colorPalette.color2}`;
    document.body.style.setProperty(cssKey, cssValue);
    cssKey = `--card-background-color`;
    cssValue = `#${colorPalette.color3}`;
    document.body.style.setProperty(cssKey, cssValue);
  };

  componentDidUpdate() {
    if (this.props && this.props.users && this.props.users.setting && this.props.users.setting.colorPalette) {
      this.setTheme(this.props.users.setting.colorPalette);
    }
  }

  toggleSidebar = () => {
    const { sidebarOpen } = this.state;
    this.setState({ sidebarOpen: !sidebarOpen });
  }

  render() {
    // eslint-disable-next-line object-curly-newline
    const { dispatch, isAuthenticated, role, routes } = this.props;
    const { sidebarOpen, currentRoute } = this.state;
    const { showSidebar } = routes.find(d => d.path === currentRoute) || {};

    if (isAuthenticated && role === 'ROLE_NONE') {
      dispatch(setRoleFromJwt());
    }
    if (showSidebar) {
      return (
        <div id="outer-container">
          <SidebarLeft route={currentRoute} sidebarOpen={sidebarOpen} />
          <main id="page-wrap">
            <Container fluid style={{ minHeight: '95vh' }}>
              <SubHeader toggleSidebar={this.toggleSidebar} />
              {this.props.children}
            </Container>
            <Footer />
          </main>
        </div>
      );
    }
    return (
      <div id="outer-container">
        <main id="page-wrap">
          <div style={{ minHeight: '95vh' }}>
            {this.props.children}
          </div>
          <Footer />
        </main>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
  ideasArr: PropTypes.array,
  isAuthenticated: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  loginErrorMessage: PropTypes.string,
  registerErrorMessage: PropTypes.string,
  role: PropTypes.string,
  routes: PropTypes.array.isRequired,
  usersArr: PropTypes.array,
};

function mapStateToProps(state) {
  const { auth, register, users } = state;
  const { usersArr, isFetchingUsers, setting } = users;
  const { registerErrorMessage } = register;
  const { isAuthenticated, loginErrorMessage, role } = auth;

  return {
    users,
    usersArr,
    isAuthenticated,
    loginErrorMessage,
    registerErrorMessage,
    role,
    lang: state.i18n.locale,
    isFetchingUsers,
  };
}





export default connect(mapStateToProps)(App);
