import React from 'react';

const Image = ({ src, alt, width, height, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
      {...props}
    />
  );
};

export default Image;