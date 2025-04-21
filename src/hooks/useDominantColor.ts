import { useEffect, useState } from 'react';

const useDominantColor = (imageUrl: string) => {
  const [color, setColor] = useState<string>('#3b82f6');

  useEffect(() => {
    if (!imageUrl) return;

    const getDominantColor = async () => {
      try {
        const color = await extractDominantColor(imageUrl);
        setColor(color);
      } catch (error) {
        console.error('Error extracting dominant color:', error);
      }
    };

    getDominantColor();
  }, [imageUrl]);

  return color;
};

const extractDominantColor = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const x = img.width / 2;
        const y = img.height / 2;
        const pixelData = ctx.getImageData(x, y, 1, 1).data;

        // Converte para hex
        const rgbToHex = (r: number, g: number, b: number) => {
          return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
        };

        resolve(rgbToHex(pixelData[0], pixelData[1], pixelData[2]));
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};

export default useDominantColor;