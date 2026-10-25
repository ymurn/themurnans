#!/bin/sh
# Small copies of the site's photographs, for the places they are shown small.
#
# Every photo in assets/continued_trips and assets/photos gets a copy 640px
# wide in assets/sm, at the same path: assets/continued_trips/x/y.jpg has
# assets/sm/continued_trips/x/y.jpg. The pages offer both and the browser
# picks the one the spot needs (assets/js/pics.js); the lightbox always
# opens the full one. Photos 640px wide or narrower are copied as they are.
#
# Only missing copies are made, so run it again after adding photos:
#   sh tools/make-small.sh
set -e
cd "$(dirname "$0")/.."
BIN="${TMPDIR:-/tmp}/murnan-small"
[ "$BIN" -nt tools/small.swift ] || swiftc -O tools/small.swift -o "$BIN"
find assets/continued_trips assets/photos -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) | sort | while read -r f; do
  out="assets/sm/${f#assets/}"
  out="${out%.*}.jpg"
  [ -f "$out" ] && continue
  mkdir -p "$(dirname "$out")"
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  if [ "$w" -le 640 ] && [ "${f##*.}" = jpg ]; then cp "$f" "$out"; else "$BIN" 640 0.6 "$f" "$out"; fi
  echo "$out"
done | awk 'END{print NR " small copies made"}'
