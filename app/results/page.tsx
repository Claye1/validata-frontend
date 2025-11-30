function ResultsContent() {
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

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'border-red-500 bg-red-50';
    if (severity === 'medium') return 'border-orange-500 bg-orange-50';
    return 'border-yellow-500 bg-yellow-50';
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') return 'bg-red-100 text-red-800';
    if (severity === 'medium') return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
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
        <div className="max-w-5xl mx-auto">
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
              <p className="text-sm text-gray-500 mt-2">
                {results.total_issues} total issues detected
              </p>
            </div>
          </div>

          {/* Detailed Issues Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Issues Detected</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {results.details && Object.entries(results.details).map(([key, detail]: [string, any]) => (
                <div 
                  key={key} 
                  className={`border-l-4 p-4 rounded ${getSeverityColor(detail.severity)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityBadge(detail.severity)}`}>
                      {detail.severity}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{detail.count}</p>
                  <p className="text-sm text-gray-600">{detail.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Next Steps</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => alert('PDF download feature coming in Phase 3!')}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                📄 Download Full Report (PDF)
              </button>

              <button
                onClick={() => alert('Synthetic data generation coming soon!')}
                className="w-full bg-white text-indigo-600 border-2 border-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                🔒 Generate Synthetic Data
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                ⬆️ Upload Another Dataset
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {results.details?.missing_values?.count > 0 && (
                <div className="flex items-start p-3 bg-red-50 rounded">
                  <span className="text-red-500 mr-3 text-xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-gray-800">Address Missing Values</p>
                    <p className="text-sm text-gray-600">
                      {results.details.missing_values.count} missing values found. Consider imputation or data collection improvements.
                    </p>
                  </div>
                </div>
              )}
              
              {results.details?.type_errors?.count > 0 && (
                <div className="flex items-start p-3 bg-orange-50 rounded">
                  <span className="text-orange-500 mr-3 text-xl">🔧</span>
                  <div>
                    <p className="font-semibold text-gray-800">Fix Type Errors</p>
                    <p className="text-sm text-gray-600">
                      {results.details.type_errors.count} type mismatches detected. Ensure data types match expected formats.
                    </p>
                  </div>
                </div>
              )}
              
              {results.score >= 90 && (
                <div className="flex items-start p-3 bg-green-50 rounded">
                  <span className="text-green-500 mr-3 text-xl">✅</span>
                  <div>
                    <p className="font-semibold text-gray-800">Ready for Production</p>
                    <p className="text-sm text-gray-600">
                      Your data quality is excellent and ready for analysis and reporting.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}