import React from 'react';
import styled from 'styled-components';

export const TextContainer = styled.div.attrs(props => {
  // Calculate top with optional offset
  let topValue;

  if (props.$yPercent != null) {
    // percent-based positioning: convert to number, clamp and add offset in px converted to %
    // We can't easily add px offset to % top directly, so just add px offset directly if needed.
    topValue = `${Math.min(Math.max(props.$yPercent, 0), 100)}%`;
  } else if (props.$yCoordPx != null) {
    topValue = `${props.$yCoordPx}px`;
  } else {
    topValue = undefined;
  }

  // We'll add the pixel offset directly as a transform translateY
  return {
    style: {
      color: props.$color,
      left: props.$xPercent != null
        ? `${Math.min(Math.max(props.$xPercent, 0), 100)}%`
        : `${props.$xCoordPx}px`,
      top: topValue,
      width: props.$widthPercent ? `${props.$widthPercent}%` : 'auto',
      maxWidth: props.$maxWidth ? `${props.$maxWidth}px` : undefined,
      backgroundColor: props.$bgColor,
    }
  }
})`
  position: absolute;
  font-family: ${props => props.$fontFace ? `'${props.$fontFace}', sans-serif` : `'Cairo', sans-serif`};
  font-size: ${props => props.$fontSize}px;
  text-align: ${props => props.$align === 'C' ? 'center' : 'right'};
  line-height: ${props => props.$lineHeight};
  padding: ${props => props.$bgColor ? '1px 3px' : '0'};
  /* Only horizontal translate for center alignment */
  white-space: pre-wrap;
  word-wrap: break-word;
  z-index: 2;
  direction: rtl;

  /* Add vertical offset */
  transform: 
    translateY(${props => props.$yOffsetPx || 0}px);

    @media (max-width: 1020px) {
    font-size: ${props => {
      const baseSize = props.$fontSize || 16;
      return `clamp(${baseSize * 0.7}px, ${baseSize * 0.2}vw, ${baseSize}px)`;
    }};
  }
`;


export const TextOverlay = React.forwardRef(({ textData, pageDimensions, styleOverrides }, ref) => {
  if (!textData?.text || !pageDimensions) return null;

  const {
    font_face,
    font_size,
    color,
    bg_color,
    line_height,
    max_width,
    width_percent,
    X_coord,
    Y_coord,
    X_coord_percent,
    Y_coord_percent,
    text: rawText,
    text_align: align
  } = textData;

  const pageWidth = pageDimensions.width;
  const pageHeight = pageDimensions.height;

  const baseFontSize = 800;
  const scaledFontSize = font_size ? (font_size * pageWidth) / baseFontSize : 12;

  const computedMaxWidth = max_width ? (max_width * pageWidth) / baseFontSize : undefined;

  return (
    <TextContainer
      ref={ref}
      $color={color}
      $fontFace={font_face}
      $fontSize={scaledFontSize}
      $align={align}
      $lineHeight={line_height}
      $maxWidth={computedMaxWidth}
      $widthPercent={width_percent}
      $xPercent={X_coord_percent != null ? X_coord_percent : undefined}
      $yPercent={Y_coord_percent != null ? Y_coord_percent : undefined}
      $xCoordPx={X_coord_percent == null ? (X_coord * pageWidth) / baseFontSize : undefined}
      $yCoordPx={Y_coord_percent == null ? (Y_coord * pageHeight) / baseFontSize : undefined}
      $bgColor={bg_color}
      style={{
        ...styleOverrides,
      }}
    >
      {rawText.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          {i < rawText.split('\n').length - 1 && <br />}
        </span>
      ))}
    </TextContainer>
  );
});
