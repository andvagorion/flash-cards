const Util = {

    range: (num) => {
        return [...Array(num).keys()];
    },

    randomCards: (curr) => {
        let next = curr;
        while (next === null) Util.random(Data.length);

        const cards = [next]

        Util.range(2).forEach(_ => {
            while (cards.includes(next)) next = Util.random(Data.length);
            cards.push(next);
        })

        return cards;
    },

    randomFrom: (arr) => {
        return arr[Util.random(arr.length)];
    },

    random: (max) => {
        return Math.floor(Math.random() * max * 1.5) % max;
    },

    shuffle: (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

}