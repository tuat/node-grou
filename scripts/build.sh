#!/bin/bash

NW_VERSION=v0.12.2

# Create build directory and copy files
rm -rf build
mkdir -p build/app
cp -Rf dist build/app
cp -Rf package.json build/app

# Zip build/app folder to app.nw
# > make sure package.json in the root directory
cd build/app
npm install --production
zip -r ../app.nw *
cd ../..

#
cd build

for platform in osx-ia32 win-ia32
do
    if [ ! -f nwjs-$NW_VERSION-$platform.zip ] ; then
        if [ ! -f nwjs-$NW_VERSION-$platform.tar.gz ] ; then
            axel http://dl.nwjs.io/$NW_VERSION/nwjs-$NW_VERSION-$platform.zip || \
            curl http://dl.nwjs.io/$NW_VERSION/nwjs-$NW_VERSION-$platform.zip > nwjs-$NW_VERSION-$platform.zip || \
            axel http://dl.nwjs.io/$NW_VERSION/nwjs-$NW_VERSION-$platform.tar.gz || \
            curl http://dl.nwjs.io/$NW_VERSION/nwjs-$NW_VERSION-$platform.tar.gz > nwjs-$NW_VERSION-$platform.tar.gz
        fi
    fi

    mkdir app-$platform
    unzip nwjs-$NW_VERSION-$platform.zip || tar xf nwjs-$NW_VERSION-$platform.tar.gz

    if [ -d nwjs-$NW_VERSION-$platform ]; then
        cp -Rf nwjs-$NW_VERSION-$platform/* app-$platform
        rm -Rf nwjs-$NW_VERSION-$platform
    fi

    if [ $platform == win-ia32 ]; then
        cat app-$platform/nw.exe app.nw > app-$platform/grou.exe
        rm app-$platform/nwjc.exe
        rm app-$platform/d3dcompiler_47.dll
        rm app-$platform/pdf.dll
        rm app-$platform/ffmpegsumo.dll # dont remove it when play Sound
        rm app-$platform/libEGL.dll
        rm app-$platform/libGLESv2.dll
        rm app-$platform/nw.exe
        rm -Rf app-$platform/credits.html
        rm -Rf app-$platform/locales
        chmod 755 app-$platform/grou.exe
    fi

    if [ $platform == osx-ia32 ]; then
        rm app-$platform/nwjc
        rm -Rf app-$platform/credits.html
        cp ./app.nw app-$platform/nwjs.app/Contents/Resources/
        cp ../scripts/Info.plist app-$platform/nwjs.app/Contents/
        cp ../scripts/*.icns app-$platform/nwjs.app/Contents/Resources/
        /usr/libexec/PlistBuddy -c "Set CFBundleVersion $1" app-$platform/nwjs.app/Contents/Info.plist
        /usr/libexec/PlistBuddy -c "Set CFBundleShortVersionString $1" app-$platform/nwjs.app/Contents/Info.plist
        mv app-$platform/nwjs.app app-$platform/grou.app
    fi
done
