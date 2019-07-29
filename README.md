# MetaMonk - A MetaMask-fork to support pluggable identity contracts.

![](../../metamonk/develop/app/images/info-logo.png)

# Introduction

This repository contains a modified, working-in-progress MetaMask that supports "pluggable identities".

![](https://user-images.githubusercontent.com/5269414/49378723-46a93380-f748-11e8-8e3c-2551af1e0a1b.png)
![](https://user-images.githubusercontent.com/5269414/49378724-46a93380-f748-11e8-94f9-31004b7d890c.png)

*(left)* A link to switch on/off proxy mode \
*(right)* When proxy mode is on, the "identity" in the gray box will be shown to Dapps instead.

## Motivation

As MetaMask users, we often want programmable interfaces that a plain wallet account cannot provide. Wallet contracts, for example, is the simplest way to storage and transfer ethers in practice. It works like a typical wallet when holding ethers, but its behaviors can be customized. 

However, when it comes to interacting with other contracts or DApp, users may find it much difficult to actaully interact with them. Take Multisignature wallet Gnosis as example. Although it is equipped with built-in ERC20 interface, but in the case of ERC721 or ENS, you will have to manually enter contract ABI and composed function payload in order to interact with external smart contract.

![gnosis](https://user-images.githubusercontent.com/1984426/61522162-632e7d80-aa44-11e9-9e07-8626d7eb17e7.png)

*(description)* Gnosis wallet external smart contract interaction interface.

## Proposal

This fork introduces the concept of "identity", and "pluggable" means that it is an opt-in feature. When the proxy mode is enabled, a user can switch to one of its identities on-the-fly, just like it can switch to different account/network before. It can make transactions to an address, and this MetaMask-fork can transparently transform it to a suitable function call to the proxy contract on behalf of the original user. The proxy contract is expected to use that information to perform the requested transaction afterwards. Multisig contracts, for example, do not execute transactions immediately until other owners' confirmations.

## Test builds

The MetaMask-fork provides testing builds (Chrome and Firefox only) as zip packages. It is strongly encouraged to use a clean environment to minimize the interferences.

&#x1F534;&#x1F534;&#x1F534; Disclaimer: Use at your own risk! &#x1F534;&#x1F534;&#x1F534; 

* 5.2.2: https://github.com/andy0130tw/metamask-extension/releases/tag/v5.2.2-metamonk
* 4.14.0: https://github.com/andy0130tw/metamask-extension/releases/tag/v4.14.0-metamonk

## Implementation

MetaMask exposes the wallet address of the selected account after unlocking (in MetaMask < 5). Dapps can access it (from `web3.currentProvider.accounts` or `web3.eth.getAccounts()`, etc.), and use this address, the identity of the user, to issue signing requests or transactions. In Metamonk, the address can be replaced with the proxy address if set, and further modifications are required to make this possible.

For example, there is an assert in the code that the "from" address of a transaction must match the selected address in MetaMask, to ensure that the user is able to sign that transaction later ([reference](https://github.com/MetaMask/metamask-extension/blob/v4.16.0/app/scripts/controllers/transactions/index.js#L169-L172)). If we consider a proxy contract also an identity of a user, this restriction no longer applies. As a result, we implement this feature as outlined:

1. The user turns on the proxy mode option by toggling it in a dropdown menu
2. The user adds a proxy contract `(nickname, proxy address, function hash)` and switch to this identity in the side menu
3. MetaMask changes the exposed address to the address **of the selected identity** (contract address)
4. If the Dapp wants to initialize a transaction, modify its destination to the address of the proxy contract, and encode parameters according to the type of that proxy contract, supplied by the user
5. A popup is displayed as normal. The only differences are transformed `amount` and `data`
6. The user clicks "sign", signing the transaction with the original account
7. The transaction is sent as before

If (1) the user turns off the proxy mode option, or (2) it selects the non-contract address, no data is transformed, and the workflow should be identical as if this feature has not exist. This switch ensures its backward-compatibility.

The technical notes made while developing [can be found here](https://www.notion.so/qbane/MetaMask-Metamonk-dev-74cb6725e8344b0da581e236c3dbcab1) (on Notion).

## Building / Deploying

Basically this is identical to [the original documentation of MetaMask](https://github.com/MetaMask/metamask-extension#building-locally).
