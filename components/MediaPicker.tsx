import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';

const sortOptions = [
    'Newest First',
    'Oldest First',
    'A-Z',
    'Z-A'
];
const filterOptions = [
    'All',
    'Audio',
    'Video',
    'PDF',
    'Image',
];

const initialMedia = [
    {
        type: 'folder', name: 'home', files: [
            { type: 'image', name: 'castle.jpg', src: '/profile.png', lastModified: '30.07.2025 17:35', size: 611 },
            { type: 'image', name: 'fries.jpg', src: '/stats.png', lastModified: '30.07.2025 17:35', size: 611 },
        ]
    },
    { type: 'folder', name: 'Game1 with Action Pack', files: [] },
];

interface MediaPickerProps {
    open: boolean;
    onClose: () => void;
}

const MediaPicker: React.FC<MediaPickerProps> = ({ open, onClose }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeSort, setActiveSort] = useState(sortOptions[0]);
    const [openFilter, setOpenFilter] = useState(false);
    const [openSort, setOpenSort] = useState(false);
    const [search, setSearch] = useState('');
    const [media, setMedia] = useState(initialMedia);
    const [currentFolder, setCurrentFolder] = useState('home');
    type FileType = {
        type: string;
        name: string;
        src?: string;
        lastModified?: string;
        size?: number;
    };
    // const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    // const [optionsOpenIdx, setOptionsOpenIdx] = useState<number | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);
    const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
    const bulkMenuRef = useRef<HTMLDivElement>(null);
    const [moveTargetFolder, setMoveTargetFolder] = useState<string>('');
    const [showDetails, setShowDetails] = useState(false);
    const [showMove, setShowMove] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [showAddFolder, setShowAddFolder] = useState(false);
    const [folderName, setFolderName] = useState('');

    // Get current folder object
    const folderObj = media.find(m => m.type === 'folder' && m.name === currentFolder);
    const folderFiles = folderObj?.files || [];

    // Filter and sort logic (mock)
    const filteredMedia = folderFiles.filter(m =>
        (activeFilter === 'All' || m.type.toLowerCase() === activeFilter.toLowerCase()) &&
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    // Sort logic (mock)
    const sortedMedia = [...filteredMedia].sort((a, b) => {
        switch (activeSort) {
            case 'Newest First': return a.lastModified.localeCompare(b.lastModified || '');
            case 'Oldest First': return b.lastModified.localeCompare(a.lastModified || '');
            case 'A-Z': return a.name.localeCompare(b.name);
            case 'Z-A': return b.name.localeCompare(a.name);
            default: return 0;
        }
    });

    // Upload logic (mock)
    function handleUpload(e: React.ChangeEvent<HTMLInputElement>): void {
        const files = e.target.files;
        if (files && files.length) {
            // Add to current folder
            const updatedMedia = media.map(f => {
                if (f.type === 'folder' && f.name === currentFolder) {
                    return {
                        ...f,
                        files: [...f.files, { type: 'image', name: files[0].name, src: '', lastModified: 'now', size: 0 }],
                    };
                }
                return f;
            });
            setMedia(updatedMedia);
            setShowUpload(false);
        }
    }

    // Add folder logic (mock)
    function handleAddFolder(): void {
        if (folderName.trim()) {
            setMedia([...media, { type: 'folder', name: folderName, files: [] }]);
            setFolderName('');
            setShowAddFolder(false);
        }
    }

    // Always call hooks at the top level, never inside conditionals
    // Render nothing if not open
    // ...existing code...

    // Move this check after all hooks

    // ...existing code...

    // Helper: toggle file selection
    function toggleFileSelection(file: FileType): void {
        if (selectedFiles.some(f => f.name === file.name)) {
            setSelectedFiles(selectedFiles.filter(f => f.name !== file.name));
        } else {
            setSelectedFiles([...selectedFiles, file]);
        }
    }

    // Helper: clear selection
    function clearSelection(): void {
        setSelectedFiles([]);
    }

    // Move logic
    function handleMoveFiles(): void {
        if (!moveTargetFolder) return;
        // Remove files from current folder
        const updatedMedia = media.map(folder => {
            if (folder.type === 'folder' && folder.name === currentFolder) {
                return {
                    ...folder,
                    files: folder.files.filter(f => !selectedFiles.some(sf => sf.name === f.name)),
                };
            }
            if (folder.type === 'folder' && folder.name === moveTargetFolder) {
                // Ensure all files have required properties
                const normalizedFiles = (selectedFiles || []).map(f => ({
                    type: f.type,
                    name: f.name,
                    src: f.src || '',
                    lastModified: f.lastModified || '',
                    size: typeof f.size === 'number' ? f.size : 0,
                }));
                return {
                    ...folder,
                    files: [...(folder.files || []), ...normalizedFiles],
                };
            }
            return folder;
        });
        setMedia(updatedMedia);
        clearSelection();
        setShowMove(false);
        setMoveTargetFolder('');
    }
    // Outside click for bulk menu
    // ✅ all hooks first (useState, useEffect, etc.)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (bulkMenuOpen && bulkMenuRef.current && !bulkMenuRef.current.contains(e.target as Node)) {
                setBulkMenuOpen(false);
                clearSelection();
            }
        }
        if (bulkMenuOpen) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [bulkMenuOpen]);

    // ❌ previously before hooks
    if (!open) return null; // ✅ now it’s after all hooks


    return (
        <div className="fixed inset-0 z-50">
            <div className="bg-white w-screen h-screen relative p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Choose From Media</h2>
                    <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={onClose}>&times;</button>
                </div>
                <div className="flex max-md:flex-col items-center justify-between gap-2 mb-4">
                    <div className="relative flex gap-4">
                        <button className="bg-gray-100 px-3 py-1 rounded text-gray-700" onClick={() => setOpenFilter((prev) => !prev)}>
                            Filter <span className="ml-1">&#9662;</span>
                        </button>
                        <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-10">
                            {openFilter && filterOptions.map(opt => (
                                <button key={opt} className={`block px-4 py-1 text-sm w-full text-left ${activeFilter === opt ? 'bg-gray-100' : ''}`} onClick={() => setActiveFilter(opt)}>{opt}</button>
                            ))}
                        </div>
                        <button className="bg-gray-100 px-3 py-1 rounded text-gray-700" onClick={() => setOpenSort((prev) => !prev)}>
                            Sort by <span className="ml-1">&#9662;</span>
                        </button>
                        <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-10">
                            {openSort && sortOptions.map(opt => (
                                <button key={opt} className={`block px-2 py-1 text-sm w-full text-left ${activeSort === opt ? 'bg-gray-100' : ''}`} onClick={() => setActiveSort(opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>

                    <input type="text" className="ml-2 px-3 py-1 border rounded w-64" placeholder="Search file" value={search} onChange={e => setSearch(e.target.value)} />
                    <div className='flex gap-4'>
                        <button className="ml-auto bg-gray-300 px-4 py-1 rounded text-gray-700" onClick={() => setShowAddFolder(true)}>Add Folder</button>
                        <button className="bg-[#009FE3] px-4 py-1 rounded text-white font-semibold" onClick={() => setShowUpload(true)}>Upload</button>
                    </div>
                </div>
                <div className="mb-2 text-sm text-[#009FE3] cursor-pointer">
                    {media.map((folder, idx) => (
                        <span key={folder.name}>
                            <span
                                className={folder.name === currentFolder ? 'font-bold underline' : 'hover:underline'}
                                style={{ cursor: 'pointer', color: '#009FE3' }}
                                onClick={() => setCurrentFolder(folder.name)}
                            >
                                {folder.name}/
                            </span>
                            {idx < media.length - 1 && <span> </span>}
                        </span>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {/* Show folders only if in home */}
                    {currentFolder === 'home' && media.filter(f => f.type === 'folder' && f.name !== 'home').map((folder) => (
                        <div key={folder.name} className="bg-gray-100 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer" onClick={() => setCurrentFolder(folder.name)}>
                            <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="8" y="16" width="24" height="16" fill="#bbb" /><rect x="8" y="8" width="12" height="8" fill="#bbb" /></svg>
                            <div className="mt-2 text-gray-700 text-sm font-medium">{folder.name}</div>
                        </div>
                    ))}
                    {/* Show files in current folder */}
                    {sortedMedia.map((m, i) => {
                        const isSelected = selectedFiles.some(f => f.name === m.name);
                        return (
                            <div key={i} className={`bg-gray-100 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer relative ${isSelected ? 'bg-blue-100' : ''}`}
                                onClick={() => toggleFileSelection(m)}>
                                <input type="checkbox" checked={isSelected} onChange={() => toggleFileSelection(m)} className="absolute top-2 left-2 w-4 h-4 accent-pink-500" />
                                <Image src={m.src} alt={m.name} width={1000} height={1000} className="w-20 h-20 object-cover rounded" />
                            </div>
                        );
                    })}
                </div>
                {/* Bulk options menu */}
                <div className="flex gap-2 mb-6">
                    <button className={`bg-gray-300 px-4 py-1 rounded text-gray-700 ${bulkMenuOpen ? 'font-bold' : ''}`} onClick={() => { setBulkMenuOpen(!bulkMenuOpen); }}>Options</button>
                    {bulkMenuOpen && (
                        <div className="relative" ref={bulkMenuRef}>
                            <div className="absolute top-0 left-0 bg-white rounded shadow-lg border w-48 z-40">
                                <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left" disabled={selectedFiles.length === 0} onClick={() => {
                                    // if (selectedFiles.length === 1) {
                                    // setSelectedFile(selectedFiles[0]);
                                    setShowDetails(true);
                                    setBulkMenuOpen(false);
                                    // }
                                }}>View Details</button>
                                <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left" disabled={selectedFiles.length !== 1} onClick={() => {
                                    if (selectedFiles.length === 1) {
                                        window.open(selectedFiles[0].src, '_blank');
                                        setBulkMenuOpen(false);
                                    }
                                }}>Download</button>
                                <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left" disabled={selectedFiles.length === 0} onClick={() => {
                                    if (selectedFiles.length > 0) {
                                        setShowMove(true);
                                        setBulkMenuOpen(false);
                                    }
                                }}>Move</button>
                                <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left text-red-600" disabled={selectedFiles.length === 0} onClick={() => {
                                    if (selectedFiles.length > 0) {
                                        setShowDelete(true);
                                        setBulkMenuOpen(false);
                                    }
                                }}>Delete</button>
                            </div>
                        </div>
                    )}
                </div>
                {/* View Details Modal */}
                {showDetails && selectedFiles.length > 0 && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                        <div className="bg-white rounded-lg shadow-xl w-[500px] max-w-full p-6 relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">View Details</h3>
                                <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowDetails(false)}>&times;</button>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2">Image / Video</th>
                                        <th>Name</th>
                                        <th>Last Modified</th>
                                        <th>File Size</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedFiles.map((file, idx) => (
                                        <tr key={file.name + idx}>
                                            <td className="py-2"><Image src={file.src || ''} alt={file.name} width={40} height={40} className="rounded" /></td>
                                            <td>{file.name}</td>
                                            <td>{file.lastModified || '-'}</td>
                                            <td>{file.size || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* Move Modal */}
                {showMove && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                        <div className="bg-white rounded-lg shadow-xl w-[500px] max-w-full p-6 relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Select Folder <span className="text-[#009FE3]">home/</span></h3>
                                <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => { setShowMove(false); setMoveTargetFolder(''); }}>×</button>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th></th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {media.filter(f => f.type === 'folder').map((folder) => (
                                        <tr key={folder.name}>
                                            <td><input type="radio" name="moveTarget" checked={moveTargetFolder === folder.name} onChange={() => setMoveTargetFolder(folder.name)} /></td>
                                            <td className="flex items-center gap-2"><svg width="32" height="32" fill="none" viewBox="0 0 40 40"><rect x="8" y="16" width="24" height="16" fill="#bbb" /><rect x="8" y="8" width="12" height="8" fill="#bbb" /></svg>{folder.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end mt-4">
                                <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]" disabled={!moveTargetFolder} onClick={handleMoveFiles}>Move</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Delete Modal */}
                {showDelete && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                        <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-full p-6 relative">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="text-5xl text-red-500 mb-2">&#9888;</div>
                                <div className="text-center font-semibold mb-2">Delete selected items? This action is permanent and can not be undone.</div>
                                <div className="mb-2">Type <span className="font-bold">DELETE</span> to confirm</div>
                                <input type="text" className="border px-3 py-2 rounded w-full mb-2" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} />
                                <div className="flex gap-2 mt-2">
                                    <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => { setShowDelete(false); setDeleteConfirm(''); }}>Cancel</button>
                                    <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]" disabled={deleteConfirm !== 'DELETE'} onClick={() => { setShowDelete(false); setDeleteConfirm(''); /* delete logic here */ }}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showUpload && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                        <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-full p-6 relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Upload Media</h3>
                                <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowUpload(false)}>&times;</button>
                            </div>
                            <div className="border-dashed border-2 border-[#009FE3] rounded-lg p-8 py-20 my-12 text-center cursor-pointer" onClick={() => {
                                const input = document.getElementById('media-upload-input');
                                if (input) input.click();
                            }}>
                                <input id="media-upload-input" type="file" className="hidden" onChange={handleUpload} />
                                <span className="text-gray-600">Drop files here or click to upload.</span>
                            </div>
                            <div className="flex justify-end mt-4 gap-2">
                                <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setShowUpload(false)}>Close</button>
                                <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]">Upload</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Add Folder Modal */}
                {showAddFolder && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                        <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-full relative">
                            <div className="flex items-center justify-between p-6">
                                <h3 className="text-lg font-semibold">Add Folder</h3>
                                <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowAddFolder(false)}>&times;</button>
                            </div>
                            <div className="flex gap-4 p-4 py-10 space-y-10 border-y border-gray-200">
                                <label className="block text-gray-700 mb-2">Folder Name <span className="text-red-500">*</span></label>
                                <div className='flex-1'>
                                    <input type="text" className="border px-3 py-1 w-full text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400 border-gray-200" value={folderName} onChange={e => setFolderName(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2  p-6">
                                <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setShowAddFolder(false)}>Close</button>
                                <button className="px-4 py-2 rounded bg-[#009FE3] text-white font-semibold hover:bg-[#007bb5]" onClick={handleAddFolder}>Add Folder</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaPicker;
