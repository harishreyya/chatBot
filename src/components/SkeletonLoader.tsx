
export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 animate-pulse">
      <header className="flex items-center justify-between px-8 py-4 shadow-md border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-gray-300" />
          <div className="h-6 w-24 rounded bg-gray-300" />
          <div className="h-5 w-20 rounded bg-gray-200 ml-6" />
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-300" />
      </header>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] space-y-6 px-4">
        <div className="h-32 w-32 rounded-full bg-gray-200" />
        <div className="h-6 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-48 bg-gray-100 rounded" />
      </main>
    </div>
  );
}
