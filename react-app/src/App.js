import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { uniswapABI } from './DETAILS';

let web3;
let web3Mainnet;
let uniswapMainnetContract;
let vitalikAddress = "0x4323E6b155BCf0b25f8c4C0B37dA808e3550b521";


function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isUncommonSwapper, setIsUncommonSwapper] = useState(0);
  const [isUncommonEthUser,setIsUncommonEthUser] = useState(0);

  
  useEffect(
    () => {
      async function initApp() {
        await connectWalletHandler();
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
          window.ethereum.request({ method: "eth_requestAccounts" });
          web3 = new Web3(window.ethereum);
        } else {
          const provider = new Web3.providers.HttpProvider(
            "https://rinkeby.infura.io/v3/3653806d884b401498e7a07f3f325d2e"
          );
          web3 = new Web3(provider);
        };
        web3Mainnet = new Web3("https://mainnet.infura.io/v3/3653806d884b401498e7a07f3f325d2e");
        uniswapMainnetContract = new web3Mainnet.eth.Contract(uniswapABI, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
        console.log("All ok");
      }

      initApp();
    }, []
  );


  const connectWalletHandler = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    alert("Please install Metamask!");
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const connectWalletButton = () => {
    return (<button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  async function fetchInfo() {
    let nTxns = await web3.eth.getTransactionCount(currentAccount);
    if(nTxns > 5){
      setIsUncommonEthUser(1);
    }

    uniswapMainnetContract.getPastEvents("Swap", {
      fromBlock: 0,
      toBlock: "latest"
    },
      function (error, events) {
        console.log(events);
      });


    console.log(nTxns);
  }



  return (

    <div>
      <h1>Hello world</h1>
      <div>
        {currentAccount ? <h3>Wallet connected: {currentAccount}</h3> : connectWalletButton()}
        <p>This is a smaple app to get some basic information about your familiarity with the Ethereum ecosystem</p>
        <h4>Sushiswap uncommon Swapper (for Vitalik's address on Mainnet): {isUncommonSwapper}</h4>
        <h4>Ethereum Common user (done more than 5 transactions on Rinkeby): {isUncommonEthUser}</h4>
        <button onClick={fetchInfo}>Fetch </button>
      </div>
    </div>
  );
}

export default App;
