/**
 * Value Growth Partners — document design system
 * Tokens mirror docs/08-studio-build-spec.md §1 (the VGP/BB design contract):
 * editorial serif display in Navy, neutral sans for everything else,
 * Blueprint Blue as the single primary accent, Warm Gold for eyebrows only.
 */
const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, HeadingLevel, LevelFormat, VerticalAlign, TabStopType, HeightRule,
} = require('docx');

const C = {
  navy:      '071E41',
  deepBlue:  '0B2D57',
  blue:      '3978D7',
  gold:      'C89B2C',
  paleBlue:  'EFF5FF',
  softGray:  'F5F8FC',
  body:      '4B5563',
  bodyLight: '6B7280',
  border:    'E5EAF2',
  borderMid: 'D8E6FF',
  white:     'FFFFFF',
};

// Cambria (editorial serif) + Arial (neutral grotesque) — the Playfair/Inter
// pairing rendered in faces that ship with every Office install.
const F = { serif: 'Cambria', sans: 'Arial' };

const PAGE = { width: 12240, height: 15840, marginX: 1080, marginTop: 1080, marginBottom: 1000 };
const CONTENT = PAGE.width - PAGE.marginX * 2; // 10080 DXA

const hair  = (color = C.border) => ({ style: BorderStyle.SINGLE, size: 2, color });
const none  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NOBORDER = { top: none, bottom: none, left: none, right: none };
const cellMargins = { top: 112, bottom: 112, left: 150, right: 150 };

/* ---------- text primitives ---------- */

const eyebrow = (text, { color = C.gold, before = 0, after = 90, size = 15, pageBreakBefore = false } = {}) =>
  new Paragraph({
    keepNext: true, keepLines: true, pageBreakBefore,
    spacing: { before, after },
    children: [new TextRun({
      text: text.toUpperCase(), font: F.sans, size, bold: true,
      color, characterSpacing: 26,
    })],
  });

const h1 = (text, { before = 40, after = 150 } = {}) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true, keepLines: true,
    spacing: { before, after },
    children: [new TextRun({ text, font: F.serif, size: 40, color: C.navy })],
  });

const h2 = (text, { before = 340, after = 130, pageBreakBefore = false } = {}) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    keepNext: true, keepLines: true, pageBreakBefore,
    spacing: { before, after },
    children: [new TextRun({ text, font: F.serif, size: 25, color: C.deepBlue })],
  });

const h3 = (text, { before = 260, after = 90 } = {}) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    keepNext: true, keepLines: true,
    spacing: { before, after },
    children: [new TextRun({
      text: text.toUpperCase(), font: F.sans, size: 15, bold: true,
      color: C.deepBlue, characterSpacing: 20,
    })],
  });

// Rich body copy: pass a string, or an array of strings / {t, b} bold segments.
const runs = (input, { size = 20, color = C.body, font = F.sans } = {}) =>
  (Array.isArray(input) ? input : [input]).map((s) =>
    typeof s === 'string'
      ? new TextRun({ text: s, font, size, color })
      : new TextRun({ text: s.t, font, size, color: s.c || color, bold: !!s.b, italics: !!s.i }));

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: opts.after ?? 170, line: opts.line ?? 300 },
    alignment: opts.align,
    children: runs(text, opts),
  });

const lead = (text, opts = {}) =>
  body(text, { size: 22, color: C.body, after: 200, line: 320, ...opts });

const bullets = (items, { numbered = false, size = 20, color = C.body, after = 80 } = {}) =>
  items.map((it) => new Paragraph({
    numbering: { reference: numbered ? 'vgp-num' : 'vgp-bullet', level: 0 },
    spacing: { after, line: 290 },
    children: runs(it, { size, color }),
  }));

const spacer = (h = 160) => new Paragraph({ spacing: { after: h }, children: [] });

const rule = ({ before = 300, after = 300, color = C.border } = {}) =>
  new Paragraph({
    keepNext: true,
    spacing: { before, after },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    children: [],
  });

/* ---------- table primitives ---------- */

const cellPara = (content, o = {}) => new Paragraph({
  spacing: { after: o.after ?? 0, line: o.line ?? 265 },
  alignment: o.align,
  children: runs(content, { size: o.size ?? 18, color: o.color ?? C.body }),
});

const widths = (fractions, total = CONTENT) => {
  const sum = fractions.reduce((a, b) => a + b, 0);
  const w = fractions.map((f) => Math.round((f / sum) * total));
  w[w.length - 1] = total - w.slice(0, -1).reduce((a, b) => a + b, 0);
  return w;
};

/**
 * Data table: Navy header band, hairline rules, no zebra fill.
 * rows = array of arrays; a cell may be a string, an array of runs, or
 * {text, bold, color, fill, align}.
 */
function dataTable(headers, rows, fractions, opts = {}) {
  const cw = widths(fractions, opts.total || CONTENT);
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((hd, i) => new TableCell({
      width: { size: cw[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: opts.headerFill || C.navy, color: 'auto' },
      margins: cellMargins,
      borders: { top: hair(opts.headerFill || C.navy), bottom: hair(opts.headerFill || C.navy), left: hair(opts.headerFill || C.navy), right: hair(opts.headerFill || C.navy) },
      children: [new Paragraph({
        spacing: { after: 0, line: 250 },
        children: [new TextRun({
          text: String(hd).toUpperCase(), font: F.sans, size: 14, bold: true,
          color: C.white, characterSpacing: 18,
        })],
      })],
    })),
  });

  const bodyRows = rows.map((r, ri) => new TableRow({
    ...(opts.rowHeight ? { height: { value: opts.rowHeight, rule: HeightRule.ATLEAST } } : {}),
    children: r.map((cell, i) => {
      const o = (cell && typeof cell === 'object' && !Array.isArray(cell)) ? cell : {};
      const content = o.text !== undefined ? o.text : cell;
      const fill = o.fill || (opts.tint && ri % 2 === 1 ? C.softGray : C.white);
      return new TableCell({
        width: { size: cw[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
        margins: cellMargins,
        verticalAlign: VerticalAlign.TOP,
        borders: { top: hair(), bottom: hair(), left: hair(), right: hair() },
        children: [cellPara(content, {
          size: o.size ?? 18,
          color: o.color ?? (i === 0 && opts.boldFirst !== false ? C.navy : C.body),
          align: o.align,
        })].concat(o.sub ? [cellPara(o.sub, { size: 15, color: C.bodyLight, line: 240 })] : []),
      });
    }),
  }));

  return new Table({
    columnWidths: cw,
    width: { size: opts.total || CONTENT, type: WidthType.DXA },
    rows: [headerRow, ...bodyRows],
  });
}

/** Pale-blue insight block with a gold eyebrow label. */
function callout(label, text, opts = {}) {
  const fill = opts.fill || C.paleBlue;
  const bd = hair(opts.borderColor || C.borderMid);
  return new Table({
    columnWidths: [CONTENT],
    width: { size: CONTENT, type: WidthType.DXA },
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        width: { size: CONTENT, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
        margins: { top: opts.pad ?? 220, bottom: opts.pad ?? 220, left: 260, right: 260 },
        borders: { top: bd, bottom: bd, left: bd, right: bd },
        children: [
          ...(label ? [new Paragraph({
            spacing: { after: 90 },
            children: [new TextRun({
              text: label.toUpperCase(), font: F.sans, size: 14, bold: true,
              color: opts.labelColor || C.gold, characterSpacing: 24,
            })],
          })] : []),
          new Paragraph({
            spacing: { after: 0, line: 290 },
            children: runs(text, { size: opts.size ?? 19, color: opts.color || C.deepBlue }),
          }),
        ],
      })],
    })],
  });
}

/** Row of equal stat cells: [{value, label}] */
function statStrip(items, opts = {}) {
  const cw = widths(items.map(() => 1));
  const fill = opts.fill || C.softGray;
  return new Table({
    columnWidths: cw,
    width: { size: CONTENT, type: WidthType.DXA },
    rows: [new TableRow({
      cantSplit: true,
      children: items.map((it, i) => new TableCell({
        width: { size: cw[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
        margins: { top: 210, bottom: 210, left: 200, right: 200 },
        borders: { top: hair(), bottom: hair(), left: hair(), right: hair() },
        children: [
          new Paragraph({
            spacing: { after: 60, line: 250 },
            children: [new TextRun({ text: it.value, font: F.serif, size: opts.valueSize ?? 30, color: C.navy })],
          }),
          new Paragraph({
            spacing: { after: 0, line: 235 },
            children: [new TextRun({
              text: it.label.toUpperCase(), font: F.sans, size: 13, bold: true,
              color: C.bodyLight, characterSpacing: 18,
            })],
          }),
        ],
      })),
    })],
  });
}

/** Navy cover band. */
function coverBand({ kicker, title, subtitle, meta }) {
  return new Table({
    columnWidths: [CONTENT],
    width: { size: CONTENT, type: WidthType.DXA },
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CONTENT, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: C.navy, color: 'auto' },
        margins: { top: 620, bottom: 620, left: 460, right: 460 },
        borders: NOBORDER,
        children: [
          new Paragraph({
            spacing: { after: 260 },
            children: [new TextRun({
              text: kicker.toUpperCase(), font: F.sans, size: 15, bold: true,
              color: C.gold, characterSpacing: 34,
            })],
          }),
          ...title.map((line, i) => new Paragraph({
            spacing: { after: i === title.length - 1 ? 240 : 40, line: 400 },
            children: [new TextRun({ text: line, font: F.serif, size: 46, color: C.white })],
          })),
          new Paragraph({
            spacing: { after: meta ? 330 : 0, line: 320 },
            children: [new TextRun({ text: subtitle, font: F.sans, size: 20, color: 'C7D6EE' })],
          }),
          ...(meta ? [new Paragraph({
            spacing: { after: 0, line: 300 },
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: '1E3C63' } },
            children: [],
          }), ...meta.map((m) => new Paragraph({
            spacing: { before: 190, after: 0, line: 280 },
            indent: { left: 2150, hanging: 2150 },
            tabStops: [{ type: TabStopType.LEFT, position: 2150 }],
            children: [
              new TextRun({ text: m.label.toUpperCase(), font: F.sans, size: 14, bold: true, color: '8FA9CC', characterSpacing: 20 }),
              new TextRun({ text: '\t' + m.value, font: F.sans, size: 17, color: C.white }),
            ],
          }))] : []),
        ],
      })],
    })],
  });
}

/* ---------- document scaffolding ---------- */

const numbering = {
  config: [
    {
      reference: 'vgp-bullet',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '—', alignment: AlignmentType.LEFT,
        style: {
          run: { font: F.sans, size: 20, color: C.blue },
          paragraph: { indent: { left: 340, hanging: 340 } },
        },
      }],
    },
    {
      reference: 'vgp-num',
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: '%1', alignment: AlignmentType.LEFT,
        style: {
          run: { font: F.sans, size: 19, bold: true, color: C.blue },
          paragraph: { indent: { left: 380, hanging: 380 } },
        },
      }],
    },
  ],
};

const styles = {
  default: {
    document: { run: { font: F.sans, size: 20, color: C.body }, paragraph: { spacing: { line: 300 } } },
    heading1: { run: { font: F.serif, size: 40, bold: false, color: C.navy }, paragraph: { spacing: { before: 40, after: 150 } } },
    heading2: { run: { font: F.serif, size: 25, bold: false, color: C.deepBlue }, paragraph: { spacing: { before: 340, after: 130 } } },
    heading3: { run: { font: F.sans, size: 15, bold: true, color: C.deepBlue }, paragraph: { spacing: { before: 260, after: 90 } } },
  },
};

module.exports = {
  C, F, PAGE, CONTENT, cellMargins, hair, none, NOBORDER,
  eyebrow, h1, h2, h3, body, lead, bullets, spacer, rule, runs,
  dataTable, callout, statStrip, coverBand, widths, cellPara,
  numbering, styles,
};
