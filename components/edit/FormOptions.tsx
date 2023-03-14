import { useState } from "react";

export default function FormOptionsMenu({ props }: any) {
	// Checkboxes
	const [checked, setChecked] = useState(Array<Boolean>);
	// Toggle state
	const [active, setActive] = useState(Boolean);
	// Unix epoch
	const [date, setDate] = useState(Date.parse(props.form?.options?.endDate));

	const onChangeToggle = () => {
		setActive(!active);
	};

	const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		// const year = new Date(event.target.value).getFullYear().toString();
		if (!event.target["validity"].valid /*|| year.length != 4*/) return;
		const iso8601 = event.target.value;
		const parsedDate = Date.parse(iso8601);
		setDate(parsedDate);
		// setDate(event.target.value);
	};

	const onChangeWhitelist = (i: number) => {
		let checkedCopy = [...checked];
		checkedCopy[i] = !checkedCopy[i];
		setChecked(checkedCopy);
		// console.log(checked);
	};
	// const whitelistSnapshot = (async () => {
	//   const docSnap = await getDocs(collection(db, "whitelist"));
	//   return docSnap;
	// })();
	// const whitelistSet = whitelists.map((list, i) => {
	// 	return (
	// 		<div>
	// 			<label className="ml-1">
	// 				<input
	// 					type="checkbox"
	// 					// TODO: see if a better solution is available here
	// 					checked={!!checked[i]}
	// 					onChange={() => onChangeWhitelist(i)}
	// 					className="checked:bg-accent mr-2 h-4 w-4 appearance-none rounded border-2 border-gray-900 bg-neutral-50 focus:ring-0"
	// 				/>
	// 				{list[1]}
	// 			</label>
	// 		</div>
	// 	);
	// });

	return (
		<div className="col-span-5 col-start-2 mt-2 rounded border-2 border-gray-900 text-gray-900">
			<h2 className="m-2 flex justify-center text-2xl font-semibold">
				Form Settings
			</h2>
			<hr className="mx-5 mb-3 h-1 rounded bg-neutral-200" />
			<div className="m-10 space-y-5">
				<label className="group relative flex items-center justify-start p-2 text-xl">
					<input
						type="checkbox"
						checked={active}
						onChange={() => onChangeToggle()}
						className="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
					/>
					<span className="ml-4 flex h-10 w-16 flex-shrink-0 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out after:h-8 after:w-8 after:rounded-full after:bg-white after:shadow-md after:duration-300 peer-checked:bg-black peer-checked:after:translate-x-6"></span>
					<span className="ml-5">Active</span>
				</label>
				<div>
					<h3 className="font-semibold underline">Whitelists:</h3>
					{/* <div>{whitelistSet}</div> */}
				</div>
				<div>
					<label className="relativr group flex items-center justify-start p-2 text-xl">
						<span className="font-semibold">
							Enter and end date and time:
						</span>
						<input
							type="datetime-local"
							onChange={(event) => onChangeDate(event)}
							defaultValue={new Date(date)
								.toISOString()
								.slice(0, -8)}
							max="9999-12-31T00:00"
							className="ml-2 bg-gray-200"
						/>
					</label>
				</div>
			</div>
		</div>
	);
}
