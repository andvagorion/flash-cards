class Cards {

    constructor() {
        this.points = 0;

        this.container = document.querySelector('.container');
        this.idx = Math.floor(Math.random() * 1000) % Data.length;

        this.nextCard();
    }

    nextCard() {
        const cards = Util.randomCards(this.idx);
        this.idx = cards[0];
        this.showCard(...cards);
    }

    showCard(card, other1, other2) {
        this.container.innerHTML = '';

        this.addCard(card);
        this.addAnswers(card, other1, other2);
    }

    addCard(card) {
        const text = Data[card].de;
        const html = `<div class="card fade-in"><span>${text}</span></div>`;
        this.container.insertAdjacentHTML('beforeend', html);
    }

    addAnswers(a1, a2, a3) {
        const html = `<div class="answers"></div>`;
        this.container.insertAdjacentHTML('beforeend', html);
        const answersContainer = document.querySelector('.answers');

        const answers = Util.shuffle([a1, a2, a3]);
        const correctIdx = answers.indexOf(a1);

        answers.forEach(answer => {
            const text = Data[answer].en;
            const answerHtml = `<div class="answer fade-in"><span>${text}</span></div>`;
            answersContainer.insertAdjacentHTML('beforeend', answerHtml);
        });

        const elements = document.querySelectorAll('.answer');

        elements.forEach(el => el.addEventListener('mouseenter', function () { this.classList.remove('fade-in'); }, { once: true }));

        [0, 1, 2].forEach(i => {
            if (i === correctIdx) elements[i].addEventListener('click', this.correctAnswer.bind(this));
            else elements[i].addEventListener('click', this.wrongAnswer.bind(this));
        });
    }

    correctAnswer(e) {
        this.points += 1;
        const target = (e.target.tagName === 'SPAN') ? e.target.parentNode : e.target;

        document.querySelectorAll('.fade-in').forEach(el => el.classList.remove('fade-in'));

        target.classList.add('correct');
        setTimeout(() => this.hideAll(), 1000);
        setTimeout(() => this.nextCard(), 1500);
    }

    wrongAnswer(e) {
        const target = (e.target.tagName === 'SPAN') ? e.target.parentNode : e.target;

        target.classList.add('wrong');
    }

    hideAll() {
        const card = document.querySelector('.card');
        card.classList.remove('fade-in');
        card.classList.add('fade-out');
        document.querySelectorAll('.answer').forEach(el => el.classList.add('fade-out'));
    }

}