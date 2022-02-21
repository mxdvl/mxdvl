
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
