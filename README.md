# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f592be55-d121-4e85-a0f0-a084964411fb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f592be55-d121-4e85-a0f0-a084964411fb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f592be55-d121-4e85-a0f0-a084964411fb) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)



# Initialize a new npm project (if not already done)
npm init -y

# Install core dependencies
npm install react react-dom react-router-dom vite typescript @vitejs/plugin-react-swc

# Install Tailwind CSS and its peer dependencies
npm install -D tailwindcss postcss autoprefixer

# Install additional project-specific dependencies
npm install @reduxjs/toolkit react-redux
npm install shadcn-ui
npm install jwt-decode
npm install @tanstack/react-query
npm install lucide-react
npm install tailwindcss-animate
npm install zod
npm install react-hook-form @hookform/resolvers
npm install i18next react-i18next
npm install date-fns

# Initialize Tailwind CSS configuration
npx tailwindcss init -p



npm -v
11.2.0

node -v
v20.18.2
