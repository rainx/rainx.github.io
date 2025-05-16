import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { ProgressIndicator } from './components/progress-indicator.component';
import { FirstSection } from './sections/first-section.component';
import { StorySectionAI } from './sections/story-section-ai.component';
import { StorySectionBasic } from './sections/story-section-basic.component';
import { StorySectionFamily } from './sections/story-section-family.component';
import StorySectionHobbies from './sections/story-section-hobbies.component';
import { StorySectionHometown } from './sections/story-section-hometown.component';
import { StorySectionStartups } from './sections/story-section-startups.component';
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
    <StorySectionStartups />
    <StorySectionFamily />
    <StorySectionHobbies />
    <StorySectionAI />
    <Toaster />
    <Tooltip id="tooltip" />
  </React.StrictMode>,
);
