import './style.css';
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { lexer } from './scripts/lexer';
import { macros } from './scripts/addMacro';
import { interpreter } from './scripts/interpreter';

const template = 'params: target, roll;\n$onAtk:dealtByPlayer;\n\nvar num1 = 5;\nvar num2 = 10 + num1;\n\nprint num1 + (num2 - 5) * 8;\nprint "Hello World";\n\nif (num1 > 10) {\n  print "true";\n} else {\n  print "false";\n}';

const editor = new EditorView({
  doc: template,
  extensions: [basicSetup, javascript()],
  parent: document.body
});

document.getElementById('app')!.appendChild(editor.dom);
document.getElementById('app')!.insertAdjacentHTML('beforeend', `
  <button id="save-btn" class="save-btn">Save</button>
  <button id="run-btn" class="run-btn">Run</button>
`);


document.getElementById('save-btn')!.addEventListener('click', () => {
  const code = editor.state.doc.toString();
  lexer(code);
});

// Instead of a run button, it would be an event that happens to check if any macro has a trigger that matches it.
// Such as making an attack
document.getElementById('run-btn')!.addEventListener('click', () => {
  macros.forEach((macro: Program) => {
    console.log('===========');
    if (macro.trigger) interpreter(macro);
  });
});
