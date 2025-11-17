
import React, { useState } from 'react';
import { MOCK_TREND_DATA } from '../constants';
import { ArrowUpIcon, ArrowDownIcon, ChartBarIcon } from './icons';
import { Trend, PriceShift } from '../types';

const TrendList: React.FC<{ title: string, data: Trend[] }> = ({ title, data }) => (
    <div className="bg-surface-1 p-4 border border-border">
        <h3 className="font-bold text-secondary mb-4">{title}</h3>
        <ul className="space-y-3">
            {data.map(item => (
                <li key={item.name} className="flex justify-between items-center text-sm">
                    <span>{item.name}</span>
                    <span className={`flex items-center font-bold ${item.change > 0 ? 'text-primary' : 'text-red-500'}`}>
                        {item.change > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        {Math.abs(item.change)}%
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

const LineChart: React.FC<{ data: PriceShift[], title: string }> = ({ data, title }) => {
    const prices = data.map(p => p.avgPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    const points = data.map((point, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((point.avgPrice - minPrice) / priceRange) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-surface-1 p-4 border border-border">
            <h3 className="font-bold text-secondary mb-4">{title}</h3>
            <div className="h-64 w-full bg-surface-2 p-4 relative">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="2"
                        points={points}
                    />
                </svg>
                <div className="absolute top-4 left-4 text-xs text-text-muted">High: ${maxPrice.toFixed(2)}</div>
                <div className="absolute bottom-4 left-4 text-xs text-text-muted">Low: ${minPrice.toFixed(2)}</div>
            </div>
             <div className="flex justify-between mt-2 text-xs text-text-muted">
                {data.map(p => <span key={p.month}>{p.month}</span>)}
            </div>
        </div>
    )
}

const MarketTrends: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('Home Goods');
    const { trendingCategories, inDemandMaterials, globalPriceShifts } = MOCK_TREND_DATA;

    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary">LIVE MARKET TRENDS</h2>
                <p className="text-text-muted max-w-2xl mx-auto mt-2">
                    Leverage real-time data to identify opportunities, track material demand, and understand pricing shifts across the global marketplace.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <TrendList title="TRENDING CATEGORIES (30D)" data={trendingCategories} />
                </div>
                <div className="md:col-span-1">
                    <TrendList title="IN-DEMAND MATERIALS (30D)" data={inDemandMaterials} />
                </div>
                 <div className="md:col-span-1">
                    <div className="bg-surface-1 p-4 border border-border">
                        <h3 className="font-bold text-secondary mb-4 flex items-center gap-2"><ChartBarIcon /> GLOBAL PRICE SHIFTS</h3>
                        <p className="text-sm text-text-muted mb-4">Select a category to see its average unit price trend over the last 6 months.</p>
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                            className="w-full bg-background text-text-base p-2 border border-border focus:border-primary outline-none"
                        >
                            {Object.keys(globalPriceShifts).map(cat => <option key={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                {globalPriceShifts[activeCategory] && (
                    <LineChart data={globalPriceShifts[activeCategory]} title={`AVG. PRICE: ${activeCategory}`} />
                )}
            </div>
        </div>
    );
};

export default MarketTrends;
