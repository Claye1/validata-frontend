'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Results() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const datasetId = searchParams.get('id');

  useEffect(() => {
    if (!datasetId) {
      router.push('/dashboard');
      return;
    }

    fetchResults();
  }, [datasetId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`https://validata-backend-production.up.railway.app/validate/${datasetId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Results not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Validata</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Validation Results</h2>

          {/* Quality Score Card */}
          <div className={`rounded-lg border-2 p-8 mb-8 ${getScoreBgColor(results.score)}`}>
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-2">Overall Quality Score</p>
              <p className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
                {results.score}%
              </p>
              <p className="text-gray-600 mt-4">
                {results.score >= 90 && 'Excellent data quality!'}
                {results.score >= 70 && results.score < 90 && 'Good data quality with minor issues'}
                {results.score < 70 && 'Data quality needs improvement'}
              </p>
            </div>
          </div>

          {/* Issues Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Issues Found</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-red-500 pl-4">
                <p className="text-gray-600 text-sm">Missing Values</p>
                <p className="text-3xl font-bold text-gray-900">{results.missing}</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-gray-600 text-sm">Duplicate Rows</p>
                <p className="text-3xl font-bold text-gray-900">{results.duplicates}</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Total Issues:</strong> {results.missing + results.duplicates}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Next Steps</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => alert('Download report feature coming soon!')}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Download Full Report (PDF)
              </button>

              <button
                onClick={() => alert('Synthetic data generation coming soon!')}
                className="w-full bg-white text-indigo-600 border-2 border-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Generate Synthetic Data
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Upload Another Dataset
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
            <ul className="space-y-3 text-gray-700">
              {results.missing > 0 && (
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Address {results.missing} missing values before using this data in production
                </li>
              )}
              {results.duplicates > 0 && (
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Remove {results.duplicates} duplicate rows to improve data accuracy
                </li>
              )}
              {results.score >= 90 && (
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Your data quality is excellent and ready for analysis
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}