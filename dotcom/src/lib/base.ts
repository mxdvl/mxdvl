const isDev = process.env.NODE_ENV === "development";

export const base = isDev ? "http://localhost:3002/" : "https://content.mxdvl.com/";
