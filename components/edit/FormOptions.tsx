import { FormOptions, Whitelist } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FormOptionsMenu({
	formOptions,
	whitelists,
	update,
}: {
	formOptions: FormOptions;
	whitelists: Whitelist[];
	update: (data: any, field: string) => void;
}) {
	// Checkboxes
	const [checked, setChecked] = useState<boolean[]>(Array(whitelists.length));
	// Toggle state
	const [active, setActive] = useState(Boolean);
	// Unix epoch
	const [date, setDate] = useState(Date.parse(formOptions.endDate));
	const [useDate, setUseDate] = useState(Boolean);

	useEffect(() => {
		let checkedCopy = [...checked];
		whitelists.forEach((list, i) => {
			if (formOptions.whitelists.indexOf(list.id) != -1)
				checkedCopy[i] = true;
		});
		setChecked(checkedCopy);
	});

	const handleActiveChange = () => {
		setActive(!active);
		update(!active, "active");
	};

	const handleEndDateActiveChange = () => {
		if (!useDate) update(new Date("9999-12-12T12:12:12"), "endDate");
		else update(date, "endDate");
		setUseDate(!useDate);
		// update(!useDate, "useEndDate");
	};

	const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		// const year = new Date(event.target.value).getFullYear().toString();
		if (!event.target["validity"].valid /*|| year.length != 4*/) return;
		const iso8601 = event.target.value;
		const parsedDate = Date.parse(iso8601);
		setDate(parsedDate);
		update(parsedDate, "endDate");
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
		<div className="col-span-5 col-start-2 mt-2 grid grid-cols-3 rounded border-2 border-gray-900 py-2 px-4 text-gray-900">
			<h2 className="col-span-1 col-start-2 m-2 flex justify-center text-2xl font-semibold">
				Form Settings
			</h2>
			<hr className="col-span-3 col-start-1 mx-5 mb-3 h-1 rounded bg-gray-300" />
			<div className="col-span-1 col-start-1">
				<h2 className="font-semibold">Access:</h2>
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
							onChange={(event) => onChangeDate(event)}
							defaultValue={new Date(date)
								.toISOString()
								.slice(0, -8)}
							max="9999-12-31T00:00"
							className="ml-2 h-6 rounded bg-gray-200 p-2 text-sm disabled:cursor-not-allowed disabled:text-gray-400"
							disabled={!useDate}
						/>
					</label>
					<label className="flex justify-start">
						<input
							type="checkbox"
							checked={useDate}
							onChange={() => handleEndDateActiveChange()}
							className="peer absolute h-6 w-10 -translate-x-1/2 appearance-none rounded"
						/>
						<span className="flex h-6 w-10 flex-shrink-0 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out after:h-4 after:w-4 after:rounded-full after:bg-neutral-50 after:shadow-md after:duration-300 peer-checked:bg-gray-900 peer-checked:after:translate-x-4"></span>
						<span className="ml-2">End Date</span>
					</label>
				</div>
			</div>
			<div className="col-span-1 col-start-2">
				<h2 className="font-semibold">Permissions:</h2>
				<div>
					<h3 className="">Whitelists:</h3>
					<div>{whitelistSet}</div>
				</div>
			</div>
			<div className="col-span-1 col-start-3">
				<h2 className="font-semibold">Something else:</h2>
			</div>
		</div>
	);
}
