#!/bin/bash

# 1. Identify current theme name
old_theme=$(basename "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)")
echo "Current theme name: $old_theme"

# 2. Ask for new theme name
echo "Enter new theme machine name (e.g., new_theme):"
read new_theme

if [ -z "$new_theme" ]; then
  echo "Error: New theme name cannot be empty."
  exit 1
fi

# Define paths relative to the script location
# Assuming script is in themes/custom/old_theme/scripts/
script_dir=$(dirname "$(readlink -f "$0")")
old_theme_dir=$(realpath "$script_dir/..")
parent_dir=$(realpath "$old_theme_dir/..")
new_theme_dir="$parent_dir/$new_theme"

echo "Target directory: $new_theme_dir"

# 3. Create new theme directory and copy files
echo "Copying files (excluding junk and logs)..."
rsync -av \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='storybook-static' \
  "$old_theme_dir/" "$new_theme_dir/"

# 4. Rename core theme files (.info.yml, .theme, etc.)
echo "Renaming core files..."
find "$new_theme_dir" -maxdepth 1 -name "$old_theme.*" | while read -r file; do
    new_file="${file/$old_theme/$new_theme}"
    mv "$file" "$new_file"
done

# 5. Global search and replace (SDC namespaces, paths, etc.)
# Using ":" as delimiter for safe path handling
echo "Updating references and SDC namespaces..."
LC_ALL=C find "$new_theme_dir" \
  -type d \( -name "node_modules" -o -name "dist" -o -name ".git" \) -prune -o \
  -type f \( -name "*.yml" -o -name "*.twig" -o -name "*.js" -o -name "*.theme" -o -name "*.scss" -o -name "*.json" \) \
  -exec sed -i "" "s:$old_theme:$new_theme:g" {} \;

# 6. Specifically update package.json name field
if [ -f "$new_theme_dir/package.json" ]; then
  echo "Updating package.json theme name..."
  # This targets the "name": "theme" line specifically
  LC_ALL=C sed -i "" "s:\"name\"\: \"$old_theme\":\"name\"\: \"$new_theme\":g" "$new_theme_dir/package.json"
fi

# 7. Post-rename cleanup (Vite cache)
if [ -d "$new_theme_dir/node_modules" ]; then
  echo "Clearing Vite/NPM cache in the new folder..."
  rm -rf "$new_theme_dir/node_modules/.vite"
fi

echo "------------------------------------------------"
echo "Success! Theme '$old_theme' renamed to '$new_theme'."
echo "Location: $new_theme_dir"
echo ""
echo "Next steps:"
echo "1. cd $new_theme_dir"
echo "2. npm install (to refresh dependencies)"
echo "3. drush cr (to register new SDC namespace)"
echo "------------------------------------------------"
