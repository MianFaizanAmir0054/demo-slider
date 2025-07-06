import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';
import { ContentPage } from './ContentPage';
import { CoverPage } from './CoverPage';

import { useRef, useState } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { data } from './data';

const BookContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  padding-bottom: 20px;
  margin: 20px;
  padding: 10px;
  border: 1px solid #000;

  .book-page {
    display: flex;
    background: white;

    .page-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 32px 0;
  padding: 16px;
  background-color: #dde2e8;
  border-radius: 12px;

  button {
    background-color: #0cdfbf; // teal-400
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
      background-color: #0ea5e9; // teal-500
    }
  }
`;

const Label = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #0f172a; // dark navy
  font-family: 'Cairo', sans-serif;
`;

export const BookViewer = () => {
  const {
    cover_pages,
    pages_predefined_texts,
    cover_pages_predefined_texts,
    pages
  } = data;

  const pageDimensions = cover_pages.dimensions;
  const flipBook = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2 + pages.pdf.length;

  const predefinedPagesMap = {};
  pages_predefined_texts.forEach(page => {
    predefinedPagesMap[parseInt(page.page, 10)] = page;
  });

  const onPageChange = (e) => {
    setCurrentPage(e.data);
  };

  const goToPrevPage = () => {
    flipBook.current.pageFlip().flipPrev();
  };

  const goToNextPage = () => {
    flipBook.current.pageFlip().flipNext();
  };

  const goToFirstPage = () => {
    flipBook.current.pageFlip().flip(0);
  };

  const goToLastPage = () => {
    flipBook.current.pageFlip().flip(totalPages);
  };

  return (
    <>
    <BookContainer>
      <HTMLFlipBook
        ref={flipBook}
        width={pageDimensions.width}
        height={pageDimensions.height}
        size="fixed"
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        usePortrait={false}
        direction="ltr"
        startPage={totalPages}
        onFlip={onPageChange}
      >
        {/* Back Cover (page 0) */}
        <div className="book-page">
          <div className="page-wrapper">
            <CoverPage
              image={cover_pages.pdf[1]}
              dimensions={pageDimensions}
              predefinedTexts={cover_pages_predefined_texts[1]?.predefined_texts}
            />
          </div>
        </div>

        <div className="book-page">
          <div className="page-wrapper">
            <ContentPage
              pageNumber={pages.pdf.length + 1}
              image={"https://basmti.fra1.digitaloceanspaces.com/uploads/17466203362-1.png"}
              dimensions={pageDimensions}
              predefinedTexts={[]}
            />
          </div>
        </div>

        {/* Content Pages */}
        {[...pages.pdf].reverse().map((pdfUrl, index) => {
          const originalIndex = pages.pdf.length - 1 - index;
          const pageNumber = originalIndex + 1;

          const predefinedPage = predefinedPagesMap[pageNumber];
          const pageNumberForPage = predefinedPage ? parseInt(predefinedPage.page, 10) : null;
          const pageTexts = predefinedPage?.predefined_texts;

          const image = pdfUrl.endsWith(`-${pageNumber}.png`) ? pdfUrl : undefined;
          const text = pageNumberForPage === pageNumber && Array.isArray(pageTexts) ? pageTexts : [];
          
          return (
            <div key={originalIndex} className="book-page">
              <div className="page-wrapper">
                <ContentPage
                  pageNumber={pageNumber}
                  image={image}
                  dimensions={pageDimensions}
                  predefinedTexts={text}
                />
              </div>
            </div>
          );
        })}

        {/* Front Cover (last page) */}
        <div className="book-page">
          <div className="page-wrapper">
            <CoverPage
              image={cover_pages.pdf[0]}
              dimensions={pageDimensions}
              predefinedTexts={cover_pages_predefined_texts[0]?.predefined_texts}
            />
          </div>
        </div>
      </HTMLFlipBook>
    </BookContainer>
    <NavigationButtons>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>
          <FaAngleDoubleRight />
        </button>
        <button onClick={goToNextPage} disabled={currentPage === 0}>
          <FaAngleRight />
        </button>
        <Label>لتصفح القصة</Label>
        <button onClick={goToPrevPage} disabled={currentPage === totalPages - 1}>
          <FaAngleLeft />
        </button>
        <button onClick={goToFirstPage} disabled={currentPage === 0}>
          <FaAngleDoubleLeft/>
        </button>
      </NavigationButtons>
    </>
  );
};