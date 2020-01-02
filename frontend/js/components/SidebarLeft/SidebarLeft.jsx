import React from 'react';
import { push, slide } from 'react-burger-menu';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import mobile from 'is-mobile';
import AddNewIdeas from './../AddNewIdeas';
import './SidebarLeft.scss';

function NavBar(props) {
  const { user, setting, sidebarOpen } = props;
  let { route } = props;
  route = route.replace('/', '');
  let menuOptions = {};
  let Menu = slide;
  if (!mobile()) {
    menuOptions = {
      noOverlay: true,
      disableOverlayClick: true,
      noTransition: true,
      bodyClassName: 'sidebar-open',
    };
    Menu = push;
  }

  return (
    <Menu
      className="sidebar-column"
      customBurgerIcon={false}
      customCrossIcon={false}
      pageWrapId="page-wrap"
      outerContainerId="outer-container"
      id="slide"
      {...menuOptions}
      isOpen={sidebarOpen}
    >
      <div className="sidebar-wrapper">
        <div className="logo">
          <img
            src={setting ? setting.appLogoURL : ''}
            alt="IDEX logo"
            className="logoimg"
          />
        </div>
        <AddNewIdeas
          clearFilter={() => {
            console.log('clearFilter');
          }}
        />
        <nav>
          <ul>
            {user.authorities && user.authorities[0] != 'ROLE_USER' ? (
              <li className={route == 'statistics' ? 'active' : ''}>
                <Link to="/statistics">{I18n.t('stat.title')}</Link>
              </li>
            ) : null}
            {user.authorities &&
              (user.authorities[0] === 'ROLE_SUPER_ADMIN' ||
                user.authorities[0] === 'ROLE_ADMIN') ? (
                <li className={route === 'console' ? 'active' : ''}>
                  <Link to="/add-member">
                    {I18n.t('console.sidebar.admin_console')}
                  </Link>
                  <ul>
                    <li className={route === 'user-manage' ? 'active' : ''}>
                      <Link to="/user-manage">
                        {I18n.t('console.sidebar.member_mngt')}
                      </Link>
                    </li>
                    <li
                      className={
                        route === 'add-member' || route === 'manage-invites'
                          ? 'active'
                          : ''
                      }
                    >
                      <Link to="/add-member">
                        {I18n.t('console.sidebar.add_member')}
                      </Link>
                    </li>
                    {user.authorities &&
                      user.authorities[0] === 'ROLE_SUPER_ADMIN' ? (
                        <li className={route === 'corporate' ? 'active' : ''}>
                          <Link to="/corporate">
                            {I18n.t('console.sidebar.corporate_setting')}
                          </Link>
                        </li>
                      ) : null}
                  </ul>
                </li>
              ) : null}
            <li>
              <Link to="/all-ideas">{I18n.t('ideas.title')} </Link>
              <ul>
                <li className={route === 'all-ideas' ? 'active' : ''}>
                  <Link to="/all-ideas">{I18n.t('ideas.allIdeas')}</Link>
                </li>
                <li className={route === 'my-ideas' ? 'active' : ''}>
                  <Link to="/my-ideas">{I18n.t('ideas.myIdeas')}</Link>
                </li>
              </ul>
            </li>
            <li className={route === 'profile' ? 'active' : ''}>
              <Link to="/profile">{I18n.t('auth.profile')}</Link>
            </li>
            <li className={route === 'help' ? 'active' : ''}>
              <Link to="/help">{I18n.t('help')}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </Menu>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.profile.userAccountInfo,
    setting: state.users.setting,
    lang: state.i18n.locale,
    dollar: state.users.setting.currency,
    ...ownProps,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

NavBar.propTypes = {
  route: PropTypes.string,
  setting: PropTypes.object,
  sidebarOpen: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

// /* eslint-disable react/no-multi-comp */
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
// import { I18n, setLocale } from 'react-redux-i18n';
// import { Modal, Button } from 'react-bootstrap';
// import { WithContext as ReactTags } from 'react-tag-input';
// import FileViewer from 'react-file-viewer-extended';
// import Files from 'react-files';
// import logoImage from '../../../assets/images/logo.png';
// import { FiltersTag } from '../FiltersTag';
// import { addIdea, removeTemp } from '../../actions/ideas';
// import {
//   areAllAttachmentsUploaded,
//   changeFiles,
//   handleAddIdeaError,
// } from '../../actions/files';
// import '../IdeaModal/IdeaModal.scss';
// import './SidebarLeft.scss';
// import MainModalComponent from './../AddNewIdeas';

// class SidebarLeft extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       route: '',
//     };
//   }
//   componentWillMount() {
//     let route = window.location.pathname;
//     route = route.replace('/', '');
//     this.setState({ route });
//   }
//   render() {
//     const { route } = this.state;
//     const { user, setting } = this.props;
//     return (
//       <div className="sidebar-wrapper">
//         <div className="logo">
//           <img
//             src={setting ? setting.appLogoURL : ''}
//             alt="IDEX logo"
//             className="logoimg"
//           />
//         </div>
//         <MainModalComponent clearFilter={this.props.clearFilter} />
//         <nav>
//           <ul>
//             {user.authorities && user.authorities[0] != 'ROLE_USER' ? (
//               <li className={route == 'statistics' ? 'active' : ''}>
//                 <Link to="/statistics">{I18n.t('stat.title')}</Link>
//               </li>
//             ) : null}
//             {user.authorities &&
//             (user.authorities[0] === 'ROLE_SUPER_ADMIN' ||
//               user.authorities[0] === 'ROLE_ADMIN') ? (
//               <li className={route == 'console' ? 'active' : ''}>
//                 <Link to="/add-member">
//                   {I18n.t('console.sidebar.admin_console')}
//                 </Link>
//                 <ul>
//                   <li className={route == 'user-manage' ? 'active' : ''}>
//                     <Link to="/user-manage">
//                       {I18n.t('console.sidebar.member_mngt')}
//                     </Link>
//                   </li>
//                   <li className={route == 'add-member' ? 'active' : ''}>
//                     <Link to="/add-member">
//                       {I18n.t('console.sidebar.add_member')}
//                     </Link>
//                   </li>
//                   {/* {user.authorities &&
//                   user.authorities[0] === 'ROLE_SUPER_ADMIN' ? (
//                     <li className={route === 'corporate' ? 'active' : ''}>
//                       <Link to="/corporate">
//                         {I18n.t('console.sidebar.corporate_setting')}
//                       </Link>
//                     </li>
//                   ) : null} */}
//                 </ul>
//               </li>
//             ) : null}
//             <li>
//               <Link to="/all-ideas">{I18n.t('ideas.title')} </Link>
//               <ul>
//                 <li className={route == 'all-ideas' ? 'active' : ''}>
//                   <Link to="/all-ideas">{I18n.t('ideas.allIdeas')}</Link>
//                 </li>
//                 <li className={route == 'my-ideas' ? 'active' : ''}>
//                   <Link to="/my-ideas">{I18n.t('ideas.myIdeas')}</Link>
//                 </li>
//               </ul>
//             </li>
//             <li className={route == 'profile' ? 'active' : ''}>
//               <Link to="/profile">{I18n.t('auth.profile')}</Link>
//             </li>
//             <li className={route == 'help' ? 'active' : ''}>
//               <Link to="/help">{I18n.t('help')}</Link>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     );
//   }
// }

// function mapStateToProps1(state, ownProps) {
//   return {
//     user: state.profile.userAccountInfo,
//     setting: state.users.setting,
//     lang: state.i18n.locale,
//     dollar: state.users.setting.currency,
//     ...ownProps,
//   };
// }

// function mapDispatchToProps1(dispatch) {
//   return { dispatch };
// }

// export default connect(mapStateToProps1, mapDispatchToProps1)(SidebarLeft);
