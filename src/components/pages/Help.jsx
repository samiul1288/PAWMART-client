import { Link } from "react-router-dom";

export default function Help() {
  return (
    <section className="container mx-auto px-3 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Help & Support</h1>
        <p className="opacity-70">
          Quick answers about listings, orders, and safety guidelines.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-base-200 border border-base-300 rounded-2xl">
          <div className="card-body">
            <h2 className="text-xl font-semibold">How do I post a listing?</h2>
            <p className="opacity-80">
              Login → Dashboard → Add Listing. Provide proper title,
              description, images and location.
            </p>
            <Link className="btn btn-primary btn-sm w-fit" to="/add-listing">
              Add Listing
            </Link>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 rounded-2xl">
          <div className="card-body">
            <h2 className="text-xl font-semibold">Safety tips</h2>
            <ul className="list-disc pl-5 opacity-80 space-y-1">
              <li>Meet in a safe public place</li>
              <li>Verify pet health/vaccination</li>
              <li>Use clear communication</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 rounded-2xl">
          <div className="card-body">
            <h2 className="text-xl font-semibold">I can’t login with Google</h2>
            <p className="opacity-80">
              Ensure your domain is added in Firebase Authorized domains.
            </p>
            <p className="text-sm opacity-70">
              Add: localhost + your live domain.
            </p>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 rounded-2xl">
          <div className="card-body">
            <h2 className="text-xl font-semibold">Need more help?</h2>
            <p className="opacity-80">
              Contact us anytime—we reply as quickly as possible.
            </p>
            <Link className="btn btn-outline btn-sm w-fit" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
