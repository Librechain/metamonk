import { connect } from 'react-redux'
import ProxyContractList from './proxy-contract-list.component'

const mapStateToProps = ({ metamask }) => {
  const { tokens, identities } = metamask
  return {
    tokens,
    identities
  }
}

export default connect(mapStateToProps)(ProxyContractList)
