import express from 'express';
import cors from 'cors';
import { joinGasDaddyPlan, getSponsorInfo } from './gasdaddy-service.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'GasDaddy Backend API',
  });
});

// Get sponsor information
app.get('/api/sponsor-info', (req, res) => {
  try {
    const info = getSponsorInfo();
    res.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error('Error getting sponsor info:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// User joins GasDaddy plan
app.post('/api/join-gasdaddy', async (req, res) => {
  try {
    const { authorization } = req.body;

    // Validate required parameters
    if (!authorization) {
      return res.status(400).json({
        success: false,
        error: 'Missing authorization parameter',
      });
    }

    if (
      !authorization.address ||
      !authorization.chainId ||
      authorization.nonce === undefined
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid authorization format. Required: address, chainId, nonce',
      });
    }

    console.log(
      '📝 Received EIP-7702 setup request from:',
      authorization.address
    );
    console.log('🔗 Chain ID:', authorization.chainId);
    console.log('🔢 Nonce:', authorization.nonce);

    // Execute EIP-7702 setup transaction
    const result = await joinGasDaddyPlan(authorization);

    res.json({
      success: true,
      message: 'Successfully set up EIP-7702 delegation for GasDaddy!',
      data: result,
    });
  } catch (error) {
    console.error('❌ Error in /api/join-gasdaddy:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 GasDaddy Backend API started!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log('🔍 Health check: GET /health');
  console.log('📊 Sponsor info: GET /api/sponsor-info');
  console.log('🎯 Join GasDaddy: POST /api/join-gasdaddy');
  console.log('');
  console.log('💡 Example request:');
  console.log('POST /api/join-gasdaddy');
  console.log(
    JSON.stringify(
      {
        authorization: {
          address: '0x...',
          chainId: 11155111,
          nonce: 0,
        },
      },
      null,
      2
    )
  );
});
