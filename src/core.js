"use strict";
var Core = (() => {
  const norm = value => String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  const doi = value => String(value || "").trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").toLowerCase();
  function validDOI(value) {return /^10\.\d{4,9}\/\S+$/i.test(doi(value));}
  function isbn(value) {
    const s = String(value || "").replace(/[^0-9X]/gi, "").toUpperCase();
    if (s.length === 13) return [...s].reduce((sum, n, i) => sum + Number(n) * (i % 2 ? 3 : 1), 0) % 10 === 0;
    if (s.length === 10 && /^\d{9}[\dX]$/.test(s)) return [...s].reduce((sum, n, i) => sum + (n === "X" ? 10 : Number(n)) * (10 - i), 0) % 11 === 0;
    return false;
  }
  function storedCodes(item) {
    return [...new Set((item.attachments || []).filter(a => !a.deleted && ["imported_file", "imported_url", "embedded_image"].includes(a.linkMode)).map(a => a.key))].sort().join(", ");
  }
  function context(text, index) {return text.slice(Math.max(0, index - 100), Math.min(text.length, index + 220)).replace(/\s+/g, " ").trim();}
  function csv(rows) {
    if (!rows.length) return "";
    const headers = [...new Set(rows.flatMap(row => Object.keys(row)))];
    const escape = value => {
      let s = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
      if (/^[\s]*[=+@-]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    return "\uFEFF" + [headers, ...rows.map(row => headers.map(key => row[key]))].map(row => row.map(escape).join(";")).join("\r\n");
  }
  function tags(item, prefix) {return (item.tags || []).filter(t => norm(t).startsWith(norm(prefix))).map(t => t.slice(t.indexOf(":") + 1).trim()).filter(Boolean);}
  const issue = (item, severity, field, message) => ({key:item.key, title:item.title, severity, field, message});
  const PluginCore={};
  return {norm, doi, validDOI, isbn, storedCodes, csv, tags, ...PluginCore};
})();
if (typeof module !== "undefined") module.exports = Core;
