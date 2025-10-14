import type { Preview } from '@storybook/react-webpack5'
import '../src/styles/index.css';

// Google Fonts와 Font Awesome 로드
const link1 = document.createElement('link');
link1.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
link1.rel = 'stylesheet';
document.head.appendChild(link1);

const link2 = document.createElement('link');
link2.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css';
link2.rel = 'stylesheet';
document.head.appendChild(link2);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;