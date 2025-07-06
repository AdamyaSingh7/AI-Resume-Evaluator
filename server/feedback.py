# server/feedback.py

def generate_feedback(resume_text: str, scores: dict) -> str:
    """
    For each resume section, emit a concise, actionable tip.
    """
    # Define per‐section suggestions
    SECTION_TIPS = {
        "Summary": (
            "Make your summary concise: open with your role/title, "
            "highlight your top 2 achievements using metrics, "
            "and end with your career goal."
        ),
        "Education": (
            "Strengthen Education: list your degree, institution, graduation year, "
            "and any honors, relevant coursework, or GPA."
        ),
        "Experience": (
            "Improve Experience bullets: start with strong action verbs, "
            "quantify impact (e.g., “Reduced load time by 30%”), "
            "and clarify your specific role."
        ),
        "Projects": (
            "Enrich Projects: for each project, mention your role, the tech stack used, "
            "and the outcome or metrics achieved."
        ),
        "Skills": (
            "Organize Skills: group by category (Languages, Frameworks, Tools), "
            "and optionally note proficiency levels (e.g., expert, intermediate)."
        ),
    }

    suggestions = []
    for section, tip in SECTION_TIPS.items():
        score = scores.get(section, 0)
        # If section scored below 8, emphasize improvement; otherwise just praise + tip
        if score < 8:
            suggestions.append(f"• **{section}** (score: {score}/10): {tip}")
        else:
            suggestions.append(f"• **{section}** (score: {score}/10): Looks solid! You might also: {tip.lower()}")

    # Join into a single feedback blob
    return "\n".join(suggestions)
