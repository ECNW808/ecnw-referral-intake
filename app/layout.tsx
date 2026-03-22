import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Elite Care Northwest - Referral Intake',
  description: 'Secure referral intake form for Elite Care Northwest healthcare services',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <header className="bg-gradient-to-r from-ecnw-primary to-ecnw-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-ecnw-accent rounded-full flex items-center justify-center font-bold text-ecnw-dark">
                EC
              </div>
              <div>
                <h1 className="text-xl font-bold">Elite Care Northwest</h1>
                <p className="text-sm opacity-90">Caring Beyond Measure</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">(206) 321-7440</p>
              <p className="text-sm opacity-90">Physician-Led Home Health Care</p>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-ecnw-secondary text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4">Elite Care Northwest</h3>
                <p className="text-sm opacity-90">Physician-led home health care services in the Seattle area.</p>
                <p className="text-sm opacity-90 mt-2">WA DOH Certified • BBB A+ Rated • HCAOA Member</p>
              </div>
              <div>
                <h3 className="font-bold mb-4">Services</h3>
                <ul className="text-sm space-y-2">
                  <li><a href="#" className="opacity-90 hover:opacity-100">In-Home Health Care</a></li>
                  <li><a href="#" className="opacity-90 hover:opacity-100">Postoperative Care</a></li>
                  <li><a href="#" className="opacity-90 hover:opacity-100">Dementia Care</a></li>
                  <li><a href="#" className="opacity-90 hover:opacity-100">Hospital-to-Home Care</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Contact</h3>
                <p className="text-sm opacity-90">Phone: <a href="tel:2063217440" className="text-ecnw-accent">(206) 321-7440</a></p>
                <p className="text-sm opacity-90">Email: <a href="mailto:intake@elitecarenorthwest.com" className="text-ecnw-accent">intake@elitecarenorthwest.com</a></p>
                <p className="text-sm opacity-90 mt-4">Seattle, WA</p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-8 text-center text-sm opacity-75">
              <p>&copy; {new Date().getFullYear()} Elite Care Northwest. All rights reserved. | HIPAA Compliant</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
