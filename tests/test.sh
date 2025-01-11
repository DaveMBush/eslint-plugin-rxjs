#!/bin/bash

# Exit on error
set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Initialize counters
TOTAL_TESTS=2
PASSED_TESTS=0
FAILED_TESTS=0
FAILED_NAMES=()

# Function to run a test and track its result
function run_test() {
    local test_name=$1
    local test_path=$2

    echo -e "\n📋 Running test: $test_name"
    if bash "$test_path"; then
        echo "✅ $test_name passed"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "❌ $test_name failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_NAMES+=("$test_name")
    fi
}

# Run each test
run_test "ESM JS Tests" "$SCRIPT_DIR/esm-js/test.sh"
run_test "Using Recommended Tests" "$SCRIPT_DIR/using-recommended/test.sh"

# Print summary report
echo -e "\n📊 Test Summary Report"
echo "======================="
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

if [ ${#FAILED_NAMES[@]} -ne 0 ]; then
    echo -e "\n❌ Failed Tests:"
    for name in "${FAILED_NAMES[@]}"; do
        echo "- $name"
    done
    exit 1
fi

echo -e "\n✨ All tests passed!"
exit 0
