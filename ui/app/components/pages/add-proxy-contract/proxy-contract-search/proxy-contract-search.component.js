import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '../../../text-field'

export default class ProxyContractSearch extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static defaultProps = {
    error: null,
  }

  static propTypes = {
    identities: PropTypes.object,
    onSearch: PropTypes.func,
    error: PropTypes.string,
    selectedAddress: PropTypes.string,
  }

  constructor (props) {
    super(props)

    this.state = {
      searchQuery: '',
    }
  }

  componentDidMount () {
    this.handleSearch('')
  }

  handleSearch (searchQuery) {
    console.warn('search query', searchQuery)
    console.warn('search ident', this.props.identities)
    this.setState({ searchQuery })
    // const results = [{
    //   address: '0x1111', nickname: 'ddd', symbol: 'XXX'
    // }, {
    //   address: '0x2222', nickname: 'ddd', symbol: 'YYY'
    // }, {
    //   address: '0x3333', nickname: 'ddd', symbol: 'ZZZ'
    // }]
    //
    const identResults = Object.values(this.props.identities)
    .filter(identity => {
      return identity.isProxy == true
    })

    let results = [
      ...identResults
    ].concat(identResults.length ? ({ nickname: '(main)', address: this.props.selectedAddress }) : [])

    console.warn('search result', results)
    this.props.onSearch({ searchQuery, results })
  }

  renderAdornment () {
    return (
      <InputAdornment
        position="start"
        style={{ marginRight: '12px' }}
      >
        <img src="images/search.svg" />
      </InputAdornment>
    )
  }

  render () {
    const { error } = this.props
    const { searchQuery } = this.state

    return (
      <TextField
        id="search-tokens"
        placeholder={this.context.t('__metamonk_searchIdentity')}
        type="text"
        value={searchQuery}
        onChange={e => this.handleSearch(e.target.value)}
        error={error}
        fullWidth
        startAdornment={this.renderAdornment()}
      />
    )
  }
}
