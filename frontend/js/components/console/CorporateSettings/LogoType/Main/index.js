import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import { uploadAppLogo } from '../../../../../actions/admin';

class Main extends React.Component {
  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  state = {
    file_type_error: false,
    file_size_error: false,
  };

  handleChange = async event => {
    const { dispatch } = this.props;
    const { file_type_error, file_size_error } = this.state;
    this.setState({ file_type_error: false, file_size_error: false });
    const file = event.target.files[0];
    const file_name = file.name;
    const file_extension = file_name.substr(file_name.length - 4);
    const file_size = file.size;
    const allowed_extensions = ['.png', '.gif', 'jpeg', 'tiff', '.bmp'];
    const allowed_size = 3145728;
    if (!allowed_extensions.includes(file_extension)) {
      this.setState({ file_type_error: true });
    } else if (file_size > allowed_size) {
      this.setState({ file_size_error: true });
    } else {
      const file_path = URL.createObjectURL(file);
      const data = new FormData();
      data.append('file', file);
      await dispatch(uploadAppLogo(data, file_path));
    }
  };

  render() {
    const { setting } = this.props;
    const { appLogoURL } = setting || {};
    return (
      <div className="mt-4">
        <Row>
          <Col md={12}>
            <div className="corporate-setting-sub-title">
              {I18n.t('console.corporate_settings.main_logo')}
            </div>
          </Col>
          <Col md={12}>
            <div className="corporate-setting-description">
              {I18n.t('console.corporate_settings.main_logo_description')}
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12} className="text-center">
            <div className="main-image">
              <img src={appLogoURL} alt="email_logo" height="100%" />
            </div>
          </Col>
          <Col md={12} className="mt-4 text-center">
            <Button
              variant="primary"
              className="text-uppercase font-12 action-btn position-relative"
            >
              {I18n.t('console.corporate_settings.upload_main_logo')}
              <input
                className="file-input"
                type="file"
                onChange={this.handleChange}
              />
            </Button>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <div className="text-center" md="auto">
            {this.state.file_type_error ? (
              <Alert className="p-1 mt-3" variant="danger">
                {I18n.t('console.corporate_settings.file_type_error')}
              </Alert>
            ) : (
                <p />
              )}
            {this.state.file_size_error ? (
              <Alert className="p-1 mt-3" variant="danger">
                {I18n.t('console.corporate_settings.file_size_error')}
              </Alert>
            ) : (
                <p />
              )}
          </div>
        </Row>
      </div>
    );
  }
}

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
  setting: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    setting: state.users.setting,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
