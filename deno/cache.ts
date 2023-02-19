type MaxAge = 0 | 60 | 1200;

export const cache = (maxAge: MaxAge = 60) => ({
	"Cache-Control": `public, max-age=${maxAge}, stale-while-revalidate=${
		Math.pow(
			maxAge,
			2,
		)
	}`,
});
