import { useRef, useState } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';
import { ContentPage } from './ContentPage';
import { CoverPage } from './CoverPage';
import { data } from './data';

const BookContainer = styled.div`
  font-family: 'GE-Dinar-medium';
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  padding-bottom: 20px;
  margin: 20px;
  padding: 10px;
  // max-height: 80vh;
  border: 1px solid #000;
`;

const NavigationButtons = styled.div`
  font-family: 'GE-Dinar-medium';

  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 32px auto;    /* ← auto on left/right to center */
  padding: 16px;
  background-color: #dde2e8;
  border-radius: 12px;

  button {
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
  }
`;


const Label = styled.span`
  font-family: 'GE-Dinar-medium';
  font-size: 18px;
  font-weight: 500;
  color: #0f172a;
`;

export const BookViewer = () => {
  const { cover_pages, pages_predefined_texts, cover_pages_predefined_texts, pages } = data;
  const pageDimensions = cover_pages.dimensions;
  const totalPages = 2 + pages.pdf.length;

  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState(totalPages);

  // Map predefined texts
  const predefinedPagesMap = {};
  pages_predefined_texts.forEach(page => {
    predefinedPagesMap[parseInt(page.page, 10)] = page.predefined_texts;
  });

  // FlipBook event handler
  const onFlip = (e) => {
    setCurrentPage(e.data);
  };

  const goToPrevPage = () => flipBookRef.current.pageFlip().flipPrev();
  const goToNextPage = () => flipBookRef.current.pageFlip().flipNext();
  const goToFirstPage = () => flipBookRef.current.pageFlip().flip(0);
  const goToLastPage = () => flipBookRef.current.pageFlip().flip(totalPages);

  return (
    <>
      <BookContainer>
        <HTMLFlipBook
          ref={flipBookRef}
          width={pageDimensions.width}
          height={pageDimensions.height}
          size="fixed"
          maxShadowOpacity={0.5}
          showCover
          mobileScrollSupport
          usePortrait={false}
          direction="ltr"
          startPage={currentPage}
          onFlip={onFlip}
        >
          {/* Back Cover */}
          <div className="book-page">
            <CoverPage
              image={cover_pages.pdf[1]}
              dimensions={pageDimensions}
              predefinedTexts={cover_pages_predefined_texts[1]?.predefined_texts}
            />
          </div>

          {/* Inner Back Cover */}
          <div className="book-page">
            <ContentPage
              pageNumber={pages.pdf.length + 1}
              image={"https://basmti.fra1.digitaloceanspaces.com/uploads/17466203362-1.png"}
              dimensions={pageDimensions}
              predefinedTexts={[]}
            />
          </div>

          {/* Content Pages */}
          {[...pages.pdf].reverse().map((pdfUrl, index) => {
            const origIndex = pages.pdf.length - 1 - index;
            const pageNum = origIndex + 1;
            const texts = predefinedPagesMap[pageNum] || [];
            const img = pdfUrl.endsWith(`-${pageNum}.png`) ? pdfUrl : undefined;

            return (
              <div key={origIndex} className="book-page">
                <ContentPage
                  pageNumber={pageNum}
                  image={img}
                  dimensions={pageDimensions}
                  predefinedTexts={texts}
                />
              </div>
            );
          })}

          {/* Front Cover */}
          <div className="book-page">
            <CoverPage
              image={cover_pages.pdf[0]}
              dimensions={pageDimensions}
              predefinedTexts={cover_pages_predefined_texts[0]?.predefined_texts}
            />
          </div>
        </HTMLFlipBook>
      </BookContainer>

      <NavigationButtons>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>
          <FaAngleDoubleLeft />
        </button>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          <FaAngleLeft />
        </button>
         <Label>لتصفح القصة</Label>
        {/* <Label>Page: {currentPage} / {totalPages}</Label> */}
        <button onClick={goToPrevPage} disabled={currentPage === 0}>
          <FaAngleRight />
        </button>
        <button onClick={goToFirstPage} disabled={currentPage === 0}>
          <FaAngleDoubleRight />
        </button>
      </NavigationButtons>
    </>
  );
};
