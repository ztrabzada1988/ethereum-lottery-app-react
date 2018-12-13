import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


class App extends Component {
  // same as constructor(props) functionality
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() { // the following methods are all coming from Lottery.sol
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });

  }

  // = and => to avoid this.bind() in render
  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' })

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked! Please check your updated account balance' });
  };

  render() {
    return (
      <div>

        <AppBar position="static" style={{ backgroundColor: "#168cd4" }}>
          <Toolbar style={{ textAlign: 'center', margin: 'auto' }}>
            <Typography variant="h6" color="inherit" >
              Ethereum Lottery App
            </Typography>
          </Toolbar>
        </AppBar>

        <div className="body-content">
          <h2>Lottery Contract</h2>
          <p>
            This contract is managed by wallet address <span style={{ fontWeight: 'bold', color: 'blue' }}>{this.state.manager}</span>.
            There are currently {this.state.players.length} people entered and
            competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ethers!
          </p>

          <hr />

          <form onSubmit = {this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of ether to enter: </label>
              <input
                style={{ marginLeft: '10px', border: 'solid 1px', borderRadius: '3px', height: '19px', width: '200px' }}
                value = {this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
              />
            </div>
            <Button>Enter</Button>
          </form>

          <hr />

          <h4>Ready to pick a winner</h4>
          <Button style={{ marginTop: '1px', marginBottom: '20px' }} onClick={this.onClick}>Pick a winner!</Button>

          <p style={{ color: 'red' }}> NOTE: Please make sure you are logged into your Metamask account at Rinkbey Test Network and have Web3 installed or this app will not work</p>
          <hr />

          <h1>{this.state.message}</h1>
        </div>
      </div>
    );
  }
}

export default App;
