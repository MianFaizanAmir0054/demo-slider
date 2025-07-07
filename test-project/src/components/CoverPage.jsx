import {
  forwardRef,
  useLayoutEffect as useEffectLayout,
  useMemo,
  useRef,
  useState
} from 'react';
import styled, { css } from 'styled-components';
import { TextOverlay } from './TextOverlay';

const CoverContainer = styled.div`
  font-family: 'GE-Dinar-Medium';
  position: relative;
  overflow: hidden;
  background-color: white;
  margin: 0 auto;
  display: block;

  ${props =>
    !props.$isMobile &&
    css`
      width: ${props.$width}px;
      height: ${props.$height}px;
      box-shadow: ${props.$isCover ? '0 0 30px rgba(0,0,0,0.3)' : 'none'};
      border: ${props.$isCover ? '1px solid #ddd' : 'none'};
    `}

  ${props =>
    props.$isMobile &&
    css`
      width: 100%;
      height: 100%;
      aspect-ratio: 1/1.414;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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

export const CoverPage = forwardRef(function CoverPage(
  { image, dimensions = {}, predefinedTexts = [], isCover = false },
  ref
) {
  const textRefs = useRef([]);
  const [adjustedTops, setAdjustedTops] = useState([]);
  const isMobile = dimensions.mode === 'responsive';

  // Compute fallback dimensions
  const effectiveDimensions = useMemo(() => {
    const w = dimensions.width ?? 400;
    const h = dimensions.height ?? 565;
    return {
      width: w,
      height: h,
      contentHeight: isMobile ? h - 16 : h
    };
  }, [dimensions.width, dimensions.height, isMobile]);

  // Calculate and adjust text positions to avoid overlap
  useEffectLayout(() => {
    if (!predefinedTexts.length) return;

    const baseFontSize = 720;
    const pageHeight = effectiveDimensions.height;
    let lastBottom = 0;

    const newTops = predefinedTexts.map((textData, i) => {
      const el = textRefs.current[i];
      if (!el) return 0;

      // starting offset: percent or absolute
      const baseTop =
        textData.Y_coord_percent != null
          ? (textData.Y_coord_percent / 100) * pageHeight
          : (textData.Y_coord * pageHeight) / baseFontSize;

      const { height } = el.getBoundingClientRect();
      const adjusted = Math.max(baseTop, lastBottom + 2);
      lastBottom = adjusted + height;
      return adjusted;
    });

    setAdjustedTops(prev =>
      prev.length === newTops.length && prev.every((v, i) => v === newTops[i])
        ? prev
        : newTops
    );
  }, [predefinedTexts, effectiveDimensions]);

  return (
    <CoverContainer
      ref={ref}
      $isMobile={isMobile}
      $width={effectiveDimensions.width}
      $height={effectiveDimensions.height}
      $isCover={isCover}
    >
      {image && (
        <BackgroundImage
          src={image}
          alt="Book cover"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://via.placeholder.com/${effectiveDimensions.width}x${effectiveDimensions.height}`;
          }}
        />
      )}

      {predefinedTexts.map((textData, index) => (
        <TextOverlay
          key={`cover-text-${index}`}
          ref={el => (textRefs.current[index] = el)}
          textData={textData}
          pageDimensions={effectiveDimensions}
          styleOverrides={{
            top:
              adjustedTops[index] != null
                ? `${adjustedTops[index]}px`
                : undefined
          }}
        />
      ))}
    </CoverContainer>
  );
});
