import Footer from "@/components/footer";

export default function Submitted() {
	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="grid h-full items-center">
				<h1 className="text-center text-3xl font-bold text-gray-900">
					Your response has been recorded
				</h1>
			</main>
			<Footer />
		</div>
	);
}
