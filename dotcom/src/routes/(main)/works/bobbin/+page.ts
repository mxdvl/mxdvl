/** A seven-sided shape that illustrates advanced features */
const default_state =
	"NoIgpgTAxgdghgWwF4A4DmBrAPgRgCxYCyWAtDgGwDsWADETQDQkDMNAOjAMIQQMCsATgAEAxjmGiGNEAxAIAVjgCezAGYwaARwGqs1YuIhY8zelI5QWYvjSHlyDHLfLWUHDjJB9mmmJqQATlB4ACZKWBAoWAD6ERAEdISMNHAoDChCtrY4Qji8KWkZWblCZPkAWp4hABZQAG4ANgDOcACWAPbkYBE4MRHM5LhRSVKp6ZkTOXmjhRPZpdM0lbIw6nB1AXiOAC5QULgEsfEEJHyDI+zws8VTvCwcY0WTC7zMHMsgqgGUSPJoITAUBBNHo+hA+NRTgIzJdHnMSrk7m8ruMbi8GMwPnAMBgcKlqpQYDgAA4RKJHSjURLJOFoxa055lKQfACu5GqqigIQgLLgACN9vpSIMcChhmIUABBUWOJ7zRhkKVpUXwrKyyoAXSAA";

export const load = ({ url }) => {
	const state = url.searchParams.get("state") ?? default_state;
	return { state };
};
