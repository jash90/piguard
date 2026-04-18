export default function AdminHome() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">PiGuard Admin</h1>
      <p className="mt-2 text-gray-600">
        Manage blocklists, social media blocking, and access schedules.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a
          href="/blocklist"
          className="rounded-lg border p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold">Blocklist</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add and manage blocked domains
          </p>
        </a>
        <a
          href="/social"
          className="rounded-lg border p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold">Social Media</h2>
          <p className="text-sm text-gray-500 mt-1">
            Block social media platforms per child
          </p>
        </a>
        <a
          href="/children"
          className="rounded-lg border p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold">Children</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage child profiles and device assignments
          </p>
        </a>
        <a
          href="/devices"
          className="rounded-lg border p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold">Devices</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and assign network devices
          </p>
        </a>
        <a
          href="/schedule"
          className="rounded-lg border p-6 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold">Schedules</h2>
          <p className="text-sm text-gray-500 mt-1">
            Set time-based access rules
          </p>
        </a>
      </div>
    </main>
  )
}
