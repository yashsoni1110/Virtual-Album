import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Image as IKImage } from '@imagekit/react';

const Lightbox = ({ selectedImage, onClose }) => {
  if (!selectedImage) return null;

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const imageUrl = `https://ik.imagekit.io/gezkccajj/${selectedImage.img}?ik-attachment=true`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedImage.img.split('/').pop() || 'photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link if fetch fails
      window.open(`https://ik.imagekit.io/gezkccajj/${selectedImage.img}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <button 
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X className="w-8 h-8" />
        </button>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="max-w-7xl w-full flex flex-col items-center gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <IKImage 
            src={selectedImage.img}
            transformation={[{
              quality: 90,
              format: 'auto'
            }]}
            className="max-h-[80vh] rounded-2xl shadow-2xl object-contain" 
            alt="Photography"
          />
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={handleDownload}
              className="mt-2 bg-white text-black py-3 px-10 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <Save className="w-5 h-5" />
              <span>Save</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
