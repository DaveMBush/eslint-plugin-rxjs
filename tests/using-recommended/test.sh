#!/bin/bash

# Exit on error
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

# Run ESLint with the specific config and test file
if pnpm eslint --config $SCRIPT_DIR/eslint.config.js $SCRIPT_DIR/sample.ts; then
    echo -e "\n✅ Linting PASSED"
else
    echo -e "\n❌ Linting FAILED"
    exit 1
fi
