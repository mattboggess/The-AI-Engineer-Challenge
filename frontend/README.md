# OpenAI Chat Frontend

A modern Next.js frontend application for interacting with the OpenAI Chat API backend. This interface provides a streaming chat experience with support for custom system messages and multiple OpenAI models.

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- The backend API running (see `../api/README.md` for setup instructions)

## Setup

1. Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

or

```bash
pnpm install
```

2. (Optional) Configure API URL:

By default, the frontend connects to `http://localhost:8000`. If your backend is running on a different URL, create a `.env.local` file in the `frontend` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production/Vercel deployment, set this environment variable in your Vercel project settings.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

or

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Features

- **Streaming Chat Interface**: Real-time streaming responses from OpenAI
- **Model Selection**: Choose from multiple OpenAI models (gpt-4.1-mini, gpt-4, gpt-4-turbo, gpt-3.5-turbo)
- **System Messages**: Customize the assistant's behavior with developer/system messages
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Clear error messages for API failures
- **Chat History**: View conversation history with clear user/assistant distinction

## Usage

1. (Optional) Select a different model from the dropdown
2. (Optional) Set a custom system/developer message to guide the assistant's behavior
3. Type your message in the chat input area
4. Press Enter (or click Send) to send the message
5. Watch the assistant's response stream in real-time

**Note**: The OpenAI API key must be configured on the backend server via the `OPENAI_API_KEY` environment variable. See the backend README for details.

## Deployment on Vercel

This frontend is configured to work with Vercel. The project root `vercel.json` already includes the necessary configuration.

1. Push your code to a Git repository
2. Import the project in Vercel
3. Set the `NEXT_PUBLIC_API_URL` environment variable if your backend is deployed separately
4. Deploy!

## Architecture

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules for component-scoped styles
- **State Management**: React hooks (useState, useEffect)
- **API Communication**: Fetch API with streaming support

## Security Notes

- The OpenAI API key is configured on the backend server and never exposed to the frontend
- CORS is configured on the backend to allow frontend requests
