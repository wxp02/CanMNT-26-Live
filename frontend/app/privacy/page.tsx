"use client";

import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  CanMNT 26 LIVE
                </span>
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Command Center
                </Link>
                <Link
                  href="/ledger"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  The Ledger
                </Link>
                <Link
                  href="/war-room"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  War Room
                </Link>
              </div>
            </div>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Privacy Policy
            </h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: January 14, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to CanMNT 26 LIVE ("we," "our," or "us"). We are committed
              to protecting your privacy and ensuring transparency about how we
              collect, use, and share information when you visit our website at
              canmnt.live (the "Site").
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you visit our Site, we may collect certain information
              automatically, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your IP address and general location information</li>
              <li>Browser type and version</li>
              <li>Device information (mobile, desktop, tablet)</li>
              <li>Pages visited and time spent on the Site</li>
              <li>Referring website or source</li>
              <li>Date and time of your visit</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Cookies and Tracking Technologies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Site uses cookies and similar tracking technologies to enhance
              your browsing experience and analyze site traffic.
            </p>

            <div className="space-y-3 mt-4">
              <h3 className="text-xl font-semibold text-foreground">
                Google Analytics
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We use Google Analytics to understand how visitors interact with
                our Site. Google Analytics collects information such as how
                often users visit the Site, what pages they visit, and what
                other sites they used prior to coming to our Site. We use this
                information to improve our Site and services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Google Analytics uses first-party cookies to track user
                interactions. This information is used to compile reports and
                help us improve our Site. Google Analytics collects information
                anonymously and reports website trends without identifying
                individual visitors.
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <h3 className="text-xl font-semibold text-foreground">
                Google AdSense and DoubleClick DART Cookies
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We use Google AdSense to display advertisements on our Site.
                Google, as a third-party vendor, uses cookies to serve ads based
                on your prior visits to our Site or other websites on the
                Internet.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Google's use of advertising cookies, including the{" "}
                <span className="text-foreground font-medium">
                  DoubleClick DART cookie
                </span>
                , enables it and its partners to serve ads to you based on your
                visit to our Site and/or other sites on the Internet. The
                DoubleClick DART cookie is used by Google in the ads served on
                websites displaying AdSense for content ads.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may opt out of the use of the DART cookie by visiting the{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ad and Content Network Privacy Policy
                </a>
                . You can also opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.aboutads.info/choices
                </a>
                .
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <h3 className="text-xl font-semibold text-foreground">
                Third-Party Advertising Partners
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Third-party vendors, including Google, may use cookies to serve
                ads based on your prior visits to our website or other websites.
                These cookies allow them to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Display targeted advertisements based on your browsing history
                </li>
                <li>
                  Measure the effectiveness of their advertising campaigns
                </li>
                <li>Prevent the same ad from being shown to you repeatedly</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide, maintain, and improve our Site</li>
              <li>Understand how visitors use our Site</li>
              <li>Analyze trends and user behavior</li>
              <li>Display relevant advertisements</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Data Sharing and Third Parties
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share information
              with third-party service providers who help us operate our Site,
              including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <span className="text-foreground font-medium">
                  Google Analytics:
                </span>{" "}
                For website analytics and performance monitoring
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Google AdSense:
                </span>{" "}
                For serving advertisements on our Site
              </li>
              <li>
                <span className="text-foreground font-medium">Vercel:</span> Our
                hosting provider for website infrastructure
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These third parties have their own privacy policies governing how
              they use such information. We recommend reviewing their privacy
              policies to understand their data practices.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Your Privacy Choices
            </h2>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">
                Cookie Preferences
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Most web browsers automatically accept cookies, but you can
                modify your browser settings to decline cookies if you prefer.
                However, this may prevent you from taking full advantage of our
                Site.
              </p>

              <h3 className="text-xl font-semibold text-foreground">
                Opt-Out Options
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong className="text-foreground">Google Analytics:</strong>{" "}
                  You can opt out by installing the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Google Ads:</strong> Visit{" "}
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Ads Settings
                  </a>{" "}
                  to manage your ad preferences
                </li>
                <li>
                  <strong className="text-foreground">NAI Opt-Out:</strong>{" "}
                  Visit the{" "}
                  <a
                    href="https://optout.networkadvertising.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Network Advertising Initiative opt-out page
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Children's Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Site is not directed to children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us so we can
              delete such information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement reasonable security measures to protect the
              information we collect. However, no method of transmission over
              the Internet or electronic storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              International Users
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Site is operated in Canada. If you are accessing our Site from
              outside Canada, please be aware that your information may be
              transferred to, stored, and processed in Canada where our servers
              are located. By using our Site, you consent to the transfer of
              information to Canada.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date at the top of this
              policy. You are advised to review this Privacy Policy periodically
              for any changes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="bg-muted/30 border border-border/50 rounded-lg p-6 space-y-2">
              <p className="text-foreground">
                <span className="font-medium">Website:</span>{" "}
                <Link href="/about" className="text-primary hover:underline">
                  canmnt.live/about
                </Link>
              </p>
              <p className="text-foreground">
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:maplestampsteam@gmail.com"
                  className="text-primary hover:underline"
                >
                  maplestampsteam@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 mt-12">
            <p className="text-sm text-muted-foreground">
              This privacy policy is effective as of January 14, 2026. By using
              CanMNT 26 LIVE, you acknowledge that you have read and understand
              this Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
