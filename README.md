# Lenguaje de Señas - Sign Language Translation System

A full-stack application that translates sign language gestures into text using computer vision and machine learning. The system consists of a Next.js frontend and an Express.js backend.

## Project Structure

```
.
├── vanessa/                 # Frontend (Next.js application)
│   ├── .next/              # Next.js build output
│   ├── node_modules/       # Frontend dependencies
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   └── app/            # Next.js app directory
│   │       ├── page.js     # Main page component
│   │       ├── layout.js   # Root layout component
│   │       ├── globals.css # Global styles
│   │       └── favicon.ico # Site icon
│   ├── .eslintrc.json     # ESLint configuration
│   ├── .gitignore         # Git ignore rules
│   ├── jsconfig.json      # JavaScript configuration
│   ├── next.config.js     # Next.js configuration
│   ├── package.json       # Frontend dependencies and scripts
│   ├── package-lock.json  # Dependency lock file
│   ├── postcss.config.js  # PostCSS configuration
│   └── tailwind.config.js # TailwindCSS configuration
│
└── backend/                # Backend (Express.js server)
    ├── node_modules/      # Backend dependencies
    ├── lds_input.txt      # Sign language input data
    ├── index.js           # Main server file
    ├── util-functions.js  # Utility functions
    ├── test.js           # Test file
    ├── package.json      # Backend dependencies and scripts
    └── package-lock.json # Dependency lock file
```

## Technologies Used

### Frontend
- Next.js 13.5.6
- React 18
- TailwindCSS
- Axios
- Gifuct-js (for GIF processing)

### Backend
- Express.js
- OpenAI API
- CORS
- Gifuct-js
- XHR2

## Features

- Real-time sign language gesture recognition
- GIF processing and analysis
- Text translation from sign language
- Modern and responsive user interface
- RESTful API backend

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Sign language images/GIFs for processing (see Note below)

### Note on Image Requirements
Before running the application, you need to:
1. Prepare your own sign language images or GIFs
2. Place them in the appropriate directory in the `public` folder
3. Update the application code to reference your specific images
4. Modify the backend processing logic if needed to match your image format and requirements

The current implementation is set up to process specific sign language gestures. You'll need to customize the code to work with your own image set and requirements.

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install frontend dependencies:
```bash
cd vanessa
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
node index.js
```

2. Start the frontend development server:
```bash
cd vanessa
npm run dev
```

The application will be available at `http://localhost:3000`

## Development

- Frontend runs on port 3000
- Backend runs on port 3001
- Uses ESLint for code linting
- Configured with TailwindCSS for styling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
