import Footer from "components/Footer";
import ReactConfetti from "react-confetti";
import { useEffect, useState } from "react";

export default function Submitted() {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}, []);

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
