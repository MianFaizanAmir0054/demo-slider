import { BookViewer } from './components/BookViewer';
import { MobileBookViewer } from './components/MobileBookViewer';
import { useMediaQuery } from './hooks/useMediaQueryHook';
import { GlobalStyle } from './styles/globalStyles';
import "./App.css";

export default function App() {
  const isMobileOrTablet = useMediaQuery(1024);

  return (
    <>
      <GlobalStyle />
      {isMobileOrTablet ? <MobileBookViewer /> : <BookViewer />}
    </>
  );
}