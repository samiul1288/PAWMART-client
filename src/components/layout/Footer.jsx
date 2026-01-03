import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-base-100">
      <div className="container mx-auto px-3 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl">🐾</span>
            <span>PawMart</span>
          </div>
          <p className="text-sm opacity-80">
            Adopt pets, support rescues, and shop trusted pet supplies—built for
            community & care.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Pages</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link className="link link-hover" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="link link-hover" to="/supplies">
                Explore
              </Link>
            </li>
            <li>
              <Link className="link link-hover" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="link link-hover" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Support</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link className="link link-hover" to="/contact">
                Help Center
              </Link>
            </li>
            <li>
              <Link className="link link-hover" to="/contact#report">
                Report Listing
              </Link>
            </li>
            <li>
              <Link className="link link-hover" to="/contact#terms">
                Terms & Privacy
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Contact</h4>
          <div className="text-sm opacity-85 space-y-1">
            <p>📍 Dhaka, Bangladesh</p>
            <p>📞 +880 1846961288</p>
            <p>✉️ support@pawmart.app</p>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              className="btn btn-sm btn-outline"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn btn-sm btn-outline"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="btn btn-sm btn-outline"
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-3 py-4 text-sm opacity-70 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <span>© {year} PawMart. All rights reserved.</span>
          <span className="opacity-70">
            Built with React + Firebase + Express
          </span>
        </div>
      </div>
    </footer>
  );
}
