import glob
import os
import re

report = []
report.append("==================================================")
report.append("       MODORIA PLATFORM COMPREHENSIVE AUDIT       ")
report.append("==================================================")

html_files = sorted(glob.glob("*.html"))

# 1. SEO, HEAD, FAVICON, OPEN GRAPH
report.append("\n[1] SEO, META TAGS & HEAD CHECKS:")
for hf in html_files:
    with open(hf, "r", encoding="utf-8") as f:
        c = f.read()
    
    title_m = re.search(r"<title>([^<]+)</title>", c)
    desc_m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', c, re.I)
    viewport_m = 'name="viewport"' in c
    charset_m = 'charset=' in c
    favicon_m = 'rel="icon"' in c or 'rel="shortcut icon"' in c
    og_title_m = 'property="og:title"' in c or 'name="og:title"' in c
    og_image_m = 'property="og:image"' in c or 'name="og:image"' in c
    canonical_m = 'rel="canonical"' in c
    
    report.append(f"\n  * File: {hf}")
    report.append(f"    - Title: {title_m.group(1).strip() if title_m else '[MISSING]'}")
    report.append(f"    - Meta Description: {'[YES]' if desc_m else '[MISSING]'}")
    report.append(f"    - Charset & Viewport: {'[YES]' if (charset_m and viewport_m) else '[INCOMPLETE]'}")
    report.append(f"    - Favicon Link: {'[YES]' if favicon_m else '[MISSING favicon reference]'}")
    report.append(f"    - OpenGraph (Title/Image): {'[YES]' if (og_title_m and og_image_m) else '[Incomplete OG tags]'}")
    report.append(f"    - Canonical Link: {'[YES]' if canonical_m else '[MISSING canonical tag]'}")

# 2. INTERNAL NAVIGATION & LINK INTEGRITY
report.append("\n[2] INTERNAL NAVIGATION & LINK INTEGRITY:")
for hf in html_files:
    with open(hf, "r", encoding="utf-8") as f:
        c = f.read()
    links = re.findall(r'href=["\']([^"\']+)["\']', c)
    broken = []
    for l in links:
        if l.startswith("#") or l.startswith("http") or l.startswith("mailto:") or l.startswith("tel:"):
            continue
        base_link = l.split("?")[0].split("#")[0]
        if base_link and not os.path.exists(base_link):
            broken.append(l)
    if broken:
        report.append(f"  [ERROR] Broken links in {hf}: {broken}")
    else:
        report.append(f"  [OK] All internal links in {hf} resolve to existing files.")

# 3. IMAGES & ALT TAGS AUDIT
report.append("\n[3] IMAGE ASSETS & ACCESSIBILITY (ALT ATTRIBUTES):")
for hf in html_files:
    with open(hf, "r", encoding="utf-8") as f:
        c = f.read()
    img_tags = re.findall(r'<img\s+[^>]*>', c)
    missing_alt = []
    broken_src = []
    for img in img_tags:
        src_m = re.search(r'src=["\']([^"\']+)["\']', img)
        alt_m = re.search(r'alt=["\']([^"\']*)["\']', img)
        if not alt_m or not alt_m.group(1).strip():
            missing_alt.append(img[:60])
        if src_m:
            src = src_m.group(1)
            if not src.startswith("http") and not src.startswith("data:") and not os.path.exists(src):
                broken_src.append(src)
    report.append(f"  * {hf}: {len(img_tags)} images, {len(missing_alt)} missing/empty alt, {len(broken_src)} broken image src")
    if broken_src:
        report.append(f"    [ERROR] Broken img sources: {broken_src}")

# 4. CRITICAL BRAND PILLARS & CONCIERGE INTEGRITY
report.append("\n[4] BRAND PILLARS & CONCIERGE:")
for hf in html_files:
    with open(hf, "r", encoding="utf-8") as f:
        c = f.read()
    has_wa = "+254 707 816 111" in c or "254707816111" in c
    has_countywide = "County" in c or "counties" in c or "COUNTYWIDE" in c
    has_b = "Branding" in c or "BRANDING" in c
    has_p = "Printing" in c or "PRINTING" in c
    has_m = "Marketing" in c or "MARKETING" in c
    has_personal = "Fathy" in c or "Faiz" in c
    
    report.append(f"  * {hf}: WA Concierge: {'[OK]' if has_wa else '[MISSING]'} | 3 Pillars: {'[OK]' if (has_b and has_p and has_m) else '[MISSING]'} | Countywide: {'[OK]' if has_countywide else '[MISSING]'} | Personal Names: {'[CLEAN]' if not has_personal else '[FOUND PERSONAL NAME]'}")

# 5. TECHNICAL WEB INFRASTRUCTURE
report.append("\n[5] TECHNICAL WEB INFRASTRUCTURE:")
report.append(f"  * robots.txt: {'[EXISTS]' if os.path.exists('robots.txt') else '[MISSING - recommended for SEO crawlers]'}")
report.append(f"  * sitemap.xml: {'[EXISTS]' if os.path.exists('sitemap.xml') else '[MISSING - recommended for Google indexing]'}")
report.append(f"  * 404.html: {'[EXISTS]' if os.path.exists('404.html') else '[MISSING - recommended for broken link fallback]'}")
report.append(f"  * site.webmanifest: {'[EXISTS]' if os.path.exists('site.webmanifest') else '[MISSING - recommended for PWA/mobile bookmarks]'}")

with open("scratch/audit_report.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(report))

print("Audit report written to scratch/audit_report.txt")
