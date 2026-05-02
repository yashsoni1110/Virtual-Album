import { useState } from 'react';
import { motion } from 'framer-motion';


const GalleryCard = ({ id, img, onOpen }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <motion.div 
      className="card-item group"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div 
        className="relative overflow-hidden rounded-[1.5rem] bg-gray-50 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
        onClick={() => onOpen({ id, img })}
      >
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-[1.5rem]" />
        )}
        <div className="overflow-hidden rounded-[1.5rem]">
          {/* img is already a full absolute URL — no IKImage transformation needed */}
          <img 
            src={`${img}?tr=w-800,q-85,f-auto`}
            loading="lazy"
            className={`w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            alt="Gallery photo"
          />
        </div>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default GalleryCard;

