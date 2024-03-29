import { useRouter } from "next/router";

export default function ConfirmationModal({
	closehandler,
}: {
	closehandler: () => void;
}) {
	const router = useRouter();

	return (
		<div>
			<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
				<div className="relative my-6 mx-auto w-auto max-w-sm">
					<div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
						<div className="flex items-start justify-between rounded-t p-5">
							<h3 className="text-3xl font-semibold">Go Back?</h3>
							<button
								className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
								onClick={closehandler}
							>
								<span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
									×
								</span>
							</button>
						</div>
						<div className="relative flex-auto p-6">
							<p className="my-4 text-lg leading-relaxed text-gray-900">
								Are you sure you want to proceed? All unsaved
								changes will be lost, and you will return to the
								dashboard.
							</p>
						</div>
						<div className="flex items-center justify-end rounded p-6">
							<button
								className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
								type="button"
								onClick={closehandler}
							>
								Cancel
							</button>
							<button
								className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
								type="button"
								onClick={() => router.push("/admin")}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="fixed inset-0 z-40 bg-black opacity-25"></div>
		</div>
	);
}
