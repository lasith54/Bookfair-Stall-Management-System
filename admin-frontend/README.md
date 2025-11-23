# Admin Frontend Project

This project is an administrator frontend for the Bookfair Stall Management System. It utilizes an existing authentication service from the backend to manage user authentication for administrators.

## Project Structure

```
admin-frontend
├── src
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   ├── pages
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── components
│   │   ├── Header.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ui
│   │       └── button.tsx
│   ├── contexts
│   │   └── AuthContext.tsx
│   ├── services
│   │   └── authService.ts
│   ├── lib
│   │   ├── api.ts
│   │   └── utils.ts
│   └── assets
├── public
├── components.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── index.html
├── .env
├── .gitignore
└── README.md
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd admin-frontend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the necessary environment variables, such as API endpoints.

4. **Run the application**:
   ```
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000` (or the port specified in your configuration).

## Features

- **Authentication**: Users can log in and register using the authentication service.
- **Protected Routes**: Certain routes are protected and require authentication to access.
- **Responsive Design**: The application is designed to be responsive and user-friendly.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.