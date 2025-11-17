
import React, { useMemo } from 'react';
import { ProductBatch } from '../types';
import { ChartBarIcon, CubeIcon } from './icons';

interface DashboardAnalyticsProps {
    products: ProductBatch[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface-2 p-4 border border-border transition-all duration-300 hover:border-primary hover:shadow-glow-primary">
        <div className="flex items-center gap-4">
            <div className="text-primary">{icon}</div>
            <div>
                <p className="text-xs text-text-muted">{title}</p>
                <p className="text-2xl font-bold text-text-base">{value}</p>
            </div>
        </div>
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number }[]; title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-surface-2 p-4 border border-border h-full">
            <h4 className="text-sm font-bold text-secondary mb-4">{title}</h4>
            <div className="flex justify-around items-end h-48 gap-2">
                {data.map(item => (
                    <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full h-full flex items-end">
                            <div
                                className="w-full bg-primary transition-all duration-500 hover:opacity-80"
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                                title={`${item.label}: ${item.value}`}
                            />
                        </div>
                        <p className="text-xs text-text-muted">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ products }) => {
    const analyticsData = useMemo(() => {
        const totalRevenue = products.reduce((acc, p) => acc + p.unitPriceUSD * p.qtyAvailable, 0);
        const totalSKUs = products.length;
        const avgPrice = totalSKUs > 0 ? products.reduce((acc, p) => acc + p.unitPriceUSD, 0) / totalSKUs : 0;
        
        const qualityDistribution = products.reduce((acc, p) => {
            if (p.mlQualityScore) {
                acc[p.mlQualityScore] = (acc[p.mlQualityScore] || 0) + 1;
            }
            return acc;
        }, {} as Record<'A'|'B'|'C'|'D', number>);

        const monthlyRevenueData = [
            { label: 'Jan', value: 3400 }, { label: 'Feb', value: 2800 },
            { label: 'Mar', value: 4500 }, { label: 'Apr', value: 4200 },
            { label: 'May', value: 5100 }, { label: 'Jun', value: 4800 },
        ];
        
        const qualityChartData = [
            { label: 'A', value: qualityDistribution.A || 0 },
            { label: 'B', value: qualityDistribution.B || 0 },
            { label: 'C', value: qualityDistribution.C || 0 },
            { label: 'D', value: qualityDistribution.D || 0 },
        ];

        return { totalRevenue, totalSKUs, avgPrice, monthlyRevenueData, qualityChartData };
    }, [products]);

    return (
        <div className="bg-surface-1 p-4 border border-border">
             <h3 className="text-xl mb-4 text-text-base">ANALYTICS OVERVIEW</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard title="POTENTIAL REVENUE" value={`$${analyticsData.totalRevenue.toLocaleString()}`} icon={<ChartBarIcon className="h-8 w-8" />} />
                <StatCard title="TOTAL SKUs" value={analyticsData.totalSKUs.toString()} icon={<CubeIcon className="h-8 w-8" />} />
                <StatCard title="AVG. UNIT PRICE" value={`$${analyticsData.avgPrice.toFixed(2)}`} icon={<ChartBarIcon className="h-8 w-8" />} />
                <StatCard title="MOCK ORDERS" value="128" icon={<ChartBarIcon className="h-8 w-8" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart data={analyticsData.monthlyRevenueData} title="REVENUE (LAST 6 MONTHS)" />
                <BarChart data={analyticsData.qualityChartData} title="SKU QUALITY DISTRIBUTION" />
            </div>
        </div>
    );
};

export default DashboardAnalytics;
