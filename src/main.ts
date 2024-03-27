import './style.css';
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { lexer } from './scripts/lexer';

const template = 'params: target, roll;\n<onAtk:dealtByPlayer>\n\nvar num1 = 5;\nvar num2 = 10;\nprint num1 + (num2 - 5) * 8;';

const editor = new EditorView({
  doc: template,
  extensions: [basicSetup, javascript()],
  parent: document.body
});

document.getElementById('app')!.appendChild(editor.dom);
document.getElementById('app')!.insertAdjacentHTML('beforeend', `
  <button id="run-btn" class="run-btn">Run</button>
`);


document.getElementById('run-btn')!.addEventListener('click', () => {
  const code = editor.state.doc.toString();
  lexer(code);
});
