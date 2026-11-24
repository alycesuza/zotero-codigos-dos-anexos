/* Personalização local. Somente leitura dos itens; nenhuma chamada de rede. */
var columnKey;
var observerID;
var running = false;
var refreshPending = false;

function storedCode(item) {
  if (!item || item.deleted || !item.isAttachment() || !item.isStoredFileAttachment()) {
    return "";
  }
  return item.key || "";
}

function attachmentCodes(item) {
  if (!item || item.deleted) return "";
  if (item.isAttachment()) return storedCode(item);
  if (!item.isRegularItem()) return "";
  const codes = [];
  for (const id of item.getAttachments(false)) {
    const attachment = Zotero.Items.get(id);
    const code = storedCode(attachment);
    if (code && !codes.includes(code)) codes.push(code);
  }
  return codes.sort().join(", ");
}

function displayCodes(item) {
  try {
    return attachmentCodes(item);
  } catch (error) {
    Zotero.debug("Código do anexo: item ainda não carregado: " + error);
    return "";
  }
}

function refreshSoon() {
  if (!running || refreshPending) return;
  refreshPending = true;
  Zotero.Promise.delay(200).then(() => {
    refreshPending = false;
    if (running) Zotero.ItemTreeManager.refreshColumns();
  }).catch(error => Zotero.logError(error));
}

async function startup({ id }) {
  running = true;
  columnKey = Zotero.ItemTreeManager.registerColumn({
    dataKey: "attachmentFolderCode",
    label: "Código do anexo",
    pluginID: id,
    enabledTreeIDs: ["main"],
    showInColumnPicker: true,
    columnPickerSubMenu: false,
    width: "170",
    minWidth: 100,
    flex: 0,
    hidden: false,
    dependsOnChildren: true,
    zoteroPersist: ["width", "hidden", "ordinal", "sortDirection"],
    dataProvider: displayCodes,
    renderCell(index, data, column, isFirstColumn, doc) {
      const cell = doc.createElement("span");
      cell.className = "cell " + (column.className || "");
      cell.textContent = data;
      cell.title = data;
      return cell;
    }
  });
  if (!columnKey) throw new Error("Não foi possível registrar a coluna Código do anexo.");
  observerID = Zotero.Notifier.registerObserver({
    notify(event, type) {
      if (type === "item") refreshSoon();
    }
  }, ["item"], "codigo-do-anexo");
}

function shutdown(data, reason) {
  running = false;
  if (observerID) Zotero.Notifier.unregisterObserver(observerID);
  observerID = undefined;
  if (columnKey) Zotero.ItemTreeManager.unregisterColumn(columnKey);
  columnKey = undefined;
}

function install() {}
function uninstall() {}
