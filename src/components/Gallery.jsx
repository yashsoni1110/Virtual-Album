import { ArrowLeft, Folder } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GalleryCard from './GalleryCard';

const ALBUMS = [
  {
    id: 'anniversary',
    title: 'Anniversary Collection',
    cover: 'Anniversary/DSC_0002.JPG',
    count: 150,
    prefix: 'Anniversary/DSC_',
    padLength: 4,
    extension: 'JPG'
  },
  {
    id: 'birthday',
    title: 'Birthday Celebration',
    cover: 'Birthday/1.jpg',
    count: 17,
    prefix: 'Birthday/',
    padLength: 0,
    extension: 'jpg'
  }
];

const Gallery = ({ onOpenImage }) => {
  const [activeAlbum, setActiveAlbum] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeAlbum]);

  const getAlbumImages = (album) => {
    return Array.from({ length: album.count }, (_, i) => {
      const id = i + 1;
      const num = album.padLength ? String(id).padStart(album.padLength, '0') : String(id);
      return {
        id: `${album.id}-${id}`,
        img: `${album.prefix}${num}.${album.extension}`,
      };
    });
  };

  return (
    <section id="galleries" className="px-6 md:px-12 pt-24 md:pt-28 pb-12 md:pb-20 max-w-[1920px] mx-auto">
      <AnimatePresence mode="wait">
        {!activeAlbum ? (
          <motion.div 
            key="folders-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="pb-10 text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4">
                A Journey Through <br /> The <span className="text-gray-400">Lens.</span>
              </h1>
              <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
                Explore our curated galleries featuring moments of light, shadow, and pure emotion.
              </p>
            </div>

            <div className="grid grid-cols-2 max-w-4xl mx-auto gap-4 md:gap-8">
              {ALBUMS.map((album) => (
                <motion.div
                  key={album.id}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                  onClick={() => setActiveAlbum(album)}
                >
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <img 
                      src={`https://ik.imagekit.io/gezkccajj/${album.cover}?tr=w-800,h-600,f-auto`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={album.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 pr-4">
                      <div className="flex items-center gap-2 md:gap-3 text-white/70 mb-1 md:mb-2">
                         <Folder className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                         <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase truncate">{album.count} Photos</span>
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-white tracking-tight leading-tight">{album.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dynamic Photo Marquee */}
            <div className="mt-4 max-w-5xl mx-auto rounded-[2.5rem] bg-gray-50 overflow-hidden shadow-xl border border-gray-100 relative group pb-12">
              <div className="pt-12 md:pt-16 pb-8 px-6 text-center z-10 relative">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black mb-4">Discover the Moments.</h2>
                <p className="text-gray-500 font-medium">A glimpse into our curated archives.</p>
              </div>

              {/* Marquee Track Container */}
              <div className="relative flex overflow-hidden w-full">
                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none" />
                
                {/* Scrolling Track */}
                <div className="flex w-max animate-scroll pointer-events-auto">
                  {/* Generate 10 images from albums, then duplicate for seamless loop */}
                  {[
                    ...getAlbumImages(ALBUMS[0]).slice(10, 15), 
                    ...getAlbumImages(ALBUMS[1]).slice(5, 10),
                    ...getAlbumImages(ALBUMS[0]).slice(10, 15), 
                    ...getAlbumImages(ALBUMS[1]).slice(5, 10)
                  ].map((photo, idx) => (
                    <motion.div 
                      key={`marquee-${idx}`}
                      whileHover={{ y: -10, rotate: idx % 2 === 0 ? 2 : -2, scale: 1.05 }}
                      className="w-40 md:w-56 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden shadow-lg border-4 border-white mx-3 relative cursor-pointer"
                    >
                      <img 
                        src={`https://ik.imagekit.io/gezkccajj/${photo.img}?tr=w-400,h-500,f-auto`} 
                        className="w-full h-full object-cover"
                        alt="Gallery Preview"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="album-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4 relative">
              {/* Desktop inline back button */}
              <button 
                onClick={() => setActiveAlbum(null)}
                className="hidden md:flex group items-center gap-3 px-6 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-fit"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
                <span>Back</span>
              </button>
              
              <div className="text-left md:text-right w-full">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{activeAlbum.title}</h2>
                <p className="text-gray-400 font-medium text-sm md:text-base mt-2">Collection Volume — {activeAlbum.count} Assets</p>
              </div>
            </div>

            {/* Mobile floating back button */}
            <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
              <button 
                onClick={() => setActiveAlbum(null)}
                className="flex items-center gap-3 px-6 py-3.5 bg-black/80 backdrop-blur-lg border border-white/10 text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-[0_20px_40px_-5px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>

            <div className="masonry-grid">
              {getAlbumImages(activeAlbum).map((img) => (
                <GalleryCard 
                  key={img.id} 
                  {...img} 
                  onOpen={onOpenImage}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
