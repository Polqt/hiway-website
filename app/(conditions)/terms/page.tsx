import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import React from 'react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
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
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <p className="text-lg leading-relaxed">
              Welcome! By using our services, you agree to these terms. We've kept them simple and straightforward.
            </p>
          </section>

          {/* Using Our Service */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Using Our Service</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>• You must be at least 18 years old to use our service</p>
              <p>• Keep your account information accurate and secure</p>
              <p>• You're responsible for all activity under your account</p>
              <p>• Don't share your password with others</p>
            </div>
          </section>

          {/* Your Content */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Content</h2>
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="leading-relaxed mb-3">
                <span className="font-semibold">You own your content.</span> Anything you create, upload, or share is yours.
              </p>
              <p className="text-muted-foreground text-sm">
                We only use your content to provide and improve our services. We won't share it with others without your permission.
              </p>
            </div>
          </section>

          {/* What's Not Allowed */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">What's Not Allowed</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>• Don't use the service for anything illegal</p>
              <p>• Don't try to hack or damage our systems</p>
              <p>• Don't harass or harm other users</p>
              <p>• Don't spam or upload malicious content</p>
              <p>• Don't impersonate others</p>
            </div>
          </section>

          {/* Payment & Subscriptions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Payment & Subscriptions</h2>
            <p className="leading-relaxed mb-4">
              If you subscribe to a paid plan:
            </p>
            <div className="bg-card border border-border rounded-lg p-5 space-y-3 text-sm text-muted-foreground">
              <p>• Payments are processed securely through our payment partners</p>
              <p>• Subscriptions renew automatically unless you cancel</p>
              <p>• You can cancel anytime from your account settings</p>
              <p>• Refunds are handled according to our refund policy</p>
            </div>
          </section>

          {/* Service Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Service Changes</h2>
            <p className="leading-relaxed">
              We may update, modify, or discontinue features of our service at any time. We'll do our best to notify you of significant changes.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Account Termination</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2">You can:</h3>
                <p className="text-sm text-muted-foreground">Delete your account at any time from your settings.</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-semibold mb-2">We can:</h3>
                <p className="text-sm text-muted-foreground">Suspend or terminate accounts that violate these terms.</p>
              </div>
            </div>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Liability Limits</h2>
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="leading-relaxed text-sm text-muted-foreground">
                We provide our service "as is" and can't guarantee it will always be available or error-free. We're not liable for any indirect damages or losses from using our service. Your use is at your own risk.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to These Terms</h2>
            <p className="leading-relaxed">
              We may update these terms occasionally. We'll notify you of major changes via email or through the service. Continuing to use the service after changes means you accept the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
            <p className="leading-relaxed mb-4">
              If you have any questions about these terms, feel free to contact us.
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