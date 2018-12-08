import { connect } from 'react-redux'
import ProxyContractList from './proxy-contract-list.component'

const mapStateToProps = ({ metamask }) => {
  const { identities,
          __metamonk_selectedIdentity } = metamask
  return {
    identities,
    // sorry for weirdness
    activeIdentity: __metamonk_selectedIdentity
  }
}

export default connect(mapStateToProps)(ProxyContractList)
