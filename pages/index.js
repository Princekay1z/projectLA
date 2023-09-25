import {useState, useEffect} from "react";
import {ethers} from "ethers";
import abi from "./contracts/abi.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [factor, setFactor] = useState(undefined);
  const [wi, setWi] = useState(undefined);

  const contractAddress = "0x4e4e9BE7AC99FA68f3BBE972f0C7ec0Fb04681Aa";
  const ABI = abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getContract();
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const theContract = new ethers.Contract(contractAddress, ABI, signer);
 
    setContract(theContract);
  }

  const getFactor = async() => {
    if (contract) {
      setFactor((await contract.factor()).toNumber());
    }
  }

  const resetFactor = async(newFactor) => {
    if (contract) {
      let tx = await contract.resetFactor(newFactor);
      await tx.wait()
      getFactor();
    }
  }

  const multiplyFactor = async(value) => {
    if (contract) {
      let tx = await contract.multiplyFactor(value);
      await tx.wait()
      getFactor();
    }
  }

  const divideFactor = async(value) => {
    if (contract) {
      let tx = await contract.divideFactor(value);
      await tx.wait()
      getFactor();
    }
  }



  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this Dapp.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (factor == undefined) {
      getFactor();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>The Factor: {factor}</p>
        <hr></hr>
        <hr></hr>
        <hr></hr>
        <hr></hr>
        <hr></hr>
        {workingInput()}
        <hr></hr>
        <button onClick={() => (resetFactor(wi))}>set a new factor</button>
        <hr></hr>
        <button onClick={() => (multiplyFactor(wi))}> multiply the factor by the value</button>
        <hr></hr>
        <button onClick={() => (divideFactor(wi))}>divide the factor by the value</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  const workingInput = () => {
    return (
      <form>
        <label> enter value here </label>
        <input type="number" value={wi} onChange={(event) => {setWi(event.target.value)}}></input>
      </form>
    )
  }

  return (
    <main className="container">
      <header><h1>Welcome to my Calculator App!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
