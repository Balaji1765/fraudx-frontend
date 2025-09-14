import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Feature {
  name: string;
  value: number | string;
  impact: number;
  description: string;
}

interface WaterfallProps {
  features: Feature[];
  baseScore: number;
  finalScore: number;
}

interface WaterfallBar {
  name: string;
  value: number;
  cumulative: number;
  impact: number;
  description: string;
  isPositive: boolean;
  isBase?: boolean;
  isFinal?: boolean;
}

const ExplainabilityWaterfall: React.FC<WaterfallProps> = ({ features, baseScore, finalScore }) => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Transform features into waterfall chart data
  const waterfallData: WaterfallBar[] = [];
  let cumulativeScore = baseScore;

  // Add base score
  waterfallData.push({
    name: 'Base Score',
    value: baseScore,
    cumulative: baseScore,
    impact: 0,
    description: 'Starting risk assessment baseline',
    isPositive: baseScore > 0,
    isBase: true
  });

  // Add each feature contribution
  features
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)) // Sort by impact magnitude
    .forEach((feature) => {
      const contribution = feature.impact * 100; // Convert to score points
      cumulativeScore += contribution;
      
      waterfallData.push({
        name: feature.name,
        value: contribution,
        cumulative: cumulativeScore,
        impact: feature.impact,
        description: feature.description,
        isPositive: contribution > 0
      });
    });

  // Add final score
  waterfallData.push({
    name: 'Final Score',
    value: finalScore,
    cumulative: finalScore,
    impact: 0,
    description: 'Overall risk score after all factors',
    isPositive: finalScore > 50,
    isFinal: true
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as WaterfallBar;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-2">{label}</h4>
          <p className="text-sm text-gray-600 mb-2">{data.description}</p>
          {!data.isBase && !data.isFinal && (
            <div className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600">Impact:</span>
                <span className={`font-medium flex items-center ${
                  data.isPositive ? 'text-red-600' : 'text-green-600'
                }`}>
                  {data.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {data.isPositive ? '+' : ''}{data.value.toFixed(1)} points
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cumulative Score:</span>
                <span className="font-medium text-gray-900">{data.cumulative.toFixed(1)}</span>
              </div>
            </div>
          )}
          {(data.isBase || data.isFinal) && (
            <div className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium text-gray-900">{data.value.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const getBarColor = (bar: WaterfallBar) => {
    if (bar.isBase) return '#6b7280'; // Gray for base
    if (bar.isFinal) return '#3b82f6'; // Blue for final
    return bar.isPositive ? '#ef4444' : '#22c55e'; // Red for risk increase, green for decrease
  };

  return (
    <div className="space-y-6">
      {/* Waterfall Chart */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900">Feature Impact Analysis</h4>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-gray-600">Increases Risk</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-600">Decreases Risk</span>
            </div>
          </div>
        </div>
        
        <div className="h-80 bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={waterfallData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                stroke="#6b7280"
              />
              <YAxis 
                fontSize={12}
                stroke="#6b7280"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[2, 2, 0, 0]}
                onMouseEnter={(data) => setHoveredFeature(data.name)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={(data) => setSelectedFeature(data.name === selectedFeature ? null : data.name)}
              >
                {waterfallData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry)}
                    stroke={selectedFeature === entry.name ? '#1f2937' : 'transparent'}
                    strokeWidth={selectedFeature === entry.name ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Details List */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Detailed Feature Analysis</h4>
        <div className="space-y-2">
          {features
            .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
            .map((feature, index) => {
              const contribution = feature.impact * 100;
              const isPositive = contribution > 0;
              const isHovered = hoveredFeature === feature.name;
              const isSelected = selectedFeature === feature.name;
              
              return (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : isHovered 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredFeature(feature.name)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => setSelectedFeature(feature.name === selectedFeature ? null : feature.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-gray-900">{feature.name}</h5>
                        <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div>
                          <span className="text-gray-500">Value: </span>
                          <span className="font-medium text-gray-900">
                            {typeof feature.value === 'number' ? feature.value.toFixed(2) : feature.value}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Impact: </span>
                          <span className={`font-medium ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
                            {(feature.impact * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className={`flex items-center text-lg font-bold ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        <span>{isPositive ? '+' : ''}{contribution.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">score points</div>
                    </div>
                  </div>
                  
                  {/* Impact Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Impact Magnitude</span>
                      <span>{Math.abs(feature.impact * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isPositive ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${(Math.abs(feature.impact) / Math.max(...features.map(f => Math.abs(f.impact)))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Model Information */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-blue-900 mb-1">Model Explainability</h5>
            <p className="text-sm text-blue-800 mb-2">
              This analysis shows how each feature contributed to the final risk score. Features that increase 
              risk are shown in red, while those that decrease risk are shown in green.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Model Version:</span>
                <span className="text-blue-800 ml-2">v2.4.1</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Confidence:</span>
                <span className="text-blue-800 ml-2">89%</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Training Data:</span>
                <span className="text-blue-800 ml-2">Sept 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plain English Explanation */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">Why This Transaction Was Flagged</h5>
        <div className="prose prose-sm text-gray-700">
          <p>
            This transaction received a high risk score of <strong>{finalScore}</strong> primarily because:
          </p>
          <ul className="mt-2 space-y-1">
            {features
              .filter(f => f.impact > 0.1)
              .sort((a, b) => b.impact - a.impact)
              .slice(0, 3)
              .map((feature, index) => (
                <li key={index}>
                  <strong>{feature.name}:</strong> {feature.description}
                </li>
              ))}
          </ul>
          {features.some(f => f.impact < -0.05) && (
            <>
              <p className="mt-3">However, some factors reduced the risk:</p>
              <ul className="mt-1 space-y-1">
                {features
                  .filter(f => f.impact < -0.05)
                  .sort((a, b) => a.impact - b.impact)
                  .slice(0, 2)
                  .map((feature, index) => (
                    <li key={index}>
                      <strong>{feature.name}:</strong> {feature.description}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplainabilityWaterfall;