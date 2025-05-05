import React from 'react';
import { Toaster } from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ProgressIndicator } from './components/progress-indicator.component';
import { FirstSection } from './sections/first-section.component';
import { StorySectionBasic } from './sections/story-section-basic.component';
import { StorySectionHometown } from './sections/story-section-hometown.component';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProgressIndicator />
    <FirstSection />
    <StorySectionHometown />
    <StorySectionBasic />
    <Toaster />
  </React.StrictMode>,
);
