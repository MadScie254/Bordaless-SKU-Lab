
import React, { useState } from 'react';
import { getListingSuggestions } from '../services/geminiService';
import { ListingSuggestions } from '../types';
import { MOCK_SUPPLIERS } from '../constants'; // Using mock for country info

interface ListingAssistantProps {
  productData: { title: string; description: string; category: string };
  onApplySuggestion: (field: 'title' | 'description', value: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);


const ListingAssistant: React.FC<ListingAssistantProps> = ({ productData, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState<ListingSuggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!productData.title || !productData.description) {
        setError("Please provide a title and description first.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      // Mocking supplier's country for the API call
      const mockSupplierCountry = MOCK_SUPPLIERS[0].country;
      const result = await getListingSuggestions(productData, mockSupplierCountry);
      setSuggestions(result);
    } catch (err) {
      console.error("Listing suggestion failed:", err);
      setError("Failed to get suggestions. Please ensure your API key is configured and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-border bg-surface-2">
      <p className="text-sm text-text-muted mb-4">
        Use Gemini to enhance your product listing. Based on your inputs and market data, the AI will suggest an optimized title, description, and keywords.
      </p>
      
      {!suggestions && !isLoading && (
        <div className="text-center">
            <button
                onClick={fetchSuggestions}
                disabled={!productData.title || !productData.description}
                className="px-6 py-2 bg-secondary text-black font-bold border-2 border-secondary/50 disabled:bg-surface-1 disabled:text-text-muted disabled:cursor-not-allowed"
            >
                GENERATE SUGGESTIONS
            </button>
             {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      )}

      {isLoading && (
         <div>
            <LoadingSpinner />
            <p className="mt-2 text-center text-xs text-text-muted">Analyzing market data & generating listing...</p>
        </div>
      )}
      
      {suggestions && (
        <div className="space-y-4 text-sm">
            <div>
                <h4 className="font-bold text-secondary">LOCATION INSIGHT</h4>
                <p className="text-xs italic text-text-muted">{suggestions.locationInsight}</p>
            </div>
            <div>
                <h4 className="font-bold text-secondary">SUGGESTED TITLE</h4>
                <div className="p-2 bg-background border border-border flex justify-between items-center text-text-base">
                    <p>{suggestions.suggestedTitle}</p>
                    <button onClick={() => onApplySuggestion('title', suggestions.suggestedTitle)} className="text-xs bg-surface-2 px-2 py-1 hover:bg-primary hover:text-black">APPLY</button>
                </div>
            </div>
             <div>
                <h4 className="font-bold text-secondary">SUGGESTED DESCRIPTION</h4>
                <div className="p-2 bg-background border border-border text-text-base">
                    <p className="mb-2">{suggestions.suggestedDescription}</p>
                    <button onClick={() => onApplySuggestion('description', suggestions.suggestedDescription)} className="text-xs bg-surface-2 px-2 py-1 hover:bg-primary hover:text-black">APPLY</button>
                </div>
            </div>
             <div>
                <h4 className="font-bold text-secondary">SUGGESTED KEYWORDS</h4>
                <div className="flex flex-wrap gap-2">
                    {suggestions.suggestedKeywords.map(kw => (
                        <span key={kw} className="bg-surface-1 text-primary text-xs px-2 py-1">{kw}</span>
                    ))}
                </div>
            </div>
            <div className="text-center">
                <button onClick={fetchSuggestions} className="text-xs text-secondary hover:underline">Regenerate</button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ListingAssistant;
