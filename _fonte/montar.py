#!/usr/bin/env python3
"""Monta a home de oka.dev.br num index.html autocontido, na raiz do repositório.

  python3 _fonte/montar.py             grava ../index.html
  python3 _fonte/montar.py --conferir  só compara o resultado com o ../index.html atual, sem gravar

Não faz commit nem push."""
import base64, pathlib, re, sys, urllib.parse

SRC = pathlib.Path(__file__).parent
SITE = SRC.parent
FONT = base64.b64encode((SRC / "is.woff2").read_bytes()).decode()
CSS = (SRC / "common.css").read_text().replace("__FONT__", FONT)
JS = (SRC / "common.js").read_text()
WA = "559284648668"

SYM = """<svg class="sym" viewBox="116.5 98.25 183.78 166.64" role="img" aria-label="Oka">
<polygon class="bar b1" points="117.25 227.4 245.84 98.25 264.2 116.54 116.5 264.89 117.25 227.4"/>
<polygon class="bar b2" points="300.28 263.47 154.62 118.43 170.86 102.13 298.3 229.01 300.28 263.47"/>
<polygon class="bar b3" points="265.82 164.17 145.82 164.43 135.72 145.83 279.52 145.52 265.82 164.17"/>
<ellipse class="dot" cx="207.92" cy="219.64" rx="22.43" ry="22.63"/></svg>"""
WORD = re.sub(r"<\?xml.*?\?>", "", (SRC / "wordmark.svg").read_text()).replace("<svg ", '<svg class="word" ')

D = {}
D["vereda"] = """<div class="demo" data-demo="vereda"><div class="d-head"><span class="d-ava"></span><b>Vereda</b><i>exemplo</i></div><div class="d-body">
<div class="pub" data-at="1"><small>Nova publicação · hoje</small><p>Fica a parte autora intimada para, no prazo de <mark class="keep" data-at="2">15 dias</mark>, manifestar-se sobre o laudo.</p></div>
<div class="cal" data-at="3"><span>21</span><span>22</span><span>23</span><span>24</span><span class="keep" data-at="3">25</span><span>26</span><span>27</span></div>
<p class="note" data-at="4">Prazo na agenda, advogado avisado</p></div></div>"""
D["locafacil"] = """<div class="demo" data-demo="locafacil"><div class="d-head"><span class="d-ava"></span><b>LocaFácil</b><i>exemplo</i></div><div class="d-body">
<div class="row keep" data-at="1"><span>Apartamento 302</span><em><b>Pendente</b><b>Pago</b></em></div>
<div class="row keep" data-at="2"><span>Caminhonete</span><em><b>Pendente</b><b>Pago</b></em></div>
<div class="row keep" data-at="3"><span>Betoneira</span><em><b>Pendente</b><b>Pago</b></em></div>
<p class="note" data-at="4">Comprovantes enviados, sem papel</p></div></div>"""
wave = "".join(f'<i style="--h:{h}%"></i>' for h in [40,75,55,90,35,70,100,60,45,85,30,65,95,50,80,40,70,55,90,35,60,75,45,85,50,65])
D["meety"] = f"""<div class="demo" data-demo="meety"><div class="d-head"><span class="rec" data-meety></span><b>Meety</b><i>exemplo</i></div><div class="d-body">
<div class="wave keep" data-at="1">{wave}</div>
<p class="ln" data-at="2"><b>Ana</b>Fechamos a proposta até sexta.</p><p class="ln" data-at="3"><b>Caio</b>Eu envio o contrato amanhã.</p>
<p class="note" data-at="4">Ata pronta. Nada saiu do seu Mac</p></div></div>"""

D["iphone"] = """<div class="demo" data-demo="iphone"><div class="d-head"><span class="d-ava"></span><b>Aplicativo</b><i>exemplo</i></div><div class="d-body">
<div class="ip" role="img" aria-label="No aplicativo, o técnico marca o checklist, fotografa o serviço, colhe a assinatura do cliente e a ordem é concluída"><div class="sc">
<div class="hm"><b>Ordem de serviço</b><span class="sb">Instalação · Marina S.</span>
<div class="ck keep" data-at="2"><i></i>Equipamento instalado</div><div class="ck keep" data-at="3"><i></i>Teste concluído</div><div class="ck keep" data-at="4"><i></i>Local limpo</div>
<div class="ft"><span class="th keep" data-at="5"></span><span>Foto do serviço</span></div><div class="fab">Concluir</div></div>
<div class="fls keep" data-at="5" data-until="6"></div>
<div class="sh keep" data-at="6" data-until="7"><b>Assinatura do cliente</b><svg class="sg" viewBox="0 0 160 64"><path class="keep" data-at="6" pathLength="1" d="M10 44 C20 8 30 58 42 30 S58 16 66 40 S82 56 94 26 S116 22 122 40 S140 48 152 32"/></svg><div class="fab">Confirmar</div></div>
<span class="tc tk keep" data-at="2" data-until="5"></span>
<div class="ps keep" data-at="7"><i></i><span><b>Ordem concluída</b>Relatório enviado</span></div>
</div></div></div></div>"""

ICO = {"cal": '<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="14" rx="3"/><path d="M4 10h16M9 4v4M15 4v4"/></svg>',
       "msg": '<svg viewBox="0 0 24 24"><path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M8.5 11.5l2.2 2.2 4.6-4.6"/></svg>',
       "team": '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3.2"/><path d="M3 19c.6-3.4 3-5 6-5s5.4 1.6 6 5"/><circle cx="17" cy="8" r="2.4"/><path d="M17 13.5c2.2.2 3.6 1.6 4 4"/></svg>'}
D["agente2"] = f"""<div class="demo" data-demo="agente2"><div class="d-head"><span class="d-ava"></span><b>Agente no WhatsApp</b><i>exemplo</i></div><div class="d-body">
<p class="b me" data-at="1">Tem horário amanhã?</p><p class="b typing" data-at="2" data-until="3"><i></i><i></i><i></i></p>
<p class="b" data-at="3">Tenho 9h ou 10h30.</p><p class="b me" data-at="4">Pode ser 9h.</p>
<div class="fan" data-at="5"><i class="core"></i><svg class="fl" viewBox="0 0 300 64" preserveAspectRatio="none"><path class="keep" data-at="5" pathLength="1" d="M150 6 C150 44 50 26 50 64"/><path class="keep" data-at="6" pathLength="1" d="M150 6 V64"/><path class="keep" data-at="7" pathLength="1" d="M150 6 C150 44 250 26 250 64"/></svg>
<div class="ac"><span class="keep" data-at="5">{ICO["cal"]}<b>Agenda</b>9h reservado</span><span class="keep" data-at="6">{ICO["msg"]}<b>Cliente</b>Confirmação enviada</span><span class="keep" data-at="7">{ICO["team"]}<b>Equipe</b>Avisada</span></div></div></div></div>"""
def _nd(x, y, t, cls=""):
    return f'<g class="nd {cls}" transform="translate({x},{y})"><rect width="92" height="32" rx="10"/><text x="46" y="20">{t}</text></g>'
_W = ["M100 38 C132 38 128 110 152 110", "M100 110 H152", "M100 182 C132 182 128 110 152 110", "M188 110 C214 110 212 68 240 68", "M188 110 C214 110 212 152 240 152"]
_pk = "".join(f'<circle class="pk" r="3.6"><animateMotion dur="{d}s" begin="{bg}s" repeatCount="indefinite" path="{w}"/></circle>' for w, d, bg in zip(_W, [2.2, 1.8, 2.5, 2, 2.3], [0, .6, 1.1, .9, 1.7]))
D["rede"] = f"""<div class="demo" data-demo="rede"><div class="d-head"><span class="d-ava"></span><b>Automação</b><i>exemplo</i></div><div class="d-body">
<svg class="net" viewBox="0 0 340 220" role="img" aria-label="Dados de formulário, planilha e e-mail passam pela automação e chegam ao financeiro e ao CRM">{"".join(f'<path class="w" d="{w}"/>' for w in _W)}{_pk}
{_nd(8,22,"Formulário")}{_nd(8,94,"Planilha")}{_nd(8,166,"E-mail")}{_nd(240,52,"Financeiro","out")}{_nd(240,136,"CRM","out")}
<circle class="halo" cx="170" cy="110" r="18"/><circle class="hub" cx="170" cy="110" r="18"/><circle cx="170" cy="114" r="5" fill="#2F2E2E"/></svg>
<p class="note" data-at="1">Os dados chegam sem ninguém digitar</p></div></div>"""
D["site"] = """<div class="demo" data-demo="site"><div class="d-head"><span class="dots3"><i></i><i></i><i></i></span><span class="url">suaempresa.com.br</span><i>exemplo</i></div>
<div class="pgw"><div class="scr"><div class="s-nav" data-at="1"><b></b><span></span><span></span><span></span><u></u></div>
<div class="s-hero"><div><i data-at="2"></i><i class="sh" data-at="2"></i><i class="tx" data-at="3"></i><i class="tx sh" data-at="3"></i><u class="cta" data-at="4"></u></div><div class="s-img" data-at="3"><span></span></div></div>
<div class="s-cards"><span data-at="5"></span><span data-at="5"></span><span data-at="5"></span></div></div><em class="cur keep" data-at="4" data-until="6"></em></div></div>"""

def wa(msg="Olá! Vim pelo site da Oka e quero conversar."):
    return f"https://wa.me/{WA}?text={urllib.parse.quote(msg)}"

def montar():
    t = (SRC / "base.html").read_text()
    t = t.replace("/*SCENE_CSS*/", (SRC / "cena.css").read_text()).replace("/*SCENE_JS*/", (SRC / "cena.js").read_text())
    t = t.replace("/*COMMON_CSS*/", CSS).replace("/*COMMON_JS*/", JS).replace("<!--SYM-->", SYM).replace("<!--WORD-->", WORD)
    t = re.sub(r"<!--DEMO:(\w+)-->", lambda m: D[m.group(1)], t)
    t = re.sub(r"\{\{wa(?::([^}]*))?\}\}", lambda m: wa(m.group(1)) if m.group(1) else wa(), t)
    left = re.findall(r"<!--[A-Z]+:?\w*-->|\{\{[^}]*\}\}", t)
    assert not left, left
    assert "—" not in t and "fundador" not in t.lower(), "travessão ou 'fundador' no texto"
    # cabeçalho de produção: título, descrição, ícones, compartilhamento e JSON-LD
    for pat in (r"<title>.*?</title>\n", r'<meta name="description"[^>]*>\n', r'<meta name="theme-color"[^>]*>\n'):
        t, n = re.subn(pat, "", t, count=1); assert n == 1, pat
    vp = '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
    assert vp in t; t = t.replace(vp, vp + "  " + (SRC / "cabecalho-seo.html").read_text(), 1)
    a = '<section class="sec stage" id="fazemos"'; assert a in t
    t = t.replace(a, '<div id="servicos"></div>\n  ' + a, 1)  # o blog aponta para /#servicos
    for bad in ("127.0.0.1", "file://", "localhost"):
        assert bad not in t, bad
    return t

if __name__ == "__main__":
    novo, alvo = montar(), SITE / "index.html"
    if "--conferir" in sys.argv:
        igual = alvo.read_text() == novo
        print("idêntico ao index.html atual" if igual else "DIFERENTE do index.html atual"); sys.exit(0 if igual else 1)
    alvo.write_text(novo); print("gravado", alvo, len(novo) // 1024, "KB")
