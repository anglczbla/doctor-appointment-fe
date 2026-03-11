import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const GeminiAI = () => {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseHistory, setResponseHistory] = useState([]);

  const { backendUrl, token } = useContext(AppContext); 

  const generateAI = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!prompt.trim()) {
      return toast.error('Please enter your health concern');
    }

    // ✅ Cek apakah token tersedia
    if (!token) {
      return toast.error('Please login first');
    }

    setIsLoading(true);
    setAiResponse('');

    try {
      const response = await axios.post(`${backendUrl}/api/user/generate-ai`, {
        prompt: prompt.trim()
      }, {
        headers: { 
          token: token, 
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data); 

      if (response.data.success) {
        setAiResponse(response.data.data);
        
        // Add to history
        const newEntry = {
          id: Date.now(),
          question: prompt,
          answer: response.data.data,
          timestamp: new Date().toLocaleString()
        };
        setResponseHistory(prev => [newEntry, ...prev]);
        
        toast.success('AI recommendation generated successfully!');
        setPrompt(''); // Clear input after successful generation
      } else {
        toast.error(response.data.message || 'Failed to generate AI content');
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        toast.error('API endpoint not found. Please check backend configuration.');
      } else if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setResponseHistory([]);
    setAiResponse('');
    toast.info('History cleared');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            AI Health Specialist Advisor
          </h1>
          <p className="text-gray-600 md:text-lg">
            Get AI-powered recommendations for medical specialists based on your health concerns
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Describe your health concern or symptoms:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: I have been experiencing chest pain and shortness of breath during exercise..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
              rows="4"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                generateAI();
              }}
              disabled={isLoading || !prompt.trim() || !token}
              className={`flex-1 py-3 px-8 rounded-full font-medium text-white transition-all duration-300 ${
                isLoading || !prompt.trim() || !token
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Recommendations...
                </div>
              ) : (
                '🤖 Get AI Recommendation'
              )}
            </button>
            
            {responseHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-8 py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-medium rounded-full transition-all border border-transparent hover:border-red-200"
              >
                Clear History
              </button>
            )}
          </div>

          {!token && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
              <span className="text-xl">ℹ️</span>
              <p className="text-blue-800 text-sm font-medium">
                Please login to use our AI Health Specialist Advisor
              </p>
            </div>
          )}
        </div>

        {/* Current Response */}
        {aiResponse && (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🎯</span> AI Recommendation
              </h3>
              <button
                onClick={() => copyToClipboard(aiResponse)}
                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-full transition-all shadow-sm hover:shadow-md"
              >
                📋 Copy Response
              </button>
            </div>
            <div className="prose max-w-none">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                  {aiResponse}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {responseHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📚</span> Previous Consultations
            </h3>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {responseHistory.map((entry) => (
                <div key={entry.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 transition-all bg-gray-50/30">
                  <div className="mb-3">
                    <p className="font-bold text-sm text-blue-600 uppercase tracking-wider mb-1">Your Question:</p>
                    <p className="text-gray-700 text-sm mb-4 bg-white p-3 rounded-lg border border-gray-100">{entry.question}</p>
                    <p className="font-bold text-sm text-green-600 uppercase tracking-wider mb-1">AI Recommendation:</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{entry.answer.substring(0, 250)}...</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-400">{entry.timestamp}</span>
                    <button
                      onClick={() => copyToClipboard(entry.answer)}
                      className="text-xs px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 rounded-full transition-all font-medium"
                    >
                      Copy Full Response
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-amber-50 border border-amber-100 p-5 rounded-2xl flex gap-4">
          <div className="text-2xl">⚠️</div>
          <div>
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong className="block mb-1">Medical Disclaimer:</strong> 
              This AI-generated advice is for informational purposes only and should not replace professional medical consultation. Always consult with qualified healthcare professionals for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAI;