/* eslint semi: ["error", "never"]*/
const enTranslationMessages = require('./languages/en.json');
const zh_CNTranslationMessages = require('./languages/zh_CN.json');
const zh_TWTranslationMessages = require('./languages/zh_TW.json');

const formatTranslationMessages = (locale, messages) => {
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage = messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationsObject = {
  en: formatTranslationMessages('en', enTranslationMessages),
  zh_CN: formatTranslationMessages('zh_CN', zh_CNTranslationMessages),
  zh_TW: formatTranslationMessages('zh_TW', zh_TWTranslationMessages),
};

const getLocales = lang => {
  switch (lang) {
    case 'en':
    case 'en-US':
      return 'en';
    case 'zh-TW':
    case 'zh-HK':
      return 'zh_TW';
    case 'zh-CN':
    case 'zh':
      return 'zh_CN';
    default:
      return 'en';
  }
};

exports.translationsObject = translationsObject;
exports.getLocales = getLocales;
