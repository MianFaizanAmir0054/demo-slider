import React, { useRef, useEffect, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { TextOverlay } from './TextOverlay';

const PageContainer = styled.div`
  position: relative;
  overflow: hidden;
  // background-color: white;
  
  ${props => !props.$isMobile && css`
    width: ${props.$width}px;
    height: ${props.$height}px;
  `}

  ${props => props.$isMobile && css`
    width: 100%;
    height: 100%;
    aspect-ratio: ${props.$aspectRatio};
    padding: 8px; /* Added padding for mobile */
    box-sizing: border-box; /* Include padding in dimensions */
  `}
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const BackgroundImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  // height: 80vh;

`;

export const ContentPage = React.forwardRef(({ 
  pageNumber, 
  image, 
  dimensions = {}, 
  predefinedTexts = [], 
}, ref) => {
  const textRefs = useRef([]);
  const [adjustedTops, setAdjustedTops] = useState([]);
  const isMobile = dimensions.mode === 'responsive';

  // Adjusted dimensions for mobile with padding
  const effectiveDimensions = useMemo(() => ({
    width: dimensions.width || 400,
    height: dimensions.height || 565,
    contentHeight: isMobile ? (dimensions.height || 565) - 16 : (dimensions.height || 565)
  }), [dimensions.width, dimensions.height, isMobile]);

  useEffect(() => {
    if (!predefinedTexts || !effectiveDimensions) return;

    const baseFontSize = 720;
    const pageHeight = effectiveDimensions.contentHeight; // Use content height

    let lastBottom = 0;
    const newTops = predefinedTexts.map((textData, i) => {
      const el = textRefs.current[i];
      if (!el) return null;

      let baseTop = 0;
      if (textData.Y_coord_percent != null) {
        baseTop = (textData.Y_coord_percent / 100) * pageHeight;
      } else {
        baseTop = (textData.Y_coord * pageHeight) / baseFontSize;
      }

      const rect = el.getBoundingClientRect();
      const height = rect.height;

      const adjustedTop = Math.max(baseTop, lastBottom + 2);
      lastBottom = adjustedTop + height;

      return adjustedTop;
    });

    setAdjustedTops(newTops);
  }, [predefinedTexts, effectiveDimensions]);

  return (
    <PageContainer 
      ref={ref}
      $isMobile={isMobile}
      $width={effectiveDimensions.width}
      $height={effectiveDimensions.height}
      $aspectRatio="1/1.414"
    >
      <ContentWrapper>
        {image && (
          <BackgroundImage 
            src={image} 
            alt={`Page ${pageNumber}`}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/${effectiveDimensions.width}x${effectiveDimensions.height}`;
              e.target.onerror = null;
            }}
          />
        )}
        {predefinedTexts?.map((textData, index) => (
          <TextOverlay 
            key={`text-${index}`} 
            ref={el => textRefs.current[index] = el} 
            textData={textData} 
            pageDimensions={{
              ...effectiveDimensions,
              height: effectiveDimensions.contentHeight // Pass adjusted height
            }}
            styleOverrides={{
              top: adjustedTops[index] !== undefined ? `${adjustedTops[index]}px` : undefined
            }}
          />
        ))}
      </ContentWrapper>
    </PageContainer>
  );
});