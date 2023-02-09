import Link from "next/link";

export default function FormSplash({
	header,
	slug,
}: {
	header: string;
	slug: string;
}) {
	return (
		<Link href={`/admin/edit/${slug}`}>
			<div className="group my-8 flex justify-between rounded border-2 border-gray-900 p-4 hover:bg-gray-900">
				<h2 className="text-xl group-hover:text-neutral-50">
					{header}
				</h2>
				<svg
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 pt-1 text-gray-900 group-hover:text-neutral-50"
				>
					<path
						d="M8.25 4.5l7.5 7.5-7.5 7.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					></path>
				</svg>
			</div>
		</Link>
	);
}

/*
Cool gradient slide effect:
<div className="my-8">
			<div className="bg-accent rounded border-2 border-gray-900 bg-size-200 bg-pos-0 p-4 transition-all duration-500 hover:bg-pos-100">
				<h2 className="text-lg">{header}</h2>
			</div>
		</div>
 */
