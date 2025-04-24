import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'buttons';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  const getTabStyles = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'flex space-x-1',
          tab: (isActive: boolean) => `px-3 py-2 text-sm font-medium rounded-md transition-all ${
            isActive 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`
        };
      case 'buttons':
        return {
          container: 'inline-flex p-1 bg-gray-100 rounded-md',
          tab: (isActive: boolean) => `px-3 py-1.5 text-sm font-medium transition-all rounded ${
            isActive 
              ? 'bg-white shadow-sm text-gray-900' 
              : 'text-gray-700 hover:text-gray-900'
          }`
        };
      case 'underline':
      default:
        return {
          container: 'flex space-x-8 border-b border-gray-200',
          tab: (isActive: boolean) => `px-1 py-4 text-sm font-medium border-b-2 -mb-px transition-all ${
            isActive 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`
        };
    }
  };

  const styles = getTabStyles();

  return (
    <div className={className}>
      <nav className={styles.container}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={styles.tab(activeTab === tab.id)}
            onClick={() => handleTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;