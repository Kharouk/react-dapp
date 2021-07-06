import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [greeting, setGreetingVal] = useState();
  const [displayGreeting, setDisplayGreeting] = useState('Connecting...');

  async function requestAccount() {
    // prompts the user to connect to Web3 via Metamask
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setDisplayGreeting(data);
        console.log({ data });
      } catch (err) {
        console.error({ err });
      }
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>{displayGreeting}</h1>
      </header>
    </div>
  );
}

export default App;
