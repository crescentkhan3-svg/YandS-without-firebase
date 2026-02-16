import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Trash2, Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/storage';
import { subscribeToRentals, deleteRentalFromFirestore } from '@/lib/firestoreService';
import { Rental } from '@/types/rental';
import { AgreementPreviewDialog } from '@/components/AgreementPreviewDialog';
import { toast } from 'sonner';

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewRental, setPreviewRental] = useState<Rental | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time rentals from Firestore
    const unsubscribe = subscribeToRentals((data) => {
      setRentals(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = rentals;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.client?.fullName?.toLowerCase().includes(query) ||
        r.client?.cnic?.includes(query) ||
        r.vehicle?.name?.toLowerCase().includes(query) ||
        r.id?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.paymentStatus === statusFilter);
    }

    // Sort by date (newest first)
    filtered = [...filtered].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredRentals(filtered);
  }, [searchQuery, statusFilter, rentals]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this rental?')) {
      try {
        await deleteRentalFromFirestore(id);
        toast.success('Rental deleted successfully');
      } catch (error) {
        toast.error('Failed to delete rental');
      }
    }
  };

  const handleViewAgreement = (rental: Rental) => {
    setPreviewRental(rental);
    setShowPreview(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">All Rentals</h1>
        <p className="text-primary-foreground/80">View and manage all rental records</p>
      </div>

      {/* Filters */}
      <div className="card-elevated overflow-hidden mb-6 bg-orange-500 border-orange-600">
        <div className="bg-orange-600 p-4 text-white border-b border-orange-700">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2 text-white">
            <Filter className="w-5 h-5" />
            Filters & Search
          </h2>
        </div>
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
              <Input
                placeholder="Search by name, CNIC, vehicle, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg outline-none transition-all"
              >
                <option value="all" className="text-black">All Status</option>
                <option value="paid" className="text-black">Paid</option>
                <option value="partial" className="text-black">Partial</option>
                <option value="pending" className="text-black">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredRentals.length === 0 ? (
        <div className="card-elevated p-12 text-center bg-orange-500 border-orange-600 text-white">
          <Car className="w-16 h-16 mx-auto mb-4 text-white/50" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">No rentals found</h3>
          <p className="text-white/80 mb-6">
            {rentals.length === 0 
              ? "You haven't created any rentals yet." 
              : "No rentals match your search criteria."}
          </p>
          <Link to="/new-booking">
            <Button className="bg-white text-orange-600 hover:bg-white/90">Create New Booking</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block card-elevated overflow-hidden bg-orange-500 border-orange-600">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-600 text-white border-b border-orange-700">
                    <th className="px-6 py-4 text-left font-semibold">Client</th>
                    <th className="px-6 py-4 text-left font-semibold">Vehicle</th>
                    <th className="px-6 py-4 text-left font-semibold">Rental Period</th>
                    <th className="px-6 py-4 text-left font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredRentals.map((rental) => (
                    <tr key={rental.id} className="hover:bg-white/5 transition-colors animate-fade-in text-white">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{rental.client.fullName}</p>
                          <p className="text-sm text-white/70">{rental.client.cnic}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <Car className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{rental.vehicle.name}</p>
                            <p className="text-sm text-white/70">{rental.vehicle.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{formatDate(rental.deliveryDate)}</p>
                        <p className="text-sm text-white/70">to {formatDate(rental.returnDate)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{formatCurrency(rental.totalAmount)}</p>
                        <p className="text-sm text-white/70">
                          Balance: {formatCurrency(rental.balance)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`${
                          rental.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          rental.paymentStatus === 'partial' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 
                          'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                        } px-2 py-1 rounded text-xs capitalize`}>
                          {rental.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewAgreement(rental)}
                            className="text-white hover:bg-white/20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(rental.id)}
                            className="text-white hover:bg-white/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredRentals.map((rental) => (
              <div key={rental.id} className="card-elevated p-4 animate-slide-up bg-orange-500 border-orange-600 text-white">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{rental.client.fullName}</p>
                    <p className="text-sm text-white/70">{rental.vehicle.name}</p>
                  </div>
                  <span className={`${
                    rental.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300' :
                    rental.paymentStatus === 'partial' ? 'bg-amber-500/20 text-amber-300' : 
                    'bg-slate-500/20 text-slate-300'
                  } px-2 py-0.5 rounded text-xs capitalize`}>
                    {rental.paymentStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-white/70">Period</p>
                    <p className="font-medium">{formatDate(rental.deliveryDate)}</p>
                  </div>
                  <div>
                    <p className="text-white/70">Total</p>
                    <p className="font-medium">{formatCurrency(rental.totalAmount)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => handleViewAgreement(rental)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Agreement
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(rental.id)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 text-center text-muted-foreground">
            Showing {filteredRentals.length} of {rentals.length} rentals
          </div>
        </>
      )}

      {/* Agreement Preview Dialog */}
      <AgreementPreviewDialog 
        rental={previewRental}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </div>
  );
};

export default Rentals;
