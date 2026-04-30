
const productName = 'Men Running Shoes';
const metadata = {};
const name = productName.toLowerCase();
const description = String(metadata.description || '').toLowerCase();
const combined = `${name} ${description}`;
console.log('Combined:', JSON.stringify(combined));

const regex = /\b(shirts?|pants?|dress|shoes?|jackets?|coat|hat|sock|apparel|clothing|fashion|wear)\b/;
console.log('Regex test:', regex.test(combined));

const match = combined.match(regex);
console.log('Match:', match);
