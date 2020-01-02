import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { I18n, setLocale } from 'react-redux-i18n';
import { get_invite_link, gen_link } from '../../../../actions/admin';

class LinkInvite extends React.Component {
  componentWillMount() {
    const { dispatch, lang } = this.props;
    dispatch(setLocale(lang));
    dispatch(get_invite_link());
  }

  generateLink = () => {
    const { dispatch } = this.props;
    dispatch(gen_link('GENERATE'));
  };

  deactivateLink = () => {
    const { dispatch } = this.props;
    dispatch(gen_link('DEACTIVATE'));
  };

  copyLink = () => {
    toast.info(I18n.t('console.add_member.link_copied'));
  }

  render() {
    const {
      linkActive,
      inviteLink,
      getLinkError,
      genLinkError
    } = this.props;

    return (
      <Card>
        <Card.Body>
          <Card.Title className="invite-title">
            {I18n.t('console.add_member.invite_link')}
          </Card.Title>
          <Card.Text className="mt-4 invite-description">
            {I18n.t('console.add_member.gen_link_description')}
          </Card.Text>
          {inviteLink && inviteLink.length && (
            <p className={`invite-link-body ${!linkActive && 'deactivate'}`}>
              {inviteLink}
            </p>
          )}
          {(!linkActive || (!inviteLink && !inviteLink.length)) ?
            (
              <Button
                variant="primary"
                className="text-uppercase font-12 action-btn"
                onClick={this.generateLink}
                block
              >
                {I18n.t('console.add_member.gen_link')}
              </Button>
            ) : (
              <div>
                <CopyToClipboard
                  text={inviteLink}
                  onCopy={this.copyLink}
                >
                  <Button
                    variant="outline-primary"
                    className="light-gray-3-border text-uppercase mt-2 font-12 action-btn"
                    block
                  >
                    {I18n.t('console.add_member.copy_link')}
                  </Button>
                </CopyToClipboard>
                <Button
                  variant="outline-danger"
                  className="light-gray-3-border text-uppercase font-12 action-btn"
                  onClick={this.deactivateLink}
                  block
                >
                  {I18n.t('console.add_member.deactivate_link')}
                </Button>
              </div>
            )
          }
        </Card.Body>
      </Card>
    );
  }
}

LinkInvite.propTypes = {
  dispatch: PropTypes.func.isRequired,
  inviteLink: PropTypes.string,
  lang: PropTypes.string,
  linkActive: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    lang: state.i18n.locale,
    linkActive: state.admin.linkActive,
    inviteLink: state.admin.inviteLink,
    getLinkError: state.admin.getLinkError,
    genLinkError: state.admin.genLinkError,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkInvite);
