import { memo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import { measurePerformance } from '../utils/performance';
import { OptimizedImage } from '../components/OptimizedImage';

// Dynamically import heavy components
const QuotationDetailsModal = dynamic(() => import('../components/QuotationDetailsModal'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-64" />
});

interface QuotationItem {
  id: string;
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  status: string;
  date: string;
}

const QuotationCard = memo(function QuotationCard({ quotation }: { quotation: QuotationItem }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-16 h-16">
          <OptimizedImage
            src={quotation.product.image}
            alt={quotation.product.name}
            width={64}
            height={64}
            className="rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{quotation.product.name}</h3>
          <p className="text-sm text-gray-500">Quantity: {quotation.quantity}</p>
          <p className="text-sm text-gray-500">Date: {quotation.date}</p>
        </div>
        <div className={`text-sm ${
          quotation.status === 'approved' ? 'text-green-600' :
          quotation.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
        </div>
      </div>
    </div>
  );
});

const OptimizedQuotationsPage = memo(function OptimizedQuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const endRender = measurePerformance('QuotationsPage render');

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/quotations?page=${page}`);
      const data = await response.json();
      
      if (data.quotations.length === 0) {
        setHasMore(false);
      } else {
        setQuotations(prev => [...prev, ...data.quotations]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading quotations:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  const renderQuotations = useCallback(() => {
    return quotations.map(quotation => (
      <QuotationCard key={quotation.id} quotation={quotation} />
    ));
  }, [quotations]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Quotations</h1>
      <div className="space-y-4">
        {renderQuotations()}
        {loading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <div ref={ref} className="h-4" />
      </div>
    </div>
  );
});

export default OptimizedQuotationsPage;