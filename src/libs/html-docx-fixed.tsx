/* html-docx-fixed.js – patched for Vite/ESM (no strict-mode errors) */
 
function convertToOfficeHtml(html: string) {
    html = html || '';
    if (!/^<html/i.test(html)) {
      html =
        '<!DOCTYPE html><html><head><meta charset="UTF-8"></meta></head><body>' +
        html +
        "</body></html>";
    }
    return html;
  }
  
  function generateDocument(html: string) {
    let officeHtml = convertToOfficeHtml(html);
  
    const header =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      "<w:body>";
  
    const footer = "</w:body></w:document>";
  
    // Wrap HTML inside fallback block
    const content =
      '<w:p><w:r><w:smartTag w:uri="urn:schemas-microsoft-com:office:smarttags" w:element="html">' +
      "<w:smartTagPr></w:smartTagPr>" +
      `<w:t>${escapeXml(officeHtml)}</w:t>` +
      "</w:smartTag></w:r></w:p>";
  
    return header + content + footer;
  }
  
  function escapeXml(unsafe: string) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  
  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  
  export function asBlob(html: string) {
    const xml = generateDocument(html);
    const buffer = s2ab(xml);
  
    return new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  }
  