#!/usr/bin/env zsh

set -e

# VIPS for SVG to PNG

vips copy cmps.svg build/favicon.png

# Convert PNG to ICO
convert -background transparent \
	build/favicon.png \
	-define icon:auto-resize=64,32,16 \
	build/favicon.ico


# VIPS for apple-touch-icons

vips copy cmps-icon-light.svg build/cmps-icon-light.png
vips copy cmps-icon-dark.svg build/cmps-icon-dark.png
cp build/cmps-icon-dark.png build/apple-touch-icon.png

cp *.(svg|png|ico) build

# Copy to dotcom, content & deno
cp -R build/ ../dotcom/static
cp -R build/ ../content/static
