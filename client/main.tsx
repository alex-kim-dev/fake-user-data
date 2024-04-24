import '~/main.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <h1 className='text-center my-5'>Fake user data web app</h1>
  </StrictMode>,
);
