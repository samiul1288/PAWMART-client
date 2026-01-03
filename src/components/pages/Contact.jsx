import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.message)
      return toast.error("All fields are required.");
    try {
      setLoading(true);
      // Demo action: show success (no broken links, but still functional UX)
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Message sent! Our team will contact you soon.");
      setF({ name: "", email: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-3 py-10 space-y-8" id="support">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Contact & Support</h1>
        <p className="opacity-80 max-w-3xl">
          Need help with a listing, order, or reporting an issue? Send us a
          message.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={submit}
          className="card bg-base-200 border border-base-300 rounded-2xl"
        >
          <div className="card-body space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  className="input input-bordered"
                  value={f.name}
                  onChange={(e) => setF({ ...f, name: e.target.value })}
                  placeholder="Your name"
                  disabled={loading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={f.email}
                  onChange={(e) => setF({ ...f, email: e.target.value })}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered min-h-[140px]"
                value={f.message}
                onChange={(e) => setF({ ...f, message: e.target.value })}
                placeholder="Write your message..."
                disabled={loading}
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
            <p className="text-xs opacity-70" id="terms">
              By contacting us you agree to our community rules and respectful
              communication policy.
            </p>
          </div>
        </form>

        <div className="space-y-4">
          <div
            className="card bg-base-200 border border-base-300 rounded-2xl"
            id="report"
          >
            <div className="card-body">
              <h3 className="text-lg font-semibold">Report a Listing</h3>
              <p className="opacity-80 text-sm">
                If you see misleading information, duplicate listings, or
                suspicious activity—report it here.
              </p>
              <ul className="text-sm opacity-80 list-disc pl-5 mt-2 space-y-1">
                <li>Include listing name and link</li>
                <li>Describe the issue clearly</li>
                <li>We review reports within 24–48 hours</li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-200 border border-base-300 rounded-2xl">
            <div className="card-body">
              <h3 className="text-lg font-semibold">Direct Contact</h3>
              <p className="opacity-80 text-sm">✉️ support@pawmart.app</p>
              <p className="opacity-80 text-sm">📞 +8801846961288</p>
              <p className="opacity-80 text-sm">📍 Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
