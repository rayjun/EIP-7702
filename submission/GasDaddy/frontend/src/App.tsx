import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { encodeFunctionData, createPublicClient, http } from 'viem';
import { hashAuthorization, verifyAuthorization } from 'viem/utils';
import { useWalletClient } from 'wagmi';
import { sepolia } from 'viem/chains';
import {
  Wallet,
  Zap,
  CheckCircle,
  Users,
  HandHeart,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { gasDaddyAbi, gasDaddyContractAddress } from './contracts';

const API_BASE = 'http://localhost:3001';

// Create public client for reading blockchain data
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();

  const [mode, setMode] = useState<'user' | 'sponsor'>('user');
  const [authorization, setAuthorization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [sponsorInfo, setSponsorInfo] = useState<any>(null);
  const [selectedContract, setSelectedContract] = useState<string>(
    '0x639C5620dB9ec2928f426AA8f59fF50eeF67E378'
  );
  const [selectedMethod, setSelectedMethod] = useState<string>('mint');
  const [shareUrl, setShareUrl] = useState<string>('');

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  const handleCreateAuthorization = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      // Get the current nonce for the user's EOA
      const nonce = await publicClient.getTransactionCount({
        address: address,
      });

      if (!walletClient) {
        throw new Error('Wallet client is not available');
      }

      const chainId = 11155111; // Sepolia

      // Use viem's hashAuthorization utility to create the authorization hash
      // This handles the RLP encoding and EIP-7702 formatting internally
      const authorizationHash = hashAuthorization({
        contractAddress: gasDaddyContractAddress,
        chainId: chainId,
        nonce: nonce,
      });

      // Sign the authorization hash using the wallet
      const signature = await walletClient.signMessage({
        message: { raw: authorizationHash },
      });

      // Parse signature components (r, s, v)
      const r = signature.slice(0, 66) as `0x${string}`;
      const s = ('0x' + signature.slice(66, 130)) as `0x${string}`;
      const v = parseInt(signature.slice(130, 132), 16);
      const yParity = v === 27 ? 0 : 1;

      const authorization = {
        chainId: chainId,
        address: gasDaddyContractAddress,
        nonce: nonce,
        r: r,
        s: s,
        yParity: yParity,
      };

      // todo cannot generate authorization from JSON-RPC account
      // Verify the authorization using viem's verifyAuthorization utility
      const valid = await verifyAuthorization({
        address: address,
        authorization: authorization,
      });
      console.log('✅ Authorization verified:', valid);

      // Convert back to the backend expected format
      const backendAuthorization = {
        chainId: chainId,
        contractAddress: gasDaddyContractAddress,
        nonce: nonce,
        r: r,
        s: s,
        yParity: yParity,
      };

      setAuthorization(backendAuthorization);
      console.log('Authorization created and signed:', backendAuthorization);
    } catch (error) {
      console.error('Failed to create authorization:', error);
      alert('Failed to sign authorization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGasDaddy = async () => {
    if (!authorization) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/join-gasdaddy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorization,
          address: address,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTxHash(result.data.transactionHash);
        console.log('Successfully joined GasDaddy plan:', result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to join GasDaddy plan:', error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSponsorInfo = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/sponsor-info`);
      const result = await response.json();
      if (result.success) {
        setSponsorInfo(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch sponsor info:', error);
    }
  };

  const handleModeChange = () => {
    const newMode = mode === 'user' ? 'sponsor' : 'user';
    setMode(newMode);
    if (newMode === 'sponsor') {
      fetchSponsorInfo();
    }
  };

  // Generate URL when address or selections change
  useEffect(() => {
    if (address && selectedContract && selectedMethod) {
      // Encode the function call data (for mint function with no parameters)
      const data = encodeFunctionData({
        abi: [{ name: 'mint', type: 'function', inputs: [], outputs: [] }],
        functionName: selectedMethod,
      });

      const currentUrl = window.location.origin + window.location.pathname;
      const url = `${currentUrl}?payforme=${address}&targetcontract=${selectedContract}&method=${selectedMethod}&data=${data}`;
      setShareUrl(url);
    }
  }, [address, selectedContract, selectedMethod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            GasDaddy
          </h1>
          <p className="text-gray-600 mt-2">EIP-7702 Gas Sponsorship</p>

          <div className="flex items-center justify-center mt-4 p-2 bg-gray-100 rounded-lg">
            <Users className="h-4 w-4 mr-2" />
            <span
              className={`text-sm font-medium ${
                mode === 'user' ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              User
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleModeChange}
              className="mx-2 p-1"
            >
              {mode === 'user' ? (
                <ToggleLeft className="h-6 w-6" />
              ) : (
                <ToggleRight className="h-6 w-6" />
              )}
            </Button>
            <span
              className={`text-sm font-medium ${
                mode === 'sponsor' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Sponsor
            </span>
            <HandHeart className="h-4 w-4 ml-2" />
          </div>
        </div>

        {!isConnected ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </CardTitle>
              <CardDescription>
                Connect your wallet to get started as a {mode}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  className="w-full"
                  variant="outline"
                >
                  {connector.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Connected as {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs font-mono bg-gray-50 p-2 rounded border truncate">
                  {address}
                </p>
                <Button
                  onClick={() => disconnect()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Disconnect
                </Button>
              </CardContent>
            </Card>

            {mode === 'user' ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                        1
                      </div>
                      Create Authorization
                    </CardTitle>
                    <CardDescription>
                      Create EIP-7702 authorization for gas sponsorship
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleCreateAuthorization}
                      disabled={isLoading || !!authorization}
                      className="w-full"
                    >
                      {isLoading ? (
                        'Creating...'
                      ) : authorization ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Authorization Created
                        </>
                      ) : (
                        'Create Authorization'
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold">
                        1.1
                      </div>
                      Join GasDaddy Plan
                    </CardTitle>
                    <CardDescription>
                      Mint your SBT token without paying gas fees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleJoinGasDaddy}
                      disabled={isLoading || !authorization}
                      className="w-full"
                    >
                      {isLoading ? (
                        'Processing...'
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Join Plan (Free!)
                        </>
                      )}
                    </Button>
                    {txHash && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                        <p className="text-green-800 font-medium">
                          ✅ Success!
                        </p>
                        <p className="text-green-600 text-xs font-mono mt-1 truncate">
                          {txHash}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
                        2
                      </div>
                      Find a Gas Daddy for my call
                    </CardTitle>
                    <CardDescription>
                      Select a contract and method to interact with (this might
                      be done by Chrome extension or dapp):
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Contract Address
                      </label>
                      <select
                        value={selectedContract}
                        onChange={(e) => setSelectedContract(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="0x639C5620dB9ec2928f426AA8f59fF50eeF67E378">
                          0x639C5620dB9ec2928f426AA8f59fF50eeF67E378
                        </option>
                        <option value="0x7f89c8b3F4D3A6b6d09172811747144d070410B7">
                          0x7f89c8b3F4D3A6b6d09172811747144d070410B7
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Method</label>
                      <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="mint">mint</option>
                      </select>
                    </div>

                    {address && shareUrl && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 mb-3">
                          I want to call{' '}
                          <span className="font-mono font-semibold">
                            {selectedContract}
                          </span>{' '}
                          method{' '}
                          <span className="font-mono font-semibold">
                            {selectedMethod}
                          </span>{' '}
                          but I don't have gas to operate. Who can help me? If
                          you pay the gas for me, I'll call you daddy.
                        </p>
                        <p className="text-xs text-blue-600 mb-2">
                          Share this URL:
                        </p>
                        <div className="bg-white p-2 rounded border text-xs font-mono break-all">
                          {shareUrl}
                        </div>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(shareUrl)
                          }
                          className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Copy URL
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandHeart className="h-5 w-5" />
                    Sponsor Dashboard
                  </CardTitle>
                  <CardDescription>
                    Monitor your gas sponsorship activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sponsorInfo ? (
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Sponsor Address:</strong>
                      </p>
                      <p className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                        {sponsorInfo.sponsorAddress}
                      </p>
                      <p>
                        <strong>GasDaddy Contract:</strong>
                      </p>
                      <p className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                        {sponsorInfo.gasDaddyContract}
                      </p>
                      <p>
                        <strong>Supported Chains:</strong>
                      </p>
                      <p className="text-xs">
                        {sponsorInfo.supportedChains.join(', ')}
                      </p>
                      <p>
                        <strong>Description:</strong>
                      </p>
                      <p className="text-xs">{sponsorInfo.description}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Loading sponsor information...
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
