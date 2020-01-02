import React from 'react';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  InputGroup,
  FormControl,
  Form,
  Card,
  Button,
  Alert,
} from 'react-bootstrap';
import { updateColor } from '../../../../../../actions/admin';
import darkTextLogo from '../../../../../../../assets/images/icons/switch.svg';
import lightTextLogo from '../../../../../../../assets/images/icons/switch light.svg';

class Color2Widget extends React.Component {
  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  state = {
    hexNumber: this.props.code,
    lightText: true,
    validationSuccess: true,
  };

  changeTheme = () => {
    const { lightText } = this.state;
    this.setState({
      lightText: !lightText,
    });
  };

  setTheme() {
    const cssKey = `--sidebar-background-color`;
    const cssValue = `#${this.state.hexNumber}`;
    document.body.style.setProperty(cssKey, cssValue);
  };

  changeColor = () => {
    const { hexNumber, validationSuccess } = this.state;
    if (hexNumber.length === 6) {
      const { dispatch, colorPalette } = this.props;
      const { color1, color2, color3 } = colorPalette;

      const color_object = {
        color1,
        color2: hexNumber,
        color3,
      };
      dispatch(updateColor(color_object));
      this.props.onHide();
    }
    this.setTheme();
    this.setState({ validationSuccess: false });
  };

  render() {
    const theme = this.state.lightText ? 'white' : 'black';
    return (
      <Row>
        <Col xs md={6}>
          <Card className="border-0">
            <Card.Title className="preview">
              {I18n.t('console.corporate_settings.preview')}
            </Card.Title>
            <Row>
              <Col xs md={6}>
                <div
                  className="modal-color-picker"
                  style={{ backgroundColor: `#${this.state.hexNumber}` }}
                />
              </Col>
              <Col xs md={6}>
                <div
                  className="modal-color-picker"
                  style={{ backgroundColor: `#${this.state.hexNumber}` }}
                >
                  <div className="color-2-preview" style={{ color: theme }}>
                    <h5>
                      {I18n.t('console.corporate_settings.color2_picker.ideas')}
                    </h5>
                    <div className="mt-4">
                      {I18n.t(
                        'console.corporate_settings.color2_picker.all_ideas'
                      )}
                    </div>
                    <div>
                      {I18n.t(
                        'console.corporate_settings.color2_picker.my_ideas'
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs md={6}>
          <Card.Title className="corporate-setting-description">
            {I18n.t('console.corporate_settings.color_picker_description')}
          </Card.Title>
          <Form.Label>
            {I18n.t('console.corporate_settings.hex_number')}
          </Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1" className="color-hash">
                #
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className="code-field"
              value={this.state.hexNumber}
              placeholder={this.props.code}
              aria-label="hexNumber"
              aria-describedby="basic-addon1"
              onChange={e =>
                this.setState({
                  hexNumber: e.target.value,
                })
              }
            />
          </InputGroup>
          <Row>
            <Col xs={4} md={2}>
              <img
                src={this.state.lightText ? darkTextLogo : lightTextLogo}
                onClick={this.changeTheme}
                alt="change text theme"
              />
            </Col>
            <Col xs={8} md="auto">
              <h6>
                {this.state.lightText
                  ? I18n.t('console.corporate_settings.light_text')
                  : I18n.t('console.corporate_settings.dark_text')}
              </h6>
            </Col>
            <Col xs md={12} className="mt-2">
              {!this.state.validationSuccess ? (
                <Alert className="p-1" variant="danger">
                  {I18n.t('console.corporate_settings.enter_valid')}
                </Alert>
              ) : (
                  <p />
                )}
              <Button
                variant="primary"
                className="text-uppercase font-12 action-btn text-center"
                onClick={this.changeColor}
              >
                {I18n.t('console.corporate_settings.confirm_changes')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

Color2Widget.propTypes = {
  code: PropTypes.string,
  colorPalette: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string,
  onHide: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Color2Widget);
