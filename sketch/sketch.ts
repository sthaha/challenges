const primes = [
     2,     3,     5,     7,    11,    13,    17,    19,    23,    29,
     31,    37,    41,    43,    47,    53,    59,    61,    67,    71,
     73,    79,    83,    89,    97,   101,   103,   107,   109,   113,
    127,   131,   137,   139,   149,   151,   157,   163,   167,   173,
    179,   181,   191,   193,   197,   199,   211,   223,   227,   229,
    233,   239,   241,   251,   257,   263,   269,   271,   277,   281,
    283,   293,   307,   311,   313,   317,   331,   337,   347,   349,
    353,   359,   367,   373,   379,   383,   389,   397,   401,   409,
    419,   421,   431,   433,   439,   443,   449,   457,   461,   463,
    467,   479,   487,   491,   499,   503,   509,   521,   523,   541,
    547,   557,   563,   569,   571,   577,   587,   593,   599,   601,
    607,   613,   617,   619,   631,   641,   643,   647,   653,   659,
    661,   673,   677,   683,   691,   701,   709,   719,   727,   733,
    739,   743,   751,   757,   761,   769,   773,   787,   797,   809,
    811,   821,   823,   827,   829,   839,   853,   857,   859,   863,
    877,   881,   883,   887,   907,   911,   919,   929,   937,   941,
    947,   953,   967,   971,   977,   983,   991,   997,  1009,  1013
]
const sketch = (p : p5) =>  {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.angleMode(p.RADIANS)
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    p.background(0)
    p.translate(p.width/2, p.height/2)

    p.stroke(150, 150, 180, 100)
    p.fill(150, 150, 180, 100)
    for (let i = 0; i < 1024; i++) {
      const x = p.cos(i) * i
      const y = p.sin(i) * i
      p.ellipse(x,y,8,8)
    }

    p.stroke(255, 122, 122, 100)
    p.fill(255, 122, 122, 100)
    for (let prime of primes) {
      const x = p.cos(prime) * prime
      const y = p.sin(prime) * prime
      p.ellipse(x,y,8,8)
    }
  }
}

new p5(sketch)
