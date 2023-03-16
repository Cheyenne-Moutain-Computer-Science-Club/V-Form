import Footer from "components/Footer";

export default function FormDoesNotExist() {
	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="grid h-full items-center">
				<h1 className="text-center text-3xl font-bold text-gray-900">
					This form does not exist
				</h1>
			</main>
			<Footer />
		</div>
	);
}
