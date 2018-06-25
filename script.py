from docx import Document
from docx.shared import Inches

def convertFile():
    docx = Document('uploads/input')
    text_file = open("uploads/output", "w")
    s=""
    # print (docx)

    document = Document()


    for p in docx.paragraphs:

        s+=p.text
        s+="\r\n"

    text_file.write(s)
    text_file.close()