import Header from '../components/Header';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} />
      
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-6xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-xl text-gray-600 mb-8">Coming Soon!</p>
          <p className="text-gray-500">This feature is under development and will be available soon.</p>
        </div>
      </div>
    </div>
  );
}
