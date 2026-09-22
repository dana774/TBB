"""Shared house style for Founder Network member resources."""
from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

INK = colors.HexColor("#1A2B3C")
ACCENT = colors.HexColor("#B8763E")
MUTED = colors.HexColor("#5A6B7C")
RULE = colors.HexColor("#D6DDE4")
BAND = colors.HexColor("#F2F5F8")

NOTICE_CORE = (
    "© 2026 Value Growth Partners. Provided to Founder Network members for their own use. "
    "Not legal, financial, investment, or tax advice. Do not redistribute, resell, or share "
    "outside your organization."
)
FOOTER = "Founder Network member resource · The Brand Blueprint · Powered by Value Growth Partners"

H1 = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=19, leading=23,
                    textColor=INK, spaceAfter=4)
KICKER = ParagraphStyle("Kicker", fontName="Helvetica-Bold", fontSize=8.5, leading=11,
                        textColor=ACCENT, spaceAfter=6)
H2 = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=11.5, leading=14,
                    textColor=INK, spaceBefore=13, spaceAfter=5)
BODY = ParagraphStyle("Body", fontName="Helvetica", fontSize=9.6, leading=14,
                      textColor=INK, alignment=TA_LEFT, spaceAfter=6)
BULLET = ParagraphStyle("Bullet", parent=BODY, leftIndent=13, bulletIndent=3, spaceAfter=3.5)
SMALL = ParagraphStyle("Small", fontName="Helvetica", fontSize=7.6, leading=10.5,
                       textColor=MUTED, spaceAfter=4)


def doc(path, title):
    return SimpleDocTemplate(
        path, pagesize=LETTER,
        leftMargin=0.85 * inch, rightMargin=0.85 * inch,
        topMargin=0.7 * inch, bottomMargin=0.65 * inch,
        title=title, author="Value Growth Partners",
        subject="Founder Network member resource",
    )


def header(story, kicker, title, standfirst=None):
    story.append(Paragraph(kicker.upper(), KICKER))
    story.append(Paragraph(title, H1))
    story.append(Spacer(1, 3))
    story.append(Table([[""]], colWidths=[6.8 * inch], rowHeights=[1.6],
                       style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), ACCENT)])))
    story.append(Spacer(1, 10))
    if standfirst:
        story.append(Paragraph(standfirst, BODY))


def h2(story, text):
    story.append(Paragraph(text, H2))


def para(story, text):
    story.append(Paragraph(text, BODY))


def bullets(story, items):
    for it in items:
        story.append(Paragraph(it, BULLET, bulletText="–"))
    story.append(Spacer(1, 4))


def grid(story, rows, widths, header_row=True):
    t = Table(rows, colWidths=[w * inch for w in widths], repeatRows=1 if header_row else 0)
    st = [
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.4),
        ("TEXTCOLOR", (0, 0), (-1, -1), INK),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, RULE),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if header_row:
        st += [("BACKGROUND", (0, 0), (-1, 0), BAND),
               ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold")]
    t.setStyle(TableStyle(st))
    story.append(t)
    story.append(Spacer(1, 6))


def notices(story, topical):
    story.append(Spacer(1, 12))
    story.append(Table([[""]], colWidths=[6.8 * inch], rowHeights=[0.5],
                       style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), RULE)])))
    story.append(Spacer(1, 7))
    story.append(Paragraph("<b>Notices</b>", SMALL))
    story.append(Paragraph(NOTICE_CORE, SMALL))
    story.append(Paragraph(topical, SMALL))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<i>%s</i>" % FOOTER, SMALL))


def build(path, title, fn):
    d = doc(path, title)
    story = []
    fn(story)
    d.build(story)
    print("wrote", path)
