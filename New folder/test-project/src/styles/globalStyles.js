import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'GE-Dinar-Medium';
    src: url('/fonts/GE-Dinar-Medium.woff2') format('woff2'),
         url('/fonts/GE-Dinar-Medium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  body {
    margin: 0;
    padding: 0;
    background: #f0f0f0;
    overflow-x: hidden;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-pageflip {
    direction: rtl;
    perspective: 1500px;
  }

  .react-pageflip .page {
    background: white;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    overflow: visible;
    backface-visibility: hidden;
  }

  .react-pageflip .shadow {
    box-shadow: -15px 0 30px -5px rgba(0, 0, 0, 0.2) !important;
  }
`;