import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { checkExistingAddresses } from '../util'
import ProxyContractListPlaceholder from './proxy-contract-list-placeholder'
import Identicon from '../../../identicon'

export default class InfoBox extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    activeIdentity: PropTypes.object,
    results: PropTypes.array,
    selectedIdentity: PropTypes.object,
    onToggleIdentity: PropTypes.func,
  }

  render () {
    const { results = [], selectedIdentity = {}, onToggleIdentity, activeIdentity } = this.props

    return results.length === 0
      ? <ProxyContractListPlaceholder />
      : (
        <div className="identity-list">
          <div className="identity-list__title">
            { this.context.t('searchResults') }
          </div>
          <div className="identity-list__tokens-container">
            {
              results.map((_, i) => {
                const { logo, nickname, address, isProxy = false } = results[i] || {}
                const isCurrentIdentity = (
                  activeIdentity ?
                    address == activeIdentity.address :
                    !isProxy
                  )

                return Boolean(logo || nickname) && (
                  <div
                    className={classnames('identity-list__token', {
                      'identity-list__token--selected': selectedIdentity[address],
                      'identity-list__token--disabled': isCurrentIdentity,
                    })}
                    onClick={() => !isCurrentIdentity && onToggleIdentity(results[i])}
                    key={i}
                  >

                    <Identicon
                      className="confirm-add-token__token-icon"
                      diameter={48}
                      address={address}
                    />
                    <div className="identity-list__token-data">
                      <span className="identity-list__token-name">{ `${nickname} ${isCurrentIdentity ? ' - current' : ''}` }</span>
                      <span className="identity-list__token-address">{address}</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      )
  }
}
