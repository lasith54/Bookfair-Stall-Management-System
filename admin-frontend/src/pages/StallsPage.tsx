import Header from '../components/Header';
import InteractiveVenueMap from '../components/InteractiveVenueMap';

export default function StallsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <Header title="Stall Management" />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <InteractiveVenueMap />
      </main>
    </div>
  );
}