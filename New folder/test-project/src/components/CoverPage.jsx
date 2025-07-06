import React, { useRef, useEffect, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { TextOverlay } from './TextOverlay';

const CoverContainer = styled.div`
  position: relative;
  overflow: hidden;
  background-color: white;
  margin: 0 auto;
  display: block;

  ${props => !props.$isMobile && css`
    width: ${props.$width}px;
    height: ${props.$height}px;
    box-shadow: ${props.$isCover ? '0 0 30px rgba(0,0,0,0.3)' : 'none'};
    border: ${props.$isCover ? '1px solid #ddd' : 'none'};
  `}

  ${props => props.$isMobile && css`
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1.414;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    border-radius: 8px;
  `}
`;

const BackgroundImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  display: block;
`;

export const CoverPage = React.forwardRef(({ 
  image, 
  dimensions = {}, 
  predefinedTexts = [],
  isCover = false
}, ref) => {
  const textRefs = useRef([]);
  const [adjustedTops, setAdjustedTops] = useState([]);
  const isMobile = dimensions.mode === 'responsive';

  // Fallback dimensions if not provided
  const effectiveDimensions = useMemo(() => ({
    width: dimensions.width || 400,
    height: dimensions.height || 565,
    contentHeight: isMobile ? (dimensions.height || 565) - 16 : (dimensions.height || 565)
  }), [dimensions.width, dimensions.height, isMobile]);

  useEffect(() => {
    if (!predefinedTexts || !effectiveDimensions) return;

    const baseFontSize = 720;
    const pageHeight = effectiveDimensions.height;

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
    <CoverContainer 
      ref={ref}
      $isMobile={isMobile}
      $width={effectiveDimensions.width}
      $height={effectiveDimensions.height}
      $isCover={isCover}
      $aspectRatio="1/1.414"
    >
      {image && (
        <BackgroundImage 
          src={image} 
          alt="Book cover"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/${effectiveDimensions.width}x${effectiveDimensions.height}`;
            e.target.onerror = null; // Prevent infinite loop if placeholder fails
          }}
        />
      )}
      {predefinedTexts?.map((textData, index) => (
        <TextOverlay 
          key={`cover-text-${index}`} 
          ref={el => textRefs.current[index] = el} 
          textData={textData}
          pageDimensions={effectiveDimensions}
          styleOverrides={{
            top: adjustedTops[index] !== undefined ? `${adjustedTops[index]}px` : undefined
          }}
        />
      ))}
    </CoverContainer>
  );
});