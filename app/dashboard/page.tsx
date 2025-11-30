'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationId, setValidationId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      router.push('/login');
    } else {
      setEmail(userEmail);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File must be smaller than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      const uploadResponse = await fetch('https://validata-backend-production.up.railway.app/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();
      const datasetId = uploadData.dataset_id;

      const validateResponse = await fetch(`https://validata-backend-production.up.railway.app/validate/${datasetId}`, {
        method: 'POST',
      });

      if (!validateResponse.ok) {
        throw new Error('Validation failed');
      }

      const validationData = await validateResponse.json();
      
      setUploadSuccess(true);
      setValidationId(datasetId);
      
      setTimeout(() => {
        router.push(`/results?id=${datasetId}`);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     <nav className="bg-white shadow-sm">
  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-indigo-600">Validata</h1>
    <div className="flex items-center gap-4">
      <button onClick={() => router.push('/history')} className="text-gray-600 hover:text-gray-900">
        History
      </button>
      <span className="text-gray-700">{email}</span>
      <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
        Logout
      </button>
    </div>
  </div>
</nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Dataset</h2>
            <p className="text-gray-600 mb-8">
              Upload a CSV file to validate data quality
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File (Max 5MB)
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {uploadSuccess && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
                  ✓ Upload successful! Redirecting to results...
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Processing...' : 'Upload & Validate'}
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What happens next?
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">1.</span>
                Your CSV file is analyzed for data quality
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">2.</span>
                Missing values, type errors, and duplicates are detected
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">3.</span>
                You receive a quality score and detailed report
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 font-bold mr-2">4.</span>
                Generate synthetic data for testing (optional)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}