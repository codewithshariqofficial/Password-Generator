const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const lengthValEl = document.getElementById('length-val');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');
const strengthBarEl = document.getElementById('strength-bar');
const strengthTextEl = document.getElementById('strength-text');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Update length display
lengthEl.addEventListener('input', () => {
    lengthValEl.innerText = lengthEl.value;
    updateStrength();
});

// Sync checkboxes with strength meter
[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(el => {
    el.addEventListener('change', updateStrength);
});

clipboardEl.addEventListener('click', () => {
    const password = resultEl.innerText;
    if (!password || password === 'P4$$w0rd!') return;

    navigator.clipboard.writeText(password).then(() => {
        alert('Password copied to clipboard!');
    });
});

generateEl.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    updateStrength();
});

function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        return '';
    }

    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }

    const finalPassword = generatedPassword.slice(0, length);
    
    // Shuffle the password for better randomness
    return shuffleString(finalPassword);
}

// Cryptographically secure random values
function getSecureRandomByte() {
    const array = new Uint8Array(1);
    window.crypto.getRandomValues(array);
    return array[0];
}

function getRandomLower() {
    return String.fromCharCode((getSecureRandomByte() % 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode((getSecureRandomByte() % 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode((getSecureRandomByte() % 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[getSecureRandomByte() % symbols.length];
}

function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = getSecureRandomByte() % (i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function updateStrength() {
    const length = +lengthEl.value;
    const typesCount = uppercaseEl.checked + lowercaseEl.checked + numbersEl.checked + symbolsEl.checked;
    
    strengthBarEl.className = 'strength-bar';
    
    if (length < 8 || typesCount < 2) {
        strengthBarEl.classList.add('weak');
        strengthTextEl.innerText = 'Strength: Weak';
    } else if (length < 12 || typesCount < 3) {
        strengthBarEl.classList.add('medium');
        strengthTextEl.innerText = 'Strength: Medium';
    } else {
        strengthBarEl.classList.add('strong');
        strengthTextEl.innerText = 'Strength: Strong';
    }
}

// Initialize strength meter
updateStrength();
