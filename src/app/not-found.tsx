import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl bg-beige-100 p-8 text-center text-grey-900 shadow-sm">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-grey-500">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/overview"
          className="mt-6 inline-flex rounded-xl bg-grey-900 px-4 py-3 text-sm font-bold text-beige-100"
        >
          Back to overview
        </Link>
      </div>
    </div>
  );
}
