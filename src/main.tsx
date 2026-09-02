import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { FlipProvider } from '@/store/FlipContext';
import { ShopProvider } from '@/store/ShopContext';
import { UiProvider } from '@/store/UiContext';
import '@/index.css';

const container = document.querySelector('#root');

if (!container) {
  throw new Error('Root container is missing from index.html');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <ShopProvider>
        <UiProvider>
          <FlipProvider>
            <App />
          </FlipProvider>
        </UiProvider>
      </ShopProvider>
    </BrowserRouter>
  </StrictMode>,
);
