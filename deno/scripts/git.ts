const list_branches = async () => {
	const process = Deno.run({
		cmd: ['git', 'branch', '-vv'],
		stdout: 'piped',
	});

	return new TextDecoder()
		.decode(await process.output())
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);
};

const remove_gone_branches = async () => {
	const branches = await list_branches();
	const gone_branches = branches.filter((branch) => branch.match(': gone]'))
		.map((branch) => branch.split(' ')[0]);

	if (!gone_branches.length) {
		console.info('All branches exist on remote');
		Deno.exit();
	} else {
		console.warn('Will remove the following branches', gone_branches);
	}

	const proceed = confirm('Proceed?');
	if (!proceed) {
		console.log('Aborting, no branches removed');
		Deno.exit();
	}

	const process = Deno.run({
		cmd: ['git', 'branch', '-D', ...gone_branches],
	});
	const { code } = await process.status();
	Deno.exit(code);
};

if (import.meta.main) remove_gone_branches();
