import glob
import re

print("=== CHECKING FOR INLINE URL STYLES IN ALL HTML FILES ===")
for f in sorted(glob.glob('*.html')):
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    matches = re.findall(r'style="[^"]*url\([^)]+\)[^"]*"', c)
    print(f"{f}: {len(matches)} inline url styles")
    for m in matches:
        print("  ", m)

print("\n=== CHECKING WATERMARK ELEMENT IN ALL HTML FILES ===")
for f in sorted(glob.glob('*.html')):
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    has_wm = 'bg-pattern-watermark' in c
    print(f"{f}: bg-pattern-watermark present = {has_wm}")
