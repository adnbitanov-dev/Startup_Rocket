import { useState, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-48 bg-gray-200 rounded-xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* Before Image (Background) */}
      <img 
        src={beforeImage} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
      />
      <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">До</div>
      
      {/* After Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt="After" 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ width: '100%', maxWidth: 'none' }} // Ensure it stretches full container width, not clipped width
        />
        {/* We need the after image to be width of container, not width of clip. So we use a trick: */}
        <div 
            className="absolute inset-0 h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${afterImage})`, width: '100vw' /* Approximate */ }}
        />
      </div>

      {/* Correcting the image stretch issue: */}
      {/* We use clip-path to reveal the After image over the Before image without stretching */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
         <img 
            src={afterImage} 
            alt="After" 
            className="absolute inset-0 w-full h-full object-cover" 
         />
         <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded-md shadow-sm pointer-events-none">После</div>
      </div>

      {/* Slider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
          <div className="w-1 h-3 border-l border-r border-gray-300" />
        </div>
      </div>
    </div>
  );
}
