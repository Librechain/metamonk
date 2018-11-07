import { connect } from 'react-redux'
import AddProxyContract from './add-proxy-contract.component'

const {
  __metamonk_setPendingIdentities,
  __metamonk_clearPendingIdentities } = require('../../../actions')

const mapStateToProps = ({ metamask }) => {
  const { identities, __metamonk_pendingIdentities } = metamask
  return {
    identities,
    pendingIdentities: __metamonk_pendingIdentities,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPendingIdentities: idenitities => dispatch(__metamonk_setPendingIdentities(idenitities)),
    clearPendingIdentities: () => dispatch(__metamonk_clearPendingIdentities()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProxyContract)
