# server/scoring.py

import re

# A small list of common action verbs
ACTION_VERBS = {
    "led", "developed", "designed", "implemented", "built", "managed",
    "coordinated", "improved", "optimized", "launched", "reduced", "increased",
    "created", "engineered", "deployed", "analyzed", "researched", "collaborated"
}

# Section headers to look for (lowercased)
SECTION_HEADERS = {
    "Summary":    ["summary", "profile", "objective"],
    "Education":  ["education", "academic", "school", "university", "degree"],
    "Experience": ["experience", "work experience", "internship", "employment"],
    "Projects":   ["project", "projects", "portfolio"],
    "Skills":     ["skills", "technical skills"]
}


def split_sections(text: str) -> dict:
    """
    Naively splits the resume text into sections based on header keywords.
    Returns a dict: { section_name: section_text }
    """
    lines = text.splitlines()
    sections = {sec: "" for sec in SECTION_HEADERS}
    current = None

    for line in lines:
        low = line.strip().lower()
        # detect header
        for sec, keys in SECTION_HEADERS.items():
            if any(low.startswith(k) for k in keys):
                current = sec
                break
        else:
            # if we're already in a section, append line
            if current:
                sections[current] += line + "\n"

    return sections


def compute_score_for_section(content: str) -> int:
    """
    Given the raw text of a section, compute a 0-10 score based on:
      1) Presence (any text?) → up to 2 points
      2) Word count → up to 3 points
      3) Quant metrics (# of '%' or numbers) → up to 3 points
      4) Action verbs count → up to 2 points
    """
    txt = content.strip()
    if not txt:
        return 0

    # 1) Presence
    score = 2

    # 2) Word count
    words = txt.split()
    wc = len(words)
    # give 0→3 points for word counts between 0 and 600 words
    score += min(wc / 200, 3)

    # 3) Quantifiable metrics
    # count occurrences of percentages or standalone numbers
    metrics = len(re.findall(r"\b\d+%|\b\d{2,}\b", txt))
    # cap at 3 points
    score += min(metrics, 3)

    # 4) Action verbs
    verbs_found = sum(1 for v in ACTION_VERBS if re.search(rf"\b{v}\b", txt.lower()))
    # cap at 2 points
    score += min(verbs_found, 2)

    # normalize to 0–10
    return int(round(min(score, 10)))


def smart_score_resume(text: str) -> dict:
    """
    Splits the resume into sections and scores each from 0 to 10.
    """
    sections = split_sections(text)
    scores = {}
    for sec_name, sec_text in sections.items():
        scores[sec_name] = compute_score_for_section(sec_text)
    return scores

score_resume = smart_score_resume