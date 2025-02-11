const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
      <div className="mt-4 text-white text-center font-semibold drop-shadow-lg">Loading...</div>
    </div>
  </div>
);

export default LoadingOverlay;
