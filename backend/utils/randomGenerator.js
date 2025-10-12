const crypto = require('crypto');

const adjectives = ['amazing', 'beautiful', 'creative', 'dynamic', 'elegant', 'fantastic', 'gorgeous', 'incredible', 'lovely', 'magnificent'];
const nouns = ['sunset', 'mountain', 'ocean', 'forest', 'sky', 'river', 'valley', 'landscape', 'horizon', 'paradise'];

const generateRandomName = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}-${noun}-${num}`;
};

const generateRandomDescription = () => {
    return `A wonderful image captured at ${new Date().toLocaleDateString()}`;
};

const generateRandomUrl = () => {
    return crypto.randomBytes(8).toString('hex');
};

module.exports = {
    generateRandomName,
    generateRandomDescription,
    generateRandomUrl
};
