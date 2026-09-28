import glob
import re

print("=== HTML FILES ===")
for fpath in sorted(glob.glob("*.html")):
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"\n--- {fpath} ---")
    for m in re.finditer(r'(<section[^>]*>|<div[^>]*class="[^"]*(?:bg|slide|obs-section|hero)[^"]*"[^>]*>)', content):
        print("  ", m.group(1))

print("\n=== CSS RULES WITH url( ===")
with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

for m in re.finditer(r'([^{]+)\{([^}]+url\([^)]+\)[^}]*)\}', css):
    sel = m.group(1).strip()
    body = m.group(2).strip()
    if 'url(' in body:
        print(f"Selector: {sel}\n  Body: {body}\n")
