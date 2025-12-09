import Link from 'next/link';

const features = [
  { title: 'Upload models', description: 'Paste a link to your STL/OBJ file and send it in seconds.' },
  { title: 'Material guidance', description: 'Pick plastics and colors with clear pricing and availability.' },
  { title: 'Order tracking', description: 'See every order’s status from received to completed.' }
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-midnight leading-tight">
          Send your model, choose materials, and get prints delivered without the back-and-forth.
        </h1>
        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
          Submit a link to your part, pick plastics and colors, and track progress in one simple dashboard. No jargon,
          just clear options and transparent updates.
        </p>
        <div className="flex justify-center">
          <Link
            href="/orders"
            className="bg-midnight text-white px-6 py-3 rounded-lg shadow hover:translate-y-[-1px] transition"
          >
            Start an order
          </Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="glass rounded-xl p-5 shadow-sm h-full">
            <h3 className="font-semibold text-midnight mb-2 text-lg">{feature.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
