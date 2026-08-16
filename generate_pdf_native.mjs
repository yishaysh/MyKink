import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const execPath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log('Using browser:', execPath);

  const htmlPath = path.resolve(__dirname, 'proposals.html');
  const targetUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

  const browserProcess = spawn(execPath, [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    targetUrl
  ]);

  // Give chrome 2.5 seconds to start up
  await new Promise(r => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://localhost:9222/json/list');
    const targets = await listRes.json();
    console.log('Targets:', targets.map(t => t.url));

    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      throw new Error('No page target found');
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = () => resolve();
      ws.onerror = err => reject(err);
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Wait for page load & network idle
    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');

    // Wait for fonts to load
    await sendCommand('Runtime.evaluate', {
      expression: 'document.fonts.ready.then(() => true)',
      awaitPromise: true
    });

    // Short stabilization delay
    await new Promise(r => setTimeout(r, 1000));

    console.log('Printing to PDF...');
    const pdfRes = await sendCommand('Page.printToPDF', {
      printBackground: true,
      preferCSSPageSize: true,
      marginTop: 0.35,
      marginBottom: 0.35,
      marginLeft: 0.45,
      marginRight: 0.45
    });

    const pdfBuffer = Buffer.from(pdfRes.data, 'base64');
    const outPdf = path.resolve(__dirname, 'MyKink_Strategic_Proposals.pdf');
    fs.writeFileSync(outPdf, pdfBuffer);

    console.log('SUCCESS! PDF written to:', outPdf, 'Size:', pdfBuffer.length, 'bytes');
    ws.close();
  } finally {
    browserProcess.kill();
  }
}

run().catch(err => {
  console.error('CDP PDF Error:', err);
  process.exit(1);
});
