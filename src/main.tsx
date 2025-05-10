import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { ProgressIndicator } from './components/progress-indicator.component';
import { FirstSection } from './sections/first-section.component';
import { StorySectionBasic } from './sections/story-section-basic.component';
import { StorySectionHometown } from './sections/story-section-hometown.component';
import { StorySectionTurboC } from './sections/story-section-turbo-c.component';
import { StorySectionWorkExperience } from './sections/story-section-work-experience.component';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProgressIndicator />
    <FirstSection />
    <StorySectionHometown />
    <StorySectionBasic />
    <StorySectionTurboC />
    <StorySectionWorkExperience />
    <Toaster />
    <Tooltip id="tooltip" />
  </React.StrictMode>,
);
