import Link from "next/link";

const UnauthorizedAccess = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Unauthorized Access</h1>
            <p className="text-gray-700 mb-6">
                You do not have permission to view this page.
            </p>
            <Link href="/"className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Go to Home
            </Link>
        </div>
    );
};

export default UnauthorizedAccess;
