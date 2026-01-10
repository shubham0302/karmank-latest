/**
 * Thumbprint Image Quality Assessment and Preprocessing
 * Inspired by Blueprint-Builder's thumbprint_classifier.py
 *
 * Provides quality checks before sending to Gemini AI for better accuracy
 */

export interface QualityAssessment {
  score: number; // 0-100
  sharpness: number;
  contrast: number;
  brightness: number;
  isAcceptable: boolean;
  recommendations: string[];
}

export interface ThumbprintMetadata {
  quality: QualityAssessment;
  estimatedPattern: string; // 'arch', 'loop', 'whorl', 'unclear'
  features: {
    hasCircles: boolean;
    hasLines: boolean;
    complexity: 'simple' | 'moderate' | 'complex';
  };
}

/**
 * Analyze image quality using canvas-based techniques
 */
export const assessImageQuality = (base64Image: string): Promise<QualityAssessment> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        // Create canvas for analysis
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Calculate brightness
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          totalBrightness += (r + g + b) / 3;
        }
        const avgBrightness = totalBrightness / (data.length / 4);
        const brightness = (avgBrightness / 255) * 100;

        // Calculate contrast (standard deviation of brightness)
        let varianceSum = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const pixelBrightness = (r + g + b) / 3;
          varianceSum += Math.pow(pixelBrightness - avgBrightness, 2);
        }
        const variance = varianceSum / (data.length / 4);
        const stdDev = Math.sqrt(variance);
        const contrast = Math.min((stdDev / 128) * 100, 100);

        // Estimate sharpness using edge detection (simplified Laplacian)
        const sharpness = calculateSharpness(imageData);

        // Overall quality score (weighted average)
        const score = (sharpness * 0.5 + contrast * 0.3 + Math.min(brightness, 100 - brightness) * 0.2);

        const recommendations: string[] = [];
        if (brightness < 30) recommendations.push('Image too dark - increase lighting');
        if (brightness > 85) recommendations.push('Image too bright - reduce lighting');
        if (contrast < 20) recommendations.push('Low contrast - ensure clear background');
        if (sharpness < 30) recommendations.push('Image blurry - hold camera steady');

        const isAcceptable = score >= 50 && sharpness >= 25;

        resolve({
          score: Math.round(score),
          sharpness: Math.round(sharpness),
          contrast: Math.round(contrast),
          brightness: Math.round(brightness),
          isAcceptable,
          recommendations
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for quality assessment'));
    };

    img.src = base64Image;
  });
};

/**
 * Calculate image sharpness using edge detection
 */
const calculateSharpness = (imageData: ImageData): number => {
  const { width, height, data } = imageData;
  let sharpnessSum = 0;
  let count = 0;

  // Simplified Laplacian edge detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      // Convert to grayscale
      const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

      // Get neighboring pixels
      const top = (data[idx - width * 4] + data[idx - width * 4 + 1] + data[idx - width * 4 + 2]) / 3;
      const bottom = (data[idx + width * 4] + data[idx + width * 4 + 1] + data[idx + width * 4 + 2]) / 3;
      const left = (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3;
      const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;

      // Laplacian: center - average of neighbors
      const laplacian = Math.abs(center * 4 - (top + bottom + left + right));
      sharpnessSum += laplacian;
      count++;
    }
  }

  const avgLaplacian = sharpnessSum / count;
  return Math.min((avgLaplacian / 50) * 100, 100); // Normalize to 0-100
};

/**
 * Extract basic thumbprint features from image
 */
export const extractThumbprintFeatures = async (base64Image: string): Promise<ThumbprintMetadata['features']> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({ hasCircles: false, hasLines: false, complexity: 'simple' });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Detect circular patterns (simplified - looks for center region darkness)
      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const centerRadius = Math.min(canvas.width, canvas.height) / 6;

      let darkPixelsInCenter = 0;
      let totalCenterPixels = 0;

      for (let y = centerY - centerRadius; y < centerY + centerRadius; y++) {
        for (let x = centerX - centerRadius; x < centerX + centerRadius; x++) {
          if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            const idx = (y * canvas.width + x) * 4;
            const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            if (brightness < 128) darkPixelsInCenter++;
            totalCenterPixels++;
          }
        }
      }

      const centerDarkness = darkPixelsInCenter / totalCenterPixels;
      const hasCircles = centerDarkness > 0.3;

      // Detect line patterns (edge density)
      let edgePixels = 0;
      for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        if (i + 16 < data.length) {
          const nextR = data[i + 16];
          const nextG = data[i + 17];
          const nextB = data[i + 18];
          const nextBrightness = (nextR + nextG + nextB) / 3;

          if (Math.abs(brightness - nextBrightness) > 30) {
            edgePixels++;
          }
        }
      }

      const edgeDensity = edgePixels / (data.length / 16);
      const hasLines = edgeDensity > 0.15;

      // Complexity based on edge density
      let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
      if (edgeDensity > 0.25) complexity = 'complex';
      else if (edgeDensity > 0.15) complexity = 'moderate';

      resolve({ hasCircles, hasLines, complexity });
    };

    img.onerror = () => {
      resolve({ hasCircles: false, hasLines: false, complexity: 'simple' });
    };

    img.src = base64Image;
  });
};

/**
 * Estimate thumbprint pattern type (basic classification)
 */
export const estimatePattern = (features: ThumbprintMetadata['features']): string => {
  if (features.hasCircles && features.complexity === 'complex') {
    return 'whorl';
  } else if (features.hasLines && features.complexity === 'moderate') {
    return 'loop';
  } else if (features.hasLines && features.complexity === 'simple') {
    return 'arch';
  }
  return 'unclear';
};

/**
 * Complete thumbprint preprocessing and metadata extraction
 */
export const preprocessThumbprint = async (base64Image: string): Promise<ThumbprintMetadata> => {
  const quality = await assessImageQuality(base64Image);
  const features = await extractThumbprintFeatures(base64Image);
  const estimatedPattern = estimatePattern(features);

  return {
    quality,
    estimatedPattern,
    features
  };
};
