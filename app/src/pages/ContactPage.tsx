import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Get in <span className="text-[#22c55e]">Touch</span>
            </h1>
            <p className="text-xl text-[#94a3b8]">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-[#94a3b8] mb-8">
                  Reach out to us through any of these channels. Our team is ready to help you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-[#94a3b8]">support@studystock.com</p>
                    <p className="text-[#64748b] text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-[#94a3b8]">+91 8904435530</p>
                    <p className="text-[#64748b] text-sm">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-[#94a3b8]">VIT CHENNAI</p>
                    <p className="text-[#94a3b8]">Chennai, Tamil Nadu 600013</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-[#94a3b8]">Monday - Friday: 9am - 6pm EST</p>
                    <p className="text-[#94a3b8]">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-[#2d3748]">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {['Twitter', 'LinkedIn', 'YouTube'].map((social) => (
                    <button
                      key={social}
                      className="px-4 py-2 bg-[#1a2234] border border-[#2d3748] rounded-lg text-sm text-[#94a3b8] hover:border-[#22c55e] hover:text-[#22c55e] transition-colors duration-200"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#111827] border border-[#2d3748] rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-[#22c55e]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-[#94a3b8]">Thank you for reaching out. We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="Study Stock"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-[#1a2234] border-[#2d3748] text-white placeholder:text-[#64748b] focus:border-[#22c55e]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="study@exmaple.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-[#1a2234] border-[#2d3748] text-white placeholder:text-[#64748b] focus:border-[#22c55e]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="bg-[#1a2234] border-[#2d3748] text-white placeholder:text-[#64748b] focus:border-[#22c55e]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-[#1a2234] border-[#2d3748] text-white placeholder:text-[#64748b] focus:border-[#22c55e] min-h-[150px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-6 text-lg font-semibold"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-[#94a3b8]">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Is the demo trading account free?',
                a: 'Yes! Our demo trading account is completely free. You get $10,000 in virtual money to practice trading without any risk.'
              },
              {
                q: 'Do I need prior trading experience?',
                a: 'Not at all. Our platform is designed for beginners and experienced traders alike. We start with the basics and progressively build your knowledge.'
              },
              {
                q: 'How long does it take to complete the course?',
                a: 'The course is self-paced. Most learners complete the fundamentals in 2-3 weeks, but you can take as much time as you need.'
              },
              {
                q: 'Can I access the platform on mobile?',
                a: 'Yes, our platform is fully responsive and works on desktop, tablet, and mobile devices.'
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-[#1a2234] border border-[#2d3748] rounded-xl p-6"
              >
                <h3 className="font-semibold mb-2 text-lg">{faq.q}</h3>
                <p className="text-[#94a3b8]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0e1a] border-t border-[#2d3748] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Study Stock</span>
          </div>
          <p className="text-[#94a3b8] max-w-md mx-auto mb-8">
            Master the art of day trading with our comprehensive learning platform.
          </p>
          <div className="border-t border-[#2d3748] pt-8 text-sm text-[#64748b]">
            <p>© 2024 Study Stock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
