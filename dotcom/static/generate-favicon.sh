
# VIPS for SVG to PNG

vips copy cmps.svg favicon.png

# Convert PNG to ICO
convert -background transparent \
	favicon.png \
	-define icon:auto-resize=64,32,16 \
	favicon.ico


# VIPS for apple-touch-icons

vips copy cmps-icon-light.svg cmps-icon-light.png
vips copy cmps-icon-dark.svg cmps-icon-dark.png
cp cmps-icon-dark.png apple-touch-icon.png


# Copy to content
cp apple-touch-icon.png ../../content/static
cp favicon.ico ../../content/static
cp favicon.png ../../content/static
cp mask-icon.svg ../../content/static
