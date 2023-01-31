import Footer from "@/components/footer";

export default function Responded() {
	return (
		<div className="flex h-screen flex-col justify-between">
			<main className="grid h-full items-center">
				<h1 className="text-center text-3xl font-bold text-gray-900">
					You have already responded to this form
				</h1>
			</main>
			<Footer />
		</div>
	);
}
