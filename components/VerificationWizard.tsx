
import React, { useState, useCallback } from 'react';
import { ProductBatch, QualityAnalysisResult, ListingSuggestions } from '../types';
import Modal from './Modal';
import ImageAnalysis from './ImageAnalysis';
import ListingAssistant from './ListingAssistant';
import { CameraIcon, CheckCircleIcon, SparklesIcon } from './icons';

interface VerificationWizardProps {
  onClose: () => void;
  onProductAdd: (newProduct: ProductBatch) => void;
}

const VerificationWizard: React.FC<VerificationWizardProps> = ({ onClose, onProductAdd }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    moq: '50',
    unitPriceUSD: '20',
    qtyAvailable: '200'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<QualityAnalysisResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applySuggestion = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    const now = Date.now();
    const newProduct: ProductBatch = {
      supplierId: 'supp_current_user',
      title: formData.title,
      category: formData.category,
      description: formData.description,
      materials: ['User-defined material'],
      specs: { 'Custom Spec': 'Value' },
      moq: parseInt(formData.moq),
      leadTimeDays: 20,
      images: imagePreview ? [imagePreview] : ['https://picsum.photos/800/600'],
      id: `batch_${now}`,
      productId: `prod_${now}`,
      qtyAvailable: parseInt(formData.qtyAvailable),
      unitPriceUSD: parseFloat(formData.unitPriceUSD),
      status: 'verifying',
      mlQualityScore: analysisResult?.qualityScore,
    };
    onProductAdd(newProduct);
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-cyan">Step 1: Product Details</h3>
            <div className="space-y-4">
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Product Title" className="w-full bg-dark-bg p-2 border border-dark-gray focus:border-primary-lime outline-none" />
              <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Category (e.g., Textile Accessories)" className="w-full bg-dark-bg p-2 border border-dark-gray focus:border-primary-lime outline-none" />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full bg-dark-bg p-2 border border-dark-gray focus:border-primary-lime outline-none" rows={4}></textarea>
              <div className="grid grid-cols-3 gap-4">
                <input name="moq" value={formData.moq} onChange={handleInputChange} placeholder="MOQ" type="number" className="w-full bg-dark-bg p-2 border border-dark-gray focus:border-primary-lime outline-none" />
                <input name="unitPriceUSD" value={formData.unitPriceUSD} onChange={handleInputChange} placeholder="Unit Price (USD)" type="number" className="w-full bg-dark-bg p-2 border border-dark-gray focus:border-primary-lime outline-none" />
                <input name="qtyAvailable" value={formData.qtyAvailable} onChange={handleInputChange} placeholder="Quantity Available" type="number" className="w-full bg-dark-bg p-2 border border-dark-gray focus:border-primary-lime outline-none" />
              </div>
            </div>
          </div>
        );
       case 2:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-cyan flex items-center gap-2"><SparklesIcon />Step 2: AI Listing Assistant (Optional)</h3>
             <ListingAssistant
              productData={formData}
              onApplySuggestion={applySuggestion}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-cyan">Step 3: Upload QC Photo</h3>
            <p className="text-sm text-medium-gray mb-4">Upload a clear, well-lit photo of one unit from the batch for ML quality analysis.</p>
            <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file-upload" className="w-full h-64 border-2 border-dashed border-dark-gray flex flex-col items-center justify-center cursor-pointer hover:border-primary-lime bg-black/20">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-full max-w-full" />
              ) : (
                <>
                  <CameraIcon />
                  <span className="mt-2">Click to Upload Image</span>
                </>
              )}
            </label>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-cyan">Step 4: ML Quality Analysis</h3>
            {imageFile ? (
              <ImageAnalysis imageFile={imageFile} onAnalysisComplete={setAnalysisResult} />
            ) : (
              <p className="text-medium-gray">Please go back and upload an image first.</p>
            )}
          </div>
        );
      case 5:
         return (
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-cyan flex items-center gap-2"><CheckCircleIcon />Final Step: Review &amp; Submit</h3>
            <p className="text-medium-gray mb-4">Review the details and submit your SKU for verification.</p>
            <div className="space-y-2 text-sm border border-dark-gray p-4 bg-black/20">
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Category:</strong> {formData.category}</p>
              <p><strong>MOQ:</strong> {formData.moq}</p>
              <p><strong>Unit Price:</strong> ${formData.unitPriceUSD}</p>
              <p><strong>ML Quality Score:</strong> <span className="font-bold text-primary-lime">{analysisResult?.qualityScore || "N/A"}</span></p>
            </div>
          </div>
         );
    }
  };

  return (
    <Modal title="Create New Verifiable SKU" onClose={onClose}>
      <div className="min-w-[40vw]">
        {renderStep()}
        <div className="mt-8 flex justify-between items-center">
          <div>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="px-6 py-2 border border-dark-gray hover:bg-dark-gray">BACK</button>
            )}
          </div>
          <div>
            {step < 5 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={(step === 3 && !imageFile) || (step === 4 && !analysisResult)}
                className="px-6 py-2 bg-primary-cyan text-black font-bold border-2 border-black disabled:bg-dark-gray disabled:text-medium-gray disabled:cursor-not-allowed"
              >
                NEXT
              </button>
            ) : (
               <button onClick={handleSubmit} className="px-6 py-2 bg-primary-lime text-black font-bold border-2 border-black hover:bg-black hover:text-primary-lime hover:border-primary-lime">
                 SUBMIT SKU
               </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VerificationWizard;
