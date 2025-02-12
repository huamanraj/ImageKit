export default function LoadingSpinner({ text }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      {text && <div className="mt-4 text-gray-600">{text}</div>}
    </div>
  );
}
