'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Referral {
  id: number;
  facilityName: string;
  patientFirstName: string;
  patientLastName: string;
  status: string;
  acuityLevel: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchReferrals();
  }, [statusFilter]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/admin/referrals', window.location.origin);
      if (statusFilter) {
        url.searchParams.set('status', statusFilter);
      }

      const response = await fetch(url.toString());

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch referrals');
      }

      const data = await response.json();
      setReferrals(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedReferral || !newStatus) return;

    try {
      const response = await fetch('/api/admin/referrals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralId: selectedReferral.id,
          status: newStatus,
          internalNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update referral');
      }

      setSelectedReferral(null);
      setNewStatus('');
      setNotes('');
      fetchReferrals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Not a fit':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-ecnw-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-ecnw-primary to-ecnw-secondary text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-white/90">Referral Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="alert alert-error mb-6">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-ecnw-secondary mb-4">Filter Referrals</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Closed">Closed</option>
            <option value="Not a fit">Not a fit</option>
          </select>
        </div>

        {/* Referrals List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading referrals...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No referrals found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ecnw-light border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ecnw-secondary">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ecnw-secondary">Facility</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ecnw-secondary">Acuity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ecnw-secondary">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ecnw-secondary">Submitted</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ecnw-secondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="font-semibold text-ecnw-secondary">
                          {referral.patientFirstName} {referral.patientLastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{referral.facilityName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{referral.acuityLevel}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setSelectedReferral(referral);
                            setNewStatus(referral.status);
                          }}
                          className="text-ecnw-primary hover:text-ecnw-secondary font-semibold"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Update Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <h3 className="text-xl font-bold text-ecnw-secondary mb-4">
              Update Referral: {selectedReferral.patientFirstName} {selectedReferral.patientLastName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ecnw-secondary mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Closed">Closed</option>
                  <option value="Not a fit">Not a fit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ecnw-secondary mb-2">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
                  placeholder="Add internal notes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-4 py-2 bg-ecnw-primary text-white rounded-lg font-semibold hover:bg-ecnw-secondary transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => setSelectedReferral(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
