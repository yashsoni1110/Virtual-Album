import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Lightbox from './components/Lightbox';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ImageKitProvider } from '@imagekit/react';

const URL_ENDPOINT = 'https://ik.imagekit.io/gezkccajj'; 

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [view, setView] = useState('home'); // 'home', 'galleries', or 'contact'
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
                <section className="pt-24 pb-8 px-6 text-center max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                    A Journey Through <br /> The <span className="text-gray-400">Lens.</span>
                  </h1>
                  <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
                    Exploring the intersection of light, shadow, and emotion.
                  </p>
                </section>
                <Gallery onOpenImage={setSelectedImage} view="home" />
              </motion.div>
            )}
            
            {view === 'galleries' && (
              <motion.div
                key="galleries-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <section className="pt-24 pb-4 px-6 text-center max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3">
                    Media <span className="text-gray-400">Library.</span>
                  </h1>
                  <p className="text-gray-400 text-base font-medium">Organized ceremonial archives.</p>
                </section>
                <Gallery onOpenImage={setSelectedImage} view="galleries" />
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
