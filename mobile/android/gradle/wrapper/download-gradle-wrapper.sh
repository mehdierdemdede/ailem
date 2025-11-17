#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WRAPPER_JAR="$ROOT_DIR/gradle-wrapper.jar"
PROPERTIES_FILE="$ROOT_DIR/gradle-wrapper.properties"

if [[ -f "$WRAPPER_JAR" ]]; then
  echo "Gradle wrapper JAR already exists at $WRAPPER_JAR"
  exit 0
fi

if [[ ! -f "$PROPERTIES_FILE" ]]; then
  echo "Cannot find gradle-wrapper.properties at $PROPERTIES_FILE" >&2
  exit 1
fi

distribution_url=$(grep '^distributionUrl=' "$PROPERTIES_FILE" | cut -d'=' -f2- | sed 's|\\:|:|g')
if [[ -z "$distribution_url" ]]; then
  echo "Unable to read distributionUrl from gradle-wrapper.properties" >&2
  exit 1
fi

tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT

zip_path="$tmp_dir/gradle-distribution.zip"

echo "Downloading Gradle distribution from $distribution_url ..."
curl -L "$distribution_url" -o "$zip_path"

extract_dir="$tmp_dir/extract"
mkdir -p "$extract_dir"
unzip -q "$zip_path" -d "$extract_dir"

wrapper_jar_path=$(find "$extract_dir" -path "*/gradle/wrapper/gradle-wrapper.jar" | head -n 1)
if [[ -z "$wrapper_jar_path" ]]; then
  echo "Could not locate gradle-wrapper.jar inside downloaded distribution" >&2
  exit 1
fi

cp "$wrapper_jar_path" "$WRAPPER_JAR"
echo "Saved Gradle wrapper JAR to $WRAPPER_JAR"
