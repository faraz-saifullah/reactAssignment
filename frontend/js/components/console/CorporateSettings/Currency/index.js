import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { I18n, setLocale } from 'react-redux-i18n';
import { Card, Button, Row, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateCurrency } from '../../../../actions/admin';

class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyCode: 'USD',
      show: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
  }

  getCurrencyName = code => {
    const currencies = [
      { code: 'USD', name: I18n.t('console.corporate_settings.currency_1') },
      { code: 'CNY', name: I18n.t('console.corporate_settings.currency_2') },
      { code: 'TWD', name: I18n.t('console.corporate_settings.currency_3') },
      { code: 'HKD', name: I18n.t('console.corporate_settings.currency_4') },
    ];
    const currency = currencies.filter(row => row.code === code);
    return currency[0].name;
  };

  handleChange = event => {
    this.setState({
      show: !this.state.show,
    });
    const { currencyCode } = this.state;
    this.setState({ currencyCode: event.target.value });
  };

  showModal = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  changeCurrency = async () => {
    const { dispatch } = this.props;
    const { currencyCode } = this.state;
    await dispatch(updateCurrency({ currencyCode }));
    this.setState({
      show: !this.state.show,
    });
    toast.info(I18n.t('console.corporate_settings.currency_change_success'));
  };

  render() {
    const currencies = [
      { code: 'USD', name: I18n.t('console.corporate_settings.currency_1') },
      { code: 'CNY', name: I18n.t('console.corporate_settings.currency_2') },
      { code: 'TWD', name: I18n.t('console.corporate_settings.currency_3') },
      { code: 'HKD', name: I18n.t('console.corporate_settings.currency_4') },
    ];
    const { setting } = this.props;
    const { currency } = setting;
    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Title className="corporate-setting-title">
            <h5>{I18n.t('console.corporate_settings.system_currency')}</h5>
          </Card.Title>
          <Card.Text className="corporate-setting-description">
            {I18n.t('console.corporate_settings.currency_description')}
          </Card.Text>
          <Card.Body>
            <Row>
              <label className="corporate-setting-sub-title mr-3 mt-1">
                {I18n.t('console.corporate_settings.change_currency')}
              </label>
              <div className="mt-1">
                <select className="select-box" onChange={this.handleChange}>
                  <option value={currency}>
                    {this.getCurrencyName(currency)}
                  </option>
                  {currencies.map(eachCurrency => (
                    <option key={eachCurrency.code} value={eachCurrency.code}>
                      {eachCurrency.name}
                    </option>
                  ))}
                </select>
              </div>
            </Row>
          </Card.Body>
          <div>
            <Modal
              size="lg"
              centered
              show={this.state.show}
              onHide={this.showModal}
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <p>
                  {I18n.t('console.corporate_settings.confirm_change_currency')}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="link"
                  className="text-uppercase"
                  onClick={this.showModal}
                >
                  {I18n.t('console.user_mngt.cancel')}
                </Button>
                <Button
                  variant="primary"
                  className="text-uppercase"
                  onClick={this.changeCurrency}
                >
                  {I18n.t('console.user_mngt.confirm')}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

Currency.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Currency);
