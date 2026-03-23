'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReferralForm from '../../../components/ReferralForm';

export default function ReferralPage() {
  const params = useParams();
  const token = params.token as string;
  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateToken() {
      try {
        const response = await fetch('/api/validate-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          setError('Invalid or expired referral link. Please contact Elite Care Northwest.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setFacility(data.facility);
        setLoading(false);
      } catch (err) {
        console.error('Token validation error:', err);
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    }

    if (token) {
      validateToken();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ecnw-light flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-ecnw-secondary font-semibold">Loading referral form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ecnw-light flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="alert alert-error mb-4">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            If you believe this is an error, please contact Elite Care Northwest at{' '}
            <a href="tel:2063217440" className="text-ecnw-primary font-semibold">
              (206) 321-7440
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen bg-ecnw-light flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="alert alert-error">
            <p>Unable to load facility information. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ecnw-light py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-ecnw-secondary mb-2">Patient Referral Form</h1>
          <p className="text-gray-600">
            Submitting referral for: <span className="font-semibold text-ecnw-primary">{facility.name}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            All information is securely encrypted and HIPAA compliant
          </p>
        </div>

        {/* Referral Form */}
        <ReferralForm facilityId={facility.id} facilityName={facility.name} token={token} />

        {/* Footer Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="font-semibold text-ecnw-secondary mb-4">Privacy & Security</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ All data is encrypted in transit and at rest</li>
            <li>✓ HIPAA compliant and secure</li>
            <li>✓ Your information is never shared with third parties</li>
            <li>✓ File uploads are scanned and validated</li>
            <li>✓ Audit logs track all submissions and access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
