import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Folder as FolderIcon, Image as ImageIcon, Upload, Plus, ChevronDown, ChevronUp, Loader2, Edit2, Check, X } from 'lucide-react';

const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderUpload, setSelectedFolderUpload] = useState('');
  const [files, setFiles] = useState([]);
  
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [renamingFolderId, setRenamingFolderId] = useState(null);
  const [renamingName, setRenamingName] = useState('');

  const fileInputRef = useRef(null);

  const [expandedFolder, setExpandedFolder] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      fetchFolders();
      fetchAllImages();
    }
  }, [token]);

  const fetchFolders = async () => {
    try {
      const res = await fetch(`${API_URL}/folders`);
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllImages = async () => {
    try {
      const res = await fetch(`${API_URL}/images`);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/folders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newFolderName })
      });
      const data = await res.json();
      if (data.success) {
        setNewFolderName('');
        fetchFolders(); 
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!selectedFolderUpload || !files || files.length === 0) {
      return alert('Please select a folder and at least one file.');
    }
    
    setIsLoading(true);
    let successCount = 0;
    const totalFiles = files.length;
    
    for (let i = 0; i < totalFiles; i++) {
      setUploadStatus(`Uploading image ${i + 1} of ${totalFiles}... (${totalFiles - i - 1} left)`);
      
      const formData = new FormData();
      formData.append('folderId', selectedFolderUpload);
      formData.append('images', files[i]);
      
      try {
        const res = await fetch(`${API_URL}/admin/images`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          successCount += data.count;
        } else {
          console.error(`Error uploading file ${i + 1}: ${data.message}`);
        }
      } catch (err) {
        console.error(`Upload failed for file ${i + 1}`, err);
      }
    }
    
    if (successCount === totalFiles) {
      setUploadStatus(`Successfully uploaded all ${successCount} images!`);
    } else {
      setUploadStatus(`Finished. Uploaded ${successCount} out of ${totalFiles} images.`);
    }
    
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchAllImages();
    setTimeout(() => setUploadStatus(''), 5000);
    setIsLoading(false);
  };

  const handleDeleteFolder = async (folderId, folderName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${folderName}" and all its images?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/folders/${folderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchFolders();
        fetchAllImages();
      }
    } catch (error) {
      console.error('Delete folder error', error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const res = await fetch(`${API_URL}/admin/images/${imageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAllImages();
      }
    } catch (error) {
      console.error('Delete image error', error);
    }
  };

  const handleSetCover = async (folderId, imageUrl) => {
    try {
      const res = await fetch(`${API_URL}/admin/folders/${folderId}/cover`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ coverImage: imageUrl })
      });
      if (res.ok) {
        fetchFolders();
        alert('Cover image updated successfully!');
      }
    } catch (error) {
      console.error('Set cover error', error);
    }
  };

  const handleRenameFolder = async (folderId) => {
    if (!renamingName.trim()) return;
    try {
      const res = await fetch(`${API_URL}/admin/folders/${folderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: renamingName })
      });
      if (res.ok) {
        setRenamingFolderId(null);
        fetchFolders();
      }
    } catch (error) {
      console.error('Rename folder error', error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  if (!token) {
    return (
      <div className="flex bg-gray-50 flex-col items-center justify-center min-h-[80vh] px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center -rotate-6 shadow-xl">
              <FolderIcon className="text-white w-8 h-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center tracking-tight mb-8">Admin Access</h2>
          {error && <p className="text-red-500 text-sm text-center mb-6 bg-red-50 p-3 rounded-lg">{error}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input 
              type="text" 
              placeholder="Username" 
              className="px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button disabled={isLoading} type="submit" className="bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enter Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 px-6 pb-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
            <FolderIcon className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Studio Admin Workspace</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Manage your centralized media collection</p>
          </div>
        </div>
        <button onClick={handleLogout} className="px-5 py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition active:scale-95">
          Secure Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create & Upload Forms */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg"><Plus className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold">New Folder</h3>
            </div>
            <form onSubmit={handleCreateFolder} className="flex flex-col gap-4">
              <input type="text" placeholder="e.g. Wedding 2026" required className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
              <button disabled={isLoading} type="submit" className="bg-black text-white font-bold py-3 text-sm rounded-xl hover:bg-gray-800 transition active:scale-95">Create Collection</button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg"><Upload className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold">Quick Upload</h3>
            </div>
            <form onSubmit={handleUploadImage} className="flex flex-col gap-4">
              <select required className="px-4 py-3 cursor-pointer bg-gray-50 font-medium text-gray-700 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition appearance-none" value={selectedFolderUpload} onChange={(e) => setSelectedFolderUpload(e.target.value)}>
                <option value="" disabled>Select Target Folder...</option>
                {folders.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition p-4">
                <input type="file" accept="image/*" multiple required ref={fileInputRef} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFiles(e.target.files)} />
                <div className="flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">
                    {files.length > 0 ? `${files.length} files selected` : 'Drag & drop or browse'}
                  </span>
                </div>
              </div>
              <button disabled={isLoading} type="submit" className="bg-black text-white font-bold text-sm py-3 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 active:scale-95">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Push to Cloud'}
              </button>
              {uploadStatus && <p className="text-xs text-center font-bold text-green-600 bg-green-50 py-2 rounded-lg mt-2">{uploadStatus}</p>}
            </form>
          </motion.div>
        </div>

        {/* Right Column: Existing Folders & Images Manager */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 min-h-full">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <FolderIcon className="w-5 h-5 text-gray-400" /> Collection Manager
            </h3>

            {folders.length === 0 ? (
              <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                <FolderIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No folders created yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {folders.map(folder => {
                  const folderImages = images.filter(img => img.folderId && img.folderId._id === folder._id);
                  const isExpanded = expandedFolder === folder._id;
                  return (
                    <div key={folder._id} className="group border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition hover:shadow-md">
                      
                      {/* Folder Header Row */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer" onClick={() => setExpandedFolder(isExpanded ? null : folder._id)}>
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg transition ${isExpanded ? 'bg-black text-white' : 'bg-white text-gray-500 shadow-sm'}`}>
                            <FolderIcon className="w-5 h-5" />
                          </div>
                          <div>
                            {renamingFolderId === folder._id ? (
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="text" 
                                  value={renamingName}
                                  onChange={(e) => setRenamingName(e.target.value)}
                                  className="px-2 py-1 border border-black rounded-lg text-sm bg-white"
                                  autoFocus
                                />
                                <button onClick={() => handleRenameFolder(folder._id)} className="p-1 text-green-600 hover:bg-green-50 rounded-md">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => setRenamingFolderId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded-md">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <h4 className="font-bold text-lg inline-flex items-center gap-2">
                                  {folder.name}
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setRenamingFolderId(folder._id); setRenamingName(folder.name); }}
                                    className="p-1 opacity-40 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-black"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                </h4>
                                <p className="text-xs text-gray-500 font-medium">{folderImages.length} items</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder._id, folder.name); }}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                            title="Delete Entire Folder"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <div className="text-gray-400 p-2">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>

                      {/* Folder Images Grid (Expanded) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white border-t border-gray-100 p-4"
                          >
                            {folderImages.length === 0 ? (
                              <p className="text-center py-6 text-gray-400 text-sm font-medium">This folder is empty.</p>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {folderImages.map(img => (
                                  <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                                    <img src={`${img.url}?tr=w-300,h-300,f-auto`} alt={img.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                      <button 
                                        onClick={() => handleSetCover(folder._id, img.url)}
                                        className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 shadow-lg active:scale-95 transition-transform"
                                      >
                                        Set as Cover
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteImage(img._id)}
                                        className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 shadow-lg active:scale-95 transition-transform"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
