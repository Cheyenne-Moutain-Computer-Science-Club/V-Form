import Footer from "../footer";

export default function LoadingPageState() {
	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="grid h-full items-center">
				<h1 className="text-center text-3xl font-bold text-gray-900">
					Loading...
				</h1>
			</main>
			<Footer />
		</div>
	);
}
