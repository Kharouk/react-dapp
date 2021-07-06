import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [greeting, setGreetingVal] = useState();

  async function requestAccount() {}
  async function fetchGreeting() {}
  async function setGreeting() {}

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
