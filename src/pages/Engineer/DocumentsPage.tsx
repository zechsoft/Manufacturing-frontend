import { useState, useEffect } from "react";
import { Upload, File, Download, Trash2 } from "lucide-react";

const DocumentsPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch uploaded documents from backend
  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/engineer/documents`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data);
      } else {
        console.error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/engineer/documents/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        setSelectedFile(null);
        fetchDocuments(); // Refresh list
      } else {
        alert("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  // Handle file delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/engineer/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        alert("File deleted successfully!");
        fetchDocuments();
      } else {
        alert("Failed to delete file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar space alignment */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents Management</h1>
            <p className="text-gray-600">Upload and manage engineering documents</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Upload Document
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full border border-gray-300 rounded-md p-2"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <strong>{selectedFile.name}</strong>
            </p>
          )}
        </div>

        {/* Uploaded Documents List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <File className="w-5 h-5 text-green-600" />
            Uploaded Documents
          </h2>

          {uploadedFiles.length === 0 ? (
            <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
          ) : (
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">File Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file) => (
                  <tr key={file._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{file.originalName || file.name}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {new Date(file.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <a
                        href={`${import.meta.env.VITE_API_URL}/api/engineer/documents/${file._id}/download`}
                        className="text-blue-600 hover:underline mr-3 inline-flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="text-red-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
