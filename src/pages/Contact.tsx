import React, { useState } from 'react';
import { Mail, Github, BookOpen, GraduationCap, MapPin, Send, CheckCircle2, User, Building } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Academic Project Demonstration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display tracking-tight">
          Project Information & Contact
        </h1>
        <p className="text-sm text-stone-600">
          Plant Disease Detection using Vision Transformer (ViT) & FastAPI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Project Meta Information */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-700" />
              Academic Affiliation
            </h2>
            <div className="space-y-3 text-xs text-stone-600">
              <div>
                <span className="font-semibold text-stone-900 block">Degree / Program:</span>
                Bachelor of Technology / Computer Science & Engineering (Final-Year Capstone)
              </div>
              <div>
                <span className="font-semibold text-stone-900 block">Research Domain:</span>
                Agricultural Computer Vision, Deep Learning, Vision Transformers (ViT)
              </div>
              <div>
                <span className="font-semibold text-stone-900 block">Supervision:</span>
                Department of Computer Science & Agricultural Informatics
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Project Architecture Deliverables
            </h2>
            <ul className="text-xs text-stone-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ViT-Base-16 PyTorch Model weights (<code className="font-mono">.pth</code>)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>FastAPI Async REST Server (<code className="font-mono">POST /predict</code>)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>React TypeScript Responsive Progressive UI</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PlantVillage 38-class Agronomic Extension Guide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-display">
                Project Inquiries & Feedback
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Have questions regarding the Vision Transformer training hyperparameters or FastAPI deployment?
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-center animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base font-display">Inquiry Recorded!</h3>
                <p className="text-xs text-emerald-700">
                  Thank you for your review during this project demonstration.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Name / Evaluator Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Alex Mercer / Project Reviewer"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reviewer@university.edu"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Comments or Agronomic Inquiry
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about dataset split, accuracy curves, or FastAPI integration..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 text-sm font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
