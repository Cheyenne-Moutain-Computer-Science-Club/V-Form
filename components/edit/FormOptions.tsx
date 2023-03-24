import { FormOptions, Whitelist } from "@/lib/types";
import { useEffect, useState } from "react";

export default function FormOptionsMenu({
	formOptions,
	whitelists,
	update,
	close,
}: {
	formOptions: FormOptions;
	whitelists: Whitelist[];
	update: (data: any, field: string) => void;
	close: () => void;
}) {
	// Checkboxes
	const [checked, setChecked] = useState<boolean[]>(Array(whitelists.length));
	// Toggle state
	const [active, setActive] = useState(formOptions.active);
	// Unix epoch
	const [date, setDate] = useState(Date.parse(formOptions.endDate));
	const [useDate, setUseDate] = useState(Boolean);

	const [tab, setTab] = useState(0);

	useEffect(() => {
		let checkedCopy = [...checked];
		whitelists.forEach((list, i) => {
			if (formOptions.whitelists.indexOf(list.id) != -1)
				checkedCopy[i] = true;
		});
		setChecked(checkedCopy);

		if (
			formOptions.endDate == new Date("9999-12-12T12:12:12").toISOString()
		) {
			setUseDate(false);
			setDate(new Date().getTime());
		} else {
			setUseDate(true);
		}
	}, []);

	const handleActiveChange = () => {
		setActive(!active);
		update(!active, "active");
	};

	const handleEndDateActiveChange = () => {
		if (useDate)
			update(new Date("9999-12-12T12:12:12").toISOString(), "endDate");
		else update(new Date(date).toISOString(), "endDate");
		setUseDate(!useDate);
		// update(!useDate, "useEndDate");
	};

	const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		// const year = new Date(event.target.value).getFullYear().toString();
		if (!event.target["validity"].valid /*|| year.length != 4*/) return;
		const iso8601 = event.target.value;
		const parsedDate = Date.parse(iso8601);
		setDate(parsedDate);
		update(new Date(parsedDate).toISOString(), "endDate");
	};

	const onChangeWhitelist = (i: number) => {
		let checkedCopy = [...checked];
		checkedCopy[i] = !checkedCopy[i];
		setChecked(checkedCopy);

		let newWhitelists: string[] = [];
		checkedCopy.forEach((checked, i) => {
			if (checked) newWhitelists.push(whitelists[i].id);
		});

		update(newWhitelists, "whitelists");
	};

	const whitelistSet = whitelists.map((list, i) => {
		return (
			<div key={list.id}>
				<label className="ml-1">
					<input
						type="checkbox"
						// TODO: see if a better solution is available here
						checked={!!checked[i]}
						onChange={() => onChangeWhitelist(i)}
						className="mr-2 h-4 w-4 appearance-none rounded border-2 border-gray-900 bg-neutral-50 checked:bg-gray-900 focus:ring-0"
					/>
					{list.name}
				</label>
			</div>
		);
	});

	return (
		<>
			<div className="fixed left-1/4 top-1/3 z-50 w-1/2 rounded bg-neutral-50 py-2 px-4 text-gray-900 shadow-lg outline-none focus:outline-none">
				<div className="flex justify-center">
					<h2 className="m-2 flex justify-center text-2xl font-semibold">
						Form Settings
					</h2>
					<svg
						onClick={() => close()}
						className="mt-1 ml-auto h-6 w-6 cursor-pointer rounded bg-neutral-50 hover:bg-gray-900 hover:text-neutral-50"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</div>

				<div className="border-b-2 border-gray-200">
					<ul className="-mb-px flex flex-wrap text-center text-sm font-bold text-gray-900">
						<li className="mr-2">
							<button
								onClick={() => setTab(0)}
								className={`group inline-flex rounded-t-lg border-b-2 p-4 hover:border-gray-300 ${
									tab == 0
										? "border-orange-500 p-4"
										: "border-transparent"
								}`}
							>
								<svg
									fill="none"
									stroke="currentColor"
									strokeWidth={2.5}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									className="mr-2 h-5 w-5 text-gray-900 group-hover:text-gray-900"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
									/>
								</svg>
								Access
							</button>
						</li>
						<li className="mr-2">
							<button
								onClick={() => setTab(1)}
								className={`group inline-flex rounded-t-lg border-b-2 p-4 hover:border-gray-300 ${
									tab == 1
										? "border-orange-500 p-4"
										: "border-transparent"
								}`}
							>
								<svg
									className="mr-2 h-5 w-5"
									aria-hidden="true"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Whitelists
							</button>
						</li>
						<li className="mr-2">
							<button
								onClick={() => setTab(2)}
								className={`group inline-flex rounded-t-lg border-b-2 p-4 hover:border-gray-300 ${
									tab == 2
										? "border-orange-500 p-4"
										: "border-transparent"
								}`}
							>
								<svg
									aria-hidden="true"
									className="mr-2 h-5 w-5 text-gray-900 group-hover:text-gray-900"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
								</svg>
								Settings
							</button>
						</li>
						<li className="mr-2">
							<button
								onClick={() => setTab(3)}
								className={`group inline-flex rounded-t-lg border-b-2 p-4 hover:border-gray-300 ${
									tab == 3
										? "border-orange-500 p-4"
										: "border-transparent"
								}`}
							>
								<svg
									aria-hidden="true"
									className="mr-2 h-5 w-5 text-gray-900 group-hover:text-gray-900"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
									<path
										fill-rule="evenodd"
										d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
										clip-rule="evenodd"
									></path>
								</svg>
								Whitelists
							</button>
						</li>
					</ul>
				</div>
				<div className="ml-4 w-full flex-col justify-between py-2">
					{tab == 0 && (
						<>
							<label className="flex justify-start">
								<input
									type="checkbox"
									checked={active}
									onChange={() => handleActiveChange()}
									className="peer absolute h-6 w-10 -translate-x-1/2 appearance-none rounded"
								/>
								<span className="flex h-6 w-10 flex-shrink-0 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out after:h-4 after:w-4 after:rounded-full after:bg-neutral-50 after:shadow-md after:duration-300 peer-checked:bg-emerald-500 peer-checked:after:translate-x-4"></span>
								<span className="ml-2">Active</span>
							</label>
							<div>
								<label className="group flex items-center justify-start">
									<h3 className="text-sm">End Date:</h3>
									<input
										type="datetime-local"
										onChange={(event) =>
											onChangeDate(event)
										}
										min={new Date()
											.toISOString()
											.slice(0, -8)}
										value={new Date(date)
											.toISOString()
											.slice(0, -8)}
										max="9999-12-31T00:00"
										className="ml-2 h-6 rounded bg-gray-200 p-2 text-sm disabled:cursor-not-allowed disabled:text-gray-900"
										disabled={!useDate}
									/>
								</label>
								<label className="flex justify-start">
									<input
										type="checkbox"
										checked={useDate}
										onChange={() =>
											handleEndDateActiveChange()
										}
										className="peer absolute h-6 w-10 -translate-x-1/2 appearance-none rounded"
									/>
									<span className="flex h-6 w-10 flex-shrink-0 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out after:h-4 after:w-4 after:rounded-full after:bg-neutral-50 after:shadow-md after:duration-300 peer-checked:bg-gray-900 peer-checked:after:translate-x-4"></span>
									<span className="ml-2">End Date</span>
								</label>
							</div>
						</>
					)}
					{tab == 1 && (
						<>
							<div className="flex">
								<div className="mx-2 flex flex-row items-center">
									<input
										type="radio"
										// value={}
										// name=A
										className="mr-1 h-5 w-5 rounded-full border-2 bg-neutral-50 accent-gray-900 focus:ring-0"
									/>{" "}
									<span>Nobody</span>
								</div>
								<div className="mx-2 flex flex-row items-center">
									<input
										type="radio"
										// value={}
										// name=A
										className="mr-1 h-5 w-5 rounded-full border-2 bg-neutral-50 accent-gray-900 focus:ring-0"
									/>{" "}
									<span>Everybody in District</span>
								</div>
								<div className="mx-2 flex flex-row items-center">
									<input
										type="radio"
										// value={}
										// name=A
										className="mr-1 h-5 w-5 rounded-full border-2 bg-neutral-50 accent-gray-900 focus:ring-0"
									/>{" "}
									<span>Everybody with Link</span>
								</div>
							</div>
							<label className="flex justify-start">
								<input
									type="checkbox"
									checked={useDate}
									// onChange={() => handleEndDateActiveChange()}
									className="peer absolute h-6 w-10 -translate-x-1/2 appearance-none rounded"
								/>
								<span className="flex h-6 w-10 flex-shrink-0 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out after:h-4 after:w-4 after:rounded-full after:bg-neutral-50 after:shadow-md after:duration-300 peer-checked:bg-gray-900 peer-checked:after:translate-x-4"></span>
								<span className="ml-2">Whitelists</span>
							</label>
							<div>
								<h3 className="">Whitelists:</h3>
								<div>{whitelistSet}</div>
							</div>
						</>
					)}
				</div>
				<div className="flex w-full border-t-2 border-gray-200">
					Footer
				</div>
			</div>
			<div className="fixed inset-0 z-40 bg-gray-900 opacity-25 backdrop-blur-3xl"></div>
		</>
	);
}
