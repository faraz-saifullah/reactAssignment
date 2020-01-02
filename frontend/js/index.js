import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Cookie from 'js-cookie';
import 'jquery';
import 'babel-polyfill';
import { ToastContainer } from 'react-toastify';
import {
  loadTranslations,
  setLocale,
  I18n,
  syncTranslationWithStore,
} from 'react-redux-i18n';
import createLogger from 'redux-logger';
import 'font-awesome/css/font-awesome.min.css';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/bootstrap/js/bootstrap.min';
import '../assets/css/main.css';
import Routes from './routes';
import pipelineApp from './reducers/index';
import { getSetting } from './actions/users';
import { translationsObject, getLocales } from './translations/i18n';
import 'react-toastify/dist/ReactToastify.css';

const isProduction = process.env.NODE_ENV === 'production';

// Creating store
let store = null;

if (isProduction) {
  // In production adding only thunk middleware
  /*const middleware = applyMiddleware(thunk)(createStore);

  store = createStore(pipelineApp, middleware);*/

  const middleware = applyMiddleware(thunk);
  const enhancer = compose(middleware);
  store = createStore(pipelineApp, enhancer);
} else {
  // In development mode beside thunk
  // DevTools are added
  let composeEnhancers = compose;
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
  }

  const logger = createLogger();
  const middleware = [applyMiddleware(thunk), applyMiddleware(logger)];
  const enhancer = composeEnhancers(...middleware);
  store = createStore(pipelineApp, enhancer);
}

syncTranslationWithStore(store);
store.dispatch(loadTranslations(translationsObject));
const lang_cookie = Cookie.get('lang');
if (lang_cookie !== undefined) {
  store.dispatch(setLocale(lang_cookie));
} else if (navigator.language) {
  const lang = navigator.language;
  const locale = getLocales(lang);
  store.dispatch(setLocale(locale));
  Cookie.set('lang', locale, { secure: true });
} else if (navigator.languages) {
  const lang = navigator.languages[0];
  const locale = getLocales(lang);
  store.dispatch(setLocale(locale));
  Cookie.set('lang', locale, { secure: true });
}

store.dispatch(getSetting());
document.title = I18n.t('pagetitle');
ReactDOM.render(
  <Provider store={store}>
    <Routes />
    <ToastContainer autoClose={3000} />
  </Provider>,
  document.getElementById('root')
);
