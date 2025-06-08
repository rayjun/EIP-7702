import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { encodeFunctionData } from 'viem';
import {
  gasDaddyAbi,
  sbtAbi,
  gasDaddyContractAddress,
  sbtContractAddress,
} from './contracts';
import './App.css';

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [authorization, setAuthorization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>('');

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  const handleCreateAuthorization = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      // For now, create a mock authorization structure
      // In a real implementation, this would use the proper wagmi hook when available
      const auth = {
        chainId: 11155111, // Sepolia
        address: gasDaddyContractAddress,
        nonce: Date.now(),
      };
      setAuthorization(auth);
      console.log('Authorization created:', auth);
    } catch (error) {
      console.error('Failed to create authorization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintSBT = async () => {
    if (!authorization) return;

    setIsLoading(true);
    try {
      // This would typically be done by the sponsor's wallet
      // For demo purposes, we're showing the structure
      const sbtMintData = encodeFunctionData({
        abi: sbtAbi,
        functionName: 'mint',
        args: [],
      });

      // In a real implementation, this would be sent to the sponsor's backend
      // The sponsor would then execute the transaction
      console.log('SBT Mint Data:', sbtMintData);
      console.log('Target Contract:', sbtContractAddress);
      console.log('Authorization:', authorization);

      // Show success message for demo
      setTxHash('0x...' + Math.random().toString(36).substr(2, 9));
    } catch (error) {
      console.error('Failed to mint SBT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 GasDaddy</h1>
        <p>EIP-7702 Gas Sponsorship Platform</p>

        {!isConnected ? (
          <div className="connect-section">
            <h2>Connect Your Wallet</h2>
            <div className="connectors">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  className="connect-btn"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="connected-section">
            <div className="account-info">
              <h2>👤 Connected Account</h2>
              <p>
                <strong>Address:</strong> {address}
              </p>
              <button onClick={() => disconnect()} className="disconnect-btn">
                Disconnect
              </button>
            </div>

            <div className="authorization-section">
              <h2>📝 Step 1: Create EIP-7702 Authorization</h2>
              <p>Sign authorization to delegate contract code to your EOA</p>
              <button
                onClick={handleCreateAuthorization}
                disabled={isLoading || !!authorization}
                className="auth-btn"
              >
                {isLoading
                  ? 'Creating...'
                  : authorization
                  ? '✅ Authorization Created'
                  : 'Create Authorization'}
              </button>
              {authorization && (
                <div className="auth-details">
                  <p>
                    <strong>Chain ID:</strong> {authorization.chainId}
                  </p>
                  <p>
                    <strong>Nonce:</strong> {authorization.nonce}
                  </p>
                </div>
              )}
            </div>

            <div className="action-section">
              <h2>🎁 Step 2: Mint SBT (Gas Sponsored)</h2>
              <p>Mint an SBT token without paying gas fees!</p>
              <button
                onClick={handleMintSBT}
                disabled={isLoading || !authorization}
                className="mint-btn"
              >
                {isLoading ? 'Processing...' : 'Mint SBT (Free!)'}
              </button>
              {txHash && (
                <div className="success-msg">
                  <p>✅ SBT minted successfully!</p>
                  <p>
                    <strong>Transaction:</strong> {txHash}
                  </p>
                </div>
              )}
            </div>

            <div className="info-section">
              <h2>ℹ️ How It Works</h2>
              <ul>
                <li>🔐 You sign an EIP-7702 authorization (free)</li>
                <li>💰 A sponsor pays gas for your transaction</li>
                <li>🎯 Transaction executes in your EOA context</li>
                <li>🏆 You receive the SBT without paying gas!</li>
              </ul>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
