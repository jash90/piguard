export default function DashboardHome() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">PiGuard Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Live DNS activity monitoring for your home network.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h2 className="text-sm font-medium text-gray-500">Queries Today</h2>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-sm font-medium text-gray-500">Blocked</h2>
          <p className="text-3xl font-bold mt-2 text-red-600">—</p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-sm font-medium text-gray-500">Devices Online</h2>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-sm font-medium text-gray-500">Active Alerts</h2>
          <p className="text-3xl font-bold mt-2 text-amber-600">—</p>
        </div>
      </div>
    </main>
  )
}
