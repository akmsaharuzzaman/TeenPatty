const fs = require('fs');

const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const suits = ['H', 'D', 'C', 'S'];

const cards = [];
let cardRankIndex = 1;

// Helper to get next rank index (for sequences)
function getNextRanks(start, count = 3) {
    const startIndex = ranks.indexOf(start);
    return ranks.slice(startIndex, startIndex + count);
}

// Generate 52 Trail hands
function generateTrail() {
    ranks.forEach(rank => {
        // Generate all combinations of 3 suits out of 4
        let combos = [
            [suits[0], suits[1], suits[2]],
            [suits[0], suits[1], suits[3]],
            [suits[0], suits[2], suits[3]],
            [suits[1], suits[2], suits[3]],
        ];
        combos.forEach(suitCombo => {
            cards.push({
                cardA: `${rank}${suitCombo[0]}`,
                cardB: `${rank}${suitCombo[1]}`,
                cardC: `${rank}${suitCombo[2]}`,
                rank: cardRankIndex++,
                hand: "Trail"
            });
        });
    });
}

// Generate 52 Pure Sequences (same suit, sequential)
function generatePureSequence() {
    suits.forEach(suit => {
        for (let i = 0; i <= ranks.length - 3; i++) {
            const [a, b, c] = [ranks[i], ranks[i + 1], ranks[i + 2]];
            cards.push({
                cardA: `${a}${suit}`,
                cardB: `${b}${suit}`,
                cardC: `${c}${suit}`,
                rank: cardRankIndex++,
                hand: "Pure Sequence"
            });
        }
    });
}

// Generate 52 Sequences (different suits, same order)
function generateSequence() {
    const seqCombos = [];
    for (let i = 0; i <= ranks.length - 3; i++) {
        seqCombos.push([ranks[i], ranks[i + 1], ranks[i + 2]]);
    }
    seqCombos.forEach(seq => {
        for (let i = 0; i < suits.length; i++) {
            const [a, b, c] = seq;
            cards.push({
                cardA: `${a}${suits[(i + 0) % 4]}`,
                cardB: `${b}${suits[(i + 1) % 4]}`,
                cardC: `${c}${suits[(i + 2) % 4]}`,
                rank: cardRankIndex++,
                hand: "Sequence"
            });
        }
    });
}

// Generate 52 Color (same suit, non-sequential)
function generateColor() {
    const nonSeqCombos = [
        ['A', 'K', 'J'], ['A', 'K', '10'], ['K', 'J', '9'], ['Q', '10', '8'],
        ['J', '9', '7'], ['10', '8', '6'], ['9', '7', '5'], ['8', '6', '4'],
        ['7', '5', '3'], ['6', '4', '2'], ['5', '3', '2'], ['A', '9', '6'],
        ['K', '8', '5'], ['Q', '7', '4']
    ];
    while (nonSeqCombos.length < 52) {
        const [a, b, c] = ranks
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        if (!nonSeqCombos.some(e => e.includes(a) && e.includes(b) && e.includes(c))) {
            nonSeqCombos.push([a, b, c]);
        }
    }

    nonSeqCombos.slice(0, 52).forEach(combo => {
        const suit = suits[cardRankIndex % 4];
        cards.push({
            cardA: `${combo[0]}${suit}`,
            cardB: `${combo[1]}${suit}`,
            cardC: `${combo[2]}${suit}`,
            rank: cardRankIndex++,
            hand: "Color"
        });
    });
}

// Generate 52 Pair (2 same rank, 1 different)
function generatePairs() {
    const pairCombos = [];
    ranks.forEach(pairRank => {
        ranks.forEach(kicker => {
            if (pairRank !== kicker && pairCombos.length < 52) {
                pairCombos.push([pairRank, pairRank, kicker]);
            }
        });
    });

    pairCombos.forEach(combo => {
        cards.push({
            cardA: `${combo[0]}${suits[0]}`,
            cardB: `${combo[1]}${suits[1]}`,
            cardC: `${combo[2]}${suits[2]}`,
            rank: cardRankIndex++,
            hand: "Pair"
        });
    });
}

// Generate 52 High Cards (all different ranks & suits)
function generateHighCards() {
    const highCombos = [];
    for (let i = 0; i < ranks.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
            for (let k = 0; k < ranks.length; k++) {
                const set = new Set([ranks[i], ranks[j], ranks[k]]);
                if (set.size === 3) {
                    const sorted = [...set].sort();
                    const key = sorted.join(',');
                    if (!highCombos.some(c => c.key === key) && highCombos.length < 52) {
                        highCombos.push({ key, combo: [...set] });
                    }
                }
            }
        }
    }

    highCombos.forEach(({ combo }) => {
        cards.push({
            cardA: `${combo[0]}${suits[0]}`,
            cardB: `${combo[1]}${suits[1]}`,
            cardC: `${combo[2]}${suits[2]}`,
            rank: cardRankIndex++,
            hand: "High Card"
        });
    });
}
function GenarateCards() {
    // Run all generators
    generateTrail();
    generatePureSequence();
    generateSequence();
    generateColor();
    generatePairs();
    generateHighCards();

    //  fs.writeFileSync('data.json', JSON.stringify(cards));
    console.log("Total Card:", cards.length, "Genarated");
}

function GetRandomCards(givenCardCount) {
    if (cards.length === 0) {
        console.error("Card list is empty. Run GenarateCards() first.");
        return [];
    }

    if (givenCardCount > cards.length) {
        console.error("Not enough cards to return the requested count.");
        return [];
    }
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, givenCardCount);
}


exports.GetRandomCards = GetRandomCards;
exports.GenarateCards = GenarateCards;