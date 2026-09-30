import os
import glob
import re

report = []
report.append("==================================================")
report.append("      DEEP DIVE ASSET & PERFORMANCE INSPECTION    ")
report.append("==================================================")

# 1. IMAGE FILE SIZES (Assets & Images)
report.append("\n[1] IMAGE ASSET SIZES (> 300 KB):")
large_images = []
all_images = glob.glob("assets/**/*.*", recursive=True) + glob.glob("images/**/*.*", recursive=True)
for img in all_images:
    if any(img.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']):
        sz = os.path.getsize(img) / 1024 # KB
        if sz > 300:
            large_images.append((img, sz))

large_images.sort(key=lambda x: x[1], reverse=True)
for img, sz in large_images:
    report.append(f"  * {img}: {sz:.1f} KB")
if not large_images:
    report.append("  * None over 300 KB.")

# 2. FONT LOADING & PRECONNECT
report.append("\n[2] FONT PRECONNECT & DISPLAY SWAP:")
for hf in sorted(glob.glob("*.html")):
    with open(hf, "r", encoding="utf-8") as f:
        c = f.read()
    has_preconnect = 'rel="preconnect"' in c
    has_display_swap = 'display=swap' in c
    report.append(f"  * {hf}: Preconnect: {'[YES]' if has_preconnect else '[NO]'} | display=swap: {'[YES]' if has_display_swap else '[NO]'}")

# 3. CONTACT CHANNELS (Email, Phone, Location)
report.append("\n[3] CONTACT & COMMERCE CHANNELS:")
for hf in sorted(glob.glob("*.html")):
    with open(hf, "r", encoding="utf-8") as f:
        c = f.read()
    emails = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', c)
    tels = re.findall(r'tel:[^\s"\'>]+', c)
    has_email = len(emails) > 0
    has_tel = len(tels) > 0
    report.append(f"  * {hf}: Email references: {set(emails) if emails else '[None]'} | tel: links: {set(tels) if tels else '[None]'}")

# 4. SCRIPT LOADING OPTIMIZATION (defer / async)
report.append("\n[4] SCRIPT LOADING (defer/async):")
for hf in sorted(glob.glob("*.html")):
    with open(hf, "r", encoding="utf-8") as f:
        c = f.read()
    scripts = re.findall(r'<script\s+[^>]*src=["\']([^"\']+)["\'][^>]*>', c)
    raw_script_tags = re.findall(r'<script\s+[^>]*src=[^>]*>', c)
    sync_scripts = [s for s in raw_script_tags if 'defer' not in s and 'async' not in s and 'type="module"' not in s]
    report.append(f"  * {hf}: {len(scripts)} external scripts, {len(sync_scripts)} render-blocking without defer/async")

with open("scratch/deep_dive_report.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(report))

print("Deep dive report written to scratch/deep_dive_report.txt")
