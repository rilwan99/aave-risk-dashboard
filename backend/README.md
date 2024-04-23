# Backend Repository

This guide provides instructions for setting up the backend environment for this project, including configuration of environment variables.

## Getting Started

### Prerequisites

Before you start, make sure you have Node.js installed on your machine. This project uses npm as its package manager.

### Installation

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a .env file and add the following environment variables
    ```bash
    ALCHEMY_RPC=[Your Alchemy RPC URL]
    AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS=0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3
    COINMARKETCAP_API_KEY=[Your CoinMarketCap API Key]   
    ```
- `ALCHEMY_RPC`: Can be created on [Alchemy](https://www.alchemy.com/).
- `AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS`: Ethereum address for the Aave protocol data provider.
- `COINMARKETCAP_API_KEY`: Can be obtained by registering at [CoinMarketCap](https://coinmarketcap.com/api/documentation/v1/).


### Running the application
1. To start production server
   ```bash
   npm run start
   ```
2. To start development server (uses `nodemon` for hot reloading)
    ```bash
    npm run dev
    ```

## Directory structure
- `/api`: Defines API routes for fetching data.
- `/config`: Contains ethConfig.js which creates an ethers.js provider.
- `/services`:
  - `aaveService.js`: Contains logic for reading contract data from on-chain contracts.
  - `priceService.js`: Contains logic for fetching cryptocurrency price data from CoinMarketCap.
- `helpers.js`: Helper functions for formatting responses.