import { User, Phone, Mail, Github, Instagram, Linkedin, ExternalLink, Send } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const Contact = () => {
  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section id="contact" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20 px-6">
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-50/40 to-purple-50/40 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-gray-100/30 to-blue-50/30 blur-[150px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Content & Socials */}
          <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
            <motion.div variants={itemVariants}>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                Let's make <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-500 to-black animate-gradient-x">magic happen.</span>
              </h2>
              <p className="text-gray-400 text-xl font-medium max-w-md mx-auto lg:mx-0">
                Crafting digital experiences that feel more like stories than software.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              {[
                { icon: Phone, label: 'Contact Phone', value: '8005805891', color: 'bg-black' },
                { icon: Mail, label: 'Contact Email', value: 'soniyash3803@gmail.com', color: 'bg-gray-100' }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="group flex items-center justify-center lg:justify-start gap-5 p-4 rounded-3xl transition-all duration-500 border border-transparent"
                >
                  <div className={`w-14 h-14 ${item.color} ${idx === 0 ? 'text-white' : 'text-black'} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-[15deg] transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-4">
               {[Github, Linkedin, Instagram].map((Icon, i) => (
                 <a 
                  key={i}
                  href="#" 
                  className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                 >
                   <Icon className="w-5 h-5" />
                 </a>
               ))}
               <div className="h-px w-20 bg-gray-100 mx-4 hidden md:block" />
               <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Follow the journey</p>
            </motion.div>
          </div>

          {/* Right Side: 3D Animated Card */}
          <div className="lg:col-span-5 flex justify-center perspective-1000">
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[320px] aspect-[4/5] rounded-[3rem] shadow-[-20px_20px_50px_rgba(0,0,0,0.1)] group/card"
            >
              <div 
                style={{
                  transform: "translateZ(75px)",
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 rounded-[3rem] overflow-hidden bg-white/50 backdrop-blur-xl border border-white/40 shadow-2xl"
              >
                <img 
                  src="https://ik.imagekit.io/gezkccajj/profile%20image/img.JPG?tr=w-800,h-1000,f-auto" 
                  className="w-full h-full object-cover transition-all duration-700 group-hover/card:scale-105" 
                  alt="Yash Soni" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover/card:opacity-80 transition-all duration-500" />
                
                <div 
                  style={{ transform: "translateZ(50px)" }}
                  className="absolute bottom-10 left-10 right-10 text-white"
                >
                  <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2 opacity-70">Resident Expert</p>
                  <h3 className="text-3xl font-bold tracking-tight">Yash Soni</h3>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Available for Work</span>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Elements - Moved after card for better layering */}
              <motion.div 
                 style={{ transform: "translateZ(120px)", zIndex: 100 }}
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute -top-10 -right-10 w-16 h-16 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center border border-gray-100 active:scale-95 transition-transform"
              >
                 <Send className="w-6 h-6 text-black" />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
