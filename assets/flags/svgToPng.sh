#!/bin/bash

# Check if sips command is available
if ! command -v sips &>/dev/null; then
  echo "sips command not found. Please make sure it's installed."
  exit 1
fi

# Loop through all .svg files in the current directory
for file in *.svg; do
  # Skip if no .svg files are found
  [ -e "$file" ] || {
    echo "No .svg files found."
    exit 1
  }

  # Extract the filename without the extension
  filename="${file%.*}"

  # Convert the .svg file to .png format using sips
  echo "Converting $file to $filename.png..."
  /usr/bin/sips -s format png -o "${filename}.png" "$file"

  # Check if the conversion was successful
  if [ $? -eq 0 ]; then
    echo "Successfully converted $file to ${filename}.png"
  else
    echo "Failed to convert $file"
  fi
done
