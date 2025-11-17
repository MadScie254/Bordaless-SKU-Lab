
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon } from './icons';

interface AdvancedFiltersProps {
    onSearch: (query: string) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    moqRange: [number, number];
    setMoqRange: (range: [number, number]) => void;
    countries: string[];
    selectedCountries: string[];
    setSelectedCountries: (countries: string[]) => void;
    maxPrice: number;
    maxMoq: number;
    isAiSearching: boolean;
    resetFilters: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = (props) => {
    const { onSearch, priceRange, setPriceRange, moqRange, setMoqRange, countries, selectedCountries, setSelectedCountries, maxPrice, maxMoq, isAiSearching, resetFilters } = props;
    const [query, setQuery] = useState('');
    const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSearch = () => {
        onSearch(query);
    };

    const handleCountryToggle = (country: string) => {
        const newSelection = selectedCountries.includes(country)
            ? selectedCountries.filter(c => c !== country)
            : [...selectedCountries, country];
        setSelectedCountries(newSelection);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCountriesDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mb-8 p-4 border border-border bg-surface-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2">
                    <input 
                        type="text"
                        placeholder="AI Search: 'leather goods from kenya under $30'..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full bg-background p-3 pl-10 border border-border focus:border-primary outline-none"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                     {isAiSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>}
                </div>
                {/* Price Slider */}
                <div className="lg:col-span-1">
                    <label className="block text-xs text-text-muted mb-1">PRICE (USD)</label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">${priceRange[0]}</span>
                        <input type="range" min="0" max={maxPrice} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full" />
                        <span className="text-sm">${priceRange[1]}</span>
                    </div>
                </div>
                {/* MOQ Slider */}
                 <div className="lg:col-span-1">
                    <label className="block text-xs text-text-muted mb-1">MIN. ORDER (MOQ)</label>
                     <div className="flex items-center gap-2">
                        <span className="text-sm">{moqRange[0]}</span>
                        <input type="range" min="0" max={maxMoq} value={moqRange[1]} onChange={e => setMoqRange([moqRange[0], Number(e.target.value)])} className="w-full" />
                        <span className="text-sm">{moqRange[1]}</span>
                    </div>
                </div>

                <div className="relative lg:col-span-1" ref={dropdownRef}>
                    <button onClick={() => setIsCountriesDropdownOpen(!isCountriesDropdownOpen)} className="w-full bg-background p-3 border border-border text-left">
                       {selectedCountries.length > 0 ? `${selectedCountries.length} Countries Selected` : 'All Countries'}
                    </button>
                    {isCountriesDropdownOpen && (
                        <div className="absolute top-full left-0 w-full bg-surface-2 border border-border mt-1 z-10 max-h-60 overflow-y-auto">
                            {countries.map(country => (
                                <label key={country} className="flex items-center gap-2 p-2 hover:bg-surface-1 cursor-pointer">
                                    <input type="checkbox" checked={selectedCountries.includes(country)} onChange={() => handleCountryToggle(country)} />
                                    {country}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="text-right mt-4">
                 <button onClick={resetFilters} className="text-xs text-secondary hover:underline">Reset Filters</button>
            </div>
        </div>
    );
};

export default AdvancedFilters;
