#!/bin/bash

mkdir /tmp/icon.iconset
sips -z 16 16     ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_16x16.png
sips -z 32 32     ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_16x16@2x.png
sips -z 32 32     ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_32x32.png
sips -z 64 64     ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_32x32@2x.png
sips -z 128 128   ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_128x128.png
sips -z 256 256   ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_128x128@2x.png
sips -z 256 256   ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_256x256.png
sips -z 512 512   ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_256x256@2x.png
sips -z 512 512   ./src/assets/img/icon.png --out /tmp/icon.iconset/icon_512x512.png
cp ./src/assets/img/icon.png /tmp/icon.iconset/icon_512x512@2x.png
iconutil -c icns /tmp/icon.iconset
rm -R /tmp/icon.iconset
mv /tmp/icon.icns ./scripts/grou.icns
rm -rf /tmp/icon.iconset
