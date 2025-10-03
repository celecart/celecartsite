import { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';

export default function ViewportSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [device, setDevice] = useState('iphone16'); // Default to iPhone 16
  const [currentUrl, setCurrentUrl] = useState('');

  // Update current URL whenever it changes
  useEffect(() => {
    const updateUrl = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };
    
    // Set initial URL
    updateUrl();
    
    // Listen for URL changes
    window.addEventListener('popstate', updateUrl);
    
    return () => {
      window.removeEventListener('popstate', updateUrl);
    };
  }, []);

  const deviceDimensions = {
    iphone16: { width: 390, height: 844, name: 'iPhone 16' },
    iphone16Pro: { width: 393, height: 852, name: 'iPhone 16 Pro' },
    iphone16ProMax: { width: 430, height: 932, name: 'iPhone 16 Pro Max' },
    ipadAir: { width: 820, height: 1180, name: 'iPad Air' },
    samsungS23: { width: 360, height: 780, name: 'Samsung S23' },
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-800 transition-colors"
        title="View mobile layout"
      >
        <Smartphone size={24} />
      </button>
    );
  }

  const currentDevice = deviceDimensions[device as keyof typeof deviceDimensions];

  // Make sure we're using relative URLs to avoid SSL issues
  const iframeSrc = currentUrl || '/';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-[95vw] max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Mobile Device Preview</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {Object.entries(deviceDimensions).map(([key, { name }]) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              className={`px-3 py-1.5 rounded text-sm whitespace-nowrap ${
                device === key 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        
        <div className="bg-gray-100 p-4 rounded flex-1 overflow-auto flex items-center justify-center">
          <div 
            className="bg-white rounded-2xl border border-gray-300 overflow-hidden shadow-lg flex flex-col"
            style={{
              width: `${currentDevice.width / 2}px`,
              height: `${currentDevice.height / 2}px`,
              maxHeight: 'calc(90vh - 150px)'
            }}
          >
            <div className="h-6 bg-black flex items-center justify-center">
              <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
            </div>
            <div className="flex-1 w-full bg-white overflow-hidden">
              {/* Use a div that mimics mobile design if iframe fails */}
              <div className="h-full w-full overflow-y-auto p-2">
                <div className="text-center pt-4 pb-6">
                  <h3 className="font-bold text-sm">Current view: {currentDevice.name}</h3>
                  <p className="text-xs text-gray-500">Viewing: {iframeSrc}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-center mb-3">To see the mobile view:</p>
                  <ul className="text-xs px-4 space-y-2">
                    <li>• Open the app in the Replit preview pane</li>
                    <li>• Use your browser's device emulation (Chrome DevTools)</li>
                    <li>• Or resize your browser window to {currentDevice.width}px width</li>
                  </ul>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Note: Live preview may not work due to iframe security restrictions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 flex justify-between">
          <div>Resolution: {currentDevice.width}x{currentDevice.height}</div>
          <div>
            <a 
              href={iframeSrc} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Open in new tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}