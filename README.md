# Astrobase - Vedic Astrology & NFT App

This is a full-stack web application that provides users with a Vedic Astrology chart and an AI-powered chat assistant to answer questions about it. It also features the ability to mint a unique Zodiac NFT based on the user's astrological sign to their wallet on the Base Goerli testnet.

## Features

- **Vedic Astrology Chart Generation**: Users can enter their birth date, time, and place to generate a chart.
- **AI-Powered Astrologer**: An integrated chat interface allows users to ask questions about their chart, with answers provided by an AI assistant (OpenAI's gpt-4o-mini).
- **Zodiac NFT Minting**: Users can claim a unique ERC-721 NFT representing their zodiac sign on the Base Goerli testnet.
- **Dynamic Place Autocomplete**: The "Place of Birth" input provides city suggestions as the user types, powered by the GeoNames API.
- **Modern Frontend**: A clean, responsive, single-page application with a dark-mode theme, built with Tailwind CSS and vanilla JavaScript.
- **Node.js Backend**: An Express.js server handles API requests, database interactions, and communication with external services.
- **Vercel Ready**: Includes a `vercel.json` configuration file for easy deployment.

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL (`pg`), Axios, OpenAI API
- **Frontend**: HTML, Tailwind CSS (via CDN), Vanilla JavaScript, Ethers.js
- **Smart Contract**: Solidity, OpenZeppelin
- **Deployment**: Vercel

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/)
- A running [PostgreSQL](https://www.postgresql.org/) database.

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <your-repo-url>
cd <your-repo-name>
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the required values:

- `DATABASE_URL`: Your full PostgreSQL connection string.
- `PLANETARY_API_URL`: The URL for the planetary position API.
- `OPENAI_API_KEY`: Your API key for OpenAI.
- `PORT`: The port for the server to run on (e.g., 3000).

### 4. Database Setup

Run the provided script to create the necessary `birth_details` table in your database. This script uses the `DATABASE_URL` from your `.env` file.

```bash
node setup-db.js
```

### 5. Running the Application

Start the Express server:

```bash
npm start
```

The application should now be running at `http://localhost:PORT`.

## Smart Contract Details

The `ZodiacNFT.sol` contract is an ERC-721 token designed to be deployed on the Base Goerli testnet.

- **Deployed Address (Base Goerli)**: `0xA3C8FC43aa968d0000944fe8218eDb7a8825327c`
- **Explorer Link**: [https://goerli.basescan.org/address/0xA3C8FC43aa968d0000944fe8218eDb7a8825327c](https://goerli.basescan.org/address/0xA3C8FC43aa968d0000944fe8218eDb7a8825327c)

### Important: Setting Token URIs

Before the minting function will work correctly, the owner of the contract must set the metadata URI for each of the 12 zodiac signs by calling the `setZodiacTokenURI` function. The project includes sample metadata files in the `/metadata` directory.

## Deployment

The application is configured for deployment on Vercel.

1.  Install the Vercel CLI: `npm install -g vercel`
2.  Add your secrets to Vercel:
    ```bash
    vercel secret add database-url "YOUR_DATABASE_URL"
    vercel secret add openai-api-key "YOUR_OPENAI_API_KEY"
    ```
3.  Deploy the application:
    ```bash
    vercel
    ```