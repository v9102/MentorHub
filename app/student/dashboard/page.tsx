import { UserButton } from "@clerk/nextjs";

export default function StudentDashboard() {
  return (
    <div className="p-6">
      <header className="flex justify-end">
        <UserButton />
      </header>

      <h1 className="text-2xl font-bold mt-4">Student Dashboard</h1>
    </div>
  );
}
