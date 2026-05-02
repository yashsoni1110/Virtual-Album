import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import Lightbox from './components/Lightbox';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ImageKitProvider } from '@imagekit/react';

const URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/gezkccajj'; 

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [view, setView] = useState('home'); // 'home' or 'contact'
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

  return (
    <ImageKitProvider urlEndpoint={URL_ENDPOINT}>
      <div className="min-h-screen">
        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-black z-50 origin-left"
          style={{ scaleX }}
        />
        
        <Navbar setView={setView} currentView={view} />
        
        <main>
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <motion.div
                key="home-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Gallery onOpenImage={setSelectedImage} />
              </motion.div>
            )}

            {view === 'contact' && (
              <motion.div
                key="contact-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-16"
              >
                <Contact />
              </motion.div>
            )}
            {view === 'admin' && (
              <motion.div
                key="admin-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-16"
              >
                <AdminPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Lightbox 
          selectedImage={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />

        <footer className="py-12 px-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 font-bold tracking-widest text-xs uppercase">
            © {new Date().getFullYear()} Yash Soni • Visual Storyteller
          </p>
        </footer>
      </div>
    </ImageKitProvider>
  );
}

export default App;
