from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import io

def generate_feedback_pdf(parsed_text, scores, feedback):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    y = height - 50
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, y, "Resume Evaluation Report")
    y -= 30

    # Section Scores
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, "Section Scores:")
    y -= 20
    p.setFont("Helvetica", 10)
    for section, score in scores.items():
        p.drawString(60, y, f"{section}: {score}/10")
        y -= 15

    # AI Suggestions
    y -= 10
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, "AI Suggestions:")
    y -= 20
    p.setFont("Helvetica", 10)
    for line in feedback.split('\n'):
        p.drawString(60, y, line.strip())
        y -= 15

    # Resume Text
    y -= 10
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, "Parsed Resume Text:")
    y -= 20
    p.setFont("Helvetica", 9)
    for line in parsed_text.split('\n'):
        if y < 50:
            p.showPage()
            y = height - 50
        p.drawString(60, y, line.strip())
        y -= 12

    p.save()
    buffer.seek(0)
    return buffer
