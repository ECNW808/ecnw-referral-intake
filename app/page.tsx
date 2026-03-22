export default function Home() {
  return (
    <div className="min-h-screen bg-ecnw-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-ecnw-primary to-ecnw-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Secure Referral Intake</h1>
          <p className="text-xl opacity-90">Elite Care Northwest - Physician-Led Home Health Care</p>
          <p className="mt-4 opacity-75">Streamlined, HIPAA-compliant referral management system</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-ecnw-secondary mb-6">Welcome to Elite Care Northwest</h2>
            <p className="text-lg mb-4">
              We provide physician-led home health care services throughout the Seattle area. Our team is dedicated to delivering compassionate, professional care right in your home.
            </p>
            <p className="text-lg mb-6">
              If you're a healthcare facility looking to refer patients to our services, use the secure magic link provided to access our referral intake form.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-ecnw-accent text-ecnw-dark rounded-full flex items-center justify-center font-bold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-ecnw-secondary">Secure & HIPAA Compliant</h3>
                  <p className="text-gray-600">All referrals are encrypted and stored securely</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-ecnw-accent text-ecnw-dark rounded-full flex items-center justify-center font-bold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-ecnw-secondary">Fast Processing</h3>
                  <p className="text-gray-600">Immediate notifications to our intake team</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-ecnw-accent text-ecnw-dark rounded-full flex items-center justify-center font-bold flex-shrink-0">✓</div>
                <div>
                  <h3 className="font-semibold text-ecnw-secondary">File Uploads</h3>
                  <p className="text-gray-600">Securely attach medical documents and records</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-ecnw-primary">
            <h3 className="text-2xl font-bold text-ecnw-secondary mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-ecnw-accent font-bold">•</span>
                <span><strong>In-Home Health Care</strong> - Hands-on care with physician oversight</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ecnw-accent font-bold">•</span>
                <span><strong>Postoperative Care</strong> - Short-term support, long-term results</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ecnw-accent font-bold">•</span>
                <span><strong>Home Care Aides</strong> - Daily support for independent living</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ecnw-accent font-bold">•</span>
                <span><strong>Dementia Care</strong> - Compassionate, memory-focused care</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ecnw-accent font-bold">•</span>
                <span><strong>Medical Oversight</strong> - Physician-led guidance for every step</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-ecnw-accent font-bold">•</span>
                <span><strong>Hospital-to-Home Care</strong> - Safer recovery without rehab</span>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-ecnw-light rounded-lg border border-ecnw-primary">
              <p className="text-sm text-gray-700">
                <strong>Pricing:</strong> Flexible in-home care plans, starting at $45/hour depending on service and schedule.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Insurance:</strong> Now accepting Long-Term Care Insurance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-ecnw-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Refer a Patient?</h2>
          <p className="text-lg opacity-90 mb-8">Use your facility's secure magic link to submit referrals</p>
          <p className="text-sm opacity-75">If you don't have a magic link, please contact us at <a href="tel:2063217440" className="text-ecnw-accent font-semibold">(206) 321-7440</a></p>
        </div>
      </section>

      {/* Footer Info */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-ecnw-primary mb-2">WA DOH</div>
            <p className="text-gray-600">Licensed & Certified</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-ecnw-primary mb-2">BBB A+</div>
            <p className="text-gray-600">Better Business Bureau</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-ecnw-primary mb-2">HCAOA</div>
            <p className="text-gray-600">Member Organization</p>
          </div>
        </div>
      </section>
    </div>
  );
}
