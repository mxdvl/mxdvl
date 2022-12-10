<h1>Le profil de Max</h1>

<p>
	En tant qu’ingénieur logiciel et designer, je bâti des modèles complexes à l’aide de médiums numériques et
	tangibles. Constamment en train d’esquisser une idée, tant avec un stylo qu’un écran, je cherche de nouvelles façons
	de créer des choses inspirantes et interactives. Mon travail est ancré dans une fascination pour les motifs, la
	géométrie et la simplicité.
</p>

<p>
	J’ai fait <a href="https://www.theguardian.com/info/2021/jun/25/a-day-in-the-life"
		>une entrevue en anglais pour le blog d’ingénierie du Guardian</a
	>.
</p>

<section id="cv">
	<ul>
		<li>
			<h2>The Guardian</h2>
			<h3>2020-now</h3>
			<p>
				Ingénieur logiciel sénior, je travaille sur la plateforme web,
				<a href="https://www.theguardian.com/">TheGuardian.com</a>. Initialement sur l’équipe controllant le
				code commercial, puis au sein de l’équipe Dotcom, qui gère la plateforme web dans son ensemble.
			</p>
			<p>
				Mes réalisation principales sont: la modernisation de code JavaScript, une conversion de Flow à
				TypeScript; optimisation des images vectiorielles
				<abbr title="Scalable Vector Graphics">(SVG)</abbr>; visualisations diverses.
			</p>
		</li>

		<li lang="en">
			<h2>MXDVL</h2>
			<h3>2010-2020</h3>
			<p>
				With over 10 years of experience building for the web, I have offered services ranging from fully
				managed websites to transitioning away from legacy platforms. In the last 5 years, I have focussed on
				bringing a single source of truth and 2D and 3D visualisation.
			</p>
			<p>
				Designed and built entire websites with news, portfolio and forms. Improved Google page speed insight by
				40-60 points on average on consultancy projects, meaning all web pages load fast. This was achieved by
				specifying better cache rules, optimizing database requests and leveraging distributed CDNs. World
				location mapping and styling with Leaflet. Integrated online payment with Stripe. Developed JSON APIs in
				PHP to expose data to collaborators. Conducted surveys in multiple languages and combined the data into
				live online spreadsheets.
			</p>
		</li>

		<li lang="en">
			<h2>Allies and Morrison LLP</h2>
			<h3>2018-2020</h3>
			<p>
				Assuming a role of building information modelling lead (BIM), I developed internal tooling workflow,
				oversaw data exchange with consultants and advised on technical improvements to the <a
					href="https://www.alliesandmorrison.com">company website</a
				>.
			</p>
			<p>
				Built testing tools for key project metrics using Grasshopper, ranging from sustainability to unit mix.
				Developed solar analysis tools leading to major savings in building envelope performance. Leveraged BIM
				to deliver project documentation on tight deadlines and trained the team throughout, exceeding targets.
				Streamlined internal scheduling systems using automation & PowerQuery.
			</p>
		</li>

		<li lang="en">
			<h2>Florian Busch Architects</h2>
			<h3>2016-2018</h3>
			<p>
				Assuming a role of technical lead, I helped defined and implement data-driven design within the
				practice, an internal wiki and the <a href="https://www.florianbusch.com">public website</a>.
			</p>
			<p>
				Developed GIS analysis tools for development of a ski resort in Hokkaido. Produced pictures of an
				alternative 2020 Tokyo Olympic stadium, which was published in The Japan Times and ReThink Tokyo. Built
				complex digital generative and data-driven models. Taught scripting training sessions to fellow
				colleagues and improved workflow.
			</p>
			<p>
				Oversaw the transition of the office server to a faster, more robust and easy to extend infrastructure.
				The new system further allowed partners to access the office server remotely via VPN, a key feature when
				presenting projects to oversea clients. Built custom tools that were critical in winning two major
				projects in Hokkaido. Both relied on making complex spatial analysis expressed as simple and rich
				diagrams.
			</p>
		</li>

		<li lang="en">
			<h2>Provencher_Roy</h2>
			<h3>2015-2016</h3>
			<p>
				Operated and maintained the laser cutter. Visualisation of points cloud / 3D scans for grade-listed
				building refurbishments
			</p>
		</li>
	</ul>
</section>

<style>
	ul {
		list-style-type: none;
		padding: var(--grid-double) 0 0;
		margin: 0;
	}

	ul > li {
		width: calc(36 * var(--grid));
		max-width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		position: relative;
		padding: 0 0 calc(3 * var(--grid));
	}

	ul > li:nth-last-child(1) {
		padding-bottom: 0;
	}
	ul > li:nth-last-child(n + 2)::after {
		content: " ";
		width: 100%;
		position: absolute;
		border-bottom: 2px solid var(--skies);
		bottom: calc(var(--grid-double) - 1px);
	}

	ul > li p {
		width: 100%;
	}
</style>
