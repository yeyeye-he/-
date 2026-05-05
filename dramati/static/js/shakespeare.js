(() => {
  const $ = (id) => document.getElementById(id);

  const elIntro = $("screen-intro");
  const elQuiz = $("screen-quiz");
  const elResult = $("screen-result");

  const LETTERS = ["A", "B", "C", "D"];
  const GROUP = "shakespeare";

  let meta = {};
  let questions = [];
  let answers = [];
  let index = 0;

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function loadMeta() {
    const r = await fetch("/api/meta");
    meta = await r.json();
    const d = $("app-disclaimer");
    if (d) d.textContent = meta.disclaimer || "";
  }

  async function loadQuestions() {
    const r = await fetch(`/api/questions?group=${encodeURIComponent(GROUP)}`);
    const data = await r.json();
    questions = data.questions || [];
    answers = Array(questions.length).fill(null);
    index = 0;
    $("q-total").textContent = String(questions.length);
  }

  function show(el) {
    [elIntro, elQuiz, elResult].forEach((x) => x.classList.add("hidden"));
    el.classList.remove("hidden");
    scrollTop();
  }

  function setProgressA11y(pct) {
    const bar = $("progress-a11y");
    if (bar) bar.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  function renderQuestion() {
    const q = questions[index];
    const n = questions.length;
    $("q-current").textContent = String(index + 1);
    const pct = ((index + 1) / n) * 100;
    $("progress-bar").style.width = `${pct}%`;
    setProgressA11y(pct);
    $("q-prompt").textContent = q.prompt;
    const opts = $("q-options");
    opts.innerHTML = "";
    q.options.forEach((op, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.setAttribute("role", "option");
      b.setAttribute("aria-selected", answers[index] === i ? "true" : "false");
      if (answers[index] === i) b.classList.add("selected");

      const badge = document.createElement("span");
      badge.className = "opt-badge";
      badge.textContent = LETTERS[i] || String(i + 1);

      const span = document.createElement("span");
      span.className = "opt-text";
      span.textContent = op.text;

      b.appendChild(badge);
      b.appendChild(span);

      b.addEventListener("click", () => {
        answers[index] = i;
        Array.from(opts.children).forEach((c) => {
          c.classList.remove("selected");
          c.setAttribute("aria-selected", "false");
        });
        b.classList.add("selected");
        b.setAttribute("aria-selected", "true");
        $("btn-next").disabled = false;
      });
      opts.appendChild(b);
    });
    $("btn-prev").disabled = index === 0;
    $("btn-next").disabled = answers[index] === null;
    if (index === n - 1) {
      $("btn-next").textContent = "提交并看我是哪种看戏人";
    } else {
      $("btn-next").textContent = "下一题";
    }
  }

  function renderAxisTags(tags) {
    const host = $("axis-tags");
    host.innerHTML = "";
    (tags || []).forEach((t) => {
      const pill = document.createElement("div");
      pill.className = "axis-pill";
      const c = document.createElement("code");
      c.textContent = t.code || "";
      const strong = document.createElement("strong");
      strong.textContent = t.title || "";
      const hint = document.createElement("span");
      hint.textContent = t.hint || "";
      pill.appendChild(c);
      pill.appendChild(strong);
      pill.appendChild(hint);
      host.appendChild(pill);
    });
  }

  function renderSubBars(rows) {
    const bars = $("sub-bars");
    bars.innerHTML = "";
    (rows || []).forEach((row) => {
      const wrap = document.createElement("div");
      wrap.className = "sub-row";
      const lab = document.createElement("div");
      lab.className = "sub-label";
      lab.textContent = row.label || "";
      const track = document.createElement("div");
      track.className = "sub-track";
      const fill = document.createElement("div");
      fill.className = "sub-fill";
      track.appendChild(fill);
      const val = document.createElement("div");
      val.className = "sub-val";
      val.textContent = String(row.percent ?? "");
      wrap.appendChild(lab);
      wrap.appendChild(track);
      wrap.appendChild(val);
      const desc = row.description;
      if (desc) {
        const p = document.createElement("p");
        p.className = "sub-desc";
        p.textContent = desc;
        wrap.appendChild(p);
      }
      bars.appendChild(wrap);
      requestAnimationFrame(() => {
        fill.style.width = `${Number(row.percent) || 0}%`;
      });
    });
  }

  async function submit() {
    const r = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group: GROUP, answers }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      alert(err.error || "提交失败");
      return;
    }
    const data = await r.json();
    const res = data.result;
    const imgFig = $("res-figure-img");
    const figUse = $("res-figure-use");
    const svgFig = $("res-figure-svg");
    const sym = /^[IB][CE][SQ][TG]$/.test(res.code) ? res.code : "UNKNOWN";
    if (figUse && svgFig) {
      const base = svgFig.dataset.sprites || "/static/img/personas.svg";
      figUse.setAttribute("href", `${base}#${sym}`);
    }
    if (imgFig && svgFig) {
      imgFig.onload = () => {
        imgFig.classList.remove("hidden");
        svgFig.classList.add("hidden");
      };
      imgFig.onerror = () => {
        imgFig.classList.add("hidden");
        svgFig.classList.remove("hidden");
      };
      if (sym === "UNKNOWN") {
        imgFig.removeAttribute("src");
        imgFig.classList.add("hidden");
        svgFig.classList.remove("hidden");
      } else {
        imgFig.alt = `${res.code} 人格小人`;
        svgFig.classList.remove("hidden");
        imgFig.classList.add("hidden");
        imgFig.src = `/static/img/personas/${sym}.png?v=3`;
        if (imgFig.complete && imgFig.naturalWidth > 0) {
          imgFig.classList.remove("hidden");
          svgFig.classList.add("hidden");
        }
      }
    }
    $("res-code").textContent = res.code;
    $("res-name").textContent = res.name;
    const rd = $("res-dramatic");
    if (rd) {
      const fig = res.dramatic_figure;
      if (fig) {
        rd.hidden = false;
        rd.textContent = `戏剧形象：${fig}`;
      } else {
        rd.hidden = true;
        rd.textContent = "";
      }
    }
    $("res-match").textContent = `「像你的程度」${res.match_percent}%（算法随便拍的，别较真）`;
    $("res-tagline").textContent = res.tagline;
    renderAxisTags(res.axis_tags);
    renderSubBars(res.sub_dimensions);
    show(elResult);
  }

  $("btn-start").addEventListener("click", async () => {
    await loadQuestions();
    show(elQuiz);
    renderQuestion();
  });

  $("btn-prev").addEventListener("click", () => {
    if (index > 0) {
      index -= 1;
      renderQuestion();
    }
  });

  $("btn-next").addEventListener("click", async () => {
    if (answers[index] === null) return;
    if (index < questions.length - 1) {
      index += 1;
      renderQuestion();
    } else {
      await submit();
    }
  });

  $("btn-restart").addEventListener("click", () => {
    show(elIntro);
  });

  loadMeta();
})();
