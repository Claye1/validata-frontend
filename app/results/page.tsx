'use client';
import { generateValidationReport } from '@/lib/pdfGenerator';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <ResultsContent />
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const datasetId = searchParams.get('id');

  const [results, setResults] = useState<any>(null);
  const [datasetInfo, setDatasetInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!datasetId) {
      setError('No dataset ID provided');
      setLoading(false);
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
      
      // Fetch dataset info for PDF generation
      const datasetResponse = await fetch(`https://validata-backend-production.up.railway.app/dataset/${datasetId}`);
      if (datasetResponse.ok) {
        const datasetData = await datasetResponse.json();
        setDatasetInfo(datasetData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading validation results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No results found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

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

  const getScoreStatus = (score: number) => {
    if (score >= 90) return 'Excellent Quality';
    if (score >= 70) return 'Good Quality';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 inline-flex items-center"
        >
          ← Back to Home
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Validation Results</h1>
        <p className="text-gray-600">
          {datasetInfo ? `Dataset: ${datasetInfo.filename}` : 'Your data quality report'}
        </p>
      </div>

      {/* Quality Score Card */}
      <div className={`border-2 rounded-2xl p-8 mb-8 ${getScoreBgColor(results.score)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Quality Score</h2>
            <p className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
              {results.score}%
            </p>
            <p className={`text-lg font-semibold mt-2 ${getScoreColor(results.score)}`}>
              {getScoreStatus(results.score)}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total Issues</p>
              <p className="text-3xl font-bold text-gray-900">{results.total_issues}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Issues Detected</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IssueCard
            title="Missing Values"
            count={results.issues.missing_values}
            icon="🔍"
            severity="high"
          />
          <IssueCard
            title="Duplicate Rows"
            count={results.issues.duplicate_rows}
            icon="📋"
            severity="medium"
          />
          <IssueCard
            title="Type Errors"
            count={results.issues.type_errors}
            icon="⚠️"
            severity="high"
          />
          <IssueCard
            title="Out of Range"
            count={results.issues.out_of_range}
            icon="📊"
            severity="medium"
          />
          <IssueCard
            title="Invalid Patterns"
            count={results.issues.invalid_patterns}
            icon="🔤"
            severity="low"
          />
          <IssueCard
            title="Outliers"
            count={results.issues.outliers}
            icon="📈"
            severity="low"
          />
        </div>
      </div>

      {/* Recommendations */}
      {results.total_issues > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Recommendations</h2>
          <ul className="space-y-3">
            {results.issues.missing_values > 0 && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">
                  Address <strong>{results.issues.missing_values}</strong> missing values before production use
                </span>
              </li>
            )}
            {results.issues.type_errors > 0 && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">
                  Fix <strong>{results.issues.type_errors}</strong> type errors to ensure data consistency
                </span>
              </li>
            )}
            {results.issues.duplicate_rows > 0 && (
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">
                  Remove <strong>{results.issues.duplicate_rows}</strong> duplicate rows to improve accuracy
                </span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => {
            if (results && datasetInfo) {
              generateValidationReport(results, datasetInfo);
            }
          }}
          className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
        >
          📄 Download Full Report (PDF)
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-gray-200 text-gray-800 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          🔄 Validate Another Dataset
        </button>
      </div>

      {/* Dataset Info */}
      {datasetInfo && (
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Validated on {new Date(results.created_at).toLocaleString()}</p>
          <p>Rows analyzed: {datasetInfo.rows.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

function IssueCard({ title, count, icon, severity }: { 
  title: string; 
  count: number; 
  icon: string; 
  severity: 'high' | 'medium' | 'low' 
}) {
  const getSeverityColor = () => {
    switch (severity) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-blue-300 bg-blue-50';
    }
  };

  const getSeverityBadge = () => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getSeverityColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${getSeverityBadge()}`}>
          {severity.toUpperCase()}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
    </div>
  );
}