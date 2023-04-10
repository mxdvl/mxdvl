/** A seven-sided shape that illustrates advanced features */
const default_state =
	"NoIgpgTAxgdghgWwF4A4DmBrAPgRgCxYD6WAtDgGwDsuWAsgAwA0JAzPQDowDCEEjArAE4ABIKY4RYxhxgBlXsyHCmbTmpghGIBACscATxYAzGPQCOgo1mq1cgiFjws6TGVFbj+9YeXKMc3uSeKOqaIPwsZjBmSABOUHgAJvpYEChEqRAE9C7ScCiMKMrFOMI4fPT5hcXepWQVAFphiQAWUABuADYAznAAlgD25GCpOBkQLOS46Qx5BUXetWUVVQslwvXSTVowJnDtsXh9AC5QULgExFkEJPxTszKrNWXCy8wsnE+LL5ss2yBGWKUJA6NCJGAoCBmazjfjUW6CXKPebPUpvVifFHfOrlRh-MJwDAYHD5FqUGA4AAOqXSV0o1ByDy+61xlSx6029CaAF0gA";

export const load = ({ url }) => {
	const state = url.searchParams.get("state") ?? default_state;
	return { state };
};
