import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { submitContactInquiry } from '../services/catalogService';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successSubmission, setSuccessSubmission] = useState<{ id: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const result = await submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccessSubmission({ id: result.id });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Direct Commercial Inquiries
        </span>
        <h1 className="text-4xl font-black text-white uppercase tracking-tight font-mono">
          Contact PeakForm
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Speak with our commercial equipment engineers for custom facility layout quotes, freight volume schedules, or institutional purchase orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest pb-3 border-b border-zinc-800">
              Commercial Operations Center
            </h3>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white text-sm">Headquarters & Showroom</h4>
                <p className="text-zinc-400 mt-1 leading-relaxed">
                  PeakForm Fitness Equipment Co.<br />
                  1040 Ironworks Blvd, Suite 200<br />
                  Austin, TX 78701
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white text-sm">Commercial Telephone</h4>
                <p className="text-zinc-400 mt-1">
                  Toll-Free: (800) 555-PEAK (7325)<br />
                  Direct Direct Desk: (512) 888-IRON
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white text-sm">Electronic Inquiries</h4>
                <p className="text-zinc-400 mt-1">
                  Sales: sales@peakform-fitness.com<br />
                  Support & Freight: logistics@peakform-fitness.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white text-sm">Hours of Operation</h4>
                <p className="text-zinc-400 mt-1">
                  Mon – Fri: 7:00 AM – 6:00 PM CST<br />
                  Sat: 9:00 AM – 2:00 PM CST (Showroom by appt.)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Submission Form */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest pb-3 border-b border-zinc-800 mb-6">
              Send an Inquiry or Quote Request
            </h3>

            {successSubmission && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-start gap-3 text-emerald-400 text-xs">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Inquiry Received Successfully!</div>
                  <p className="mt-1 text-emerald-300">
                    Your request has been logged under reference{' '}
                    <span className="font-mono font-bold text-white">{successSubmission.id}</span>.
                    A commercial equipment representative will respond within 1 business day.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center gap-3 text-rose-300 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label htmlFor="contact-name" className="block text-zinc-300 mb-1.5 font-medium">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full bg-zinc-950 border border-zinc-700 text-white rounded p-3 focus:border-amber-400 focus:outline-none placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-zinc-300 mb-1.5 font-medium">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="m.vance@crossfitapex.com"
                    className="w-full bg-zinc-950 border border-zinc-700 text-white rounded p-3 focus:border-amber-400 focus:outline-none placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label htmlFor="contact-subject" className="block text-zinc-300 mb-1.5 font-medium">
                  Subject / Inquiry Type *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Facility Outfitting Quote for 8x Squat Racks + Cardio"
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded p-3 focus:border-amber-400 focus:outline-none placeholder:text-zinc-600"
                />
              </div>

              <div className="text-xs">
                <label htmlFor="contact-message" className="block text-zinc-300 mb-1.5 font-medium">
                  Message Details *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your facility requirements, square footage, preferred machinery selections, or delivery deadline..."
                  className="w-full bg-zinc-950 border border-zinc-700 text-white rounded p-3 focus:border-amber-400 focus:outline-none placeholder:text-zinc-600 resize-y"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black py-3.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Commercial Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
