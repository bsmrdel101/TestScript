import './style.css';
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

const template = 'var num1 = 5;\nvar num2 = 10;\nprint num1 + (num2 - 5) * 8;';

const editor = new EditorView({
  doc: template,
  extensions: [basicSetup, javascript()],
  parent: document.body
});

document.getElementById('app')!.appendChild(editor.dom);
