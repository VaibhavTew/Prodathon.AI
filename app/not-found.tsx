import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container max-w-xl text-center">
        <p className="font-display text-8xl font-bold text-accent">404</p>
        <h1 className="mt-4 text-3xl font-bold">This page didn&apos;t ship.</h1>
        <p className="lead mt-3">But your hackathon spot still can.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/hackathon#register" className="btn-primary">Register free</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </section>
  );
}
