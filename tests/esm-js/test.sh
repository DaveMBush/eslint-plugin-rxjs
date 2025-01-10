#!/bin/bash

# Exit on any error
set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$SCRIPT_DIR/../.."

# Define source and destination paths relative to root
SRC_DIR="$ROOT_DIR/dist/packages/eslint-plugin-rxjs"
DEST_DIR="$ROOT_DIR/node_modules/@smarttools/eslint-plugin-rxjs"

# Check if source directory exists
if [ ! -d "$SRC_DIR" ]; then
    echo "Error: Source directory $SRC_DIR does not exist"
    exit 1
fi

# Create destination parent directory if it doesn't exist
mkdir -p "$(dirname "$DEST_DIR")"

# Remove destination directory if it exists
if [ -d "$DEST_DIR" ]; then
    rm -rf "$DEST_DIR"
fi

# Copy the directory
if cp -r "$SRC_DIR" "$DEST_DIR"; then
    echo "✓ Successfully copied $SRC_DIR to $DEST_DIR"
else
    echo "✗ Failed to copy directory"
    exit 1
fi

# Run the index.js file
echo "Running index.js..."
if node "$SCRIPT_DIR/index.js"; then
    echo "✓ Tests completed successfully"
    exit 0
else
    echo "✗ Tests failed"
    exit 1
fi


