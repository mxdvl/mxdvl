import { assert } from "jsr:@std/assert";

const nonempty_string = (d: string | undefined): d is string => typeof d === "string" && d.length > 0;

const fetch_all_branches = () => {
	const cmd = new Deno.Command("git", {
		args: ["fetch", "-p"],
	});

	return cmd.output();
};

const list_branches = async () => {
	const cmd = new Deno.Command("git", {
		args: ["branch", "-vv"],
	});

	const { success, stdout } = await cmd.output();

	assert(success);

	return new TextDecoder()
		.decode(stdout)
		.split("\n")
		.map((line) => line.trim())
		.filter(nonempty_string);
};

const remove_gone_branches = async () => {
	await fetch_all_branches();
	const branches = await list_branches();
	const gone_branches = branches
		.filter((branch) => branch.match(": gone]"))
		.map((branch) => branch.split(" ")[0] ?? "")
		.filter(nonempty_string);

	if (!gone_branches.length) {
		console.info("All branches exist on remote");
		Deno.exit();
	} else {
		console.warn("Will remove the following branches", gone_branches);
	}

	const proceed = confirm("Proceed?");
	if (!proceed) {
		console.log("Aborting, no branches removed");
		Deno.exit();
	}

	const cmd = new Deno.Command("git", {
		args: ["branch", "-D", ...gone_branches],
	});
	const { code } = await cmd.output();
	Deno.exit(code);
};

if (import.meta.main) remove_gone_branches();
