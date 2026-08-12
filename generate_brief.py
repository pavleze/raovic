from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE = "/System/Library/Fonts/Supplemental/"
pdfmetrics.registerFont(TTFont("Arial",        BASE + "Arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold",   BASE + "Arial Bold.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic", BASE + "Arial Italic.ttf"))
pdfmetrics.registerFontFamily("Arial",
    normal="Arial", bold="Arial-Bold", italic="Arial-Italic", boldItalic="Arial-Bold")

OUT    = "/Users/pzecevic/Documents/private/Raovic_Brief.pdf"
PURPLE = HexColor("#50256b")
LILAC  = HexColor("#8e568f")
PINK   = HexColor("#bf1f6f")
GRAY   = HexColor("#555555")
LGRAY  = HexColor("#aaaaaa")
BLACK  = HexColor("#1a0e1f")
BGSOFT = HexColor("#f7f3fa")
BGNOTE = HexColor("#fff5f9")
BORDERC= HexColor("#ddd0e8")

doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=2.8*cm, rightMargin=2.8*cm,
    topMargin=2.4*cm,  bottomMargin=2.4*cm,
    title="Raovic - Izrada sajta",
)

def S(name, size=10, color=BLACK, bold=False, italic=False,
      sb=0, sa=5, leading=None, li=0, align=0):
    fn = "Arial-Bold" if bold else ("Arial-Italic" if italic else "Arial")
    return ParagraphStyle(name, fontName=fn, fontSize=size, textColor=color,
        spaceBefore=sb, spaceAfter=sa, leading=leading or size*1.48,
        leftIndent=li, alignment=align)

sTitle = S("T",  size=22, color=PURPLE, bold=True, sa=4,  leading=27, align=1)
sSub   = S("Su", size=12, color=LILAC,             sa=3,  leading=17, align=1)
sDate  = S("Dt", size=9,  color=LGRAY,             sa=0,  leading=13, align=1)
sH1    = S("H1", size=13, color=HexColor("#ffffff"), bold=True, sa=0, leading=18)
sH2    = S("H2", size=10, color=PURPLE, bold=True, sb=14, sa=4, leading=14)
sBody  = S("Bo", size=10, color=BLACK,             sb=0,  sa=5,  leading=15)

def hr(color=BORDERC, t=0.5):
    return HRFlowable(width="100%", thickness=t, color=color, spaceAfter=8, spaceBefore=8)

def sp(n=6): return Spacer(1, n)
def body(t): return Paragraph(t, sBody)

def section_header(title, subtitle=None):
    content = [Paragraph(title, sH1)]
    if subtitle:
        content.append(Paragraph(subtitle, S("sh", size=9, color=HexColor("#e8d0f0"), sa=0, leading=13)))
    tbl = Table([[content]], colWidths=[15.4*cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), PURPLE),
        ("LEFTPADDING",   (0,0),(-1,-1), 14),
        ("RIGHTPADDING",  (0,0),(-1,-1), 14),
        ("TOPPADDING",    (0,0),(-1,-1), 10),
        ("BOTTOMPADDING", (0,0),(-1,-1), 10),
    ]))
    return tbl

def item_box(num, title, desc):
    num_p   = Paragraph(str(num), S("n", size=14, color=PURPLE, bold=True, sa=0, leading=17, align=1))
    title_p = Paragraph(title, S("it", size=10.5, color=BLACK, bold=True, sb=0, sa=3, leading=15))
    desc_p  = Paragraph(desc,  S("id", size=10,   color=GRAY,  sb=0, sa=0, leading=15))

    inner = Table([[[num_p], [title_p, desc_p]]], colWidths=[1.4*cm, 12.8*cm])
    inner.setStyle(TableStyle([
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING",   (0,0),(0,-1),  0),
        ("RIGHTPADDING",  (0,0),(0,-1),  12),
        ("LEFTPADDING",   (1,0),(1,-1),  0),
        ("TOPPADDING",    (0,0),(-1,-1), 0),
        ("BOTTOMPADDING", (0,0),(-1,-1), 0),
    ]))

    box = Table([[inner]], colWidths=[15.4*cm])
    box.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), BGSOFT),
        ("BOX",           (0,0),(-1,-1), 0.5, BORDERC),
        ("LEFTPADDING",   (0,0),(-1,-1), 14),
        ("RIGHTPADDING",  (0,0),(-1,-1), 14),
        ("TOPPADDING",    (0,0),(-1,-1), 13),
        ("BOTTOMPADDING", (0,0),(-1,-1), 13),
    ]))
    return KeepTogether([box, sp(10)])

story = []

story += [
    Spacer(1, 1.4*cm),
    Paragraph("GINEKOLOSKA ORDINACIJA RAOVIC", sTitle),
    Paragraph("Izrada novog sajta - sta nam je potrebno", sSub),
    Paragraph("Jun 2026.", sDate),
    Spacer(1, 0.6*cm),
    hr(PURPLE, 1.5),
    Spacer(1, 0.3*cm),
]

intro = Table([[
    Paragraph(
        "Ovaj dokument opisuje projekat izrade novog sajta i sadrzi listu informacija "
        "koje su nam potrebne od Vas kako bismo mogli da pocnemo.",
        S("i", size=10, color=BLACK, sa=0, leading=15))
]], colWidths=[15.4*cm])
intro.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,-1), BGNOTE),
    ("BOX",           (0,0),(-1,-1), 0.8, PINK),
    ("LEFTPADDING",   (0,0),(-1,-1), 14),
    ("RIGHTPADDING",  (0,0),(-1,-1), 14),
    ("TOPPADDING",    (0,0),(-1,-1), 12),
    ("BOTTOMPADDING", (0,0),(-1,-1), 12),
]))
story += [intro, sp(20)]

story += [
    section_header("O projektu", "Sta radimo i kako"),
    sp(12),
    body("Izradjujemo novi, moderni sajt ordinacije Raovic. "
         "Sajt ce biti osmisljen na osnovu sajtova koje ste nam pokazali kao reference "
         "i naseg doprinosa dizajnu."),
    body("Tekst i sve informacije preuzimamo sa trenutnog sajta (raovic.rs). "
         "Ukoliko postoje izmene - novi lekari, promena radnog vremena, "
         "nove usluge ili izmena cena - navedite ih u ovom dokumentu."),
    sp(4),
    Paragraph("Boje i dizajn", sH2),
    body("Od boja koristimo svetliju lila i boje sa logoa ordinacije, "
         "kako bi se sajt uklopio sa Instagram profilom i vizuelnim identitetom."),
    sp(4),
    Paragraph("Saradnja i odobrenje", sH2),
    body("Na vecim deonicama izrade trazimo Vase misljenje i odobrenje "
         "kako bismo lakse dosli do zajednickog zakljucka sta je najbolje resenje. "
         "Sajt Vam saljemo na odobrenje u par etapa."),
    sp(16),
]

story += [
    section_header("Sta nam je potrebno", "Molimo dostavite sledece"),
    sp(12),
    item_box(1,
        "Kredencijali za postojeci sajt",
        "Molimo kontaktirajte prethodnog izvodjaca sajta i zamolite ga da Vam poslje "
        "pristupne podatke za domen (raovic.rs), kako bismo ga mogli prebaciti na novi sajt."),
    item_box(2,
        "Email adresa za zakazivanje",
        "Na koji email zelite da stizu zahtevi za zakazivanje pregleda sa sajta?"),
    item_box(3,
        "Fotografije zaposlenih",
        "Fotografije svih lekara i medicinskog osoblja u sto vecoj rezoluciji."),
    item_box(4,
        "Fotografije ordinacije",
        "Fotografije prostora ordinacije - cekaonica, ordinacijska soba, recepcija. "
        "Minimum 3-5 fotografija u dobroj rezoluciji."),
    item_box(5,
        "Logo",
        "Ukoliko posedujete logo u vektorskom formatu (PDF, SVG, AI) ili visokoj rezoluciji "
        "- molimo dostavite. Ako ne, iskoristicemo postojeci logo sa sajta."),
    item_box(6,
        "Cenovnik",
        "Ukoliko zelite da azurirate cene, navedite ih u formatu od-do. "
        "Dodacemo napomenu da se za vise informacija obrate na email ili telefon. "
        "Cene mozemo urediti i naknadno - nije neophodno za pocetak."),
]

story += [
    sp(4),
    hr(),
    Paragraph(
        "Materijale i odgovore mozete poslati na ovaj mejl.",
        S("fn", size=9, color=GRAY, sa=0, leading=13, align=1)
    ),
]

doc.build(story)
print(f"Saved: {OUT}")
