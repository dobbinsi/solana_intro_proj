import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  'https://media.giphy.com/media/mDGE5q5WAAtumFGOuI/giphy.gif',
  'https://media.giphy.com/media/Ym3nE3oJhvTO7w5mC9/giphy.gif',
  'https://media.giphy.com/media/443Dgdy2iANyX67pwh/giphy.gif',
  'https://media.giphy.com/media/1A0knZHiAf6inlMhiz/giphy.gif'
];


const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkWalletConnection = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Wallet detected!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connect with public key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkWalletConnection();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("fetching GIF list...");
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log("Connected with public key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('GIF link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const renderNotConnectedContainer = () => (
    <button className='cta-button connect-wallet-button' onClick={connectWallet}>Connect Wallet</button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">Touchdown Dance GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
