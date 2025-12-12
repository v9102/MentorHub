import { UserButton } from "@clerk/nextjs";

export default function dashboard(){
    return (
        <div className="p-6">
            <header className="flex justify-end">
                <UserButton />
            </header>

            <h1 className="text-2xl font-bold mt-4">Mentor Dashboard</h1>
        </div>
    )
}