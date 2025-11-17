
import React from 'react';
import { MOCK_ANALYTICS_V2 } from '../constants';
import { FunnelIcon, GlobeAltIcon, ChartBarIcon } from './icons';
import { FunnelData } from '../types';

const FunnelChart: React.FC<{ data: FunnelData[] }> = ({ data }) => {
    const maxCount = data[0]?.count || 1;
    return (
        <div className="space-y-2">
            {data.map((stage, index) => {
                const widthPercentage = (stage.count / maxCount) * 100;
                const conversionRate = index > 0 ? ((stage.count / data[index - 1].count) * 100).toFixed(1) : 100;
                return (
                    <div key={stage.stage}>
                        <div className="flex justify-between items-center text-xs text-text-muted mb-1">
                            <span>{stage.stage}</span>
                            <span>
                                {stage.count.toLocaleString()}
                                {index > 0 && <span className="ml-2 text-secondary">({conversionRate}%)</span>}
                            </span>
                        </div>
                        <div className="h-6 bg-surface-2 border border-border">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${widthPercentage}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const GeoMap: React.FC<{ data: typeof MOCK_ANALYTICS_V2.geoDemographics }> = ({ data }) => {
    const maxViews = Math.max(...data.map(d => d.views));
    return (
        <div className="bg-surface-2 p-4 border border-border aspect-video relative overflow-hidden">
            <img src="/assets/world-map.svg" alt="World Map" className="absolute inset-0 w-full h-full object-contain opacity-10" />
            <div className="relative w-full h-full">
                {/* Simplified bubble placement */}
                <div className="absolute top-[35%] left-[20%]" title="USA">
                    <div className="h-10 w-10 bg-secondary/50 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute top-[30%] left-[50%]" title="Europe">
                    <div className="h-8 w-8 bg-secondary/50 rounded-full animate-pulse animation-delay-300"></div>
                </div>
                <div className="absolute top-[65%] left-[80%]" title="Australia">
                    <div className="h-6 w-6 bg-secondary/50 rounded-full animate-pulse animation-delay-500"></div>
                </div>
                 <div className="absolute top-[40%] left-[75%]" title="Japan">
                    <div className="h-5 w-5 bg-secondary/50 rounded-full animate-pulse animation-delay-200"></div>
                </div>
            </div>
        </div>
    );
};

const TopPerformingSKUs: React.FC<{ data: typeof MOCK_ANALYTICS_V2.topPerformingSkus }> = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-muted uppercase border-b border-border">
                    <tr>
                        <th scope="col" className="px-4 py-2">SKU Title</th>
                        <th scope="col" className="px-4 py-2 text-right">Views</th>
                        <th scope="col" className="px-4 py-2 text-right">Favorites</th>
                        <th scope="col" className="px-4 py-2 text-right">Orders</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(sku => (
                        <tr key={sku.skuId} className="border-b border-border hover:bg-surface-2">
                            <td className="px-4 py-2 font-medium truncate max-w-xs">{sku.skuTitle}</td>
                            <td className="px-4 py-2 text-right">{sku.views.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right">{sku.favorites.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right font-bold text-primary">{sku.orders.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DashboardAnalyticsV2: React.FC = () => {
    const { conversionFunnels, geoDemographics, topPerformingSkus } = MOCK_ANALYTICS_V2;

    return (
        <div className="bg-surface-1 p-4 border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <h3 className="text-xl mb-4 text-text-base flex items-center gap-2"><FunnelIcon /> CONVERSION FUNNEL</h3>
                    <div className="p-4 bg-surface-1 border border-border">
                        <FunnelChart data={conversionFunnels} />
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <h3 className="text-xl mb-4 text-text-base flex items-center gap-2"><GlobeAltIcon /> GLOBAL VIEWERS</h3>
                    <GeoMap data={geoDemographics} />
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-xl mb-4 text-text-base flex items-center gap-2"><ChartBarIcon /> TOP PERFORMING SKUS</h3>
                <div className="p-4 bg-surface-1 border border-border">
                    <TopPerformingSKUs data={topPerformingSkus} />
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalyticsV2;
