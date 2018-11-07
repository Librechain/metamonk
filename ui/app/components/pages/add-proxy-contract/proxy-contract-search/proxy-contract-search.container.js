import { connect } from 'react-redux'
import ProxyContractSearch from './proxy-contract-search.component'

const mapStateToProps = ({ metamask }) => {
  const { identities, selectedAddress } = metamask
  return {
    identities,
    selectedAddress,
  }
}

export default connect(mapStateToProps)(ProxyContractSearch)
