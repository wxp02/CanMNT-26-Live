import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-muted/20 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-lg font-bold tracking-tight text-foreground">
                CanMNT 26 LIVE
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Real-time tracking for Canadian national team players ahead of the
              2026 FIFA World Cup.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Command Center
                </Link>
              </li>
              <li>
                <Link
                  href="/ledger"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  The Ledger
                </Link>
              </li>
              <li>
                <Link
                  href="/war-room"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  War Room
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:maplestampsteam@gmail.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  maplestampsteam@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} CanMNT 26 LIVE. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Not affiliated with Canada Soccer or FIFA. Fan project for
              informational purposes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
