import Footer from "components/Footer";

export default function PermissionDenied() {
	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="grid h-full items-center">
				<h1 className="text-center text-3xl font-bold text-gray-900">
					You do not have permission
				</h1>
			</main>
			<Footer />
		</div>
	);
}
