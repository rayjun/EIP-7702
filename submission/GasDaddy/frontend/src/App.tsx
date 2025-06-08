import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import {
  encodeFunctionData,
  createPublicClient,
  http,
  keccak256,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem';
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

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  const handleCreateAuthorization = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      // Get the current nonce for the user's EOA
      // This is critical for EIP-7702: nonce must be the actual transaction count
      // from the user's account, not a random number or timestamp
      const nonce = await publicClient.getTransactionCount({
        address: address,
      });

      // Since wagmi walletClient uses JSON-RPC account which doesn't support signAuthorization,
      // we need to manually construct the EIP-7702 authorization using signMessage
      if (!walletClient) {
        throw new Error('Wallet client is not available');
      }

      // Construct EIP-7702 authorization message according to the standard
      // The message format is: keccak256(abi.encodePacked(chainId, contractAddress, nonce))
      const chainId = 11155111;
      const encodedAuth = encodeAbiParameters(
        parseAbiParameters('uint256, address, uint256'),
        [BigInt(chainId), gasDaddyContractAddress, BigInt(nonce)]
      );

      const authHash = keccak256(encodedAuth);

      // Sign the authorization hash
      const signature = await walletClient.signMessage({
        message: { raw: authHash },
      });

      // Parse signature components (r, s, v)
      const r = signature.slice(0, 66) as `0x${string}`;
      const s = ('0x' + signature.slice(66, 130)) as `0x${string}`;
      const v = parseInt(signature.slice(130, 132), 16);
      const yParity = v === 27 ? 0 : 1;

      const authorization = {
        chainId: chainId,
        contractAddress: gasDaddyContractAddress,
        nonce: nonce,
        r: r,
        s: s,
        yParity: yParity,
      };

      setAuthorization(authorization);
      console.log('Authorization created and signed:', authorization);
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
                        2
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
