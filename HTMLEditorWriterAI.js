/**
 * @author Deepen Dhulla - https://deependhulla.com
 * @class Ext.ux.form.HtmlEditor.WriterAI
 * @extends Ext.util.Observable
 * <p>A plugin that creates a button on the HtmlEditor for inserting a  GenAI Content.</p>
 */    

Ext.ns('Ext.ux.form.HtmlEditor');

Ext.ux.form.HtmlEditor.WriterAI = Ext.extend(Ext.util.Observable, {
 cmd: 'writerai',
 init: function(cmp){
 this.cmp = cmp;
 this.cmp.on('render', this.onRender, this);
  },      
 onRender: function(){
 var cmp = this.cmp;
 var btn = this.cmp.getToolbar().insert(0, {
 iconCls: 'x-edit-writer-ai',
 text:'Writer AI',
 tabIndex:-1,
 handler: function(){
 if (!this.aiWindow){
   this.aiWindow = new Ext.Window({
   width:800,
   autoHeight:true,
   resizable:true,
   title: t("Writer AI"),
   closeAction: 'hide',
   focus: function(){
   this.items.get(0).form.findField('askai').focus(true);
   },
   items: [{
   itemId: 'ai-form',
   xtype: 'form',
   border: false,
   bodyStyle: 'padding: 10px;',
   labelWidth: 60,
   labelAlign: 'right',
   items: [  {
   xtype: 'label',
   itemId:'aidatalabel',
   html: 'Ask Writer AI , to create content..like..<br> We Acknowledging Receipt of Documents  and appreciate quick email.<br> or say ... Requesting Clarification  for more details for tecnical team to understand.<br><br>&nbsp;';
    }, {
    itemId:'askai',
    //xtype: 'textfield',
    xtype: 'textarea',
    name: 'askai',
   value:'',
   width: 600,
   height: 100,
   listeners: {
   specialkey: function(f, e){
   if ((e.getKey() == e.ENTER || e.getKey() == e.RETURN)) {
    //           this.doInsertAI();
   }else{
   //          f.getEl().frame();
      }
   },
  scope: this
   }   }]   }],
 buttons: [{
 text: t("(1) Create Content"),
  handler: function(){
  var frm = this.aiWindow.getComponent('ai-form').getForm();
 var askaitext = frm.findField('askai').getValue();
   if (askaitext) {
   this.aiWindow.getComponent('ai-form').getComponent('aidatalabel').update("Asking AI to create...");
var mebox = this;  // Store reference to 'this'
 Ext.Ajax.request({
  url: GO.url("core/writerai"),
  success: function (result,request,frm){
//	console.log('Got Reply Writeai reply : '+result['responseText']);
var label = mebox.aiWindow.getComponent('ai-form').getComponent('aidatalabel');
if (label && label.getEl()) {
     var decodedHtml = JSON.parse('"' + result['responseText'].replace(/"/g, '\\"') + '"');
 if (decodedHtml.startsWith('"') && decodedHtml.endsWith('"')) {
  decodedHtml = decodedHtml.slice(1, -1);
 }
label.getEl().dom.innerHTML = decodedHtml; 
} else {
//    console.log('Label not found or not rendered yet');
 }
 },
 failure: function (result,request){
 console.log('Got WriteAI Failure : '+JSON.stringify(result));
 },
 params: {askaitextvalue: askaitext}
  });
}
  },
 scope: this
  }, 
{
  text: t("(2) Insert"),
  handler: function(){
  var frm = this.aiWindow.getComponent('ai-form').getForm();
  this.doInsertAI();
 },
  scope: this
  }, {
 text: t("Cancel"),
 handler: function(){
 this.aiWindow.hide();
 },
 scope: this
 }]
 });
 }else{
this.aiWindow.getEl().frame();
 }
this.aiWindow.show();
 },
 scope: this,
 tooltip: {
 title: t("Writer AI")
 },
 overflowText: t("Writer AI")
 });
 },
 doInsertAI: function(){
 var frm = this.aiWindow.getComponent('ai-form').getForm();
 var aidata = this.aiWindow.getComponent('ai-form').getComponent('aidatalabel').getEl().dom.innerHTML;
  this.insertAI(aidata);
this.aiWindow.getComponent('ai-form').getComponent('aidatalabel').update("Ask Writer AI , to create content..like..<br> We Acknowledging Receipt of Documents  and appreciate quick email.<br> or say ... Requesting Clarification  for more details for tecnical team to understand.<br><br>&nbsp;");

  //frm.reset();
   this.aiWindow.hide();
  },
   insertAI: function(w){
   this.cmp.insertAtCursor(w);
   }
});




