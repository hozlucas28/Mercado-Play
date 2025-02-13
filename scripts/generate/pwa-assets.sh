#!/usr/bin/env bash

# Generate PWA assets
pwa-asset-generator \
    ./public/favicon-512x512.png \
    ./public/icons/ \
    --opaque false \
    --padding '0px' \
    --scrape \
    --manifest ./public/manifest.json \
    --path '/' \
    --path-override 'icons' \
    --type png \
    --mstile \
    --maskable \
    --log &&

# Optimize PNG images
pngquant \
    --force \
    --skip-if-larger \
    --ext .png \
    --speed 1 \
    --strip \
    32 \
    -- \
    ./public/icons/*.png