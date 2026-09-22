#!/bin/bash
# render.sh <file.docx|file.pptx> <prefix> [dpi]
set -e
D=/home/user/TBB/client-deliverables/ascend-family-vault
SRC="$1"; PREFIX="${2:-page}"; DPI="${3:-100}"
OUT=/tmp/vgp-render; rm -rf $OUT /tmp/lo-run; mkdir -p $OUT
soffice --headless --norestore -env:UserInstallation=file:///tmp/lo-run \
  --convert-to pdf --outdir $OUT "$SRC" >/dev/null 2>&1
PDF="$OUT/$(basename "${SRC%.*}").pdf"
pdftoppm -jpeg -r $DPI "$PDF" "$OUT/$PREFIX"
ls -1 $OUT/$PREFIX-*.jpg
