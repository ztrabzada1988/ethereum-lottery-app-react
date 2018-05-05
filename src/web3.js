import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider); // hijacked to the current provider of web3 that is injected using Metamask

export default web3;