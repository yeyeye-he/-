"""将 static/img/personas/*.png 中的「展板式近白底」转为透明。

小人图常为透明外框 + 中央一块不透明白底；四角已为透明时无法用角点泛洪，
故采用：高亮度且低色散（近似灰白）的像素视为底，整图扫描去底。

维护：改阈值后对本目录所有 *.png 重跑即可。"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


def remove_near_white_canvas(
    im: Image.Image,
    *,
    min_alpha: int = 128,
    min_channel: int = 246,
    max_chroma: int = 10,
) -> int:
    """将「够亮且几乎无色相」的像素 alpha 置 0。返回透明化像素数。"""
    w, h = im.size
    px = im.load()
    cleared = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < min_alpha:
                continue
            lo, hi = min(r, g, b), max(r, g, b)
            if lo >= min_channel and (hi - lo) <= max_chroma:
                px[x, y] = (r, g, b, 0)
                cleared += 1
    return cleared


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    folder = root / "static" / "img" / "personas"
    if not folder.is_dir():
        print("missing", folder, file=sys.stderr)
        return 1
    total = 0
    for path in sorted(folder.glob("*.png")):
        im = Image.open(path).convert("RGBA")
        n = remove_near_white_canvas(im)
        im.save(path, "PNG", optimize=True)
        print(f"{path.name}: cleared {n} px")
        total += n
    print("total pixels cleared:", total)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
