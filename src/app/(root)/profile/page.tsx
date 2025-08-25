import { getCurrentUser } from "@/lib/auth/actions";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="max-w-3xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <h1 className="text-heading-2 text-dark-900">My Profile</h1>
        <p className="mt-2 text-body">You need to sign in to view your profile.</p>
        <Link href="/auth" className="inline-block px-6 py-3 mt-4 rounded-full bg-dark-900 text-light-100">Go to Auth</Link>
      </main>
    );
  }
  return (
    <main className="max-w-3xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      <h1 className="text-heading-2 text-dark-900">My Profile</h1>
      <div className="mt-6 space-y-3">
        <div className="p-4 border rounded-xl border-light-300">
          <p className="text-body-medium text-dark-900">Name</p>
          <p className="text-body text-dark-700">{user.name ?? "—"}</p>
        </div>
        <div className="p-4 border rounded-xl border-light-300">
          <p className="text-body-medium text-dark-900">Email</p>
          <p className="text-body text-dark-700">{user.email}</p>
        </div>
      </div>
    </main>
  );
}


