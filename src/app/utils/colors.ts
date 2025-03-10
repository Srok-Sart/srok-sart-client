export const generateRandomColor = (): string => {
    const hue = Math.floor(Math.random() * 360); // Random hue (0-359)
    const saturation = 20 + Math.floor(Math.random() * 20); // Saturation between 20-40% (lower saturation for pastel colors)
    const lightness = 90 + Math.floor(Math.random() * 5); // Lightness between 90-95% (very light)
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };