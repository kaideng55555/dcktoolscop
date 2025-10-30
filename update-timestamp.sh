#!/usr/bin/env bash
# Updates/injects the build fingerprint in index.html (UTC ISO 8601)
# - Ensures <meta name="build:timestamp" ...> exists in <head>
# - Ensures a small visible badge exists before </body> (id="build-fingerprint")
# Usage: ./update-timestamp.sh [index.html]
set -euo pipefail

FILE="${1:-index.html}"
if [[ ! -f "$FILE" ]]; then
  echo "Error: '$FILE' not found" >&2
  exit 1
fi

ISO="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
has_gnu_sed() { sed --version >/dev/null 2>&1; }

# 1) ensure/update meta tag in <head>
if grep -q '<meta name="build:timestamp"' "$FILE"; then
  if has_gnu_sed; then
    sed -E -i 's|(<meta name="build:timestamp" content=")[^"]*(" ?/?>)|\1'"$ISO"'\2|' "$FILE"
  else
    sed -E -i '' 's|(<meta name="build:timestamp" content=")[^"]*(" ?/?>)|\1'"$ISO"'\2|' "$FILE"
  fi
else
  awk -v iso="$ISO" '
    BEGIN{ inserted=0 }
    /<\/head>/ && !inserted {
      print "  <!-- Build fingerprint (ISO 8601 UTC). Updated by update-timestamp.sh -->";
      print "  <meta name=\"build:timestamp\" content=\"" iso "\" />";
      print "  <!-- /Build fingerprint -->";
      inserted=1
    }
    { print }
    END{
      if(!inserted){
        print "  <!-- Build fingerprint (ISO 8601 UTC). Updated by update-timestamp.sh -->";
        print "  <meta name=\"build:timestamp\" content=\"" iso "\" />";
        print "  <!-- /Build fingerprint -->";
      }
    }
  ' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
fi

# 2) ensure the visible badge exists
if ! grep -q 'id="build-fingerprint"' "$FILE"; then
  awk '
    BEGIN{ injected=0 }
    /<\/body>/ && !injected {
      print "  <!-- Build fingerprint badge -->";
      print "  <div id=\"build-fingerprint\" aria-label=\"Build fingerprint\"></div>";
      print "  <script>";
      print "  (function () {";
      print "    var meta = document.querySelector(\"meta[name=\\\"build:timestamp\\\"]\");";
      print "    var iso = meta && meta.content && meta.content !== \"__BUILD_ISO__\" ? meta.content : null;";
      print "    var dt = iso ? new Date(iso) : (document.lastModified ? new Date(document.lastModified) : new Date());";
      print "    if (isNaN(dt.getTime())) dt = new Date();";
      print "    var pad = function (n) { return String(n).padStart(2, \"0\"); };";
      print "    var pretty = \"v\" + dt.getUTCFullYear() + \".\" + pad(dt.getUTCMonth()+1) + \".\" + pad(dt.getUTCDate()) + \".\" + pad(dt.getUTCHours()) + \":\" + pad(dt.getUTCMinutes());";
      print "    var el = document.getElementById(\"build-fingerprint\");";
      print "    if (el) el.textContent = pretty;";
      print "  })();";
      print "  </script>";
      print "  <style>";
      print "  #build-fingerprint{ position: fixed; right: 12px; bottom: 10px; z-index: 9999;";
      print "    font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;";
      print "    background: rgba(0,0,0,0.5); color: #b7ff00; padding: 4px 8px; border-radius: 4px;";
      print "    box-shadow: 0 0 8px rgba(183,255,0,0.5); opacity: .3; transition: opacity .2s ease, transform .2s ease; pointer-events: none; }";
      print "  #build-fingerprint:hover{ opacity: .7; transform: translateY(-1px); }";
      print "  </style>";
      print "  <!-- /Build fingerprint badge -->";
      injected=1;
    }
    { print }
  ' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
fi

echo "Updated build timestamp to: $ISO"
