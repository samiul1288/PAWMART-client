export default function About() {
  return (
    <section className="container mx-auto px-3 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">About PawMart</h1>
        <p className="opacity-80 max-w-3xl">
          PawMart is a community-driven platform for pet adoption and pet
          supplies. We focus on transparency, safety, and a smooth experience
          for adopters, rescuers, and pet owners.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card bg-base-200 border border-base-300 rounded-2xl">
          <div className="card-body">
            <h3 className="font-semibold text-lg">Trust & Safety</h3>
            <p className="opacity-80 text-sm">
              Clear listing info, responsible posting rules, and secure
              authentication.
            </p>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 rounded-2xl">
          <div className="card-body">
            <h3 className="font-semibold text-lg">Community First</h3>
            <p className="opacity-80 text-sm">
              Support rescues, foster homes, and verified local caregivers.
            </p>
          </div>
        </div>

        <div className="card bg-base-200 border border-base-300 rounded-2xl">
          <div className="card-body">
            <h3 className="font-semibold text-lg">Quality UX</h3>
            <p className="opacity-80 text-sm">
              Fast explore, filters, dashboard tools—built to be
              portfolio-ready.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-base-200/60 border border-base-300 rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
        <p className="opacity-80">
          Reduce street pet suffering by connecting adopters with responsible
          listings and by helping pet owners find essential supplies in one
          place.
        </p>
      </div>
    </section>
  );
}
