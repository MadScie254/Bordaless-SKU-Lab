
import React, { useState, useEffect } from 'react';
import { analyzeProductImage } from '../services/geminiService';
import { QualityAnalysisResult } from '../types';

interface ImageAnalysisProps {
  imageFile: File;
  onAnalysisComplete: (result: QualityAnalysisResult) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ imageFile, onAnalysisComplete }) => {
  const [result, setResult] = useState<QualityAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const base64Data = await fileToBase64(imageFile);
        const analysisResult = await analyzeProductImage(base64Data, imageFile.type);
        setResult(analysisResult);
        onAnalysisComplete(analysisResult);
      } catch (err) {
        console.error("Image analysis failed:", err);
        setError("Failed to analyze image. Please ensure your API key is configured correctly and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  return (
    <div className="p-4 border border-border bg-surface-2 min-h-[200px] flex items-center justify-center">
      {isLoading && (
        <div>
            <LoadingSpinner />
            <p className="mt-4 text-center text-text-muted">Analyzing image with Gemini... Please wait.</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div className="text-left w-full">
            <h4 className="text-lg font-bold text-secondary mb-3">Analysis Complete</h4>
            <div className="flex items-baseline gap-4 mb-3">
                <span className="text-text-muted">ML QUALITY SCORE:</span>
                <span className={`text-4xl font-bold ${result.qualityScore === 'A' || result.qualityScore === 'B' ? 'text-primary' : 'text-yellow-400'}`}>
                    {result.qualityScore}
                </span>
            </div>
            
            <p className="text-text-muted">OBSERVED ISSUES:</p>
            {result.issues.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1 text-text-base">
                    {result.issues.map((issue, index) => <li key={index}>{issue}</li>)}
                </ul>
            ) : (
                <p className="text-sm text-text-base">No significant issues detected.</p>
            )}
        </div>
      )}
    </div>
  );
};

export default ImageAnalysis;
