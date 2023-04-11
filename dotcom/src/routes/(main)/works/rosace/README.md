# Rosace – a radial symmetry exploration tool

Inspired by the the unique intricacies of [snowflakes][], [wheel charts][], [doilies][] and [rose windows][].
Creating these delicate shapes and structures requires craft, know-how and a great deal of time.
This tool allows to explore these radial symmetries with a short feedback loop.

Each shape can be woven independently into the dynamic tapestry.
The result can be exported and used as the basis for further work.

All the editing features use the web platform’s native toolset. State is encoded using search parameters, allowing undo using the back button and sharing a creation with a user without JavaScript.

Leveraging the web platform, and especially SVG features, required a framework that embraced them, which made Svelte & SvelteKit the ideal for this project.

[snowflakes]: https://en.wikipedia.org/wiki/Snowflake
[wheel charts]: https://en.wikipedia.org/wiki/Volvelle
[doilies]: https://en.wikipedia.org/wiki/Doily
[rose windows]: https://en.wikipedia.org/wiki/Rose_window
