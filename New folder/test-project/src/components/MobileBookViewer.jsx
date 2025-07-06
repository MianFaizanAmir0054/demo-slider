import styled from 'styled-components';
import { CoverPage } from './CoverPage';
import { ContentPage } from './ContentPage';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import { useState } from 'react';
import { data } from './data';

const SliderContainer = styled.div`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 20px 0;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SliderTrack = styled.div`
  display: flex;
  width: max-content;
  gap: 0;
  padding: 0 calc(50vw - min(42.5vw, 42.5vh));
`;

const BookPage = styled.div`
  scroll-snap-align: center;
  width: min(85vw, 85vh);
  height: min(85vw, 85vh);
  max-width: 450px;
  max-height: 450px;
  min-width: 280px;
  min-height: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  flex-shrink: 0;
  margin: 0 8px;
  padding: 5px;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  & > div {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 4px;
  }
`;

const NavigationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 20px auto;
  padding: 16px;
  background-color: #dde2e8;
  border-radius: 12px;
  min-width: 95vw;
`;

const NavButton = styled.button`
  background-color: #0cdfbf;
  border: none;
  color: black;
  font-size: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transition: background 0.2s;

  &:hover {
    background-color: #0ea5e9;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const Label = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #0f172a;
  font-family: 'Cairo', sans-serif;
`;

export const MobileBookViewer = () => {
  const {
    cover_pages,
    pages_predefined_texts,
    cover_pages_predefined_texts,
    pages
  } = data;

  const predefinedPagesMap = {};
  pages_predefined_texts.forEach(page => {
    predefinedPagesMap[parseInt(page.page, 10)] = page;
  });

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.pdf.length + 2; // +2 for covers

  const scrollToPage = (index) => {
    const pageElement = document.getElementById(`page-${index}`);
    if (pageElement) {
      pageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setCurrentPage(index);
    }
  };

  const goToFirst = () => scrollToPage(0);
  const goToPrev = () => scrollToPage(Math.max(0, currentPage - 1));
  const goToNext = () => scrollToPage(Math.min(totalPages - 1, currentPage + 1));
  const goToLast = () => scrollToPage(totalPages - 1);

  return (
    <div style={{ position: 'relative' }}>
      <SliderContainer>
        <SliderTrack>
          {/* Front Cover */}
          <BookPage id="page-0">
            <div>
              <CoverPage
                image={cover_pages.pdf[0]}
                dimensions={{ mode: 'responsive' }}
                predefinedTexts={cover_pages_predefined_texts[0]?.predefined_texts || []}
                $isCover={true}
              />
            </div>
          </BookPage>

          {/* Content Pages */}
          {pages.pdf.map((pdfUrl, index) => (
            <BookPage key={index} id={`page-${index + 1}`}>
              <div>
                <ContentPage
                  pageNumber={index + 1}
                  image={pdfUrl}
                  dimensions={{ mode: 'responsive' }}
                  predefinedTexts={predefinedPagesMap[index + 1]?.predefined_texts || []}
                />
              </div>
            </BookPage>
          ))}

          {/* Back Cover */}
          <BookPage id={`page-${totalPages - 1}`}>
            <div>
              <CoverPage
                image={cover_pages.pdf[1]}
                dimensions={{ mode: 'responsive' }}
                predefinedTexts={cover_pages_predefined_texts[1]?.predefined_texts || []}
                $isCover={true}
              />
            </div>
          </BookPage>
        </SliderTrack>
      </SliderContainer>

      <div class="navigation-container">
        <NavigationControls>
        <NavButton onClick={goToFirst} disabled={currentPage === 0}>
          <FaAngleDoubleLeft size={20} />
        </NavButton>
        <NavButton onClick={goToPrev} disabled={currentPage === 0}>
          <FaAngleLeft size={20} />
        </NavButton>
        <Label>لتصفح القصة</Label>
        <NavButton onClick={goToNext} disabled={currentPage === totalPages - 1}>
          <FaAngleRight size={20} />
        </NavButton>
        <NavButton onClick={goToLast} disabled={currentPage === totalPages - 1}>
          <FaAngleDoubleRight size={20} />
        </NavButton>
      </NavigationControls>
      </div>
    </div>
  );
};