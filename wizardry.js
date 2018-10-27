sounds = 	[ 	[ new Audio('vibrations/flower_forward.mp3'), new Audio('vibrations/flower_reverse.mp3') ],
			 		[ new Audio('vibrations/stretch_forward.mp3'), new Audio('vibrations/stretch_reverse.mp3') ],
			 		[ new Audio('vibrations/space.mp3') ],
					[ new Audio('vibrations/projector.mp3') ],
		 			[ new Audio('vibrations/chatter.mp3') ],
		 			[ new Audio('vibrations/inflate.mp3'), new Audio('vibrations/deflate.mp3')] ],
title =				'E R R S T H E T I C  /  V O L U M E  O N E\n',
tracks =		[	'01 Strawberry Switchblade - Who Knows What Love Is.mp3',
					'02 Pebbles - Why Do I Believe.mp3',
					'03 Dee Dee Wilde - Lap of Luxury.mp3',
					'04 Dionne Warwick - Can\'t Hide Love.mp3',
					'05 The Jets - The Only Dance.mp3'	],
track =				new Audio(`mixtapes/E R R S T H E T I C/${tracks[0]}`),
items =				[ ['+'], [''], ['fisher', 'slingshoot', 'ptolemy', 'btc'], [''], ['http://steamcommunity.com/id/huh'], ['-'] ],
images =			new Array(),
menu =				false,
tapeP =				false,
trackN =			0;

sounds.forEach(s => s.forEach(v => v.volume = 0.1));
tracks.forEach(t => title += `[${t.replace('.mp3', '')}]\n`);

document.querySelectorAll('[id=nav]').forEach((p, i) => {
    let f = 'photos/framed_';
    [`${f}${p.name}_forward.gif`, `${f}${p.name}_reverse.gif`].forEach((s, n) => {
        images[i * 2 + n] = new Image();
        images[i * 2 + n].src = s;
    });
});

function pTape() { tapeP = !tapeP;
	if (tapeP) {
		document.tape.src = 'photos/framed_tape_forward.gif';
		track.volume = 0.1; track.play();
		track.onended = function() { pTape(); pTape(); };
		addHighlight(trackN + 1);
	} else {
		document.tape.src = 'photos/framed_tape.gif';
		track.pause(); track.currentTime = 0;
		trackN = trackN < tracks.length - 1 ? trackN + 1 : 0;
		track = new Audio(`mixtapes/E R R S T H E T I C/${tracks[trackN]}`);
	}
}

function addHighlight(trackN) { trackT = title.split('\n'); title = '';
	if (trackN == 1 && trackT[5].includes('>')) rmHighlight(5);
	if (trackN > 1) rmHighlight(trackN - 1);
	trackT[trackN] = `> ${trackT[trackN]} <`;
	trackT.forEach((t, i) => title += trackT[i + 1] != null ? t + '\n' : '');
	document.tape.title = title;
} function rmHighlight(trackN) { trackT[trackN] = trackT[trackN].substring(2, trackT[trackN].length - 2); }

function pSound(s) {
	if (s == 0)  { sounds[0][1].pause();sounds[0][1].currentTime=0;sounds[0][0].play(); }
	if (s == 1)  { sounds[0][0].pause();sounds[0][0].currentTime=0;sounds[0][1].play(); }
	if (s == 2)  { sounds[1][1].pause();sounds[1][1].currentTime=0;sounds[1][0].play(); }
	if (s == 3)  { sounds[1][0].pause();sounds[1][0].currentTime=0;sounds[1][1].play(); }
	if (s == 10) { sounds[5][1].pause();sounds[5][1].currentTime=0;sounds[5][0].play(); }
	if (s == 11) { sounds[5][0].pause();sounds[5][0].currentTime=0;sounds[5][1].play(); }
	if (s == 5)  { sounds[2][0].pause();sounds[2][0].currentTime=0; }
	if (s == 7)  { sounds[3][0].pause();sounds[3][0].currentTime=0; }
	if (s == 9)  { sounds[4][0].pause();sounds[4][0].currentTime=0; }
	if (s == 4)  { sounds[2][0].play(); }
	if (s == 6)  { sounds[3][0].play(); }
	if (s == 8)  { sounds[4][0].play(); }
}

function pFrame(x, y, z)	{ document.getElementsByName(document.querySelectorAll('[id=nav]')[x].name)[0].src=`photos/framed_${document.querySelectorAll('[id=nav]')[x].name}${z==1?'_forward.gif':z==2?'_reverse.gif':'.gif'}`;pSound(y); }
function sMenu(o, m)		{ document.getElementById('menu').innerHTML='';menu=!menu;let fTop=0;items[o].forEach((item,i)=>{fTop+=(i!=0&&i%3==0);document.getElementById('menu').innerHTML+=menu?(m==0?`<a style='padding:13em;' href='${item}'><img style='${i>2?`margin-top:${(400*fTop)-1000}px;`:''}' id='menu' src='${item}/logo.png'/></a>${i!=0&&i%2==0?'<br>':''}`:m==1?`<video onclick='sMenu(${item},1)' style='z-index:13;' id='video_background' autoplay><source src='movies/${item}.mp4'></video>`:m==2?`<img src='load.jpg' onload='window.location.href=${item};'/>`:''):'';});if(!track.paused)pTape();}

pTape();
