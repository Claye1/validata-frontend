export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Validata
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Automated Health Data Validation Platform
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Upload your datasets, get instant quality scores, detect errors automatically, 
            and generate privacy-safe synthetic data.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Get Started
          </h2>
          
          <div className="space-y-4">
            <a 
              href="/login"
              className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </a>
            
            <a 
              href="/signup"
              className="block w-full bg-white text-indigo-600 border-2 border-indigo-600 text-center py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Sign Up
            </a>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Instant Validation
            </h3>
            <p className="text-gray-600">
              Upload CSV files and get quality scores in seconds
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Error Detection
            </h3>
            <p className="text-gray-600">
              Automatically find missing values, type errors, and duplicates
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Synthetic Data
            </h3>
            <p className="text-gray-600">
              Generate privacy-safe datasets for testing and sharing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}