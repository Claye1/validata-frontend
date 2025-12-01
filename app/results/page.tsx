'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generatingSynthetic, setGeneratingSynthetic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://validata-backend-production.up.railway.app/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      router.push(`/results?id=${data.dataset_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSynthetic = async () => {
    setGeneratingSynthetic(true);
    setError(null);

    try {
      const response = await fetch('https://validata-backend-production.up.railway.app/generate-synthetic', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate synthetic data');
      }

      const data = await response.json();
      router.push(`/results?id=${data.dataset_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate synthetic data');
    } finally {
      setGeneratingSynthetic(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Validata</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Log in
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Automated Health Validation Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your datasets, get instant quality scores, detect issues automatically, 
            and generate privacy-safe synthetic data.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Get Started
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Instant Validation Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  1
                </span>
                Instant Validation
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-16 h-16 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium mb-2">
                      {file ? file.name : 'Click to upload CSV file'}
                    </span>
                    <span className="text-sm text-gray-500">
                      or drag and drop
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    '📊 Upload & Validate'
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  OR
                </span>
              </div>
            </div>

            {/* Synthetic Data Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  2
                </span>
                Generate Synthetic Data
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Don't have data? Try our synthetic customer dataset with intentional quality issues.
              </p>
              <button
                onClick={handleGenerateSynthetic}
                disabled={generatingSynthetic}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
              >
                {generatingSynthetic ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  '🎲 Generate Synthetic Data'
                )}
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Validation</h3>
              <p className="text-sm text-gray-600">
                Detect missing values, duplicates, type errors, and outliers automatically.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Error Detection</h3>
              <p className="text-sm text-gray-600">
                Comprehensive analysis with 6 different quality checks and detailed reports.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Synthetic Data</h3>
              <p className="text-sm text-gray-600">
                Generate privacy-safe test datasets with realistic quality issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
