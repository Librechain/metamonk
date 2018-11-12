import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ethUtil from 'ethereumjs-util'
import { checkExistingAddresses } from './util'
import { DEFAULT_ROUTE, __METAMONK_CONFIRM_ADD_PROXY_CONTRACT_ROUTE } from '../../../routes'
import TextField from '../../text-field'
import ProxyContractList from './proxy-contract-list'
import ProxyContractSearch from './proxy-contract-search'
import PageContainer from '../../page-container'
import { Tabs, Tab } from '../../tabs'

const emptyAddr = '0x0000000000000000000000000000000000000000'
const SEARCH_TAB = 'SEARCH'
const CUSTOM_TOKEN_TAB = 'CUSTOM_TOKEN'

class AddProxyContract extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
    setPendingIdentities: PropTypes.func,
    clearPendingIdentities: PropTypes.func,
    tokens: PropTypes.array,
    identities: PropTypes.object,
    pendingIdentities: PropTypes.object,
    selectedAddress: PropTypes.string,
  }

  constructor (props) {
    super(props)

    this.state = {
      proxyAddress: '',
      proxyNickname: '',
      functionHash: '0xb61d27f6',
      searchResults: [],
      selectedIdentity: {},
      identitySelectorError: null,
      proxyAddressError: null,
      proxyNicknameError: null,
      functionHashError: null,
      autoFilled: false,
      displayedTab: SEARCH_TAB,
    }
  }

  componentDidMount () {
    // const { pendingIdentities = {} } = this.props
    // const pendingTokenKeys = Object.keys(pendingIdentities)

    // if (pendingTokenKeys.length > 0) {
    //   let selectedIdentity = {}
    //   let customToken = {}

    //   pendingTokenKeys.forEach(tokenAddress => {
    //     const token = pendingIdentities[tokenAddress]
    //     const { isCustom } = token

    //     if (isCustom) {
    //       customToken = { ...token }
    //     } else {
    //       selectedIdentity = { ...selectedIdentity, [tokenAddress]: { ...token } }
    //     }
    //   })

    //   const {
    //     address: proxyAddress = '',
    //     symbol: proxyNickname = '',
    //     decimals: functionHash = 0,
    //   } = customToken

    //   const displayedTab = Object.keys(selectedIdentity).length > 0 ? SEARCH_TAB : CUSTOM_TOKEN_TAB
    //   this.setState({ selectedIdentity, proxyAddress, proxyNickname, functionHash, displayedTab })
    // }
  }

  handleToggleIdentity (token) {
    const { address } = token
    const { selectedIdentity = {} } = this.state
    const selectedIdentityCopy = {}

    // only allow one selection
    if (!(address in selectedIdentity)) {
      selectedIdentityCopy[address] = token
    }

    this.setState({
      selectedIdentity: selectedIdentityCopy,
      identitySelectorError: null,
    })
  }

  hasError () {
    const {
      identitySelectorError,
      proxyAddressError,
      proxyNicknameError,
      functionHashError,
    } = this.state

    return !!(identitySelectorError || proxyAddressError || proxyNicknameError || functionHashError)
  }

  hasSelected () {
    const { proxyAddress = '', selectedIdentity = {} } = this.state
    return proxyAddress || Object.keys(selectedIdentity).length > 0
  }

  handleNext () {
    if (this.hasError()) {
      return
    }

    if (!this.hasSelected()) {
      this.setState({ identitySelectorError: this.context.t('mustSelectOne') })
      return
    }

    const { setPendingIdentities, history } = this.props
    const {
      proxyAddress: address,
      proxyNickname: nickname,
      functionHash: functionHash,
      selectedIdentity,
    } = this.state

    const importingIdentity = {
      address,
      nickname,
      functionHash,
    }

    setPendingIdentities({ importingIdentity, selectedIdentity })
    history.push(__METAMONK_CONFIRM_ADD_PROXY_CONTRACT_ROUTE)
  }

  async attemptToAutoFillTokenParams (address) {
    // const { symbol = '', decimals = 0 } = await this.tokenInfoGetter(address)

    // const autoFilled = Boolean(symbol && decimals)
    // this.setState({ autoFilled })
    this.handleProxyNicknameChange('')
    // this.handleFunctionHashChange(decimals)
  }

  handleProxyAddressChange (value) {
    const proxyAddress = value.trim()
    this.setState({
      proxyAddress,
      proxyAddressError: null,
      identitySelectorError: null,
      autoFilled: false,
    })

    const isValidAddress = ethUtil.isValidAddress(proxyAddress)
    const standardAddress = ethUtil.addHexPrefix(proxyAddress).toLowerCase()

    switch (true) {
      case !isValidAddress:
        this.setState({
          proxyAddressError: this.context.t('invalidAddress'),
          proxyNicknameError: null,
          functionHashError: null,
        })

        break
      case Boolean(this.props.identities[standardAddress]):
        this.setState({
          proxyAddressError: this.context.t('personalAddressDetected'),
        })

        break
      case checkExistingAddresses(proxyAddress, this.props.tokens):
        this.setState({
          proxyAddressError: this.context.t('tokenAlreadyAdded'),
        })

        break
      default:
        if (proxyAddress !== emptyAddr) {
          this.attemptToAutoFillTokenParams(proxyAddress)
        }
    }
  }

  handleProxyNicknameChange (value) {
    const proxyNickname = value.trim()
    let proxyNicknameError = null

    if (proxyNickname.length == 0) {
      proxyNicknameError = this.context.t('__metamonk_emptyProxyNickname')
    }

    this.setState({ proxyNickname, proxyNicknameError })
  }

  handleFunctionHashChange (value) {
    const functionHash = value.trim()
    const validFunctionHash =
      functionHash.match(/^(0x)?[0-9a-fA-F]{8}$/) !== null

    let functionHashError = null

    if (!validFunctionHash) {
      functionHashError = this.context.t('__metamonk_invalidFunctionHash')
    }

    const prefixedFunctionHash = ethUtil.addHexPrefix(functionHash)

    this.setState({ functionHash: prefixedFunctionHash, functionHashError })
  }

  renderImportProxyContractForm () {
    const {
      proxyAddress,
      proxyNickname,
      functionHash,
      proxyAddressError,
      proxyNicknameError,
      functionHashError,
      autoFilled,
    } = this.state

    return (
      <div className="add-token__custom-token-form">
        <TextField
          id="custom-address"
          label={this.context.t('__metamonk_proxyContractAddress')}
          type="text"
          value={proxyAddress}
          onChange={e => this.handleProxyAddressChange(e.target.value)}
          error={proxyAddressError}
          fullWidth
          margin="normal"
        />
        <TextField
          id="custom-nickname"
          label={this.context.t('__metamonk_proxyContractNickname')}
          type="text"
          value={proxyNickname}
          onChange={e => this.handleProxyNicknameChange(e.target.value)}
          error={proxyNicknameError}
          fullWidth
          margin="normal"
          disabled={autoFilled}
        />
        <TextField
          id="custom-function-hash"
          label={this.context.t('__metamonk_proxyContractFunctionHash')}
          type="text"
          value={functionHash}
          onChange={e => this.handleFunctionHashChange(e.target.value)}
          error={functionHashError}
          fullWidth
          margin="normal"
          disabled
        />
      </div>
    )
  }

  renderSwitchToIdentity () {
    const { identitySelectorError, selectedIdentity, searchResults } = this.state

    return (
      <div className="add-token__search-token">
        <ProxyContractSearch
          onSearch={({ results = [] }) => {
            this.setState({ searchResults: results })
          }}
          error={identitySelectorError}
        />
        <div className="add-token__token-list">
          <ProxyContractList
            results={searchResults}
            selectedIdentity={selectedIdentity}
            onToggleIdentity={token => this.handleToggleIdentity(token)}
          />
        </div>
      </div>
    )
  }

  renderTabs () {
    return (
      <Tabs>
        <Tab name={this.context.t('__metamonk_switchToProxy')}>
          { this.renderSwitchToIdentity() }
        </Tab>
        <Tab name={this.context.t('__metamonk_importProxy')}>
          { this.renderImportProxyContractForm() }
        </Tab>
      </Tabs>
    )
  }

  render () {
    const { history, clearPendingIdentities } = this.props

    return (
      <PageContainer
        title={this.context.t('__metamonk_addProxyContracts')}
        tabsComponent={this.renderTabs()}
        onSubmit={() => this.handleNext()}
        disabled={this.hasError() || !this.hasSelected()}
        onCancel={() => {
          clearPendingIdentities()
          history.push(DEFAULT_ROUTE)
        }}
      />
    )
  }
}

export default AddProxyContract
