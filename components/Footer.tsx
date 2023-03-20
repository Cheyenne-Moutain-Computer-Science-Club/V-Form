export default function Footer() {
	return (
		<footer className="flex items-center justify-between rounded-t-lg bg-neutral-50 p-6">
			<span className="text-center text-sm text-gray-500">
				© 2023{" "}
				<a href="#" className="hover:underline">
					Cheyenne Mountain Computer Science Club
				</a>
				. All Rights Reserved.
			</span>
			<ul className="mt-0 flex flex-wrap items-center text-sm text-gray-500">
				<li>
					<a href="#" className="mr-6 hover:underline ">
						About
					</a>
				</li>
				<li>
					<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="mhover:underline mr-6">
						Privacy Policy
					</a>
				</li>
				<li>
					<a href="#" className="mr-6 hover:underline">
						Licensing
					</a>
				</li>
				<li>
					<a href="#" className="hover:underline">
						Contact
					</a>
				</li>
			</ul>
		</footer>
	);
}
