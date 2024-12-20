# PDF Generation Library Update

1. First remove pdfkit:
```bash
npm uninstall pdfkit
```

2. Install jspdf as an alternative:
```bash
npm install jspdf
```

jspdf is a widely-used PDF generation library for JavaScript that doesn't have dependencies on fontkit and @swc/helpers, making it more compatible with our Next.js setup.