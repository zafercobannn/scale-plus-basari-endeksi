import React, { useState, useEffect } from 'react';
import { getRepresentativeImage, checkImageExists, getDefaultAvatar } from '../utils/imageUtils';
import './RepresentativeImage.css';

interface RepresentativeImageProps {
  name: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const RepresentativeImage: React.FC<RepresentativeImageProps> = ({ 
  name, 
  size = 'medium',
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExists, setImageExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      const representativeImageUrl = getRepresentativeImage(name);
      const exists = await checkImageExists(representativeImageUrl);
      
      setImageExists(exists);
      setImageUrl(exists ? representativeImageUrl : getDefaultAvatar());
      setIsLoading(false);
    };

    loadImage();
  }, [name]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className={`representative-image loading ${size} ${className}`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className={`representative-image ${size} ${className}`}>
      {imageExists ? (
        <img 
          src={imageUrl} 
          alt={`${name} fotoğrafı`}
          onError={() => setImageUrl(getDefaultAvatar())}
        />
      ) : (
        <div className="avatar-placeholder">
          <span>{getInitials(name)}</span>
        </div>
      )}
    </div>
  );
};

export default RepresentativeImage; 