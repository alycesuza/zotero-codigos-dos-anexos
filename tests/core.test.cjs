const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const core=require('../src/core.js');
const item=(overrides={})=>({key:'SYNTH001',title:'Synthetic example',date:'2020',type:'book',creators:[{lastName:'Example'}],tags:[],attachments:[],...overrides});
test('CSV export protects spreadsheet formulas and preserves quotes',()=>{
 const csv=core.csv([{title:'=HYPERLINK("x")',evidence:'Line; "quoted"'}]);
 assert.ok(csv.includes("'=HYPERLINK"));assert.ok(csv.includes('""quoted""'));
});
test('package contains no database, account credentials or real document fixture',()=>{
 const manifest=require('../src/manifest.json');const pkg=require('../package.json');
 assert.equal(manifest.version,pkg.version);assert.equal(manifest.applications.zotero.id,pkg.zotero.id);
 assert.equal(manifest.applications.zotero.strict_min_version,'10.0');
 for(const file of fs.readdirSync('src'))assert.ok(!/\.(sqlite|pdf|docx|env)$/i.test(file));
 for(const file of fs.readdirSync('src').filter(x=>x.endsWith('.js')))new vm.Script(fs.readFileSync('src/'+file,'utf8'),{filename:file});
});
test('stored keys exclude linked files, URLs and deleted attachments',()=>{
 const row=item({attachments:[{key:'PDF00001',linkMode:'imported_file'},{key:'HTML0001',linkMode:'imported_url'},{key:'EXT00001',linkMode:'linked_file'},{key:'URL00001',linkMode:'linked_url'},{key:'OLD00001',linkMode:'imported_file',deleted:true}]});
 assert.equal(core.storedCodes(row),'HTML0001, PDF00001');
});
test('actual column callback uses child attachment keys, not parent key',async()=>{
 let options;const children=new Map();const context={Zotero:{Items:{get:id=>children.get(id)},ItemTreeManager:{registerColumn:o=>(options=o,'column'),unregisterColumn:()=>{}},Notifier:{registerObserver:()=>1,unregisterObserver:()=>{}},Promise:{delay:()=>Promise.resolve()},debug:()=>{},logError:()=>{}}};
 vm.createContext(context);vm.runInContext(fs.readFileSync('src/bootstrap.js','utf8'),context);
 children.set(2,{key:'CHILD001',isAttachment:()=>true,isStoredFileAttachment:()=>true});
 await context.startup({id:require('../src/manifest.json').applications.zotero.id});
 assert.equal(options.dataProvider({key:'PARENT01',isAttachment:()=>false,isRegularItem:()=>true,getAttachments:()=>[2]}),'CHILD001');
 assert.equal(options.dataProvider({isAttachment:()=>false,isRegularItem:()=>false}),'');
 context.shutdown();
});
