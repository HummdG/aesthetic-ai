export default function Header() {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="text-center">
        {/* Clean Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Aesthetic AI</h1>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Beauty Analysis
        </h2>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          AI-powered facial analysis for informed aesthetic decisions
        </p>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mb-8">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            FDA-compliant analysis
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            HIPAA-secure processing
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
            Board-certified reviewed
          </div>
        </div>

        {/* Professional Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Professional Use:</strong> This analysis is designed for
                educational and consultation planning purposes. Results should
                be reviewed by a qualified medical professional. This tool does
                not replace professional medical advice, diagnosis, or
                treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
