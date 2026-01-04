// tallyStorage.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = './data/10001';
const LEDGER_FILE = path.join(DATA_DIR, 'ledgers.data');
const INDEX_FILE = path.join(DATA_DIR, 'ledger.index.json');

async function ensureDataDir() {
    await fs.mkdir(DATA_DIR, { recursive: true });
}

function generateGUID() {
    return crypto.randomUUID();
}

async function loadIndex() {
    try {
        
        const data = await fs.readFile(INDEX_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return {}; // Empty index if file doesn't exist
    }
}

async function saveIndex(index) {
    await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
}

async function writeLedger(ledger) {
    await ensureDataDir();
    const index = await loadIndex();

    const guid = ledger.guid || generateGUID();
    ledger.guid = guid;
    ledger.createdAt = new Date().toISOString();

    const serialized = JSON.stringify(ledger) + '\n'; // newline-delimited JSON
    const buffer = Buffer.from(serialized, 'binary');

    const handle = await fs.open(LEDGER_FILE, 'a');
    const { size } = await handle.stat();
    await handle.write(buffer);
    await handle.close();
    
    index[guid] = { offset: size, length: buffer.length };
    await saveIndex(index);

    return guid;
}

async function readLedger(guid) {
    const index = await loadIndex();
    const entry = index[guid];
    if (!entry) throw new Error('GUID not found');

    const fd = await fs.open(LEDGER_FILE, 'r');
    const buffer = Buffer.alloc(entry.length);
    await fd.read(buffer, 0, entry.length, entry.offset);
    await fd.close();

    return JSON.parse(buffer.toString('utf8'));
}

// Example Usage:
(async () => {
    const guid = await writeLedger({ name: 'Cash', group: 'Current Assets' });
    console.log('Ledger written with GUID:', guid);

    const ledger = await readLedger(guid);
    console.log('Read ledger:', ledger);
})();
