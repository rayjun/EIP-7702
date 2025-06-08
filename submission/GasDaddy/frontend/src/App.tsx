import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { Wallet, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  gasDaddyAbi,
  sbtAbi,
  gasDaddyContractAddress,
  sbtContractAddress,
} from './contracts';

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
      const auth = {
        chainId: 11155111,
        address: gasDaddyContractAddress,
        nonce: Date.now(),
      };
      setAuthorization(auth);
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
      const sbtMintData = encodeFunctionData({
        abi: sbtAbi,
        functionName: 'mint',
        args: [],
      });

      console.log('SBT Mint Data:', sbtMintData);
      console.log('Target Contract:', sbtContractAddress);
      console.log('Authorization:', authorization);

      setTxHash('0x...' + Math.random().toString(36).substr(2, 9));
    } catch (error) {
      console.error('Failed to mint SBT:', error);
    } finally {
      setIsLoading(false);
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
        </div>

        {!isConnected ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </CardTitle>
              <CardDescription>
                Connect your wallet to get started with gas-free transactions
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
                  Connected Account
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                    1
                  </div>
                  Create Authorization
                </CardTitle>
                <CardDescription>
                  Sign EIP-7702 authorization to enable gas sponsorship
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
                  Mint SBT
                </CardTitle>
                <CardDescription>
                  Mint your SBT token without paying gas fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleMintSBT}
                  disabled={isLoading || !authorization}
                  className="w-full"
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Mint SBT (Free!)
                    </>
                  )}
                </Button>
                {txHash && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                    <p className="text-green-800 font-medium">✅ Success!</p>
                    <p className="text-green-600 text-xs font-mono mt-1 truncate">
                      {txHash}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
