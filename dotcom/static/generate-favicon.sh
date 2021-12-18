
# VIPS for SVG to PNG

vips copy cmps.svg favicon.png

# Convert PNG to ICO
convert -background transparent \
	favicon.png \
	-define icon:auto-resize=64,32,16 \
	favicon.ico
