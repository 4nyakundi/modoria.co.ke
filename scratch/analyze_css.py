import re

with open('css/style.css', 'r', encoding='utf-8', errors='ignore') as f:
    css = f.read()

out = []
for m in re.finditer(r'([^{]*pattern[^{]*\{[^}]+\})', css, re.IGNORECASE):
    out.append(m.group(0))

out.append("\n=== OBS SECTION BG RULES ===")
for m in re.finditer(r'(\.obs-section[^{]*\{[^}]+\}|\.bg[^{]*\{[^}]+\}|body[^{]*\{[^}]+\})', css, re.IGNORECASE):
    out.append(m.group(0))

with open('scratch/css_analysis.txt', 'w', encoding='utf-8') as out_f:
    out_f.write('\n---\n'.join(out))

print(f"Wrote {len(out)} entries to scratch/css_analysis.txt")
