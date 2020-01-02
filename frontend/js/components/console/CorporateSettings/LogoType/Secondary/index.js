import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { I18n, setLocale } from 'react-redux-i18n';
import SampleEmail from './SampleEmail/index';
import { uploadEmailLogo } from '../../../../../actions/admin';
import Footer from '../../../../../components/Footer';
import SampleEmailModal from './sampleEmailModal';
import Tooltip from './Tooltip';

class Secondary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file_path: null,
      file: null,
      toggleModal: false,
      file_type_error: false,
      file_size_error: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  toggleModal = () => {
    this.setState({
      toggleModal: !this.state.toggleModal,
    });
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
      await dispatch(uploadEmailLogo(data, file_path));
    }
  };

  render() {
    const { setting } = this.props;
    const { emailLogoURL } = setting || {};
    const { toggleModal } = this.state;
    return (
      <div className="mt-4">
        <Row>
          <Col md={12}>
            <div className="corporate-setting-sub-title">
              {I18n.t('console.corporate_settings.secondary_logo')}
            </div>
          </Col>
          <Col md={12}>
            <div className="corporate-setting-description">
              {I18n.t('console.corporate_settings.secondary_logo_description')}
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col
            md={{ span: 6, offset: 6 }}
            className="sample-email-title text-center mb-3"
          >
            {I18n.t('console.corporate_settings.sample_email_title')}
          </Col>
          <Col md={6} className="text-center">
            <div className="secondary-image">
              <img src={emailLogoURL} alt="email_logo" height="100%" />
            </div>
          </Col>
          <Col md={6}>
            <div
              className="sample-email-preview sample-email-preview-small"
              onKeyPress={this.handleClick}
              role="button"
              tabIndex="0"
              onClick={this.toggleModal}
            >
              <SampleEmail file={emailLogoURL} />
            </div>
            {toggleModal && (
              <SampleEmailModal hideModal={this.toggleModal}>
                <SampleEmail file={emailLogoURL} />
                <div className="sample-email-large-desc mt-4 mb-4 h-90-vh">
                  {I18n.t('console.corporate_settings.email_body')}
                </div>
                <Footer />
              </SampleEmailModal>
            )}
          </Col>
        </Row>
        <Row className="justify-content-md-center mt-4 ">
          <Col md="auto">
            <Button
              variant="primary"
              className="text-uppercase font-12 action-btn position-relative"
            >
              {I18n.t('console.corporate_settings.upload_secondary_logo')}
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
        <Row className="justify-content-md-center">
          <Col md={8}>
            <Tooltip
              placement="bottom"
              trigger="hover"
              tooltip={I18n.t(
                'console.corporate_settings.logo_instructions_text'
              )}
            >
              <Card.Text className="logo-sub-description">
                {I18n.t(
                  'console.corporate_settings.secondary_logo_instructions'
                )}
              </Card.Text>
            </Tooltip>
          </Col>
        </Row>
      </div>
    );
  }
}

Secondary.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Secondary);
