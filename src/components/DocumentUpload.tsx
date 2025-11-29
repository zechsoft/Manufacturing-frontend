import React, { useState } from 'react';

const DocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    formData.append('document', file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/document`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Upload Document</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {result && (
        <div className="mt-2 text-green-600">
          Uploaded! <a href={result} target="_blank" rel="noopener noreferrer" className="underline">View Document</a>
        </div>
      )}
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
};

export default DocumentUpload; 
