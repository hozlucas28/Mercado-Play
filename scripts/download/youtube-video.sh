#!/bin/bash

# Verify platform
if [[ "$(uname -s)" != *"NT"* && "$OS" != "Windows_NT" ]]; then
	echo -e "\e[31m> This script is designed to run only on Windows!\e[0m"
	exit 1
fi

# Verify program arguments
if [ $# -ne 2 ]; then
	echo -e "\e[31m> Invalid number of arguments!\e[0m\n"

	echo "> Usage: sh $0 <VIDEO_URL> <OUTPUT>"
	echo "> For example: sh $0 https://youtu.be/2lAe1cqCOXo?si=zeydEZ-Z8SAgw9C4 \"./rewind.mp4\""

	exit 1
fi

VIDEO_URL="$1"
OUTPUT="$2"

# Verify that the output path ends with ".mp4"
if [[ ! "$OUTPUT" == *.mp4 ]]; then
	echo -e "\e[31m> The output must end with \".mp4\".\e[0m"
	exit 1
fi

# Verify ffmpeg installation
if ! command -v ffmpeg &> /dev/null; then
	echo -e "\e[31m> ffmpeg (https://ffmpeg.org/) is not installed, please install it to run this script.\e[0m"
	exit 1
fi

SCRIPT_PATH=$(
	cd "$(dirname "${BASH_SOURCE[0]}")"
	pwd -P
)

# Download desktop and mobile versions of the video
echo -e "\e[96m> Downloading desktop (1080p) version...\e[0m\n"
"${SCRIPT_PATH}/bin/yt-dlp__windows.exe" -f "bv*[ext=mp4][height<=1080]+ba[ext=m4a]/b[ext=mp4][height<=1080]" --download-sections "*0:00-2:00" -o "desktop.temp.mp4" "$VIDEO_URL"

echo -e "\e[96m\n> Downloading mobile (720p) version...\n\e[0m"
"${SCRIPT_PATH}/bin/yt-dlp__windows.exe" -f "bv*[ext=mp4][height<=720]+ba[ext=m4a]/b[ext=mp4][height<=720]" --download-sections "*0:00-2:00" -o "mobile.temp.mp4" "$VIDEO_URL"

# Optimize desktop and mobile versions
getCinemaBorders() {
	local videoPath="$1"
	local cropValue=$(ffmpeg -i "$videoPath" -vf "cropdetect=24:16:0" -t 10 -f null - 2>&1 | grep -oP 'crop=\K[0-9]+:[0-9]+:[0-9]+:[0-9]+' | tail -1)

	if [[ -n "$cropValue" ]]; then
		local width=$(echo "$cropValue" | cut -d':' -f1)
		local height=$(echo "$cropValue" | cut -d':' -f2)
		local size=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$videoPath")

		if [[ "$cropValue" != "$size" ]]; then
			echo "$cropValue"
			return 0
		fi
	fi

	return 1
}

optimizeVideo() {
	local input="$1"
	local output="$2"

	local crop_value=$(getCinemaBorders "$input")

	if [[ -n "$crop_value" ]]; then
		ffmpeg -i "$input" -vf "crop=$crop_value" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "$output"
	else
		ffmpeg -i "$input" -c:v libx264 -pix_fmt yuv420p -crf 23 -preset fast -c:a aac -b:a 128k -movflags +faststart "$output"
	fi
}

echo -e "\e[96m\n> Optimizing desktop (1080p) version...\n\e[0m"

DESKTOP_OUTPUT_MP4="${OUTPUT%.mp4}__desktop.mp4"
optimizeVideo "desktop.temp.mp4" "$DESKTOP_OUTPUT_MP4"

echo -e "\e[96m\n> Optimizing mobile (720p) version...\n\e[0m"

MOBILE_OUTPUT_MP4="${OUTPUT%.mp4}__mobile.mp4"
optimizeVideo "mobile.temp.mp4" "$MOBILE_OUTPUT_MP4"

# Convert optimized videos to WebM
echo -e "\e[96m\n> Converting desktop (1080p) version to WebM...\n\e[0m"

DESKTOP_OUTPUT_WEBM="${DESKTOP_OUTPUT_MP4%.mp4}.webm"
ffmpeg -i "$DESKTOP_OUTPUT_MP4" -c:v libvpx-vp9 -crf 30 -b:v 0 -cpu-used 4 -row-mt 1 -c:a libopus -b:a 128k -ac 2 "$DESKTOP_OUTPUT_WEBM"

echo -e "\e[96m\n> Converting mobile (720p) version to WebM...\n\e[0m"

MOBILE_OUTPUT_WEBM="${MOBILE_OUTPUT_MP4%.mp4}.webm"
ffmpeg -i "$MOBILE_OUTPUT_MP4" -c:v libvpx-vp9 -crf 30 -b:v 0 -cpu-used 4 -row-mt 1 -c:a libopus -b:a 128k -ac 2 "$MOBILE_OUTPUT_WEBM"

# Remove temporary files
rm -f "desktop.temp.mp4" "mobile.temp.mp4"

# Print success
bytesToMB() {
	local size=$(du -b "$1" | cut -f1 | awk '{print $1 / 1024 / 1024}')
	printf "%.2f MB\n" "$size"
}

echo -e "\e[32m\n> The video has been successfully downloaded and processed:\e[0m\n"

echo "> \"$(realpath "$DESKTOP_OUTPUT_MP4")\" (1080p) [~$(bytesToMB "$DESKTOP_OUTPUT_MP4")]"
echo -e "> \"$(realpath "$DESKTOP_OUTPUT_WEBM")\" (1080p) [~$(bytesToMB "$DESKTOP_OUTPUT_WEBM")]\n"

echo "> \"$(realpath "$MOBILE_OUTPUT_MP4")\" (720p) [~$(bytesToMB "$MOBILE_OUTPUT_MP4")]"
echo -e "> \"$(realpath "$MOBILE_OUTPUT_WEBM")\" (720p) [~$(bytesToMB "$MOBILE_OUTPUT_WEBM")]\n"
