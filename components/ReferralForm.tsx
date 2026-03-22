'use client';

import { useState } from 'react';
import { sanitizeReferralForm, validateReferralForm } from '@/lib/utils/validation';
import { isBotSubmission, isValidInteractionTiming, getHoneypotHtml, HONEYPOT_FIELD_NAME } from '@/lib/utils/botProtection';

interface ReferralFormProps {
  facilityId: number;
  facilityName: string;
  token: string;
}

export default function ReferralForm({ facilityId, facilityName, token }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    patientFirstName: '',
    patientLastName: '',
    dateOfBirth: '',
    gender: '',
    patientPhone: '',
    patientEmail: '',
    admissionDiagnosis: '',
    acuityLevel: 'Moderate',
    specialNeeds: '',
    estimatedDischargeDate: '',
    estimatedDischargeTime: '',
    hoursOfCareNeeded: '',
    incomeVerified: 'pending',
    monthlyIncome: '',
    paymentMethod: 'cash',
    [HONEYPOT_FIELD_NAME]: '', // Honeypot field
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formStartTime] = useState(Date.now());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setError(`File type ${file.type} is not allowed`);
        return false;
      }
      
      return true;
    });

    setFiles(validFiles);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check interaction timing
      const submissionTime = Date.now() - formStartTime;
      if (!isValidInteractionTiming(submissionTime)) {
        setError('Form submission too fast. Please try again.');
        setLoading(false);
        return;
      }

      // Check for bot submission
      if (isBotSubmission(formData)) {
        setError('Your submission was flagged as suspicious. Please try again.');
        setLoading(false);
        return;
      }

      // Validate form data
      const validation = validateReferralForm(formData);
      if (!validation.valid) {
        setError('Please fill in all required fields correctly.');
        setLoading(false);
        return;
      }

      // Sanitize form data
      const sanitized = sanitizeReferralForm(formData);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('facilityId', facilityId.toString());
      submitData.append('token', token);
      submitData.append('formData', JSON.stringify(sanitized));

      // Add files
      files.forEach((file, index) => {
        submitData.append(`file_${index}`, file);
      });

      // Submit referral
      const response = await fetch('/api/referrals/submit', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit referral');
      }

      setSuccess(true);
      setFormData({
        patientFirstName: '',
        patientLastName: '',
        dateOfBirth: '',
        gender: '',
        patientPhone: '',
        patientEmail: '',
        admissionDiagnosis: '',
        acuityLevel: 'Moderate',
        specialNeeds: '',
        estimatedDischargeDate: '',
        estimatedDischargeTime: '',
        hoursOfCareNeeded: '',
        incomeVerified: 'pending',
        monthlyIncome: '',
        paymentMethod: 'cash',
        [HONEYPOT_FIELD_NAME]: '',
      });
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="alert alert-success mb-4">
          <p className="font-semibold text-lg">✓ Referral Submitted Successfully</p>
        </div>
        <p className="text-gray-700 mb-4">
          Thank you for submitting a referral to Elite Care Northwest. Our intake team has received your submission and will contact you within 24 hours.
        </p>
        <p className="text-sm text-gray-600">
          Referral ID: <span className="font-mono text-ecnw-primary">{Math.random().toString(36).substring(7).toUpperCase()}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
      {error && (
        <div className="alert alert-error mb-6">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Honeypot field */}
      <div dangerouslySetInnerHTML={{ __html: getHoneypotHtml() }} />

      {/* Patient Information Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-ecnw-secondary mb-6 pb-4 border-b border-ecnw-accent">
          Patient Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="patientFirstName" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="patientFirstName"
              name="patientFirstName"
              value={formData.patientFirstName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>

          <div>
            <label htmlFor="patientLastName" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="patientLastName"
              name="patientLastName"
              value={formData.patientLastName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label htmlFor="patientPhone" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="patientPhone"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>

          <div>
            <label htmlFor="patientEmail" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="patientEmail"
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>
        </div>
      </div>

      {/* Clinical Information Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-ecnw-secondary mb-6 pb-4 border-b border-ecnw-accent">
          Clinical Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="admissionDiagnosis" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Admission Diagnosis
            </label>
            <textarea
              id="admissionDiagnosis"
              name="admissionDiagnosis"
              value={formData.admissionDiagnosis}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>

          <div>
            <label htmlFor="acuityLevel" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Acuity Level
            </label>
            <select
              id="acuityLevel"
              name="acuityLevel"
              value={formData.acuityLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="specialNeeds" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Special Needs/Requirements
            </label>
            <input
              type="text"
              id="specialNeeds"
              name="specialNeeds"
              value={formData.specialNeeds}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>
        </div>
      </div>

      {/* Discharge Information Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-ecnw-secondary mb-6 pb-4 border-b border-ecnw-accent">
          Discharge Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="estimatedDischargeDate" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Estimated Discharge Date
            </label>
            <input
              type="date"
              id="estimatedDischargeDate"
              name="estimatedDischargeDate"
              value={formData.estimatedDischargeDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>

          <div>
            <label htmlFor="estimatedDischargeTime" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Estimated Discharge Time
            </label>
            <input
              type="time"
              id="estimatedDischargeTime"
              name="estimatedDischargeTime"
              value={formData.estimatedDischargeTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>

          <div>
            <label htmlFor="hoursOfCareNeeded" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Hours of Care Needed
            </label>
            <input
              type="number"
              id="hoursOfCareNeeded"
              name="hoursOfCareNeeded"
              value={formData.hoursOfCareNeeded}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>
        </div>
      </div>

      {/* Income/Payment Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-ecnw-secondary mb-6 pb-4 border-b border-ecnw-accent">
          Income & Payment Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="incomeVerified" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Income Verified
            </label>
            <select
              id="incomeVerified"
              name="incomeVerified"
              value={formData.incomeVerified}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            >
              <option value="pending">Pending</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="monthlyIncome" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Monthly Income
            </label>
            <input
              type="number"
              id="monthlyIncome"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-semibold text-ecnw-secondary mb-2">
              Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
            >
              <option value="cash">Cash Pay</option>
              <option value="ltc-insurance">Long-Term Care Insurance</option>
            </select>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-ecnw-secondary mb-6 pb-4 border-b border-ecnw-accent">
          Supporting Documents
        </h2>

        <div>
          <label htmlFor="files" className="block text-sm font-semibold text-ecnw-secondary mb-2">
            Upload Files (Optional)
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
          </p>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ecnw-primary"
          />
          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-ecnw-secondary mb-2">Selected files:</p>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-ecnw-primary text-white rounded-lg font-semibold hover:bg-ecnw-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Referral'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        By submitting this form, you confirm that all information is accurate and complete.
      </p>
    </form>
  );
}
