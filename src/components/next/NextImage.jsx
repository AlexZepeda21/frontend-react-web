import React from 'react';
import Image from 'next/image';
import { cn } from '../../lib/utils';

const NextImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false,
  ...props 
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        priority={priority}
        {...props}
      />
    </div>
  );
};

NextImage.defaultProps = {
  width: 500,
  height: 300,
  alt: "Image",
};

export default NextImage;
