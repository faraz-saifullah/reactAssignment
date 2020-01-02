import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { I18n, setLocale } from 'react-redux-i18n';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { uploadFaviconLogo } from '../../../../actions/admin';

class Favicon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file_type_error: false,
      file_size_error: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

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
      await dispatch(uploadFaviconLogo(data, file_path));
    }
  };

  render() {
    const { setting } = this.props;
    const { faviconURL } = setting;
    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Title className="corporate-setting-title">
            <h5>{I18n.t('console.corporate_settings.favicon')}</h5>
          </Card.Title>
          <Card.Text className="corporate-setting-description">
            {I18n.t('console.corporate_settings.favicon_description')}
          </Card.Text>
          <div className="mt-4">
            <Row>
              <Col md={12} className="text-center">
                <div className="main-image">
                  <img src={faviconURL} alt="email_logo" height="100%" />
                </div>
              </Col>
              <Col md={12} className="mt-4 text-center">
                <Button
                  variant="primary"
                  className="text-uppercase font-12 action-btn position-relative"
                >
                  {I18n.t('console.corporate_settings.upload_favicon')}
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
        </Card.Body>
      </Card>
    );
  }
}

Favicon.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Favicon);
