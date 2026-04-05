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

// Helper to get all photos from all collections
const getAllPhotos = () => {
  return ALBUMS.flatMap(album => {
    return Array.from({ length: album.count }, (_, i) => {
      const id = i + 1;
      const num = album.padLength ? String(id).padStart(album.padLength, '0') : String(id);
      return {
        id: `home-${album.id}-${id}`,
        img: `${album.prefix}${num}.${album.extension}`,
      };
    });
  });
};

const Gallery = ({ onOpenImage, view }) => {
  const [activeAlbum, setActiveAlbum] = useState(null);

  // Reset active album when switching views
  useEffect(() => {
    setActiveAlbum(null);
  }, [view]);

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
    <section id="galleries" className="px-6 md:px-12 pb-20 max-w-[1920px] mx-auto mt-4 min-h-[60vh]">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div 
            key="home-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="masonry-grid"
          >
            {getAllPhotos().map((img) => (
              <GalleryCard 
                key={img.id} 
                {...img} 
                onOpen={onOpenImage}
              />
            ))}
          </motion.div>
        ) : !activeAlbum ? (
          <motion.div 
            key="folders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
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
                  <div className="absolute bottom-8 left-8">
                    <div className="flex items-center gap-3 text-white/70 mb-2">
                       <Folder className="w-4 h-4" />
                       <span className="text-xs font-bold tracking-widest uppercase">{album.count} Photos</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{album.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="album-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <button 
                onClick={() => setActiveAlbum(null)}
                className="flex items-center gap-3 text-gray-400 hover:text-black transition-colors font-bold group w-fit"
              >
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span>Back to Albums</span>
              </button>
              
              <div className="text-right">
                <h2 className="text-4xl font-bold tracking-tight">{activeAlbum.title}</h2>
                <p className="text-gray-400 font-medium">Collection Volume — {activeAlbum.count} Assets</p>
              </div>
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
