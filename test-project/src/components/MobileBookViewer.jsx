import styled from 'styled-components';
import { CoverPage } from './CoverPage';
import { ContentPage } from './ContentPage';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import { useState, useRef, useEffect, useCallback } from 'react';
import { data } from './data';

// Styled components for the custom scrollbar
const ScrollBarContainer = styled.div`
  font-family: 'GE-Dinar-medium';
  width: 90%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 10px;
  position: relative;
  margin: 15px auto 0;
  cursor: pointer;
`;

const ScrollBarTrack = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
`;

// Thumb now acts as a fill indicating progress
const ScrollBarThumb = styled.div`
  position: absolute;
  height: 100%;
  background-color: #0cdfbf;
  border-radius: 10px;
  transition: width 0.2s ease;
`;

const SliderContainer = styled.div`
  font-family: 'GE-Dinar-medium';
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
direction: ltr;
  display: flex;
  width: max-content;
  gap: 0;
  padding: 0 calc(50vw - min(42.5vw, 42.5vh));
`;

const BookPage = styled.div`
  font-family: 'GE-Dinar-medium';
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
  font-family: 'GE-Dinar-medium';
direction: rtl;
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
  font-family: 'GE-Dinar-medium';
  font-size: 18px;
  font-weight: 500;
  color: #0f172a;
`;

export const MobileBookViewer = () => {
  const {
    cover_pages,
    pages_predefined_texts,
    cover_pages_predefined_texts,
    pages
  } = data;

  // Map predefined texts by page number
  const predefinedPagesMap = {};
  pages_predefined_texts.forEach(page => {
    predefinedPagesMap[parseInt(page.page, 10)] = page;
  });

  const totalPages = pages.pdf.length + 2;
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef(null);
  const pageRefs = useRef([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerSize, setContainerSize] = useState({ scrollWidth: 0, clientWidth: 0 });

  // Update container dimensions
  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      setContainerSize({
        scrollWidth: containerRef.current.scrollWidth,
        clientWidth: containerRef.current.clientWidth
      });
    }
  }, []);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, [updateContainerSize]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollLeft);
        console.log(containerRef.current.scrollLeft);
      }
    };
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate fill percentage for progress bar
  const maxScroll = containerSize.scrollWidth - containerSize.clientWidth;
  const fillPercent = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;

  // Scroll to given page index
  const scrollToPage = (index) => {
    const el = pageRefs.current[index];
    if (el && containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft +
        (elRect.left - containerRect.left) -
        (containerRect.width / 2) +
        (elRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const goToFirst = () => scrollToPage(0);
  const goToPrev = () => scrollToPage(Math.max(0, currentPage - 1));
  const goToNext = () => scrollToPage(Math.min(totalPages - 1, currentPage + 1));
  const goToLast = () => scrollToPage(totalPages - 1);

  // Update current page on view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setCurrentPage(Number(entry.target.getAttribute('data-index')));
          }
        });
      },
      { root: containerRef.current, threshold: 0.5 }
    );
    pageRefs.current.forEach(el => el && observer.observe(el));
    return () => pageRefs.current.forEach(el => el && observer.unobserve(el));
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <SliderContainer ref={containerRef}>
        <SliderTrack>
          {/* Front Cover */}
          <BookPage id="page-0" data-index={0} ref={el => (pageRefs.current[0] = el)}>
            <div>
              <CoverPage
                image={cover_pages.pdf[0]}
                dimensions={{ mode: 'responsive' }}
                predefinedTexts={cover_pages_predefined_texts[0]?.predefined_texts || []}
                $isCover
              />
            </div>
          </BookPage>

          {/* Content Pages */}
          {pages.pdf.map((pdfUrl, i) => (
            <BookPage
              key={i}
              id={`page-${i + 1}`}
              data-index={i + 1}
              ref={el => (pageRefs.current[i + 1] = el)}
            >
              <div>
                <ContentPage
                  pageNumber={i + 1}
                  image={pdfUrl}
                  dimensions={{ mode: 'responsive' }}
                  predefinedTexts={predefinedPagesMap[i + 1]?.predefined_texts || []}
                />
              </div>
            </BookPage>
          ))}

          {/* Back Cover */}
          <BookPage
            id={`page-${totalPages - 1}`}
            data-index={totalPages - 1}
            ref={el => (pageRefs.current[totalPages - 1] = el)}
          >
            <div>
              <CoverPage
                image={cover_pages.pdf[1]}
                dimensions={{ mode: 'responsive' }}
                predefinedTexts={cover_pages_predefined_texts[1]?.predefined_texts || []}
                $isCover
              />
            </div>
          </BookPage>
        </SliderTrack>
      </SliderContainer>

      {/* Progress Fill Bar */}
      {containerSize.scrollWidth > containerSize.clientWidth && (
        <ScrollBarContainer>
          <ScrollBarTrack>
            <ScrollBarThumb style={{ width: `${fillPercent}%`, left: 0 }} />
          </ScrollBarTrack>
        </ScrollBarContainer>
      )}

      <NavigationControls>
        <NavButton onClick={goToNext} disabled={currentPage === totalPages - 1}>
          <FaAngleRight />
        </NavButton>
        <NavButton onClick={goToLast} disabled={currentPage === totalPages - 1}>
          <FaAngleDoubleRight />
        </NavButton>
        <Label>لتصفح القصة</Label>
        <NavButton onClick={goToFirst} disabled={currentPage === 0}>
          <FaAngleDoubleLeft />
        </NavButton>
        <NavButton onClick={goToPrev} disabled={currentPage === 0}>
          <FaAngleLeft />
        </NavButton>
      </NavigationControls>
    </div>
  );
};
