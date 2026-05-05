# 十六型人格 · 16Personalities 画风（参考）— AI 出图规范

> **重要**：风格可对齐 [16Personalities](https://www.16personalities.com/) 常见的**低多边形、分面填色、四色阵营、道具化身份**，但**角色轮廓与道具组合必须原创**，不可描图、拼贴或微调官方小人，避免版权与商标风险。  
> 若有对标截图可自行保存为 `dramati/docs/reference-16personalities-style.png`（仅作本地对色与构图 mood board；**仓库默认不包含**，避免误传版权素材）。

---

## 一、画风关键词（每条提示前整段复制）

**英文主 prompt（推荐贴 Midjourney / DALL·E / 即梦）：**

```
Single original character, full body, centered, pure white background, flat vector illustration, low-poly geometric style with sharp angular facets on clothing and hair, no smooth gradients only flat color fills, minimalist face with two small black dot eyes and simple black line eyebrows and tiny mouth, no nose, chibi proportions slightly tall, one clear symbolic prop related to theater, editorial infographic quality, inspired by modern personality-test avatar aesthetics, NOT copying any existing trademarked character, crisp edges, high contrast shadows as flat darker polygons not airbrush
```

**负面 / 约束（可追加）：**

```
no text, no watermark, no logo, no MBTI letters, not the official 16personalities character designs, no photorealistic skin
```

---

## 二、四色阵营（与 DRAMA-TI 代号前缀绑定）

与 16P 的紫 / 绿 / 蓝 / 黄**气质类比**（非 MBTI 理论对应，仅为**上色分区**方便批量出图）：

| 代号前两字母 | 阵营（类比） | 主色（填大块面） | 辅色（阴影分面） |
|--------------|--------------|------------------|------------------|
| **IC** | 经典 + 沉浸 → 偏「绿区」气质 | `#33A474` | `#267A5A` |
| **IE** | 前沿 + 沉浸 → 偏「黄区」气质 | `#E7AE30` | `#C49220` |
| **BC** | 经典 + 间离 → 偏「蓝区」气质 | `#4298B4` | `#2F7A92` |
| **BE** | 前沿 + 间离 → 偏「紫区」气质 | `#88619F` | `#6B4A82` |

后两维 **ST/SG/QT/QG** 只影响**道具与姿态**，不改变上述**主色分区**（保证同一「前缀族」视觉统一，又和 16P 的四色矩阵一致感）。

---

## 三、十六型：主色 + 道具 + 整句提示（英文一条出一张）

将「**画风关键词**」整段 + 下表第三列拼成一条即可。

| 代号 | 昵称 | 追加（英文，接在画风段后） |
|------|------|------------------------------|
| ICST | 哭完还要拉群复盘侠 | Green family hexrgb(50, 163, 116) dominant, character in angular folded cloak facets, one large theatrical tear as blue polygon, holding scroll with tragedy mask silhouette, arms lifted emotional low-poly pose |
| ICSG | 古典场里也能蹦迪型 | Same green palette, body facets suggesting formal coat, golden low-poly spotlight cone behind head, tiny column pedestal as geometric blocks at feet |
| ICQT | 一个人啃大部头的独狼 | Green palette, oversized open book made of 3–4 rectangular facets blocking part of body, hood angular polygons, standing still solitary |
| ICQG | 嘴上淡定心里有导筒 | Green palette, calm straight posture, dashed L-shaped bracket polygons suggesting viewfinder around head, small flat camera icon as diamond shape on chest |
| IEST | 当代台词上瘾患者 | Yellow family #E7AE30 dominant, sharp triangular speech bubble near mouth like shard, edgy asymmetrical hair facets, contemporary jacket polygons |
| IESG | 被舞美灯效收割型 | Yellow palette, strong upward triangular light beams in pale yellow polygons, character looking up, body slightly back low-poly |
| IEQT | 先锋独自美丽选手 | Yellow palette, lone walking pose, one five-pointed star facet above shoulder, abstract experimental costume mixed polygons |
| IEQG | 安静逛展式看戏人 | Yellow palette, floating rectangular empty frames as thin polygons around figure, gallery calm stance, minimal props |
| BCST | 边哭边查出处型 | Teal family #4298B4 dominant, small tear facet, tiny stacked paper polygons as footnotes near hand, still holding booklet |
| BCSG | 论文格式配低音炮 | Teal palette, circular headphone bands as simplified arcs, sound wave as zigzag polygon strip, scholarly vest facets |
| BCQT | 写很多、发很少型 | Teal palette, closed book/diary thick rectangular facets hugged to chest, slightly hunched private posture |
| BCQG | 冷静拆台但腿软型 | Teal palette, vertical composition split: left half clothing slightly darker teal polygons, right half lighter, subtle awkward stance |
| BEST | 新戏逻辑纠察队 | Purple family #88619F dominant, abstract gavel or balance beam as blocky polygons at waist height, assertive pointing hand facet |
| BESG | 导演动机挖掘机 | Purple palette, magnifying glass as hexagon + handle polygon, leaning forward investigative low-poly legs |
| BEQT | 只在心里打分的潜水王 | Purple palette, large empty thought bubble oval as outline polygon below, figure small above waterline metaphor subtle |
| BEQG | 「谁在讲故事」课代表 | Purple palette, nested square frames decreasing size behind character, peeking from inner frame, meta narrative vibe |

---

## 四、中文短说明（给美工 / 自己备忘）

- **脸**：两点眼 + 线眉 + 小口，不要鼻子。  
- **身体**：衣服、头发全用**硬边多边形**拼，拒绝渐变_mesh 脸。  
- **背景**：纯白或极浅灰，方便抠图做结果页。  
- **一张一型**：方图 1:1，文件名与代号一致，便于替换网页资源。

---

## 五、站内资源

| 文件 | 说明 |
|------|------|
| `static/img/personas.svg` | **矢量兜底**：PNG 加载失败时结果页仍用 `<use>` 引用 |
| `static/img/personas/{ICST…BEQG}.png` | **十六型 AI 出图**（低多边形体块 + 四色前缀），结果页优先 `<img src="…">`；**导出时请透明底**，若模型仍带出白块可本地跑 `dramati/tools/remove_persona_white_bg.py`（需安装 Pillow）批量去近白底 |
| `static/img/sample-ICST-lowpoly.png` | **ICST 绿区**单张 AI 试跑示例（非定稿），用于对齐参数；见第六节 |
| `docs/reference-16personalities-style.png` | **可选**：自行放入的风格参考（勿描官方稿、勿商用官方图）；仓库默认无此文件 |
| `static/img/persona-style-reference-4x4.png` | **可选**：若本地曾生成过早期 mood board 可保留，否则可忽略 |

结果页已实现：**优先** `/static/img/personas/{代号}.png`，失败则回退 `personas.svg`（见 `index.html` / `app.js`）。

## 六、单张 AI 试跑示例（ICST 绿区）

路径：`static/img/sample-ICST-lowpoly.png`（已入库）。与第三节「ICST」条英文追加描述 + 主 prompt 同风格试生成，可作跑图参数微调参考。

---

## 七、相关文档

- 产品总纲、四维十六型、题库分组、**十五维观剧心理说明**与 Web API 说明：仓库根目录 `欧美戏剧人格测试-内容与题库设计.md`（以 `dramati/questions_bank.py` 与 `app.py` 为定稿依据）。
