import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Cog, Package, Box, Wrench, Activity } from 'lucide-react';

const PlanningPage = () => {
  const navigate = useNavigate();

  const planningCards = [
    {
      title: 'Purchase Item',
      icon: ShoppingCart,
      color: 'blue',
      description: 'Manage purchase items',
      path: '/npd/planning/purchase-item'
    },
    {
      title: 'Process',
      icon: Cog,
      color: 'green',
      description: 'Define process items',
      path: '/npd/process'
    },
    {
      title: 'Item',
      icon: Package,
      color: 'purple',
      description: 'Manage items',
      path: '/npd/planning/item'
    },
    {
      title: 'Raw Material',
      icon: Box,
      color: 'orange',
      description: 'Manage raw materials',
      path: '/npd/planning/raw-material'
    },
    {
      title: 'Tools and Dies',
      icon: Wrench,
      color: 'red',
      description: 'Manage tools and dies',
      path: '/npd/planning/tools-dies'
    },
    {
      title: 'Instruments',
      icon: Activity,
      color: 'indigo',
      description: 'Manage instruments',
      path: '/npd/planning/instruments'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', icon: 'text-blue-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', icon: 'text-green-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', icon: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', icon: 'text-orange-600' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', icon: 'text-red-600' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', icon: 'text-indigo-600' }
    };
    return colorMap[color];
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning</h1>
      <p className="text-gray-600 mb-8">Select a category to manage</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {planningCards.map((card) => {
          const colors = getColorClasses(card.color);
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className={`${colors.bg} border ${colors.border} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className={`w-12 h-12 ${colors.icon} mb-3`} />
                <h3 className={`font-semibold text-lg ${colors.text} mb-2`}>{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanningPage;