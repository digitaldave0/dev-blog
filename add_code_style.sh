#!/bin/bash

style_block='
<style>
pre, code {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
}
pre {
    padding: 15px !important;
    border-radius: 5px !important;
    border: 1px solid #444 !important;
}
code {
    padding: 2px 5px !important;
    border-radius: 3px !important;
}
</style>
'

for file in _posts/*.md; do
    if ! grep -q "<style>" "$file"; then
        awk -v style="$style_block" '
        /^---$/ && ++count == 2 {
            print ""
            print style
        }
        {print}' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
done
