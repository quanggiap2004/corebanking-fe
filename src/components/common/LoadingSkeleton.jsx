const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (type === 'transaction') {
    return (
      <div className="border-b border-gray-200 p-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }
  
  if (type === 'account') {
    return (
      <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl p-6 shadow-lg animate-pulse">
        <div className="h-3 bg-gray-400 rounded w-1/3 mb-4 opacity-50"></div>
        <div className="h-8 bg-gray-400 rounded w-2/3 mb-4 opacity-50"></div>
        <div className="h-3 bg-gray-400 rounded w-1/2 opacity-50"></div>
      </div>
    );
  }
  
  return (
    <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
  );
};

export default LoadingSkeleton;
