import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold">Welcome to StudioSpace</h1>

          <p className="mt-4 text-muted">Your creative space starts here.</p>
        </div>
      </main>
    </>
  );
}
