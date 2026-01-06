export default function Success() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center px-8">
        <h1 className="text-4xl font-bold mb-6">
          🎉 Payment Successful!
        </h1>

        <p className="text-lg text-neutral-400 mb-6">
          Your enrollment is confirmed. Check your email for access details.
        </p>

        <a
          href="/blueprint"
          className="underline text-pink-400 hover:text-pink-300"
        >
          Back to modules →
        </a>
      </div>
    </main>
  );
}
