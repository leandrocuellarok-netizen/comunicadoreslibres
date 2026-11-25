import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Convert real article URLs into the existing client-side route before React starts.
const articlePath = window.location.pathname.split('/').filter(Boolean);
if (articlePath.length >= 2 && !window.location.hash) {
  const category = articlePath[0];
  const slug = articlePath[1];
  window.location.hash = `#/${category}/${slug}`;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
