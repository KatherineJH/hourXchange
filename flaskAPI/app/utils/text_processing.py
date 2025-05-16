from konlpy.tag import Okt

okt = Okt()

def extract_nouns(text):
    nouns = okt.nouns(text)
    return list(set([n for n in nouns if len(n) > 1]))
