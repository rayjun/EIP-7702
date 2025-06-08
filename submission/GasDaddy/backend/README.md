# GasDaddy Backend API

GasDaddy backend service providing EIP-7702 Gas sponsorship functionality.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file, set SPONSOR_PRIVATE_KEY

# Start development server
npm run dev

# Start production server
npm start
```

## 📋 Environment Configuration

Create `.env` file:

```env
SPONSOR_PRIVATE_KEY=0x... # Sponsor's private key for paying gas fees
PORT=3001                 # Server port (optional, default 3001)
```

## 🔧 API Endpoints

### Health Check

```
GET /health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "GasDaddy Backend API"
}
```

### Get Sponsor Information

```
GET /api/sponsor-info
```

Response:

```json
{
  "success": true,
  "data": {
    "sponsorAddress": "0x5aAea05cfB2e24D1208ac05cA42b3b2219d48146",
    "gasDaddyContract": "0x2666c4F3B213957d529A1628316Ac9926Da4875C",
    "supportedChains": ["Sepolia"],
    "description": "GasDaddy - EIP-7702 Gas Sponsorship Service"
  }
}
```

### Set Up EIP-7702 Delegation

```
POST /api/join-gasdaddy
```

Request body:

```json
{
  "authorization": {
    "address": "0x...", // User EOA address
    "chainId": 11155111, // Chain ID (Sepolia)
    "nonce": 0 // Authorization nonce
  }
}
```

**Note**: This endpoint is only used to submit type-4 EIP-7702 transactions to set the user's EOA to use GasDaddy contract code. It doesn't execute specific function calls, only establishes code delegation relationship.

Response:

```json
{
  "success": true,
  "message": "Successfully set up EIP-7702 delegation for GasDaddy!",
  "data": {
    "success": true,
    "transactionHash": "0x...",
    "blockNumber": "12345",
    "gasUsed": "21000",
    "userAddress": "0x...",
    "sponsorAddress": "0x...",
    "gasDaddyContract": "0x2666c4F3B213957d529A1628316Ac9926Da4875C",
    "message": "EOA successfully configured for GasDaddy sponsorship"
  }
}
```

## 🛠️ Technical Implementation

### EIP-7702 Workflow

1. **User creates authorization**: Frontend generates EIP-7702 authorization object
2. **Submit to backend**: Send authorization to `/api/join-gasdaddy` endpoint
3. **Sponsor executes**: Backend uses sponsor account to submit type-4 transaction
4. **Establish delegation**: User EOA is set to use GasDaddy contract code
5. **Complete setup**: User EOA can now execute GasDaddy functions

### Core Files

- `src/index.js` - Express server and API routes
- `src/gasdaddy-service.js` - EIP-7702 core business logic
- `src/config.js` - Wallet and contract configuration
- `src/contracts.js` - GasDaddy contract ABI

## 🔐 Security Considerations

- Ensure `SPONSOR_PRIVATE_KEY` security
- Use testnet for development and testing
- Use appropriate key management services in production

## 📊 Monitoring and Logging

Server logs all important operations:

- API request logs
- EIP-7702 transaction status
- Gas usage
- Error information

## 🧪 Testing

```bash
# Health check
curl http://localhost:3001/health

# Get sponsor info
curl http://localhost:3001/api/sponsor-info

# Test EIP-7702 setup (requires valid authorization)
curl -X POST http://localhost:3001/api/join-gasdaddy \
  -H "Content-Type: application/json" \
  -d '{"authorization": {...}}'
```
