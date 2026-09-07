from PIL import Image

SRC = "assets/reunion-centerpiece.webp"
img = Image.open(SRC).convert("RGB")
W, H = img.size
target_w, target_h = 1200, 630
ratio = target_w / target_h

# Source is portrait -> crop band of height = W / ratio
band_h = round(W / ratio)  # ~570
print(f"source {W}x{H}, band height {band_h}")

candidates = {
    "t060": 0.105,
    "t090": 0.157,
    "t130": 0.227,
}
for name, frac in candidates.items():
    top = round((H - band_h) * frac)
    crop = img.crop((0, top, W, top + band_h))
    out = crop.resize((target_w, target_h), Image.Resampling.LANCZOS)
    out.save(f"/tmp/crop_{name}.jpeg", "JPEG", quality=90)
    print(name, "top=", top, "->", f"/tmp/crop_{name}.jpeg")
