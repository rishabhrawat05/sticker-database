export const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const cropX = Math.max(0, crop.x);
        const cropY = Math.max(0, crop.y);
        const cropWidth = Math.min(image.width - cropX, crop.width);
        const cropHeight = Math.min(image.height - cropY, crop.height);
  
        canvas.width = cropWidth;
        canvas.height = cropHeight;
  
        ctx.drawImage(
          image,
          cropX, cropY, cropWidth, cropHeight,
          0, 0, cropWidth, cropHeight
        );
  
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          1
        );
      };
  
      image.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  };
  