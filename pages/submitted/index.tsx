import Footer from "@/components/footer";
import ReactConfetti from "react-confetti";

export default function Submitted() {
	let width,
		height = 0;
	try {
		width = window.innerWidth;
		height = window.innerHeight;
	} catch (e) {
		width = 3860;
		height = 2140;
	}
	return (
		<div className="flex h-screen flex-col justify-between">
			<ReactConfetti width={width} height={height} numberOfPieces={400} />
			<main className="grid h-full items-center">
				<h1 className="text-center text-3xl font-bold text-gray-900">
					Your response has been recorded
				</h1>
			</main>
			<Footer />
		</div>
	);
}
