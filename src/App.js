import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const tokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

function App() {
  const [greeting, setGreetingVal] = useState('');
  const [userAccount, setUserAccount] = useState(''); // who we sending to
  const [amount, setAmount] = useState(0); // how much we sending

  const [displayGreeting, setDisplayGreeting] = useState('Connecting...');
  const [displayAmount, setDisplayAmount] = useState(0);

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log({ balance: balance.toString() });
      setDisplayAmount(balance.toString());
    }
  }

  async function makeTransfer() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      setAmount(0);
      console.log(`${amount} TGLT was successfully sent to ${userAccount}`);
    }
  }

  async function requestAccount() {
    // prompts the user to connect to Web3 via Metamask
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // when we create an update to the blockchain, we need to have a signer
      // so that we can sign the transaction
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      console.log({
        signer,
        contract,
        transaction,
      });
      setGreetingVal('');
      await transaction.wait(); // could take a while to write to the production blockchain
      fetchGreeting();
    }
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
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <br />
        <input
          onChange={(e) => setGreetingVal(e.target.value)}
          value={greeting}
        />
        <button onClick={setGreeting}>Set Greeting</button>
        <div
          style={{
            borderTop: '10px solid black',
            width: '90%',
            marginTop: 40,
            padding: 10,
            display: 'flex',
            justifyContent: 'space-evenly',
            flexDirection: 'column',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1 }}>
            <input
              onChange={(e) => setUserAccount(e.target.value)}
              placeholder="Account ID"
            />
            <input
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <button onClick={makeTransfer}>Send Coins</button>
          </div>
          <div style={{ flex: 1 }}>
            <button onClick={getBalance}>Get Balance</button>
            <p>{displayAmount}</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
