import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';

const Lightbox = ({ selectedImage, onClose }) => {
  if (!selectedImage) return null;

  // selectedImage.img is already a full URL (e.g. https://ik.imagekit.io/...)
  const imageUrl = selectedImage.img;

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure we don't have a double URL if someone passed a relative path by mistake
    let finalUrl = imageUrl;
    if (!finalUrl.startsWith('http')) {
      const endpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/gezkccajj';
      finalUrl = `${endpoint.replace(/\/$/, '')}/${finalUrl.replace(/^\//, '')}`;
    }
    
    // Add ik-attachment=true to trigger download
    const downloadUrl = finalUrl.includes('?') ? `${finalUrl}&ik-attachment=true` : `${finalUrl}?ik-attachment=true`;
    
    // Direct download via window.open is more reliable for ImageKit than fetch+blob if CORS isn't perfect
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = finalUrl.split('/').pop()?.split('?')[0] || 'photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {/* Use a plain <img> since imageUrl is already a full absolute URL */}
          <img 
            src={`${imageUrl}?tr=q-90,f-auto`}
            className="max-h-[80vh] rounded-2xl shadow-2xl object-contain w-auto" 
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
