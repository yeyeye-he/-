"""DRAMA-TI 欧美戏剧人格测试 — Flask 入口。"""

from flask import Flask, jsonify, render_template, request

from questions_bank import (
    SUB_DESCRIPTIONS,
    SUB_LABELS,
    audience_manifest,
    axes_from_code,
    compute_scores,
    get_questions,
    get_questions_for_audience,
    get_type_meta,
)

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/shakespeare")
def shakespeare():
    """莎士比亚戏剧专题卷：独立题干，与总测共用计分与十六型结果。"""
    return render_template("shakespeare.html")


@app.route("/api/meta")
def api_meta():
    return jsonify(
        {
            "title": "DRAMA-TI",
            "subtitle": "先选对「你是谁」再答题：老现场 / 略懂行 / 心动稀客，三套题量不同，结果照样十六型。仅供玩梗。",
            "sub_labels": SUB_LABELS,
            "sub_descriptions": {str(i): SUB_DESCRIPTIONS[i] for i in range(1, 16)},
            "disclaimer": "本测试仅供娱乐与交流，不构成任何心理诊断或人格「真相」。",
            "audiences": audience_manifest(),
        }
    )


@app.route("/api/questions")
def api_questions():
    audience = request.args.get("audience")
    group = request.args.get("group")
    if audience:
        qs = get_questions_for_audience(audience)
        mode = {"kind": "audience", "id": audience}
    elif group:
        qs = get_questions(group)
        mode = {"kind": "group", "id": group}
    else:
        qs = get_questions_for_audience("fan_rare")
        mode = {"kind": "audience", "id": "fan_rare"}
    return jsonify(
        {
            "mode": mode,
            "count": len(qs),
            "questions": qs,
        }
    )


@app.route("/api/score", methods=["POST"])
def api_score():
    body = request.get_json(force=True, silent=True) or {}
    audience = body.get("audience")
    group = body.get("group")
    answers = body.get("answers")
    if not isinstance(answers, list):
        return jsonify({"error": "answers 须为非空整数数组"}), 400
    if audience:
        qs = get_questions_for_audience(audience)
    elif group:
        qs = get_questions(group)
    else:
        return jsonify({"error": "请在 body 中提供 audience 或 group"}), 400
    if len(answers) != len(qs):
        return jsonify({"error": f"需要 {len(qs)} 道题的答案，当前 {len(answers)}"}), 400
    for a in answers:
        if not isinstance(a, int) or a < 0 or a > 3:
            return jsonify({"error": "每题答案须为 0–3"}), 400
    raw = compute_scores(qs, answers)
    meta = get_type_meta(raw["code"])
    sp = raw["sub_percent"]
    subs = []
    for i in range(1, 16):
        key = f"sub{i}"
        pct = raw["sub8_index"] if i == 8 else sp[key]
        subs.append(
            {
                "id": i,
                "label": (
                    SUB_LABELS[i] + "（分数高≈更偏视觉）"
                    if i == 8
                    else SUB_LABELS[i]
                ),
                "description": SUB_DESCRIPTIONS.get(i, ""),
                "percent": pct,
                "raw": raw["sub"][key] if i != 8 else raw["sub8_index"],
            }
        )
    return jsonify(
        {
            "result": {
                "code": raw["code"],
                "name": meta["name"],
                "tagline": meta["tagline"],
                "dramatic_figure": meta.get("dramatic_figure", ""),
                "match_percent": raw["match_percent"],
                "axes": raw["axes"],
                "axis_tags": axes_from_code(raw["code"]),
                "sub_dimensions": subs,
            }
        }
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8765, debug=True)
