import { connect } from 'react-redux'
import ConfirmAddProxyContract from './confirm-add-proxy-contract.component'

const { __metamonk_addIdentity,
        __metamonk_setSelectedIdentity,
        __metamonk_clearPendingIdentities } = require('../../../actions')

const mapStateToProps = ({ metamask }) => {
  const { __metamonk_pendingIdentities } = metamask
  return {
    pendingIdentities: __metamonk_pendingIdentities,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addIdentity: identity => dispatch(__metamonk_addIdentity(identity)),
    setSelectedIdentity: identity => dispatch(__metamonk_setSelectedIdentity(identity)),
    clearPendingIdentities: () => dispatch(__metamonk_clearPendingIdentities()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmAddProxyContract)
