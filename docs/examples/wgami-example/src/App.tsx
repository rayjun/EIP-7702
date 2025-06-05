import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWalletClient,
  usePublicClient,
} from 'wagmi';

interface AuthorizationResult {
  chainId: number;
  address: string;
  nonce: string;
  r?: string;
  s?: string;
  yParity?: number;
}

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // State for EIP-7702 example
  const [authorization, setAuthorization] =
    useState<AuthorizationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          border: '2px solid #007bff',
          borderRadius: '8px',
        }}
      >
        <h2>🚀 EIP-7702 Gas Sponsorship Example</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This example demonstrates how one account (sponsor) can pay gas fees
          for another account's (user) EIP-7702 transaction.
        </p>

        {/* Step 1: Generate Authorization */}
        <div
          style={{
            marginBottom: '30px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
          }}
        >
          <h3>📝 Step 1: Generate User Authorization</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Connect as the <strong>user account</strong> and generate an
            authorization signature.
          </p>

          <div style={{ marginBottom: '15px' }}>
            <strong>Current Account:</strong>{' '}
            {account.address || 'Not connected'}
            <br />
            <strong>Chain ID:</strong> {account.chainId || 'Unknown'}
          </div>

          <button
            type="button"
            disabled={!walletClient || !account.address || isGenerating}
            onClick={async () => {
              if (!walletClient || !account.address || !publicClient) return;

              setIsGenerating(true);
              try {
                // Save user address for later reference
                setUserAddress(account.address);

                const chainId = account.chainId || 11155111;
                const nonce = await publicClient.getTransactionCount({
                  address: account.address,
                });

                const authorizationData = {
                  chainId: chainId,
                  address: '0x0c8717e655B69310f4bBde993eE41254ac61d3A7', // Target contract
                  nonce: nonce.toString(),
                };

                const typedData = {
                  domain: {
                    name: 'EIP-7702 Authorization',
                    version: '1',
                    chainId: authorizationData.chainId,
                  },
                  types: {
                    Authorization: [
                      { name: 'chainId', type: 'uint256' },
                      { name: 'address', type: 'address' },
                      { name: 'nonce', type: 'uint256' },
                    ],
                  },
                  primaryType: 'Authorization' as const,
                  message: {
                    chainId: authorizationData.chainId,
                    address: authorizationData.address,
                    nonce: nonce,
                  },
                };

                console.log('Signing authorization for user:', account.address);
                const signature = await walletClient.signTypedData(typedData);

                const r = signature.slice(0, 66) as `0x${string}`;
                const s = `0x${signature.slice(66, 130)}` as `0x${string}`;
                const v = parseInt(signature.slice(130, 132), 16);
                const yParity = v === 27 ? 0 : 1;

                const completeAuthorization: AuthorizationResult = {
                  ...authorizationData,
                  r,
                  s,
                  yParity,
                };

                setAuthorization(completeAuthorization);
                console.log('Authorization generated:', completeAuthorization);
                alert(
                  '✅ Authorization generated! Now switch to sponsor account for Step 2.'
                );
              } catch (error) {
                console.error('Failed to generate authorization:', error);
                alert(
                  'Failed to generate authorization. Check console for details.'
                );
              } finally {
                setIsGenerating(false);
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            {isGenerating ? 'Generating...' : '📝 Generate Authorization'}
          </button>

          {!walletClient && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              Please connect your wallet first
            </p>
          )}
        </div>

        {/* Authorization Display */}
        {authorization && (
          <div
            style={{
              marginBottom: '30px',
              padding: '15px',
              backgroundColor: '#e8f5e9',
              borderRadius: '5px',
            }}
          >
            <h4>✅ Authorization Generated</h4>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              <strong>User Address:</strong> {userAddress}
              <br />
              <strong>Target Contract:</strong> {authorization.address}
              <br />
              <strong>Chain ID:</strong> {authorization.chainId}
              <br />
              <strong>Nonce:</strong> {authorization.nonce}
              <br />
              <strong>r:</strong> {authorization.r}
              <br />
              <strong>s:</strong> {authorization.s}
              <br />
              <strong>yParity:</strong> {authorization.yParity}
            </div>
          </div>
        )}

        {/* Step 2: Sponsor Transaction */}
        <div
          style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '5px',
          }}
        >
          <h3>💰 Step 2: Sponsor Transaction</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Switch MetaMask to the <strong>sponsor account</strong> and execute
            the EIP-7702 transaction. The sponsor will pay gas fees for the
            user's account delegation.
          </p>

          <div style={{ marginBottom: '15px' }}>
            <strong>Current Account (Sponsor):</strong>{' '}
            {account.address || 'Not connected'}
            <br />
            <strong>User Address:</strong>{' '}
            {userAddress || 'Generate authorization first'}
            <br />
            <strong>Status:</strong>{' '}
            {authorization
              ? account.address === userAddress
                ? '⚠️ Please switch to a different account (sponsor)'
                : '✅ Ready to sponsor transaction'
              : '❌ Need authorization from Step 1'}
          </div>

          <button
            type="button"
            disabled={
              !authorization ||
              !walletClient ||
              !account.address ||
              isExecuting ||
              account.address === userAddress
            }
            onClick={async () => {
              if (
                !walletClient ||
                !account.address ||
                !authorization ||
                !userAddress
              )
                return;

              setIsExecuting(true);
              try {
                console.log('Sponsor account:', account.address);
                console.log('User account:', userAddress);
                console.log('Authorization:', authorization);

                // Create the EIP-7702 transaction with authorization
                const txParams = {
                  authorizationList: [
                    {
                      address: authorization.address as `0x${string}`,
                      chainId: authorization.chainId,
                      nonce: parseInt(authorization.nonce),
                      r: authorization.r as `0x${string}`,
                      s: authorization.s as `0x${string}`,
                      v: BigInt(authorization.yParity === 0 ? 27 : 28),
                      yParity: authorization.yParity,
                    },
                  ],
                  to: userAddress as `0x${string}`, // Send to user's EOA
                  data: '0xbc9748a1' as `0x${string}`, // Empty data for simple delegation
                };

                console.log(
                  'Sending sponsored EIP-7702 transaction:',
                  txParams
                );

                const tx = await walletClient.sendTransaction(txParams);

                console.log('Sponsored transaction sent:', tx);
                alert(
                  `✅ Sponsored EIP-7702 transaction sent!\n\nTx Hash: ${tx}\n\nThe sponsor (${account.address}) paid gas fees to delegate contract ${authorization.address} to user's EOA (${userAddress}).`
                );

                // Reset for next example
                setAuthorization(null);
                setUserAddress('');
              } catch (error) {
                console.error('Failed to send sponsored transaction:', error);
                alert(
                  'Failed to send sponsored transaction. Check console for details.'
                );
              } finally {
                setIsExecuting(false);
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor:
                authorization && account.address !== userAddress
                  ? '#007bff'
                  : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor:
                authorization && account.address !== userAddress
                  ? 'pointer'
                  : 'not-allowed',
            }}
          >
            {isExecuting ? 'Executing...' : '💰 Send Sponsored Transaction'}
          </button>

          {!authorization && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              Complete Step 1 first
            </p>
          )}
          {authorization && account.address === userAddress && (
            <p style={{ color: 'orange', marginTop: '10px' }}>
              Please switch to a different account to act as sponsor
            </p>
          )}
        </div>

        {/* Instructions */}
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#d1ecf1',
            borderRadius: '5px',
          }}
        >
          <h4>📋 Instructions:</h4>
          <ol>
            <li>
              <strong>Connect as User:</strong> Connect your wallet with the
              account that will receive the delegation
            </li>
            <li>
              <strong>Generate Authorization:</strong> Click "Generate
              Authorization" to create and sign the authorization
            </li>
            <li>
              <strong>Switch to Sponsor:</strong> Change your wallet to a
              different account that will pay gas fees
            </li>
            <li>
              <strong>Send Transaction:</strong> Click "Send Sponsored
              Transaction" to execute the EIP-7702 transaction
            </li>
          </ol>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            <strong>Note:</strong> This example requires a network that supports
            EIP-7702. Make sure you're connected to a compatible testnet.
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
