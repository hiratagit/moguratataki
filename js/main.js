'use strict';

{
    class Square {
        constructor() {
            this.td = document.createElement('td');
            this.span1 = document.createElement('span');
            this.span1.classList.add('hole');
            this.td.appendChild(this.span1);
            this.span2 = document.createElement('span');
            this.span2.classList.add('judge');
            this.td.appendChild(this.span2);

            this.img = document.createElement('img');

            this.images = [
                'img/mogura.png',
                'img/honoka.png',
                'img/ayane.png'
            ]

            this.img.src = this.images[0];

            this.img.classList.add('target');
            this.td.appendChild(this.img);

            this.isCorrect = true;

            this.img.addEventListener('click', () => {
                this.setScore(this.isCorrect);
            });

        }

        comeOUt() {
            setTimeout(() => {
                this.img.classList.add('inview');

            }, 10);

            this.img.addEventListener('transitionend', (e) => {
                setTimeout(() => {
                    this.img.classList.remove('inview');
                }, 10)
            });
        }

        getTd() {
            return this.td;
        }

        changeImageSrc() {
            this.img.src = this.img.src = this.images[Math.floor(Math.random() * (this.images.length -1)) + 1];
            this.isCorrect = false;
        }

        setDefaultImage() {
            this.img.src = this.images[0];
            this.isCorrect = true;
        }

        changeTransitionDuration(dt = '.5s') {
            this.img.style.transitionDuration = dt;
        }

        setScore(isCorrect) {
            if(isCorrect) {
                correct += 1;
                document.getElementById('correct').textContent = correct;
                score += 10;
                this.span2.classList.add('correct');

            } else {
                wrong += 1;
                document.getElementById('wrong').textContent = wrong;
                score -= 20;
                this.span2.classList.add('wrong');
            }
            this.playSound(isCorrect);
            document.getElementById('score').textContent = score;

            this.span2.addEventListener('animationend', () => {
                this.span2.classList.remove('correct');
                this.span2.classList.remove('wrong');
            })
        }

        playSound(isCorrect) {
            let sound;
            if(isCorrect) {
                sound = document.getElementById('correctSound')
            } else {
                sound = document.getElementById('wrongSound')
            }
            sound.currentTime = 0;
            sound.play();
        }
    }

    class Board {
        constructor() {
            this.tbody = document.createElement('tbody');
            this.squares = [];
            this._setUp();
        }

        _setUp() {
            for(let j = 0; j < 3; j++) {
                const tr = document.createElement('tr');
                for(let i = 0; i < 5; i++) {
                    const square = new Square();
                    this.squares.push(square);
                    tr.appendChild(square.getTd());
                }
                this.tbody.appendChild(tr);
            }
            document.querySelector('table').appendChild(this.tbody);
        }

        getSquiresInstans() {
            return this.squares;
        }
    }

    const board = new Board();
    const squares = board.getSquiresInstans();

    let gameTimeoutId;
    let score = 0;
    let correct = 0;
    let wrong = 0;

    function randomComeOut() {

        const playProgress = remainTime / initialPlayTime; 
        if(playProgress < (1 / 2)) {
            duration = 1000;
        }

        const random = Math.floor(Math.random() * squares.length);
        const changeRate = Math.random(); 
        if(changeRate < 0.25) {
            squares[random].changeImageSrc();
        } else {
            squares[random].setDefaultImage();
        }

        if(playProgress < (3 / 5)) {
            squares[random].changeTransitionDuration();
        }
        squares[random].comeOUt();

        gameTimeoutId = setTimeout(() =>{
            randomComeOut();
        }, duration);
    }

    let isPlaying = false;
    let timerTimeoutId;
    const initialPlayTime = 30 * 1000;
    let remainTime = initialPlayTime;
    let duration = 2000;

    const timerText = document.querySelector('#timer span');

    function playTimeCount() {
        timerTimeoutId = setTimeout(() => {
            remainTime -= 50;
            const seconds = 
                String(Math.floor(remainTime / 1000)).padStart(2, '0');
            const milliSeconds = 
                String(remainTime % 1000).padStart(3, '0');
    
            timerText.textContent = `${seconds}:${milliSeconds}`;

            if(remainTime <= 0) {
                clearTimeout(timerTimeoutId);
                clearTimeout(gameTimeoutId);

                setTimeout(() => {
                    startBtn.style.display = 'none'; 
                    resetBtn.style.display = 'block';

                }, 1000);
                return;
            }
            playTimeCount();
        }, 50);
    }

    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');

    resetBtn.style.display = 'none';

    startBtn.addEventListener('click', () => {
        if(isPlaying) return;
        isPlaying = true;

        startBtn.style.background = 'grey';
        startBtn.style.opacity = '0.3';

        setTimeout(() => {
            playTimeCount();
            randomComeOut();
        }, 1000);
         
    })

}
