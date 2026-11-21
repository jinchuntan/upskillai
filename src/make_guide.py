"""Rebuild the free studio guide with Python and ReportLab."""
from pathlib import Path
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph

dest = Path(__file__).resolve().parents[1] / 'dist' / 'downloads' / 'everyday-ai.pdf'
dest.parent.mkdir(parents=True, exist_ok=True)
width, height = 420, 595
pdf = Canvas(str(dest), pagesize=(width, height), invariant=1)
pdf.setTitle('Everyday AI | A starter guide from upskill.ai.my')
pdf.setAuthor('upskill.ai.my')
pdf.setCreator('upskill.ai.my')
pdf.setSubject('A starter guide to writing and checking your first AI prompt')
cream, ink, rust, olive = '#FAF6EA', '#31362B', '#9B422A', '#47573B'
def colour(code):
    pdf.setFillColor(HexColor(code))

def label(x, y, text, color=rust):
    colour(color); pdf.setFont('Helvetica-Bold', 9); pdf.drawString(x, y, text)

def paragraph(text, y, size=13, colour_code=ink, x=35, max_width=350):
    style = ParagraphStyle('body', fontName='Helvetica', fontSize=size, leading=size*1.48, textColor=HexColor(colour_code))
    p = Paragraph(text, style); _, h = p.wrap(max_width, 1000)
    p.drawOn(pdf, x, y-h); return y-h

def base(n, heading):
    colour(cream); pdf.rect(0,0,width,height,fill=1,stroke=0)
    label(35,549,'UPSKILL.AI.MY   /   STARTER EDITION')
    pdf.setStrokeColor(HexColor('#c7c2af')); pdf.line(35,534,385,534)
    colour(ink); pdf.setFont('Times-Roman', 31); pdf.drawString(35,482,heading)
    label(35,26,'EVERYDAY AI',olive); label(335,26,f'{n}  /  5',olive)

def example(y, heading, text):
    label(35,y,heading);return paragraph(text,y-13)

colour(olive); pdf.rect(0,0,width,height,fill=1,stroke=0)
pdf.setStrokeColor(HexColor('#CFD3B0'));pdf.rect(18,18,384,559)
label(36,535,'UPSKILL.AI.MY   /   STARTER EDITION','#EDEACF')
colour(cream);pdf.setFont('Times-Roman',62);pdf.drawString(32,385,'Everyday');pdf.setFont('Times-Italic',68);pdf.drawString(33,314,'AI')
paragraph('A small guide to writing your first useful prompt, refining a draft, and checking it before you send.',244,16,'#FAF6EA')
label(35,68,'A PRACTICAL GUIDE FROM MALAYSIA','#EDEACF');pdf.showPage()

base(2,'Start with one task')
y=paragraph('Choose something you already know how to check. A reminder for a study group is a good first exercise because you know the people, place, and time.',449)
y=example(y-29,'A ROUGH NOTE','Saturday study group. Meet at 10 am at the library entrance. Bring last week’s notes. Please confirm by Friday.')
y=example(y-29,'YOUR TURN','Write your own rough note. Cross out anything private that does not need to appear in the message. Circle the details that must stay exactly as written.')
example(y-29,'BEFORE YOU CONTINUE','What would a useful result look like? For this exercise, it is a short WhatsApp reminder your group can act on.')
pdf.showPage()

base(3,'Try a four-line brief')
y=paragraph('Use this small structure to turn your note into a request. Paste the four lines into the AI writing tool of your choice.',449)
for title, body in [
 ('TASK','Draft a WhatsApp reminder for our study group.'),
 ('CONTEXT','We meet on Saturday at 10 am at the library entrance. Please bring last week’s notes and confirm by Friday.'),
 ('CONSTRAINT','Use a friendly tone and only the details in my note.'),
 ('FORMAT','Give me two short sentences I can copy.')]:
    y=example(y-22,title,body)
pdf.showPage()

base(4,'Read it like the recipient')
y=paragraph('Here is one possible draft. Before using it, compare each detail with your note.',449)
y=example(y-24,'ONE POSSIBLE ANSWER','Hi everyone! We’re meeting at the library entrance this Saturday at 10 am. Please bring last week’s notes and confirm by Friday.')
y=example(y-24,'CHECK THE BRIEF','The draft keeps the time, place, materials, and reply deadline. Count the sentences, including the greeting. There are three, although you asked for two.')
y=example(y-24,'A SMALL REVISION','Ask for two sentences total, including the greeting. Or edit it yourself: “Hi everyone, we’re meeting at the library entrance this Saturday at 10 am. Please bring last week’s notes and confirm by Friday.”')
pdf.showPage()

base(5,'Keep what worked')
y=paragraph('Save a reusable version with the changing details in brackets. Next time, replace the brackets before you ask for a draft.',449)
y=example(y-24,'YOUR REUSABLE PROMPT','Write a [format] for [reader]. They need to [action] by [deadline]. Include [confirmed details]. Use [tone] and keep the answer to [length].')
y=example(y-24,'TRY IT AGAIN','Choose a different task, such as inviting a friend to a weekend walk. Which parts of the first prompt still help? Which details need to change?')
example(y-24,'A FINAL CHECK','Read the message aloud. Verify every date, name, place, and promise against your original note. Once it sounds like you, it is ready to share.')
pdf.showPage();pdf.save()
