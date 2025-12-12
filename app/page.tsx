export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-black">Welcome to MentorHub</h1>
      <p className="text-gray-600 mb-10">Choose how you want to get started</p>

      <div className="flex gap-6">
        <a
          href="/sign-up/student"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Find a Mentor
        </a>

        <a
          href="/sign-up/mentor"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Become a Mentor
        </a>
      </div>
    </div>
  );
}
