import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <span className="text-sm text-muted-foreground">Terms and Privacy</span>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <a href="/signup">Get Started</a>
          </button>
          <AnimatedThemeToggler />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <p className="text-lg leading-relaxed">
              We respect your privacy. This policy explains what information we collect, how we use it, and your rights regarding your data.
            </p>
          </section>

          {/* What We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Collect</h2>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  Account Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your name, email, password, and profile details when you sign up.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  Content You Create
                </h3>
                <p className="text-sm text-muted-foreground">
                  Notes, documents, files, and anything you create or upload to your workspace.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-lg">📱</span>
                  Usage Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  How you use our service - pages visited, features used, and when you're active.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-lg">💻</span>
                  Device & Browser Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Device type, browser, IP address, and general location for security and service improvement.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Data */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">To provide and improve our services</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">To communicate with you about your account</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">To send important updates and notifications</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">To keep our service secure and prevent fraud</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">To personalize your experience</p>
              </div>
            </div>
          </section>

          {/* Sharing Your Data */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">When We Share Your Data</h2>
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="leading-relaxed mb-4">
                <span className="font-semibold">We don't sell your data.</span> We only share it when:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• You give us permission to share it</p>
                <p>• With trusted service providers who help us run our service (like hosting or payment processing)</p>
                <p>• When required by law or to protect rights and safety</p>
                <p>• If our business is sold or merged (you'll be notified)</p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2">Access & Export</h3>
                <p className="text-sm text-muted-foreground">View and download all your data anytime.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2">Correct</h3>
                <p className="text-sm text-muted-foreground">Update incorrect or incomplete information.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2">Delete</h3>
                <p className="text-sm text-muted-foreground">Request deletion of your personal data.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2">Object</h3>
                <p className="text-sm text-muted-foreground">Opt out of certain data processing.</p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="leading-relaxed mb-4">
              We take security seriously and use industry-standard measures to protect your data:
            </p>
            <div className="bg-card border border-border rounded-lg p-5 space-y-2 text-sm text-muted-foreground">
              <p>• Encrypted connections (HTTPS)</p>
              <p>• Secure data storage</p>
              <p>• Regular security audits</p>
              <p>• Limited employee access to user data</p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">How Long We Keep Your Data</h2>
            <p className="leading-relaxed text-muted-foreground">
              We keep your data as long as your account is active. If you delete your account, we'll remove your personal data within 30 days, except where we need to keep it for legal reasons.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies & Tracking</h2>
            <p className="leading-relaxed text-muted-foreground mb-4">
              We use cookies and similar technologies to make our service work better. You can control cookies through your browser settings.
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><span className="font-semibold text-foreground">Essential cookies:</span> Required for the service to work</p>
              <p><span className="font-semibold text-foreground">Analytics cookies:</span> Help us understand how you use the service</p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="leading-relaxed text-muted-foreground">
              Our service is not intended for children under 18. We don't knowingly collect information from children. If you believe we have data from a child, please contact us.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="leading-relaxed text-muted-foreground">
              We may update this privacy policy from time to time. We'll notify you of significant changes via email or through the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="leading-relaxed mb-4">
              Questions about privacy? We're here to help.
            </p>
            <div className="flex gap-4">
              <a href="mailto:poyhidalgo@gmail.com" className="text-primary hover:underline text-sm">
                sqltd@example.com
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}